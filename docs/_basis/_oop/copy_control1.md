### 1. 拷贝

#### (1). 拷贝构造函数

-   拷贝构造函数可以视为单参构造函数的一种特例 (或原始设计意图)，可以显式调用也可隐式调用，由于其本身就是为隐式调用而存在，几乎没有 `explicit` 的情况
-   拷贝构造函数的参数必须是引用类型 (通常加 `const`)。否则，为了调用拷贝 ctor 需要拷贝实参，而拷贝实参又需要调用拷贝 ctor
-   若未定义拷贝构造函数，编译器会默认定义一个合成版本
    -   默认行为是将所有非 `static` 成员拷贝到新对象中，对于类对象会调用其拷贝 ctor，对于数组会拷贝每一个单元

```cpp
class Book {
    string name;
    int nPages;
public:
    // 和合成的拷贝构造函数逻辑等价
    Book(const Book& book) : name(book.name), nPages(book.nPages) { }
};
```

#### (2). 赋值 (拷贝) 运算符

类需要控制其对象如何赋值

-   赋值运算符必须在类内重载，为实现右向左的连续赋值，返回值是自身引用 `Obj& o = *this;`
-   如果类未定义赋值运算符，编译器会定义一个合成版本，默认行为是将右侧运算对象的非 static 成员赋值给左侧对象的成员

```cpp
Book& operator=(const Book& book) {
    name = book.name;
    nPages = book.nPages;
}
```

#### (3). 阻止拷贝

即使不定义拷贝控制成员，编译器仍会自动生成，禁止拷贝需要 `=delete` 显式声明

-   `=delete` 可以对任何函数声明，通知编译器不希望定义这些成员
-   如果对析构函数声明 `=delete`，由于无法析构，该对象只能由 `new` 创建，且不能被 `delete`
-   旧的标准实现阻止拷贝的方式是声明 `private`

如果一个类有成员无法被默认构造、拷贝、赋值或销毁，对应 合成函数 是 `=delete` 的

-   如果 类某成员的析构函数是删除的或不可访问的 / 类有一个无类内初始值的引用成员 / 类有一个无类内初始值且无默认 ctor 的 const 成员，那么该类的合成构造函数被定义为删除的
-   如果 类某成员的赋值运算符是删除的或不可访问的 / 类有引用成员 / 类有 const 成员，那么该类的合成赋值运算符被定义为删除的
-   如果 类某成员的拷贝构造函数是删除的或不可访问的 / 类某成员的析构函数是删除的或不可访问的，那么该类的合成拷贝 ctor 被定义为删除的

(?-p451)

### 2. 析构

对于析构函数:

-   析构函数首先执行函数体，然后隐式地按初始化的逆序销毁成员，函数体内通常释放对象在生存期内分配的所有资源
-   析构函数没有参数，无法被重载，只能有一个
-   若未定义析构函数，编译器会默认定义一个合成版本，其函数体为空

对象被销毁时会调用析构函数

-   变量在离开作用域时被销毁
-   当一个对象被销毁，其成员被销毁
-   容器 (标准库容器 & 数组) 被销毁时，元素被销毁
-   动态分配的对象，对引用它的指针 `delete` 时被销毁
-   对于临时对象，创建它的完整表达式结束时被销毁

### 3. 移动

假设需要拷贝一个临时对象，随后舍弃临时对象。如果调用拷贝函数，拷贝临时对象中的资源会造成一定浪费，更好的方法是接管临时对象的资源，右值引用就是为移动语义创造的一种标记。

#### (1). 右值引用

和左值引用相反，右值引用只能绑定到右值上，右值寓义短暂

```cpp
int i = 42, &r = i;
int &&rr = i * 42;
```

右值引用绑定左值，需要 `<utility>` 中的 `move` 函数

```cpp
int &&rr = std::move(r);
```

#### (2). 移动构造函数

-   移动构造函数需要完成: 接管资源，以移后源被销毁为前提，考虑对象的析构函数有效 (以及如果其他成员函数会被调用的有效性)
-   若传入右值且未定义移动 ctor，也会调用拷贝 ctor (合理)
-   当一个类没有定义任何拷贝控制成员 (3 个)，且每个非 static 成员都可移动，编译器才会合成移动 ctor、移动赋值

```cpp
Book(Book &&book) noexcept : rsc(book.rsc) {
    book.rsc = nullptr;
}
```

??? hint "移动、标准库容器和异常"

    `vector` 需要保证 `push_back` 发生异常时保持不变。考虑 `vector` 的 reallocate 过程可能的情况:

    -   若使用拷贝构造函数，旧元素始终保持不变，若发生异常则交由用户处理
    -   若使用移动构造函数，在还未移动完时发生异常就会产生问题

    因此，要想让 `vector` 使用移动操作，定义移动 ctor 的同时还要声明 `noexcept`

#### (3). 移动赋值运算符

需要额外考虑自赋值

```cpp
Book& operator(Book &&book) noexcept {
    if (this != &book) {
        ...
    }
    return *this;
}
```

### 4. 三/五法则

#### 需要析构函数的类也需要拷贝和赋值操作

通常对于析构函数的需求更加明显，而要是需要析构函数，几乎一定会需要拷贝和赋值。

```cpp
class HasPtr {
    string *ps; int i;
    public:
        HasPtr(const string &s = string()) : ps(new string(s)), i(0) {}
        ~HasPtr() {  delete ps;  }
}
```

默认的拷贝行为会拷贝指针，在析构时可能会 `delete` 同一指针多次，这是 undefined 的。

#### 需要拷贝也需要赋值，反之亦然

举例，需要设计一个类，每个对象有个唯一 id

-   拷贝时，由于构造新对象，需要调整 id
-   赋值时，由于对象不同，要避免 id 被复制

### 例: 设计 `HasPtr`

设计类的时候，确定需要析构函数后，往往需要考虑它的拷贝语义:

-   类的行为像值，有自己的状态，副本和原对象独立
-   类的行为像指针，共享底层数据

#### (1). 行为像值的类

<font class="u_1">

-   copy ctor: 拷贝 `string` 的值
-   dtor: 释放 `string`
-   op=: 释放当前 `string`，从右侧对象拷贝 `string`

</font>

??? adcodes "example: like a value"

    ```cpp
    class HasPtr {
        private:
            string *ps;
            int i;
        public:
            HasPtr(const string &s = string()) : ps(new string(s)), i(0) { }
            HasPtr(const HasPtr &hp) : ps(new string(*hp.ps)), i(hp.i) { }
            HasPtr &operator=(const HasPtr &hp) {
                auto newp = new string(*hp.ps);
                delete ps;
                ps = newp;
                i = hp.i;
                return *this;
            }
            ~HasPtr() {  delete ps;  }
    };
    ```

需要额外注意赋值运算符拷贝自身的情况，如果直接释放了 `ps` 就会出错

#### (2). 行为像指针的类

<font class="u_1">

-   ctor 初始化类，创建新的引用计数
-   copy ctor 递增计数器，拷贝成员
-   dtor 递减计数器，如果减为 0 则释放资源
-   eq= 递增右侧对象计数器，递减左侧计数器，并判断左侧是否需要销毁

</font>

??? adcodes "example: like a ptr"

    ```cpp
    class HasPtr {
        private:
            string *ps;
            int i;
            size_t *use;
        public:
            HasPtr(const string &s = string()) : ps(new string(s)), i(0), use(new size_t(1)) { }
            HasPtr(const HasPtr &hp) : ps(hp.ps), i(hp.i), use(hp.use) {  ++*use; }
            HasPtr &operator=(const HasPtr &hp) {
                ++*hp.use;
                if (--*use == 0) {
                    delete ps;
                    delete use;
                }
                this->use = hp.use;
                this->ps = hp.ps;
                this->i = hp.i;
                return *this;
            }
            ~HasPtr() {
                if (--*use == 0) {
                    delete ps;
                    delete use;
                }
            }
    };
    ```

### 例: 设计 Message

`Message` 可以出现在多个 `Folder` 中，`Folder` 也可以包含多个 `Message`，二者各维护一个指针数组

-   拷贝: 拷贝 `Message` 的消息内容，且两个消息出现在相同的 `Folder` 中
-   析构: 确保没有 `Folder` 保存被销毁的 `Message` 指针
-   移动: 注意 `msg->folders.clear()`

```cpp
class Message {
    friend class Folder;
private:
    std::string contents;
    std::set<Folder *> folders;

    void moveFolders(Message *msg) {
        folders = std::move(msg.folders); // 使用 set 的移动赋值运算符
        for (auto f : folders) {
            f.rmvMsg(msg);
            f.addMsg(this);
        }
        msg->folders.clear();  // 考虑 ~Message(), 确保销毁 msg 是无害的
    }

public:
    Message(const Message &msg) :
        contents(msg.contents), folders(msg.folders) {
        for (auto f : msg.folders)
            f->addMsg(this);
    }

    Message(Message &&msg) : contents(std::move(msg.contents)) {
        moveFolders(&msg);
    }

    ~Message() {
        for (auto f : folders)
            f.rmvMsg(this);
    }

    Message& operator=(const Message &msg) {
        for (auto f : folders)
            f.rmvMsg(this);
        contents = msg.contents;
        folders = msg.folders;
        for (auto f : folders)
            f.addMsg(this);
        return *this;
    }

    Message& operator=(Message &&msg) {
        if (this != &msg) {
            for (auto f : folders)
                f.rmvMsg(this);
            contents = std::move(contents);
            moveFolders(&msg);
        }
        return *this;
    }

    void save(Folder &f) {
        folders.insert(&f);
        f.addMsg(this);
    }

    void remove(Folder &f) {
        folders.erase(&f);
        f.rmvMsg(this);
    }
};
```

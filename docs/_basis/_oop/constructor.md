### 1. 构造函数初值表

```cpp
Ctor(param1, ...) : member1 (param2), member2(expr) { ... }
```

C++ 类成员的初始化逻辑:

-   首先，根据在类内出现的次序确定成员顺序
-   每个成员按照 「initializer list => 类内值 => 默认初始化」的次序，找到初始化的机会后 break

进入构造函数体后，就结束了初始化进入赋值的过程。initializer list 的一部分意义在于

-   是 const 类型、引用类型、没有默认构造函数的类型 通过参数初始化的唯一机会
-   某些类涉及初始化和赋值的底层效率问题

### 2. 默认构造函数

对于类对象，语句 `Obj obj;` 或 `new Obj();` 会执行对象的默认构造函数 (无参数的构造函数) 完成默认初始化。如果类中一个构造函数都没有，编译器会生成一个「合成的 (synthesized) 默认构造函数」，其初始化行为:

<font class="u_nn_u1%20">

-   1 . 如果存在类内值，则用类内值初始化成员
-   2 . 否则，执行相应成员的默认初始化

</font>

如果类中存在其他有参构造函数，还想要一个和 「合成的默认构造函数」相同功能的构造函数，C++11 引入了 `=default`

```cpp
class A {    A() = default;    };
```

并不推荐这样做，例如数组和指针的默认初始化值是 undefined.

### 3. 转换构造函数

如果构造函数只有一个形参，那么它为这个类定义了一个隐式转换机制。

```cpp
class Book {
    public:
        Book(string s) { cout << "inited" << endl; }
};

void read(Book book) { cout << "reading" << endl; }

int main() {
    read(string("Eat"));          // case1
    Book book = string("Sleep");  // case2
}
```

这种转换只支持一步转换，不期望时可以通过 `explicit` 抑制。但要注意，抑制后就不能通过拷贝形式的初始化了

```cpp
explicit Book(string s) { ... }
```

标准库中的转换构造函数:

-   单参数 `const char*` 的 `string`，不是 explicit 的
-   单容量参数的 `vector`，是 explicit 的

### 4. 委托构造函数

把自己的一部分职责委托给其他构造函数。

```cpp
struct A {
    char a, b;
    A(char i, char j) : a(i), b(j) { }
    A(string s) : A(s[0], s[1]) { }
};
```

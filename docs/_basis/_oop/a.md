### 1. 继承

继承，派生类复用基类的成员与方法。

#### (1). 派生类构造函数

派生类的构造函数必须遵循:

-   先调用基类的构造器，再初始化自己的部分

C++ 中在初始表处调用基类的 ctor 即可，如果没调用就对基类成员执行默认初始化。

??? hint "cpp impl"

    ```cpp
    class Book {
        std::string isbn;
    public:
        Book(const std::string& isbn) : isbn(isbn) { }
    };

    class Fiction : public Book {
        int price;
    public:
        Fiction(const std::string& isbn, int price) : Book(isbn), price(price) { } // 顺序不同也行
    }
    ```

### 2. 继承中的类作用域

#### (1). 编译时: 名字查找

形如 `obj.xxname()` 需要在编译时确定 变量名/函数名 在哪个子对象中，此即名字查找的过程

-   首先，派生对象的各个子对象尽管空间上类似线性排列，但派生类中可以访问基类的东西，类作用域是按继承链顺序的嵌套的
-   从变量的 <u style="text-decoration-style:wavy">静态类型</u> 出发，向外层作用域寻找该名字的定义在哪
-   找到后，如果是函数名，还会进行类型检查 (不通过就报错)

最后，如果 `name` 是函数名，且 `obj` 是引用/指针、该函数是虚函数，运行时还会进行动态绑定。

??? hint "e.g. 名字冲突时，使用作用域运算符访问隐藏成员"

    ```cpp
    struct Base {
        int mem = 0;
    };

    struct Derived : Base {
        int mem = 100;
        int getMem() { return Base::mem; }
    };
    ```

#### (2). 函数重载与名字查找

先名字查找再类型检查，可能使继承中的函数重载不符合预期。

??? hint "e.g.1 &ensp;派生类想增加一个新重载"

    派生类增加新重载使对 `f` 的查找卡在 `derived`，造成类型检查错误

    ```cpp
    struct Base {
        void f(int) { cout << "Base 1xint" << endl;}
    };

    struct Derived : public Base {
        void f(int, int, int) { cout << "Derived 3xint" << endl; }
    };

    int main {
        Derived d;
        d.f(1); // error
    }
    ```

??? hint "e.g.2 &ensp; 派生类只想重写一部分父类的重载函数"

    派生对象要想访问父对象的全部重载函数

    - 要么一个也不重写，名字查找过程会自动到父类的作用域
    - 要么全部重写

    而只想重写一部分就会导致另一部分无法访问。

    ```cpp
    struct Base {
        virtual f(int) { cout << "Base 1xint" << endl; }
        virtual f(int, int) { cout << "Base 2xint" << endl; }
    };

    struct Derived : public Base {
        virtual f(int, int) { cout << "Derived 2xint" << endl; }
    };

    int main {
        Derived d;
        d.f(1); // error
    }
    ```

在 `Derived` 中声明一个 `using Base::f;`，类型不匹配的函数会转而访问这个 `using` 声明点。

### 1. 值类别

C++ 的表达式有两个维度的属性

-   类型 (type): &ensp; 如 `int` (普通类型) `int*`、`int&`、`int&&` (复合类型)
-   值类别 (value category): &ensp; 左值 (lvalue)、将亡值 (eXpiring, xvalue)、纯右值 (prvalue)

值类别具体展开为

-   左值: 可以取地址的具名变量
    -   变量名，函数名，数据成员如 `std::cin` 等
    -   `++i` 是左值，`i++` 是右值
-   亡值: 拥有身份且可以移动
    -   返回对象为对象的右值引用的函数调用 (或重载运算符)，如 `std::move(x)`
    -   转换为对象的右值引用的转型表达式，如 `static_cast(x)`
-   纯右值
    -   字面量，`this` 指针，lambda 表达式
    -   内建数值运算表达式，如 `a+b`，`a%b` 等

判断维度:

-   拥有身份: &ensp; 通过某个名字判断表达式之间是否指代同一实体
-   可被移动: &ensp; 右值引用类型的形参可以绑定于这个表达式

&emsp; <img src="../img/value_category.png" width=520>

这样分类是为了引用的绑: 让 xvalue & prvalue 在函数重载中优先绑定右值引用，其次寻找常左值引用，从而正确发挥移动语义的作用

??? caution "右值引用的绑定"

    ```cpp
    void foo(int &)  { std::cout << "lvalue" << std::endl; }
    void foo(int &&) { std::cout << "rvalue" << std::endl; }

    int main() {
        int &&rref = 1;
        foo(rref);    // output: lvalue
    }
    ```

    `rref`: &ensp;类型是右值引用，值类别是左值，绑定到一个右值 `1`

### 2. 移动语义

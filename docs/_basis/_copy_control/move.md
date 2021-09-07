### 1. 值类别

C++ 的表达式有两个维度的属性

-   类型 (type): &ensp; 如 `int` (普通类型) `int*`、`int&`、`int&&` (复合类型)
-   值类别 (value category): &ensp; 左值 (lvalue)、将亡值 (eXpiring, xvalue)、纯右值 (prvalue)

值类别具体展开为

-   左值: 可以取地址的具名变量
    -   变量名，函数名，数据成员如 `std::cin` 等
    -   `++i` 是左值，`i++` 是右值
-   亡值:
    -   返回对象为对象的右值引用的函数调用 (或重载运算符)，如 `std::move(x)`
    -   转换为对象的右值引用的转型表达式，如 `static_cast(x)`

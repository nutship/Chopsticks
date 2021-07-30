### 1. 类型别名

C++11 引入 `using`，相较于 `typedef`，其使用更直观，而且可用于模板别名。

!!! caution "`typedef` 与 `const`"

    ```cpp
    typedef char *pstring;
    const pstring cstr = 0;
    ```
    上述代码不是 `const char *cstr` (指向常量的指针)，由于 `*` 从声明符转入类型符，`cstr` 是一个指针常量

### 2. `auto`

`auto` 由 C++11 引入，由变量的初值推断变量的类型 (因此必须被初始化)。

-   当引用被用作初值，被引用的对象的类型作为 `auto` 的类型 (仅限 `auto` 不加 `&`)
-   `auto` 忽略顶层 const，保留底层 const (符合直觉)

```cpp
const int num = 2;
const int &ref = num;
auto a1 = ref;
a1 = 2; // 正确: a1 的类型是 num 的类型且忽略顶层 const，相当于 int a1 = num; a1 = 2;
auto& a2 = ref;
a2 = 2; // 错误: a2 的类型首先是个引用，引用的赋值保留底层 const
```

-   `auto` 同一行类型相同，例如 `auto sz = 0, pi = 3.14` 是错的

### 3. `decltype`

有时希望推断表达式的类型，而不希望用该表达式赋值，可以使用 C++11 引入的 `decltype`

```cpp
// 1.
const int ci = 0, &cj = ci;
decltype(ci) x = 0; // x: const int
decltype(cj) y = x; // y: const int&, must be inited
// 2.
int i = 42, *p = &i, &r = i;
decltype(r + 0) b;
// 3.
decltype(*p) c; // ERROR: c is int&
// 4.
decltype(i) d;   // d is int
decltype((i)) e; // ERROR: e is int&
```

-   1 . 如果 decltype 使用的表达式是单变量，会保留顶层 const 和引用的性质；
-   2 . `r + 0` 的结果是一个 int，因此 b 是一个 int；
-   3 . 如果 decltype 的表达式是一个解引用操作，则获得的是引用类型，(`*p` 本身就是一个引用)；
-   4 . 加上括号的变量被当做表达式处理，这里返回一个引用 (?)

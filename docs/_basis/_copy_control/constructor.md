### 1. 构造函数初值表

```cpp
Ctor(param1, ...) : member1 (param2), member2(expr) { ... }
```

C++ 类成员的初始化逻辑:

-   首先，根据在类内出现的次序确定成员顺序
-   每个成员按照 「initializer list => 类内值 => 默认初始化」的次序，找到初始化的机会后 break

进入构造函数体后，就结束了初始化进入赋值的过程。initializer list 的一部分意义在于

-   是 const 类型、引用类型、?没有默认构造函数的类型? 通过参数初始化的唯一机会
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

### 3. 单参构造函数

单参构造函数的初始化形式 (假设 `class A` 有 ctor `A(A& a) { }`)

-   显式: 直接初始化，形如 `A a2(a);` 或 `A a2 = A(a)`、`A *a2 = new A(a)` 等
-   隐式: 由等号初始化，形如 `A a3 = a2` (以及函数传参、返回值等情况)，类型相同时调用拷贝 ctor，类型不同调用相应的 ctor

隐式类型转换也就是形参和本类型不同的隐式初始化

```cpp
class Book {
    public:
        Book(string s) { cout << "inited" << endl; }
};

void read(Book book) { cout << "reading" << endl; }

int main() {
    Book book(string("Org"));     // 显式直接调用
    read(string("Eat"));          // 隐式调用 case2
    Book book = string("Sleep");  // 隐式调用 case1
}
```

`explicit` 可以抑制隐式调用，i.e. 限制某种类型出现在等号右侧

```cpp
explicit Book(string s) { ... }
```

标准库中的转换构造函数:

-   单参数 `const char*` 的 `string`，不是 explicit 的
-   单容量参数的 `vector`，是 explicit 的

编写单参构造函数时，需要考虑是否有拷贝的语义

### 4. 委托构造函数

把自己的一部分职责委托给其他构造函数。

```cpp
struct A {
    char a, b;
    A(char i, char j) : a(i), b(j) { }
    A(string s) : A(s[0], s[1]) { }
};
```

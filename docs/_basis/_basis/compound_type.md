### 1. 指针和引用

复合类型指基于其他类型定义的类型，包括指针和引用。

#### (1). 指针

`void*` 是特殊类型的指针，只有内存地址的信息，访问具体的类型则需转换。(C++ 不允许从 `void*` 隐式转换为其他类型)

```cpp
// three ways to generate empty pointer in C++
int *p1 = nullptr;
int *p2 = 0;
int *p3 = NULL;
```

关于 C++11 的 `nullptr`：

-   C 中的定义为 `#define NULL ((void*) 0)`，C++ 的 cstdlib 出于强类型定义为 `#define NULL 0`
-   `nullptr` 可以自动转换为任意的指针类型，而 `NULL` 既是数字又是指针，重载时会造成歧义

#### (2). 引用

引用是对指针的包装，提供一种「变量别名」的抽象。

-   对引用的赋值和访问，相当于对原对象的赋值和访问，而不是对绑定关系的修改
-   引用只能与对象绑定，不能是字面值或表达式
-   引用必须被初始化，且初始化后绑定关闭无法修改，对引用生成引用相当于引用原对象

### 2. 限定符 `const`

#### (1). `const` 与引用

-   const + 引用的含义是原对象的值不可通过此引用修改，因此:
    -   const 引用可以绑定非 const 的对象
    -   普通引用不能绑定 const 对象
-   const 引用可以 绑定常量、绑定表达式、绑定跨类型的变量 (编译器生成临时量)

```cpp
double dval = 3.14;               const int temp = dval;
const int& ri = dval;    ====>    const int &ri = temp;
```

#### (2). `const` 与指针

-   `*` 在 `const` 后: 是个指针且指向常量，限定不能通过这个指针修改指向的常量
-   `*` 在 `const` 前: 是个常量，还是个指针

#### (3). 顶层 `const`

根据 `const` 限定部分的不同:

-   顶层 const: &ensp; 变量本身是常量，例如普通常量、指针常量
-   底层 const: &ensp; 变量指向的对象是常量，例如 const 引用、指向常量的指针

某个对象被拷贝时，顶层 const 没什么问题，但底层 const 的性质必须被保持

```cpp
const int con = 1;  int nor = 2;
int *norPtr = &nor;
const int * lowPtr = &nor;  int * const topPtr = &nor;
int& norRef = nor;  const int & lowRef = con;

const int * test1 = &nor (√) | &con (x) | lowPtr (√) | topPtr (x) ;
const int & test2 = con; (√) | nor  (√) | lowRef (√) | norRef (x) ;
int& test3 = lowRef (x) | con (x) ;
```

总之就是左侧和右侧的值关于底层 const 的性质协调。

#### (4). `const_cast`

`const_cast` 可以去掉对象的底层 `const` 属性。

```cpp
const char *pc;
char *p = const_cast<char*>(pc);
```

如果 `pc` 指向的原对象是 const 的，通过 `p` 修改的行为是 undefined 的。`const_cast` 可用于:

-   指针或引用拥有底层 const 属性而原对象非 const，又不得不修改原对象的情况。
-   在函数重载的情况下最有用 (CppPrimer P209)

```cpp
const string &shorterString(const string &s1, const string &s2) { // func1
    return s1.size() <= s2.size() ? s1 : s2;
}

const string &shorterString(string &s1, string &s2) { // func2
    auto &r = shorterString(const_cast<const string&>(s1),
                            const_cast<const string&>(s2));
    return const_cast<string&> r;
}
```

这个例子需要传入 const 返回 const，而传入非 const 也要返回非 const:

-   函数 1 在传入非 const 的 string 后，返回的依然是 `const string&`
-   底层 const 参数可重载为不同函数，函数 2 利用重载解决了上述问题

### 声明符的语义分析

C/C++ 中声明符 (declarator) 的语义规则如下:

-   声明符成分的优先级: 括号 >> 后缀符 ()、[] >> 前缀符 (\*、&、const、类型等)
-   前缀符的分析顺序是从右向左 (自底向上)
-   从标识符 idenfier 开始，按照上述优先级分析语义

```cpp
int *&r = p;
// r 是一个引用，引用的是一个指针
char* const (* farr[10])(int);
// farr 是一个数组，数组存放指针，存放的指针指向函数，函数返回 char* const
char * const * (*next)();
// next 是一个指针，这个指针指向一个函数，函数返回一个指针，
//    返回的指针指向 char * const 类型
int (*func(int i))[][20];
// func 是一个函数，函数返回一个指针，指针指向 int[][20] 类型的数组
```

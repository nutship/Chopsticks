### 1. RAII 与智能指针

RAII (Resource Acquisition Is Initialization) 是 C++ 管理资源的方式: 把资源封装在类中，对象生存期结束后自动析构:

-   栈对象离开作用域即结束生存期
-   堆对象被释放后结束生存期

这样做的好处在于 (按重要性先后排序):

-   明确资源的所有权
-   避免忘记资源的释放 (如 `delete` 指针)
-   处理异常等

??? hint "example of RAII"

    ```cpp
    void bad() {
        m.lock();         // 请求互斥体
        f();              // 若 f() 抛异常，互斥体永不释放
        if (...) return;  // 提前返回，互斥体永不释放
        m.unlock;
    }
    ```

    将互斥体封装在 class 中，生存期结束后自动释放

    ```cpp
    void good() {
        std::lock_guard<std::mutex> lock(m);
        f();
        if (...) return;
    }
    ```

??? hint "所有权"

    所有权 (ownership): 对象 A 负责对象 B 的创造和释放等，就说 A owns B

指针通常与动态内存关联，因而也需要作为一种资源由 RAII 管理。关于使用智能指针和裸指针的时机:

-   当有所有权的语义，即指针需要作为资源被管理，使用智能指针
-   没有所有权语义，只是用裸指针访问资源，裸指针结束生存期后也不需要它释放资源 (例如只是用裸指针访问一些数据)

### 2. `unique_ptr`

关于独占所有权的智能指针的发展:

-   `auto_ptr`:&ensp; 旧 C++ 的产物，使用拷贝和赋值实现「独占所有权」的「移动语义」，这导致了赋值会使原对象变为 null 的迷惑行为，以及无法将 `auto_ptr` 放入容器
-   `unique_ptr`:&ensp; C++11 引入移动语义的产物，move-only 且解决了 `auto_ptr` 的痛点

`unique_ptr` 的特点:

-   额外空间开销小，可近似认为等于裸指针；move-only；管理独占所有权语义的指针
-   支持自定义删除器，有状态的删除器和函数指针会增加 `unique_ptr` 对象的大小
-   很容易转化为 `shared_ptr`

// ToDo: example of factory

### 3. `shared_ptr`

当某个指针不被某个特定的智能指针对象所有，具有「共享所有权」语义，就适用 `shared_ptr`。它需要更大的开销:

-   初始化第一个 `shared_ptr` 时，同时还需要初始化一个 object 和一个控制块 (包含 ref count、weak count、custom deleter, etc.)
-   每个 `shared_ptr` 需要包含对原对象的引用和对控制块的引用，约为裸指针的 2 倍空间
-   递增递减引用是原子性的，比非原子操作慢

`shared_ptr` 用以上代价换取自动垃圾回收。

??? hint "对比 `shared_ptr` 和 `unique_ptr`"

    二者除本质区别外，使用上的区别:

    -   `shared_ptr` 也支持自定义删除器，但不内嵌在类型信息中
    -   `shared_ptr` 不支持数组

??? hint "`shared_ptr` 支持的操作"

    | op                         | description                               |
    | -------------------------- | ----------------------------------------- |
    | `shared_ptr<T> sp;`        | 值初始化为一个空指针                      |
    | `p`, `*p`, `p->mem`        | 可以像普通指针一样使用智能指针的变量名    |
    | `make_shared<T>(args)`     | 以 emplace 的方式初始化                   |
    | `shared_ptr<T> p(q);`      | 拷贝初始化，递增 `q` 中的计数器           |
    | `p = q`                    | 赋值，递减 `p` 的计数，递增 `q` 的计数    |
    | `swap(p, q)` / `p.swap(q)` | 交换 `p` 和 `q` 的指针                    |
    | `p.get()`                  | 返回 `p` 中保存的原始类型指针，应小心使用 |
    | `p.use_count()`            | 返回 `p` 的计数，可能很慢，主要用于调试   |

#### (1). 初始化

`shared_ptr` 有两种初始化方式:

-   通过 `make_shared` 以 emplace 的方式
-   直接初始化，通过原始指针变量 (或 `unique_ptr`)

首先应避免从原始指针上创建 `shared_ptr`，非此不可也要使用临时对象

??? caution "example"

    ```cpp
    void process(shared_ptr<int> ptr) { }
    ...
    int *x(new int(1024));
    process(shared_ptr<int>(x));
    int j = *x;
    cout << j << endl;
    ```

    由于混用了原始指针和 `shared_ptr`，导致了 undefined

??? caution "`enabled_shared_from_this`"

    ```cpp
    // 用于跟踪已经处理过的 Widget 的数据结构:
    std::vector<std::shared_ptr<Widget>> processedWidgets;
    // Widget 类
    class Widget {
    public:
        void process() {
            ...
            processedWidgets.emplace_back(this);
            // 错误: 相当于新开了一个 shared_ptr
        }
    };
    ```

    需求: 在类内拿到一个 `this` 的 `shared_ptr`，且这个 `shared_ptr` 不是第一个

    ```cpp
    class Widget: public std::enable_shared_from_this<Widget> {
    public:
        void process() {
            ...
            processedWidgets.emplace_back(shared_from_this());
        }
    };
    ```

<!-- prettier-ignore-start -->

而对比「使用 `make_shared` 初始化」和「使用 `new` 的临时对象直接初始化」也是前者更好，原因在于:

1 . 使用 `make_shared` 可以少打一次类型，减少重复代码

:   
    ```cpp
    auto spw1(std::make_shared<Widget>());      //使用make函数
    std::shared_ptr<Widget> spw2(new Widget);   //不使用make函数
    ```

2 . 使用 `make_shared` 更加异常安全

:   
    ```cpp 
    processWidget(std::shared_ptr<Widget>(new Widget), computePriority()); 
    ```

    函数传参前必须先计算实参，而编译器在转换目标代码时不必按照顺序，可能产生 `new Widget` > `computePriority` > `shared_ptr ctor` 的顺序，`computePriority` 可能会抛出异常，导致 `new Widget` 泄漏

3 . 使用 `make_shared` 内存分配更少

:   
    `std::shared_ptr<Widget> spw(new Widget);` new 对象一次分配，控制块又一次分配 <br>
    `auto spw = std::make_shared<Widget>();` 分配一块内存，同时容纳对象和控制块

<!-- prettier-ignore-end -->

需要考虑一些只能用直接初始化的特殊情况

-   需要自定义删除器或花括号初始化
-   ...

### 1. 列表初始化

C++98/03:

-   仅支持数组或 POD 类型 (没有构造、析构和虚函数的类或结构体)

C++11 将列表初始化推广至所有类型

-   对基本类型，列表初始化的意义在于可以在编译期提醒值丢失
-   对类类型，方便了初始化和返回值

尽管如此，内置类型习惯用等号初始化，类类型习惯圆括号显式初始化，`vector`、`map` 等才习惯于列表初始化

??? hint "eg1. c++98/03 支持的列表初始化"

    ```cpp
    int arr[] = {1, 2, 3, 4}；
    struct data {
        int x;
        int y;
    } my_data = {1, 2};
    ```

??? hint "eg2. c++11 普通类型列表初始化"

    ```cpp
    long double id = 3.1415926536;
    int a{id}, b = {id}; // warning
    int c(id), d = id;   // correct
    ```

??? hint "eg3. 容器列表初始化"

    ```cpp
    vector<int> vec1{1, 2, 3, 4, 5};
    vector<int> vec2 = {6, 7, 8};
    ...
    vector<int> foo(int i) {
        if (i < 5)
            return {};
        return {1, 2, 3};
    }
    ```

### 2. 可变参数

类类型的列表初始化由 `std::initializer_list` 实现，如果用花括号初始化类类型，首先会找这个类有没有可变参数的 ctor，如果没有接着会按直接初始化处理。

```cpp
class Cat {
public:
    vector<int> data;
    Cat(initializer_list<int> list) {
        for (auto it = list.begin(); it != list.end(); ++it)
            data.push_back(*it);
    }
}
```

类型不同的可变参数需要通过模板实现。

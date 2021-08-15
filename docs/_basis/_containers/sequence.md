### 1. 顺序容器选择

<font class="t_h%1&1">

| &ensp;         |                                             |
| -------------- | ------------------------------------------- |
| `vector`       | 随机访问 O(1)，尾部插入 O(1)                |
| `deque`        | 随机访问 O(1)，头尾插入 O(1)                |
| `list`         | 单向链表，不支持随机访问，任何位置插入 O(1) |
| `forward_list` | 双向链表，不支持随机访问，任何位置插入 O(1) |
| `array`        | 数组，固定大小                              |
| `string`       | 字符 `vector`                               |

</font>

选择容器时需要考虑到:

-   `deque` 相较于 `vector` 额外支持头部插入，需要额外的一个 map
-   `list` 的核心特性在于可以任何位置插入

选择容器的基本原则:

-   尽量使用 `vector`
-   需要其他特性时再考虑其他容器或者折中

### 2. 迭代器失效

容器增删元素可能导致 (a). 迭代器, (b). 指针或引用 失效(undefined) ，导致严重的运行时错误

<font class="u_n_nn_u1%-10">

-   `vector / string`
    -   `+`: &ensp; 若存储空间重分配，(a)(b) 均失效; 若未重分配，插入位置后的 (a)(b) 失效
    -   `-`: &ensp; 被删元素及其后的 (a)(b) 失效 (尾后迭代器总失效)
-   `deque`
    -   `+`: &ensp; 任意位置插入，都会导致所有元素的 (a) 失效；只有在首尾外的位置插入 (b) 失效
    -   `-`: &ensp; 删除首尾之外的元素，所有元素的 (a)(b) 失效；删除首元素，只有首元素的迭代器失效，其他不受影响；删除尾元素，尾元素和尾后迭代器失效，其他不受影响。
-   `list / forward_list`
    -   `+`: &ensp; 无影响
    -   `-`: &ensp; 无影响

</font>

??? hint "复制奇数删除偶数 (利用返回值保存 iterator)"

    ```cpp
    vector<int> integers{0, 1, 2, 3, 4, 5, 6, 7, 8, 9};
    auto iter = integers.begin();
    while (iter != integers.end()) {
        if (*iter % 2) {
            iter = integers.insert(iter, *iter);
            iter += 2;
        } else {
            iter = integers.erase(iter);
        }
    }
    ```

??? hint "在每个元素后插入一个元素 (不要保存 `end`)"

    ```cpp
    auto begin = v.begin();
    while (begin != v.end()) {
        ++begin;
        begin = v.insert(begin, val);
        ++begin;
    }
    ```

??? hint "为什么在 `deque` 任意位置插入都会导致所有迭代器失效"

    `deque` 内部是由一个 map 组织多个 segment，通常 map 前后会留一些空间给新增的 segment。当插入导致 map 满了，map 就要重分配，而 iterator 为了在 segment 之间迭代会保存 map 的地址，因此只要插入就可能导致迭代器功能失效，而只要不在中间插入指针和引用不会失效。

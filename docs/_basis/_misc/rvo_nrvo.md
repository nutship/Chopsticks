### Example

```cpp
class BigObject { ... };

BigObject test1() {
    return BigObject(param);
}

BigObject test2() {
    BigObject obj(param);
    return obj;
}

int main() {
    BigObject o1 = test1();
    BigObject o2 = test2();
}
```

通常情况，类似普通变量通过 `%rax` 实现返回值的方式

-   `test1`: &ensp; 将临时对象拷贝到某处，再拷贝到 `o1`
-   `test2`: &ensp; 将有名对象 `obj` 拷贝到某处，再拷贝到 `o2`

拷贝到的中转区可以提前在未调用函数时提前开一块区域实现。

### RVO

对于 `test1`，临时对象可以直接优化掉，省掉两次 copy

```cpp
// 伪代码
void test1(BigObject& r) {
    r.BigObject::BigObject(param);
    return;
}

void main() {
    BigObject o1; // 这里只定义，不构造
    test1(o1);
}
```

对于 `test2`，由于返回的是“具名对象”，情况更复杂，优化条件更苛刻，RVO 只优化掉一次 copy

```cpp
void test2(BigObject& r) {
    BigObject obj(param);
    r.BigObject::BigOBject(obj);
    return;
}

// main 和上面类似
```

### NRVO

由于这个例子比较简单，可以进一步应用 NRVO (g++ 默认开启 NRVO)

```cpp
void test2(BigObject& r) {
    r.BigObject::BigObject(param);
    return;
}
```

一些特殊情况 NRVO 无法应用，例如

-   有多个 return path，且不同路径返回不同名的变量
-   ...

<a href="https://www.cnblogs.com/xkfz007/articles/2506022.html">here</a>

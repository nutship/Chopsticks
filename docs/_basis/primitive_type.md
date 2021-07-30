### 1. 自动装箱

Java 保留了 8 种基本类型，但它们不是继承自 `Object` 的对象，因而需要包装类

```java
primitive types:     byte  char       short  int      float  double  long  boolean
wrapper classes:     Byte  Character  Short  Integer  Float  Double  Long  Boolean
trasform:            new WrapperClass(primitive)  <-->  WrapperInstance.valueOf()
```

但手动转换使得代码繁琐，因此 Java1.5 引入了自动装箱 (autoboxing) 和自动拆箱的语法糖

-   装箱时编译器调用类似 `valueOf()` 将原始类型转换为对象，拆箱时通过类似 `intValue()` 的方法
-   自动装箱和拆箱可能发生于赋值时、方法调用时

```java
// 1. assignment
Integer iObj = 3; // autoboxing
int iPri = iObj;  // autounboxing
// 2. call method
showInteger(3);
```

自动装箱机制可能会创建无用对象，加重垃圾回收的压力

```java
Integer sum = 0;
for (int i = 0; i < 5000; ++i)
    sum += i;
```

`sum += i` 经过编译器转换后可能为

```java
int result = sum.intValue() + 1;
Integer sum = new Integer(result);
```

还需要注意:

-   `int` 和 `Integer` 在重载时属于不同类别，因此调用重载函数无需担心发生自动装箱。
-   `Integer` 未初始化则值为 `null`，此时自动拆箱 (例如 `i < 0`) 会抛出异常

### 2. 自动装箱与 `==`

包装类型可以直接与基本类型比较，相当于拿出包装类型的数值 `instance.xxValue() == primitive`

```java
Integer n1 = 1;
int n2 = 1;
System.out.println(n1 == n2); // true
```

`Integer.valueOf()` 会缓存 `-128-127` 范围的 `Integer` 对象，换句话说，如果自动装箱了这个范围内的某个值，返回的是同一个对象

```java
Integer n1 = 1;
Integer n2 = 1;
System.out.println(n1 == n2); // true
```

注意，上述过程只是自动装箱的节省内存机制，发生在 `valueOf()` 中

```java
Integer n1 = new Integer(1);
Integer n2 = new Integer(2);
System.out.println(n1 == n2); // false
```

### 1 interface与type的区别

1. extends

   type使用【&】实现类型继承一个type的效果

   interface使用extends一个【interface】或者【type】实现继承

2. 面向类型

   interface是作为对象、函数的规范

   type则是基本类型、对象、函数都可以

3. 语法的声明

   多次声明interface会合并interface为一个

   多次声明type是被禁止的，仅许一个type

4. 你可以使用type，使用【in】映射类型

   ````typescript
   type keys = 'a' | 'b'
   type myType = {
       [key in keys]: string
   }
   # bingo
   const test: DudeType = {
     a: "Pawel",
     b: "Grzybek"
   }
   ````

### 2 泛型

> 1. 什么是泛型？
> 2. 常用泛型的名称（约定俗成）

- 什么是泛型

  将类型看作值，从而对类型进行编程。

- 常用泛型的名称

  T、O、K、E

- 实现

  站在ts的角度上来看，是通过传递类型<T>，从而链式的传递给后面的参数类型

### 3 映射类型

映射类型允许通过转换属性在现有类型的基础上创建新类型.

Partial<T> 使接口的所有属性可选，或使用 Readonly<T> 使它们只读。

### 4 keyof与typeof

1. keyof 运算符生成给定类型的已知公共属性名称的并集

   ```typescript
   interface Person {
       name: string
       age: number
       location: string
   }
   type SomeNewType = keyof Person 
   // SomeNewType 是一个联合字面量类型("name" | "age" | "location")，它是由 Person 的属性组成的类型。
   ```

2. typeof 运算符在类型上下文中使用时，获取变量、常量或对象文字的类型

   ```ts
   const bmw = { name: "BMW", power: "1000hp" }
   ```

   typeof bmw 给到你他们的类型 { name: string, power: string }

3. keyof与typeof联用

   原本的key 现在作为的对象的指定值

   ````typescript
   enum ColorsEnum {
       white = '#ffffff',
       black = '#000000',
   }
   
   type Colors = keyof typeof ColorsEnum
   
   let colorLiteral: Colors
   colorLiteral = "white"  // OK
   colorLiteral = "black"  // OK
   colorLiteral = "red"    // Error...Type '"red"' is not assignable to type '"white" | "black"'
   ````

### 5 typescript存在的类型

any / never / unkown / null / undefined / void / 

string / number / boolean / Array / 函数 / 对象 / 元组 / 枚举

联合类型

### 6. 类型体操

https://juejin.cn/post/7115789691810480135?from=search-suggest

**类型体操就是类型编程，对类型参数做各种逻辑运算，以产生新的类型**

- 内置的类型体操

  Partia / Required / Pick / Readonly / NonNullable / Required

- 场景的逻辑运算符号

  - extends 
  - keyof / in
  - typeof  （  JS 转 TS  ）
  - infer / as
  - & / | 
  - T[K] 索引访问
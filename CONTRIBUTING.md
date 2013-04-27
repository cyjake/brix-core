# 如何贡献代码

## 代码风格

### 空格与缩进

四个空格，不用 tab 制表符，代码中注意留白：

```js
KISSY.add('foo', function(S, a, b) {

    // 常量
    var FOO = 'foo'

    function Foo() {}

    S.augment(Foo, a, b)

    return Foo
}, {
    requires: [
        'a',
        'b'
    ]
})
```

**不要**写成

```js
KISSY.add('foo',function(S,a,b){
    var foo = 'foo'
    function Foo(){}
    S.augment(Foo,a,b)
    return Foo
},{requires:['a','b']})
```

### 分号

我们决定让 JavaScript 引擎自己插入分号，自己就不再重复写了。

在 JS 标准里，[分号是可选的](http://mislav.uniqpath.com/2010/05/semicolons/)，你可以写，
也可以不写。但是不写分号的话，有一些边际场景会变成坑，一不留声坑你一下。所以 Douglas Crockford
在他的语言精粹一书和 JSLint 工具里都要求写上分号。从而规避以下场景：

```js
// 错误
return
{
    foo: 1
}

// 会变成
return;
{
    foo: 1
}

// 应该写成
return {
    foo: 1
};
```

但是你可能注意到了，上面这个例子里，重点是 `{` 的位置，而非写不写分号。真正写分号带来的好处是：

```js
// a.js
KISSY.add('foo', function() {
    // code
})

// b.js
(function() {
    // code
})()

// 在文件合并之后变成：
KISSY.add('foo', function() {
    // code
})
(function() {
    // code
})()

// 等同于执行：
KISSY.add('foo', function() {})

// 把上面这句返回的 undefined 当成函数，把那个 function() {} 包当做参数，执行：
undefined(function() {})

// 再把上面这句的返回值当做函数，执行：
wtf()
```

坚持写分号就不会有这个错误了。**但是**，其实只要在那个括号开头写 `;`，效果也是一样的。

这就是 Brix Core 省略分号的原因，真正派上用场的分号不能省，而绝大部分以前被强迫的分号，
其实是可以省略的。

## 填写测试用例

使用单元测试描述你修复或者新增的功能点，并保证你的改动之后所有测试仍然是能够跑通的。在项目根目录执行：
`grunt test` 即可。
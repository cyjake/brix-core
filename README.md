# Brix Core

Brix 的核心功能，包括：

- 组件加载器 `[bx-name]`
- 组件模板渲染

## 组件加载器

通过 `[bx-name]` 钩子加载相应组件，支持嵌套。

```html
<div bx-name="ux.shopping-ads/ceiling">
  <!-- 节点内部 HTML -->
</div>
```

将会加载 `ux.shopping-ads/ceiling/index` 模块，并传 el 给它，且初始化之，行为如下：

```js
KISSY.use('ux.shopping-ads/ceiling/index', function(S, Ceiling) {
    // 参数结构如下：
    //
    // - el           [bx-name="ux.shopping-ads/ceiling"] 节点
    // - customProp   el 节点上的 data-customProp 值
    //
    new Ceiling({
        el: el,
        // ... 自定义的参数，参数列表通过 Ceiling.OPTIONS 定义
    })
})
```

### 组件的目录结构

项目的组件目录组织方式，参考鄙项目的 test 目录。项目引用的外部组件（imports）：

```bash
test/imports
├── ux.shopping-ads
│   └── ceiling
│       ├── 0.1.0
│       │   └── index.js
│       └── 0.1.1
│           └── index.js
└── ux.tanx
    ├── dropdown
    │   └── 0.1.5
    │       ├── index.js
    │       ├── template.html
    │       └── template.js
    ├── grid
    │   └── 0.2.1
    │       └── index.js
    └── message
        └── 0.1.2
            └── index.js
```

```bash
test/components
└── ux.demo
    ├── ceiling
    │   ├── index.js
    │   ├── test-ceiling.html
    │   └── test-ceiling.js
    └── footer
        ├── index.js
        └── template.html
```

### 初始化页面

```js
KISSY.use('brix/app', function(S, app) {
    app.boot({
        ceiling: {
            user: 'foobar'
        }
    }).on('bx:ready', function(e) {
        var ceiling = this.find('ux.demo/ceiling')

        equal(ceiling.bxName, 'ux.demo/ceiling')
    })
})
```

## 组件模板支持

当组件渲染放到客户端，组件节点中不再有或者不再是其真实 HTML 时，我们需要有指定、获取模板的方式。
Brix Core 提供如下几种模板获取方式：

- 组件节点中内联
- `<script type="text/bx-template">` 标签
- 组件目录中 `template.html` 文件

Brix 的正式模板引擎仍然在开发中，在此之前，我们采用
[xtemplate](http://docs.kissyui.com/docs/html/tutorials/kissy/component/xtemplate/intro.html)
为基础模板，同时使用一些自定义标签，以便模板解析与加工。

先讨论模板的放置方式，理想中，支持三种：

- 组件节点中内联
- 写在 `script[type="text/bx-template"]` 标签中
- 模板文件自成模块

### 左莫的经验

波哥在之前版本的实现中，在获取子模板时踩过许多坑，总结出不少经验，etaoux/brix#39 与
etaoux/brix#41 。我不太认同深度依赖正则表达式的解决方案，更偏好类似 AngularJS 的方式，
即将独立的 `{{}}` 标签从 HTML 中移出，改为标签上的自定义属性。

然而这一块我还没考虑完全，直接在 HTML 元素的 innerHTML 里内联模板的主要问题有：

- `{{#if a > 0}}` 这种代码，里头的 `>` 会被转义成 `&gt;`
- `<img src="{{imageLink}}"/>` 会导致请求 http://{{imageLink}} ，404
- `<a href="{{pageLink"></a>` 会变成 http://brix.example.com/{{pageLink}}

剩余的坑，遇到一个补充一个，这些问题，会总结成博文，到时一并发出来。

### 组件节点中内联

直接在组件节点的 `innerHTML` 中写：

```html
<div bx-name="ux.shopping-ads/ceiling" bx-template=".">
  <p class="user-info" bx-if="user">
    <a bx-href="{{user.link}}">{{user.nickname}}</a>
  </p>
  <p class="login" bx-else>
    <a bx-href="/login">请先登录</a>
  </p>
</div>
```

但这种写法有个问题，即一些特殊属性会触发默认但是不必要的浏览器行为，例如：

- img 标签里写 src="{{image}}" 会导致浏览器报 404 错误，找不到 http://{{image}} 之类
- href="{{url}}" 在低版本 IE 浏览器里处理时要格外小心，会被加上前缀，可以用
  `getAttribute('href', 2)` 取得原值

### 写在页面 script 标签中

```html
<div bx-name="ux.shopping-ads/ceiling" bx-template="#ceiling-template">
</div>
<script type="text/bx-template" id="ceiling-template">
  <p class="user-info" bx-if="user">
    <a href="{{user.link}}">{{user.nickname}}</a>
  </p>
</script>
```

这是比较妥帖的方式。

### 组件目录中的独立文件

以 `ux.shopping-ads/ceiling` 组件为例，它的目录结构如下：

```bash
ux.shopping-ads/ceiling
├── data.json
├── index.js
├── index.css
├── package.json
└── template.html
```

package.json、index.css 先不管，index.js 即此组件的入口文件，它需要提供
`ux.shopping-ads/ceiling/index` 模块。

此节讨论的重点是 template.html 文件，此文件用于放置组件本身的模板，内容如下：

```html
<p class="user-info" bx-if="user">
  <a href="{{user.link}}">{{user.nickname}}</a>
</p>
```

声明这种使用方式的方法是：

```html
<div bx-name="ux.shopping-ads/ceiling" bx-template="./template">
</div>
```

## 模板写法

这种设计的目的是效仿 AngularJS，去除模板中的 `{{}}`，从而避免掉进一些坑里头去，例如：

- tbody 中循环 tr
- input 中判断是否 readyonly

左莫、崇志比较有发言权，这种边缘情况都是他们发现的。原有的 Brix 实现里，采用正则替换的方式，
保存模板字符串，替换成可以安全解析的结构，处理完毕之后再替换回去。

### bx-scope

```html
<div bx-name="tanx/dropdown" bx-template="." bx-scope="dropdownData as entries">
  <ul>
    <li bx-each="entry in entries">
      <label value="{{entry.value}}">{{entry.label}}</label>
    </li>
  </ul>
</div>
```

### bx-if

如果其值为真，则渲染当前节点。类似 mustache 中的 `{{#condition}}{{/condition}}` 包装：

```html
<div class="positive" bx-if="visible">塔哒</div>
<div class="negative" bx-else>你看不见我，你看不见我</div>
```

等同于 mustache 中的：

```html
{{#visible}}
<div class="positive"><div>
{{/visible}}
{{^visible}}
<div class="negative"></div>
{{/visible}}
```

### bx-each

重复当前节点，同样类似 mustache 中的 `{{#array}} ... {{/array}}`` 语法：

```html
<div bx-each="users">
  <h2>{{name}}</h2>
</div>
```

等同于 mustache 中的：

```html
{{#users}}
<div>
  <h2>{{name}}</h2>
</div>
{{/users}}
```

### bx-readonly

方便在 `<input>` 标签中使用的语法糖

```html
<input type="text" bx-readonly="guest"/>
```

### bx-checked

方便在 `<input type="checkbox">` 标签中使用的语法糖

```html
<input type="checkbox" bx-checked="selected"/>
```

### bx-disabled

方便在 `<input>` 标签中使用的语法糖

```html
<input type="text" bx-disabled="guest"/>
```
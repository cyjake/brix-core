# Brix Core

Brix 的核心功能，包括：

- 组件加载器 `[bx-name]`
- 组件模板渲染

## 组件加载器

通过 `[bx-name]` 钩子加载相应组件，支持嵌套。

```html
<div bx-name="shopping-ads/ceiling">
  <!-- 节点内部 HTML -->
</div>
```

将会加载 `shopping-ads/ceiling` 模块，并传 el 给它，且初始化之，行为如下：

```js
KISSY.use('shopping-ads/ceiling', function(S, Ceiling) {
    // 参数结构如下：
    //
    // - el           [bx-name="shopping-ads/ceiling"] 节点
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
├── shopping-ads
│   └── ceiling
│       ├── 0.1.0
│       │   └── index.js
│       └── 0.1.1
│           └── index.js
└── tanx
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
└── brix-test
    ├── ceiling
    │   ├── index.js
    │   ├── test-ceiling.html
    │   └── test-ceiling.js
    └── footer
        ├── index.js
        └── template.html
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

### 左莫的经验

波哥在之前版本的实现中，

### 组件节点中内联

```html
<div bx-name="shopping-ads/ceiling" bx-template=".">
  <p class="user-info" bx-if="user">
    <a href="{{user.link}}">{{user.nickname}}</a>
  </p>
  <p class="login" bx-else>
    <a href="/login">请先登录</a>
  </p>
</div>
```

### 写在页面 script 标签中

```html
<div bx-name="shopping-ads/ceiling" bx-template="#ceiling-template">
</div>
<script type="text/bx-template" id="ceiling-template">
  <p class="user-info" bx-if="user">
    <a href="{{user.link}}">{{user.nickname}}</a>
  </p>
</script>
```

### 组件目录中的独立文件

以 `shopping-ads/ceiling` 组件为例，它的目录结构如下：

```bash
shopping-ads/ceiling
├── data.json
├── index.js
├── index.css
├── package.json
└── template.html
```

package.json、index.css 先不管，index.js 即此组件的入口文件，它需要提供
`shopping-ads/ceiling/index` 模块。

此节讨论的重点是 template.html 文件，此文件用于放置组件本身的模板，内容如下：

```html
<p class="user-info" bx-if="user">
  <a href="{{user.link}}">{{user.nickname}}</a>
</p>
```

声明这种使用方式的方法是：

```html
<div bx-name="shopping-ads/ceiling" bx-template="./template">
</div>
```

## 模板写法

这部分是私货，更容易引起口水，暂时按下不表。0.1.0 版本只实现了 @bx-scope @bx-repeat @bx-if
和 @bx-else 。

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

### bx-repeat

重复当前节点，同样类似 mustache 中的 `{{#array}} ... {{/array}}`` 语法：

```html
<div bx-repeat="user in users">
  <h2>{{user.name}}</h2>
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

### bx-readonly-if

方便在 `<input>` 标签中使用的语法糖

```html
<input type="text" bx-readonly-if="user.isGuest"/>
```

### bx-checked-if

方便在 `<input>` 标签中使用的语法糖

```html
<input type="checkbox" bx-checked-if="item.selected"/>
```
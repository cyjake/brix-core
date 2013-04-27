## Deploy with Timestamp

使用时间戳的形式发布项目自身组件。

### 方式一：bpm

使用 bpm 命令或者其他方式将组件目录下的内容发布到 CDN，原结构：

```bash
components/ux.demo
├── ceiling
│   ├── index.js
│   ├── test-ceiling.html
│   └── test-ceiling.js
├── footer
│   ├── index.js
│   └── template.html
└── profile
    └── index.js
```

这一结构，在开发时，可以如此配置 brix/app：

```js
KISSY.use('brix/app', function(S, app) {
    app.config('namespace', 'ux.demo')
})
```

发布到 CDN 上的目录结构，会变成：

```bash
components/ux.demo
└── 20130427
    ├── ceiling
    │   └── index.js
    └── footer
        └── index.js
```

线上的 brix/app 配置：

```js
KISSY.use('brix/app', function(S, app) {
    app.config({
        base: 'http://a.tbcdn.cn/apps/brix/',
        namespace: 'ux.demo',
        timestamp: 20130427
    })
})
```

### 方式二：彩虹桥

阿大那边即采用时间戳发布形式，但时间戳所在位置有所出入：

```bash
20130427/components/ux.demo
├── ceiling
│   └── index.js
└── footer
    └── index.js
```

这种方式，只需直接配置 brix/app 的 base：

```js
KISSY.use('brix/app', function(S, app) {
    app.config({
        base: 'http://a.tbcdn.cn/apps/e/ux.demo/20130427/',
        namespace: 'ux.demo'
    })
})
```

如此即可。

## Deploy with version lock

使用版本锁来发布项目组件。

先用 bpm 工具将组件发布到 CDN ，在 CDN 上的结构大致如下：

```bash
ux.lego
├── ceiling
│   └── 0.1.1
│       └── index.js
└── footer
    └── 0.1.1
        └── index.js
```

项目组件（components）版本锁的概念与外部组件（imports）的概念相仿，配置方式就是：

```js
KISSY.use('brix/app', function(S, app) {
    app.config({
        namespace: 'ux.demo',
        components: {
            ceiling: '0.1.1',
            footer: '0.1.1'
        }
    })
})
```

它的结构与外部组件锁是一样的。

项目组件锁的内容，应该在线上发布时才填写。使用 bpm 工具，将项目组件发布至 CDN 之后，得到生成的
ComponentsLock.json 文件，将它人肉贴到 brix/app 配置里去，或者让开发动态嵌入页面中，
以全局变量形式暴露出来，都是可以的。

乐高项目，采用的是后者：

```html
<script>var Molock = $molockString</script>
<script src="/brix-0.1.0.js"></script>
<script>
KISSY.use('brix/app', function(S, app) {
    app.config({
        namespace: '$namespace',
        components: Molock
    })
    app.boot()
})
</script>
```

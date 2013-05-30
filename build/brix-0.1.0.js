/**
 * Brix Core v0.1.0
 * 
 * http://github.com/brixjs
 */
KISSY.add('brix/app', function(S, BxPage, appConfig) {

    function BxApp() {
        BxApp.superclass.constructor.call(this)
    }

    S.extend(BxApp, S.Base)

    BxApp.ATTRS = {
        prepared: false
    }

    S.augment(BxApp, appConfig, {
        boot: function(el, data) {
            this.prepareLoader()

            if (S.isPlainObject(el)) {
                data = el
                el = '[bx-app]'
            }
            el = el || '[bx-app]'
            el = S.isString(el) ? S.one(el) : el

            if (el) {
                var page = new BxPage({
                    el: el,
                    data: data
                })

                page.bxLoad(el)

                return page
            }
        },

        bootStyle: function(fn) {
            this.prepareLoader()

            S.use(this.comboStyle().join(','), fn)
        },

        prepareLoader: function() {
            if (!this.get('prepared')) {
                this.mapImports()
                this.mapComponents()
                this.packageImports()
                this.packageComponents()
                this.set('prepared', true)
            }
        }
    })

    var app = new BxApp()

    return app
}, {
    requires: [
        'brix/app/page',
        'brix/app/config',
        'base'
    ]
});
KISSY.add('brix/app/config', function(S) {

    var exports = {
        configData: {
            debug: true,

            base: '.',

            imports: null,

            timestamp: null,

            namespace: null,

            components: null
        },

        config: function(prop, data) {
            if (S.isPlainObject(prop)) {
                S.mix(this.configData, prop)
            }
            else if (S.isString(prop)) {
                if (typeof data === 'undefined') {
                    return this.configData[prop]
                }
                else {
                    this.configData[prop] = data
                }
            }
            else {
                return S.clone(this.configData)
            }
        },

        mapTimestamp: function() {
            var stamp = this.config('timestamp')
            var ns = this.config('namespace')

            if (stamp && ns) {
                var injectTimestamp = function(m, name, file) {
                    return [ns, stamp, name, file].join('/')
                }

                S.config('map', [
                    [new RegExp(ns + '\\/([^\\/]+)\\/([^\\/]+)$'), injectTimestamp]
                ])
            }
        },

        mapImports: function() {
            this.mapModules(this.config('imports'))
        },

        mapComponents: function() {
            var comps = this.config('components')

            if (S.isPlainObject(comps)) {
                var ns = this.config('namespace')
                var obj = {}

                obj[ns] = comps
                this.mapModules(obj)
            }
            else {
                this.mapTimestamp()
            }
        },

        mapModules: function(lock) {
            function makeReplacer(ns) {
                return function(match, name, file) {
                    return [ns, name, lock[ns][name], file].join('/')
                }
            }
            var maps = []

            for (var ns in lock) {
                maps.push([new RegExp(ns + '\\/([^\\/]+)\\/([^\\/]+)$'), makeReplacer(ns)])
            }

            S.config('map', maps)
        },

        packageImports: function() {
            var imports = this.config('imports')
            var importsBase = this.config('base') + '/imports'
            var ignoreNs = S.config('ignorePackageNameInUri')
            var packages = {}

            for (var p in imports) {
                packages[p] = {
                    base: importsBase + (ignoreNs ? '/' + p : '')
                }
            }

            S.config('packages', packages)
        },

        packageComponents: function() {
            var ns = this.config('namespace')
            var base = this.config('base')
            var ignoreNs = S.config('ignorePackageNameInUri')
            var obj = {}

            obj[ns] = {
                base: base + '/components' + (ignoreNs ? '/' + ns : '')
            }
            S.config('packages', obj)
        },

        comboStyle: function() {
            var imports = this.config('imports') || {}
            var styles = []
            var comp
            var ns

            for (ns in imports) {
                for (comp in imports[ns]) {
                    styles.push([ns, comp, 'index.css'].join('/'))
                }
            }
            var components = this.config('components') || []

            if (S.isPlainObject(components)) {
                components = S.keys(components)
            }
            ns = this.config('namespace')
            for (var i = 0; i < components.length; i++) {
                styles.push([ns, components[i], 'index.css'].join('/'))
            }

            return styles
        }
    }

    return exports
});
KISSY.add('brix/app/page', function(S, Base, bxName, bxModel) {

    function BxPage(opts) {
        BxPage.superclass.constructor.call(this, opts)
    }

    BxPage.ATTRS = {
        data: null,

        el: {
            getter: function(elId) {
                return elId && S.one(elId)
            },
            setter: function(el) {
                if (el) {
                    if (!el.attr('id')) {
                        el.attr('id', 'bx-page-' + S.guid())
                    }
                    return '#' + el.attr('id')
                }
            }
        }
    }

    S.extend(BxPage, Base)
    S.augment(BxPage, bxName, bxModel)

    return BxPage
}, {
    requires: ['base', 'brix/core/bx-name', 'brix/core/bx-model']
});
KISSY.add('brix/base', function(S, bxName, bxTemplate, bxModel, bxDirective, bxWatch, app, RichBase) {

    function BxBase(opts) {
        BxBase.superclass.constructor.call(this, opts)
    }

    BxBase.uid = function() {
        return ['bx', S.guid()].join('-')
    }

    S.extend(BxBase, RichBase)

    BxBase.ATTRS = {
        data: null,

        template: null,

        el: {
            getter: function(elId) {
                return S.one(elId)
            },
            setter: function(el) {
                if (!el.attr('id')) {
                    el.attr('id', BxBase.uid())
                }

                return '#' + el.attr('id')
            }
        }
    }

    S.augment(BxBase, bxName, bxTemplate, bxModel, bxDirective, bxWatch, {
        initialize: function(el) {
            el = el || this.get('el')
            if (!el.hasAttr('bx-model')) {
                this.bxLoad(el)
            }
            else {
                this.on('afterTemplateChange', this.bxBindModel, this)
                this.on('afterDataChange', this.bxRender, this)

                this.bxTemplate(el)
            }
        },

        destructor: function() {
            var children = this.bxChildren || []

            for (var i = 0; i < children.length; i++) {
                children[i].destroy()
            }
            this.bxParent = null
            this.bxUndelegate()
            this.get('el').remove()
        },

        bxBindModel: function() {
            var data = this.bxModel(this.bxParent.get('data'))

            this.set('data', data)
        },

        bxRender: function() {
            var el = this.get('el')
            var template = this.get('template')
            var engine = app.config('templateEngine')
            var res = null
            var data = {}

            data[this.bxDataKey] = this.get('data')
            if (engine && S.isFunction(engine.render)) {
                res = engine.render(template, data)
            }
            else {
                res = this.bxDirective(template, data)
            }
            el.html(res)

            this.bxLoad(el)
        }
    })

    return BxBase
}, {
    requires: [
        'brix/core/bx-name',
        'brix/core/bx-template',
        'brix/core/bx-model',
        'brix/core/bx-directive',
        'brix/core/bx-watch',
        'brix/app/config',
        'rich-base'
    ]
});
KISSY.add('brix/core/bx-directive',
          function(S, bxIfElse, bxEach, bxBoolean, bxSrc, bxSelect, bxClass, XTemplate) {

    var OPERATORS = [
        ['>', 'gt', />/g, /\sbx-operator-gt\s/g],
        ['>=', 'gte', />=/g, /\sbx-operator-gte\s/g],
        ['<=', 'lte', /<=/g, /\sbx-operator-lte\s/g],
        ['<', 'lt', /</g, /\sbx-operator-lt\s/g],
        ['&&', 'and', /\&{2}/g, /\sbx-operator-and\s/g]
    ]

    var OPERATOR_PREFIX = 'bx-operator-'

    var exports = {
        bxDirective: function(template, data) {
            var Node = S.Node
            var div
            var templateCache = this.get('templateCache')

            if (!templateCache) {
                div = Node('<div>', {
                    html: template
                })

                this.bxIfElseWrap(div)
                this.bxEachWrap(div)
                this.bxBooleanWrap(div)
                this.bxClassWrap(div)
                this.bxSelectWrap(div)

                template = this.bxUnsealOperators(div.html())

                templateCache = new XTemplate(template)

                // The template derived from brix directives in the format of xtemplate
                this.set('xtemplate', template)

                // The compiled xtemplate, cached for partial re-rendering.
                this.set('templateCache', templateCache)
            }
            div = Node('<div>', {
                html: templateCache.render(data)
            })

            this.bxBooleanStrip(div)
            this.bxSrcStrip(div)
            this.bxClassStrip(div)

            return div.html()
        },

        bxDirectivePartial: function(template, data) {
            var Node = S.Node
            var div = Node('<div>', { html: template })

            this.bxIfElseWrap(div)
            this.bxEachWrap(div)
            this.bxBooleanWrap(div)
            this.bxClassWrap(div)
            this.bxSelectWrap(div)

            template = this.bxUnsealOperators(div.html())

            return (new XTemplate(template)).render(data)
        },

        bxDirectDirective: function(node, attr) {
            return this.bxDirectChildren(node, '[' + attr + ']')
        },

        bxAllDirective: function(node, attr) {
            var arr = []
            var Node = S.Node

            node.all('[' + attr + ']').each(function(ele, i) {
                arr[i] = Node(ele)
            })
            node = null

            return arr
        },

        bxSealOperators: function(exp) {
            for (var i = 0; i < OPERATORS.length; i++) {
                var op = OPERATORS[i]

                exp = exp.replace(op[2], OPERATOR_PREFIX + op[1])
            }

            return exp
        },

        bxUnsealOperators: function(template) {
            for (var i = 0; i < OPERATORS.length; i++) {
                var op = OPERATORS[i]

                template = template.replace(op[3], ' ' + op[0] + ' ')
            }

            return template
        }
    }

    S.mix(exports, bxIfElse)
    S.mix(exports, bxEach)
    S.mix(exports, bxBoolean)
    S.mix(exports, bxSrc)
    S.mix(exports, bxClass)
    S.mix(exports, bxSelect)

    return exports
}, {
    requires: [
        'brix/directive/bx-if-else',
        'brix/directive/bx-each',
        'brix/directive/bx-boolean',
        'brix/directive/bx-src',
        'brix/directive/bx-select',
        'brix/directive/bx-class',
        'xtemplate',
        'node'
    ]
});
KISSY.add('brix/core/bx-model', function(S) {

    var EXP_PTN = /^\s*(\w+)(?:\s+as\s+(\w+))?\s*$/

    var exports = {
        bxModel: function(data) {
            var el = this.get('el')
            var exp = el.attr('bx-model')

            if (!exp) {
                return
            }
            var matches = exp.match(EXP_PTN)
            var attr = matches[1]
            var mappedAttr = matches[2]
            var obj

            if (!attr) {
                throw (new Error('bx-model attribute cannot be empty'))
            }
            else if (S.isFunction(this[attr])) {
                obj = (this[attr])()
            }
            else {
                var path = this.bxModelWithinEach(el)

                if (path.length > 0) {
                    if (path[0] === this.bxParent.bxDataKey) {
                        path.shift()
                    }
                    var p

                    while ((p = path.shift()) && p) {
                        data = data[p]
                    }
                }
                obj = data[attr]
            }

            this.bxDataKey = mappedAttr || attr

            return obj
        },

        bxModelWithinEach: function(el) {
            // When the @bx-model node is a child of one or many @bx-each nodes,
            // the path shall be derived from those @bx-each nodes.
            var path = []
            var parentName = this.bxParent.bxName

            if (!parentName) {
                return path
            }
            var ele = el[0]
            var parent = ele

            while ((parent = parent.parentNode) &&
                    parent !== parent.parentNode) {
                var each = parent.getAttribute('bx-each')

                if (each) {
                    var index = parent.getAttribute('bx-each-index')

                    path.push(each)
                    path.push(index)
                }
                else if (parent.getAttribute('bx-name')) {
                    break
                }
            }

            return path
        }
    }

    return exports
});
KISSY.add('brix/core/bx-name', function(S, Node) {

    var exports = {
        // #bxName is occupied as the name of current instance of component.
        // It is used for maintaining the bricks tree structure.
        // So let's use #bxLoad instead.
        bxLoad: function(root) {
            root = Node(root)
            var nodes = this.bxDirectChildren(root)
            var total = nodes.length
            var counter = 0
            var self = this
            var node

            function check() {
                counter++
                if (total === 0 || counter === total) {
                    self.fire('bx:ready')
                    root = nodes = node = null
                }
            }

            if (total === 0) {
                setTimeout(function() {
                    self.fire('bx:ready')
                }, 0)
            }
            else {
                for (var i = 0; i < total; i++) {
                    node = Node(nodes[i])

                    this.bxInstantiate(node, check)
                }
            }
        },

        bxInstantiate: function(el, fn) {
            var self = this

            S.use(el.attr('bx-name') + '/index', function(S, Brick) {
                if (!S.isFunction(Brick)) {
                    // no need to initialize anything.
                    return
                }
                var opts = self.bxOptions(el, Brick)
                var inst

                opts.el = el

                inst = new Brick(opts)
                inst.bxParent = self
                inst.bxName = el.attr('bx-name')

                var children = self.bxChildren

                if (!children) {
                    children = self.bxChildren = []
                }
                children.push(inst)

                if (S.isFunction(inst.initialize)) {
                    inst.bxCacheSubTemplets(el)
                    inst.bxWatch(el)
                    inst.on('bx:ready', fn)
                    inst.callMethodByHierarchy('initialize', 'constructor')
                    inst.bxDelegate(el)
                }
                else {
                    fn()
                }
                el = null
            })
        },

        bxCacheSubTemplets: function(el) {
            var nodes = this.bxDirectChildren(el)
            var subTemplets = this.bxCachedSubTemplets = []

            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i]
                var template = node.attr('bx-template')

                if (node.attr('bx-model') && (!template || template === '.')) {
                    subTemplets.push(node.html())
                    node.html('')
                    node.attr('bx-template', 'cached')
                }
            }
        },

        /**
         * Get child elements of current node which may or may not have
         * attribute bx-name.
         *
         * Given DOM structures like:
         *
         *     <div bx-name="foo/egg" bx-model="cart">
         *       <div bx-each="item in items"></div>
         *       <div bx-name="foo/ham" bx-model="item">
         *         <div bx-each="attr in attributes"></div>
         *       </div>
         *     </div>
         *
         * this.bxDirectChildren(S.one('[bx-name="foo/egg"]'), '[bx-each]')
         * should return an array consists of one element:
         *
         *     <div bx-each="item in items"></div>
         */
        bxDirectChildren: function(root, selector) {
            var arr = []
            var parentName = root.attr('bx-name')

            selector = selector || '[bx-name]'
            root.all(selector).each(function(ele) {
                var parent = ele.parent('[bx-name]')

                if (!parent || parent.attr('bx-name') === parentName) {
                    arr.push(ele)
                }
            })

            return arr
        },

        bxFind: function(name) {
            var children = this.bxChildren

            for (var i = 0; i < children.length; i++) {
                if (children[i].bxName === name) {
                    return children[i]
                }
            }
        },

        bxDelegate: function(el) {
            el = el || this.get('el')
            var c = this.constructor

            while (c) {
                this.bxDelegateMap(c.EVENTS)
                c = c.superclass ? c.superclass.constructor : null
            }
        },

        bxDelegateMap: function(eventsMap) {
            var el = this.get('el')
            var Event = S.Event

            for (var sel in eventsMap) {
                var events = eventsMap[sel]

                for (var type in events) {
                    var fn = events[type]

                    if (sel === 'self') {
                        el.on(type, fn, this)
                    }
                    else if (sel === 'window') {
                        Event.on(window, type, fn, this)
                    }
                    else if (sel === 'body') {
                        Event.on('body', type, fn, this)
                    }
                    else if (sel === 'document') {
                        Event.on(document, type, fn, this)
                    }
                    else {
                        el.delegate(type, sel, fn, this)
                    }
                }
            }
        },

        bxUndelegate: function(el) {
            el = el || this.get('el')
            var c = this.constructor

            while (c) {
                this.bxUndelegateMap(c.EVENTS)
                c = c.superclass ? c.superclass.constructor : null
            }
        },

        bxUndelegateMap: function(eventsMap) {
            var el = this.get('el')
            var Event = S.Event

            for (var sel in eventsMap) {
                var events = eventsMap[sel]

                for (var type in events) {
                    var fn = events[type]

                    if (sel === 'self') {
                        el.detach(type, fn, this)
                    }
                    else if (sel === 'window') {
                        Event.detach(window, type, fn, this)
                    }
                    else if (sel === 'body') {
                        Event.detach('body', type, fn, this)
                    }
                    else if (sel === 'document') {
                        Event.detach(document, type, fn, this)
                    }
                    else {
                        el.undelegate(type, sel, fn, this)
                    }
                }
            }
        },

        /* use cases:
         *
         *     this.bxOptions(el)            // get options of current brick
         *     this.bxOptions(el, MyBrick)   // get options of MyBrick
         */
        bxOptions: function(el, c) {
            c = c || this.constructor
            var optionList = []

            while (c) {
                if (S.isArray(c.OPTIONS)) {
                    optionList = optionList.concat(c.OPTIONS)
                }
                c = c.superclass ? c.superclass.constructor : null
            }

            el = el || this.get('el')
            var opts = {}

            for (var i = 0; i < optionList.length; i++) {
                var p = optionList[i]

                opts[p] = this.bxCastString(el.attr('data-' + p))
            }

            return opts
        },

        bxCastString: function(str) {
            str = S.trim(str)

            if (/^(?:true|false)$/.test(str)) {
                return str === 'true'
            }
            else if (/^\d+$/.test(str)) {
                return parseInt(str, 10)
            }
            else {
                return str
            }
        }
    }

    return exports

}, {
    requires: [
        'node',
        'sizzle',
        'event'
    ]
});
KISSY.add('brix/core/bx-template', function(S, app) {

    var exports = {
        bxTemplate: function(el) {
            var source = el.attr('bx-template')

            if (!source && el.attr('bx-model')) {
                source = '.'
            }
            if (!source) {
                // 不需要在前端渲染模板
                return
            }
            else if (source.charAt(0) === '#') {
                this.bxScriptTemplate(source)
            }
            else if (source === '.') {
                this.bxHereTemplate(el)
            }
            else if (/^\.\//.test(source)) {
                this.bxRemoteTemplate(el.attr('bx-name') + source.substr(1))
            }
            else if (source === 'cached') {
                var withinEach = false
                var parent = el

                /*jshint boss:true*/
                while ((parent = parent.parent()) && parent !== el) {
                    if (parent.attr('bx-each')) {
                        withinEach = true
                        break
                    }
                    // if found parent with [bx-name] first, then this brick is
                    // not within each.
                    else if (parent.attr('bx-name')) {
                        break
                    }
                }
                var subTemplets = this.bxParent.bxCachedSubTemplets

                this.set('template', withinEach ? subTemplets[0] : subTemplets.shift())
            }
        },

        bxScriptTemplate: function(selector) {
            this.set('template', S.one(selector).html())
        },

        bxHereTemplate: function(ele) {
            this.set('template', ele.html())
        },

        bxRemoteTemplate: function(mod) {
            if (app.config('debug')) {
                this.bxXhrTemplate(mod)
            }
            else {
                var self = this

                S.use(mod, function(S, template) {
                    self.set('template', template)
                })
            }
        },

        bxXhrTemplate: function(mod) {
            if (!/^http/.test(location.href)) {
                throw Error('Cannot load template via xhr in current mode.')
            }
            var parts = mod.split('/')
            var ns = parts.shift()
            var name = parts.shift()
            var file = parts.shift()
            var base = S.config('packages')[ns].base
            var imports = app.config('imports')

            if (imports[ns]) {
                if (!(new RegExp(ns + '\\/?$')).test(base)) {
                    parts.push(ns)
                }
                parts.push(name)
                parts.push(imports[ns][name])
            }
            else {
                parts.push(name)
            }
            parts.push(file + '.html')

            var self = this
            S.io.get(base + parts.join('/'), function(template) {
                self.set('template', template)
            })
        }
    }

    return exports
}, {
    requires: [
        'brix/app/config',
        'node',
        'ajax',
        'sizzle'
    ]
});
KISSY.add('brix/core/bx-watch', function(S, app) {

    var exports = {
        bxWatch: function(el) {
            var watches = el.all('[bx-watch]')
            var watchers = this.bxWatchers = []
            var watch
            var keys
            var id

            for (var i = 0; i < watches.length; i++) {
                watch = S.Node(watches[i])
                keys = watch.attr('bx-watch').split(/[, ]/)
                id = watch.attr('id')

                if (!id) {
                    id = 'bx-watch-' + S.guid()
                    watch.attr('id', id)
                }
                watchers[i] = {
                    keys: keys,
                    template: watch.html(),
                    container: '#' + id
                }
            }

            var eaches = el.all('[bx-each]')

            for (i = 0; i < eaches.length; i++) {
                watch = S.Node(eaches[i])

                var key = watch.attr('bx-each')
                var parent = watch.parent()

                keys = [key]
                id = parent.attr('id')

                if (!id) {
                    id = 'bx-watch-' + S.guid()
                    parent.attr('id', id)
                }
                watchers.push({
                    keys: keys,
                    template: watch.outerHTML(),
                    container: '#' + id
                })
            }
        },

        bxChange: function(key, data) {
            var watchers = this.bxWatchers
            var engine = app.config('templateEngine')
            var result

            for (var i = 0; i < watchers.length; i++) {
                var watcher = watchers[i]

                if (S.inArray(key, watcher.keys)) {
                    var parts = key.split('.')
                    var obj = {}
                    var wrap = obj
                    var p

                    /*jshint boss:true*/
                    while (p = parts.shift()) {
                        obj[p] = parts.length > 0 ? {} : data
                        obj = obj[p]
                    }

                    if (engine) {
                        result = engine.render(watcher.template, wrap)
                    }
                    else {
                        result = this.bxDirectivePartial(watcher.template, wrap)
                    }

                    var anchor = watcher.anchor
                    var container = watcher.container

                    if (container) {
                        S.one(container).html(result)
                    }
                    // anchor support?
                    else if (anchor) {
                        anchor = S.one(anchor)
                        anchor.parent().insertBefore(S.Node(result), anchor.next())
                    }
                }
            }
        }
    }

    return exports
}, {
    requires: ['brix/app/config']
});
KISSY.add('brix/directive/bx-boolean', function() {

    var PROPS = ['bx-readonly', 'bx-disabled', 'bx-checked']

    var BX_PREFIX = /^bx-/

    var exports = {
        bxBooleanWrap: function(node) {
            for (var i = 0; i < PROPS.length; i++) {
                this.bxBooleanWrapEach(node, PROPS[i])
            }
        },

        bxBooleanWrapEach: function(node, prop) {
            var booleans = this.bxDirectDirective(node, prop)

            for (var i = 0; i < booleans.length; i++) {
                var bool = booleans[i]

                bool.attr(prop, '{{#if ' + this.bxSealOperators(bool.attr(prop)) + '}}true{{/if}}')
            }
        },

        bxBooleanStrip: function(node) {
            for (var i = 0; i < PROPS.length; i++) {
                this.bxBooleanStripEach(node, PROPS[i])
            }
        },

        bxBooleanStripEach: function(node, prop) {
            var naked = prop.replace(BX_PREFIX, '')
            var booleans = this.bxDirectDirective(node, prop)

            for (var i = 0; i < booleans.length; i++) {
                var bool = booleans[i]

                if (bool.attr(prop)) {
                    bool.attr(naked, naked)
                }
            }
        }
    }

    return exports
});
KISSY.add('brix/directive/bx-class', function() {

    var KLASS_PTN = /^\s*([\-_a-z0-9]+(?:\s+[\-_a-z0-9]+)*?)\s+if\s+([!\w]+)\s*$/i

    var exports = {
        bxClassWrap: function(node) {
            var klasses = this.bxAllDirective(node, 'bx-class')

            for (var i = 0; i < klasses.length; i++) {
                var klass = klasses[i]
                var matches = klass.attr('bx-class').match(KLASS_PTN)
                var classList = matches[1]
                var cond = matches[2]

                klass.attr('bx-class', '{{#if ' + cond + '}}' + classList + '{{/if}}')
            }
        },

        bxClassStrip: function(node) {
            var klasses = this.bxAllDirective(node, 'bx-class')

            for (var i = 0; i < klasses.length; i++) {
                var klass = klasses[i]
                var classList = klass.attr('bx-class')

                if (classList) {
                    klass.addClass(classList)
                }
                klass.removeAttr('bx-class')
            }
        }
    }

    return exports
});
KISSY.add('brix/directive/bx-each', function(S) {

    var exports = {
        bxEachWrap: function(node) {
            var eaches = this.bxAllDirective(node, 'bx-each')
            var DOM = S.DOM

            for (var i = 0; i < eaches.length; i++) {
                var r = eaches[i]
                var k = r.attr('bx-each')

                this.bxEachMarkIndex(r, k)

                var startSymbole = document.createTextNode('{{#each ' + k + '}}')
                var endSymbole = document.createTextNode('{{/each}}')

                DOM.insertBefore(startSymbole, r)
                DOM.insertAfter(endSymbole, r)

                // r.removeAttr('bx-each')
            }
        },

        bxEachMarkIndex: function(node) {
            // utilize the xindex variable provided by XTemplate
            node.attr('bx-each-index', '{{xindex}}')
        }
    }

    return exports
});
KISSY.add('brix/directive/bx-if-else', function(S) {

    var exports = {
        bxIfElseWrap: function(node) {
            var ifs = this.bxAllDirective(node, 'bx-if')
            var DOM = S.DOM

            for (var i = 0; i < ifs.length; i++) {
                var positive = ifs[i]
                var negative = positive.next()

                if (negative && !negative.hasAttr('bx-else')) {
                    negative = null
                }
                var cond = this.bxSealOperators(positive.attr('bx-if'))
                var ifSymbole = document.createTextNode('{{#if ' + cond + '}}')
                var endSymbole = document.createTextNode('{{/if}}')

                positive.removeAttr('bx-if')
                DOM.insertBefore(ifSymbole, positive)
                if (negative) {
                    var elseSymbole = document.createTextNode('{{else}}')

                    negative.removeAttr('bx-else')
                    DOM.insertBefore(elseSymbole, negative)
                    DOM.insertAfter(endSymbole, negative)
                }
                else {
                    DOM.insertAfter(endSymbole, positive)
                }
            }
        }
    }

    return exports
});
KISSY.add('brix/directive/bx-select', function(S) {

    var QUERY_PTN = /^\s*(\w+)\s+in\s+(\w+)\s*$/

    var exports = {
        bxSelectWrap: function(node) {
            var DOM = S.DOM
            var doc = document
            var selects = this.bxAllDirective(node, 'bx-select')

            for (var i = 0; i < selects.length; i++) {
                var sel = selects[i]
                var matches = sel.attr('bx-select').match(QUERY_PTN)
                var cond = matches[1]
                var list = matches[2]

                DOM.insertBefore(doc.createTextNode('{{#each ' + list + '}}'), sel)
                DOM.insertAfter(doc.createTextNode('{{/each}}'), sel)

                DOM.insertBefore(doc.createTextNode('{{#if ' + cond + '}}'), sel)
                DOM.insertAfter(doc.createTextNode('{{/if}}'), sel)

                sel.removeAttr('bx-select')
            }
        }
    }

    return exports
});
KISSY.add('brix/directive/bx-src', function() {

    var exports = {
        bxSrcStrip: function(node) {
            var srcs = this.bxAllDirective(node, 'bx-src')

            for (var i = 0; i < srcs.length; i++) {
                var src = srcs[i]

                src.attr('src', src.attr('bx-src'))
                src.removeAttr('bx-attr')
            }
        }
    }

    return exports
});

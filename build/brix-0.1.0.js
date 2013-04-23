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
                this.mapStamp()
                this.mapImports()
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

            stamp: null,

            namespace: null
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

        mapStamp: function() {
            var stamp = this.config('stamp')
            var ns = this.config('namespace')

            function injectStamp(m, name, file) {
                return [ns, stamp, name, file].join('/')
            }

            S.config('map', [
                [new RegExp(ns + '\\/([^\\/]+)\\/([^\\/]+)$'), injectStamp]
            ])
        },

        mapImports: function() {
            var maps = []
            var imports = this.config('imports')

            function makeReplacer(ns) {
                return function(match, name, file) {
                    return [ns, name, imports[ns][name], file].join('/')
                }
            }

            for (var ns in imports) {
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
            var imports = this.config('imports')
            var styles = []
            var comp
            var ns

            for (ns in imports) {
                for (comp in imports[ns]) {
                    styles.push([ns, comp, 'index.css'].join('/'))
                }
            }
            var components = this.config('components')

            ns = this.config('namespace')
            for (var i = 0; i < components.length; i++) {
                styles.push([ns, components[i], 'index.css'].join('/'))
            }

            return styles
        }
    }

    return exports
});
KISSY.add('brix/app/page', function(S, Base, bxName, bxScope) {

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
                        el.attr('id', 'bx-page' + S.guid())
                    }
                    return '#' + el.attr('id')
                }
            }
        }
    }

    S.extend(BxPage, Base)
    S.augment(BxPage, bxName, bxScope)

    return BxPage
}, {
    requires: ['base', 'brix/core/bx-name', 'brix/core/bx-scope']
});
KISSY.add('brix/base', function(S, bxName, bxTemplate, bxScope, bxDirective, app, RichBase) {

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

    S.augment(BxBase, bxName, bxTemplate, bxScope, bxDirective, {
        initialize: function(el) {
            el = el || this.get('el')
            if (!el.hasAttr('bx-template')) {
                this.bxLoad(el)
            }
            else {
                this.on('afterTemplateChange', this.bxBindScope, this)
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

        bxBindScope: function() {
            var el = this.get('el')
            var scope = el.attr('bx-scope')
            var data = this.bxParent.bxScope(scope)

            this.set('data', data)
        },

        bxRender: function() {
            var el = this.get('el')
            var template = this.get('template')
            var engine = app.config('templateEngine')
            var data = {}
            var res = null
            var key = this.bxName.split('/').pop()

            data[key] = this.get('data')
            if (engine && S.isFunction(engine.render)) {
                res = engine.render(template, data)
            }
            else {
                res = this.bxDirective(template, data[key])
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
        'brix/core/bx-scope',
        'brix/core/bx-directive',
        'brix/app/config',
        'rich-base'
    ]
});
KISSY.add('brix/core/bx-directive',
          function(S, bxIfElse, bxEach, bxBoolean, bxSrc, XTemplate) {

    var exports = {
        bxDirective: function(template, data) {
            var Node = S.Node
            var div
            var templateCache = this.get('templateCache')

            if (!templateCache) {
                div = Node('<div>', {
                    html: template
                })

                this.bxIfElse(div)
                this.bxEach(div)
                this.bxBoolean(div)

                template = this.bxUnsealOperators(div.html())
                templateCache = new XTemplate(template)

                this.set('templateCache', templateCache)
            }
            div = Node('<div>', {
                html: templateCache.render(data)
            })

            this.bxBooleanStrip(div)
            this.bxSrcStrip(div)

            return div.html()
        },

        bxDirectDirective: function(node, attr) {
            return this.bxDirectChildren(node, '[' + attr + ']')
        }
    }

    S.mix(exports, bxIfElse)
    S.mix(exports, bxEach)
    S.mix(exports, bxBoolean)
    S.mix(exports, bxSrc)

    return exports
}, {
    requires: [
        'brix/directive/bx-if-else',
        'brix/directive/bx-each',
        'brix/directive/bx-boolean',
        'brix/directive/bx-src',
        'xtemplate',
        'node'
    ]
});
KISSY.add('brix/core/bx-name', function(S, Node) {

    var exports = {
        // #bxName is occupied as the name of current instance of component.
        // It is for the bricks tree structure.
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

        /**
         * Get child elements of current node which may or may not have
         * attribute bx-name.
         *
         * Given DOM structures like:
         *
         *     <div bx-name="foo/egg" bx-scope="cart">
         *       <div bx-each="item in items"></div>
         *       <div bx-name="foo/ham" bx-scope="item">
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

        // use cases:
        // - this.bxOptions(el)            // get options of current brick
        // - this.bxOptions(el, MyBrick)   // get options of MyBrick
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
KISSY.add('brix/core/bx-scope', function(S) {

    var exports = {
        bxScope: function(attr) {
            var data = this.get('data')

            if (S.isFunction(this[attr])) {
                return (this[attr])()
            }
            else if (data[attr]) {
                return data[attr]
            }
        }
    }

    return exports
});
KISSY.add('brix/core/bx-template', function(S, app) {

    var exports = {
        bxTemplate: function(ele) {
            var source = ele.attr('bx-template')

            if (!source) {
                // 不需要在前端渲染模板
                return
            }

            if (source.charAt(0) === '#') {
                this.bxScriptTemplate(source)
            }
            else if (source === '.') {
                this.bxHereTemplate(ele)
            }
            else if (/^\.\//.test(source)) {
                this.bxRemoteTemplate(ele.attr('bx-name') + source.substr(1))
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
KISSY.add('brix/directive/bx-boolean', function() {

    var PROPS = ['bx-readonly', 'bx-disabled', 'bx-checked']

    var BX_PREFIX = /^bx-/

    var OPERATORS = [
        ['>', 'gt', />/g, /\sbx-boolean-gt\s/g],
        ['>=', 'gte', />=/g, /\sbx-boolean-gte\s/g],
        ['<=', 'lte', /<=/g, /\sbx-boolean-lte\s/g],
        ['<', 'lt', /</g, /\sbx-boolean-lt\s/g],
        ['&&', 'and', /\&{2}/g, /\sbx-boolean-and\s/g],
        ['||', 'or', /\|{2}/g, /\sbx-boolean-or\s/g]
    ]

    var OPERATOR_PREFIX = 'bx-boolean-'

    var exports = {
        bxBoolean: function(node) {
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

    return exports
});
KISSY.add('brix/directive/bx-each', function(S) {

    var exports = {
        bxEach: function(node) {
            var eaches = this.bxDirectDirective(node, 'bx-each')
            var DOM = S.DOM

            for (var i = 0; i < eaches.length; i++) {
                var r = eaches[i]
                var k = r.attr('bx-each')
                var startSymbole = document.createTextNode('{{#each ' + k + '}}')
                var endSymbole = document.createTextNode('{{/each}}')

                DOM.insertBefore(startSymbole, r)
                DOM.insertAfter(endSymbole, r)
            }
        }
    }

    return exports
});
KISSY.add('brix/directive/bx-if-else', function(S) {

    var exports = {
        bxIfElse: function(node) {
            var ifs = this.bxDirectDirective(node, 'bx-if')
            var DOM = S.DOM

            for (var i = 0; i < ifs.length; i++) {
                var positive = ifs[i]
                var negative = positive.next()

                if (negative && !negative.hasAttr('bx-else')) {
                    negative = null
                }
                var ifSymbole = document.createTextNode('{{#if ' + positive.attr('bx-if') + '}}')
                var endSymbole = document.createTextNode('{{/if}}')

                DOM.insertBefore(ifSymbole, positive)
                if (negative) {
                    var elseSymbole = document.createTextNode('{{else}}')

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
KISSY.add('brix/directive/bx-src', function() {

    var exports = {
        bxSrcStrip: function(node) {
            var srcs = this.bxDirectDirective(node, 'bx-attr')

            for (var i = 0; i < srcs.length; i++) {
                var src = srcs[i]

                src.attr('src', src.attr('bx-attr'))
            }
        }
    }

    return exports
});

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
})
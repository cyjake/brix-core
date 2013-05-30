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
})
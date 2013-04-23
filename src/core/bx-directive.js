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
})
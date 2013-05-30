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
})
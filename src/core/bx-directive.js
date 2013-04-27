KISSY.add('brix/core/bx-directive',
          function(S, bxIfElse, bxEach, bxBoolean, bxSrc, bxSelect, bxClass, XTemplate) {

    var OPERATORS = [
        ['>', 'gt', />/g, /\sbx-operator-gt\s/g],
        ['>=', 'gte', />=/g, /\sbx-operator-gte\s/g],
        ['<=', 'lte', /<=/g, /\sbx-operator-lte\s/g],
        ['<', 'lt', /</g, /\sbx-operator-lt\s/g],
        ['&&', 'and', /\&{2}/g, /\sbx-operator-and\s/g]
    ]

    var OPERATOR_PREFIX = 'bx-boolean-'

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

        bxDirectDirective: function(node, attr) {
            return this.bxDirectChildren(node, '[' + attr + ']')
        },

        /**
         * For unification of directive nodes querying api.
         * To select whether all of its child directives or just those which
         * belong to current brick directly , it is a question.
         *
         * 全部指令节点都取到，预处理成 XTemplate 模板字符串，直接渲染；
         * 还是只取当前组件的指令节点，下一层的交给下一层组件处理。这是个问题。
         */
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
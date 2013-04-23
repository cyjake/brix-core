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
})
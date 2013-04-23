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
})
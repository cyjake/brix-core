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
})
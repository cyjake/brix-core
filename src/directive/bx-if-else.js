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
})
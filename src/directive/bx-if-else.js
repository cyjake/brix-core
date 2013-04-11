KISSY.add('brix/directive/bx-if-else', function(S) {

    var exports = {
        bxIfElse: function(node, data) {
            var NodeList = S.NodeList
            var ifs = this.bxDirectSiblings(node, 'bx-if')

            for (var i = 0; i < ifs.length; i++) {
                var positive = ifs[i]
                var negative = positive.next()

                console.log(negative.outerHTML(), negative.hasAttr('bx-else'))
                if (negative && !negative.hasAttr('bx-else')) {
                    negative = null
                }
                var cond = positive.attr('bx-if')

                positive.removeAttr('bx-if')
                if (data[cond]) {
                    NodeList(this.bxDirective(positive.html(), data)).insertBefore(positive)
                }
                else {
                    if (negative) {
                        negative.removeAttr('bx-else')
                        NodeList(this.bxDirective(negative.html(), data)).insertBefore(negative)
                    }
                }
                if (negative) {
                    negative.remove()
                }
                positive.remove()
            }
        }
    }

    return exports
}, {
    requires: [
        'node'
    ]
})
KISSY.add('brix/core/bx-directive', function(S, bxIfElse, bxRepeat, XTemplate) {

    var exports = {
        bxDirective: function(template, data) {
            var div = S.Node('<div>', {
                html: template
            })

            this.bxIfElse(div, data)
            this.bxRepeat(div, data)

            return new XTemplate(div.html()).render(data)
        },

        bxDirectSiblings: function(root, attr) {
            var arr = []
            var selectors = '[bx-name], [bx-if], [bx-else], [bx-repeat]'

            root.all('[' + attr + ']').each(function(ele) {
                if (!ele.parent(selectors)) {
                    arr.push(ele)
                }
            })

            return arr
        }
    }

    S.mix(exports, bxIfElse)
    S.mix(exports, bxRepeat)

    return exports
}, {
    requires: [
        'brix/directive/bx-if-else',
        'brix/directive/bx-repeat',
        'xtemplate',
        'node'
    ]
})
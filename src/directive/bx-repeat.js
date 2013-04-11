KISSY.add('brix/directive/bx-repeat', function(S) {

    var exports = {
        bxRepeat: function(node, data) {
            var self = this
            var NodeList = S.NodeList
            var eles = this.bxDirectSiblings(node, 'bx-repeat')

            for (var i = 0; i < eles.length; i++) {
                var ele = eles[i]
                var parts = ele.attr('bx-repeat').split(/\s+in\s+/)
                var template = ele.removeAttr('bx-repeat').outerHTML()

                var keychain = parts[1].split('.')
                var j
                var list = data

                for (j = 0; j < keychain.length; j++) {
                    list = list[keychain[j]]
                }

                for (j = 0; j < list.length; j++) {
                    var obj = {}

                    obj[parts[0]] = list[j]
                    var res = self.bxDirective(template, obj)

                    NodeList(res).insertBefore(ele)
                }

                ele.remove()
            }
        }
    }

    return exports
}, {
    requires: [
        'node'
    ]
})
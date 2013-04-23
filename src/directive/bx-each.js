KISSY.add('brix/directive/bx-each', function(S) {

    var exports = {
        bxEach: function(node) {
            var eaches = this.bxDirectDirective(node, 'bx-each')
            var DOM = S.DOM

            for (var i = 0; i < eaches.length; i++) {
                var r = eaches[i]
                var k = r.attr('bx-each')
                var startSymbole = document.createTextNode('{{#each ' + k + '}}')
                var endSymbole = document.createTextNode('{{/each}}')

                DOM.insertBefore(startSymbole, r)
                DOM.insertAfter(endSymbole, r)
            }
        }
    }

    return exports
})
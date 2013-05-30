KISSY.add('brix/directive/bx-select', function(S) {

    var QUERY_PTN = /^\s*(\w+)\s+in\s+(\w+)\s*$/

    var exports = {
        bxSelectWrap: function(node) {
            var DOM = S.DOM
            var doc = document
            var selects = this.bxAllDirective(node, 'bx-select')

            for (var i = 0; i < selects.length; i++) {
                var sel = selects[i]
                var matches = sel.attr('bx-select').match(QUERY_PTN)
                var cond = matches[1]
                var list = matches[2]

                DOM.insertBefore(doc.createTextNode('{{#each ' + list + '}}'), sel)
                DOM.insertAfter(doc.createTextNode('{{/each}}'), sel)

                DOM.insertBefore(doc.createTextNode('{{#if ' + cond + '}}'), sel)
                DOM.insertAfter(doc.createTextNode('{{/if}}'), sel)

                sel.removeAttr('bx-select')
            }
        }
    }

    return exports
})
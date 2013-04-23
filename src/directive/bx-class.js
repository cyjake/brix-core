KISSY.add('brix/directive/bx-class', function() {

    var KLASS_PTN = /^\s*([\-_a-z0-9]+(?:\s+[\-_a-z0-9]+)*?)\s+if\s+([!\w]+)\s*$/i

    var exports = {
        bxClassWrap: function(node) {
            var klasses = this.bxAllDirective(node, 'bx-class')

            for (var i = 0; i < klasses.length; i++) {
                var klass = klasses[i]
                var matches = klass.attr('bx-class').match(KLASS_PTN)
                var classList = matches[1]
                var cond = matches[2]

                klass.attr('bx-class', '{{#if ' + cond + '}}' + classList + '{{/if}}')
            }
        },

        bxClassStrip: function(node) {
            var klasses = this.bxAllDirective(node, 'bx-class')

            for (var i = 0; i < klasses.length; i++) {
                var klass = klasses[i]
                var classList = klass.attr('bx-class')

                if (classList) {
                    klass.addClass(classList)
                }
                klass.removeAttr('bx-class')
            }
        }
    }

    return exports
})
KISSY.add('brix/directive/bx-src', function() {

    var exports = {
        bxSrcStrip: function(node) {
            var srcs = this.bxAllDirective(node, 'bx-attr')

            for (var i = 0; i < srcs.length; i++) {
                var src = srcs[i]

                src.attr('src', src.attr('bx-attr'))
                src.removeAttr('bx-attr')
            }
        }
    }

    return exports
})
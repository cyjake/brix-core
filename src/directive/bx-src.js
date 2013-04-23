KISSY.add('brix/directive/bx-src', function() {

    var exports = {
        bxSrcStrip: function(node) {
            var srcs = this.bxDirectDirective(node, 'bx-attr')

            for (var i = 0; i < srcs.length; i++) {
                var src = srcs[i]

                src.attr('src', src.attr('bx-attr'))
            }
        }
    }

    return exports
})
KISSY.add('ux.demo/footer/index', function(S, Brick) {

    function Footer(opts) {
        Footer.superclass.constructor.call(this, opts)
    }

    S.extend(Footer, Brick, {
        initialize: function() {
            equal(this.get('el').attr('bx-name'), 'ux.demo/footer')
        }
    })

    return Footer
}, {
    requires: ['brix/base']
})
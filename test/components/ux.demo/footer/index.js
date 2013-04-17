KISSY.add('ux.demo/footer/index', function(S, BxBase) {

    function Footer(opts) {
        Footer.superclass.constructor.call(this, opts)
    }

    Footer.OPTIONS = ['foo', 'bar', 'ham']

    S.extend(Footer, BxBase)

    return Footer
}, {
    requires: ['brix/base']
})
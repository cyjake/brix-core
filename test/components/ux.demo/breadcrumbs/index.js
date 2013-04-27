KISSY.add('ux.demo/breadcrumbs/index', function(S, Brick) {

    function Breadcrumbs(opts) {
        Breadcrumbs.superclass.constructor.call(this, opts)
    }

    S.extend(Breadcrumbs, Brick)

    return Breadcrumbs
}, {
    requires: ['brix/base']
})
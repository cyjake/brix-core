KISSY.add('ux.shopping-ads/ceiling/index', function(S, Brick) {

    function Ceiling(opts) {
        Ceiling.superclass.constructor.call(this, opts)
        equal(opts.el.attr('bx-name'), 'ux.demo/ceiling')
    }

    S.extend(Ceiling, Brick)

    return Ceiling
}, {
    requires: ['brix/base']
})
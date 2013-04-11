KISSY.add('shopping-ads/ceiling/index', function(S, Brick) {

    function Ceiling(opts) {
        Ceiling.superclass.constructor.call(this, opts)
        equal(opts.el.attr('bx-name'), 'brix-test/ceiling')
    }

    S.extend(Ceiling, Brick)

    return Ceiling
}, {
    requires: ['brix/base']
})
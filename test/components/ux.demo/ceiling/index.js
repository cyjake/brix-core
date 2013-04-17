KISSY.add('ux.demo/ceiling/index', function(S, SCeiling) {

    function Ceiling(opts) {
        Ceiling.superclass.constructor.call(this, opts)
    }

    S.extend(Ceiling, SCeiling)

    return Ceiling

}, {
    requires: ['ux.shopping-ads/ceiling/index']
})
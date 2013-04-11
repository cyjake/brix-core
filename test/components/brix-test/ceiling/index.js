KISSY.add('brix-test/ceiling/index', function(S, SCeiling) {

    function Ceiling(opts) {
        Ceiling.superclass.constructor.call(this, opts)
    }

    S.extend(Ceiling, SCeiling)

    return Ceiling

}, {
    requires: ['shopping-ads/ceiling/index']
})
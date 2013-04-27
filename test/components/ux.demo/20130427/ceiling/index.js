KISSY.add('ux.demo/ceiling/index', function(S, Brick) {

    function Ceiling(opts) {
        Ceiling.superclass.constructor.call(this, opts)
    }

    S.extend(Ceiling, Brick, {
        initialize: function() {
            equal(this.get('el').attr('bx-name'), 'ux.demo/ceiling')
        }
    })

    return Ceiling
}, {
    requires: ['brix/base']
})
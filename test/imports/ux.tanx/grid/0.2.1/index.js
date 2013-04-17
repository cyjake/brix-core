KISSY.add('ux.tanx/grid/index', function(S, BxBase) {

    function Grid(opts) {
        Grid.superclass.constructor.call(this, opts)
        equal(opts.el.attr('bx-name'), 'ux.tanx/grid')
    }

    S.extend(Grid, BxBase)

    return Grid
}, {
    requires: ['brix/base']
})
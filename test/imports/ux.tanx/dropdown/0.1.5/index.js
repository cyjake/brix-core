KISSY.add('ux.tanx/dropdown/index', function(S, Brick) {

    function Dropdown(opts) {
        equal(opts.el.attr('bx-name'), 'ux.tanx/dropdown')
        Dropdown.superclass.constructor.call(this, opts)
    }

    S.extend(Dropdown, Brick)

    return Dropdown
}, {
    requires: ['brix/base']
})
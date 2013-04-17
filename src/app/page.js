KISSY.add('brix/app/page', function(S, Base, bxName, bxScope) {

    function BxPage(opts) {
        BxPage.superclass.constructor.call(this, opts)
    }

    BxPage.ATTRS = {
        data: null,

        el: {
            getter: function(elId) {
                return elId && S.one(elId)
            },
            setter: function(el) {
                if (el) {
                    if (!el.attr('id')) {
                        el.attr('id', 'bx-page' + S.guid())
                    }
                    return '#' + el.attr('id')
                }
            }
        }
    }

    S.extend(BxPage, Base)
    S.augment(BxPage, bxName, bxScope)

    return BxPage
}, {
    requires: ['base', 'brix/core/bx-name', 'brix/core/bx-scope']
})
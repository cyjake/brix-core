KISSY.add('brix/app', function(S, BxPage, appConfig) {

    function BxApp() {
        BxApp.superclass.constructor.call(this)
    }

    S.extend(BxApp, S.Base)

    BxApp.ATTRS = {
        prepared: false
    }

    S.augment(BxApp, appConfig, {
        boot: function(el, data) {
            this.prepareLoader()

            if (S.isPlainObject(el)) {
                data = el
                el = '[bx-app]'
            }
            el = el || '[bx-app]'
            el = S.isString(el) ? S.one(el) : el

            if (el) {
                var page = new BxPage({
                    el: el,
                    data: data
                })

                page.bxLoad(el)

                return page
            }
        },

        bootStyle: function(fn) {
            this.prepareLoader()

            S.use(this.comboStyle().join(','), fn)
        },

        prepareLoader: function() {
            if (!this.get('prepared')) {
                this.mapStamp()
                this.mapImports()
                this.packageImports()
                this.packageComponents()
                this.set('prepared', true)
            }
        }
    })

    var app = new BxApp()

    return app
}, {
    requires: [
        'brix/app/page',
        'brix/app/config',
        'base'
    ]
})
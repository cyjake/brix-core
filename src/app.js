KISSY.add('brix/app', function(S, bxName, bxScope, appConfig) {

    function BxApp() {
        BxApp.superclass.constructor.call(this)
    }

    S.extend(BxApp, S.Base)

    BxApp.ATTRS = {
        data: null,

        prepared: false,

        el: {
            getter: function(elId) {
                return elId && S.one(elId)
            },
            setter: function(el) {
                if (el) {
                    if (!el.attr('id')) {
                        el.attr('id', 'bx-app')
                    }
                    return '#' + el.attr('id')
                }
            }
        }
    }

    S.augment(BxApp, bxName, bxScope, appConfig, {
        boot: function(el) {
            this.prepareLoader()

            el = el || '[bx-app]'
            if (S.isString(el)) {
                el = S.one(el)
            }
            if (el) {
                this.set('el', el)
            }

            this.bxLoad(el)
        },

        reload: function() {
            this.bxChildren = []
            this.detach('bx:ready')
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
        'brix/core/bx-name',
        'brix/core/bx-scope',
        'brix/core/app-config',
        'base'
    ]
})
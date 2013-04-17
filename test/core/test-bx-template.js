KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../../src'
        }
    }
})

KISSY.use('base, brix/core/bx-template, brix/app',
          function(S, Base, bxTemplate, app) {

    var Foo = function() {
        Foo.superclass.constructor.call(this)
    }
    var foo

    S.extend(Foo, Base)
    S.augment(Foo, bxTemplate)

    module('@bx-template', {
        setup: function() {
            foo = new Foo()
        }
    })

    asyncTest('#bxHereTemplate', function() {
        foo.bxTemplate(S.one('[bx-name="ux.shopping-ads/ceiling"]'))
        ok(S.Node(foo.get('template')).one('a'))
        start()
    })

    asyncTest('#bxScriptTemplate', function() {
        foo.bxTemplate(S.one('[bx-name="ux.diamond/sidenav"]'))
        ok(S.Node(foo.get('template')).hasClass('diamond-sidenav'))
        start()
    })

    asyncTest('#bxRemoteTemplate', function() {
        // let brix app finish configurations first
        app.config('debug', false)
        app.config('base', '../')
        app.config('imports', {
            'ux.tanx': {
                dropdown: '0.1.5'
            }
        })

        app.prepareLoader()
        foo.on('afterTemplateChange', function() {
            ok(S.Node(foo.get('template')).hasClass('tanx-dropdown'))
            start()
        })
        foo.bxTemplate(S.one('[bx-name="ux.tanx/dropdown"]'))
    })

    if (/^http:\/\//.test(location.href)) {
        asyncTest('#bxRemoteTemplate dev mode', function() {
            app.config('debug', true)

            foo.on('afterTemplateChange', function() {
                var ele = S.Node(foo.get('template'))

                ok(ele.hasClass('tanx-dropdown'))
                ok(ele.all('[bx-repeat]').length > 0)
                start()
            })
            foo.bxTemplate(S.one('[bx-name="ux.tanx/dropdown"]'))
        })
    }
})
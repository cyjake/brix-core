KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../src/'
        }
    }
})

KISSY.use('brix/app', function(S, app) {
    app.config('namespace', 'ux.demo')
    app.config('imports', {
        'ux.shopping-ads': {
            ceiling: '0.1.0'
        },
        'ux.tanx': {
            dropdown: '0.1.5',
            message: '0.1.2'
        }
    })

    asyncTest('#boot app basic', function() {
        app.boot('#fixture1').on('bx:ready', start)
    })

    asyncTest('#boot app with style', function() {
        app.bootStyle(function() {
            app.boot('#fixture2').on('bx:ready', start)
        })
    })
})

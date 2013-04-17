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
            dropdown: '0.1.5'
        }
    })

    asyncTest('#boot app', function() {
        app.boot().on('bx:ready', function() {
            start()
        })
    })
})

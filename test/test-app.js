KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../src/'
        }
    }
})

KISSY.use('brix/app', function(S, app) {
    app.config('namespace', 'brix-test')
    app.config('imports', {
        'shopping-ads': {
            ceiling: '0.1.0'
        },
        'tanx': {
            dropdown: '0.1.5'
        }
    })

    app.boot()

    asyncTest('#boot app', function() {
        app.on('bx:ready', function() {
            start()
        })
    })
})

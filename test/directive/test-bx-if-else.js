KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../../src'
        }
    }
})

KISSY.use('brix/app', function(S, app) {
    app.config({
        base: '../',
        namespace: 'brix-test'
    })
    app.config('imports', {
        tanx: {
            message: '0.1.2'
        }
    })

    app.set('data', {
        messages: {
            error: {
                message: '最近风声紧，低调。'
            }
        }
    })

    asyncTest('#bxIfElse', function() {
        app.on('bx:ready', function() {
            start()
        })
        app.boot()
    })
})

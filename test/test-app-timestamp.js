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
    app.config({
        timestamp: 20130427,
        components: [
            'ceiling',
            'footer'
        ]
    })

    asyncTest('#boot app via timestamp', function() {
        app.boot('#fixture2').on('bx:ready', start)
    })

    asyncTest('#boot app via timestamp with style', function() {
        app.bootStyle(function() {
            app.boot('#fixture3').on('bx:ready', start)
        })
    })
})

KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../src/'
        }
    }
})

KISSY.use('brix/app', function(S, app) {
    app.config('namespace', 'ux.lego')
    app.config({
        components: {
            ceiling: '0.1.1',
            footer: '0.1.1'
        }
    })

    asyncTest('#boot app via components lock', function() {
        app.boot('#fixture2').on('bx:ready', start)
    })

    asyncTest('#boot app via components lock with style', function() {
        app.bootStyle(function() {
            app.boot('#fixture3').on('bx:ready', start)
        })
    })
})

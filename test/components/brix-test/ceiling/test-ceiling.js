KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../../../../src/'
        }
    }
})

KISSY.use('brix/app', function(S, app) {
    app.config({
        base: '../../../',
        namespace: 'brix-test'
    })

    app.config('imports', {
        'shopping-ads': {
            ceiling: '0.1.1'
        }
    })

    app.set('data', {
        ceiling: {
            user: {
                name: '逸才',
                email: 'yicai.cyj@taobao.com'
            }
        }
    })

    asyncTest('inherit', function() {
        app.boot()
        app.on('bx:ready', function() {
            start()
        })
    })
})


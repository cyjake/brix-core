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
        namespace: 'ux.demo'
    })

    app.config('imports', {
        'ux.shopping-ads': {
            ceiling: '0.1.1'
        }
    })

    asyncTest('inherit', function() {
        app.boot({
            ceiling: {
                user: {
                    name: '逸才',
                    email: 'yicai.cyj@taobao.com'
                }
            }
        }).on('bx:ready', function() {
            start()
        })
    })
})


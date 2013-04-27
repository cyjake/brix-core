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
        namespace: 'ux.demo'
    })
    app.config('imports', {
        'ux.tanx': {
            message: '0.1.2'
        }
    })

    asyncTest('#bxIfElse', function() {
        app.boot({
            messages: {
                error: {
                    message: '最近风声紧，低调。'
                }
            }
        }).on('bx:ready', function() {
            var msg = this.bxFind('ux.tanx/message')

            equal(S.trim(msg.get('el').text()), '最近风声紧，低调。')

            start()
        })
    })
})

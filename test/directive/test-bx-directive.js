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

    asyncTest('all brix directives', function() {
        app.boot({
            messageData: {
                error: {
                    message: '拆啦并啦'
                }
            }
        }).on('bx:ready', function() {
            var message = this.bxFind('ux.tanx/message')

            ok(message.get('el').one('.success').hasClass('hidden'))

            start()
        })
    })
})

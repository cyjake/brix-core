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
    asyncTest('@bx-class', function() {
        app.boot({
            messageData: {
                content: '我勒个去'
            }
        }).on('bx:ready', function() {
            var brick = this.bxFind('ux.tanx/message')
            var el = brick.get('el')

            ok(!el.one('div').hasClass('yellow'))

            brick.set('data', {
                extra: true,
                content: '遍地蛤蟆'
            })
            ok(el.one('div').hasClass('yellow'))
            start()
        })
    })
})
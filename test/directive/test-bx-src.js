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
        imports: {
            'ux.shopping-ads': {
                ceiling: '0.1.0'
            }
        }
    })
    asyncTest('@bx-src', function() {
        app.boot({
            ceilingData: {
                logo: 'http://a.tbcdn.cn/s/kissy/logo.png'
            }
        }).on('bx:ready', function() {
            var brick = this.bxFind('ux.shopping-ads/ceiling')
            var el = brick.get('el')

            equal(el.one('img').attr('src'), 'http://a.tbcdn.cn/s/kissy/logo.png')

            start()
        })
    })
})
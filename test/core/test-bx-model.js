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
        namespace: 'ux.demo',
        imports: {
            'ux.shopping-ads': {
                ceiling: '0.1.0'
            }
        }
    })
    asyncTest('#bxModel', function() {
        app.boot('#fixture1', {
            ceilingData: {
                user: {
                    name: '逸才'
                }
            }
        }).on('bx:ready', function() {
            var ceiling = this.bxFind('ux.shopping-ads/ceiling')

            deepEqual(ceiling.get('data'), {
                user: {
                    name: '逸才'
                }
            })
            start()
        })
    })
    asyncTest('#bxModel as', function() {
        app.boot('#fixture2', {
            admin: {
                name: 'lenel'
            }
        }).on('bx:ready', function() {
            var profile = this.bxFind('ux.demo/profile')

            deepEqual(profile.get('data'), {
                user: {
                    name: 'lenel'
                }
            })
            start()
        })
    })
})
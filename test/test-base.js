KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../src'
        }
    }
})


KISSY.use('brix/app', function(S, app) {

    app.config('namespace', 'brix-test')
    app.config('imports', {
        'shopping-ads': {
            ceiling: '0.1.0'
        }
    })

    app.set('data', {
        ceiling: {
            user: {
                name: '左莫',
                email: 'zuomo.xb@taobao.com'
            }
        },
        footer: {
            user: {
                name: '逸才',
                email: 'yicai.cyj@taobao.com'
            }
        }
    })

    asyncTest('#boot imports', function() {
        app.on('bx:ready', function() {
            var ele = S.one('[bx-name="shopping-ads/ceiling"]')

            equal(ele.one('a').attr('href'), 'mailto:zuomo.xb@taobao.com')
            equal(S.trim(ele.one('a').text()), '左莫')

            start()
        })
        app.boot(S.one('#fixture1'))
    })

    if (/^http/.test(location.href)) {
        app.set('debug', true)

        asyncTest('#boot components', function() {
            app.reload()
            app.on('bx:ready', function() {
                var el = S.one('[bx-name="brix-test/footer"]')

                equal(el.all('h2').length, 1)
                equal(el.one('a').text(), '逸才')
                start()
            })
            app.boot(S.one('#fixture2'))
        })
    }

    asyncTest('#bxOptions', function() {
        app.reload()
        app.on('bx:ready', function() {
            var footer = app.bxFind('brix-test/footer')

            equal(footer.get('foo'), 1)
            equal(footer.get('bar'), true)
            equal(footer.get('ham'), 'egg')

            start()
        })
        app.boot('#fixture3')
    })

    asyncTest('#destroy', function() {
        app.reload()
        app.on('bx:ready', function() {
            var footer = app.bxFind('brix-test/footer')

            ok(footer)
            equal(S.one('#fixture4').one('[bx-name="brix-test/footer"]').length, 1)

            footer.destroy()

            equal(S.one('#fixture4').all('[bx-name="brix-test/footer"]').length, 0)
            start()
        })
        app.boot('#fixture4')
    })
})

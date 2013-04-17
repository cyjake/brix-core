KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../src'
        }
    }
})


KISSY.use('brix/app', function(S, app) {

    app.config('namespace', 'ux.demo')
    app.config('imports', {
        'ux.shopping-ads': {
            ceiling: '0.1.0'
        }
    })

    asyncTest('#boot imports', function() {
        var data1 = {
            ceiling: {
                user: {
                    name: '左莫',
                    email: 'zuomo.xb@taobao.com'
                }
            }
        }

        app.boot('#fixture1', data1).on('bx:ready', function() {
            var ele = S.one('[bx-name="ux.shopping-ads/ceiling"]')

            equal(ele.one('a').attr('href'), 'mailto:zuomo.xb@taobao.com')
            equal(S.trim(ele.one('a').text()), '左莫')

            start()
        })
    })

    if (/^http/.test(location.href)) {
        app.set('debug', true)

        asyncTest('#boot components', function() {
            var data2 = {
                footer: {
                    user: {
                        name: '逸才',
                        email: 'yicai.cyj@taobao.com'
                    }
                }
            }

            app.boot('#fixture2', data2).on('bx:ready', function() {
                var el = S.one('[bx-name="brix-test/footer"]')

                equal(el.all('h2').length, 1)
                equal(el.one('a').text(), '逸才')
                start()
            })
        })
    }

    asyncTest('#bxOptions', function() {
        app.boot('#fixture3').on('bx:ready', function() {
            var footer = this.bxFind('ux.demo/footer')

            equal(footer.get('foo'), 1)
            equal(footer.get('bar'), true)
            equal(footer.get('ham'), 'egg')

            start()
        })
    })

    asyncTest('#destroy', function() {
        app.boot('#fixture4').on('bx:ready', function() {
            var footer = this.bxFind('ux.demo/footer')

            ok(footer)
            equal(S.one('#fixture4').one('[bx-name="ux.demo/footer"]').length, 1)

            footer.destroy()

            equal(S.one('#fixture4').all('[bx-name="ux.demo/footer"]').length, 0)
            start()
        })
    })
})

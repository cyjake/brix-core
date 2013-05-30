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
        },
        'ux.tanx': {
            dropdown: '0.1.5'
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

        app.boot('#fixture-1-boot-imports', data1).on('bx:ready', function() {
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

            app.boot('#fixture-2-boot-components', data2).on('bx:ready', function() {
                var el = S.one('[bx-name="brix-test/footer"]')

                equal(el.all('h2').length, 1)
                equal(el.one('a').text(), '逸才')
                start()
            })
        })
    }

    asyncTest('#bxOptions', function() {
        app.boot('#fixture-3-bx-options').on('bx:ready', function() {
            var footer = this.bxFind('ux.demo/footer')

            equal(footer.get('foo'), 1)
            equal(footer.get('bar'), true)
            equal(footer.get('ham'), 'egg')

            start()
        })
    })

    asyncTest('#destroy', function() {
        app.boot('#fixture-4-destroy').on('bx:ready', function() {
            var footer = this.bxFind('ux.demo/footer')

            ok(footer)
            equal(this.get('el').one('[bx-name="ux.demo/footer"]').length, 1)

            footer.destroy()

            equal(this.get('el').all('[bx-name="ux.demo/footer"]').length, 0)
            start()
        })
    })

    asyncTest('#bxCacheSubTemplets', function() {
        app.boot('#fixture-5-cache-sub-templets', {
            footerData: {
                user: {
                    email: 'ye.hao@me.com',
                    name: '凌征'
                },
                options: [
                    '临',
                    '兵',
                    '斗',
                    '者'
                ]
            }
        }).on('bx:ready', function() {
            var footer = this.bxFind('ux.demo/footer')
            var dropdown = footer.bxFind('ux.tanx/dropdown')

            ok(footer)
            ok(dropdown)

            start()
        })
    })

    asyncTest('#bxCacheSubTemplets complicated', function() {
        app.boot('#fixture-6-cache-sub-templets-complicated', {
            breadcrumbsData: [{
                text: '首页',
                value: '#1234'
            }, {
                options: [{
                    value: 1,
                    text: "计划列表"
                }, {
                    value: 2,
                    text: "计划列表2"
                }, {
                    value: 3,
                    text: "计划列表3"
                }, {
                    value: 4,
                    text: "计划列表4"
                }]
            }, {
                text: '创意管理',
                value: '#44'
            }, {
                text: '创意活动五',
                value: '#123'
            }]
        }).on('bx:ready', function() {
            var crumbs = this.bxFind('ux.demo/breadcrumbs')
            var dropdown = crumbs.bxFind('ux.tanx/dropdown')

            ok(crumbs)
            ok(dropdown)
            deepEqual(dropdown.get('data')[3], {
                value: 4,
                text: '计划列表4'
            })

            start()
        })
    })

    asyncTest('#bxWatch', function() {
        app.boot('#fixture-7-watch', {
            footerData: {
                year: 2012,
                businessGroups: ['alibaba', 'etao', 'alimama', 'taobao', 'tmall']
            }
        }).on('bx:ready', function() {
            var footer = this.bxFind('ux.demo/footer')
            var year = footer.get('el').one('[bx-watch="footer.year"]')

            equal(year.text(), '© 2012')

            footer.bxChange('footer.year', 2013)
            footer.bxChange('footer.businessGroups', ['alibaba', 'alimama', 'taobao', 'tmall'])

            equal(year.text(), '© 2013')

            start()
        })
    })
})

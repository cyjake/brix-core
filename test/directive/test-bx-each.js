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
            grid: '0.2.1'
        }
    })

    asyncTest('@bx-each', function() {
        app.boot({
            gridData: {
                headFields: 'id name email weibo'.split(' '),
                rowsData: [
                    '1 逸才 yicai.cyj@taobao.com 逸才很茫然'.split(' '),
                    '2 左莫 zuomo.xb@taobao.com 左莫莫右莫莫'.split(' '),
                    '3 李牧 limu@taobao.com lenel'.split(' ')
                ]
            }
        }).on('bx:ready', function() {
            start()
        })
    })
})

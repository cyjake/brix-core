KISSY.use('brix/app', function(S, app) {
    var data = {
        breadcrumbsData: [{
            text: '首页',
            value: '#1234',
            first: true
        }, {
            dropdown: [{
                value: 1,
                text: "计划列表",
                selected: true
            }, {
                value: 2,
                text: "计划列表2"
            }, {
                value: 3,
                text: "计划列表3"
            }, {
                value: 4,
                text: "计划列表4"
            }],
            middle: true
        }, {
            text: '创意管理',
            value: '#44',
            middle: true
        }, {
            text: '创意活动五',
            value: '#123',
            last: true
        }]
    }

    app.config({
        namespace: 'ux.demo',
        imports: {
            brix: {
                breadcrumbs: '1.0.0',
                dropdown: '1.1.0'
            }
        }
    })
    app.bootStyle(function() {
        app.boot(data).on('bx:ready', function() {
            // TODO
        })
    })
})
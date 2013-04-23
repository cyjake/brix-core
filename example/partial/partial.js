KISSY.add('ux.demo/grid/index', function(S, Brick) {

    function Grid(opts) {
        Grid.superclass.constructor.call(this, opts)
    }

    S.extend(Grid, Brick)

    return Grid
}, {
    requires: ['brix/base']
})

KISSY.add('ux.demo/panel/index', function(S, Brick) {

    function Panel(opts) {
        Panel.superclass.constructor.call(this, opts)
    }

    Panel.EVENTS = {
        '.J_prevBtn': {
            click: function() {
                this.fire('panel:previous')
            }
        },
        '.J_nextBtn': {
            click: function() {
                this.fire('panel:next')
            }
        }
    }

    S.extend(Panel, Brick)

    return Panel
}, {
    requires: ['brix/base']
})

KISSY.use('brix/app', function(S, app) {

    var employees = [{
        nickname: '黄龙',
        weiboLink: 'http://weibo.com/cuteblackmelon',
        weiboAt: '瓜瓜射门啦',
        pageLink: 'http://blog.iblack7.com/',
        pageTitle: '时光的余热'
    }, {
        nickname: '逸才',
        weiboLink: 'http://weibo.com/dotnil',
        weiboAt: '逸才很茫然',
        pageLink: 'http://cyj.me',
        pageTitle: 'Everything Jake'
    }, {
        nickname: '凌征',
        weiboLink: 'http://weibo.com/yehao127',
        weiboAt: '叶浩是猪头',
        pageLink: 'http://yehao.diandian.com/',
        pageTitle: '潴頭在綫'
    }, {
        nickname: '左莫',
        weiboLink: 'http://weibo.com/u/1734589795',
        weiboAt: '左莫莫右莫莫',
        pageLink: 'http://xubo.me/',
        pageTitle: '首页--左莫莫右莫莫'
    }, {
        nickname: '李牧',
        weiboLink: 'http://weibo.com/lenel',
        weiboAt: 'lenel',
        pageLink: 'http://limu.iteye.com/',
        pageTitle: 'limu的砖篮儿'
    }, {
        nickname: '柯拓',
        weiboLink: 'http://weibo.com/u/1708684567',
        weiboAt: '紫云妃',
        pageLink: 'http://www.cnblogs.com/ziyunfei',
        pageTitle: '紫云飞'
    }]

    var pageNum = 0
    var perPage = 2
    var totalPages = employees.length / perPage

    function selectEmployees() {
        return employees.slice(pageNum * perPage, (pageNum + 1) * perPage)
    }


    app.config({
        namespace: 'ux.demo'
    })
    app.boot({
        gridData: {
            employees: selectEmployees()
        },
        panelData: {
            page: pageNum,
            pages: totalPages
        }
    }).on('bx:ready', function() {
        var grid = this.bxFind('ux.demo/grid')
        var panel = this.bxFind('ux.demo/panel')

        // 下一步支持直接刷新组件中的局部
        //
        //    grid.bxSet('employees', [])
        //

        panel.on('panel:previous', function() {
            pageNum -= 1
            pageNum = pageNum >= 0 ? pageNum : totalPages - 1
            grid.set('data', {
                employees: selectEmployees()
            })
            panel.set('data', {
                page: pageNum,
                pages: totalPages
            })
        })
        panel.on('panel:next', function() {
            pageNum += 1
            pageNum = pageNum === totalPages ? 0 : pageNum
            grid.set('data', {
                employees: selectEmployees
            })
            panel.set('data', {
                page: pageNum,
                pages: totalPages
            })
        })
    })
})
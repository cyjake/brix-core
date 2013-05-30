KISSY.add('ux.demo/grid/index', function(S, Brick) {

    function Grid(options) {
        Grid.superclass.constructor.call(this, options)
    }

    S.extend(Grid, Brick)

    return Grid
}, {
    requires: ['brix/base']
})

KISSY.use('brix/app', function(S, app) {

    app.config({
        base: '../',
        namespace: 'ux.demo',
        imports: {
            brix: {
                dropdown: '1.1.0'
            }
        }
    })

    var pageData = {
        records: [{
            format: '中文',
            dropdown: [{
                value: 0,
                text: '零'
            }, {
                value: 1,
                text: '一',
                selected: true
            }, {
                value: 2,
                text: '二'
            }, {
                value: 3,
                text: '三'
            }]
        }, {
            format: '圆圈',
            dropdown: [{
                value: 0,
                text: '〇'
            }, {
                value: 1,
                text: '①',
                selected: true
            }, {
                value: 2,
                text: '②'
            }, {
                value: 3,
                text: '③'
            }]
        }, {
            format: '大写',
            dropdown: [{
                value: 0,
                text: '零'
            }, {
                value: 1,
                text: '壹',
                selected: true
            }, {
                value: 2,
                text: '贰'
            }, {
                value: 3,
                text: '叁'
            }]
        }]
    }

    app.bootStyle(function() {
        app.boot(pageData).on('bx:ready', function() {
            var grid = this.bxFind('ux.demo/grid')

            grid.bxChange('records.1', {
                format: '圈圈'
            })
        })
    })
})
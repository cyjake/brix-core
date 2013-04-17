KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../../src/'
        }
    }
})
KISSY.use('brix/app/config', function(S, app) {
    app.config({
        namespace: 'brix-test',
        components: [
            'breadcrumbs',
            'kwicks',
            'pagination'
        ]
    })
    app.config({
        imports: {
            brix: {
                pagination: '1.1.0',
                'anti-ie6': '0.1.1'
            },
            tanx: {
                dropdown: '1.1.0'
            }
        }
    })

    test('#comboStyle', function() {
        deepEqual(app.comboStyle(), [
            'brix/pagination/index.css',
            'brix/anti-ie6/index.css',
            'tanx/dropdown/index.css',
            'brix-test/breadcrumbs/index.css',
            'brix-test/kwicks/index.css',
            'brix-test/pagination/index.css'
        ])
    })
})
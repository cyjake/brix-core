KISSY.add('brix/base', function(S, bxName, bxTemplate, bxModel, bxDirective, bxWatch, app, RichBase) {

    function BxBase(opts) {
        BxBase.superclass.constructor.call(this, opts)
    }

    BxBase.uid = function() {
        return ['bx', S.guid()].join('-')
    }

    S.extend(BxBase, RichBase)

    BxBase.ATTRS = {
        data: null,

        template: null,

        el: {
            getter: function(elId) {
                return S.one(elId)
            },
            setter: function(el) {
                if (!el.attr('id')) {
                    el.attr('id', BxBase.uid())
                }

                return '#' + el.attr('id')
            }
        }
    }

    S.augment(BxBase, bxName, bxTemplate, bxModel, bxDirective, bxWatch, {
        initialize: function(el) {
            el = el || this.get('el')
            if (!el.hasAttr('bx-model')) {
                this.bxLoad(el)
            }
            else {
                this.on('afterTemplateChange', this.bxBindModel, this)
                this.on('afterDataChange', this.bxRender, this)

                this.bxTemplate(el)
            }
        },

        destructor: function() {
            var children = this.bxChildren || []

            for (var i = 0; i < children.length; i++) {
                children[i].destroy()
            }
            this.bxParent = null
            this.bxUndelegate()
            this.get('el').remove()
        },

        bxBindModel: function() {
            var data = this.bxModel(this.bxParent.get('data'))

            this.set('data', data)
        },

        bxRender: function() {
            var el = this.get('el')
            var template = this.get('template')
            var engine = app.config('templateEngine')
            var res = null
            var data = {}

            data[this.bxDataKey] = this.get('data')
            if (engine && S.isFunction(engine.render)) {
                res = engine.render(template, data)
            }
            else {
                res = this.bxDirective(template, data)
            }
            el.html(res)

            this.bxLoad(el)
        }
    })

    return BxBase
}, {
    requires: [
        'brix/core/bx-name',
        'brix/core/bx-template',
        'brix/core/bx-model',
        'brix/core/bx-directive',
        'brix/core/bx-watch',
        'brix/app/config',
        'rich-base'
    ]
})
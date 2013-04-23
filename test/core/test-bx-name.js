KISSY.config({
    ignorePackageNameInUri: true,
    packages: {
        brix: {
            base: '../../src'
        }
    }
})

// mock a brick
KISSY.add('ux.shopping-ads/ceiling/index', function() {
    // will call this constructor function like this:
    //
    //    new (function(ele) {})
    //
    return function(opts) {
        equal(opts.el.attr('bx-name'), 'ux.shopping-ads/ceiling')
        start()
    }
})

KISSY.add('ux.shopping-ads/footer/index', function(S, BxBase) {
    function Footer(opts) {
        Footer.superclass.constructor.call(this, opts)
        equal(opts.el.attr('bx-name'), 'ux.shopping-ads/footer')
    }

    S.extend(Footer, BxBase)

    return Footer
}, {
    requires: [
        'brix/base'
    ]
})

KISSY.add('corp/copyright/index', function() {
    return function(opts) {
        equal(opts.el.attr('bx-name'), 'corp/copyright')
        start()
    }
})


KISSY.use('base, brix/core/bx-name', function(S, Base, bxName) {

    var Foo = function() {
        Foo.superclass.constructor.call(this)
    }
    var foo

    S.extend(Foo, Base)
    S.augment(Foo, bxName)

    module('@bx-name', {
        setup: function() {
            foo = new Foo()
        }
    })

    asyncTest('#bxLoad', function() {
        foo.bxLoad(S.one('#fixture1'))
    })

    asyncTest('#bxLoad recursive', function() {
        foo.bxLoad(S.one('#fixture2'))
    })
})
KISSY.add('tanx/message/index', function(S, BxBase) {

    function Message(opts) {
        Message.superclass.constructor.call(this, opts)
        equal(opts.el.attr('bx-name'), 'tanx/message')
    }

    S.extend(Message, BxBase)

    return Message
}, {
    requires: ['brix/base']
})
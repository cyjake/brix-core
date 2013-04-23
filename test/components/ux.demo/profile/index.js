KISSY.add('ux.demo/profile/index', function(S, Brick) {

    function Profile(opts) {
        Profile.superclass.constructor.call(this, opts)
    }

    S.extend(Profile, Brick)

    return Profile
}, {
    requires: ['brix/base']
})
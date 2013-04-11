KISSY.add('brix/core/bx-scope', function(S) {

    var exports = {
        bxScope: function(attr) {
            var data = this.get('data')

            if (S.isFunction(this[attr])) {
                return (this[attr])()
            }
            else if (data[attr]) {
                return data[attr]
            }
        }
    }

    return exports
})
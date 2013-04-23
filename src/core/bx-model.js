KISSY.add('brix/core/bx-model', function(S) {

    var EXP_PTN = /^\s*(\w+)(?:\s+as\s+(\w+))?\s*$/

    var exports = {
        bxModel: function(data) {
            var exp = this.get('el').attr('bx-model')

            if (!exp) {
                return
            }
            var matches = exp.match(EXP_PTN)
            var attr = matches[1]
            var mappedAttr = matches[2]
            var obj

            if (data[attr]) {
                obj = data[attr]
            }
            else if (S.isFunction(this[attr])) {
                obj = (this[attr])()
            }

            if (mappedAttr) {
                var wrap = {}

                wrap[mappedAttr] = obj

                return wrap
            }
            else {
                return obj
            }
        }
    }

    return exports
})
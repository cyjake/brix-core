KISSY.add('brix/core/bx-model', function(S) {

    var EXP_PTN = /^\s*(\w+)(?:\s+as\s+(\w+))?\s*$/

    var exports = {
        bxModel: function(data) {
            var el = this.get('el')
            var exp = el.attr('bx-model')

            if (!exp) {
                return
            }
            var matches = exp.match(EXP_PTN)
            var attr = matches[1]
            var mappedAttr = matches[2]
            var obj

            if (!attr) {
                throw (new Error('bx-model attribute cannot be empty'))
            }
            else if (S.isFunction(this[attr])) {
                obj = (this[attr])()
            }
            else {
                var path = this.bxModelWithinEach(el)

                if (path.length > 0) {
                    if (path[0] === this.bxParent.bxDataKey) {
                        path.shift()
                    }
                    var p

                    while ((p = path.shift()) && p) {
                        data = data[p]
                    }
                }
                obj = data[attr]
            }

            this.bxDataKey = mappedAttr || attr

            return obj
        },

        bxModelWithinEach: function(el) {
            // When the @bx-model node is a child of one or many @bx-each nodes,
            // the path shall be derived from those @bx-each nodes.
            var path = []
            var parentName = this.bxParent.bxName

            if (!parentName) {
                return path
            }
            var ele = el[0]
            var parent = ele

            while ((parent = parent.parentNode) &&
                    parent !== parent.parentNode) {
                var each = parent.getAttribute('bx-each')

                if (each) {
                    var index = parent.getAttribute('bx-each-index')

                    path.push(each)
                    path.push(index)
                }
                else if (parent.getAttribute('bx-name')) {
                    break
                }
            }

            return path
        }
    }

    return exports
})
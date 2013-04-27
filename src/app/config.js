KISSY.add('brix/app/config', function(S) {

    var exports = {
        configData: {
            debug: true,

            base: '.',

            imports: null,

            timestamp: null,

            namespace: null,

            components: null
        },

        config: function(prop, data) {
            if (S.isPlainObject(prop)) {
                S.mix(this.configData, prop)
            }
            else if (S.isString(prop)) {
                if (typeof data === 'undefined') {
                    return this.configData[prop]
                }
                else {
                    this.configData[prop] = data
                }
            }
            else {
                return S.clone(this.configData)
            }
        },

        mapTimestamp: function() {
            var stamp = this.config('timestamp')
            var ns = this.config('namespace')

            if (stamp && ns) {
                var injectTimestamp = function(m, name, file) {
                    return [ns, stamp, name, file].join('/')
                }

                S.config('map', [
                    [new RegExp(ns + '\\/([^\\/]+)\\/([^\\/]+)$'), injectTimestamp]
                ])
            }
        },

        mapImports: function() {
            this.mapModules(this.config('imports'))
        },

        mapComponents: function() {
            var comps = this.config('components')

            if (S.isPlainObject(comps)) {
                var ns = this.config('namespace')
                var obj = {}

                obj[ns] = comps
                this.mapModules(obj)
            }
            else {
                this.mapTimestamp()
            }
        },

        mapModules: function(lock) {
            function makeReplacer(ns) {
                return function(match, name, file) {
                    return [ns, name, lock[ns][name], file].join('/')
                }
            }
            var maps = []

            for (var ns in lock) {
                maps.push([new RegExp(ns + '\\/([^\\/]+)\\/([^\\/]+)$'), makeReplacer(ns)])
            }

            S.config('map', maps)
        },

        packageImports: function() {
            var imports = this.config('imports')
            var importsBase = this.config('base') + '/imports'
            var ignoreNs = S.config('ignorePackageNameInUri')
            var packages = {}

            for (var p in imports) {
                packages[p] = {
                    base: importsBase + (ignoreNs ? '/' + p : '')
                }
            }

            S.config('packages', packages)
        },

        packageComponents: function() {
            var ns = this.config('namespace')
            var base = this.config('base')
            var ignoreNs = S.config('ignorePackageNameInUri')
            var obj = {}

            obj[ns] = {
                base: base + '/components' + (ignoreNs ? '/' + ns : '')
            }
            S.config('packages', obj)
        },

        comboStyle: function() {
            var imports = this.config('imports') || {}
            var styles = []
            var comp
            var ns

            for (ns in imports) {
                for (comp in imports[ns]) {
                    styles.push([ns, comp, 'index.css'].join('/'))
                }
            }
            var components = this.config('components') || []

            if (S.isPlainObject(components)) {
                components = S.keys(components)
            }
            ns = this.config('namespace')
            for (var i = 0; i < components.length; i++) {
                styles.push([ns, components[i], 'index.css'].join('/'))
            }

            return styles
        }
    }

    return exports
})
KISSY.add('brix/core/bx-watch', function(S, app) {

    var exports = {
        bxWatch: function(el) {
            var watches = el.all('[bx-watch]')
            var watchers = this.bxWatchers = []
            var watch
            var keys
            var id

            for (var i = 0; i < watches.length; i++) {
                watch = S.Node(watches[i])
                keys = watch.attr('bx-watch').split(/[, ]/)
                id = watch.attr('id')

                if (!id) {
                    id = 'bx-watch-' + S.guid()
                    watch.attr('id', id)
                }
                watchers[i] = {
                    keys: keys,
                    template: watch.html(),
                    container: '#' + id
                }
            }

            var eaches = el.all('[bx-each]')

            for (i = 0; i < eaches.length; i++) {
                watch = S.Node(eaches[i])

                var key = watch.attr('bx-each')
                var parent = watch.parent()

                keys = [key]
                id = parent.attr('id')

                if (!id) {
                    id = 'bx-watch-' + S.guid()
                    parent.attr('id', id)
                }
                watchers.push({
                    keys: keys,
                    template: watch.outerHTML(),
                    container: '#' + id
                })
            }
        },

        bxChange: function(key, data) {
            var watchers = this.bxWatchers
            var engine = app.config('templateEngine')
            var result

            for (var i = 0; i < watchers.length; i++) {
                var watcher = watchers[i]

                if (S.inArray(key, watcher.keys)) {
                    var parts = key.split('.')
                    var obj = {}
                    var wrap = obj
                    var p

                    /*jshint boss:true*/
                    while (p = parts.shift()) {
                        obj[p] = parts.length > 0 ? {} : data
                        obj = obj[p]
                    }

                    if (engine) {
                        result = engine.render(watcher.template, wrap)
                    }
                    else {
                        result = this.bxDirectivePartial(watcher.template, wrap)
                    }

                    var anchor = watcher.anchor
                    var container = watcher.container

                    if (container) {
                        S.one(container).html(result)
                    }
                    // anchor support?
                    else if (anchor) {
                        anchor = S.one(anchor)
                        anchor.parent().insertBefore(S.Node(result), anchor.next())
                    }
                }
            }
        }
    }

    return exports
}, {
    requires: ['brix/app/config']
})
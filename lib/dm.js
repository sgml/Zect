/**
 *  DOM manipulations
 */

'use strict';
var util = require('./util')

function Selector(sel) {
    if (util.type(sel) == 'string') {
        var nodes = util.copyArray(document.querySelectorAll(sel))
        return Wrap(nodes)
    } else if (sel instanceof Wrap) return sel
    else if (sel instanceof HTMLElement) {
        return Wrap([sel])
    } else {
        throw new Error('Unexpect selector !')
    }
}

function Wrap(nodes) {
    if (nodes instanceof Wrap) return nodes
    nodes.__proto__ = proto
    return nodes
}

var proto = {
    find: function(sel) {
        var subs = []
        this.forEach(function(n) {
            subs = subs.concat(util.copyArray(n.querySelectorAll(sel)))
        })
        return Wrap(subs)
    },
    attr: function(attname, attvalue) {
        var len = arguments.length
        var el = this[0]
        if (len > 1) {
            el.setAttribute(attname, attvalue)
        } else if (len == 1) {
            return (el.getAttribute(attname) || '').toString()
        }
        return this
    },
    removeAttr: function(attname) {
        this.forEach(function(el) {
            el.removeAttribute(attname)
        })
        return this
    },
    addClass: function(clazz) {
        this.forEach(function(el) {
            var classes = util.copyArray(el.classList)
            if (!~classes.indexOf(clazz)) classes.push(clazz)
            el.className = classes.join(' ')
        })
        return this
    },
    removeClass: function(clazz) {
        this.forEach(function(el) {
            el.className = classes.reduce(function(r, n) {
                if (n != clazz) r.push(n)
                return r
            }, []).join(' ')
        })
        return this
    },
    each: function(fn) {
        this.forEach(fn)
        return this
    },
    on: function(type, listener, capture) {
        this.forEach(function(el) {
            el.addEventListener(type, listener, capture)
        })
        return this
    },
    off: function(type, listener) {
        this.forEach(function(el) {
            el.removeEventListener(type, listener)
        })
        return this
    },
    html: function(html) {
        var len = arguments.length
        if (len >= 1) {
            this.forEach(function(el) {
                el.innerHTML = html
            })
        } else if (this.length) {
            return this[0].innerHTML
        }
        return this
    },
    parent: function() {
        if (!this.length) return null
        return Wrap([this[0].parentNode])
    },
    remove: function() {
        this.forEach(function(el) {
            var parent = el.parentNode
            parent && parent.removeChild(el)
        })
        return this
    },
    // return element by index
    get: function(i) {
        return this[i]
    },
    append: function(n) {
        if (this.length) this.get(0).appendChild(n)
        return this
    },
    replace: function(n) {
        var $parent = this.parent()
        $parent.get(0).replaceChild(n, this.get(0))
        return this
    }
}
proto.__proto__ = Wrap.prototype
proto.__proto__.__proto__ = Array.prototype


module.exports = Selector
"use strict";
function e(n) {
    return (
        (e =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                      return typeof e;
                  }
                : function (e) {
                      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                  }),
        e(n)
    );
}
function n(e, n) {
    for (var r = 0; r < n.length; r++) {
        var t = n[r];
        (t.enumerable = t.enumerable || !1), (t.configurable = !0), "value" in t && (t.writable = !0), Object.defineProperty(e, t.key, t);
    }
}
var r = {
    number: {
        save: function (e) {
            return e;
        },
        parse: function (e) {
            return Number.parseFloat(e);
        },
    },
    object: {
        save: function (e) {
            return JSON.stringify(e);
        },
        parse: function (e) {
            return JSON.parse(e);
        },
    },
    undefined: {
        save: function (e) {
            return e;
        },
        parse: function () {},
    },
    default: {
        save: function (e) {
            return e;
        },
        parse: function (e) {
            return e;
        },
    },
};
function t(e) {
    return r[e] || r.default;
}
var o,
    u,
    a,
    i = (function () {
        function r() {
            !(function (e, n) {
                if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
            })(this, r);
        }
        var o, u, a;
        return (
            (o = r),
            (u = [
                {
                    key: "get",
                    value: function (e) {
                        var n = r.storage,
                            o = n.getItem(e);
                        if (o) {
                            var u = o.split("$@"),
                                a = Date.now();
                            if (u.length > 2 && u[2] < a) return n.removeItem(e), null;
                            var i = decodeURIComponent(u[1]);
                            return t(u[0]).parse(i);
                        }
                        return null;
                    },
                },
                {
                    key: "set",
                    value: function (n, o, u) {
                        if ((u = Object.assign({ expires: 0, encode: !0 }, u)).expires && "number" != typeof u.expires) throw new Error("The Expires setting must be a number");
                        var a = e(o),
                            i = t(a),
                            f = u.encode ? encodeURIComponent(i.save(o)) : i.save(o);
                        (o = u.expires <= 0 ? a + "$@" + f : a + "$@" + f + "$@" + (24 * u.expires * 60 * 60 * 1e3 + new Date().getTime())), r.storage.setItem(n, o);
                    },
                },
                {
                    key: "clear",
                    value: function () {
                        r.storage.clear();
                    },
                },
                {
                    key: "remove",
                    value: function (e) {
                        r.storage.removeItem(e);
                    },
                },
            ]) && n(o.prototype, u),
            a && n(o, a),
            r
        );
    })();
(o = i), (u = "storage"), (a = window.localStorage), u in o ? Object.defineProperty(o, u, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : (o[u] = a);
var f = new i();
module.exports = f;

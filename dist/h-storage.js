!(function (e, n) {
    "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = n())
        : "function" == typeof define && define.amd
        ? define(n)
        : (((e = "undefined" != typeof globalThis ? globalThis : e || self).h = e.h || {}), (e.h.storage = n()));
})(this, function () {
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
        for (var t = 0; t < n.length; t++) {
            var r = n[t];
            (r.enumerable = r.enumerable || !1), (r.configurable = !0), "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
    }
    var t = "$@",
        r = {
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
    function o(e) {
        return r[e] || r.default;
    }
    var u,
        i,
        a,
        f = (function () {
            function r() {
                !(function (e, n) {
                    if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
                })(this, r);
            }
            var u, i, a;
            return (
                (u = r),
                (i = [
                    {
                        key: "get",
                        value: function (e) {
                            var n = r.storage,
                                u = n.getItem(e);
                            if (u) {
                                var i = u.split(t),
                                    a = Date.now();
                                if (i.length > 2 && i[2] < a) return n.removeItem(e), null;
                                var f = decodeURIComponent(i[1]);
                                return o(i[0]).parse(f);
                            }
                            return null;
                        },
                    },
                    {
                        key: "set",
                        value: function (n, u, i) {
                            if ((i = Object.assign({ expires: 0, encode: !0 }, i)).expires && "number" != typeof i.expires) throw new Error("The Expires setting must be a number");
                            var a = e(u),
                                f = o(a),
                                s = i.encode ? encodeURIComponent(f.save(u)) : f.save(u);
                            if (i.expires <= 0) u = a + t + s;
                            else {
                                var c = 24 * i.expires * 60 * 60 * 1e3 + new Date().getTime();
                                u = a + t + s + t + c;
                            }
                            r.storage.setItem(n, u);
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
                ]) && n(u.prototype, i),
                a && n(u, a),
                r
            );
        })();
    return (
        (u = f),
        (i = "storage"),
        (a = window.localStorage),
        i in u ? Object.defineProperty(u, i, { value: a, enumerable: !0, configurable: !0, writable: !0 }) : (u[i] = a),
        new f()
    );
});

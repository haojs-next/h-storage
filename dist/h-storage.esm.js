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
    a,
    u,
    i = (function () {
        function r() {
            !(function (e, n) {
                if (!(e instanceof n)) throw new TypeError("Cannot call a class as a function");
            })(this, r);
        }
        var o, a, u;
        return (
            (o = r),
            (a = [
                {
                    key: "get",
                    value: function (e) {
                        var n = r.storage,
                            o = n.getItem(e);
                        if (o) {
                            var a = o.split("$@"),
                                u = Date.now();
                            if (a.length > 2 && a[2] < u) return n.removeItem(e), null;
                            var i = decodeURIComponent(a[1]);
                            return t(a[0]).parse(i);
                        }
                        return null;
                    },
                },
                {
                    key: "set",
                    value: function (n, o, a) {
                        if ((a = Object.assign({ expires: 0, encode: !0 }, a)).expires && "number" != typeof a.expires) throw new Error("The Expires setting must be a number");
                        var u = e(o),
                            i = t(u),
                            f = a.encode ? encodeURIComponent(i.save(o)) : i.save(o);
                        (o = a.expires <= 0 ? u + "$@" + f : u + "$@" + f + "$@" + (24 * a.expires * 60 * 60 * 1e3 + new Date().getTime())), r.storage.setItem(n, o);
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
            ]) && n(o.prototype, a),
            u && n(o, u),
            r
        );
    })();
(o = i), (a = "storage"), (u = window.localStorage), a in o ? Object.defineProperty(o, a, { value: u, enumerable: !0, configurable: !0, writable: !0 }) : (o[a] = u);
var f = new i();
export { f as default };

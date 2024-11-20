const VueObserveVisibility = function(e) {
    "use strict";
    const process = { env: { NODE_ENV: 'production' } }
    const t = "production" !== process.env.NODE_ENV ? Object.freeze({}) : {};
    "production" === process.env.NODE_ENV || Object.freeze([]);
    const n = () => {},
        o = /^on[^a-z]/,
        r = e => o.test(e),
        s = Object.assign,
        i = (e, t) => {
            const n = e.indexOf(t);
            n > -1 && e.splice(n, 1)
        },
        c = Object.prototype.hasOwnProperty,
        a = (e, t) => c.call(e, t),
        l = Array.isArray,
        u = e => "[object Map]" === y(e),
        p = e => "[object Set]" === y(e),
        f = e => "function" == typeof e,
        d = e => "string" == typeof e,
        h = e => "symbol" == typeof e,
        v = e => null !== e && "object" == typeof e,
        _ = e => (v(e) || f(e)) && f(e.then) && f(e.catch),
        g = Object.prototype.toString,
        y = e => g.call(e),
        b = e => y(e).slice(8, -1),
        m = e => "[object Object]" === y(e),
        w = e => d(e) && "NaN" !== e && "-" !== e[0] && "" + parseInt(e, 10) === e,
        E = (e => {
            const t = Object.create(null);
            return e => t[e] || (t[e] = (e => e.charAt(0).toUpperCase() + e.slice(1))(e))
        })(),
        N = (e, t) => !Object.is(e, t);
    let O;
    const k = () => O || (O = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {});

    function V(e) {
        if (l(e)) {
            const t = {};
            for (let n = 0; n < e.length; n++) {
                const o = e[n],
                    r = d(o) ? $(o) : V(o);
                if (r)
                    for (const e in r) t[e] = r[e]
            }
            return t
        }
        if (d(e) || v(e)) return e
    }
    const S = /;(?![^(]*\))/g,
        x = /:([^]+)/,
        D = /\/\*[^]*?\*\//g;

    function $(e) {
        const t = {};
        return e.replace(D, "").split(S).forEach((e => {
            if (e) {
                const n = e.split(x);
                n.length > 1 && (t[n[0].trim()] = n[1].trim())
            }
        })), t
    }

    function R(e) {
        let t = "";
        if (d(e)) t = e;
        else if (l(e))
            for (let n = 0; n < e.length; n++) {
                const o = R(e[n]);
                o && (t += o + " ")
            } else if (v(e))
                for (const n in e) e[n] && (t += n + " ");
        return t.trim()
    }

    function C(e, ...t) {
        console.warn(`[Vue warn] ${e}`, ...t)
    }
    let j;
    const P = e => {
            const t = new Set(e);
            return t.w = 0, t.n = 0, t
        },
        I = e => (e.w & F) > 0,
        T = e => (e.n & F) > 0,
        M = new WeakMap;
    let A = 0,
        F = 1;
    const U = 30;
    let z;
    const H = Symbol("production" !== process.env.NODE_ENV ? "iterate" : ""),
        W = Symbol("production" !== process.env.NODE_ENV ? "Map key iterate" : "");
    class J {
        constructor(e, t = null, n) {
            this.fn = e, this.scheduler = t, this.active = !0, this.deps = [], this.parent = void 0,
                function(e, t = j) {
                    t && t.active && t.effects.push(e)
                }(this, n)
        }
        run() {
            if (!this.active) return this.fn();
            let e = z,
                t = q;
            for (; e;) {
                if (e === this) return;
                e = e.parent
            }
            try {
                return this.parent = z, z = this, q = !0, F = 1 << ++A, A <= U ? (({
                    deps: e
                }) => {
                    if (e.length)
                        for (let t = 0; t < e.length; t++) e[t].w |= F
                })(this) : K(this), this.fn()
            } finally {
                A <= U && (e => {
                    const {
                        deps: t
                    } = e;
                    if (t.length) {
                        let n = 0;
                        for (let o = 0; o < t.length; o++) {
                            const r = t[o];
                            I(r) && !T(r) ? r.delete(e) : t[n++] = r, r.w &= ~F, r.n &= ~F
                        }
                        t.length = n
                    }
                })(this), F = 1 << --A, z = this.parent, q = t, this.parent = void 0, this.deferStop && this.stop()
            }
        }
        stop() {
            z === this ? this.deferStop = !0 : this.active && (K(this), this.onStop && this.onStop(), this.active = !1)
        }
    }

    function K(e) {
        const {
            deps: t
        } = e;
        if (t.length) {
            for (let n = 0; n < t.length; n++) t[n].delete(e);
            t.length = 0
        }
    }
    let q = !0;
    const B = [];

    function L() {
        B.push(q), q = !1
    }

    function G() {
        const e = B.pop();
        q = void 0 === e || e
    }

    function Q(e, t, n) {
        if (q && z) {
            let o = M.get(e);
            o || M.set(e, o = new Map);
            let r = o.get(n);
            r || o.set(n, r = P()),
                function(e, t) {
                    let n = !1;
                    A <= U ? T(e) || (e.n |= F, n = !I(e)) : n = !e.has(z), n && (e.add(z), z.deps.push(e), "production" !== process.env.NODE_ENV && z.onTrack && z.onTrack(s({
                        effect: z
                    }, t)))
                }(r, "production" !== process.env.NODE_ENV ? {
                    effect: z,
                    target: e,
                    type: t,
                    key: n
                } : void 0)
        }
    }

    function X(e, t, n, o, r, s) {
        const i = M.get(e);
        if (!i) return;
        let c = [];
        if ("clear" === t) c = [...i.values()];
        else if ("length" === n && l(e)) {
            const e = Number(o);
            i.forEach(((t, n) => {
                ("length" === n || !h(n) && n >= e) && c.push(t)
            }))
        } else switch (void 0 !== n && c.push(i.get(n)), t) {
            case "add":
                l(e) ? w(n) && c.push(i.get("length")) : (c.push(i.get(H)), u(e) && c.push(i.get(W)));
                break;
            case "delete":
                l(e) || (c.push(i.get(H)), u(e) && c.push(i.get(W)));
                break;
            case "set":
                u(e) && c.push(i.get(H))
        }
        const a = "production" !== process.env.NODE_ENV ? {
            target: e,
            type: t,
            key: n,
            newValue: o,
            oldValue: r,
            oldTarget: s
        } : void 0;
        if (1 === c.length) c[0] && ("production" !== process.env.NODE_ENV ? Y(c[0], a) : Y(c[0]));
        else {
            const e = [];
            for (const t of c) t && e.push(...t);
            "production" !== process.env.NODE_ENV ? Y(P(e), a) : Y(P(e))
        }
    }

    function Y(e, t) {
        const n = l(e) ? e : [...e];
        for (const e of n) e.computed && Z(e, t);
        for (const e of n) e.computed || Z(e, t)
    }

    function Z(e, t) {
        (e !== z || e.allowRecurse) && ("production" !== process.env.NODE_ENV && e.onTrigger && e.onTrigger(s({
            effect: e
        }, t)), e.scheduler ? e.scheduler() : e.run())
    }
    const ee = function(e, t) {
            const n = Object.create(null),
                o = e.split(",");
            for (let e = 0; e < o.length; e++) n[o[e]] = !0;
            return t ? e => !!n[e.toLowerCase()] : e => !!n[e]
        }("__proto__,__v_isRef,__isVue"),
        te = new Set(Object.getOwnPropertyNames(Symbol).filter((e => "arguments" !== e && "caller" !== e)).map((e => Symbol[e])).filter(h)),
        ne = function() {
            const e = {};
            return ["includes", "indexOf", "lastIndexOf"].forEach((t => {
                e[t] = function(...e) {
                    const n = He(this);
                    for (let e = 0, t = this.length; e < t; e++) Q(n, "get", e + "");
                    const o = n[t](...e);
                    return -1 === o || !1 === o ? n[t](...e.map(He)) : o
                }
            })), ["push", "pop", "shift", "unshift", "splice"].forEach((t => {
                e[t] = function(...e) {
                    L();
                    const n = He(this)[t].apply(this, e);
                    return G(), n
                }
            })), e
        }();

    function oe(e) {
        const t = He(this);
        return Q(t, "has", e), t.hasOwnProperty(e)
    }
    class re {
        constructor(e = !1, t = !1) {
            this._isReadonly = e, this._shallow = t
        }
        get(e, t, n) {
            const o = this._isReadonly,
                r = this._shallow;
            if ("__v_isReactive" === t) return !o;
            if ("__v_isReadonly" === t) return o;
            if ("__v_isShallow" === t) return r;
            if ("__v_raw" === t && n === (o ? r ? je : Ce : r ? Re : $e).get(e)) return e;
            const s = l(e);
            if (!o) {
                if (s && a(ne, t)) return Reflect.get(ne, t, n);
                if ("hasOwnProperty" === t) return oe
            }
            const i = Reflect.get(e, t, n);
            return (h(t) ? te.has(t) : ee(t)) ? i : (o || Q(e, "get", t), r ? i : Ke(i) ? s && w(t) ? i : i.value : v(i) ? o ? Ie(i) : Pe(i) : i)
        }
    }
    class se extends re {
        constructor(e = !1) {
            super(!0, e)
        }
        set(e, t) {
            return "production" !== process.env.NODE_ENV && C(`Set operation on key "${String(t)}" failed: target is readonly.`, e), !0
        }
        deleteProperty(e, t) {
            return "production" !== process.env.NODE_ENV && C(`Delete operation on key "${String(t)}" failed: target is readonly.`, e), !0
        }
    }
    const ie = new class extends re {
            constructor(e = !1) {
                super(!1, e)
            }
            set(e, t, n, o) {
                let r = e[t];
                if (Fe(r) && Ke(r) && !Ke(n)) return !1;
                if (!this._shallow && (Ue(n) || Fe(n) || (r = He(r), n = He(n)), !l(e) && Ke(r) && !Ke(n))) return r.value = n, !0;
                const s = l(e) && w(t) ? Number(t) < e.length : a(e, t),
                    i = Reflect.set(e, t, n, o);
                return e === He(o) && (s ? N(n, r) && X(e, "set", t, n, r) : X(e, "add", t, n)), i
            }
            deleteProperty(e, t) {
                const n = a(e, t),
                    o = e[t],
                    r = Reflect.deleteProperty(e, t);
                return r && n && X(e, "delete", t, void 0, o), r
            }
            has(e, t) {
                const n = Reflect.has(e, t);
                return h(t) && te.has(t) || Q(e, "has", t), n
            }
            ownKeys(e) {
                return Q(e, "iterate", l(e) ? "length" : H), Reflect.ownKeys(e)
            }
        },
        ce = new se,
        ae = new se(!0),
        le = e => e,
        ue = e => Reflect.getPrototypeOf(e);

    function pe(e, t, n = !1, o = !1) {
        const r = He(e = e.__v_raw),
            s = He(t);
        n || (N(t, s) && Q(r, "get", t), Q(r, "get", s));
        const {
            has: i
        } = ue(r), c = o ? le : n ? Je : We;
        return i.call(r, t) ? c(e.get(t)) : i.call(r, s) ? c(e.get(s)) : void(e !== r && e.get(t))
    }

    function fe(e, t = !1) {
        const n = this.__v_raw,
            o = He(n),
            r = He(e);
        return t || (N(e, r) && Q(o, "has", e), Q(o, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r)
    }

    function de(e, t = !1) {
        return e = e.__v_raw, !t && Q(He(e), "iterate", H), Reflect.get(e, "size", e)
    }

    function he(e) {
        e = He(e);
        const t = He(this);
        return ue(t).has.call(t, e) || (t.add(e), X(t, "add", e, e)), this
    }

    function ve(e, t) {
        t = He(t);
        const n = He(this),
            {
                has: o,
                get: r
            } = ue(n);
        let s = o.call(n, e);
        s ? "production" !== process.env.NODE_ENV && De(n, o, e) : (e = He(e), s = o.call(n, e));
        const i = r.call(n, e);
        return n.set(e, t), s ? N(t, i) && X(n, "set", e, t, i) : X(n, "add", e, t), this
    }

    function _e(e) {
        const t = He(this),
            {
                has: n,
                get: o
            } = ue(t);
        let r = n.call(t, e);
        r ? "production" !== process.env.NODE_ENV && De(t, n, e) : (e = He(e), r = n.call(t, e));
        const s = o ? o.call(t, e) : void 0,
            i = t.delete(e);
        return r && X(t, "delete", e, void 0, s), i
    }

    function ge() {
        const e = He(this),
            t = 0 !== e.size,
            n = "production" !== process.env.NODE_ENV ? u(e) ? new Map(e) : new Set(e) : void 0,
            o = e.clear();
        return t && X(e, "clear", void 0, void 0, n), o
    }

    function ye(e, t) {
        return function(n, o) {
            const r = this,
                s = r.__v_raw,
                i = He(s),
                c = t ? le : e ? Je : We;
            return !e && Q(i, "iterate", H), s.forEach(((e, t) => n.call(o, c(e), c(t), r)))
        }
    }

    function be(e, t, n) {
        return function(...o) {
            const r = this.__v_raw,
                s = He(r),
                i = u(s),
                c = "entries" === e || e === Symbol.iterator && i,
                a = "keys" === e && i,
                l = r[e](...o),
                p = n ? le : t ? Je : We;
            return !t && Q(s, "iterate", a ? W : H), {
                next() {
                    const {
                        value: e,
                        done: t
                    } = l.next();
                    return t ? {
                        value: e,
                        done: t
                    } : {
                        value: c ? [p(e[0]), p(e[1])] : p(e),
                        done: t
                    }
                },
                [Symbol.iterator]() {
                    return this
                }
            }
        }
    }

    function me(e) {
        return function(...t) {
            if ("production" !== process.env.NODE_ENV) {
                const n = t[0] ? `on key "${t[0]}" ` : "";
                console.warn(`${E(e)} operation ${n}failed: target is readonly.`, He(this))
            }
            return "delete" !== e && ("clear" === e ? void 0 : this)
        }
    }
    const [we, Ee, Ne, Oe] = function() {
        const e = {
                get(e) {
                    return pe(this, e)
                },
                get size() {
                    return de(this)
                },
                has: fe,
                add: he,
                set: ve,
                delete: _e,
                clear: ge,
                forEach: ye(!1, !1)
            },
            t = {
                get(e) {
                    return pe(this, e, !1, !0)
                },
                get size() {
                    return de(this)
                },
                has: fe,
                add: he,
                set: ve,
                delete: _e,
                clear: ge,
                forEach: ye(!1, !0)
            },
            n = {
                get(e) {
                    return pe(this, e, !0)
                },
                get size() {
                    return de(this, !0)
                },
                has(e) {
                    return fe.call(this, e, !0)
                },
                add: me("add"),
                set: me("set"),
                delete: me("delete"),
                clear: me("clear"),
                forEach: ye(!0, !1)
            },
            o = {
                get(e) {
                    return pe(this, e, !0, !0)
                },
                get size() {
                    return de(this, !0)
                },
                has(e) {
                    return fe.call(this, e, !0)
                },
                add: me("add"),
                set: me("set"),
                delete: me("delete"),
                clear: me("clear"),
                forEach: ye(!0, !0)
            };
        return ["keys", "values", "entries", Symbol.iterator].forEach((r => {
            e[r] = be(r, !1, !1), n[r] = be(r, !0, !1), t[r] = be(r, !1, !0), o[r] = be(r, !0, !0)
        })), [e, n, t, o]
    }();

    function ke(e, t) {
        const n = t ? e ? Oe : Ne : e ? Ee : we;
        return (t, o, r) => "__v_isReactive" === o ? !e : "__v_isReadonly" === o ? e : "__v_raw" === o ? t : Reflect.get(a(n, o) && o in t ? n : t, o, r)
    }
    const Ve = {
            get: ke(!1, !1)
        },
        Se = {
            get: ke(!0, !1)
        },
        xe = {
            get: ke(!0, !0)
        };

    function De(e, t, n) {
        const o = He(n);
        if (o !== n && t.call(e, o)) {
            const t = b(e);
            console.warn(`Reactive ${t} contains both the raw and reactive versions of the same object${"Map"===t?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)
        }
    }
    const $e = new WeakMap,
        Re = new WeakMap,
        Ce = new WeakMap,
        je = new WeakMap;

    function Pe(e) {
        return Fe(e) ? e : Me(e, !1, ie, Ve, $e)
    }

    function Ie(e) {
        return Me(e, !0, ce, Se, Ce)
    }

    function Te(e) {
        return Me(e, !0, ae, xe, je)
    }

    function Me(e, t, n, o, r) {
        if (!v(e)) return "production" !== process.env.NODE_ENV && console.warn(`value cannot be made reactive: ${String(e)}`), e;
        if (e.__v_raw && (!t || !e.__v_isReactive)) return e;
        const s = r.get(e);
        if (s) return s;
        const i = (c = e).__v_skip || !Object.isExtensible(c) ? 0 : function(e) {
            switch (e) {
                case "Object":
                case "Array":
                    return 1;
                case "Map":
                case "Set":
                case "WeakMap":
                case "WeakSet":
                    return 2;
                default:
                    return 0
            }
        }(b(c));
        var c;
        if (0 === i) return e;
        const a = new Proxy(e, 2 === i ? o : n);
        return r.set(e, a), a
    }

    function Ae(e) {
        return Fe(e) ? Ae(e.__v_raw) : !(!e || !e.__v_isReactive)
    }

    function Fe(e) {
        return !(!e || !e.__v_isReadonly)
    }

    function Ue(e) {
        return !(!e || !e.__v_isShallow)
    }

    function ze(e) {
        return Ae(e) || Fe(e)
    }

    function He(e) {
        const t = e && e.__v_raw;
        return t ? He(t) : e
    }
    const We = e => v(e) ? Pe(e) : e,
        Je = e => v(e) ? Ie(e) : e;

    function Ke(e) {
        return !(!e || !0 !== e.__v_isRef)
    }
    const qe = {
            get: (e, t, n) => {
                return Ke(o = Reflect.get(e, t, n)) ? o.value : o;
                var o
            },
            set: (e, t, n, o) => {
                const r = e[t];
                return Ke(r) && !Ke(n) ? (r.value = n, !0) : Reflect.set(e, t, n, o)
            }
        },
        Be = [];

    function Le(e, ...t) {
        if ("production" === process.env.NODE_ENV) return;
        L();
        const n = Be.length ? Be[Be.length - 1].component : null,
            o = n && n.appContext.config.warnHandler,
            r = function() {
                let e = Be[Be.length - 1];
                if (!e) return [];
                const t = [];
                for (; e;) {
                    const n = t[0];
                    n && n.vnode === e ? n.recurseCount++ : t.push({
                        vnode: e,
                        recurseCount: 0
                    });
                    const o = e.component && e.component.parent;
                    e = o && o.vnode
                }
                return t
            }();
        if (o) Ye(o, n, 11, [e + t.join(""), n && n.proxy, r.map((({
            vnode: e
        }) => `at <${fn(n,e.type)}>`)).join("\n"), r]);
        else {
            const n = [`[Vue warn]: ${e}`, ...t];
            r.length && n.push("\n", ... function(e) {
                const t = [];
                return e.forEach(((e, n) => {
                    t.push(...0 === n ? [] : ["\n"], ... function({
                        vnode: e,
                        recurseCount: t
                    }) {
                        const n = t > 0 ? `... (${t} recursive calls)` : "",
                            o = !!e.component && null == e.component.parent,
                            r = ` at <${fn(e.component,e.type,o)}`,
                            s = ">" + n;
                        return e.props ? [r, ...Ge(e.props), s] : [r + s]
                    }(e))
                })), t
            }(r)), console.warn(...n)
        }
        G()
    }

    function Ge(e) {
        const t = [],
            n = Object.keys(e);
        return n.slice(0, 3).forEach((n => {
            t.push(...Qe(n, e[n]))
        })), n.length > 3 && t.push(" ..."), t
    }

    function Qe(e, t, n) {
        return d(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : "number" == typeof t || "boolean" == typeof t || null == t ? n ? t : [`${e}=${t}`] : Ke(t) ? (t = Qe(e, He(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : f(t) ? [`${e}=fn${t.name?`<${t.name}>`:""}`] : (t = He(t), n ? t : [`${e}=`, t])
    }
    const Xe = {
        sp: "serverPrefetch hook",
        bc: "beforeCreate hook",
        c: "created hook",
        bm: "beforeMount hook",
        m: "mounted hook",
        bu: "beforeUpdate hook",
        u: "updated",
        bum: "beforeUnmount hook",
        um: "unmounted hook",
        a: "activated hook",
        da: "deactivated hook",
        ec: "errorCaptured hook",
        rtc: "renderTracked hook",
        rtg: "renderTriggered hook",
        0: "setup function",
        1: "render function",
        2: "watcher getter",
        3: "watcher callback",
        4: "watcher cleanup function",
        5: "native event handler",
        6: "component event handler",
        7: "vnode hook",
        8: "directive hook",
        9: "transition hook",
        10: "app errorHandler",
        11: "app warnHandler",
        12: "ref function",
        13: "async component loader",
        14: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
    };

    function Ye(e, t, n, o) {
        let r;
        try {
            r = o ? e(...o) : e()
        } catch (e) {
            et(e, t, n)
        }
        return r
    }

    function Ze(e, t, n, o) {
        if (f(e)) {
            const r = Ye(e, t, n, o);
            return r && _(r) && r.catch((e => {
                et(e, t, n)
            })), r
        }
        const r = [];
        for (let s = 0; s < e.length; s++) r.push(Ze(e[s], t, n, o));
        return r
    }

    function et(e, t, n, o = !0) {
        const r = t ? t.vnode : null;
        if (t) {
            let o = t.parent;
            const r = t.proxy,
                s = "production" !== process.env.NODE_ENV ? Xe[n] : n;
            for (; o;) {
                const t = o.ec;
                if (t)
                    for (let n = 0; n < t.length; n++)
                        if (!1 === t[n](e, r, s)) return;
                o = o.parent
            }
            const i = t.appContext.config.errorHandler;
            if (i) return void Ye(i, null, 10, [e, r, s])
        }! function(e, t, n, o = !0) {
            if ("production" !== process.env.NODE_ENV) {
                const s = Xe[t];
                if (n && (r = n, Be.push(r)), Le("Unhandled error" + (s ? ` during execution of ${s}` : "")), n && Be.pop(), o) throw e;
                console.error(e)
            } else console.error(e);
            var r
        }(e, n, r, o)
    }
    let tt = !1,
        nt = !1;
    const ot = [];
    let rt = 0;
    const st = [];
    let it = null,
        ct = 0;
    const at = Promise.resolve();
    let lt = null;
    const ut = 100;

    function pt(e) {
        const t = lt || at;
        return e ? t.then(this ? e.bind(this) : e) : t
    }

    function ft(e) {
        ot.length && ot.includes(e, tt && e.allowRecurse ? rt + 1 : rt) || (null == e.id ? ot.push(e) : ot.splice(function(e) {
            let t = rt + 1,
                n = ot.length;
            for (; t < n;) {
                const o = t + n >>> 1,
                    r = ot[o],
                    s = vt(r);
                s < e || s === e && r.pre ? t = o + 1 : n = o
            }
            return t
        }(e.id), 0, e), dt())
    }

    function dt() {
        tt || nt || (nt = !0, lt = at.then(gt))
    }

    function ht(e) {
        l(e) ? st.push(...e) : it && it.includes(e, e.allowRecurse ? ct + 1 : ct) || st.push(e), dt()
    }
    const vt = e => null == e.id ? 1 / 0 : e.id,
        _t = (e, t) => {
            const n = vt(e) - vt(t);
            if (0 === n) {
                if (e.pre && !t.pre) return -1;
                if (t.pre && !e.pre) return 1
            }
            return n
        };

    function gt(e) {
        nt = !1, tt = !0, "production" !== process.env.NODE_ENV && (e = e || new Map), ot.sort(_t);
        const t = "production" !== process.env.NODE_ENV ? t => yt(e, t) : n;
        try {
            for (rt = 0; rt < ot.length; rt++) {
                const e = ot[rt];
                if (e && !1 !== e.active) {
                    if ("production" !== process.env.NODE_ENV && t(e)) continue;
                    Ye(e, null, 14)
                }
            }
        } finally {
            rt = 0, ot.length = 0,
                function(e) {
                    if (st.length) {
                        const t = [...new Set(st)];
                        if (st.length = 0, it) return void it.push(...t);
                        for (it = t, "production" !== process.env.NODE_ENV && (e = e || new Map), it.sort(((e, t) => vt(e) - vt(t))), ct = 0; ct < it.length; ct++) "production" !== process.env.NODE_ENV && yt(e, it[ct]) || it[ct]();
                        it = null, ct = 0
                    }
                }(e), tt = !1, lt = null, (ot.length || st.length) && gt(e)
        }
    }

    function yt(e, t) {
        if (e.has(t)) {
            const n = e.get(t);
            if (n > ut) {
                const e = t.ownerInstance,
                    n = e && pn(e.type);
                return Le(`Maximum recursive updates exceeded${n?` in component <${n}>`:""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`), !0
            }
            e.set(t, n + 1)
        } else e.set(t, 1)
    }
    const bt = new Set;
    "production" !== process.env.NODE_ENV && (k().__VUE_HMR_RUNTIME__ = {
        createRecord: Nt((function(e, t) {
            return !mt.has(e) && (mt.set(e, {
                initialDef: wt(t),
                instances: new Set
            }), !0)
        })),
        rerender: Nt((function(e, t) {
            const n = mt.get(e);
            n && (n.initialDef.render = t, [...n.instances].forEach((e => {
                t && (e.render = t, wt(e.type).render = t), e.renderCache = [], e.update()
            })))
        })),
        reload: Nt((function(e, t) {
            const n = mt.get(e);
            if (!n) return;
            t = wt(t), Et(n.initialDef, t);
            const o = [...n.instances];
            for (const e of o) {
                const o = wt(e.type);
                bt.has(o) || (o !== n.initialDef && Et(o, t), bt.add(o)), e.appContext.propsCache.delete(e.type), e.appContext.emitsCache.delete(e.type), e.appContext.optionsCache.delete(e.type), e.ceReload ? (bt.add(o), e.ceReload(t.styles), bt.delete(o)) : e.parent ? ft(e.parent.update) : e.appContext.reload ? e.appContext.reload() : "undefined" != typeof window ? window.location.reload() : console.warn("[HMR] Root or manually mounted instance modified. Full reload required.")
            }
            ht((() => {
                for (const e of o) bt.delete(wt(e.type))
            }))
        }))
    });
    const mt = new Map;

    function wt(e) {
        return dn(e) ? e.__vccOpts : e
    }

    function Et(e, t) {
        s(e, t);
        for (const n in e) "__file" === n || n in t || delete e[n]
    }

    function Nt(e) {
        return (t, n) => {
            try {
                return e(t, n)
            } catch (e) {
                console.error(e), console.warn("[HMR] Something went wrong during Vue component hot-reload. Full reload required.")
            }
        }
    }
    let Ot = null;
    const kt = Symbol.for("v-ndc"),
        Vt = {};

    function St(e, o, {
        immediate: r,
        deep: s,
        flush: c,
        onTrack: a,
        onTrigger: u
    } = t) {
        var p;
        "production" === process.env.NODE_ENV || o || (void 0 !== r && Le('watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'), void 0 !== s && Le('watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'));
        const d = e => {
                Le("Invalid watch source: ", e, "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.")
            },
            h = j === (null == (p = rn) ? void 0 : p.scope) ? rn : null;
        let v, _, g = !1,
            y = !1;
        if (Ke(e) ? (v = () => e.value, g = Ue(e)) : Ae(e) ? (v = () => e, s = !0) : l(e) ? (y = !0, g = e.some((e => Ae(e) || Ue(e))), v = () => e.map((e => Ke(e) ? e.value : Ae(e) ? Dt(e) : f(e) ? Ye(e, h, 2) : void("production" !== process.env.NODE_ENV && d(e))))) : f(e) ? v = o ? () => Ye(e, h, 2) : () => {
                if (!h || !h.isUnmounted) return _ && _(), Ze(e, h, 3, [b])
            } : (v = n, "production" !== process.env.NODE_ENV && d(e)), o && s) {
            const e = v;
            v = () => Dt(e())
        }
        let b = e => {
                _ = O.onStop = () => {
                    Ye(e, h, 4), _ = O.onStop = void 0
                }
            },
            m = y ? new Array(e.length).fill(Vt) : Vt;
        const w = () => {
            if (O.active)
                if (o) {
                    const e = O.run();
                    (s || g || (y ? e.some(((e, t) => N(e, m[t]))) : N(e, m))) && (_ && _(), Ze(o, h, 3, [e, m === Vt ? void 0 : y && m[0] === Vt ? [] : m, b]), m = e)
                } else O.run()
        };
        let E;
        w.allowRecurse = !!o, "sync" === c ? E = w : "post" === c ? E = () => Wt(w, h && h.suspense) : (w.pre = !0, h && (w.id = h.uid), E = () => ft(w));
        const O = new J(v, E);
        return "production" !== process.env.NODE_ENV && (O.onTrack = a, O.onTrigger = u), o ? r ? w() : m = O.run() : "post" === c ? Wt(O.run.bind(O), h && h.suspense) : O.run(), () => {
            O.stop(), h && h.scope && i(h.scope.effects, O)
        }
    }

    function xt(e, t, n) {
        const o = this.proxy,
            r = d(e) ? e.includes(".") ? function(e, t) {
                const n = t.split(".");
                return () => {
                    let t = e;
                    for (let e = 0; e < n.length && t; e++) t = t[n[e]];
                    return t
                }
            }(o, e) : () => o[e] : e.bind(o, o);
        let s;
        f(t) ? s = t : (s = t.handler, n = t);
        const i = rn;
        cn(this);
        const c = St(r, s.bind(o), n);
        return i ? cn(i) : an(), c
    }

    function Dt(e, t) {
        if (!v(e) || e.__v_skip) return e;
        if ((t = t || new Set).has(e)) return e;
        if (t.add(e), Ke(e)) Dt(e.value, t);
        else if (l(e))
            for (let n = 0; n < e.length; n++) Dt(e[n], t);
        else if (p(e) || u(e)) e.forEach((e => {
            Dt(e, t)
        }));
        else if (m(e))
            for (const n in e) Dt(e[n], t);
        return e
    }
    const $t = e => e ? 4 & e.vnode.shapeFlag ? function(e) {
            if (e.exposed) return e.exposeProxy || (e.exposeProxy = new Proxy((((e, t, n) => {
                Object.defineProperty(e, t, {
                    configurable: !0,
                    enumerable: !1,
                    value: n
                })
            })(n = e.exposed, "__v_skip", !0), Ae(t = n) ? t : new Proxy(t, qe)), {
                get: (t, n) => n in t ? t[n] : n in Rt ? Rt[n](e) : void 0,
                has: (e, t) => t in e || t in Rt
            }));
            var t, n
        }(e) || e.proxy : $t(e.parent) : null,
        Rt = s(Object.create(null), {
            $: e => e,
            $el: e => e.vnode.el,
            $data: e => e.data,
            $props: e => "production" !== process.env.NODE_ENV ? Te(e.props) : e.props,
            $attrs: e => "production" !== process.env.NODE_ENV ? Te(e.attrs) : e.attrs,
            $slots: e => "production" !== process.env.NODE_ENV ? Te(e.slots) : e.slots,
            $refs: e => "production" !== process.env.NODE_ENV ? Te(e.refs) : e.refs,
            $parent: e => $t(e.parent),
            $root: e => $t(e.root),
            $emit: e => e.emit,
            $options: e => __VUE_OPTIONS_API__ ? function(e) {
                const t = e.type,
                    {
                        mixins: n,
                        extends: o
                    } = t,
                    {
                        mixins: r,
                        optionsCache: s,
                        config: {
                            optionMergeStrategies: i
                        }
                    } = e.appContext,
                    c = s.get(t);
                let a;
                return c ? a = c : r.length || n || o ? (a = {}, r.length && r.forEach((e => Tt(a, e, i, !0))), Tt(a, t, i)) : a = t, v(t) && s.set(t, a), a
            }(e) : e.type,
            $forceUpdate: e => e.f || (e.f = () => ft(e.update)),
            $nextTick: e => e.n || (e.n = pt.bind(e.proxy)),
            $watch: e => __VUE_OPTIONS_API__ ? xt.bind(e) : n
        }),
        Ct = (e, n) => e !== t && !e.__isScriptSetup && a(e, n),
        jt = {
            get({
                _: e
            }, n) {
                const {
                    ctx: o,
                    setupState: r,
                    data: s,
                    props: i,
                    accessCache: c,
                    type: l,
                    appContext: u
                } = e;
                if ("production" !== process.env.NODE_ENV && "__isVue" === n) return !0;
                let p;
                if ("$" !== n[0]) {
                    const l = c[n];
                    if (void 0 !== l) switch (l) {
                        case 1:
                            return r[n];
                        case 2:
                            return s[n];
                        case 4:
                            return o[n];
                        case 3:
                            return i[n]
                    } else {
                        if (Ct(r, n)) return c[n] = 1, r[n];
                        if (s !== t && a(s, n)) return c[n] = 2, s[n];
                        if ((p = e.propsOptions[0]) && a(p, n)) return c[n] = 3, i[n];
                        if (o !== t && a(o, n)) return c[n] = 4, o[n];
                        __VUE_OPTIONS_API__ && !It || (c[n] = 0)
                    }
                }
                const f = Rt[n];
                let h, v;
                return f ? ("$attrs" === n ? (Q(e, "get", n), process.env.NODE_ENV) : "production" !== process.env.NODE_ENV && "$slots" === n && Q(e, "get", n), f(e)) : (h = l.__cssModules) && (h = h[n]) ? h : o !== t && a(o, n) ? (c[n] = 4, o[n]) : (v = u.config.globalProperties, a(v, n) ? v[n] : void("production" === process.env.NODE_ENV || !Ot || d(n) && 0 === n.indexOf("__v") || (s !== t && (e => "_" === e || "$" === e)(n[0]) && a(s, n) ? Le(`Property ${JSON.stringify(n)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`) : e === Ot && Le(`Property ${JSON.stringify(n)} was accessed during render but is not defined on instance.`))))
            },
            set({
                _: e
            }, n, o) {
                const {
                    data: r,
                    setupState: s,
                    ctx: i
                } = e;
                return Ct(s, n) ? (s[n] = o, !0) : "production" !== process.env.NODE_ENV && s.__isScriptSetup && a(s, n) ? (Le(`Cannot mutate <script setup> binding "${n}" from Options API.`), !1) : r !== t && a(r, n) ? (r[n] = o, !0) : a(e.props, n) ? ("production" !== process.env.NODE_ENV && Le(`Attempting to mutate prop "${n}". Props are readonly.`), !1) : "$" === n[0] && n.slice(1) in e ? ("production" !== process.env.NODE_ENV && Le(`Attempting to mutate public property "${n}". Properties starting with $ are reserved and readonly.`), !1) : ("production" !== process.env.NODE_ENV && n in e.appContext.config.globalProperties ? Object.defineProperty(i, n, {
                    enumerable: !0,
                    configurable: !0,
                    value: o
                }) : i[n] = o, !0)
            },
            has({
                _: {
                    data: e,
                    setupState: n,
                    accessCache: o,
                    ctx: r,
                    appContext: s,
                    propsOptions: i
                }
            }, c) {
                let l;
                return !!o[c] || e !== t && a(e, c) || Ct(n, c) || (l = i[0]) && a(l, c) || a(r, c) || a(Rt, c) || a(s.config.globalProperties, c)
            },
            defineProperty(e, t, n) {
                return null != n.get ? e._.accessCache[t] = 0 : a(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n)
            }
        };

    function Pt(e) {
        return l(e) ? e.reduce(((e, t) => (e[t] = null, e)), {}) : e
    }
    "production" !== process.env.NODE_ENV && (jt.ownKeys = e => (Le("Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."), Reflect.ownKeys(e)));
    let It = !0;

    function Tt(e, t, n, o = !1) {
        const {
            mixins: r,
            extends: s
        } = t;
        s && Tt(e, s, n, !0), r && r.forEach((t => Tt(e, t, n, !0)));
        for (const r in t)
            if (o && "expose" === r) "production" !== process.env.NODE_ENV && Le('"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.');
            else {
                const o = Mt[r] || n && n[r];
                e[r] = o ? o(e[r], t[r]) : t[r]
            } return e
    }
    const Mt = {
        data: At,
        props: Ht,
        emits: Ht,
        methods: zt,
        computed: zt,
        beforeCreate: Ut,
        created: Ut,
        beforeMount: Ut,
        mounted: Ut,
        beforeUpdate: Ut,
        updated: Ut,
        beforeDestroy: Ut,
        beforeUnmount: Ut,
        destroyed: Ut,
        unmounted: Ut,
        activated: Ut,
        deactivated: Ut,
        errorCaptured: Ut,
        serverPrefetch: Ut,
        components: zt,
        directives: zt,
        watch: function(e, t) {
            if (!e) return t;
            if (!t) return e;
            const n = s(Object.create(null), e);
            for (const o in t) n[o] = Ut(e[o], t[o]);
            return n
        },
        provide: At,
        inject: function(e, t) {
            return zt(Ft(e), Ft(t))
        }
    };

    function At(e, t) {
        return t ? e ? function() {
            return s(f(e) ? e.call(this, this) : e, f(t) ? t.call(this, this) : t)
        } : t : e
    }

    function Ft(e) {
        if (l(e)) {
            const t = {};
            for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
            return t
        }
        return e
    }

    function Ut(e, t) {
        return e ? [...new Set([].concat(e, t))] : t
    }

    function zt(e, t) {
        return e ? s(Object.create(null), e, t) : t
    }

    function Ht(e, t) {
        return e ? l(e) && l(t) ? [...new Set([...e, ...t])] : s(Object.create(null), Pt(e), Pt(null != t ? t : {})) : t
    }
    const Wt = function(e, t) {
            t && t.pendingBranch ? l(e) ? t.effects.push(...e) : t.effects.push(e) : ht(e)
        },
        Jt = Symbol.for("v-fgt"),
        Kt = Symbol.for("v-txt"),
        qt = Symbol.for("v-cmt");
    const Bt = "__vInternal",
        Lt = ({
            key: e
        }) => null != e ? e : null,
        Gt = ({
            ref: e,
            ref_key: t,
            ref_for: n
        }) => ("number" == typeof e && (e = "" + e), null != e ? d(e) || Ke(e) || f(e) ? {
            i: Ot,
            r: e,
            k: t,
            f: !!n
        } : e : null),
        Qt = "production" !== process.env.NODE_ENV ? (...e) => Xt(...e) : Xt;

    function Xt(e, t = null, n = null, o = 0, r = null, i = !1) {
        if (e && e !== kt || ("production" === process.env.NODE_ENV || e || Le(`Invalid vnode type when creating vnode: ${e}.`), e = qt), (c = e) && !0 === c.__v_isVNode) {
            const o = Yt(e, t, !0);
            return n && tn(o, n), o.patchFlag |= -2, o
        }
        var c;
        if (dn(e) && (e = e.__vccOpts), t) {
            t = function(e) {
                return e ? ze(e) || Bt in e ? s({}, e) : e : null
            }(t);
            let {
                class: e,
                style: n
            } = t;
            e && !d(e) && (t.class = R(e)), v(n) && (ze(n) && !l(n) && (n = s({}, n)), t.style = V(n))
        }
        const a = d(e) ? 1 : (e => e.__isSuspense)(e) ? 128 : (e => e.__isTeleport)(e) ? 64 : v(e) ? 4 : f(e) ? 2 : 0;
        return "production" !== process.env.NODE_ENV && 4 & a && ze(e) && Le("Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.", "\nComponent that was made reactive: ", e = He(e)),
            function(e, t = null, n = null, o = 0, r = null, s = (e === Jt ? 0 : 1), i = !1, c = !1) {
                const a = {
                    __v_isVNode: !0,
                    __v_skip: !0,
                    type: e,
                    props: t,
                    key: t && Lt(t),
                    ref: t && Gt(t),
                    scopeId: null,
                    slotScopeIds: null,
                    children: n,
                    component: null,
                    suspense: null,
                    ssContent: null,
                    ssFallback: null,
                    dirs: null,
                    transition: null,
                    el: null,
                    anchor: null,
                    target: null,
                    targetAnchor: null,
                    staticCount: 0,
                    shapeFlag: s,
                    patchFlag: o,
                    dynamicProps: r,
                    dynamicChildren: null,
                    appContext: null,
                    ctx: Ot
                };
                return c ? (tn(a, n), 128 & s && e.normalize(a)) : n && (a.shapeFlag |= d(n) ? 8 : 16), "production" !== process.env.NODE_ENV && a.key != a.key && Le("VNode created with invalid key (NaN). VNode type:", a.type), a
            }(e, t, n, o, r, a, i, !0)
    }

    function Yt(e, t, n = !1) {
        const {
            props: o,
            ref: s,
            patchFlag: i,
            children: c
        } = e, a = t ? function(...e) {
            const t = {};
            for (let n = 0; n < e.length; n++) {
                const o = e[n];
                for (const e in o)
                    if ("class" === e) t.class !== o.class && (t.class = R([t.class, o.class]));
                    else if ("style" === e) t.style = V([t.style, o.style]);
                else if (r(e)) {
                    const n = t[e],
                        r = o[e];
                    !r || n === r || l(n) && n.includes(r) || (t[e] = n ? [].concat(n, r) : r)
                } else "" !== e && (t[e] = o[e])
            }
            return t
        }(o || {}, t) : o;
        return {
            __v_isVNode: !0,
            __v_skip: !0,
            type: e.type,
            props: a,
            key: a && Lt(a),
            ref: t && t.ref ? n && s ? l(s) ? s.concat(Gt(t)) : [s, Gt(t)] : Gt(t) : s,
            scopeId: e.scopeId,
            slotScopeIds: e.slotScopeIds,
            children: "production" !== process.env.NODE_ENV && -1 === i && l(c) ? c.map(Zt) : c,
            target: e.target,
            targetAnchor: e.targetAnchor,
            staticCount: e.staticCount,
            shapeFlag: e.shapeFlag,
            patchFlag: t && e.type !== Jt ? -1 === i ? 16 : 16 | i : i,
            dynamicProps: e.dynamicProps,
            dynamicChildren: e.dynamicChildren,
            appContext: e.appContext,
            dirs: e.dirs,
            transition: e.transition,
            component: e.component,
            suspense: e.suspense,
            ssContent: e.ssContent && Yt(e.ssContent),
            ssFallback: e.ssFallback && Yt(e.ssFallback),
            el: e.el,
            anchor: e.anchor,
            ctx: e.ctx,
            ce: e.ce
        }
    }

    function Zt(e) {
        const t = Yt(e);
        return l(e.children) && (t.children = e.children.map(Zt)), t
    }

    function en(e = " ", t = 0) {
        return Qt(Kt, null, e, t)
    }

    function tn(e, t) {
        let n = 0;
        const {
            shapeFlag: o
        } = e;
        if (null == t) t = null;
        else if (l(t)) n = 16;
        else if ("object" == typeof t) {
            if (65 & o) {
                const n = t.default;
                return void(n && (n._c && (n._d = !1), tn(e, n()), n._c && (n._d = !0)))
            } {
                n = 32;
                const o = t._;
                o || Bt in t ? 3 === o && Ot && (1 === Ot.slots._ ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024)) : t._ctx = Ot
            }
        } else f(t) ? (t = {
            default: t,
            _ctx: Ot
        }, n = 32) : (t = String(t), 64 & o ? (n = 16, t = [en(t)]) : n = 8);
        e.children = t, e.shapeFlag |= n
    }
    let nn, on, rn = null,
        sn = "__VUE_INSTANCE_SETTERS__";
    (on = k()[sn]) || (on = k()[sn] = []), on.push((e => rn = e)), nn = e => {
        on.length > 1 ? on.forEach((t => t(e))) : on[0](e)
    };
    const cn = e => {
            nn(e), e.scope.on()
        },
        an = () => {
            rn && rn.scope.off(), nn(null)
        },
        ln = /(?:^|[-_])(\w)/g,
        un = e => e.replace(ln, (e => e.toUpperCase())).replace(/[-_]/g, "");

    function pn(e, t = !0) {
        return f(e) ? e.displayName || e.name : e.name || t && e.__name
    }

    function fn(e, t, n = !1) {
        let o = pn(t);
        if (!o && t.__file) {
            const e = t.__file.match(/([^/\\]+)\.\w+$/);
            e && (o = e[1])
        }
        if (!o && e && e.parent) {
            const n = e => {
                for (const n in e)
                    if (e[n] === t) return n
            };
            o = n(e.components || e.parent.type.components) || n(e.appContext.components)
        }
        return o ? un(o) : n ? "App" : "Anonymous"
    }

    function dn(e) {
        return f(e) && "__vccOpts" in e
    }

    function hn(e) {
        return !(!e || !e.__v_isShallow)
    }

    function vn(e, t, n) {
        if (n || 2 === arguments.length)
            for (var o, r = 0, s = t.length; r < s; r++) !o && r in t || (o || (o = Array.prototype.slice.call(t, 0, r)), o[r] = t[r]);
        return e.concat(o || Array.prototype.slice.call(t))
    }

    function _n(e, t) {
        if (e === t) return !0;
        if ("object" == typeof e) {
            for (var n in e)
                if (!_n(e[n], t[n])) return !1;
            return !0
        }
        return !1
    }
    "production" !== process.env.NODE_ENV && function() {
        if ("production" === process.env.NODE_ENV || "undefined" == typeof window) return;
        const e = {
                style: "color:#3ba776"
            },
            n = {
                style: "color:#0b1bc9"
            },
            o = {
                style: "color:#b62e24"
            },
            r = {
                style: "color:#9d288c"
            },
            i = {
                header: t => v(t) ? t.__isVue ? ["div", e, "VueInstance"] : Ke(t) ? ["div", {},
                    ["span", e, h(t)], "<", u(t.value), ">"
                ] : Ae(t) ? ["div", {},
                    ["span", e, hn(t) ? "ShallowReactive" : "Reactive"], "<", u(t), ">" + (Fe(t) ? " (readonly)" : "")
                ] : Fe(t) ? ["div", {},
                    ["span", e, hn(t) ? "ShallowReadonly" : "Readonly"], "<", u(t), ">"
                ] : null : null,
                hasBody: e => e && e.__isVue,
                body(e) {
                    if (e && e.__isVue) return ["div", {}, ...c(e.$)]
                }
            };

        function c(e) {
            const n = [];
            e.type.props && e.props && n.push(a("props", He(e.props))), e.setupState !== t && n.push(a("setup", e.setupState)), e.data !== t && n.push(a("data", He(e.data)));
            const o = p(e, "computed");
            o && n.push(a("computed", o));
            const s = p(e, "inject");
            return s && n.push(a("injected", s)), n.push(["div", {},
                ["span", {
                    style: r.style + ";opacity:0.66"
                }, "$ (internal): "],
                ["object", {
                    object: e
                }]
            ]), n
        }

        function a(e, t) {
            return t = s({}, t), Object.keys(t).length ? ["div", {
                    style: "line-height:1.25em;margin-bottom:0.6em"
                },
                ["div", {
                    style: "color:#476582"
                }, e],
                ["div", {
                    style: "padding-left:1.25em"
                }, ...Object.keys(t).map((e => ["div", {},
                    ["span", r, e + ": "], u(t[e], !1)
                ]))]
            ] : ["span", {}]
        }

        function u(e, t = !0) {
            return "number" == typeof e ? ["span", n, e] : "string" == typeof e ? ["span", o, JSON.stringify(e)] : "boolean" == typeof e ? ["span", r, e] : v(e) ? ["object", {
                object: t ? He(e) : e
            }] : ["span", o, String(e)]
        }

        function p(e, t) {
            const n = e.type;
            if (f(n)) return;
            const o = {};
            for (const r in e.ctx) d(n, r, t) && (o[r] = e.ctx[r]);
            return o
        }

        function d(e, t, n) {
            const o = e[n];
            return !!(l(o) && o.includes(t) || v(o) && t in o) || !(!e.extends || !d(e.extends, t, n)) || !(!e.mixins || !e.mixins.some((e => d(e, t, n)))) || void 0
        }

        function h(e) {
            return hn(e) ? "ShallowRef" : e.effect ? "ComputedRef" : "Ref"
        }
        window.devtoolsFormatters ? window.devtoolsFormatters.push(i) : window.devtoolsFormatters = [i]
    }(), "function" == typeof SuppressedError && SuppressedError;
    var gn = function() {
            function e(e, t) {
                this.el = e, this.observer = null, this.frozen = !1, this.createObserver(t)
            }
            return Object.defineProperty(e.prototype, "threshold", {
                get: function() {
                    return this.options.intersection && this.options.intersection.threshold || 0
                },
                enumerable: !1,
                configurable: !0
            }), e.prototype.createObserver = function(e) {
                var t = this;
                if (this.observer && this.destroyObserver(), !this.frozen) {
                    var n;
                    if (this.options = "function" == typeof(n = e) ? {
                            callback: n
                        } : n, this.callback = function(e, n) {
                            t.options.callback(e, n), e && t.options.once && (t.frozen = !0, t.destroyObserver())
                        }, this.callback && this.options.throttle) {
                        var o = (this.options.throttleOptions || {}).leading;
                        this.callback = function(e, t, n) {
                            var o, r, s;
                            void 0 === n && (n = {});
                            var i = function(i) {
                                for (var c = [], a = 1; a < arguments.length; a++) c[a - 1] = arguments[a];
                                if (s = c, !o || i !== r) {
                                    var l = n.leading;
                                    "function" == typeof l && (l = l(i, r)), o && i === r || !l || e.apply(void 0, vn([i], s, !1)), r = i, clearTimeout(o), o = setTimeout((function() {
                                        e.apply(void 0, vn([i], s, !1)), o = 0
                                    }), t)
                                }
                            };
                            return i._clear = function() {
                                clearTimeout(o), o = null
                            }, i
                        }(this.callback, this.options.throttle, {
                            leading: function(e) {
                                return "both" === o || "visible" === o && e || "hidden" === o && !e
                            }
                        })
                    }
                    this.oldResult = void 0, this.observer = new IntersectionObserver((function(e) {
                        var n = e[0];
                        if (e.length > 1) {
                            var o = e.find((function(e) {
                                return e.isIntersecting
                            }));
                            o && (n = o)
                        }
                        if (t.callback) {
                            var r = n.isIntersecting && n.intersectionRatio >= t.threshold;
                            if (r === t.oldResult) return;
                            t.oldResult = r, t.callback(r, n)
                        }
                    }), this.options.intersection), pt((function() {
                        t.observer && t.observer.observe(t.el)
                    }))
                }
            }, e.prototype.destroyObserver = function() {
                this.observer && (this.observer.disconnect(), this.observer = null), this.callback && this.callback._clear && (this.callback._clear(), this.callback = null)
            }, e
        }(),
        yn = {
            beforeMount: function(e, t) {
                var n = t.value;
                n && ("undefined" == typeof IntersectionObserver ? console.warn("[vue-observe-visibility] IntersectionObserver API is not available in your browser. Please install this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill") : e._vue_visibilityState = new gn(e, n))
            },
            updated: function(e, t) {
                var n = t.value;
                if (!_n(n, t.oldValue)) {
                    var o = e._vue_visibilityState;
                    n && o && o.createObserver(n)
                }
            },
            unmounted: function(e) {
                var t = e._vue_visibilityState;
                t && (t.destroyObserver(), delete e._vue_visibilityState)
            }
        },
        bn = {
            install: function(e) {
                e.directive("observe-visibility", yn)
            }
        };
    return e.ObserveVisibility = yn, e.default = bn, Object.defineProperty(e, "__esModule", {
        value: !0
    }), e
}({});
export default VueObserveVisibility;
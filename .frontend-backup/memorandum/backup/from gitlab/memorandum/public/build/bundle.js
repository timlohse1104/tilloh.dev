
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                info.blocks[i] = null;
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.19.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/content/Header.svelte generated by Svelte v3.19.1 */
    const file = "src/content/Header.svelte";

    function create_fragment(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let button;
    	let button_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Memorandum";
    			t1 = space();
    			button = element("button");
    			attr_dev(h1, "class", "svelte-1udwpjl");
    			add_location(h1, file, 63, 2, 1419);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*menuActive*/ ctx[0] ? "active" : "inactive") + " svelte-1udwpjl"));
    			add_location(button, file, 65, 2, 1442);
    			attr_dev(header, "class", "svelte-1udwpjl");
    			add_location(header, file, 62, 0, 1408);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t1);
    			append_dev(header, button);
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*menuActive*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*menuActive*/ ctx[0] ? "active" : "inactive") + " svelte-1udwpjl"))) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let menuActive = false;

    	const click_handler = () => {
    		$$invalidate(0, menuActive = !menuActive);
    		dispatch("menuActive", menuActive);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		menuActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("menuActive" in $$props) $$invalidate(0, menuActive = $$props.menuActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuActive, dispatch, click_handler];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    if(!localStorage.getItem("linkPreset")) {
        localStorage.setItem("linkPreset", '{"Folders": []}');
    }

    const localPreset = writable(
        JSON.parse(localStorage.getItem("linkPreset")) || "");

        localPreset.subscribe(val => 
            localStorage.setItem("linkPreset", JSON.stringify(val)));

    const linkOverlayOptions = 
        writable({
            "showOverlay": false, 
            "currentFolderId": undefined,
            "currentFolder": undefined,
            "currLinkId": undefined,
            "currLinkName": undefined,
            "currLinkUrl": undefined
        });

    if(!localStorage.getItem("light-theme")) {
        localStorage.setItem("light-theme", "false");
    }

    const lightTheme = writable(
        localStorage.getItem("light-theme") || "");

    lightTheme.subscribe(val => {
        localStorage.setItem("light-theme", val);
    });

    /* src/content/ThemeChooser.svelte generated by Svelte v3.19.1 */
    const file$1 = "src/content/ThemeChooser.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "id", "themeImg");
    			attr_dev(img, "alt", "Click to toggle dark and light theme");
    			if (img.src !== (img_src_value = "../images/white_bulb_off.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-tqxdut");
    			add_location(img, file$1, 14, 2, 300);
    			attr_dev(div, "id", "themeChooserBox");
    			attr_dev(div, "class", "svelte-tqxdut");
    			add_location(div, file$1, 13, 0, 271);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			dispose = listen_dev(img, "click", /*toggleTheme*/ ctx[0], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $lightTheme;
    	validate_store(lightTheme, "lightTheme");
    	component_subscribe($$self, lightTheme, $$value => $$invalidate(1, $lightTheme = $$value));

    	function toggleTheme() {
    		if ($lightTheme === "false") {
    			set_store_value(lightTheme, $lightTheme = "true");
    		} else {
    			set_store_value(lightTheme, $lightTheme = "false");
    		}

    		window.document.body.classList.toggle("light-theme");
    	}

    	$$self.$capture_state = () => ({
    		lightTheme,
    		toggleTheme,
    		$lightTheme,
    		window
    	});

    	return [toggleTheme];
    }

    class ThemeChooser extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ThemeChooser",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/content/RL_Player_Stats_Plugin.svelte generated by Svelte v3.19.1 */

    const file$2 = "src/content/RL_Player_Stats_Plugin.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let form;
    	let input;
    	let input_required_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			form = element("form");
    			input = element("input");
    			attr_dev(img, "id", "statsImg");
    			attr_dev(img, "alt", "Input a player id to ");
    			if (img.src !== (img_src_value = "../images/white_rl_player_stats.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-13bueib");
    			add_location(img, file$2, 11, 2, 274);
    			input.required = input_required_value = true;
    			attr_dev(input, "placeholder", PLACEHOLDER_TEXT);
    			attr_dev(input, "class", "svelte-13bueib");
    			add_location(input, file$2, 17, 4, 436);
    			attr_dev(form, "class", "svelte-13bueib");
    			add_location(form, file$2, 16, 2, 382);
    			attr_dev(div, "id", "wrapperBox");
    			attr_dev(div, "class", "svelte-13bueib");
    			add_location(div, file$2, 10, 0, 250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    			append_dev(div, form);
    			append_dev(form, input);
    			set_input_value(input, /*player_id*/ ctx[0]);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[3]),
    				listen_dev(form, "submit", prevent_default(/*loadPlayerStats*/ ctx[1]), false, true, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*player_id*/ 1 && input.value !== /*player_id*/ ctx[0]) {
    				set_input_value(input, /*player_id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const PLACEHOLDER_TEXT = "Rocket League Player ID";

    function instance$2($$self, $$props, $$invalidate) {
    	let player_id = "";

    	function loadPlayerStats() {
    		if (player_id) window.open(api_url, "_blank");
    	}

    	function input_input_handler() {
    		player_id = this.value;
    		$$invalidate(0, player_id);
    	}

    	$$self.$capture_state = () => ({
    		PLACEHOLDER_TEXT,
    		player_id,
    		loadPlayerStats,
    		api_url,
    		window
    	});

    	$$self.$inject_state = $$props => {
    		if ("player_id" in $$props) $$invalidate(0, player_id = $$props.player_id);
    		if ("api_url" in $$props) api_url = $$props.api_url;
    	};

    	let api_url;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*player_id*/ 1) {
    			 api_url = `https://api.tilloh.dev/player_stats/${player_id}`;
    		}
    	};

    	return [player_id, loadPlayerStats, api_url, input_input_handler];
    }

    class RL_Player_Stats_Plugin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RL_Player_Stats_Plugin",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function slide(node, { delay = 0, duration = 400, easing = cubicOut }) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => `overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src/content/Menu.svelte generated by Svelte v3.19.1 */
    const file$3 = "src/content/Menu.svelte";

    // (9:0) {#if isActive}
    function create_if_block(ctx) {
    	let nav;
    	let t;
    	let nav_class_value;
    	let nav_intro;
    	let current;
    	const themechooser = new ThemeChooser({ $$inline: true });
    	const rl_player_stats_plugin = new RL_Player_Stats_Plugin({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(themechooser.$$.fragment);
    			t = space();
    			create_component(rl_player_stats_plugin.$$.fragment);
    			attr_dev(nav, "class", nav_class_value = "" + (null_to_empty(/*isActive*/ ctx[0] ? "active" : "inactive") + " svelte-1gyuxx8"));
    			add_location(nav, file$3, 9, 2, 238);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(themechooser, nav, null);
    			append_dev(nav, t);
    			mount_component(rl_player_stats_plugin, nav, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*isActive*/ 1 && nav_class_value !== (nav_class_value = "" + (null_to_empty(/*isActive*/ ctx[0] ? "active" : "inactive") + " svelte-1gyuxx8"))) {
    				attr_dev(nav, "class", nav_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(themechooser.$$.fragment, local);
    			transition_in(rl_player_stats_plugin.$$.fragment, local);

    			if (!nav_intro) {
    				add_render_callback(() => {
    					nav_intro = create_in_transition(nav, slide, { y: -10, duration: 1000 });
    					nav_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(themechooser.$$.fragment, local);
    			transition_out(rl_player_stats_plugin.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(themechooser);
    			destroy_component(rl_player_stats_plugin);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(9:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*isActive*/ ctx[0] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { isActive = false } = $$props;
    	const writable_props = ["isActive"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("isActive" in $$props) $$invalidate(0, isActive = $$props.isActive);
    	};

    	$$self.$capture_state = () => ({
    		ThemeChooser,
    		RL_Player_Stats_Plugin,
    		slide,
    		isActive
    	});

    	$$self.$inject_state = $$props => {
    		if ("isActive" in $$props) $$invalidate(0, isActive = $$props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [isActive];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { isActive: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get isActive() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/content/Link.svelte generated by Svelte v3.19.1 */
    const file$4 = "src/content/Link.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let img;
    	let img_alt_value;
    	let img_src_value;
    	let t0;
    	let a;
    	let t1;
    	let t2;
    	let button;
    	let div_draggable_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			a = element("a");
    			t1 = text(/*linkName*/ ctx[1]);
    			t2 = space();
    			button = element("button");
    			button.textContent = "-";
    			attr_dev(img, "alt", img_alt_value = "Website logo of " + /*linkName*/ ctx[1]);
    			if (img.src !== (img_src_value = "https://www.google.com/s2/favicons?domain=" + /*linkUrl*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-tewop1");
    			add_location(img, file$4, 15, 4, 316);
    			attr_dev(a, "href", /*linkUrl*/ ctx[2]);
    			attr_dev(a, "class", "svelte-tewop1");
    			add_location(a, file$4, 23, 4, 581);
    			attr_dev(button, "class", "svelte-tewop1");
    			add_location(button, file$4, 27, 4, 635);
    			attr_dev(div, "id", "link");
    			attr_dev(div, "draggable", div_draggable_value = true);
    			attr_dev(div, "class", "svelte-tewop1");
    			add_location(div, file$4, 12, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, a);
    			append_dev(a, t1);
    			append_dev(div, t2);
    			append_dev(div, button);

    			dispose = [
    				listen_dev(img, "click", /*click_handler*/ ctx[5], false, false, false),
    				listen_dev(button, "click", /*click_handler_1*/ ctx[6], false, false, false),
    				listen_dev(div, "dragstart", /*dragstart_handler*/ ctx[4], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*linkName*/ 2 && img_alt_value !== (img_alt_value = "Website logo of " + /*linkName*/ ctx[1])) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*linkUrl*/ 4 && img.src !== (img_src_value = "https://www.google.com/s2/favicons?domain=" + /*linkUrl*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*linkName*/ 2) set_data_dev(t1, /*linkName*/ ctx[1]);

    			if (dirty & /*linkUrl*/ 4) {
    				attr_dev(a, "href", /*linkUrl*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { linkId } = $$props;
    	let { linkName } = $$props;
    	let { linkUrl } = $$props;
    	const writable_props = ["linkId", "linkName", "linkUrl"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	function dragstart_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler = () => dispatch("editLink", { linkId, linkName, linkUrl });
    	const click_handler_1 = () => dispatch("delLink", linkId);

    	$$self.$set = $$props => {
    		if ("linkId" in $$props) $$invalidate(0, linkId = $$props.linkId);
    		if ("linkName" in $$props) $$invalidate(1, linkName = $$props.linkName);
    		if ("linkUrl" in $$props) $$invalidate(2, linkUrl = $$props.linkUrl);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		linkOverlayOptions,
    		dispatch,
    		linkId,
    		linkName,
    		linkUrl
    	});

    	$$self.$inject_state = $$props => {
    		if ("linkId" in $$props) $$invalidate(0, linkId = $$props.linkId);
    		if ("linkName" in $$props) $$invalidate(1, linkName = $$props.linkName);
    		if ("linkUrl" in $$props) $$invalidate(2, linkUrl = $$props.linkUrl);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		linkId,
    		linkName,
    		linkUrl,
    		dispatch,
    		dragstart_handler,
    		click_handler,
    		click_handler_1
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { linkId: 0, linkName: 1, linkUrl: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*linkId*/ ctx[0] === undefined && !("linkId" in props)) {
    			console.warn("<Link> was created without expected prop 'linkId'");
    		}

    		if (/*linkName*/ ctx[1] === undefined && !("linkName" in props)) {
    			console.warn("<Link> was created without expected prop 'linkName'");
    		}

    		if (/*linkUrl*/ ctx[2] === undefined && !("linkUrl" in props)) {
    			console.warn("<Link> was created without expected prop 'linkUrl'");
    		}
    	}

    	get linkId() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkId(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkName() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkName(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get linkUrl() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set linkUrl(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Hyperlink {
        constructor(id, name, url) {
            this.id = id;
            this.linkName = name;
            this.linkUrl = url;
        }
    }

    /* src/content/LinkBox.svelte generated by Svelte v3.19.1 */
    const file$5 = "src/content/LinkBox.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].id;
    	child_ctx[25] = list[i].linkName;
    	child_ctx[26] = list[i].linkUrl;
    	child_ctx[28] = i;
    	return child_ctx;
    }

    // (200:4) {:catch error}
    function create_catch_block(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*error*/ ctx[24].message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Something went wrong: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-k4nolm");
    			add_location(p, file$5, 200, 8, 6670);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$localPreset*/ 16 && t1_value !== (t1_value = /*error*/ ctx[24].message + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(200:4) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (191:4) {:then value}
    function create_then_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$localPreset*/ ctx[4].Folders[/*id*/ ctx[1]].links;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$localPreset, id, deleteLink, showOverlay, dragStartLink*/ 338) {
    				each_value = /*$localPreset*/ ctx[4].Folders[/*id*/ ctx[1]].links;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(191:4) {:then value}",
    		ctx
    	});

    	return block;
    }

    // (192:8) {#each $localPreset.Folders[id].links as { id, linkName, linkUrl }
    function create_each_block(ctx) {
    	let current;

    	const link = new Link({
    			props: {
    				linkId: /*id*/ ctx[1],
    				linkName: /*linkName*/ ctx[25],
    				linkUrl: /*linkUrl*/ ctx[26]
    			},
    			$$inline: true
    		});

    	link.$on("delLink", /*deleteLink*/ ctx[8]);
    	link.$on("editLink", /*showOverlay*/ ctx[6]);
    	link.$on("dragstart", /*dragstart_handler*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link_changes = {};
    			if (dirty & /*$localPreset, id*/ 18) link_changes.linkId = /*id*/ ctx[1];
    			if (dirty & /*$localPreset, id*/ 18) link_changes.linkName = /*linkName*/ ctx[25];
    			if (dirty & /*$localPreset, id*/ 18) link_changes.linkUrl = /*linkUrl*/ ctx[26];
    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(192:8) {#each $localPreset.Folders[id].links as { id, linkName, linkUrl }",
    		ctx
    	});

    	return block;
    }

    // (189:25)          <p>Loading links</p>     {:then value}
    function create_pending_block(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Loading links";
    			attr_dev(p, "class", "svelte-k4nolm");
    			add_location(p, file$5, 189, 8, 6262);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(189:25)          <p>Loading links</p>     {:then value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let section;
    	let div0;
    	let p;
    	let t0;
    	let t1;
    	let input;
    	let t2;
    	let button0;
    	let t4;
    	let div1;
    	let promise;
    	let t5;
    	let button1;
    	let span0;
    	let t7;
    	let span1;
    	let section_draggable_value;
    	let current;
    	let dispose;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 23,
    		error: 24,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*$localPreset*/ ctx[4], info);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(/*folderHeader*/ ctx[0]);
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "-";
    			t4 = space();
    			div1 = element("div");
    			info.block.c();
    			t5 = space();
    			button1 = element("button");
    			span0 = element("span");
    			span0.textContent = "New link";
    			t7 = space();
    			span1 = element("span");
    			span1.textContent = "+";
    			attr_dev(p, "class", "svelte-k4nolm");
    			add_location(p, file$5, 166, 8, 5759);
    			attr_dev(div0, "class", "boxHeader svelte-k4nolm");
    			add_location(div0, file$5, 162, 4, 5659);
    			attr_dev(input, "class", "boxHeaderEdit svelte-k4nolm");
    			attr_dev(input, "maxlength", "40");
    			attr_dev(input, "placeholder", /*folderHeader*/ ctx[0]);
    			attr_dev(input, "onfocus", "this.select();");
    			add_location(input, file$5, 172, 4, 5820);
    			attr_dev(button0, "class", "boxDelBtn svelte-k4nolm");
    			add_location(button0, file$5, 181, 4, 6095);
    			attr_dev(div1, "class", "boxContent svelte-k4nolm");
    			add_location(div1, file$5, 186, 4, 6202);
    			attr_dev(span0, "class", "svelte-k4nolm");
    			add_location(span0, file$5, 208, 8, 6822);
    			attr_dev(span1, "class", "svelte-k4nolm");
    			add_location(span1, file$5, 209, 8, 6852);
    			attr_dev(button1, "class", "linkAddBtn svelte-k4nolm");
    			add_location(button1, file$5, 205, 4, 6745);
    			attr_dev(section, "draggable", section_draggable_value = true);
    			attr_dev(section, "ondragover", "return false");
    			attr_dev(section, "id", "linkBox");
    			attr_dev(section, "class", "svelte-k4nolm");
    			add_location(section, file$5, 150, 0, 5244);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			/*div0_binding*/ ctx[15](div0);
    			append_dev(section, t1);
    			append_dev(section, input);
    			/*input_binding*/ ctx[16](input);
    			set_input_value(input, /*folderHeader*/ ctx[0]);
    			append_dev(section, t2);
    			append_dev(section, button0);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			info.block.m(div1, info.anchor = null);
    			info.mount = () => div1;
    			info.anchor = null;
    			append_dev(section, t5);
    			append_dev(section, button1);
    			append_dev(button1, span0);
    			append_dev(button1, t7);
    			append_dev(button1, span1);
    			current = true;

    			dispose = [
    				listen_dev(div0, "dblclick", /*toggleRename*/ ctx[7], false, false, false),
    				listen_dev(input, "blur", /*toggleRename*/ ctx[7], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[17]),
    				listen_dev(input, "keyup", /*keyup_handler*/ ctx[18], false, false, false),
    				listen_dev(button0, "click", /*click_handler*/ ctx[19], false, false, false),
    				listen_dev(button1, "click", /*showOverlay*/ ctx[6], false, false, false),
    				listen_dev(section, "dragstart", /*dragstart_handler_1*/ ctx[21], false, false, false),
    				listen_dev(section, "drop", prevent_default(/*drop_handler*/ ctx[22]), false, true, false)
    			];
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*folderHeader*/ 1) set_data_dev(t0, /*folderHeader*/ ctx[0]);

    			if (!current || dirty & /*folderHeader*/ 1) {
    				attr_dev(input, "placeholder", /*folderHeader*/ ctx[0]);
    			}

    			if (dirty & /*folderHeader*/ 1 && input.value !== /*folderHeader*/ ctx[0]) {
    				set_input_value(input, /*folderHeader*/ ctx[0]);
    			}

    			info.ctx = ctx;

    			if (dirty & /*$localPreset*/ 16 && promise !== (promise = /*$localPreset*/ ctx[4]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[23] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			/*div0_binding*/ ctx[15](null);
    			/*input_binding*/ ctx[16](null);
    			info.block.d();
    			info.token = null;
    			info = null;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragStartFolder(event) {
    	event.stopPropagation();
    	let originIndex = [].slice.call(event.target.parentNode.children).indexOf(event.target);
    	event.dataTransfer.setData("type", "folder");
    	event.dataTransfer.setData("originIndex", originIndex);
    }

    function dragStartLink(event) {
    	event.stopPropagation();
    	let originFolderIndex;
    	let originLinkIndex;

    	if (event.target.nodeName !== "DIV") {
    		originFolderIndex = [].slice.call(event.target.parentNode.parentNode.parentNode.parentNode.children).indexOf(event.target.parentNode.parentNode.parentNode);
    		originLinkIndex = [].slice.call(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
    	} else {
    		originFolderIndex = [].slice.call(event.target.parentNode.parentNode.parentNode.children).indexOf(event.target.parentNode.parentNode);
    		originLinkIndex = [].slice.call(event.target.parentNode.children).indexOf(event.target);
    	}

    	event.dataTransfer.setData("type", "link");
    	event.dataTransfer.setData("originFolderIndex", originFolderIndex);
    	event.dataTransfer.setData("originLinkIndex", originLinkIndex);
    }

    function _updateLinkIds(links) {
    	links.map(link => link.id = links.indexOf(link));
    }

    function _getTargetIndex(event) {
    	let targetIndex;

    	if (event.target.nodeName === "A" || event.target.nodeName === "IMG" || event.target.previousElementSibling && event.target.previousElementSibling.nodeName === "A") {
    		targetIndex = [].slice.call(event.target.parentNode.parentNode.parentNode.parentNode.children).indexOf(event.target.parentNode.parentNode.parentNode);
    	} else {
    		targetIndex = [].slice.call(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);
    	}

    	return targetIndex;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $localPreset;
    	let $linkOverlayOptions;
    	validate_store(localPreset, "localPreset");
    	component_subscribe($$self, localPreset, $$value => $$invalidate(4, $localPreset = $$value));
    	validate_store(linkOverlayOptions, "linkOverlayOptions");
    	component_subscribe($$self, linkOverlayOptions, $$value => $$invalidate(12, $linkOverlayOptions = $$value));
    	let { id } = $$props;
    	let { folderHeader } = $$props;
    	const dispatch = createEventDispatcher();
    	let links = $localPreset.Folders[id].links;
    	let headerText;
    	let headerInput;

    	function showOverlay(event) {
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.showOverlay = !$linkOverlayOptions.showOverlay, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currentFolderId = id, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currentFolder = folderHeader, $linkOverlayOptions);

    		if (event.detail) {
    			set_store_value(linkOverlayOptions, $linkOverlayOptions.currLinkId = event.detail.linkId, $linkOverlayOptions);
    			set_store_value(linkOverlayOptions, $linkOverlayOptions.currLinkName = event.detail.linkName, $linkOverlayOptions);
    			set_store_value(linkOverlayOptions, $linkOverlayOptions.currLinkUrl = event.detail.linkUrl, $linkOverlayOptions);
    		}
    	}

    	function toggleRename() {
    		if (headerText.style.display !== "none") {
    			$$invalidate(2, headerText.style.display = "none", headerText);
    			$$invalidate(3, headerInput.style.display = "flex", headerInput);
    			headerInput.focus();
    		} else {
    			headerInput.blur();
    			$$invalidate(3, headerInput.style.display = "none", headerInput);
    			$$invalidate(2, headerText.style.display = "flex", headerText);
    			changeFolderName();
    		}
    	}

    	function changeFolderName() {
    		let currPreset = $localPreset;
    		currPreset.Folders[id].folderName = folderHeader;
    		set_store_value(localPreset, $localPreset = currPreset);
    	}

    	function deleteLink(event) {
    		let currentPreset = $localPreset;
    		currentPreset.Folders[id].links.splice(event.detail, 1);
    		_updateLinkIds(currentPreset.Folders[id].links);
    		set_store_value(localPreset, $localPreset = currentPreset);
    	}

    	function submitNewName(event) {
    		if (event.keyCode === 13 || event.keyCode === 27) {
    			toggleRename();
    		}
    	}

    	function dropFolder(event) {
    		let originIndex = event.dataTransfer.getData("originIndex");
    		let targetIndex = _getTargetIndex(event);

    		if (originIndex !== targetIndex) {
    			let currPreset = $localPreset;
    			currPreset.Folders.splice(targetIndex, 0, currPreset.Folders.splice(originIndex, 1)[0]);
    			set_store_value(localPreset, $localPreset = currPreset);
    		}
    	}

    	function dropLink(event) {
    		let originFolderIndex = event.dataTransfer.getData("originFolderIndex");
    		let originLinkIndex = event.dataTransfer.getData("originLinkIndex");
    		let targetFolderIndex = _getTargetIndex(event);
    		let currPreset = $localPreset;
    		currPreset.Folders[targetFolderIndex].links.push(currPreset.Folders[originFolderIndex].links.splice(originLinkIndex, 1)[0]);

    		// updates links ids in array to be reactively updated
    		// origin folder
    		let originLinks = currPreset.Folders[originFolderIndex].links;

    		_updateLinkIds(originLinks);

    		// target folder
    		let targetLinks = currPreset.Folders[targetFolderIndex].links;

    		_updateLinkIds(targetLinks);
    		set_store_value(localPreset, $localPreset = currPreset);
    	}

    	const writable_props = ["id", "folderHeader"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LinkBox> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, headerText = $$value);
    		});
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(3, headerInput = $$value);
    		});
    	}

    	function input_input_handler() {
    		folderHeader = this.value;
    		$$invalidate(0, folderHeader);
    	}

    	const keyup_handler = event => submitNewName(event);
    	const click_handler = () => dispatch("delFolder", id);
    	const dragstart_handler = event => dragStartLink(event);
    	const dragstart_handler_1 = event => dragStartFolder(event);

    	const drop_handler = event => {
    		if (event.dataTransfer.getData("type") === "folder") {
    			dropFolder(event);
    		} else if (event.dataTransfer.getData("type") === "link") {
    			dropLink(event);
    		}
    	};

    	$$self.$set = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("folderHeader" in $$props) $$invalidate(0, folderHeader = $$props.folderHeader);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		localPreset,
    		linkOverlayOptions,
    		createEventDispatcher,
    		Hyperlink,
    		id,
    		folderHeader,
    		dispatch,
    		links,
    		headerText,
    		headerInput,
    		showOverlay,
    		toggleRename,
    		changeFolderName,
    		deleteLink,
    		submitNewName,
    		dragStartFolder,
    		dropFolder,
    		dragStartLink,
    		dropLink,
    		_updateLinkIds,
    		_getTargetIndex,
    		$localPreset,
    		$linkOverlayOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    		if ("folderHeader" in $$props) $$invalidate(0, folderHeader = $$props.folderHeader);
    		if ("links" in $$props) links = $$props.links;
    		if ("headerText" in $$props) $$invalidate(2, headerText = $$props.headerText);
    		if ("headerInput" in $$props) $$invalidate(3, headerInput = $$props.headerInput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		folderHeader,
    		id,
    		headerText,
    		headerInput,
    		$localPreset,
    		dispatch,
    		showOverlay,
    		toggleRename,
    		deleteLink,
    		submitNewName,
    		dropFolder,
    		dropLink,
    		$linkOverlayOptions,
    		links,
    		changeFolderName,
    		div0_binding,
    		input_binding,
    		input_input_handler,
    		keyup_handler,
    		click_handler,
    		dragstart_handler,
    		dragstart_handler_1,
    		drop_handler
    	];
    }

    class LinkBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 1, folderHeader: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkBox",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[1] === undefined && !("id" in props)) {
    			console.warn("<LinkBox> was created without expected prop 'id'");
    		}

    		if (/*folderHeader*/ ctx[0] === undefined && !("folderHeader" in props)) {
    			console.warn("<LinkBox> was created without expected prop 'folderHeader'");
    		}
    	}

    	get id() {
    		throw new Error("<LinkBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<LinkBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get folderHeader() {
    		throw new Error("<LinkBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set folderHeader(value) {
    		throw new Error("<LinkBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Folder {
        constructor(id, name) {
            this.id = id;
            this.folderName = name;
            this.links = [];
        }
    }

    /* src/content/NewFolder.svelte generated by Svelte v3.19.1 */

    const file$6 = "src/content/NewFolder.svelte";

    function create_fragment$6(ctx) {
    	let section;
    	let p0;
    	let t1;
    	let p1;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			p0 = element("p");
    			p0.textContent = "New Folder";
    			t1 = space();
    			p1 = element("p");
    			p1.textContent = "+";
    			attr_dev(p0, "class", "svelte-1wptr6k");
    			add_location(p0, file$6, 6, 4, 60);
    			attr_dev(p1, "class", "svelte-1wptr6k");
    			add_location(p1, file$6, 7, 4, 82);
    			attr_dev(section, "id", "newFolder");
    			attr_dev(section, "class", "svelte-1wptr6k");
    			add_location(section, file$6, 5, 0, 22);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, p0);
    			append_dev(section, t1);
    			append_dev(section, p1);
    			dispose = listen_dev(section, "click", /*click_handler*/ ctx[0], false, false, false);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self) {
    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	return [click_handler];
    }

    class NewFolder extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewFolder",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/content/Startup.svelte generated by Svelte v3.19.1 */
    const file$7 = "src/content/Startup.svelte";

    function create_fragment$7(ctx) {
    	let section;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let p0;
    	let t2;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let p1;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			button0 = element("button");
    			img0 = element("img");
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "Create your first folder";
    			t2 = space();
    			button1 = element("button");
    			img1 = element("img");
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Load default preset";
    			attr_dev(img0, "id", "firstFolderImg");
    			attr_dev(img0, "alt", "Click to open an empty folder");
    			if (img0.src !== (img0_src_value = "../images/white_new_folder.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "class", "svelte-114r3c6");
    			add_location(img0, file$7, 76, 4, 1921);
    			attr_dev(p0, "class", "svelte-114r3c6");
    			add_location(p0, file$7, 80, 4, 2048);
    			attr_dev(button0, "id", "firstFolder");
    			attr_dev(button0, "class", "svelte-114r3c6");
    			add_location(button0, file$7, 74, 2, 1855);
    			attr_dev(img1, "id", "loadPresetImg");
    			attr_dev(img1, "alt", "Click to load a default preset of folders and links");
    			if (img1.src !== (img1_src_value = "../images/white_download_folder.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-114r3c6");
    			add_location(img1, file$7, 86, 4, 2172);
    			attr_dev(p1, "class", "svelte-114r3c6");
    			add_location(p1, file$7, 90, 4, 2325);
    			attr_dev(button1, "id", "defaultPreset");
    			attr_dev(button1, "class", "svelte-114r3c6");
    			add_location(button1, file$7, 84, 2, 2100);
    			attr_dev(section, "class", "svelte-114r3c6");
    			add_location(section, file$7, 73, 0, 1842);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button0);
    			append_dev(button0, img0);
    			append_dev(button0, t0);
    			append_dev(button0, p0);
    			append_dev(section, t2);
    			append_dev(section, button1);
    			append_dev(button1, img1);
    			append_dev(button1, t3);
    			append_dev(button1, p1);

    			dispose = [
    				listen_dev(button0, "click", /*click_handler*/ ctx[1], false, false, false),
    				listen_dev(button1, "click", /*click_handler_1*/ ctx[2], false, false, false)
    			];
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	const click_handler = () => dispatch("new");
    	const click_handler_1 = () => dispatch("default");
    	$$self.$capture_state = () => ({ createEventDispatcher, dispatch });
    	return [dispatch, click_handler, click_handler_1];
    }

    class Startup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Startup",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    async function fetchJson(url){
        try{
            let responseObj = await fetch(url, {
                mode: 'cors',
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            });
            return responseObj.json();
        } catch(err) {
            alert(err);
        }
    }

    /* src/content/BoxArea.svelte generated by Svelte v3.19.1 */
    const file$8 = "src/content/BoxArea.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i].folderName;
    	child_ctx[7] = list[i].links;
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (57:0) {:catch error}
    function create_catch_block$1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*error*/ ctx[5].message + "";
    	let t1;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("Something went wrong: ");
    			t1 = text(t1_value);
    			attr_dev(p, "class", "svelte-riwrqd");
    			add_location(p, file$8, 57, 4, 1871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$localPreset*/ 1 && t1_value !== (t1_value = /*error*/ ctx[5].message + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block$1.name,
    		type: "catch",
    		source: "(57:0) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (43:0) {:then value}
    function create_then_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*value*/ ctx[4].Folders.length > 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block$1.name,
    		type: "then",
    		source: "(43:0) {:then value}",
    		ctx
    	});

    	return block;
    }

    // (54:4) {:else}
    function create_else_block(ctx) {
    	let current;
    	const startup = new Startup({ $$inline: true });
    	startup.$on("new", /*createFolder*/ ctx[1]);
    	startup.$on("default", /*loadPreset*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(startup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(startup, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(startup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(startup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(startup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(54:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#if value.Folders.length > 0}
    function create_if_block$1(ctx) {
    	let section;
    	let t;
    	let current;
    	let each_value = /*$localPreset*/ ctx[0].Folders;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const newfolder = new NewFolder({ $$inline: true });
    	newfolder.$on("click", /*createFolder*/ ctx[1]);

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(newfolder.$$.fragment);
    			attr_dev(section, "id", "contentArea");
    			attr_dev(section, "class", "svelte-riwrqd");
    			add_location(section, file$8, 44, 8, 1432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			append_dev(section, t);
    			mount_component(newfolder, section, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$localPreset, deleteFolder*/ 9) {
    				each_value = /*$localPreset*/ ctx[0].Folders;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(section, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(newfolder.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(newfolder.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			destroy_component(newfolder);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(44:4) {#if value.Folders.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (46:12) {#each $localPreset.Folders as { folderName, links }
    function create_each_block$1(ctx) {
    	let current;

    	const linkbox = new LinkBox({
    			props: {
    				id: /*i*/ ctx[9],
    				folderHeader: /*folderName*/ ctx[6]
    			},
    			$$inline: true
    		});

    	linkbox.$on("delFolder", /*deleteFolder*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(linkbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(linkbox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const linkbox_changes = {};
    			if (dirty & /*$localPreset*/ 1) linkbox_changes.folderHeader = /*folderName*/ ctx[6];
    			linkbox.$set(linkbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linkbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linkbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(linkbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(46:12) {#each $localPreset.Folders as { folderName, links }",
    		ctx
    	});

    	return block;
    }

    // (41:21)   <p>Waiting for the promise to resolve...</p> {:then value}
    function create_pending_block$1(ctx) {
    	let p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Waiting for the promise to resolve...";
    			attr_dev(p, "class", "svelte-riwrqd");
    			add_location(p, file$8, 41, 1, 1330);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block$1.name,
    		type: "pending",
    		source: "(41:21)   <p>Waiting for the promise to resolve...</p> {:then value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let await_block_anchor;
    	let promise;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		pending: create_pending_block$1,
    		then: create_then_block$1,
    		catch: create_catch_block$1,
    		value: 4,
    		error: 5,
    		blocks: [,,,]
    	};

    	handle_promise(promise = /*$localPreset*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			info.ctx = ctx;

    			if (dirty & /*$localPreset*/ 1 && promise !== (promise = /*$localPreset*/ ctx[0]) && handle_promise(promise, info)) ; else {
    				const child_ctx = ctx.slice();
    				child_ctx[4] = info.resolved;
    				info.block.p(child_ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $localPreset;
    	validate_store(localPreset, "localPreset");
    	component_subscribe($$self, localPreset, $$value => $$invalidate(0, $localPreset = $$value));

    	function createFolder() {
    		// svelte stores using html5 localstorage with stringified objects cannot be updated directly
    		// we need to create a copy and set the store again, so that the stores set method gets called
    		// that happens because there is no localstorage update function, only get, set, remove and clear
    		let currentPreset = $localPreset;

    		currentPreset.Folders.push(new Folder(currentPreset.Folders.length, `New`));
    		set_store_value(localPreset, $localPreset = currentPreset);
    	}

    	async function loadPreset() {
    		// DEBUG
    		const DEFAUL_PRESET_URL = "./default-preset.json";

    		let defaultPreset = await fetchJson(DEFAUL_PRESET_URL);
    		set_store_value(localPreset, $localPreset = defaultPreset);
    	}

    	function deleteFolder(event) {
    		let currentPreset = $localPreset;
    		currentPreset.Folders.splice(event.detail, 1);
    		set_store_value(localPreset, $localPreset = currentPreset);
    	}

    	$$self.$capture_state = () => ({
    		LinkBox,
    		localPreset,
    		Folder,
    		NewFolder,
    		Startup,
    		fetchJson,
    		createFolder,
    		loadPreset,
    		deleteFolder,
    		$localPreset
    	});

    	return [$localPreset, createFolder, loadPreset, deleteFolder];
    }

    class BoxArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BoxArea",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/content/Footer.svelte generated by Svelte v3.19.1 */

    const file$9 = "src/content/Footer.svelte";

    function create_fragment$9(ctx) {
    	let footer;
    	let span0;
    	let t1;
    	let span1;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			span0 = element("span");
    			span0.textContent = "Created by Tilloh. Made with ♥";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = "Special thanks to Team Assets - Nico, Christian, Jurij, Philipp, Patrick";
    			add_location(span0, file$9, 6, 4, 39);
    			add_location(span1, file$9, 7, 4, 87);
    			attr_dev(footer, "class", "svelte-13ta50t");
    			add_location(footer, file$9, 5, 0, 26);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, span0);
    			append_dev(footer, t1);
    			append_dev(footer, span1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/content/LinkOverlay.svelte generated by Svelte v3.19.1 */
    const file$a = "src/content/LinkOverlay.svelte";

    // (65:8) {:else}
    function create_else_block$1(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Edit ''");
    			t1 = text(/*newLinkName*/ ctx[0]);
    			t2 = text("'' link");
    			attr_dev(h1, "class", "svelte-puvf9w");
    			add_location(h1, file$a, 65, 12, 1864);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*newLinkName*/ 1) set_data_dev(t1, /*newLinkName*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(65:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (63:8) {#if type === "new"}
    function create_if_block$2(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Create a new link";
    			attr_dev(h1, "class", "svelte-puvf9w");
    			add_location(h1, file$a, 63, 12, 1809);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(63:8) {#if type === \\\"new\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let section;
    	let button0;
    	let t1;
    	let div0;
    	let t2;
    	let h2;
    	let t3;
    	let t4_value = /*$linkOverlayOptions*/ ctx[4].currentFolder + "";
    	let t4;
    	let t5;
    	let t6;
    	let div1;
    	let input0;
    	let t7;
    	let input1;
    	let t8;
    	let button1;
    	let t9;
    	let button1_class_value;
    	let button1_disabled_value;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[5] === "new") return create_if_block$2;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			button0 = element("button");
    			button0.textContent = "X";
    			t1 = space();
    			div0 = element("div");
    			if_block.c();
    			t2 = space();
    			h2 = element("h2");
    			t3 = text("Within ''");
    			t4 = text(t4_value);
    			t5 = text("''");
    			t6 = space();
    			div1 = element("div");
    			input0 = element("input");
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			button1 = element("button");
    			t9 = text("Save");
    			attr_dev(button0, "id", "exitOverlay");
    			attr_dev(button0, "class", "svelte-puvf9w");
    			add_location(button0, file$a, 58, 4, 1668);
    			attr_dev(h2, "class", "svelte-puvf9w");
    			add_location(h2, file$a, 67, 8, 1923);
    			attr_dev(div0, "id", "insertHead");
    			attr_dev(div0, "class", "svelte-puvf9w");
    			add_location(div0, file$a, 61, 4, 1746);
    			attr_dev(input0, "maxlength", "40");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Insert link name");
    			attr_dev(input0, "class", "svelte-puvf9w");
    			add_location(input0, file$a, 70, 8, 2028);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "placeholder", "Insert link name");
    			attr_dev(input1, "class", "svelte-puvf9w");
    			add_location(input1, file$a, 81, 8, 2370);
    			attr_dev(div1, "id", "insertContent");
    			attr_dev(div1, "class", "svelte-puvf9w");
    			add_location(div1, file$a, 69, 4, 1994);
    			attr_dev(button1, "id", "submitOverlay");
    			attr_dev(button1, "class", button1_class_value = "" + (null_to_empty(!/*submittable*/ ctx[3] ? "disabled" : "enabled") + " svelte-puvf9w"));
    			button1.disabled = button1_disabled_value = !/*submittable*/ ctx[3];
    			add_location(button1, file$a, 91, 4, 2664);
    			attr_dev(section, "class", "svelte-puvf9w");
    			add_location(section, file$a, 57, 0, 1654);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button0);
    			append_dev(section, t1);
    			append_dev(section, div0);
    			if_block.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, h2);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    			append_dev(h2, t5);
    			append_dev(section, t6);
    			append_dev(section, div1);
    			append_dev(div1, input0);
    			/*input0_binding*/ ctx[11](input0);
    			set_input_value(input0, /*newLinkName*/ ctx[0]);
    			append_dev(div1, t7);
    			append_dev(div1, input1);
    			set_input_value(input1, /*newLinkUrl*/ ctx[1]);
    			append_dev(section, t8);
    			append_dev(section, button1);
    			append_dev(button1, t9);

    			dispose = [
    				listen_dev(window, "keyup", /*keyup_handler*/ ctx[10], false, false, false),
    				listen_dev(button0, "click", /*closeOverlay*/ ctx[6], false, false, false),
    				listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    				listen_dev(input0, "keyup", /*keyup_handler_1*/ ctx[13], false, false, false),
    				listen_dev(input1, "input", /*input1_input_handler*/ ctx[14]),
    				listen_dev(input1, "keyup", /*keyup_handler_2*/ ctx[15], false, false, false),
    				listen_dev(
    					button1,
    					"click",
    					/*type*/ ctx[5] === "new"
    					? /*addLink*/ ctx[7]
    					: /*editLink*/ ctx[8],
    					false,
    					false,
    					false
    				)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if_block.p(ctx, dirty);
    			if (dirty & /*$linkOverlayOptions*/ 16 && t4_value !== (t4_value = /*$linkOverlayOptions*/ ctx[4].currentFolder + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*newLinkName*/ 1 && input0.value !== /*newLinkName*/ ctx[0]) {
    				set_input_value(input0, /*newLinkName*/ ctx[0]);
    			}

    			if (dirty & /*newLinkUrl*/ 2 && input1.value !== /*newLinkUrl*/ ctx[1]) {
    				set_input_value(input1, /*newLinkUrl*/ ctx[1]);
    			}

    			if (dirty & /*submittable*/ 8 && button1_class_value !== (button1_class_value = "" + (null_to_empty(!/*submittable*/ ctx[3] ? "disabled" : "enabled") + " svelte-puvf9w"))) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if (dirty & /*submittable*/ 8 && button1_disabled_value !== (button1_disabled_value = !/*submittable*/ ctx[3])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if_block.d();
    			/*input0_binding*/ ctx[11](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $linkOverlayOptions;
    	let $localPreset;
    	validate_store(linkOverlayOptions, "linkOverlayOptions");
    	component_subscribe($$self, linkOverlayOptions, $$value => $$invalidate(4, $linkOverlayOptions = $$value));
    	validate_store(localPreset, "localPreset");
    	component_subscribe($$self, localPreset, $$value => $$invalidate(9, $localPreset = $$value));
    	let { newLinkName = undefined } = $$props;
    	let { newLinkUrl = undefined } = $$props;
    	let type = $linkOverlayOptions.currLinkName ? "edit" : "new";
    	let nameInput;

    	onMount(() => {
    		nameInput.focus();
    	});

    	function closeOverlay() {
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.showOverlay = false, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currentFolderId = undefined, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currentFolder = undefined, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currLinkId = undefined, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currLinkName = undefined, $linkOverlayOptions);
    		set_store_value(linkOverlayOptions, $linkOverlayOptions.currLinkUrl = undefined, $linkOverlayOptions);
    	}

    	function addLink() {
    		if (submittable) {
    			let currPreset = $localPreset;
    			let currLinks = currPreset.Folders[$linkOverlayOptions.currentFolderId].links;
    			currLinks.push(new Hyperlink(currLinks.length, newLinkName, newLinkUrl));
    			set_store_value(localPreset, $localPreset = currPreset);
    			closeOverlay();
    		}
    	}

    	function editLink() {
    		if (submittable) {
    			let currPreset = $localPreset;
    			let currLink = currPreset.Folders[$linkOverlayOptions.currentFolderId].links[$linkOverlayOptions.currLinkId];
    			currLink.linkName = newLinkName;
    			currLink.linkUrl = newLinkUrl;
    			set_store_value(localPreset, $localPreset = currPreset);
    			closeOverlay();
    		}
    	}

    	const writable_props = ["newLinkName", "newLinkUrl"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LinkOverlay> was created with unknown prop '${key}'`);
    	});

    	const keyup_handler = event => event.keyCode === 27 ? closeOverlay() : "foo";

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(2, nameInput = $$value);
    		});
    	}

    	function input0_input_handler() {
    		newLinkName = this.value;
    		$$invalidate(0, newLinkName);
    	}

    	const keyup_handler_1 = event => {
    		if (event.keyCode === 13) {
    			type === "new" ? addLink() : editLink();
    		}
    	};

    	function input1_input_handler() {
    		newLinkUrl = this.value;
    		$$invalidate(1, newLinkUrl);
    	}

    	const keyup_handler_2 = event => {
    		if (event.keyCode === 13) ;
    	};

    	$$self.$set = $$props => {
    		if ("newLinkName" in $$props) $$invalidate(0, newLinkName = $$props.newLinkName);
    		if ("newLinkUrl" in $$props) $$invalidate(1, newLinkUrl = $$props.newLinkUrl);
    	};

    	$$self.$capture_state = () => ({
    		localPreset,
    		linkOverlayOptions,
    		Hyperlink,
    		onMount,
    		newLinkName,
    		newLinkUrl,
    		type,
    		nameInput,
    		closeOverlay,
    		addLink,
    		editLink,
    		undefined,
    		submittable,
    		$linkOverlayOptions,
    		$localPreset
    	});

    	$$self.$inject_state = $$props => {
    		if ("newLinkName" in $$props) $$invalidate(0, newLinkName = $$props.newLinkName);
    		if ("newLinkUrl" in $$props) $$invalidate(1, newLinkUrl = $$props.newLinkUrl);
    		if ("type" in $$props) $$invalidate(5, type = $$props.type);
    		if ("nameInput" in $$props) $$invalidate(2, nameInput = $$props.nameInput);
    		if ("submittable" in $$props) $$invalidate(3, submittable = $$props.submittable);
    	};

    	let submittable;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*newLinkName, newLinkUrl*/ 3) {
    			 $$invalidate(3, submittable = newLinkName && newLinkUrl);
    		}
    	};

    	return [
    		newLinkName,
    		newLinkUrl,
    		nameInput,
    		submittable,
    		$linkOverlayOptions,
    		type,
    		closeOverlay,
    		addLink,
    		editLink,
    		$localPreset,
    		keyup_handler,
    		input0_binding,
    		input0_input_handler,
    		keyup_handler_1,
    		input1_input_handler,
    		keyup_handler_2
    	];
    }

    class LinkOverlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$a, safe_not_equal, { newLinkName: 0, newLinkUrl: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LinkOverlay",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get newLinkName() {
    		throw new Error("<LinkOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set newLinkName(value) {
    		throw new Error("<LinkOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get newLinkUrl() {
    		throw new Error("<LinkOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set newLinkUrl(value) {
    		throw new Error("<LinkOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.19.1 */
    const file$b = "src/App.svelte";

    // (25:0) {#if $linkOverlayOptions.showOverlay}
    function create_if_block$3(ctx) {
    	let current;

    	const linkoverlay = new LinkOverlay({
    			props: {
    				newLinkName: /*$linkOverlayOptions*/ ctx[1].currLinkName,
    				newLinkUrl: /*$linkOverlayOptions*/ ctx[1].currLinkUrl
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(linkoverlay.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(linkoverlay, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const linkoverlay_changes = {};
    			if (dirty & /*$linkOverlayOptions*/ 2) linkoverlay_changes.newLinkName = /*$linkOverlayOptions*/ ctx[1].currLinkName;
    			if (dirty & /*$linkOverlayOptions*/ 2) linkoverlay_changes.newLinkUrl = /*$linkOverlayOptions*/ ctx[1].currLinkUrl;
    			linkoverlay.$set(linkoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linkoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linkoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(linkoverlay, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(25:0) {#if $linkOverlayOptions.showOverlay}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let main;
    	let t0;
    	let t1;
    	let t2;
    	let main_class_value;
    	let t3;
    	let if_block_anchor;
    	let current;
    	const header = new Header({ $$inline: true });
    	header.$on("menuActive", /*menuActive_handler*/ ctx[3]);

    	const menu = new Menu({
    			props: { isActive: /*menuActive*/ ctx[0] },
    			$$inline: true
    		});

    	const boxarea = new BoxArea({ $$inline: true });
    	const footer = new Footer({ $$inline: true });
    	let if_block = /*$linkOverlayOptions*/ ctx[1].showOverlay && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(menu.$$.fragment);
    			t1 = space();
    			create_component(boxarea.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(main, "class", main_class_value = "" + (null_to_empty(/*menuActive*/ ctx[0] ? "menuActive" : "menuInactive") + " svelte-7adtcv"));
    			add_location(main, file$b, 18, 0, 525);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(menu, main, null);
    			append_dev(main, t1);
    			mount_component(boxarea, main, null);
    			append_dev(main, t2);
    			mount_component(footer, main, null);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menu_changes = {};
    			if (dirty & /*menuActive*/ 1) menu_changes.isActive = /*menuActive*/ ctx[0];
    			menu.$set(menu_changes);

    			if (!current || dirty & /*menuActive*/ 1 && main_class_value !== (main_class_value = "" + (null_to_empty(/*menuActive*/ ctx[0] ? "menuActive" : "menuInactive") + " svelte-7adtcv"))) {
    				attr_dev(main, "class", main_class_value);
    			}

    			if (/*$linkOverlayOptions*/ ctx[1].showOverlay) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			transition_in(boxarea.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			transition_out(boxarea.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(menu);
    			destroy_component(boxarea);
    			destroy_component(footer);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $lightTheme;
    	let $linkOverlayOptions;
    	validate_store(lightTheme, "lightTheme");
    	component_subscribe($$self, lightTheme, $$value => $$invalidate(2, $lightTheme = $$value));
    	validate_store(linkOverlayOptions, "linkOverlayOptions");
    	component_subscribe($$self, linkOverlayOptions, $$value => $$invalidate(1, $linkOverlayOptions = $$value));
    	let menuActive = false;

    	onMount(() => {
    		if ($lightTheme === "true") {
    			window.document.body.classList.toggle("light-theme");
    		}
    	});

    	const menuActive_handler = event => $$invalidate(0, menuActive = event.detail);

    	$$self.$capture_state = () => ({
    		Header,
    		Menu,
    		BoxArea,
    		Footer,
    		linkOverlayOptions,
    		lightTheme,
    		LinkOverlay,
    		onMount,
    		menuActive,
    		$lightTheme,
    		window,
    		$linkOverlayOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("menuActive" in $$props) $$invalidate(0, menuActive = $$props.menuActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [menuActive, $linkOverlayOptions, $lightTheme, menuActive_handler];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map

import { g as getContext, c as create_ssr_component, a as compute_rest_props, b as get_current_component, s as setContext, o as onDestroy, v as validate_component, m as missing_component, d as subscribe, e as escape, n as null_to_empty, f as add_attribute } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { f as forwardEventsBuilder, c as classMap, g as globals, S as SmuiElement, C as CommonIcon } from "../../chunks/Svg.js";
import { MDCIconButtonToggleFoundation } from "@material/icon-button";
import { MDCRippleFoundation, util } from "@material/ripple";
import { events, ponyfill } from "@material/dom";
const github = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='-3%20-3%2030%2030'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12%202C6.47715%202%202%206.47715%202%2012C2%2017.5229%206.47715%2022%2012%2022C17.5229%2022%2022%2017.5229%2022%2012C22%206.47715%2017.5229%202%2012%202ZM0%2012C0%205.3726%205.3726%200%2012%200C18.6274%200%2024%205.3726%2024%2012C24%2018.6274%2018.6274%2024%2012%2024C5.3726%2024%200%2018.6274%200%2012Z'%20fill='rgba(0,0,0,0.7)'%20stroke='none'%20/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.59162%2022.7357C9.49492%2022.6109%209.49492%2021.4986%209.59162%2019.399C8.55572%2019.4347%207.90122%2019.3628%207.62812%2019.1833C7.21852%2018.9139%206.80842%2018.0833%206.44457%2017.4979C6.08072%2016.9125%205.27312%2016.8199%204.94702%2016.6891C4.62091%2016.5582%204.53905%2016.0247%205.84562%2016.4282C7.15222%2016.8316%207.21592%2017.9303%207.62812%2018.1872C8.04032%2018.4441%209.02572%2018.3317%209.47242%2018.1259C9.91907%2017.9201%209.88622%2017.1538%209.96587%2016.8503C10.0666%2016.5669%209.71162%2016.5041%209.70382%2016.5018C9.26777%2016.5018%206.97697%2016.0036%206.34772%2013.7852C5.71852%2011.5669%206.52907%2010.117%206.96147%209.49369C7.24972%209.07814%207.22422%208.19254%206.88497%206.83679C8.11677%206.67939%209.06732%207.06709%209.73672%207.99999C9.73737%208.00534%2010.6143%207.47854%2012.0001%207.47854C13.386%207.47854%2013.8777%207.90764%2014.2571%207.99999C14.6365%208.09234%2014.94%206.36699%2017.2834%206.83679C16.7942%207.79839%2016.3844%208.99999%2016.6972%209.49369C17.0099%209.98739%2018.2372%2011.5573%2017.4833%2013.7852C16.9807%2015.2706%2015.9927%2016.1761%2014.5192%2016.5018C14.3502%2016.5557%2014.2658%2016.6427%2014.2658%2016.7627C14.2658%2016.9427%2014.4942%2016.9624%2014.8233%2017.8058C15.0426%2018.368%2015.0585%2019.9739%2014.8708%2022.6234C14.3953%2022.7445%2014.0254%2022.8257%2013.7611%2022.8673C13.2924%2022.9409%2012.7835%2022.9822%2012.2834%2022.9982C11.7834%2023.0141%2011.6098%2023.0123%2010.9185%2022.948C10.4577%2022.9051%2010.0154%2022.8343%209.59162%2022.7357Z'%20fill='rgba(0,0,0,0.7)'%20stroke='none'%20/%3e%3c/svg%3e";
const logo = "/_app/immutable/assets/stadtwerk-logo.McOCfaJx.svg";
function dispatch(element, eventType, detail, eventInit = { bubbles: true }, duplicateEventForMDC = false) {
  if (typeof Event === "undefined") {
    throw new Error("Event not defined.");
  }
  if (!element) {
    throw new Error("Tried to dipatch event without element.");
  }
  const event = new CustomEvent(eventType, Object.assign(Object.assign({}, eventInit), { detail }));
  element === null || element === void 0 ? void 0 : element.dispatchEvent(event);
  if (duplicateEventForMDC && eventType.startsWith("SMUI")) {
    const duplicateEvent = new CustomEvent(eventType.replace(/^SMUI/g, () => "MDC"), Object.assign(Object.assign({}, eventInit), { detail }));
    element === null || element === void 0 ? void 0 : element.dispatchEvent(duplicateEvent);
    if (duplicateEvent.defaultPrevented) {
      event.preventDefault();
    }
  }
  return event;
}
const { applyPassive } = events;
const { matches } = ponyfill;
function Ripple(node, { ripple = true, surface = false, unbounded = false, disabled = false, color, active, rippleElement, eventTarget, activeTarget, addClass = (className) => node.classList.add(className), removeClass = (className) => node.classList.remove(className), addStyle = (name, value) => node.style.setProperty(name, value), initPromise = Promise.resolve() } = {}) {
  let instance;
  let addLayoutListener = getContext("SMUI:addLayoutListener");
  let removeLayoutListener;
  let oldActive = active;
  let oldEventTarget = eventTarget;
  let oldActiveTarget = activeTarget;
  function handleProps() {
    if (surface) {
      addClass("mdc-ripple-surface");
      if (color === "primary") {
        addClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      } else if (color === "secondary") {
        removeClass("smui-ripple-surface--primary");
        addClass("smui-ripple-surface--secondary");
      } else {
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
    } else {
      removeClass("mdc-ripple-surface");
      removeClass("smui-ripple-surface--primary");
      removeClass("smui-ripple-surface--secondary");
    }
    if (instance && oldActive !== active) {
      oldActive = active;
      if (active) {
        instance.activate();
      } else if (active === false) {
        instance.deactivate();
      }
    }
    if (ripple && !instance) {
      instance = new MDCRippleFoundation({
        addClass,
        browserSupportsCssVars: () => util.supportsCssVariables(window),
        computeBoundingRect: () => (rippleElement || node).getBoundingClientRect(),
        containsEventTarget: (target) => node.contains(target),
        deregisterDocumentInteractionHandler: (evtType, handler) => document.documentElement.removeEventListener(evtType, handler, applyPassive()),
        deregisterInteractionHandler: (evtType, handler) => (eventTarget || node).removeEventListener(evtType, handler, applyPassive()),
        deregisterResizeHandler: (handler) => window.removeEventListener("resize", handler),
        getWindowPageOffset: () => ({
          x: window.pageXOffset,
          y: window.pageYOffset
        }),
        isSurfaceActive: () => active == null ? matches(activeTarget || node, ":active") : active,
        isSurfaceDisabled: () => !!disabled,
        isUnbounded: () => !!unbounded,
        registerDocumentInteractionHandler: (evtType, handler) => document.documentElement.addEventListener(evtType, handler, applyPassive()),
        registerInteractionHandler: (evtType, handler) => (eventTarget || node).addEventListener(evtType, handler, applyPassive()),
        registerResizeHandler: (handler) => window.addEventListener("resize", handler),
        removeClass,
        updateCssVariable: addStyle
      });
      initPromise.then(() => {
        if (instance) {
          instance.init();
          instance.setUnbounded(unbounded);
        }
      });
    } else if (instance && !ripple) {
      initPromise.then(() => {
        if (instance) {
          instance.destroy();
          instance = void 0;
        }
      });
    }
    if (instance && (oldEventTarget !== eventTarget || oldActiveTarget !== activeTarget)) {
      oldEventTarget = eventTarget;
      oldActiveTarget = activeTarget;
      instance.destroy();
      requestAnimationFrame(() => {
        if (instance) {
          instance.init();
          instance.setUnbounded(unbounded);
        }
      });
    }
    if (!ripple && unbounded) {
      addClass("mdc-ripple-upgraded--unbounded");
    }
  }
  handleProps();
  if (addLayoutListener) {
    removeLayoutListener = addLayoutListener(layout);
  }
  function layout() {
    if (instance) {
      instance.layout();
    }
  }
  return {
    update(props) {
      ({
        ripple,
        surface,
        unbounded,
        disabled,
        color,
        active,
        rippleElement,
        eventTarget,
        activeTarget,
        addClass,
        removeClass,
        addStyle,
        initPromise
      } = Object.assign({ ripple: true, surface: false, unbounded: false, disabled: false, color: void 0, active: void 0, rippleElement: void 0, eventTarget: void 0, activeTarget: void 0, addClass: (className) => node.classList.add(className), removeClass: (className) => node.classList.remove(className), addStyle: (name, value) => node.style.setProperty(name, value), initPromise: Promise.resolve() }, props));
      handleProps();
    },
    destroy() {
      if (instance) {
        instance.destroy();
        instance = void 0;
        removeClass("mdc-ripple-surface");
        removeClass("smui-ripple-surface--primary");
        removeClass("smui-ripple-surface--secondary");
      }
      if (removeLayoutListener) {
        removeLayoutListener();
      }
    }
  };
}
const { Object: Object_1 } = globals;
const IconButton = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let actionProp;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "ripple",
    "color",
    "toggle",
    "pressed",
    "ariaLabelOn",
    "ariaLabelOff",
    "touch",
    "displayFlex",
    "size",
    "href",
    "action",
    "component",
    "tag",
    "getElement"
  ]);
  const forwardEvents = forwardEventsBuilder(get_current_component());
  let uninitializedValue = () => {
  };
  function isUninitializedValue(value) {
    return value === uninitializedValue;
  }
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { ripple = true } = $$props;
  let { color = void 0 } = $$props;
  let { toggle = false } = $$props;
  let { pressed = uninitializedValue } = $$props;
  let { ariaLabelOn = void 0 } = $$props;
  let { ariaLabelOff = void 0 } = $$props;
  let { touch = false } = $$props;
  let { displayFlex = true } = $$props;
  let { size = "normal" } = $$props;
  let { href = void 0 } = $$props;
  let { action = void 0 } = $$props;
  let element;
  let instance;
  let internalClasses = {};
  let internalStyles = {};
  let internalAttrs = {};
  let context = getContext("SMUI:icon-button:context");
  let ariaDescribedby = getContext("SMUI:icon-button:aria-describedby");
  let { component = SmuiElement } = $$props;
  let { tag = component === SmuiElement ? href == null ? "button" : "a" : void 0 } = $$props;
  let previousDisabled = $$restProps.disabled;
  setContext("SMUI:icon:context", "icon-button");
  let oldToggle = null;
  onDestroy(() => {
    instance && instance.destroy();
  });
  function hasClass(className2) {
    return className2 in internalClasses ? internalClasses[className2] : getElement().classList.contains(className2);
  }
  function addClass(className2) {
    if (!internalClasses[className2]) {
      internalClasses[className2] = true;
    }
  }
  function removeClass(className2) {
    if (!(className2 in internalClasses) || internalClasses[className2]) {
      internalClasses[className2] = false;
    }
  }
  function addStyle(name, value) {
    if (internalStyles[name] != value) {
      if (value === "" || value == null) {
        delete internalStyles[name];
        internalStyles = internalStyles;
      } else {
        internalStyles[name] = value;
      }
    }
  }
  function getAttr(name) {
    var _a;
    return name in internalAttrs ? (_a = internalAttrs[name]) !== null && _a !== void 0 ? _a : null : getElement().getAttribute(name);
  }
  function addAttr(name, value) {
    if (internalAttrs[name] !== value) {
      internalAttrs[name] = value;
    }
  }
  function handleChange(evtData) {
    pressed = evtData.isOn;
  }
  function getElement() {
    return element.getElement();
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.ripple === void 0 && $$bindings.ripple && ripple !== void 0)
    $$bindings.ripple(ripple);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  if ($$props.toggle === void 0 && $$bindings.toggle && toggle !== void 0)
    $$bindings.toggle(toggle);
  if ($$props.pressed === void 0 && $$bindings.pressed && pressed !== void 0)
    $$bindings.pressed(pressed);
  if ($$props.ariaLabelOn === void 0 && $$bindings.ariaLabelOn && ariaLabelOn !== void 0)
    $$bindings.ariaLabelOn(ariaLabelOn);
  if ($$props.ariaLabelOff === void 0 && $$bindings.ariaLabelOff && ariaLabelOff !== void 0)
    $$bindings.ariaLabelOff(ariaLabelOff);
  if ($$props.touch === void 0 && $$bindings.touch && touch !== void 0)
    $$bindings.touch(touch);
  if ($$props.displayFlex === void 0 && $$bindings.displayFlex && displayFlex !== void 0)
    $$bindings.displayFlex(displayFlex);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.action === void 0 && $$bindings.action && action !== void 0)
    $$bindings.action(action);
  if ($$props.component === void 0 && $$bindings.component && component !== void 0)
    $$bindings.component(component);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    actionProp = (() => {
      if (context === "data-table:pagination") {
        switch (action) {
          case "first-page":
            return { "data-first-page": "true" };
          case "prev-page":
            return { "data-prev-page": "true" };
          case "next-page":
            return { "data-next-page": "true" };
          case "last-page":
            return { "data-last-page": "true" };
          default:
            return { "data-action": "true" };
        }
      } else if (context === "dialog:header" || context === "dialog:sheet") {
        return { "data-mdc-dialog-action": action };
      } else {
        return { action };
      }
    })();
    {
      if (previousDisabled !== $$restProps.disabled) {
        const elem = getElement();
        if ("blur" in elem) {
          elem.blur();
        }
        previousDisabled = $$restProps.disabled;
      }
    }
    {
      if (element && getElement() && toggle !== oldToggle) {
        if (toggle && !instance) {
          instance = new MDCIconButtonToggleFoundation({
            addClass,
            hasClass,
            notifyChange: (evtData) => {
              handleChange(evtData);
              dispatch(getElement(), "SMUIIconButtonToggle:change", evtData, void 0, true);
            },
            removeClass,
            getAttr,
            setAttr: addAttr
          });
          instance.init();
        } else if (!toggle && instance) {
          instance.destroy();
          instance = void 0;
          internalClasses = {};
          internalAttrs = {};
        }
        oldToggle = toggle;
      }
    }
    {
      if (instance && !isUninitializedValue(pressed) && instance.isOn() !== pressed) {
        instance.toggle(pressed);
      }
    }
    $$rendered = `${validate_component(component || missing_component, "svelte:component").$$render(
      $$result,
      Object_1.assign(
        {},
        { tag },
        {
          use: [
            [
              Ripple,
              {
                ripple,
                unbounded: true,
                color,
                disabled: !!$$restProps.disabled,
                addClass,
                removeClass,
                addStyle
              }
            ],
            forwardEvents,
            ...use
          ]
        },
        {
          class: classMap({
            [className]: true,
            "mdc-icon-button": true,
            "mdc-icon-button--on": !isUninitializedValue(pressed) && pressed,
            "mdc-icon-button--touch": touch,
            "mdc-icon-button--display-flex": displayFlex,
            "smui-icon-button--size-button": size === "button",
            "smui-icon-button--size-mini": size === "mini",
            "mdc-icon-button--reduced-size": size === "mini" || size === "button",
            "mdc-card__action": context === "card:action",
            "mdc-card__action--icon": context === "card:action",
            "mdc-top-app-bar__navigation-icon": context === "top-app-bar:navigation",
            "mdc-top-app-bar__action-item": context === "top-app-bar:action",
            "mdc-snackbar__dismiss": context === "snackbar:actions",
            "mdc-data-table__pagination-button": context === "data-table:pagination",
            "mdc-data-table__sort-icon-button": context === "data-table:sortable-header-cell",
            "mdc-dialog__close": (context === "dialog:header" || context === "dialog:sheet") && action === "close",
            ...internalClasses
          })
        },
        {
          style: Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" ")
        },
        {
          "aria-pressed": !isUninitializedValue(pressed) ? pressed ? "true" : "false" : null
        },
        {
          "aria-label": pressed ? ariaLabelOn : ariaLabelOff
        },
        { "data-aria-label-on": ariaLabelOn },
        { "data-aria-label-off": ariaLabelOff },
        { "aria-describedby": ariaDescribedby },
        { href },
        actionProp,
        internalAttrs,
        $$restProps,
        { this: element }
      ),
      {
        this: ($$value) => {
          element = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<div class="mdc-icon-button__ripple"></div> ${slots.default ? slots.default({}) : ``}${touch ? `<div class="mdc-icon-button__touch"></div>` : ``}`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const css$1 = {
  code: ".header-box.svelte-1d2j6uz.svelte-1d2j6uz{display:flex;justify-content:space-between}.hide.svelte-1d2j6uz.svelte-1d2j6uz{display:none}.corner.svelte-1d2j6uz.svelte-1d2j6uz{width:3em;height:3em;margin:0.25em 0.5em}.corner.svelte-1d2j6uz img.svelte-1d2j6uz{width:2em;height:2em;object-fit:contain}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$result.css.add(css$1);
  $$unsubscribe_page();
  return `<section><div class="header-box svelte-1d2j6uz"><div class="${escape(null_to_empty($page.url.pathname !== "/" ? "hide" : "corner"), true) + " svelte-1d2j6uz"}">${validate_component(IconButton, "IconButton").$$render(
    $$result,
    {
      href: "https://github.com/timlohse1104",
      target: "_blank"
    },
    {},
    {
      default: () => {
        return `<img${add_attribute("src", github, 0)} alt="GitHub" class="svelte-1d2j6uz">`;
      }
    }
  )}</div> <div class="${escape(null_to_empty($page.url.pathname === "/" ? "hide" : "corner"), true) + " svelte-1d2j6uz"}">${validate_component(IconButton, "IconButton").$$render(
    $$result,
    {
      style: "color: var(--mdc-theme-on-surface, #fff);",
      href: "/"
    },
    {},
    {
      default: () => {
        return `${validate_component(CommonIcon, "Icon").$$render($$result, { class: "material-icons" }, {}, {
          default: () => {
            return `home`;
          }
        })}`;
      }
    }
  )}</div> <div class="${escape(null_to_empty($page.url.pathname !== "/" ? "hide" : "corner"), true) + " svelte-1d2j6uz"}">${validate_component(IconButton, "IconButton").$$render(
    $$result,
    {
      href: "https://stadtwerk.org",
      target: "_blank"
    },
    {},
    {
      default: () => {
        return `<img${add_attribute("src", logo, 0)} alt="stadtwerk" class="svelte-1d2j6uz">`;
      }
    }
  )}</div></div> </section>`;
});
const css = {
  code: ".app.svelte-16qz2ul{display:flex;flex-direction:column;min-height:100vh}main.svelte-16qz2ul{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;max-width:64rem;margin:0 auto;box-sizing:border-box}footer.svelte-16qz2ul{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px}@media(min-width: 480px){footer.svelte-16qz2ul{padding:12px 0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-16qz2ul">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-16qz2ul">${slots.default ? slots.default({}) : ``}</main> <footer class="svelte-16qz2ul" data-svelte-h="svelte-17kouov"><p>made by Tilloh with 💙</p></footer> </div>`;
});
export {
  Layout as default
};

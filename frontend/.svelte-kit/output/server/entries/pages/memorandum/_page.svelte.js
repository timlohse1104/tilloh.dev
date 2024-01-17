import { c as create_ssr_component, d as compute_rest_props, g as get_current_component, j as getContext, a as subscribe, o as onDestroy, f as spread, h as escape_attribute_value, i as escape_object, b as add_attribute, s as setContext, k as set_store_value, l as createEventDispatcher, e as escape, p as is_promise, q as noop, r as each, v as validate_component, n as null_to_empty } from "../../../chunks/ssr.js";
import { f as forwardEventsBuilder, c as classMap, C as CommonIcon } from "../../../chunks/Svg.js";
import { I as IconButton } from "../../../chunks/IconButton.js";
import { w as writable } from "../../../chunks/index.js";
import { c as classAdderBuilder } from "../../../chunks/classAdderBuilder.js";
function exclude(obj, keys) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const cashIndex = name.indexOf("$");
    if (cashIndex !== -1 && keys.indexOf(name.substring(0, cashIndex + 1)) !== -1) {
      continue;
    }
    if (keys.indexOf(name) !== -1) {
      continue;
    }
    newObj[name] = obj[name];
  }
  return newObj;
}
function prefixFilter(obj, prefix) {
  let names = Object.getOwnPropertyNames(obj);
  const newObj = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    if (name.substring(0, prefix.length) === prefix) {
      newObj[name.substring(prefix.length)] = obj[name];
    }
  }
  return newObj;
}
let counter = 0;
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let roleProps;
  let $$restProps = compute_rest_props($$props, [
    "use",
    "class",
    "style",
    "id",
    "unbounded",
    "xPos",
    "yPos",
    "persistent",
    "interactive",
    "hideFromScreenreader",
    "showDelay",
    "hideDelay",
    "surface$class",
    "surface$style",
    "attachScrollHandler",
    "removeScrollHandler",
    "getElement"
  ]);
  let $$unsubscribe_anchor;
  let $$unsubscribe_tooltip;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { style = "" } = $$props;
  let { id = "SMUI-tooltip-" + counter++ } = $$props;
  let { unbounded = false } = $$props;
  let { xPos = "detected" } = $$props;
  let { yPos = "detected" } = $$props;
  let { persistent = false } = $$props;
  let { interactive = persistent } = $$props;
  let { hideFromScreenreader = false } = $$props;
  let { showDelay = void 0 } = $$props;
  let { hideDelay = void 0 } = $$props;
  let { surface$class = "" } = $$props;
  let { surface$style = "" } = $$props;
  let element;
  let nonReactiveLocationStore = {
    setParent(value) {
      Object.defineProperty(this, "parent", { value });
    },
    setNextSibling(value) {
      Object.defineProperty(this, "nextSibling", { value });
    }
  };
  let internalClasses = {};
  let internalStyles = {};
  let internalAttrs = {};
  let surfaceAnimationStyles = {};
  let anchor = getContext("SMUI:tooltip:wrapper:anchor");
  $$unsubscribe_anchor = subscribe(anchor, (value) => value);
  let tooltip = getContext("SMUI:tooltip:wrapper:tooltip");
  $$unsubscribe_tooltip = subscribe(tooltip, (value) => value);
  const rich = getContext("SMUI:tooltip:rich");
  onDestroy(() => {
    var _a;
    if (!rich && typeof document !== "undefined" && document.body === getElement().parentElement && nonReactiveLocationStore.parent !== getElement().parentElement && ((_a = nonReactiveLocationStore.parent) === null || _a === void 0 ? void 0 : _a.insertBefore) && nonReactiveLocationStore.nextSibling) {
      nonReactiveLocationStore.parent.insertBefore(getElement(), nonReactiveLocationStore.nextSibling);
    }
  });
  function attachScrollHandler(addEventListenerFn) {
  }
  function removeScrollHandler(removeEventHandlerFn) {
  }
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.unbounded === void 0 && $$bindings.unbounded && unbounded !== void 0)
    $$bindings.unbounded(unbounded);
  if ($$props.xPos === void 0 && $$bindings.xPos && xPos !== void 0)
    $$bindings.xPos(xPos);
  if ($$props.yPos === void 0 && $$bindings.yPos && yPos !== void 0)
    $$bindings.yPos(yPos);
  if ($$props.persistent === void 0 && $$bindings.persistent && persistent !== void 0)
    $$bindings.persistent(persistent);
  if ($$props.interactive === void 0 && $$bindings.interactive && interactive !== void 0)
    $$bindings.interactive(interactive);
  if ($$props.hideFromScreenreader === void 0 && $$bindings.hideFromScreenreader && hideFromScreenreader !== void 0)
    $$bindings.hideFromScreenreader(hideFromScreenreader);
  if ($$props.showDelay === void 0 && $$bindings.showDelay && showDelay !== void 0)
    $$bindings.showDelay(showDelay);
  if ($$props.hideDelay === void 0 && $$bindings.hideDelay && hideDelay !== void 0)
    $$bindings.hideDelay(hideDelay);
  if ($$props.surface$class === void 0 && $$bindings.surface$class && surface$class !== void 0)
    $$bindings.surface$class(surface$class);
  if ($$props.surface$style === void 0 && $$bindings.surface$style && surface$style !== void 0)
    $$bindings.surface$style(surface$style);
  if ($$props.attachScrollHandler === void 0 && $$bindings.attachScrollHandler && attachScrollHandler !== void 0)
    $$bindings.attachScrollHandler(attachScrollHandler);
  if ($$props.removeScrollHandler === void 0 && $$bindings.removeScrollHandler && removeScrollHandler !== void 0)
    $$bindings.removeScrollHandler(removeScrollHandler);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  roleProps = {
    role: rich && interactive ? "dialog" : "tooltip",
    tabindex: rich && persistent ? -1 : void 0
  };
  $$unsubscribe_anchor();
  $$unsubscribe_tooltip();
  return `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-tooltip": true,
          "mdc-tooltip--rich": rich,
          ...internalClasses
        }))
      },
      {
        style: escape_attribute_value(Object.entries(internalStyles).map(([name, value]) => `${name}: ${value};`).concat([style]).join(" "))
      },
      { "aria-hidden": "true" },
      { id: escape_attribute_value(id) },
      {
        "data-mdc-tooltip-persist": escape_attribute_value(rich && persistent ? "true" : void 0)
      },
      {
        "data-mdc-tooltip-persistent": escape_attribute_value(
          /* MDC uses this attr, but document the one above */
          rich && persistent ? "true" : void 0
        )
      },
      {
        "data-mdc-tooltip-has-caret": escape_attribute_value(void 0)
      },
      {
        "data-hide-tooltip-from-screenreader": escape_attribute_value(hideFromScreenreader ? "true" : void 0)
      },
      escape_object(roleProps),
      escape_object(internalAttrs),
      escape_object(exclude($$restProps, ["surface$"]))
    ],
    {}
  )}${add_attribute("this", element, 0)}><div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [surface$class]: true,
          "mdc-tooltip__surface": true,
          "mdc-tooltip__surface-animation": true
        }))
      },
      {
        style: escape_attribute_value(Object.entries(surfaceAnimationStyles).map(([name, value]) => `${name}: ${value};`).concat([surface$style]).join(" "))
      },
      escape_object(prefixFilter($$restProps, "surface$"))
    ],
    {}
  )}>${slots.default ? slots.default({}) : ``}</div> </div>`;
});
const Wrapper = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["use", "class", "rich", "getElement"]);
  let $tooltip, $$unsubscribe_tooltip;
  let $anchor, $$unsubscribe_anchor;
  forwardEventsBuilder(get_current_component());
  let { use = [] } = $$props;
  let { class: className = "" } = $$props;
  let { rich = false } = $$props;
  let element;
  const anchor = writable(void 0);
  $$unsubscribe_anchor = subscribe(anchor, (value) => $anchor = value);
  const tooltip = writable(void 0);
  $$unsubscribe_tooltip = subscribe(tooltip, (value) => $tooltip = value);
  setContext("SMUI:tooltip:wrapper:anchor", anchor);
  setContext("SMUI:tooltip:wrapper:tooltip", tooltip);
  setContext("SMUI:tooltip:rich", rich);
  function getElement() {
    return element;
  }
  if ($$props.use === void 0 && $$bindings.use && use !== void 0)
    $$bindings.use(use);
  if ($$props.class === void 0 && $$bindings.class && className !== void 0)
    $$bindings.class(className);
  if ($$props.rich === void 0 && $$bindings.rich && rich !== void 0)
    $$bindings.rich(rich);
  if ($$props.getElement === void 0 && $$bindings.getElement && getElement !== void 0)
    $$bindings.getElement(getElement);
  {
    if ($tooltip && !$anchor) {
      set_store_value(anchor, $anchor = $tooltip.previousElementSibling, $anchor);
    }
  }
  $$unsubscribe_tooltip();
  $$unsubscribe_anchor();
  return `${rich ? `<div${spread(
    [
      {
        class: escape_attribute_value(classMap({
          [className]: true,
          "mdc-tooltip-wrapper--rich": true
        }))
      },
      escape_object($$restProps)
    ],
    {}
  )}${add_attribute("this", element, 0)}>${slots.default ? slots.default({}) : ``}</div>` : `${slots.default ? slots.default({}) : ``}`}`;
});
classAdderBuilder({
  class: "mdc-tooltip__title",
  tag: "h2"
});
classAdderBuilder({
  class: "mdc-tooltip__content",
  tag: "div"
});
classAdderBuilder({
  class: "mdc-tooltip__content-link",
  tag: "a"
});
classAdderBuilder({
  class: "mdc-tooltip--rich-actions",
  tag: "div",
  contexts: {
    "SMUI:button:context": "tooltip:rich-actions"
  }
});
let linkPresetDefault = '{"Folders": []}';
const localPreset = writable(JSON.parse(linkPresetDefault));
const linkOverlayOptions = writable({
  showOverlay: false,
  currentFolderId: void 0,
  currentFolder: void 0,
  currLinkId: void 0,
  currLinkName: void 0,
  currLinkUrl: void 0
});
const css$6 = {
  code: 'div.svelte-1oip9lg.svelte-1oip9lg{display:grid;grid-template-columns:20px calc(100% - 70px) 50px;height:auto;grid-template-areas:"icon link delBtn";padding-left:20px;box-sizing:border-box;align-items:center;background-color:rgba(150, 150, 150, 0.8);border-bottom:1px solid rgba(34, 34, 34, 0.8)}div.svelte-1oip9lg.svelte-1oip9lg:hover{background-color:rgba(250, 250, 250, 0.8)}#link.svelte-1oip9lg.svelte-1oip9lg{border-bottom:1px solid rgba(255, 255, 255, 0.3)}#link.svelte-1oip9lg button.svelte-1oip9lg{border-left:1px solid rgba(255, 255, 255, 0.3)}img.svelte-1oip9lg.svelte-1oip9lg{grid-area:icon;margin:0;padding:0;width:25px;height:25px;padding:5px 0 5px 0}a.svelte-1oip9lg.svelte-1oip9lg{grid-area:link;display:block;padding-left:20px;color:rgba(250, 250, 250, 0.8);text-shadow:2px 2px rgba(0, 0, 0, 0.8);font-size:14px}button.svelte-1oip9lg.svelte-1oip9lg{grid-area:delBtn;margin:0;padding:0;width:100%;height:100%;border:none;color:rgba(250, 250, 250, 0.8);background-color:rgba(0, 0, 0, 0);border-left:1px solid rgba(34, 34, 34, 0.8);text-shadow:2px 2px rgba(0, 0, 0, 0.8)}button.svelte-1oip9lg.svelte-1oip9lg:hover{background-color:rgba(250, 250, 250, 0.8);color:rgb(210, 0, 30);text-shadow:none}',
  map: null
};
const Link = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let { linkId } = $$props;
  let { linkName } = $$props;
  let { linkUrl } = $$props;
  if ($$props.linkId === void 0 && $$bindings.linkId && linkId !== void 0)
    $$bindings.linkId(linkId);
  if ($$props.linkName === void 0 && $$bindings.linkName && linkName !== void 0)
    $$bindings.linkName(linkName);
  if ($$props.linkUrl === void 0 && $$bindings.linkUrl && linkUrl !== void 0)
    $$bindings.linkUrl(linkUrl);
  $$result.css.add(css$6);
  return `<div id="link"${add_attribute("draggable", true, 0)} role="presentation" class="svelte-1oip9lg"><img alt="${"Website logo of " + escape(linkName, true)}" src="${"https://www.google.com/s2/favicons?domain=" + escape(linkUrl, true)}" class="svelte-1oip9lg"> <a${add_attribute("href", linkUrl, 0)} class="svelte-1oip9lg">${escape(linkName)}</a> <button class="svelte-1oip9lg" data-svelte-h="svelte-1c8h5bc">-</button> </div>`;
});
const css$5 = {
  code: 'section.svelte-d4v1t6{display:grid;height:calc(100% - 40px);margin:20px;grid-template-columns:calc(100% - 50px) 50px;grid-template-rows:50px calc(90% - 50px) 10%;grid-template-areas:"header delBtn" "content content" "addLinkBtn addLinkBtn";border:solid 3px rgba(34, 34, 34, 0.8)}section.svelte-d4v1t6:hover{box-shadow:0 0 20px rgba(255, 255, 255, 0.3)}.boxHeader.svelte-d4v1t6{grid-area:header;display:flex;align-items:center;font-weight:bolder;padding-left:20px;background-color:rgba(34, 34, 34, 0.8);text-shadow:2px 2px rgba(0, 0, 0, 0.8);font-size:18px}.boxHeaderEdit.svelte-d4v1t6{display:none;grid-area:header;align-items:center;padding-left:20px;font-size:18px;height:100%}.boxDelBtn.svelte-d4v1t6{grid-area:delBtn;margin:0;padding:0;width:100%;height:100%;border:none;color:rgba(250, 250, 250, 0.8);text-align:center;font-weight:bolder;background-color:rgba(34, 34, 34, 0.8);border-left:1px solid rgba(255, 255, 255, 0.3);text-shadow:2px 2px rgba(0, 0, 0, 0.8)}.boxDelBtn.svelte-d4v1t6:hover{background-color:rgb(210, 0, 30)}.boxContent.svelte-d4v1t6{grid-area:content;box-sizing:border-box;overflow:auto;background-color:rgba(0, 0, 0, 0.3)}.svelte-d4v1t6::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.3);border-radius:10px;background-color:rgba(34, 34, 34, 0.8)}.svelte-d4v1t6::-webkit-scrollbar{width:0px;background-color:rgba(34, 34, 34, 0.8)}.svelte-d4v1t6::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.3);background-color:rgba(210, 0, 30, 0.7)}.svelte-d4v1t6::-webkit-scrollbar-thumb:hover{background-color:rgb(210, 0, 30)}.linkAddBtn.svelte-d4v1t6{grid-area:addLinkBtn;margin:0;padding:0;width:100%;height:100%;border:none;color:rgba(250, 250, 250, 0.8);text-align:left;padding-left:20px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background-color:rgba(34, 34, 34, 0.8);text-shadow:2px 2px rgba(0, 0, 0, 0.8)}.linkAddBtn.svelte-d4v1t6:hover{background-color:rgb(0, 210, 53)}',
  map: null
};
const LinkBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $localPreset, $$unsubscribe_localPreset;
  let $$unsubscribe_linkOverlayOptions;
  $$unsubscribe_localPreset = subscribe(localPreset, (value) => $localPreset = value);
  $$unsubscribe_linkOverlayOptions = subscribe(linkOverlayOptions, (value) => value);
  let { id } = $$props;
  let { folderHeader } = $$props;
  createEventDispatcher();
  $localPreset.Folders[id].links;
  let headerText;
  let headerInput;
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.folderHeader === void 0 && $$bindings.folderHeader && folderHeader !== void 0)
    $$bindings.folderHeader(folderHeader);
  $$result.css.add(css$5);
  $$unsubscribe_localPreset();
  $$unsubscribe_linkOverlayOptions();
  return `<section${add_attribute("draggable", true, 0)} ondragover="return false" id="linkBox" role="presentation" class="svelte-d4v1t6"><div class="boxHeader svelte-d4v1t6" role="presentation"${add_attribute("this", headerText, 0)}><p class="svelte-d4v1t6">${escape(folderHeader)}</p></div> <input class="boxHeaderEdit svelte-d4v1t6" maxlength="40"${add_attribute("placeholder", folderHeader, 0)} onfocus="this.select();"${add_attribute("this", headerInput, 0)}${add_attribute("value", folderHeader, 0)}> <button class="boxDelBtn svelte-d4v1t6" data-svelte-h="svelte-1qqqk09">-</button> <div class="boxContent svelte-d4v1t6">${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ` <p class="svelte-d4v1t6" data-svelte-h="svelte-1yg98a1">Loading links</p> `;
    }
    return function(value) {
      return ` ${each($localPreset.Folders[id].links, ({ id: id2, linkName, linkUrl }, i) => {
        return `${validate_component(Link, "Link").$$render($$result, { linkId: id2, linkName, linkUrl }, {}, {})}`;
      })} `;
    }();
  }($localPreset)}</div> <button class="linkAddBtn svelte-d4v1t6" data-svelte-h="svelte-tdim4f"><span class="svelte-d4v1t6">Neuer Link</span> <span class="svelte-d4v1t6">+</span></button> </section>`;
});
const css$4 = {
  code: "section.svelte-1w63i0.svelte-1w63i0{display:flex;height:calc(100% - 40px);margin:20px;border:solid 3px rgba(34, 34, 34, 0.8);flex-direction:column;align-items:center;justify-content:center;background-color:rgba(0, 0, 0, 0.3)}section.svelte-1w63i0.svelte-1w63i0:hover{box-shadow:0 0 20px rgba(255, 255, 255, 0.3)}section.svelte-1w63i0 p.svelte-1w63i0{color:white;text-shadow:0 0 5px rgba(255, 255, 255, 0.3);font-size:50px;margin:0;padding:0}button.svelte-1w63i0.svelte-1w63i0{background:none;color:inherit;border:none;padding:0;font:inherit;cursor:pointer;outline:inherit}",
  map: null
};
const NewFolder = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$4);
  return `<button class="svelte-1w63i0" data-svelte-h="svelte-3xlecq"><section class="svelte-1w63i0"><p class="svelte-1w63i0">Neuer Ordner</p> <p class="svelte-1w63i0">+</p></section> </button>`;
});
const css$3 = {
  code: "section.svelte-85j9v.svelte-85j9v{display:flex}@media only screen and (max-width : 767px){section.svelte-85j9v.svelte-85j9v{flex-direction:column}}button.svelte-85j9v.svelte-85j9v{display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;margin:0;flex-grow:2;padding:20px;border:none;background-color:rgba(0, 0, 0, 0);color:white;font-size:30px;display:inline-block;transition:all 0.3s ease 0s}button.svelte-85j9v.svelte-85j9v:hover{background-color:rgba(34, 34, 34, 0.8)}button.svelte-85j9v img.svelte-85j9v{width:350px}@media only screen and (max-width : 1152px){button.svelte-85j9v p.svelte-85j9v{font-size:22px}button.svelte-85j9v img.svelte-85j9v{width:200px}}@media only screen and (max-width : 767px){button.svelte-85j9v img.svelte-85j9v{width:100px}}",
  map: null
};
const Startup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  $$result.css.add(css$3);
  return `<section class="svelte-85j9v"><button class="svelte-85j9v" data-svelte-h="svelte-k760y"><img id="firstFolderImg" alt="Klicke um einen leeren Ordner zu erstellen" src="/images/memorandum/white_new_folder.png" class="svelte-85j9v"> <p class="svelte-85j9v">Erstelle einen leeren Ordner</p></button> <button class="svelte-85j9v" data-svelte-h="svelte-usisbk"><img id="loadPresetImg" alt="Klicke um einen Ordner mit vorgefertigten Links zu erstellen" src="/images/memorandum/white_download_folder.png" class="svelte-85j9v"> <p class="svelte-85j9v">Lade ein Beispiel</p></button> </section>`;
});
const css$2 = {
  code: "section.svelte-1dkis9n{color:white;margin:0;padding:10px;overflow-y:auto;overflow-x:hidden;display:grid;grid-template-columns:repeat(3, 1fr);grid-auto-rows:50%}@media only screen and (min-width : 2200px){section.svelte-1dkis9n{grid-template-columns:repeat(4, 1fr)}}@media only screen and (max-width : 1152px){section.svelte-1dkis9n{grid-template-columns:repeat(2, 1fr)}}@media only screen and (max-width : 767px){section.svelte-1dkis9n{grid-template-columns:1fr}}.svelte-1dkis9n::-webkit-scrollbar{width:12px;background-color:rgba(34, 34, 34, 0.8)}.svelte-1dkis9n::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.3);border-radius:10px;background-color:rgba(34, 34, 34, 0.8)}.svelte-1dkis9n::-webkit-scrollbar-thumb{border-radius:10px;-webkit-box-shadow:inset 0 0 6px rgba(0, 0, 0, 0.3);background-color:rgba(210, 0, 30, 0.7)}.svelte-1dkis9n::-webkit-scrollbar-thumb:hover{background-color:rgb(210, 0, 30)}",
  map: null
};
const BoxArea = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $localPreset, $$unsubscribe_localPreset;
  $$unsubscribe_localPreset = subscribe(localPreset, (value) => $localPreset = value);
  $$result.css.add(css$2);
  $$unsubscribe_localPreset();
  return `${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return ` <p class="svelte-1dkis9n" data-svelte-h="svelte-d0pszv">Waiting for the promise to resolve...</p> `;
    }
    return function(value) {
      return ` ${value.Folders.length > 0 ? `<section id="contentArea" class="svelte-1dkis9n">${each($localPreset.Folders, ({ folderName, links }, i) => {
        return `${validate_component(LinkBox, "LinkBox").$$render($$result, { id: i, folderHeader: folderName }, {}, {})}`;
      })} ${validate_component(NewFolder, "NewFolder").$$render($$result, {}, {}, {})}</section>` : `${validate_component(Startup, "Startup").$$render($$result, {}, {}, {})}`} `;
    }(__value);
  }($localPreset)}`;
});
const css$1 = {
  code: 'section.svelte-mh0zno.svelte-mh0zno{position:fixed;display:grid;width:100%;height:100%;background-color:rgba(34, 34, 34, 0.9);z-index:1;left:0;top:0;right:0;bottom:0;grid-template-columns:1fr;grid-template-rows:45% 35% 20%;grid-template-areas:"header" "input" "submit";justify-items:center}#exitOverlay.svelte-mh0zno.svelte-mh0zno{background-color:rgba(210, 0, 30, 0.7);padding:12px 18px;color:white;font-size:18px;border:solid 0px;box-shadow:2px 2px rgba(0, 0, 0, 0.8);position:absolute;top:0;right:0}#exitOverlay.svelte-mh0zno.svelte-mh0zno:hover{background-color:rgb(210, 0, 30)}#insertHead.svelte-mh0zno.svelte-mh0zno{grid-area:header;color:white;text-align:center;padding-top:100px}#insertHead.svelte-mh0zno h1.svelte-mh0zno{font-size:48px}#insertHead.svelte-mh0zno h2.svelte-mh0zno{font-size:34px}#insertContent.svelte-mh0zno.svelte-mh0zno{grid-area:input;width:100%;padding-top:50px;text-align:center}input.svelte-mh0zno.svelte-mh0zno{position:relative;width:75%;height:50px;font-size:18px;text-align:center;margin:20px 0 20px 0;outline:none}input.svelte-mh0zno.svelte-mh0zno:focus{background-color:rgba(150, 150, 150, 0.8);color:rgba(250, 250, 250, 0.8);border:solid 1px white}input.svelte-mh0zno.svelte-mh0zno:focus::placeholder{color:rgba(250, 250, 250, 0.8)}#submitOverlay.svelte-mh0zno.svelte-mh0zno{grid-area:submit;padding:12px 18px;color:white;font-size:32px;border:none;position:relative;align-items:center;justify-content:center;width:300px;height:100px}.disabled.svelte-mh0zno.svelte-mh0zno{background-color:rgba(255, 255, 255, 0.3)}.enabled.svelte-mh0zno.svelte-mh0zno{background-color:rgba(210, 0, 30, 0.7);box-shadow:2px 2px rgba(210, 0, 30, 0.7)}.enabled.svelte-mh0zno.svelte-mh0zno:hover{background-color:rgb(210, 0, 30)}',
  map: null
};
const LinkOverlay = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let submittable;
  let $$unsubscribe_localPreset;
  let $linkOverlayOptions, $$unsubscribe_linkOverlayOptions;
  $$unsubscribe_localPreset = subscribe(localPreset, (value) => value);
  $$unsubscribe_linkOverlayOptions = subscribe(linkOverlayOptions, (value) => $linkOverlayOptions = value);
  let { newLinkName = void 0 } = $$props;
  let { newLinkUrl = void 0 } = $$props;
  let type = $linkOverlayOptions.currLinkName ? "edit" : "new";
  let nameInput;
  if ($$props.newLinkName === void 0 && $$bindings.newLinkName && newLinkName !== void 0)
    $$bindings.newLinkName(newLinkName);
  if ($$props.newLinkUrl === void 0 && $$bindings.newLinkUrl && newLinkUrl !== void 0)
    $$bindings.newLinkUrl(newLinkUrl);
  $$result.css.add(css$1);
  submittable = newLinkName && newLinkUrl;
  $$unsubscribe_localPreset();
  $$unsubscribe_linkOverlayOptions();
  return `<section class="svelte-mh0zno"><button id="exitOverlay" class="svelte-mh0zno" data-svelte-h="svelte-1gtd4w4">X</button> <div id="insertHead" class="svelte-mh0zno">${type === "new" ? `<h1 class="svelte-mh0zno" data-svelte-h="svelte-1hqoe8f">Erstelle einen Link</h1>` : `<h1 class="svelte-mh0zno">Bearbeite &#39;&#39;${escape(newLinkName)}&#39;&#39; Link</h1>`} <h2 class="svelte-mh0zno">Im Ordner &#39;&#39;${escape($linkOverlayOptions.currentFolder)}&#39;&#39;</h2></div> <div id="insertContent" class="svelte-mh0zno"><input maxlength="40" type="text" placeholder="Link Name" class="svelte-mh0zno"${add_attribute("this", nameInput, 0)}${add_attribute("value", newLinkName, 0)}> <input type="text" placeholder="Link URL" class="svelte-mh0zno"${add_attribute("value", newLinkUrl, 0)}></div> <button id="submitOverlay" class="${escape(null_to_empty(!submittable ? "disabled" : "enabled"), true) + " svelte-mh0zno"}" ${!submittable ? "disabled" : ""}>Speichern</button></section> `;
});
const css = {
  code: ".editTooltip.svelte-1pa7di1{position:relative;bottom:20px;right:-18rem;margin:1rem;z-index:100}@media only screen and (max-width : 767px){.editTooltip.svelte-1pa7di1{right:-15rem}}.boxArea.svelte-1pa7di1{height:75vh;display:grid;grid-template-columns:100%;background-size:cover;background-repeat:no-repeat;scroll-behavior:unset}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $linkOverlayOptions, $$unsubscribe_linkOverlayOptions;
  $$unsubscribe_linkOverlayOptions = subscribe(linkOverlayOptions, (value) => $linkOverlayOptions = value);
  $$result.css.add(css);
  $$unsubscribe_linkOverlayOptions();
  return `${$$result.head += `<!-- HEAD_svelte-1f5caq5_START -->${$$result.title = `<title>Memorandum</title>`, ""}<meta name="description" content="Memorandum"><!-- HEAD_svelte-1f5caq5_END -->`, ""} <div class="headline"><div class="editTooltip svelte-1pa7di1">${validate_component(Wrapper, "Wrapper").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(IconButton, "IconButton").$$render($$result, { size: "mini" }, {}, {
        default: () => {
          return `${validate_component(CommonIcon, "Icon").$$render($$result, { class: "material-icons" }, {}, {
            default: () => {
              return `info`;
            }
          })}`;
        }
      })} ${validate_component(Tooltip, "Tooltip").$$render($$result, { xPos: "end", yPos: "above" }, {}, {
        default: () => {
          return `Willst du was bearbeiten? Versuchs mal mit einem Doppelklick.`;
        }
      })}`;
    }
  })}</div> <h1 data-svelte-h="svelte-j2j4r">Memorandum</h1></div> <div class="boxArea svelte-1pa7di1">${validate_component(BoxArea, "BoxArea").$$render($$result, {}, {}, {})}</div> ${$linkOverlayOptions.showOverlay ? `${validate_component(LinkOverlay, "LinkOverlay").$$render(
    $$result,
    {
      newLinkName: $linkOverlayOptions.currLinkName,
      newLinkUrl: $linkOverlayOptions.currLinkUrl
    },
    {},
    {}
  )}` : ``}`;
});
export {
  Page as default
};

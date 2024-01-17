import { c as create_ssr_component, a as subscribe, e as escape, n as null_to_empty, v as validate_component, b as add_attribute } from "../../chunks/ssr.js";
import { p as page } from "../../chunks/stores.js";
import { I as IconButton } from "../../chunks/IconButton.js";
import { C as CommonIcon } from "../../chunks/Svg.js";
const github = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='-3%20-3%2030%2030'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M12%202C6.47715%202%202%206.47715%202%2012C2%2017.5229%206.47715%2022%2012%2022C17.5229%2022%2022%2017.5229%2022%2012C22%206.47715%2017.5229%202%2012%202ZM0%2012C0%205.3726%205.3726%200%2012%200C18.6274%200%2024%205.3726%2024%2012C24%2018.6274%2018.6274%2024%2012%2024C5.3726%2024%200%2018.6274%200%2012Z'%20fill='rgba(0,0,0,0.7)'%20stroke='none'%20/%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M9.59162%2022.7357C9.49492%2022.6109%209.49492%2021.4986%209.59162%2019.399C8.55572%2019.4347%207.90122%2019.3628%207.62812%2019.1833C7.21852%2018.9139%206.80842%2018.0833%206.44457%2017.4979C6.08072%2016.9125%205.27312%2016.8199%204.94702%2016.6891C4.62091%2016.5582%204.53905%2016.0247%205.84562%2016.4282C7.15222%2016.8316%207.21592%2017.9303%207.62812%2018.1872C8.04032%2018.4441%209.02572%2018.3317%209.47242%2018.1259C9.91907%2017.9201%209.88622%2017.1538%209.96587%2016.8503C10.0666%2016.5669%209.71162%2016.5041%209.70382%2016.5018C9.26777%2016.5018%206.97697%2016.0036%206.34772%2013.7852C5.71852%2011.5669%206.52907%2010.117%206.96147%209.49369C7.24972%209.07814%207.22422%208.19254%206.88497%206.83679C8.11677%206.67939%209.06732%207.06709%209.73672%207.99999C9.73737%208.00534%2010.6143%207.47854%2012.0001%207.47854C13.386%207.47854%2013.8777%207.90764%2014.2571%207.99999C14.6365%208.09234%2014.94%206.36699%2017.2834%206.83679C16.7942%207.79839%2016.3844%208.99999%2016.6972%209.49369C17.0099%209.98739%2018.2372%2011.5573%2017.4833%2013.7852C16.9807%2015.2706%2015.9927%2016.1761%2014.5192%2016.5018C14.3502%2016.5557%2014.2658%2016.6427%2014.2658%2016.7627C14.2658%2016.9427%2014.4942%2016.9624%2014.8233%2017.8058C15.0426%2018.368%2015.0585%2019.9739%2014.8708%2022.6234C14.3953%2022.7445%2014.0254%2022.8257%2013.7611%2022.8673C13.2924%2022.9409%2012.7835%2022.9822%2012.2834%2022.9982C11.7834%2023.0141%2011.6098%2023.0123%2010.9185%2022.948C10.4577%2022.9051%2010.0154%2022.8343%209.59162%2022.7357Z'%20fill='rgba(0,0,0,0.7)'%20stroke='none'%20/%3e%3c/svg%3e";
const logo = "/_app/immutable/assets/stadtwerk-logo.McOCfaJx.svg";
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
  code: ".app.svelte-18ryhe5{display:flex;flex-direction:column;min-height:100vh}main.svelte-18ryhe5{flex:1;display:flex;flex-direction:column;padding:1rem;width:100%;margin:0 auto;box-sizing:border-box}footer.svelte-18ryhe5{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:12px}@media(min-width: 480px){footer.svelte-18ryhe5{padding:12px 0}}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="app svelte-18ryhe5">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-18ryhe5">${slots.default ? slots.default({}) : ``}</main> <footer class="svelte-18ryhe5" data-svelte-h="svelte-17kouov"><p>made by Tilloh with 💙</p></footer> </div>`;
});
export {
  Layout as default
};

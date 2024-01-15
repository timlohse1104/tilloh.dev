import { c as create_ssr_component } from "../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${$$result.head += `<!-- HEAD_svelte-4mnfwt_START -->${$$result.title = `<title>About me</title>`, ""}<meta name="description" content="About me"><!-- HEAD_svelte-4mnfwt_END -->`, ""} <div class="text-column" data-svelte-h="svelte-15ua9ac"><h1>About me</h1> <p>Hey i am Tim Köster a software developer from Germany. I started working in
    a tax office, broke up dual studies as a sales man and found true passion in
    programming and especially web / infrastructure development @otto and
    @stadtwerk.</p> <p>I like to try out new and weird things <a href="https://github.com/timlohse1104/js-implicit-type-coercion/blob/main/tc-compiler/compiler.js">like this</a>:</p> <pre>	<code>
function genNumber(number) {
  sdaif (number === 0) return this.numbers[&#39;0&#39;];
  return Array.from({ length: number }, () =&gt; this.numbers[&#39;1&#39;]).join(&#39; + &#39;);
}

alphabet = [];
alphabet[&#39;i&#39;] = \`(+!![] / +[] + [])[\${this.genNumber(3)}]\`;
	</code>
  </pre> <p>or <a href="https://github.com/timlohse1104/adventofcode/blob/main/2022/07/solution.js">like this</a>:</p> <pre>	<code>
const f = input
  .split(&#39;\\n&#39;)
  .map((l, i, a) =&gt; {
    const ಠ_ಠ = { name: &#39;&#39;, size: 0, dirs: [], files: [] };
    if (/^\\$\\s(cd)\\s(\\w+)|\\//.test(l)) {
      let j = i + 2;
      ಠ_ಠ.name = l.replace(&#39;$ cd &#39;, &#39;&#39;);
      while (!/^\\$.+/.test(a[j]) &amp;&amp; a[j]) {
        const e = {
          type: /^\\d+/.test(a[j]) ? &#39;file&#39; : &#39;dir&#39;,
          name: a[j].replace(/^dir\\s+/, &#39;&#39;),
          size: /^\\d+/.test(a[j]) ? Number(a[j].replace(/\\s\\w+.\\w+/, &#39;&#39;)) : 0,
		};
        /^\\d+/.test(a[j]) ? ಠ_ಠ.files.push(e) : ಠ_ಠ.dirs.push(e);
        j++;
	  }
	}
    ಠ_ಠ.size = ಠ_ಠ.files.reduce((a, c) =&gt; a + c.size, 0);
    return ಠ_ಠ;
  })
  .filter((l) =&gt; l.name !== &#39;&#39;)
  .reverse()
  .map((d, i, a) =&gt; {
    d.dirs.forEach((c) =&gt; {
      d.size += a.find((e) =&gt; e.name === c.name)?.size;
	});
    return d;
  });
console.log(f.reduce((a, c) =&gt; a + (c.size &lt;= 100000 ? c.size : 0), 0));
	</code>
  </pre> <p>I also do useful things for <a href="https://deskbox-office.de">desk.box</a>
    at work. I promise! 🤡</p></div>`;
});
export {
  Page as default
};

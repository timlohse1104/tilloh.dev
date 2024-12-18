<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
</script>

{#if $initialized}
  <section>
    <p>
      <span class="capital_word">Moin</span>
      {$t('page.about.introduction')}
    </p>

    <p>
      {@html $t('page.about.weirdJsText1')}:
    </p>

    <pre>
  <code>
function genNumber&lpar;number&rpar; &lcub;
  sdaif &lpar;number === 0&rpar; return this.numbers&lsqb;'0'&rsqb;;
  return Array.from&lpar;&lcub; length: number &rcub;, &lpar;&rpar; =&gt; this.numbers&lsqb;'1'&rsqb;&rpar;.join&lpar;' + '&rpar;;
&rcub;

alphabet = [];
alphabet&lsqb;'i'&rsqb; = `&lpar;+!!&lsqb;&rsqb; / +&lsqb;&rsqb; + &lsqb;&rsqb;)&lsqb;$&lcub;this.genNumber&lpar;3&rpar;&rcub;&rsqb;`;
  </code>
  </pre>

    <p>
      {@html $t('page.about.weirdJsText2')}:
    </p>

    <pre>
  <code>
const f = input
  .split(&apos;\n&apos;)
  .map((l, i, a) =&gt; &lcub;
    const &#xCA0;_&#xCA0; = &lcub; name: &apos;&apos;, size: 0, dirs: [], files: [] &rcub;;
    if (/^\$\s(cd)\s(\w+)|\//.test(l)) &lcub;
      let j = i + 2;
      &#xCA0;_&#xCA0;.name = l.replace(&apos;$ cd &apos;, &apos;&apos;);
      while (!/^\$.+/.test(a[j]) &amp;&amp; a[j]) &lcub;
        const e = &lcub;
          type: /^\d+/.test(a[j]) ? &apos;file&apos; : &apos;dir&apos;,
          name: a[j].replace(/^dir\s+/, &apos;&apos;),
          size: /^\d+/.test(a[j]) ? Number(a[j].replace(/\s\w+.\w+/, &apos;&apos;)) : 0,
    &rcub;;
        /^\d+/.test(a[j]) ? &#xCA0;_&#xCA0;.files.push(e) : &#xCA0;_&#xCA0;.dirs.push(e);
        j++;
    &rcub;
  &rcub;
    &#xCA0;_&#xCA0;.size = &#xCA0;_&#xCA0;.files.reduce((a, c) =&gt; a + c.size, 0);
    return &#xCA0;_&#xCA0;;
  &rcub;)
  .filter((l) =&gt; l.name !== &apos;&apos;)
  .reverse()
  .map((d, i, a) =&gt; &lcub;
    d.dirs.forEach((c) =&gt; &lcub;
      d.size += a.find((e) =&gt; e.name === c.name)?.size;
  &rcub;);
    return d;
  &rcub;);
console.log(f.reduce((a, c) =&gt; a + (c.size &lt;= 100000 ? c.size : 0), 0));
  </code>
  </pre>

    <p>
      {@html $t('page.about.usefulWorkText')}
    </p>

    <p>{$t('page.shared.madeByText')}</p>
  </section>
{:else}
  <section>Locale initializing...</section>
{/if}

<style lang="scss">
  section {
    max-width: 80vw;
    margin: 0 auto;
    color: var(--light80);
    height: 88vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .capital_word {
    font-size: 3rem;
  }
</style>

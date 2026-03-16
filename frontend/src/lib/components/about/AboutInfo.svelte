<script lang="ts">
  import { initialized, t } from '$lib/util/translations';
  import CodeSnippet from 'carbon-components-svelte/src/CodeSnippet/CodeSnippet.svelte';

  const code1 = `
function genNumber(number) {
  sdaif (number === 0) return this.numbers['0'];
  return Array.from({ length: number }, () => this.numbers['1']).join(' + ');
}

alphabet = [];
alphabet['i'] = \`(+!![] / +[] + [])[\${this.genNumber(3)}]\`;
`;

  const code2 = `
const f = input
  .split('\n')
  .map((l, i, a) => {
    const ಠ_ಠ = { name: '', size: 0, dirs: [], files: [] };
    if (/^\$\s(cd)\s(\w+)|\//.test(l)) {
      let j = i + 2;
      ಠ_ಠ.name = l.replace('$ cd ', '');
      while (!/^\$.+/.test(a[j]) && a[j]) {
        const e = {
          type: /^\d+/.test(a[j]) ? 'file' : 'dir',
          name: a[j].replace(/^dir\s+/, ''),
          size: /^\d+/.test(a[j]) ? Number(a[j].replace(/\s\w+.\w+/, '')) : 0,
    };
        /^\d+/.test(a[j]) ? ಠ_ಠ.files.push(e) : ಠ_ಠ.dirs.push(e);
        j++;
    }
  }
    ಠ_ಠ.size = ಠ_ಠ.files.reduce((a, c) => a + c.size, 0);
    return ಠ_ಠ;
  })
  .filter((l) => l.name !== '')
  .reverse()
  .map((d, i, a) => {
    d.dirs.forEach((c) => {
      d.size += a.find((e) => e.name === c.name)?.size;
  });
    return d;
  });
console.log(f.reduce((a, c) => a + (c.size <= 100000 ? c.size : 0), 0));
`;
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

    <div class="code_snippet">
      <CodeSnippet type="multi" code={code1} hideCopyButton expanded />
    </div>

    <p>
      {@html $t('page.about.weirdJsText2')}:
    </p>

    <div class="code_snippet">
      <CodeSnippet type="multi" code={code2} hideCopyButton expanded />
    </div>

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
    height: 88vh;
    height: 88dvh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .capital_word {
    font-size: 3rem;
  }

  .code_snippet {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
</style>

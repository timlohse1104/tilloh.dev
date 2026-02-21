<script>
  import { onDestroy, onMount, tick } from 'svelte';

  let {
    stretchFirst = false,
    gridGap = '0.5em',
    colWidth = 'minmax(Min(25em, 100%), 1fr)',
    items = [],
    reset = $bindable(),
    children
  } = $props();

  let grids = [],
    masonryElement;

  const refreshLayout = async () => {
    grids.forEach(async (grid) => {
      /* get the post relayout number of columns */
      let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(
        ' ',
      ).length;

      grid.items.forEach((c) => {
        let new_h = c.getBoundingClientRect().height;

        if (new_h !== +c.dataset.h) {
          c.dataset.h = new_h;
          grid.mod++;
        }
      });

      /* if the number of columns has changed */
      if (grid.ncol !== ncol || grid.mod) {
        /* update number of columns */
        grid.ncol = ncol;
        /* revert to initial positioning, no margin */
        grid.items.forEach((c) => c.style.removeProperty('margin-top'));
        /* if we have more than one column */
        if (grid.ncol > 1) {
          grid.items.slice(ncol).forEach((c, i) => {
            let prev_fin =
                grid.items[i].getBoundingClientRect()
                  .bottom /* bottom edge of item above */,
              curr_ini =
                c.getBoundingClientRect().top; /* top edge of current item */

            c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
          });
        }

        grid.mod = 0;
      }
    });
  };

  const calcGrid = async (_masonryArr) => {
    await tick();
    if (
      _masonryArr.length &&
      getComputedStyle(_masonryArr[0]).gridTemplateRows !== 'masonry'
    ) {
      grids = _masonryArr.map((grid) => {
        return {
          _el: grid,
          gap: parseFloat(getComputedStyle(grid).gridRowGap),
          items: [...grid.childNodes].filter(
            (c) =>
              c.nodeType === 1 && +getComputedStyle(c).gridColumnEnd !== -1,
          ),
          ncol: 0,
          mod: 0,
        };
      });
      refreshLayout(); /* initial load */
    }
  };

  let _window;
  onMount(() => {
    _window = window;
    _window.addEventListener('resize', refreshLayout, false); /* on resize */
  });
  onDestroy(() => {
    if (_window) {
      _window.removeEventListener(
        'resize',
        refreshLayout,
        false,
      ); /* on resize */
    }
  });

  $effect(() => {
    if (masonryElement) {
      calcGrid([masonryElement]);
    }
  });

  $effect(() => {
    // Trigger refresh when items array changes (order or content)
    if (items && masonryElement) {
      // Track the actual items array, not just length
      const itemIds = items.map(item => item.id || item).join(',');

      // Use requestAnimationFrame to wait for browser repaint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Force recalculation by marking all grids as modified
          grids.forEach(grid => grid.mod = 1);
          calcGrid([masonryElement]);
          refreshLayout();
        });
      });
    }
  });

  $effect(() => {
    // Trigger refresh when reset changes
    if (reset && masonryElement) {
      requestAnimationFrame(() => {
        calcGrid([masonryElement]);
        refreshLayout();
      });
    }
  });
</script>

<!--
  An almost direct copy and paste of: https://css-tricks.com/a-lightweight-masonry-solution

  Usage:
    - stretchFirst stretches the first item across the top

  <Masonry stretchFirst={true} >
    {#each data as o}
      <div class="_card _padding">
        Here's some stuff {o.name}
        <header>
          <h3>{o.name}</h3>
        </header>
        <section>
          <p>{o.text}</p>
        </section>
      </div>
    {/each}
  </Masonry>
 -->

<div
  bind:this={masonryElement}
  class={`__grid--masonry ${stretchFirst ? '__stretch-first' : ''}`}
  style={`--grid-gap: ${gridGap}; --col-width: ${colWidth};`}
>
  {@render children()}
</div>

<!--
$w: var(--col-width); // minmax(Min(20em, 100%), 1fr);
$s: var(--grid-gap); // .5em;
-->

<style lang="scss">
  :global(.__grid--masonry) {
    display: grid;
    grid-template-columns: repeat(auto-fit, var(--col-width));
    grid-template-rows: masonry;
    justify-content: center;
    grid-gap: var(--grid-gap);
    padding: var(--grid-gap);
  }
  :global(.__grid--masonry > *) {
    align-self: start;
  }
  :global(.__grid--masonry.__stretch-first > *:first-child) {
    grid-column: 1/ -1;
  }
</style>

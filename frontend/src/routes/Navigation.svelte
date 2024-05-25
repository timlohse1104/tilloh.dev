<script>
  import { page } from '$app/stores';
</script>

<section>
  <div class="navigation-box">
    <nav>
      <ul>
        <li aria-current={$page.url.pathname === '/' ? 'page' : undefined}>
          <a href="/">Startseite</a>
        </li>
        <li
          aria-current={$page.url.pathname === '/memorandum'
            ? 'page'
            : undefined}
        >
          <a href="/memorandum">Memorandum</a>
        </li>
        <li aria-current={$page.url.pathname === '/todo' ? 'page' : undefined}>
          <a href="/todo">ToDo</a>
        </li>
        <li aria-current={$page.url.pathname === '/chat' ? 'page' : undefined}>
          <a href="/chat">Klönschnack</a>
        </li>
      </ul>
    </nav>
  </div>
  <div class="navigation-box">
    <nav>
      <ul>
        <li
          aria-current={$page.url.pathname === '/catch-em-all'
            ? 'page'
            : undefined}
        >
          <a href="/catch-em-all">Catch-em-all</a>
        </li>
        <li
          aria-current={$page.url.pathname === '/uno-sort' ? 'page' : undefined}
        >
          <a href="/uno-sort">Uno Sort</a>
        </li>
        <li aria-current={$page.url.pathname === '/about' ? 'page' : undefined}>
          <a href="/about">Über</a>
        </li>
      </ul>
    </nav>
  </div>
</section>

<style lang="scss">
  @import '../lib/styles/global.scss';

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    margin-top: 0;
  }

  .navigation-box {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
  }

  nav {
    display: flex;
    justify-content: center;
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
  }

  li {
    position: relative;
    height: 100%;
  }

  li + li {
    border-left: var(--lightgrey80) 2px solid;
    height: 50%;
  }

  li[aria-current='page']::before {
    --size: 5px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 1rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;

    @media #{$tablet} {
      font-size: 0.8rem;
      padding: 0 0.5rem;
    }

    @media #{$phone} {
      font-size: 0.6rem;
      padding: 0 0.5rem;
    }
  }

  a:hover {
    color: var(--color-theme-1);
  }
</style>

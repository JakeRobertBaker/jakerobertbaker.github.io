// Starlight marks the current contents entry by the nearest heading it can
// see, so block entries added by route data never become current. Widen its
// anchor selector to every target the contents links to, keeping Starlight's
// own observer, keyboard and mobile summary behaviour. The selector is read
// lazily and blocks are already observed as section content, so this works
// whether or not Starlight's idle-time setup has run.
type Contents = HTMLElement & { tocHeadingSelector: string };

for (const name of ['starlight-toc', 'mobile-starlight-toc']) {
  customElements.whenDefined(name).then(() => {
    for (const toc of document.querySelectorAll<Contents>(name)) {
      const targets = [...toc.querySelectorAll('a')]
        .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
        .filter((target) => target && !target.matches(toc.tocHeadingSelector));
      if (!targets.length) continue;
      toc.tocHeadingSelector += ',' + targets.map((target) => `#${CSS.escape(target!.id)}`).join();
    }
  });
}

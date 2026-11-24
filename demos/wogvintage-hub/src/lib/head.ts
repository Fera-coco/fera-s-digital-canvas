// The static head tags in index.html are for link previews; React manages the head from here.
export const clearStaticHead = () =>
  document
    .querySelectorAll('head title, head meta[name="description"], head meta[property^="og:"]:not([property="og:site_name"])')
    .forEach((el) => el.remove())

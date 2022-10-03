export const getFavicon = () => {
  let favicon = document.querySelector("link[rel*='icon']")?.getAttribute('href');
  if (favicon) {
    try {
      new URL(favicon);
    } catch (e) {
      favicon = window.location.origin + favicon;
    }
  }
  return favicon;
};

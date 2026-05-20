export function openCenteredPopup(url: string, target = "oauth_popup"): Window | null {
  const popupWidth = window.innerWidth * 0.4;
  const popupHeight = window.innerHeight * 0.7;
  const left = Math.max(0, window.screenX + (window.outerWidth - popupWidth) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - popupHeight) / 2);
  const popupFeatures = [
    `width=${Math.round(popupWidth)}`,
    `height=${Math.round(popupHeight)}`,
    `left=${Math.round(left)}`,
    `top=${Math.round(top)}`,
    "scrollbars=yes",
    "resizable=yes",
  ].join(",");

  return window.open(url, target, popupFeatures);
}

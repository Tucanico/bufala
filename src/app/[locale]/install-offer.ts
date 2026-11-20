// Chrome sends its install offer ("beforeinstallprompt") once per page load.
// install-hint.tsx only listens once its code has run, after the load event
// (20 to 50 ms later, about 200 ms on a slow CPU), so on a slow phone the offer
// could come first and be lost. This script, inline in the page head (layout.tsx),
// runs before anything else and keeps the offer for the button.
// Not in install-hint.tsx: a server component can't read a value from a client file.
export const INSTALL_OFFER = "__bufalaInstallOffer";

export const CATCH_INSTALL_OFFER =
  `addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.${INSTALL_OFFER}=e});` +
  `addEventListener("appinstalled",function(){window.${INSTALL_OFFER}=null})`;

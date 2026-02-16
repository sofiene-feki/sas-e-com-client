export const initFacebookPixel = (dynamicPixelId) => {
  if (window.fbq) return;

  const pixelId = dynamicPixelId || import.meta.env.VITE_FB_PIXEL_ID;
  if (!pixelId) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod(...arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script");

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
};

export const fbTrack = (event, data = {}) => {
  if (window.fbq) {
    window.fbq("track", event, data);
  } else {
    console.warn("fbq not initialized yet");
  }
};

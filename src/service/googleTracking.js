// src/service/googleTracking.js

/**
 * Initialize Google Analytics (GA4)
 */
export const initGoogleAnalytics = (measurementId) => {
    if (!measurementId || window.gtag) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
        window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", measurementId);
};

/**
 * Initialize Google Tag Manager (GTM)
 */
export const initGoogleTagManager = (gtmId) => {
    if (!gtmId || window.dataLayer?.some(item => item['gtm.start'])) return;

    (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != "dataLayer" ? "&l=" + l : "";
        j.async = true;
        j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", gtmId);
};

/**
 * Initialize Google Ads (Global Site Tag)
 */
export const initGoogleAds = (googleAdsId) => {
    if (!googleAdsId) return;

    // Google Ads usually uses the same gtag infrastructure as GA4
    if (!window.gtag) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag() {
            window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag("js", new Date());
    }

    window.gtag("config", googleAdsId);
};

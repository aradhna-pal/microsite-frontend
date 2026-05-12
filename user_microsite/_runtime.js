(function () {
    var API_BASE = "http://microsite_backend.workarya.com";

    function safeText(value, fallback) {
        if (value === null || value === undefined || value === "") {
            return fallback || "-";
        }
        return String(value);
    }

    function setText(id, value, fallback) {
        var el = document.getElementById(id);
        if (el) {
            el.textContent = safeText(value, fallback);
        }
    }

    function setImage(id, value, fallback) {
        var el = document.getElementById(id);
        if (el && el.tagName === "IMG") {
            el.src = value || fallback || el.src;
        }
    }

    function applyTheme(theme) {
        if (!theme) return;
        var root = document.documentElement;
        if (theme.headerColor) root.style.setProperty("--ms-header-color", theme.headerColor);
        if (theme.textColor) root.style.setProperty("--ms-text-color", theme.textColor);
        if (theme.backgroundColor) root.style.setProperty("--ms-bg-color", theme.backgroundColor);
        if (theme.buttonColor) root.style.setProperty("--ms-button-color", theme.buttonColor);
        if (theme.buttonTextColor) root.style.setProperty("--ms-button-text-color", theme.buttonTextColor);
        if (theme.footerColor) root.style.setProperty("--ms-footer-color", theme.footerColor);
        if (theme.footerTextColor) root.style.setProperty("--ms-footer-text-color", theme.footerTextColor);
        if (theme.fontFamily) root.style.setProperty("--ms-font-family", theme.fontFamily);
    }

    function applySeo(seo, siteName, favicon) {
        if (seo && seo.metaTitle) document.title = seo.metaTitle;

        var descMeta = document.querySelector('meta[name="description"]');
        if (descMeta && seo && seo.metaDescription) {
            descMeta.setAttribute("content", seo.metaDescription);
        }

        if (seo && seo.metaKeywords) {
            var keywords = document.querySelector('meta[name="keywords"]');
            if (!keywords) {
                keywords = document.createElement("meta");
                keywords.setAttribute("name", "keywords");
                document.head.appendChild(keywords);
            }
            keywords.setAttribute("content", seo.metaKeywords);
        }

        var finalFavicon = (seo && seo.ogImage) || favicon;
        if (finalFavicon) {
            var icon = document.querySelector("link[rel='icon']");
            if (!icon) {
                icon = document.createElement("link");
                icon.rel = "icon";
                document.head.appendChild(icon);
            }
            icon.href = finalFavicon;
        }

        if (!seo || !seo.metaTitle) {
            document.title = siteName + " | Microsite";
        }
    }

    function buildDateRange(startDate, endDate) {
        var from = safeText(startDate, "N/A");
        var to = safeText(endDate, "N/A");
        return "Validity: " + from + " to " + to;
    }

    function micrositeFromPayload(payload) {
        if (!payload) return null;
        if (payload.data) return payload.data;
        if (Array.isArray(payload) && payload.length > 0) return payload[0];
        return payload;
    }

    async function fetchMicrosite(context) {
        var slug = context && context.slug ? context.slug : "";
        var domain = context && context.domain ? context.domain : window.location.hostname;

        var endpoints = [];
        if (slug) {
            endpoints.push(API_BASE + "/api/admin/microsite-by-slug/" + encodeURIComponent(slug));
            endpoints.push(API_BASE + "/api/microsite/slug/" + encodeURIComponent(slug));
        }

        if (domain) {
            endpoints.push(API_BASE + "/api/microsite/by-domain?domain=" + encodeURIComponent(domain));
        }

        endpoints.push(API_BASE + "/api/admin/all-microsite");

        for (var i = 0; i < endpoints.length; i += 1) {
            try {
                var res = await fetch(endpoints[i]);
                if (!res.ok) continue;
                var data = await res.json();
                var microsite = micrositeFromPayload(data);

                if (Array.isArray(data) && data.length > 0 && slug) {
                    microsite = data.find(function (item) { return item.slug === slug; }) || data[0];
                }

                if (microsite && microsite.id) {
                    return microsite;
                }
            } catch (e) {
                // try next endpoint
            }
        }
        return null;
    }

    function bindMicrosite(m) {
        if (!m) return;

        var name = safeText(m.name, "Microsite");
        setText("msSiteName", name, "Microsite");
        setText("msFooterName", name, "Microsite");
        setText("msHeading", m.heading || m.name, "Microsite Heading");
        setText("msContent", m.content, "Microsite content will be loaded from backend values.");
        setText("msFooterContent", m.content, "Microsite content will be loaded from backend values.");

        setText("msAddress", m.address, "-");
        setText("msEmail", m.email, "-");
        setText("msMobile", m.mobile, "-");

        setText("msContactAddress", m.address, "-");
        setText("msContactEmail", m.email, "-");
        setText("msContactMobile", m.mobile, "-");

        setText("msDateRange", buildDateRange(m.startDate, m.endDate), "Validity: -");

        setImage("msLogo", m.logoImage, "../assets/images/demos/demo-7/logo.png");
        setImage("msBanner", m.bannerImage, "../assets/images/demos/demo-7/banners/banner-1.jpg");

        applyTheme(m.theme || {});
        applySeo(m.seo || {}, name, m.favicon);
    }

    function preserveContextLinks(context) {
        var params = new URLSearchParams();
        if (context && context.slug) params.set("slug", context.slug);
        if (context && context.domain) params.set("domain", context.domain);
        var query = params.toString();
        if (!query) return;

        var links = document.querySelectorAll(".ms-header a[href$='.php']");
        links.forEach(function (link) {
            var href = link.getAttribute("href") || "";
            var clean = href.split("?")[0];
            link.setAttribute("href", clean + "?" + query);
        });
    }

    document.addEventListener("DOMContentLoaded", async function () {
        var context = window.MICROSITE_CONTEXT || {};
        preserveContextLinks(context);
        var microsite = await fetchMicrosite(context);

        if (!microsite) {
            if (window.iziToast) {
                iziToast.warning({
                    title: "Microsite",
                    message: "Microsite data load nahi hui. Default template dikh raha hai.",
                    position: "topRight"
                });
            }
            return;
        }

        bindMicrosite(microsite);
    });
})();

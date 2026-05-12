document.addEventListener("DOMContentLoaded", () => {
  initMicrositeListPage();
  initMicrositeFormPage();
  initAssignedProductPage();
  initMicrositeOrdersPage();
});

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || response.statusText };
  }
  if (!response.ok) {
    throw new Error(data.message || data.error || `Request failed (${response.status})`);
  }
  return data;
}

async function initMicrositeListPage() {
  const table = document.getElementById("micrositeTableBody");
  if (!table) return;
  const addBtn = document.getElementById("showMicrositeFormBtn");
  const searchInput = document.getElementById("micrositeSearchInput");
  let allMicrosites = [];

  function resolveAssetUrl(path) {
    if (!path) return "";
    const cleanPath = String(path).trim().replace(/\\/g, "/");
    if (!cleanPath) return "";
    if (/^https?:\/\//i.test(cleanPath) || cleanPath.startsWith("data:")) return cleanPath;
    if (cleanPath.startsWith("/")) return `${domin}${cleanPath}`;
    return `${domin}/${cleanPath}`;
  }

  function getMicrositeUrlField(item) {
    if (!item) return "";
    const raw = item.url ?? item.Url ?? item.micrositeUrl ?? item.MicrositeUrl ?? item.siteUrl ?? item.SiteUrl;
    return raw != null ? String(raw).trim() : "";
  }

  function escapeHtmlMicrosite(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatMicrositeDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function statusBadge(status) {
    return status
      ? `<span class="badge bg-success">Active</span>`
      : `<span class="badge bg-danger">Inactive</span>`;
  }

  function clearPreview(container) {
    if (!container) return;
    container.querySelectorAll(".preview-item").forEach((x) => x.remove());
  }

  function renderPreviewFromUrl(container, url) {
    if (!container || !url) return;
    clearPreview(container);
    container.insertAdjacentHTML(
      "afterbegin",
      `<div class="item preview-item"><img src="${url}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>`
    );
  }

  function bindFilePreview(fileInput, container) {
    if (!fileInput || !container) return;
    fileInput.addEventListener("change", () => {
      clearPreview(container);
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        container.insertAdjacentHTML(
          "afterbegin",
          `<div class="item preview-item"><img src="${e.target.result}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>`
        );
      };
      reader.readAsDataURL(file);
    });
  }

  function renderMicrositeRows(rows) {
    table.innerHTML = "";
    rows.forEach((item) => {
      const logo = resolveAssetUrl(item.logoImage) || "https://via.placeholder.com/60x60?text=No";
      const domain = Array.isArray(item.domains) && item.domains.length > 0 ? item.domains[0] : "-";
      const siteUrl = getMicrositeUrlField(item);
      const hrefRaw = siteUrl && /^https?:\/\//i.test(siteUrl) ? siteUrl : siteUrl ? `https://${siteUrl}` : "";
      const urlCell =
        siteUrl !== ""
          ? `<div style="flex:0 0 200px;overflow:hidden;text-overflow:ellipsis;" class="body-text" title="${escapeHtmlMicrosite(siteUrl)}"><a href="${escapeHtmlMicrosite(hrefRaw)}" target="_blank" rel="noopener noreferrer" class="text-primary">${escapeHtmlMicrosite(siteUrl)}</a></div>`
          : `<div style="flex:0 0 200px;" class="body-text">-</div>`;
      const rowDateTime = formatMicrositeDateTime(
        item.updatedAt || item.updatedat || item.createdAt || item.createdat || item.startDate
      );
      table.insertAdjacentHTML(
        "beforeend",
        `<li class="attribute-item flex items-center gap20" style="white-space: nowrap;">
          <div style="flex:0 0 60px;" class="body-text">${item.id}</div>
          <div style="flex:0 0 90px;"><img src="${logo}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;"></div>
          <div style="flex:0 0 170px;" class="body-text">${item.name ?? "-"}</div>
          <div style="flex:0 0 130px;" class="body-text">${item.slug ?? "-"}</div>
          <div style="flex:0 0 170px;" class="body-text">${domain}</div>
          ${urlCell}
          <div style="flex:0 0 180px;" class="body-text">${rowDateTime}</div>
          <div style="flex:0 0 100px;">${statusBadge(item.status)}</div>
          <div style="flex:0 0 70px;" class="list-icon-function"><div class="item text-primary" onclick="editMicrositeRow(${item.id})"><i class="icon-edit-3"></i></div></div>
          <div style="flex:0 0 70px;" class="list-icon-function"><div class="item text-danger" onclick="deleteMicrositeRow(${item.id})"><i class="icon-trash-2"></i></div></div>
        </li>`
      );
    });
  }

  async function loadMicrosites() {
    try {
      allMicrosites = await fetchJson(`${domin}/api/admin/all-microsite`, {
        headers: getAuthHeaders(),
      });
      renderMicrositeRows(allMicrosites);
    } catch (err) {
      iziToast.error({ title: "Error", message: err.message, position: "topRight" });
    }
  }

  window.editMicrositeRow = async (id) => {
    window.location.href = `edit-microsite.php?id=${id}`;
  };

  window.deleteMicrositeRow = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this microsite?");
    if (!confirmed) return;
    try {
      await fetchJson(`${domin}/api/admin/delete-microsite/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      iziToast.success({ title: "Success", message: "Microsite deleted", position: "topRight" });
      loadMicrosites();
    } catch (err) {
      iziToast.error({ title: "Error", message: err.message, position: "topRight" });
    }
  };

  if (addBtn) addBtn.addEventListener("click", () => (window.location.href = "add-microsite.php"));

  if (searchInput) {
    searchInput.closest("form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const key = searchInput.value.trim().toLowerCase();
      if (!key) return renderMicrositeRows(allMicrosites);
      const filtered = allMicrosites.filter((item) => {
        const domainText = Array.isArray(item.domains) ? item.domains.join(" ") : "";
        const urlText = getMicrositeUrlField(item).toLowerCase();
        return (
          String(item.id).includes(key) ||
          (item.name ?? "").toLowerCase().includes(key) ||
          (item.slug ?? "").toLowerCase().includes(key) ||
          domainText.toLowerCase().includes(key) ||
          urlText.includes(key)
        );
      });
      renderMicrositeRows(filtered);
    });
  }

  loadMicrosites();
}

async function initMicrositeFormPage() {
  const form = document.getElementById("micrositeCrudForm");
  if (!form) return;

  const mode = form.dataset.mode || "add";
  const params = new URLSearchParams(window.location.search);
  const idFromQuery = params.get("id");

  const idInput = document.getElementById("micrositeId");
  const nameInput = document.getElementById("micrositeName");
  const slugInput = document.getElementById("micrositeSlug");
  const headingInput = document.getElementById("micrositeHeading");
  const contentInput = document.getElementById("micrositeContent");
  const addressInput = document.getElementById("micrositeAddress");
  const emailInput = document.getElementById("micrositeEmail");
  const mobileInput = document.getElementById("micrositeMobile");
  const logoFileInput = document.getElementById("micrositeLogoFile");
  const bannerFileInput = document.getElementById("micrositeBannerFile");
  const faviconFileInput = document.getElementById("micrositeFaviconFile");
  const logoPreviewContainer = document.getElementById("logo-preview-container");
  const bannerPreviewContainer = document.getElementById("banner-preview-container");
  const faviconPreviewContainer = document.getElementById("favicon-preview-container");
  const startDateInput = document.getElementById("micrositeStartDate");
  const endDateInput = document.getElementById("micrositeEndDate");
  const statusInput = document.getElementById("micrositeStatus");
  const domainInput = document.getElementById("micrositeDomain");
  const urlInput = document.getElementById("micrositeUrl");
  const themeHeaderColor = document.getElementById("themeHeaderColor");
  const themeHeaderColorPicker = document.getElementById("themeHeaderColorPicker");
  const themeTextColor = document.getElementById("themeTextColor");
  const themeTextColorPicker = document.getElementById("themeTextColorPicker");
  const themeBackgroundColor = document.getElementById("themeBackgroundColor");
  const themeBackgroundColorPicker = document.getElementById("themeBackgroundColorPicker");
  const themeButtonColor = document.getElementById("themeButtonColor");
  const themeButtonColorPicker = document.getElementById("themeButtonColorPicker");
  const themeButtonTextColor = document.getElementById("themeButtonTextColor");
  const themeButtonTextColorPicker = document.getElementById("themeButtonTextColorPicker");
  const themeFooterColor = document.getElementById("themeFooterColor");
  const themeFooterColorPicker = document.getElementById("themeFooterColorPicker");
  const themeFooterTextColor = document.getElementById("themeFooterTextColor");
  const themeFooterTextColorPicker = document.getElementById("themeFooterTextColorPicker");
  const themeFontFamily = document.getElementById("themeFontFamily");
  const seoMetaTitle = document.getElementById("seoMetaTitle");
  const seoMetaDescription = document.getElementById("seoMetaDescription");
  const seoMetaKeywords = document.getElementById("seoMetaKeywords");
  const seoOgImage = document.getElementById("seoOgImage");
  const previewHeader = document.getElementById("previewHeader");
  const previewBody = document.getElementById("previewBody");
  const previewFooter = document.getElementById("previewFooter");
  const previewHeadingText = document.getElementById("previewHeadingText");
  const previewContentText = document.getElementById("previewContentText");
  const previewLogo = document.getElementById("previewLogo");
  const previewBanner = document.getElementById("previewBanner");
  const openFullPreviewBtn = document.getElementById("openFullPreviewBtn");

  function resolveAssetUrl(path) {
    if (!path) return "";
    const cleanPath = String(path).trim().replace(/\\/g, "/");
    if (!cleanPath) return "";
    if (/^https?:\/\//i.test(cleanPath) || cleanPath.startsWith("data:")) return cleanPath;
    if (cleanPath.startsWith("/")) return `${domin}${cleanPath}`;
    return `${domin}/${cleanPath}`;
  }

  function toDateInputValue(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function parseDomains(raw) {
    return raw.split(",").map((x) => x.trim()).filter(Boolean);
  }

  function clearPreview(container) {
    if (!container) return;
    container.querySelectorAll(".preview-item").forEach((x) => x.remove());
  }

  function renderPreviewFromUrl(container, url) {
    const imageUrl = resolveAssetUrl(url);
    if (!container || !imageUrl) return;
    clearPreview(container);
    container.insertAdjacentHTML("afterbegin", `<div class="item preview-item"><img src="${imageUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>`);
  }

  function bindFilePreview(fileInput, container) {
    if (!fileInput || !container) return;
    fileInput.addEventListener("change", () => {
      clearPreview(container);
      const file = fileInput.files && fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => container.insertAdjacentHTML("afterbegin", `<div class="item preview-item"><img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;"></div>`);
      reader.readAsDataURL(file);
    });
  }

  function getPreviewImage(container) {
    const img = container?.querySelector(".preview-item img");
    return img ? img.getAttribute("src") || "" : "";
  }

  function updateLivePreview() {
    if (!previewHeader || !previewBody || !previewFooter) return;

    const headerColor = themeHeaderColor?.value?.trim() || "#111827";
    const textColor = themeTextColor?.value?.trim() || "#ffffff";
    const backgroundColor = themeBackgroundColor?.value?.trim() || "#ffffff";
    const buttonColor = themeButtonColor?.value?.trim() || "#2563eb";
    const buttonTextColor = themeButtonTextColor?.value?.trim() || "#ffffff";
    const footerColor = themeFooterColor?.value?.trim() || "#1f2937";
    const footerTextColor = themeFooterTextColor?.value?.trim() || "#ffffff";
    const fontFamily = themeFontFamily?.value?.trim() || "inherit";

    previewHeader.style.background = headerColor;
    previewHeader.style.color = textColor;
    previewBody.style.background = backgroundColor;
    previewBody.style.fontFamily = fontFamily;
    previewFooter.style.background = footerColor;
    previewFooter.style.color = footerTextColor;

    if (previewHeadingText) previewHeadingText.textContent = headingInput?.value?.trim() || nameInput?.value?.trim() || "Microsite Heading";
    if (previewContentText) previewContentText.textContent = contentInput?.value?.trim() || "Microsite content preview will appear here.";
    if (previewFooter) previewFooter.textContent = `Footer preview • ${nameInput?.value?.trim() || "Microsite"}`;

    const logoSrc = getPreviewImage(logoPreviewContainer);
    if (previewLogo) {
      if (logoSrc) {
        previewLogo.src = logoSrc;
        previewLogo.style.display = "block";
      } else {
        previewLogo.style.display = "none";
      }
    }

    const bannerSrc = getPreviewImage(bannerPreviewContainer);
    if (previewBanner) {
      if (bannerSrc) {
        previewBanner.src = bannerSrc;
        previewBanner.style.display = "block";
      } else {
        previewBanner.style.display = "none";
      }
    }

    if (previewBody) {
      previewBody.style.borderTop = `3px solid ${buttonColor}`;
      previewBody.style.color = buttonTextColor === "#ffffff" ? "#111827" : buttonTextColor;
    }
  }

  function bindColorPicker(textInput, colorInput, fallbackHex) {
    if (!textInput || !colorInput) return;
    const safeHex = fallbackHex || "#000000";
    colorInput.value = safeHex;
    textInput.addEventListener("input", () => {
      const v = (textInput.value || "").trim();
      if (/^#([0-9a-fA-F]{6})$/.test(v)) {
        colorInput.value = v;
      }
      updateLivePreview();
    });
    colorInput.addEventListener("input", () => {
      textInput.value = colorInput.value;
      updateLivePreview();
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function openFullPreview() {
    const name = nameInput?.value?.trim() || "Microsite";
    const heading = headingInput?.value?.trim() || name;
    const content = contentInput?.value?.trim() || "Microsite content preview";
    const headerColor = themeHeaderColor?.value?.trim() || "#111827";
    const textColor = themeTextColor?.value?.trim() || "#ffffff";
    const bgColor = themeBackgroundColor?.value?.trim() || "#ffffff";
    const footerColor = themeFooterColor?.value?.trim() || "#1f2937";
    const footerTextColor = themeFooterTextColor?.value?.trim() || "#ffffff";
    const fontFamily = themeFontFamily?.value?.trim() || "Arial, sans-serif";
    const logoSrc = getPreviewImage(logoPreviewContainer);
    const bannerSrc = getPreviewImage(bannerPreviewContainer);
    const faviconSrc = getPreviewImage(faviconPreviewContainer);

    const previewWindow = window.open("", "_blank");
    if (!previewWindow) {
      iziToast.error({ title: "Error", message: "Popup blocked. Please allow popups.", position: "topRight" });
      return;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(name)} - Preview</title>
  ${faviconSrc ? `<link rel="icon" href="${faviconSrc}" />` : ""}
  <style>
    body{margin:0;background:${bgColor};font-family:${fontFamily};color:#111}
    .header{background:${headerColor};color:${textColor};padding:18px 24px;display:flex;align-items:center;gap:12px}
    .header img{width:42px;height:42px;border-radius:50%;object-fit:cover}
    .hero{max-width:1100px;margin:20px auto;padding:0 16px}
    .hero img{width:100%;height:320px;object-fit:cover;border-radius:12px;display:${bannerSrc ? "block" : "none"}}
    .content{max-width:1100px;margin:18px auto;padding:0 16px 24px}
    .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:22px}
    .footer{background:${footerColor};color:${footerTextColor};padding:16px 24px;text-align:center}
  </style>
</head>
<body>
  <div class="header">
    ${logoSrc ? `<img src="${logoSrc}" alt="logo" />` : ""}
    <h2 style="margin:0;">${escapeHtml(heading)}</h2>
  </div>
  <div class="hero">${bannerSrc ? `<img src="${bannerSrc}" alt="banner" />` : ""}</div>
  <div class="content">
    <div class="card">
      <h3 style="margin-top:0;">${escapeHtml(name)}</h3>
      <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(content)}</p>
    </div>
  </div>
  <div class="footer">Footer preview - ${escapeHtml(name)}</div>
</body>
</html>`;

    previewWindow.document.open();
    previewWindow.document.write(html);
    previewWindow.document.close();
  }

  bindFilePreview(logoFileInput, logoPreviewContainer);
  bindFilePreview(bannerFileInput, bannerPreviewContainer);
  bindFilePreview(faviconFileInput, faviconPreviewContainer);
  bindColorPicker(themeHeaderColor, themeHeaderColorPicker, "#111827");
  bindColorPicker(themeTextColor, themeTextColorPicker, "#ffffff");
  bindColorPicker(themeBackgroundColor, themeBackgroundColorPicker, "#ffffff");
  bindColorPicker(themeButtonColor, themeButtonColorPicker, "#2563eb");
  bindColorPicker(themeButtonTextColor, themeButtonTextColorPicker, "#ffffff");
  bindColorPicker(themeFooterColor, themeFooterColorPicker, "#1f2937");
  bindColorPicker(themeFooterTextColor, themeFooterTextColorPicker, "#ffffff");

  [
    nameInput, headingInput, contentInput, themeHeaderColor, themeTextColor, themeBackgroundColor,
    themeButtonColor, themeButtonTextColor, themeFooterColor, themeFooterTextColor, themeFontFamily
  ].forEach((el) => el?.addEventListener("input", updateLivePreview));

  logoFileInput?.addEventListener("change", updateLivePreview);
  bannerFileInput?.addEventListener("change", updateLivePreview);
  openFullPreviewBtn?.addEventListener("click", openFullPreview);

  const isEditMode = mode === "edit" || mode === "update";

  if (isEditMode) {
    if (!idFromQuery) {
      iziToast.error({ title: "Error", message: "Microsite id missing", position: "topRight" });
      return;
    }
    const data = await fetchJson(`${domin}/api/admin/microsite/${idFromQuery}`, { headers: getAuthHeaders() });
    idInput.value = data.id ?? "";
    nameInput.value = data.name ?? "";
    slugInput.value = data.slug ?? "";
    headingInput.value = data.heading ?? "";
    contentInput.value = data.content ?? "";
    addressInput.value = data.address ?? "";
    emailInput.value = data.email ?? "";
    mobileInput.value = data.mobile ?? "";
    startDateInput.value = toDateInputValue(data.startDate);
    endDateInput.value = toDateInputValue(data.endDate);
    domainInput.value = Array.isArray(data.domains) ? data.domains.join(", ") : "";
    if (urlInput) {
      const u = data.url ?? data.Url ?? data.micrositeUrl ?? data.MicrositeUrl ?? data.siteUrl ?? data.SiteUrl;
      urlInput.value = u != null ? String(u).trim() : "";
    }
    statusInput.value = String(Boolean(data.status));
    renderPreviewFromUrl(logoPreviewContainer, data.logoImage);
    renderPreviewFromUrl(bannerPreviewContainer, data.bannerImage);
    renderPreviewFromUrl(faviconPreviewContainer, data.favicon);
    const theme = data.theme || {};
    themeHeaderColor.value = theme.headerColor ?? "";
    if (themeHeaderColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeHeaderColor.value)) themeHeaderColorPicker.value = themeHeaderColor.value;
    themeTextColor.value = theme.textColor ?? "";
    if (themeTextColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeTextColor.value)) themeTextColorPicker.value = themeTextColor.value;
    themeBackgroundColor.value = theme.backgroundColor ?? "";
    if (themeBackgroundColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeBackgroundColor.value)) themeBackgroundColorPicker.value = themeBackgroundColor.value;
    themeButtonColor.value = theme.buttonColor ?? "";
    if (themeButtonColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeButtonColor.value)) themeButtonColorPicker.value = themeButtonColor.value;
    themeButtonTextColor.value = theme.buttonTextColor ?? "";
    if (themeButtonTextColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeButtonTextColor.value)) themeButtonTextColorPicker.value = themeButtonTextColor.value;
    themeFooterColor.value = theme.footerColor ?? "";
    if (themeFooterColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeFooterColor.value)) themeFooterColorPicker.value = themeFooterColor.value;
    themeFooterTextColor.value = theme.footerTextColor ?? "";
    if (themeFooterTextColorPicker && /^#([0-9a-fA-F]{6})$/.test(themeFooterTextColor.value)) themeFooterTextColorPicker.value = themeFooterTextColor.value;
    themeFontFamily.value = theme.fontFamily ?? "";
    const seo = data.seo || {};
    seoMetaTitle.value = seo.metaTitle ?? "";
    seoMetaDescription.value = seo.metaDescription ?? "";
    seoMetaKeywords.value = seo.metaKeywords ?? "";
    seoOgImage.value = seo.ogImage ?? "";
  }

  updateLivePreview();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", nameInput.value.trim());
    formData.append("Slug", slugInput.value.trim());
    formData.append("Heading", headingInput.value.trim());
    formData.append("Content", contentInput.value.trim());
    formData.append("Address", addressInput.value.trim());
    formData.append("Email", emailInput.value.trim());
    formData.append("Mobile", mobileInput.value.trim());
    if (startDateInput.value) formData.append("StartDate", startDateInput.value);
    if (endDateInput.value) formData.append("EndDate", endDateInput.value);
    formData.append("Status", String(statusInput.value === "true"));
    parseDomains(domainInput.value).forEach((d) => formData.append("Domains", d));
    if (urlInput) formData.append("Url", urlInput.value.trim());
    formData.append("ThemeJson", JSON.stringify({
      headerColor: themeHeaderColor?.value?.trim() || "",
      textColor: themeTextColor?.value?.trim() || "",
      backgroundColor: themeBackgroundColor?.value?.trim() || "",
      buttonColor: themeButtonColor?.value?.trim() || "",
      buttonTextColor: themeButtonTextColor?.value?.trim() || "",
      footerColor: themeFooterColor?.value?.trim() || "",
      footerTextColor: themeFooterTextColor?.value?.trim() || "",
      fontFamily: themeFontFamily?.value?.trim() || "",
    }));
    formData.append("SeoJson", JSON.stringify({
      metaTitle: seoMetaTitle?.value?.trim() || "",
      metaDescription: seoMetaDescription?.value?.trim() || "",
      metaKeywords: seoMetaKeywords?.value?.trim() || "",
      ogImage: seoOgImage?.value?.trim() || "",
    }));
    if (logoFileInput?.files?.[0]) formData.append("LogoFile", logoFileInput.files[0]);
    if (bannerFileInput?.files?.[0]) formData.append("BannerFile", bannerFileInput.files[0]);
    if (faviconFileInput?.files?.[0]) formData.append("FaviconFile", faviconFileInput.files[0]);

    try {
      if (isEditMode) {
        await fetchJson(`${domin}/api/admin/update-microsite/${idInput.value}`, { method: "PUT", headers: getAuthHeaders(), body: formData });
      } else {
        await fetchJson(`${domin}/api/admin/create-microsite`, { method: "POST", headers: getAuthHeaders(), body: formData });
      }
      iziToast.success({ title: "Success", message: `Microsite ${isEditMode ? "updated" : "created"} successfully`, position: "topRight" });
      setTimeout(() => (window.location.href = "microsite-list.php"), 900);
    } catch (err) {
      iziToast.error({ title: "Error", message: err.message, position: "topRight" });
    }
  });
}

async function initAssignedProductPage() {
  const form = document.getElementById("assignProductForm");
  const table = document.getElementById("assignedProductTableBody");
  if (!form || !table) return;

  const idInput = document.getElementById("assignId");
  const micrositeIdInput = document.getElementById("assignMicrositeId");
  const productIdInput = document.getElementById("assignProductId");
  const statusInput = document.getElementById("assignStatus");

  async function loadDropdowns() {
    micrositeIdInput.innerHTML = '<option value="">Select Microsite</option>';
    productIdInput.innerHTML = '<option value="">Select Product</option>';

    try {
      const micrositeRes = await fetchJson(`${domin}/api/admin/all-microsite`, { headers: getAuthHeaders() });
      const microsites = Array.isArray(micrositeRes) ? micrositeRes : (micrositeRes.data || []);
      microsites.forEach((m) => {
        const id = m.id || m.Id;
        const name = m.name || m.Name || "Microsite";
        if (!id) return;
        micrositeIdInput.insertAdjacentHTML("beforeend", `<option value="${id}">${name}</option>`);
      });
    } catch (err) {
      console.error("Microsite dropdown load failed:", err);
    }

    try {
      const productRes = await fetchJson(`http://microsite_backend.workarya.com/api/product/getproduct`);
      const products = Array.isArray(productRes) ? productRes : (productRes.data || []);
      products.forEach((p) => {
        const id = p.id || p.Id || p.productId || p.ProductId;
        const name = p.productName || p.ProductName || p.productname || p.name || p.Name || "Product";
        if (!id) return;
        productIdInput.insertAdjacentHTML("beforeend", `<option value="${id}">${name}</option>`);
      });
    } catch (err) {
      console.error("Product dropdown load failed:", err);
      iziToast.error({ title: "Error", message: "Product list load nahi ho payi.", position: "topRight" });
    }
  }

  async function loadRows() {
    const rows = await fetchJson(`${domin}/api/admin/assigned-products`, { headers: getAuthHeaders() });
    table.innerHTML = "";
    rows.forEach((row) => {
      table.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${row.id}</td>
          <td>${row.micrositeName ?? ""}</td>
          <td>${row.product?.name ?? ""}</td>
          <td>${row.assignStatus ? "Active" : "Inactive"}</td>
          <td>
            <div class="list-icon-function">
              <div class="item text-primary" title="Edit" onclick="editAssignRow(${row.id}, ${row.micrositeID}, ${row.product?.productId ?? 0}, ${row.assignStatus ? "true" : "false"})">
                <i class="icon-edit-3"></i>
              </div>
              <div class="item text-danger" title="Delete" onclick="deleteAssignRow(${row.id})">
                <i class="icon-trash-2"></i>
              </div>
            </div>
          </td>
        </tr>`
      );
    });
  }

  window.editAssignRow = (id, micrositeId, productId, status) => {
    idInput.value = id;
    micrositeIdInput.value = micrositeId;
    productIdInput.value = productId;
    statusInput.value = String(status);
  };

  window.deleteAssignRow = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this assignment?");
    if (!confirmed) return;
    await fetchJson(`${domin}/api/admin/assigned-product/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    iziToast.success({ title: "Success", message: "Assignment deleted successfully", position: "topRight" });
    loadRows();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = idInput.value.trim();
    const payload = {
      micrositeId: Number(micrositeIdInput.value),
      productId: Number(productIdInput.value),
      status: statusInput.value === "true",
    };

    if (id) {
      await fetchJson(`${domin}/api/admin/assigned-product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      iziToast.success({ title: "Success", message: "Assignment updated successfully", position: "topRight" });
    } else {
      await fetchJson(`${domin}/api/admin/assign-product`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(payload),
      });
      iziToast.success({ title: "Success", message: "Assignment created successfully", position: "topRight" });
    }
    form.reset();
    idInput.value = "";
    loadRows();
  });

  try {
    await loadDropdowns();
    await loadRows();
  } catch (err) {
    iziToast.error({ title: "Error", message: err.message, position: "topRight" });
  }
}

async function initMicrositeOrdersPage() {
  const form = document.getElementById("micrositeOrderFilterForm");
  const table = document.getElementById("micrositeOrdersTableBody");
  if (!form || !table) return;

  const micrositeIdInput = document.getElementById("orderMicrositeId");

  async function loadOrders() {
    const micrositeId = micrositeIdInput.value.trim();
    if (!micrositeId) return;

    const result = await fetchJson(`${domin}/api/admin/microsite-orders?micrositeId=${micrositeId}`, {
      headers: getAuthHeaders(),
    });

    const rows = result.data || [];
    table.innerHTML = "";
    rows.forEach((row) => {
      table.insertAdjacentHTML(
        "beforeend",
        `<tr>
          <td>${row.id}</td>
          <td>${row.productName ?? ""}</td>
          <td>${row.quantity}</td>
          <td>${row.totalPrice}</td>
          <td>
            <select onchange="updateOrderStatus(${row.id}, ${micrositeId}, this.value)">
              <option value="Placed" ${row.status === "Placed" ? "selected" : ""}>Placed</option>
              <option value="Packed" ${row.status === "Packed" ? "selected" : ""}>Packed</option>
              <option value="Shipped" ${row.status === "Shipped" ? "selected" : ""}>Shipped</option>
              <option value="Delivered" ${row.status === "Delivered" ? "selected" : ""}>Delivered</option>
              <option value="Cancelled" ${row.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
          <td><button class="tf-button style-1" type="button" onclick="deleteOrder(${row.id}, ${micrositeId})">Delete</button></td>
        </tr>`
      );
    });
  }

  window.updateOrderStatus = async (orderId, micrositeId, status) => {
    await fetchJson(`${domin}/api/admin/microsite-orders/${orderId}/status?micrositeId=${micrositeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ status }),
    });
  };

  window.deleteOrder = async (orderId, micrositeId) => {
    await fetchJson(`${domin}/api/admin/microsite-orders/${orderId}?micrositeId=${micrositeId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    loadOrders();
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await loadOrders();
    } catch (err) {
      iziToast.error({ title: "Error", message: err.message, position: "topRight" });
    }
  });
}

<?php include 'include/header.php'; ?>
<div class="main-content">
  <div class="main-content-inner">
    <div class="main-content-wrap">
      <div class="flex items-center flex-wrap justify-between gap20 mb-27">
        <h3>Edit Microsite</h3>
      </div>

      <form id="micrositeCrudForm" class="form-new-product" enctype="multipart/form-data" data-mode="update">
        <input type="hidden" id="micrositeId">
        <div class="new-page-wrap">
          <div class="left">
            <div class="wg-box">
              <fieldset class="name mb-24"><div class="body-title mb-10">Name *</div><input id="micrositeName" type="text" required></fieldset>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half"><div class="body-title mb-10">Slug *</div><input id="micrositeSlug" type="text" required></fieldset>
                <fieldset class="name w-half"><div class="body-title mb-10">Domain (comma separated)</div><input id="micrositeDomain" type="text"></fieldset>
              </div>
              <fieldset class="name mb-24"><div class="body-title mb-10">Microsite URL</div><input id="micrositeUrl" type="url" placeholder="https://example.com/your-microsite"></fieldset>
              <fieldset class="name mb-24"><div class="body-title mb-10">Heading</div><input id="micrositeHeading" type="text"></fieldset>
              <fieldset class="description mb-24"><div class="body-title mb-10">Content</div><textarea id="micrositeContent"></textarea></fieldset>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half"><div class="body-title mb-10">Address</div><input id="micrositeAddress" type="text"></fieldset>
                <fieldset class="name w-half"><div class="body-title mb-10">Email</div><input id="micrositeEmail" type="email"></fieldset>
              </div>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half"><div class="body-title mb-10">Mobile</div><input id="micrositeMobile" type="text"></fieldset>
                <fieldset class="name w-half"><div class="body-title mb-10">Status</div><div class="select"><select id="micrositeStatus"><option value="true">Active</option><option value="false">Inactive</option></select></div></fieldset>
              </div>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half"><div class="body-title mb-10">Start Date</div><input id="micrositeStartDate" type="date"></fieldset>
                <fieldset class="name w-half"><div class="body-title mb-10">End Date</div><input id="micrositeEndDate" type="date"></fieldset>
              </div>
            </div>
            <div class="wg-box mt-20">
              <div class="body-title mb-10">Theme</div>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeHeaderColor" type="text" placeholder="Header Color">
                    <input id="themeHeaderColorPicker" type="color" value="#111827" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeTextColor" type="text" placeholder="Text Color">
                    <input id="themeTextColorPicker" type="color" value="#ffffff" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
              </div>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeBackgroundColor" type="text" placeholder="Background Color">
                    <input id="themeBackgroundColorPicker" type="color" value="#ffffff" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeButtonColor" type="text" placeholder="Button Color">
                    <input id="themeButtonColorPicker" type="color" value="#2563eb" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
              </div>
              <div class="flex gap24 mb-24">
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeButtonTextColor" type="text" placeholder="Button Text Color">
                    <input id="themeButtonTextColorPicker" type="color" value="#ffffff" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeFooterColor" type="text" placeholder="Footer Color">
                    <input id="themeFooterColorPicker" type="color" value="#1f2937" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
              </div>
              <div class="flex gap24">
                <fieldset class="name w-half">
                  <div class="flex gap10">
                    <input id="themeFooterTextColor" type="text" placeholder="Footer Text Color">
                    <input id="themeFooterTextColorPicker" type="color" value="#ffffff" style="width:56px;padding:6px;">
                  </div>
                </fieldset>
                <fieldset class="name w-half"><input id="themeFontFamily" type="text" placeholder="Font Family"></fieldset>
              </div>
            </div>
            <div class="wg-box mt-20">
              <div class="body-title mb-10">SEO</div>
              <fieldset class="name mb-24"><input id="seoMetaTitle" type="text" placeholder="Meta Title"></fieldset>
              <fieldset class="description mb-24"><textarea id="seoMetaDescription" placeholder="Meta Description"></textarea></fieldset>
              <fieldset class="name mb-24"><input id="seoMetaKeywords" type="text" placeholder="Meta Keywords"></fieldset>
              <fieldset class="name"><input id="seoOgImage" type="text" placeholder="OG Image URL"></fieldset>
            </div>
          </div>

          <div class="right">
            <div class="wg-box">
              <div class="body-title mb-10">Publish</div>
              <div class="flex gap10">
                <button id="openFullPreviewBtn" class="tf-button style-1 w-full" type="button">Preview</button>
                <button class="tf-button w-full" type="submit">Save Microsite</button>
              </div>
            </div>
            <div class="wg-box"><div class="body-title mb-10">Logo</div><div class="upload-image style-1 mb-16" id="logo-preview-container"><div class="item up-load"><label class="uploadfile" for="micrositeLogoFile"><div class="icon"><i class="icon-upload-cloud"></i></div><span class="text-tiny">Click to browse</span><input type="file" id="micrositeLogoFile" accept="image/*"></label></div></div></div>
            <div class="wg-box"><div class="body-title mb-10">Banner</div><div class="upload-image style-1 mb-16" id="banner-preview-container"><div class="item up-load"><label class="uploadfile" for="micrositeBannerFile"><div class="icon"><i class="icon-upload-cloud"></i></div><span class="text-tiny">Click to browse</span><input type="file" id="micrositeBannerFile" accept="image/*"></label></div></div></div>
            <div class="wg-box"><div class="body-title mb-10">Favicon</div><div class="upload-image style-1 mb-16" id="favicon-preview-container"><div class="item up-load"><label class="uploadfile" for="micrositeFaviconFile"><div class="icon"><i class="icon-upload-cloud"></i></div><span class="text-tiny">Click to browse</span><input type="file" id="micrositeFaviconFile" accept="image/*"></label></div></div></div>
            <div class="wg-box">
              <div class="body-title mb-10">Live Preview</div>
              <div id="micrositeLivePreview" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;background:#fff;">
                <div id="previewHeader" style="padding:14px;background:#111827;color:#fff;">
                  <div style="display:flex;align-items:center;gap:10px;">
                    <img id="previewLogo" src="" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover;display:none;">
                    <div id="previewHeadingText" style="font-weight:600;">Microsite Heading</div>
                  </div>
                </div>
                <div id="previewBody" style="padding:14px;">
                  <img id="previewBanner" src="" alt="" style="width:100%;height:120px;object-fit:cover;border-radius:8px;display:none;">
                  <div id="previewContentText" style="margin-top:10px;color:#111827;">Microsite content preview will appear here.</div>
                </div>
                <div id="previewFooter" style="padding:10px;background:#1f2937;color:#fff;font-size:12px;">Footer preview</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
<?php include 'include/footer.php'; ?>

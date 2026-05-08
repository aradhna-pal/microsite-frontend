
// const domin = "http://microsite_backend.workarya.com";

document.addEventListener("DOMContentLoaded", async function () {

  const api = `${domin}/api/variant/getvariant`;
  const tableBody = document.getElementById("variantTableBody");

  try {
    const res = await fetch(api);
    const variants = await res.json();

    tableBody.innerHTML = "";

    variants.forEach((item, index) => {

      const imageUrl = item.image
        ? `${item.image}`
        : "https://via.placeholder.com/60x60?text=No+Image";

      const statusBadge = item.isActive
        ? `<span class="badge bg-success">Active</span>`
        : `<span class="badge bg-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center gap20" style="white-space: nowrap;">

          <div style="flex:0 0 60px; max-width:60px;" class="body-text">
            ${index + 1}
          </div>

          <div style="flex:0 0 80px;">
            <img src="${imageUrl}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
          </div>

          <div style="flex:0 0 150px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="${item.variantName ?? ''}">
            ${item.variantName ?? '-'}
          </div>

          <div style="flex:0 0 80px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="₹ ${item.price}">
            ₹ ${item.price}
          </div>

          <div style="flex:0 0 100px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="₹ ${item.discountPrice}">
            ₹ ${item.discountPrice}
          </div>

          <div style="flex:0 0 80px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="${item.stock}">
            ${item.stock}
          </div>

          <div style="flex:0 0 120px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="${item.sku ?? ''}">
            ${item.sku ?? '-'}
          </div>

          <div style="flex:0 0 100px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="${item.sizeNames ?? ''}">
            ${item.sizeNames ?? '-'}
          </div>

          <div style="flex:0 0 100px; overflow: hidden; text-overflow: ellipsis;" class="body-text" title="${item.colorNames ?? ''}">
            ${item.colorNames ?? '-'}
          </div>

          <div style="flex:0 0 80px;">
            ${statusBadge}
          </div>

          <div style="flex:0 0 60px;" class="list-icon-function">
            <div class="item text-primary" onclick="editVariant(${item.id})">
              <i class="icon-edit-3"></i>
            </div>
          </div>

          <div style="flex:0 0 60px;" class="list-icon-function">
            <div class="item text-danger" onclick="deleteVariant(${item.id})">
              <i class="icon-trash-2"></i>
            </div>
          </div>

        </li>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (err) {
    console.error("Variant load error:", err);
  }
});





// const domin = "http://microsite_backend.workarya.com";

async function deleteVariant(id) {

  const token = localStorage.getItem("authToken");
  if (!token) {
    iziToast.error({
      title: 'Unauthorized',
      message: 'Please login again',
      position: 'topRight'
    });
    return;
  }

  iziToast.question({
    timeout: false,
    close: false,
    overlay: true,
    displayMode: 'once',
    title: 'Confirm',
    message: 'Delete this variant?',
    position: 'center',
    buttons: [
      ['<button><b>YES</b></button>', async function (instance, toast) {

        instance.hide({ transitionOut: 'fadeOut' }, toast);

        try {
          const res = await fetch(`${domin}/api/variant/deletevariant/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (res.ok) {
            iziToast.success({
              title: 'Deleted',
              message: 'Variant deleted successfully',
              position: 'topRight'
            });
            setTimeout(() => location.reload(), 1200);
          } else {
            const msg = await res.text();
            iziToast.error({
              title: 'Error',
              message: msg || 'Delete failed',
              position: 'topRight'
            });
          }

        } catch (err) {
          iziToast.error({
            title: 'Error',
            message: 'Something went wrong',
            position: 'topRight'
          });
          console.error(err);
        }

      }, true],

      ['<button>NO</button>', function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast);
      }]
    ]
  });

}



// =====================================================================================
//                                   ADD VARIANT
// =====================================================================================

document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addVariantForm");
  
  if (addForm) {
    // Load Dropdowns for the Add Variant Page
    loadProductsForVariant();
    loadSizesForVariant();
    loadColorsForVariant();

    // Handle Form Submission
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("authToken");
      if (!token) {
        iziToast.error({ title: 'Error', message: 'User not authenticated', position: 'topRight' });
        return;
      }

      const formData = new FormData(addForm);

      // Map HTML names to API required keys
      if (formData.has('prodcutid')) {
        formData.set('ProductId', formData.get('prodcutid'));
        formData.delete('prodcutid');
      }
      
      if (formData.has('DiscountPrice')) {
        formData.set('discountprice', formData.get('DiscountPrice'));
        formData.delete('DiscountPrice');
      }

      // Handle multiple gallery files properly
      const galleryFiles = formData.getAll('GalleryFiles[]');
      formData.delete('GalleryFiles[]'); 
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          if (file.size > 0) {
            formData.append('GalleryFiles', file);
          }
        });
      }

      try {
        const res = await fetch(`${domin}/api/variant/addvariant`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        });

        const result = await res.json();

        if (res.ok) {
          iziToast.success({ title: 'Success', message: result.message || 'Variant added successfully', position: 'topRight' });
          addForm.reset();
          setTimeout(() => { window.location.href = "variant-list.php"; }, 1500);
        } else {
          iziToast.error({ title: 'Error', message: result.message || 'Failed to add variant', position: 'topRight' });
        }
      } catch (err) {
        console.error("Add Variant Error:", err);
        iziToast.error({ title: 'Error', message: 'Server error occurred', position: 'topRight' });
      }
    });
  }
});

// --- Dropdown Fetch Functions ---
async function loadProductsForVariant() {
  try {
    const res = await fetch(`${domin}/api/product/getproduct`);
    let data = await res.json();
    const dropdown = document.getElementById("prodcutid");
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select Product</option>';
    data.forEach(p => {
      dropdown.insertAdjacentHTML('beforeend', `<option value="${p.id}">${p.productName}</option>`);
    });
  } catch (err) { console.error("Error loading products:", err); }
}

async function loadSizesForVariant() {
  try {
    const res = await fetch(`${domin}/api/admin/getsize`);
    let data = await res.json();
    const dropdown = document.getElementById("SizeId");
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select Size</option>';
    data.forEach(s => {
      // Only show active sizes
      if (s.isActive === true || s.isActive === "true" || s.isActive === 1) {
        dropdown.insertAdjacentHTML('beforeend', `<option value="${s.id}">${s.sizeName}</option>`);
      }
    });
  } catch (err) { console.error("Error loading sizes:", err); }
}

async function loadColorsForVariant() {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${domin}/api/admin/getcolor`, { headers: { "Authorization": `Bearer ${token}` } });
    let data = await res.json();
    const dropdown = document.getElementById("ColorId");
    if (!dropdown) return;
    
    dropdown.innerHTML = '<option value="">Select Color</option>';
    data.forEach(c => {
      const isActive = c.isactive !== undefined ? c.isactive : (c.IsActive !== undefined ? c.IsActive : c.isActive);
      if (isActive === true || isActive === "true" || isActive === 1) {
        dropdown.insertAdjacentHTML('beforeend', `<option value="${c.id}">${c.colorname}</option>`);
      }
    });
  } catch (err) { console.error("Error loading colors:", err); }
}

// =====================================================================================
//                                   EDIT VARIANT
// =====================================================================================


function editVariant(id) {
  window.location.href = `edit-variant.php?id=${id}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const editForm = document.getElementById("editVariantForm");
  if (!editForm) return; // Only run on the Edit Variant page

  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  // 1. Load dropdowns first
  await Promise.all([
    loadProductsForVariant(),
    loadSizesForVariant(),
    loadColorsForVariant()
  ]);

  // 2. Prefill data
  await prefillVariantData(id);

  // 3. Handle Update Submit
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      iziToast.error({ title: 'Error', message: 'User not authenticated', position: 'topRight' });
      return;
    }

    const formData = new FormData(editForm);

    // Map HTML names to API required keys
    if (formData.has('prodcutid')) {
      formData.set('ProductId', formData.get('prodcutid'));
      formData.delete('prodcutid');
    }
    
    if (formData.has('DiscountPrice')) {
      formData.set('discountprice', formData.get('DiscountPrice'));
      formData.delete('DiscountPrice');
    }

    // Prevent sending an empty file if the user didn't select a new main image
    const mainImg = formData.get('ImageFile');
    if (mainImg && mainImg.size === 0) {
      formData.delete('ImageFile');
    }

    // Process gallery files
    const galleryFiles = formData.getAll('GalleryFiles[]');
    formData.delete('GalleryFiles[]'); 
    if (galleryFiles.length > 0) {
      galleryFiles.forEach(file => {
        if (file.size > 0) {
          formData.append('GalleryFiles', file);
        }
      });
    }

    try {
      const res = await fetch(`${domin}/api/variant/updatevariant/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const result = await res.json();

      if (res.ok) {
        iziToast.success({ title: 'Success', message: result.message || 'Variant updated successfully', position: 'topRight' });
        setTimeout(() => { window.location.href = "variant-list.php"; }, 1500);
      } else {
        iziToast.error({ title: 'Error', message: result.message || 'Failed to update variant', position: 'topRight' });
      }
    } catch (err) {
      console.error("Edit Variant Error:", err);
      iziToast.error({ title: 'Error', message: 'Server error occurred', position: 'topRight' });
    }
  });
});

// --- Prefill Function ---
async function prefillVariantData(id) {
  try {
    const res = await fetch(`${domin}/api/variant/getvariant`);
    if (!res.ok) throw new Error("Failed to fetch variants");
    
    const variants = await res.json();
    const variant = variants.find(v => String(v.id) === String(id));

    if (!variant) {
      iziToast.error({ title: "Error", message: "Variant not found", position: "topRight" });
      return;
    }

    document.querySelector('[name="VariantName"]').value = variant.variantName || "";
    document.querySelector('[name="Sku"]').value = variant.sku || "";
    document.querySelector('[name="Stock"]').value = variant.stock || "";
    document.querySelector('[name="Price"]').value = variant.price || "";
    
    const dpEl = document.querySelector('[name="DiscountPrice"]');
    if (dpEl) dpEl.value = variant.discountPrice || "";

    const isActiveSelect = document.querySelector('[name="IsActive"]');
    if (isActiveSelect) isActiveSelect.value = (variant.isActive === true || variant.isActive === "true" || variant.isActive === 1) ? "true" : "false";

    // Dropdowns
    if (variant.productId) { const prodEl = document.getElementById("prodcutid"); if (prodEl) prodEl.value = variant.productId; }
    
    // Color and Size Drops - Checking array vs scalar mapping format
    const sizeEl = document.getElementById("SizeId");
    if (sizeEl) {
      if (variant.sizeIds && variant.sizeIds.length > 0) sizeEl.value = variant.sizeIds[0];
      else if (variant.sizeId) sizeEl.value = variant.sizeId;
    }

    const colorEl = document.getElementById("ColorId");
    if (colorEl) {
      if (variant.colorIds && variant.colorIds.length > 0) colorEl.value = variant.colorIds[0];
      else if (variant.colorId) colorEl.value = variant.colorId;
    }

    // Main Image Handling
    const imageInput = document.getElementById("ImageFile");
    if (imageInput) imageInput.removeAttribute("required"); // Don't force image upload on edit

    if (variant.image) {
      const mainImgContainer = document.getElementById("main-image-container");
      if (mainImgContainer) {
        const preview = document.createElement("div");
        preview.className = "item preview-item";
        preview.innerHTML = `<img src="${variant.image}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">`;
        mainImgContainer.insertAdjacentElement('afterbegin', preview);
      }
    }
  } catch (err) {
    console.error("Prefill Error: ", err);
  }
}



// ===================== edit variant =============================

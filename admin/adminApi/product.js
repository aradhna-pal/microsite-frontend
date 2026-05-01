document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-add-product");
    if (form) {
        // Load Dropdowns
        loadProductCategories();
        loadProductSubCategories();
        loadProductChildCategories();
        loadProductBrands();
        loadProductSizes();
        loadProductColors();

        // Cascading Dropdowns Logic
        document.getElementById("CategoryId").addEventListener("change", function (e) {
            const selectedCat = e.target.value;
            const subCatDropdown = document.getElementById("SubCategoryId");
            const childCatDropdown = document.getElementById("ChildCategoryId");

            if (subCatDropdown) {
                subCatDropdown.value = "";
                Array.from(subCatDropdown.options).forEach(opt => {
                    if (opt.value === "") return;
                    opt.style.display = opt.getAttribute("data-category") === selectedCat ? "" : "none";
                });
            }
            if (childCatDropdown) {
                childCatDropdown.value = "";
                Array.from(childCatDropdown.options).forEach(opt => {
                    if (opt.value === "") return;
                    opt.style.display = "none";
                });
            }
        });

        document.getElementById("SubCategoryId").addEventListener("change", function (e) {
            const selectedSubCat = e.target.value;
            const childCatDropdown = document.getElementById("ChildCategoryId");
            
            if (childCatDropdown) {
                childCatDropdown.value = "";
                Array.from(childCatDropdown.options).forEach(opt => {
                    if (opt.value === "") return;
                    opt.style.display = opt.getAttribute("data-subcategory") === selectedSubCat ? "" : "none";
                });
            }
        });

        // Form Submit Logic for Add Product
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("authToken");
            if (!token) {
                iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
                return;
            }

            // Sync TinyMCE content into the underlying textarea
            if (typeof tinymce !== 'undefined') {
                tinymce.triggerSave();
            }

            const formData = new FormData(form);

            // Adjust keys to match backend API payload requirements
            if (formData.has('SizeId')) {
                formData.set('SizeIds', formData.get('SizeId'));
                formData.delete('SizeId');
            }
            if (formData.has('ColorId')) {
                formData.set('ColorIds', formData.get('ColorId'));
                formData.delete('ColorId');
            }
            
            const galleryFiles = formData.getAll('GalleryFiles[]');
            if (galleryFiles.length > 0) {
                galleryFiles.forEach(file => formData.append('GalleryFiles', file));
                formData.delete('GalleryFiles[]');
            }

            try {
                const response = await fetch(`${domin}/api/product/addproduct`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData
                });

                const result = await response.json();

                if (response.ok) {
                    iziToast.success({ title: "Success", message: result.message || "Product added successfully", position: "topRight" });
                    // setTimeout(() => { window.location.href = "product-list.php"; }, 1500);
                } else {
                    iziToast.error({ title: "Error", message: result.message || "Failed to add product", position: "topRight" });
                }
            } catch (error) {
                console.error(error);
                iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
            }
        });
    }
});

// --- Dropdown Fetch Functions ---
async function loadProductCategories() {
    try {
        const res = await fetch(`${domin}/api/category/get`);
        let data = await res.json();
        const dropdown = document.getElementById("CategoryId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Category</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(cat => {
            const id = cat.id || cat._id || cat.Id;
            const status = cat.status !== undefined ? cat.status : cat.Status;
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${cat.name || cat.Name}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductSubCategories() {
    try {
        const res = await fetch(`${domin}/api/subcategory/get`);
        let data = await res.json();
        const dropdown = document.getElementById("SubCategoryId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Sub Category</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(sub => {
            const id = sub.id || sub._id || sub.Id;
            const status = sub.status !== undefined ? sub.status : sub.Status;
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                const opt = document.createElement("option");
                opt.value = id;
                opt.textContent = sub.subCategoryName || sub.SubCategoryName || sub.name || "";
                opt.setAttribute("data-category", sub.categoryId || sub.CategoryId);
                opt.style.display = "none";
                dropdown.appendChild(opt);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductChildCategories() {
    try {
        const res = await fetch(`${domin}/api/childcategory/get`);
        let data = await res.json();
        const dropdown = document.getElementById("ChildCategoryId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Child Category</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(child => {
            const id = child.id || child._id || child.Id;
            const status = child.status !== undefined ? child.status : child.Status;
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                const opt = document.createElement("option");
                opt.value = id;
                opt.textContent = child.childCategoryName || child.ChildCategoryName || child.name || "";
                opt.setAttribute("data-subcategory", child.subCategoryId || child.SubCategoryId);
                opt.style.display = "none";
                dropdown.appendChild(opt);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductBrands() {
    try {
        const res = await fetch(`${domin}/api/admin/getbrand`);
        let data = await res.json();
        const dropdown = document.getElementById("BrandId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Brand</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(brand => {
            const id = brand.id || brand.Id;
            const status = brand.isActive !== undefined ? brand.isActive : (brand.IsActive !== undefined ? brand.IsActive : brand.isactive);
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${brand.brandName || brand.BrandName}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductSizes() {
    try {
        const res = await fetch(`${domin}/api/admin/getsize`);
        let data = await res.json();
        const dropdown = document.getElementById("SizeId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Size</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(size => {
            const id = size.id || size.Id;
            const status = size.isActive !== undefined ? size.isActive : (size.IsActive !== undefined ? size.IsActive : size.isactive);
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${size.sizeName || size.SizeName}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}

async function loadProductColors() {
    try {
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${domin}/api/admin/getcolor`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        let data = await res.json();
        const dropdown = document.getElementById("ColorId");
        if (!dropdown) return;
        dropdown.innerHTML = '<option value="">Select Color</option>';
        
        data = Array.isArray(data) ? data : (data.data || []);
        const addedIds = new Set();
        data.forEach(color => {
            const id = color.id || color.Id;
            const status = color.isactive !== undefined ? color.isactive : (color.IsActive !== undefined ? color.IsActive : color.isActive);
            if (!addedIds.has(id) && (status === true || status === 1 || String(status) === "true")) {
                addedIds.add(id);
                dropdown.insertAdjacentHTML('beforeend', `<option value="${id}">${color.colorname || color.ColorName}</option>`);
            }
        });
    } catch (err) { console.error(err); }
}


// get api






// const domin = "http://microsite_backend.workarya.com";

document.addEventListener("DOMContentLoaded", async function () {

  const api = `${domin}/api/product/getproduct`;
  const tableBody = document.getElementById("productTableBody");

  try {
    const res = await fetch(api);
    const products = await res.json();

    tableBody.innerHTML = "";

    products.forEach((item, index) => {

      const imageUrl = item.image 
        ? `${item.image}` 
        : "https://via.placeholder.com/60x60?text=No+Image";

      const statusBadge = item.isActive
        ? `<span class="badge bg-success">Active</span>`
        : `<span class="badge bg-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center gap20">

          <div style="flex:0 0 60px; max-width:60px;" class="body-text">
            ${index + 1}
          </div>

          <div style="flex: 0 0 80px;">
            <img src="${imageUrl}" style="width:60px;height:60px;object-fit:cover;border-radius:6px;">
          </div>

          <div style="flex: 0 0 150px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.productName ?? '-'}</div>
          <div style="flex: 0 0 150px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.shortDescription ?? '-'}</div>
          <div style="flex: 0 0 200px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.description ?? '-'}</div>
          <div style="flex: 0 0 80px;" class="body-text">₹ ${item.price}</div>
          <div style="flex: 0 0 100px;" class="body-text">₹ ${item.discountPrice}</div>
          <div style="flex: 0 0 80px;" class="body-text">${item.stock}</div>

          <div style="flex: 0 0 120px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.categoryName ?? '-'}</div>
          <div style="flex: 0 0 120px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.subCategoryName ?? '-'}</div>
          <div style="flex: 0 0 120px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.childCategoryName ?? '-'}</div>

          <div style="flex: 0 0 100px; overflow: hidden; text-overflow: ellipsis;" class="body-text">${item.brandName ?? '-'}</div>

          <div style="flex: 0 0 100px; overflow: hidden; text-overflow: ellipsis;" class="body-text">
            ${item.sizeNames?.join(", ") ?? '-'}
          </div>

          <div style="flex: 0 0 100px; overflow: hidden; text-overflow: ellipsis;" class="body-text">
            ${item.colorNames?.join(", ") ?? '-'}
          </div>

          <div style="flex: 0 0 80px;">${statusBadge}</div>

          <div style="flex: 0 0 60px;" class="list-icon-function">
            <div class="item text-primary" onclick="editProduct(${item.id})">
              <i class="icon-edit-3"></i>
            </div>
          </div>

          <div style="flex: 0 0 60px;" class="list-icon-function">
            <div class="item text-danger" onclick="deleteProduct(${item.id})">
              <i class="icon-trash-2"></i>
            </div>
          </div>

        </li>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (err) {
    console.error("Error loading products:", err);
  }
});

function editProduct(id) {
  window.location.href = `edit-product.php?id=${id}`;
}


// const domin = "http://microsite_backend.workarya.com";



async function deleteProduct(id) {

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
    message: 'Are you sure you want to delete this product?',
    position: 'center',
    buttons: [
      ['<button><b>YES</b></button>', async function (instance, toast) {

        instance.hide({ transitionOut: 'fadeOut' }, toast);

        try {
          const res = await fetch(`${domin}/api/product/deleteproduct/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (res.ok) {
            iziToast.success({
              title: 'Deleted',
              message: 'Product deleted successfully',
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





// ==========================================
//          EDIT PRODUCT LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", async () => {
    const editForm = document.getElementById("editproduct");
    if (!editForm) return; // Only execute on the edit page

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return;

    // 1. Load Dropdowns first so they are ready before prefilling
    await Promise.all([
        loadProductCategories(),
        loadProductSubCategories(),
        loadProductChildCategories(),
        loadProductBrands(),
        loadProductSizes(),
        loadProductColors()
    ]);

    // 2. Prefill Data
    await prefillProductData(id);

    // 3. Handle Form Submission for Update
    editForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("authToken");
        if (!token) {
            iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
            return;
        }

        if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
            tinymce.triggerSave();
        }

        const formData = new FormData(editForm);

        if (formData.has('SizeId')) {
            formData.set('SizeIds', formData.get('SizeId'));
            formData.delete('SizeId');
        }
        if (formData.has('ColorId')) {
            formData.set('ColorIds', formData.get('ColorId'));
            formData.delete('ColorId');
        }
        
        const galleryFiles = formData.getAll('GalleryFiles[]');
        formData.delete('GalleryFiles[]');
        if (galleryFiles.length > 0) {
            galleryFiles.forEach(file => {
                if (file.size > 0) {
                    formData.append('GalleryFiles', file);
                }
            });
        }
        
        const mainImg = formData.get('ImageFile');
        if (mainImg && mainImg.size === 0) {
            formData.delete('ImageFile'); // Do not send empty file if not updated
        }

        try {
            const response = await fetch(`${domin}/api/product/updateproduct/${id}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                iziToast.success({ title: "Success", message: result.message || "Product updated successfully", position: "topRight" });
                setTimeout(() => { window.location.href = "product-list.php"; }, 1500);
            } else {
                iziToast.error({ title: "Error", message: result.message || "Failed to update product", position: "topRight" });
            }
        } catch (error) {
            console.error(error);
            iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
        }
    });
});

async function prefillProductData(id) {
    try {
        const res = await fetch(`${domin}/api/product/getproduct`);
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const products = await res.json();
        const product = products.find(p => String(p.id) === String(id));

        if (!product) {
            iziToast.error({ title: "Error", message: "Product not found", position: "topRight" });
            return;
        }

        document.querySelector('[name="ProductName"]').value = product.productName || "";
        document.querySelector('[name="Sku"]').value = product.sku || "";
        document.querySelector('[name="Stock"]').value = product.stock || "";
        document.querySelector('[name="Price"]').value = product.price || "";
        
        const dpEl = document.querySelector('[name="DiscountPrice"]');
        if (dpEl) dpEl.value = product.discountPrice || "";
        
        const sdEl = document.querySelector('[name="ShortDescription"]');
        if (sdEl) sdEl.value = product.shortDescription || "";
        
        const descEl = document.querySelector('[name="Description"]');
        if (descEl) descEl.value = product.description || "";
        
        setTimeout(() => {
            if (typeof tinymce !== 'undefined' && tinymce.activeEditor) {
                tinymce.activeEditor.setContent(product.description || "");
            }
        }, 500);

        const isActiveSelect = document.querySelector('[name="IsActive"]');
        if (isActiveSelect) isActiveSelect.value = (product.isActive === true || product.isActive === "true" || product.isActive === 1) ? "true" : "false";

        if (product.categoryId) { const catEl = document.getElementById("CategoryId"); if (catEl) { catEl.value = product.categoryId; catEl.dispatchEvent(new Event("change")); } }
        if (product.subCategoryId) { const subCatEl = document.getElementById("SubCategoryId"); if (subCatEl) { subCatEl.value = product.subCategoryId; subCatEl.dispatchEvent(new Event("change")); } }
        if (product.childCategoryId) { const childCatEl = document.getElementById("ChildCategoryId"); if (childCatEl) childCatEl.value = product.childCategoryId; }
        if (product.brandId) { const brandEl = document.getElementById("BrandId"); if (brandEl) brandEl.value = product.brandId; }
        if (product.sizeIds && product.sizeIds.length > 0) { const sizeEl = document.getElementById("SizeId"); if (sizeEl) sizeEl.value = product.sizeIds[0]; } else if (product.sizeId) { const sizeEl = document.getElementById("SizeId"); if (sizeEl) sizeEl.value = product.sizeId; }
        if (product.colorIds && product.colorIds.length > 0) { const colorEl = document.getElementById("ColorId"); if (colorEl) colorEl.value = product.colorIds[0]; } else if (product.colorId) { const colorEl = document.getElementById("ColorId"); if (colorEl) colorEl.value = product.colorId; }

        const imageInput = document.getElementById("ImageFile");
        if (imageInput) imageInput.removeAttribute("required");

        if (product.image) {
            const mainImgContainer = document.getElementById("main-image-container");
            if (mainImgContainer) {
                const preview = document.createElement("img");
                preview.src =  product.image;
                preview.style.cssText = "width:80px;height:80px;object-fit:cover;border-radius:8px;margin-top:10px;";
                mainImgContainer.appendChild(preview);
            }
        }
    } catch (err) {
        console.error("Prefill Error: ", err);
    }
}
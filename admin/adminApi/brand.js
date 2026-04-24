// const domin = "http://microsite_backend.workarya.com/";

document.addEventListener("DOMContentLoaded", loadBrands);

async function loadBrands() {
  const tableBody = document.getElementById("brandTableBody");
  if (!tableBody) return;

  try {
    const res = await fetch(`${domin}/api/admin/getbrand`);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach((item, index) => {
      const statusBadge = item.isActive
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const imgPath = item.brandImage.startsWith("/")
        ? `${domin}${item.brandImage}`
        : `${domin}/${item.brandImage}`;

      const row = `
        <li class="attribute-item flex items-center justify-between gap20">
          
          <div class="body-text" style="flex:0 0 60px; max-width:60px;">
            ${index + 1}
          </div>

          <div class="name">
            <img src="${imgPath}" 
                 style="width:40px;height:40px;object-fit:contain;" />
          </div>

          <div class="body-title-2">
            ${item.brandName}
          </div>

          <div class="body-text">
            ${statusBadge}
          </div>

          <div class="list-icon-function">
            <div class="item text-primary" onclick="editBrand(${item.id})">
              <i class="icon-edit-3"></i>
            </div>
          </div>

          <div class="list-icon-function">
            <div class="item text-danger" onclick="deleteBrand(${item.id})">
              <i class="icon-trash-2"></i>
            </div>
          </div>

        </li>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (err) {
    console.error("Brand load error:", err);
  }
}

// ================= EDIT =================
function editBrand(id) {
  window.location.href = `edit-brand.php?id=${id}`;
}

// ================= DELETE =================
async function deleteBrand(id) {
  const token = localStorage.getItem("authToken");

  iziToast.question({
    timeout: false,
    overlay: true,
    displayMode: 'once',
    title: 'Confirm',
    message: 'Delete this brand?',
    position: 'center',
    buttons: [
      ['<button><b>Yes</b></button>', async function (instance, toast) {

        instance.hide({}, toast);

        const res = await fetch(`${domin}/api/admin/deletebrand/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          iziToast.success({
            title: "Deleted",
            message: "Brand deleted successfully",
            position: "topRight"
          });

          loadBrands();
        }

      }, true],
      ['<button>No</button>', function (instance, toast) {
        instance.hide({}, toast);
      }]
    ]
  });
}

// ========================== end delete ==========================


// ========================== add brand ===========================





document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newBrandForm");
  if (!form) return; // Exit silently if we are not on the "Add Brand" page

  form.addEventListener("submit", async function (e) {
    e.preventDefault(); // Stop standard form submission completely

    const token = localStorage.getItem("authToken");
    if (!token) {
      iziToast.error({ title: "Error", message: "Login required", position: "topRight" });
      return;
    }

    const brandName = form.querySelector('input[name="text"]').value.trim();
    const fileInput = document.getElementById("myFile");
    const statusToggle = document.getElementById("statusToggle");
    const isActive = statusToggle ? statusToggle.checked : false;

    if (!brandName) {
      iziToast.error({ title: "Error", message: "Brand name required", position: "topRight" });
      return;
    }

    if (!fileInput || !fileInput.files[0]) {
      iziToast.error({ title: "Error", message: "Please upload an image", position: "topRight" });
      return;
    }

    const formData = new FormData();
    formData.append("BrandName", brandName);
    formData.append("ImageFile", fileInput.files[0]);
    formData.append("IsActive", isActive ? "true" : "false");

    try {
      const res = await fetch(`${domin}/api/admin/addbrand`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      // Catch PHP/HTML errors before parsing JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await res.text();
        console.error("Backend Error (Not JSON):", errorText);
        throw new Error("Backend did not return JSON. Check browser console.");
      }

      const data = await res.json();

      if (res.ok && data.status !== false) {
        iziToast.success({ title: "Success", message: data.message || "Brand added successfully", position: "topRight" });
        setTimeout(() => {
          window.location.href = "brand-list.php";
        }, 1000);
      } else {
        iziToast.error({ title: "Error", message: data.message || "Failed to add brand", position: "topRight" });
      }

    } catch (err) {
      console.error("Catch Error:", err.message);
      iziToast.error({ title: "Error", message: err.message || "Server error occurred", position: "topRight" });
    }
  });
});


// ========================== end add brand ===========================



// ========================== edit brand ===========================

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const res = await fetch(`${domin}/api/admin/getbrand`);
    const brands = await res.json();
    const item = brands.find(b => b.id == id);
    if (!item) return;

    // Fill fields
    document.querySelector('input[name="text"]').value = item.brandName;
    document.getElementById("statusToggle").checked = item.isActive;

    // Show existing image preview
    const preview = document.getElementById("imagePreview");
    const icon = document.getElementById("uploadIcon");
    const text = document.getElementById("uploadText");

    preview.src = `${domin}${item.brandImage}`;
    preview.style.display = "block";
    icon.style.display = "none";
    text.style.display = "none";

  } catch (err) {
    console.error("Load brand error:", err);
  }
});




document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editBrandForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("authToken");

    if (!id || !token) {
      iziToast.error({
        title: "Error",
        message: "Missing ID or token",
        position: "topRight"
      });
      return;
    }

    const formData = new FormData();

    // exact keys required by API
    formData.append(
      "BrandName",
      form.querySelector('input[name="text"]').value.trim()
    );

    formData.append(
      "IsActive",
      document.getElementById("statusToggle").checked ? "true" : "false"
    );

    const fileInput = document.getElementById("myFile");
    if (fileInput && fileInput.files[0]) {
      formData.append("ImageFile", fileInput.files[0]);
    } else {
      // ✅ Append an empty string so the backend doesn't crash looking for a missing key
      formData.append("ImageFile", "");
    }

    try {
      const res = await fetch(`${domin}/api/admin/editbrand/${id}`, {
        method: "PUT",   // IMPORTANT
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      // ✅ Catch PHP/HTML errors before parsing JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const errorText = await res.text();
        console.error("Backend Error (Not JSON):", errorText);
        throw new Error("Backend did not return JSON. Check browser console.");
      }

      const data = await res.json();

      if (res.ok && data.status !== false) {
        iziToast.success({
          title: "Success",
          message: data.message || "Brand updated successfully",
          position: "topRight"
        });

        setTimeout(() => {
          window.location.href = "brand-list.php";
        }, 800);

      } else {
        console.error("API Response Error:", data);
        iziToast.error({
          title: "Error",
          message: data.message || "Update failed",
          position: "topRight"
        });
      }

    } catch (err) {
      console.error("Catch Error:", err.message);
      iziToast.error({
        title: "Error",
        message: err.message || "Server error occurred",
        position: "topRight"
      });
    }
  });
});

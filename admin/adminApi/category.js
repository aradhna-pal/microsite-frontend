// ======= DOMContentLoaded =======
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryId = urlParams.get("id");

  const tableBody = document.getElementById("categoryTableBody");
  if (tableBody) {
    getCategories();
  }

  const form = document.getElementById("category-add");
  if (form) {
    if (categoryId) {
      loadCategory(categoryId);      // ✅ pehle data load karo
      updateCategory(categoryId);    // ✅ phir submit handler lagao
    } else {
      AddCategories();
    }
  }
});

// ======= GET ALL CATEGORIES (list page) =======
async function getCategories() {
  const api = `${domin}/api/category/get`;
  const tableBody = document.getElementById("categoryTableBody");

  try {
    const response = await fetch(api);
    if (!response.ok) throw new Error("Failed to fetch categories");

    const data = await response.json();
    tableBody.innerHTML = "";

    data.forEach((cat, index) => {
      const catId = cat.id || cat._id || cat.Id;
      const catName = cat.name || cat.Name || "";
      const catImg = cat.imageUrl || cat.ImageUrl;
      const catStatus = cat.status !== undefined ? cat.status : cat.Status;

      const imgUrl = catImg
        ? domin + catImg
        : "https://via.placeholder.com/40x40?text=No+Img";

      const statusBadge = (catStatus === true || catStatus === 1 || catStatus === "true")
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center gap20">
          <div class="body-text" style="flex:0 0 60px; max-width:60px;">${index + 1}</div>
          <div class="name flex items-center gap10">
            <img src="${imgUrl}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">
          </div>
          <div class="body-title-2">${catName}</div>
          <div class="body-text">${statusBadge}</div>
          <div class="list-icon-function">
            <div class="item edit" onclick="editCategory('${catId}')">
              <i class="icon-edit-3"></i>
            </div>
          </div>
          <div class="list-icon-function">
            <div class="item text-danger" onclick="deleteCategory('${catId}')">
              <i class="icon-trash-2"></i>
            </div>
          </div>
        </li>`;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error:", error);
    tableBody.innerHTML = `<li class="body-text text-danger">Failed to load categories ❌</li>`;
  }
}

// ======= EDIT REDIRECT =======
function editCategory(catId) {
  window.location.href = `edit-category.php?id=${catId}`;  // ✅ apna sahi page naam rakho
}

// ======= LOAD CATEGORY DATA IN FORM (edit page) =======
async function loadCategory(id) {
  try {
    const response = await fetch(`${domin}/api/category/get`);
    if (!response.ok) throw new Error("Failed to fetch");

    const result = await response.json();

    // ✅ String vs Number dono cases handle karo
    const category = result.find(cat =>
      String(cat.id || cat._id || cat.Id) === String(id)
    );

    if (!category) {
      iziToast.error({ title: "Error", message: "Category not found", position: "topRight" });
      return;
    }

    // ✅ Name field fill karo
    document.getElementById("categoryName").value = category.name || category.Name || "";

    // ✅ Status toggle set karo
    const status = category.status ?? category.Status;
    document.getElementById("statusToggle").checked = (status === true || status === 1 || status === "true");

    // ✅ Image preview show karo (file input pe src nahi lagta — alag img tag chahiye)
    const imgUrl = category.imageUrl || category.ImageUrl;
    let preview = document.getElementById("imagePreview");

    if (imgUrl) {
      if (!preview) {
        // agar preview img tag nahi hai HTML mein toh dynamically banao
        preview = document.createElement("img");
        preview.id = "imagePreview";
        preview.style.cssText = "width:80px;height:80px;object-fit:cover;border-radius:8px;margin-top:10px;";
        document.getElementById("myFile").closest(".upload-image").appendChild(preview);
      }
      preview.src = domin + imgUrl;
    }

  } catch (error) {
    console.error("loadCategory error:", error);
    iziToast.error({ title: "Error", message: "Failed to load category data", position: "topRight" });
  }
}

// ======= UPDATE CATEGORY (edit page submit) =======
function updateCategory(id) {
  const form = document.getElementById("category-add");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
      return;
    }

    const categoryName = document.getElementById("categoryName").value.trim();
    const file = document.getElementById("myFile").files[0];
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!categoryName) {
      iziToast.error({ title: "Error", message: "Category name is required", position: "topRight" });
      return;
    }

    const formData = new FormData();
    formData.append("Name", categoryName);
    formData.append("Status", statusToggle);
    if (file) formData.append("ImageFile", file);   // ✅ sirf naya file ho toh append karo

    try {
      const response = await fetch(`${domin}/api/category/edit/${id}`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        iziToast.success({
          title: "Success",
          message: result.message || "Category updated successfully!",
          position: "topRight"
        });
        setTimeout(() => { window.location.href = "category-list.php"; }, 1500);
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "Update failed",
          position: "topRight"
        });
      }

    } catch (error) {
      console.error(error);
      iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
    }
  });
}

// ======= ADD CATEGORY (add page) =======
async function AddCategories() {
  const form = document.getElementById("category-add");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = `${domin}/api/category/add`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
      return;
    }

    const categoryName = document.getElementById("categoryName").value.trim();
    const file = document.getElementById("myFile").files[0];
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!categoryName || !file) {
      iziToast.error({ title: "Error", message: "Please fill all fields", position: "topRight" });
      return;
    }

    const formData = new FormData();
    formData.append("Name", categoryName);
    formData.append("ImageFile", file);
    formData.append("Status", statusToggle);

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        iziToast.success({
          title: "Success",
          message: result.message || "Category added successfully",
          position: "topRight"
        });
        form.reset();
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "Something went wrong",
          position: "topRight"
        });
      }

    } catch (error) {
      console.error(error);
      iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
    }
  });
}

// ======= DELETE CATEGORY =======
async function deleteCategory(id) {
  const token = localStorage.getItem("authToken");

  iziToast.question({
    timeout: 20000,
    close: false,
    overlay: true,
    displayMode: 'once',
    id: 'question',
    zindex: 999,
    title: 'Confirm',
    message: 'Are you sure you want to delete this category?',
    position: 'center',
    buttons: [
      ['<button><b>Yes, delete it!</b></button>', async function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

        try {
          const response = await fetch(`${domin}/api/category/delete/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });

          const res = await response.json();

          if (response.ok) {
            iziToast.success({ title: "Deleted!", message: res.message || "Category deleted", position: "topRight" });
            getCategories();
          } else {
            iziToast.error({ title: "Error!", message: res.message || "Delete failed", position: "topRight" });
          }
        } catch (error) {
          console.error(error);
          iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
        }
      }, true],
      ['<button>Cancel</button>', function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
      }]
    ]
  });
}

// Start Sub Catuegry -------------

 
// ======= DOMContentLoaded =======
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlId = urlParams.get("id");
  

  // Determine the current page
  const isChildCategory = window.location.pathname.toLowerCase().includes('childcategory') || 
                          window.location.pathname.toLowerCase().includes('child-category');
  
  const isSubcategory = !isChildCategory && (window.location.pathname.toLowerCase().includes('subcategory') || 
                        window.location.pathname.toLowerCase().includes('sub-category'));

  if (isChildCategory) {
    // --- Child Category Initialization ---
    const tableBody = document.getElementById("childCategoryTableBody");
    if (tableBody) {
      getChildCategories();
    }
    
    const form = document.getElementById("childcategory-add");
    if (form) {
      Promise.all([populateCategoryDropdown(), populateSubCategoryDropdown()]).then(() => {
        if (urlId) { loadChildCategory(urlId); updateChildCategory(urlId); } 
        else { addChildCategory(); }
      });
    }
  } else if (isSubcategory) {
    // --- Subcategory Initialization ---
    const tableBody = document.getElementById("categoryTableBody") || document.getElementById("subCategoryTableBody");
    if (tableBody) {
      tableBody.id = "subCategoryTableBody"; // ensure correct ID mapping
      getSubCategories();
    }
    
    const form = document.getElementById("category-add") || document.getElementById("subcategory-add");
    if (form) {
      form.id = "subcategory-add";
      populateCategoryDropdown().then(() => {
        if (urlId) { loadSubCategory(urlId); updateSubCategory(urlId); } 
        else { addSubCategory(); }
      });
    }
  } else {
    // --- Standard Category Initialization ---
    const tableBody = document.getElementById("categoryTableBody");
    if (tableBody) getCategories();

    const form = document.getElementById("category-add");
    if (form) {
      if (urlId) { loadCategory(urlId); updateCategory(urlId); } 
      else { AddCategories(); }
    }
  }
});


// Event delegation to auto-filter Subcategories based on selected Category (for Add/Edit SubCategory/ChildCategory pages)
document.addEventListener("change", function(e) {
  if (e.target.id === "parentCategory") {
    const selectedCat = e.target.value;
    const subCatDropdown = document.getElementById("subCategory");
    if (subCatDropdown) {
      const options = subCatDropdown.querySelectorAll("option");
      options.forEach(opt => {
        if (opt.value === "") return;
        if (opt.getAttribute("data-category") === selectedCat) {
          opt.style.display = "";
        } else {
          opt.style.display = "none";
        }
      });
      subCatDropdown.value = ""; // Reset subcategory selection when category changes
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

const subCategoryGet = `${domin}/api/subcategory/get`;
const subCategoryAdd = `${domin}/api/subcategory/add`;
const editSubCategory = `${domin}/api/subcategory/edit`;
const deleteSubCategory = `${domin}/api/subcategory/delete`;

// ======= POPULATE CATEGORY DROPDOWN =======
async function populateCategoryDropdown() {
  const dropdown = document.getElementById("parentCategory");
  if (!dropdown) return;

  try {
    const response = await fetch(`${domin}/api/category/get`);
    if (!response.ok) throw new Error("Failed to fetch categories");

    const result = await response.json();
    const categories = result.data || result;

    dropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
    const addedIds = new Set();

    categories.forEach(cat => {
      const catId = cat.id || cat._id || cat.Id;
      const catName = cat.name || cat.Name || "";
      const catStatus = cat.status !== undefined ? cat.status : cat.Status;
      
      if (!addedIds.has(catId) && (catStatus === true || catStatus === 1 || String(catStatus) === "true")) {
        addedIds.add(catId);
        const option = document.createElement("option");
        option.value = catId;
        option.textContent = catName;
        dropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error loading categories for dropdown:", error);
  }
}

// ======= GET ALL SUBCATEGORIES (list page) =======
async function getSubCategories() {
  const tableBody = document.getElementById("subCategoryTableBody");

  try {
    const response = await fetch(subCategoryGet);
    if (!response.ok) throw new Error("Failed to fetch subcategories");

    const data = await response.json();
    console.log(data,getSubCategories);
    
    tableBody.innerHTML = "";

    data.forEach((cat, index) => {
      const catId = cat.id || cat._id || cat.Id;
      const catName = cat.subCategoryName || cat.Name || "";
      const catImg = cat.subCategoryImageUrl || cat.ImageUrl;
      const catStatus = cat.status !== undefined ? cat.status : cat.Status;
      const categoryName = cat.categoryName || cat.CategoryName || "";


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
          <div class="body-title-2">${categoryName}</div>
          <div class="body-title-2">${catName}</div>
          <div class="body-text">${statusBadge}</div>
          <div class="list-icon-function">
            <div class="item text-primary" onclick="redirectToEditSubCategory('${catId}')">
              <i class="icon-edit-3"></i>
            </div>
          </div>
          <div class="list-icon-function">
            <div class="item text-danger" onclick="removeSubCategory('${catId}')">
              <i class="icon-trash-2"></i>
            </div>
          </div>
        </li>`;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error:", error);
    tableBody.innerHTML = `<li class="body-text text-danger">Failed to load subcategories ❌</li>`;
  }
}

async function removeSubCategory(id) {
  const token = localStorage.getItem("authToken");

  iziToast.question({
    timeout: false,
    overlay: true,
    displayMode: 'once',
    id: 'question',
    zindex: 999,
    title: 'Confirm',
    message: 'Delete this subcategory?',
    position: 'center',
    buttons: [
      ['<button><b>Yes</b></button>', async function (instance, toast) {
        instance.hide({}, toast);

        try {
          const response = await fetch(`${deleteSubCategory}/${id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          const res = await response.json();

          if (response.ok) {
            iziToast.success({
              title: "Deleted!",
              message: res.message || "Subcategory deleted",
              position: "topRight"
            });

            await getSubCategories();
          } else {
            iziToast.error({
              title: "Error!",
              message: res.message || "Delete failed",
              position: "topRight"
            });
          }

        } catch (error) {
          console.log(error);
          iziToast.error({
            title: "Error!",
            message: "Server error",
            position: "topRight"
          });
        }
      }],
      
      ['<button>No</button>', function (instance, toast) {
        instance.hide({}, toast);
      }]
    ]
  });
}


// ======= EDIT REDIRECT FOR SUBCATEGORY =======
function redirectToEditSubCategory(catId) {
  window.location.href = `edit-subcategory.php?id=${catId}`;
}

// ======= LOAD SUBCATEGORY DATA IN FORM (edit page) =======
async function loadSubCategory(id) {
  try {
    const response = await fetch(subCategoryGet);
    if (!response.ok) throw new Error("Failed to fetch subcategories");

    const result = await response.json();
    
    // Find the specific subcategory from the list
    const category = result.find(cat => String(cat.id || cat._id || cat.Id) === String(id));

    if (!category) {
      iziToast.error({ title: "Error", message: "Subcategory not found", position: "topRight" });
      return;
    }

    // Fill SubCategory Name
    const nameInput = document.getElementById("categoryName");
    if (nameInput) nameInput.value = category.subCategoryName || category.SubCategoryName || category.name || "";

    // Fill Parent Category Dropdown
    const parentCat = document.getElementById("parentCategory");
    if (parentCat) parentCat.value = category.categoryId || category.CategoryId || "";

    // Fill Status
    const status = category.status ?? category.Status;
    const statusToggle = document.getElementById("statusToggle");
    if (statusToggle) statusToggle.checked = (status === true || status === 1 || status === "true");

    // Show Image preview
    const imgUrl = category.subCategoryImageUrl || category.imageUrl || category.ImageUrl;
    let preview = document.getElementById("imagePreview");
    const icon = document.getElementById("uploadIcon");
    const text = document.getElementById("uploadText");

    if (imgUrl && preview) {
      preview.src = domin + imgUrl;
      preview.style.display = "block";
      if (icon) icon.style.display = "none";
      if (text) text.style.display = "none";
    }

  } catch (error) {
    console.error("loadSubCategory error:", error);
    iziToast.error({ title: "Error", message: "Failed to load subcategory data", position: "topRight" });
  }
}

// ======= ADD SUBCATEGORY (add page) =======
function addSubCategory() {
  const form = document.getElementById("subcategory-add");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
      return;
    }

    const subCategoryName = document.getElementById("categoryName").value.trim();
    const categoryId = document.getElementById("parentCategory").value;
    const fileInput = document.getElementById("myFile");
    const file = fileInput ? fileInput.files[0] : null;
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!subCategoryName || !categoryId || !file) {
      iziToast.error({ 
        title: "Error", 
        message: "Please fill all required fields including the image", 
        position: "topRight" 
      });
      return;
    }

    const formData = new FormData();
    formData.append("SubCategoryName", subCategoryName);
    formData.append("CategoryId", categoryId);
    formData.append("ImageFile", file);
    formData.append("Status", statusToggle);

    try {
      const response = await fetch(subCategoryAdd, {
        method: "POST", // ADD API IS POST
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        iziToast.success({
          title: "Success",
          message: result.message || "Subcategory added successfully",
          position: "topRight"
        });
        // Redirect after a short delay
        setTimeout(() => { window.location.href = "sub-category-list.php"; }, 1500);
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

// ======= UPDATE SUBCATEGORY (edit page) =======
function updateSubCategory(id) {
  const form = document.getElementById("subcategory-add");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });
      return;
    }

    const subCategoryName = document.getElementById("categoryName").value.trim();
    const categoryId = document.getElementById("parentCategory").value;
    const fileInput = document.getElementById("myFile");
    const file = fileInput ? fileInput.files[0] : null;
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!subCategoryName || !categoryId) {
      iziToast.error({ title: "Error", message: "Subcategory name and parent category are required", position: "topRight" });
      return;
    }

    const formData = new FormData();
    formData.append("SubCategoryName", subCategoryName);
    formData.append("CategoryId", categoryId);
    formData.append("Status", statusToggle);
    
    // Only append ImageFile if the user actually uploaded a new image
    if (file) {
      formData.append("ImageFile", file);
    }

    try {
      const response = await fetch(`${editSubCategory}/${id}`, {
        method: "PUT", // EDIT API IS PUT
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        iziToast.success({
          title: "Success",
          message: result.message || "Subcategory updated successfully!",
          position: "topRight"
        });
        // Redirect after a short delay
        setTimeout(() => { window.location.href = "sub-category-list.php"; }, 1500);
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

// -----------Child category crud Start -----------------//

const childCategoryGet = `${domin}/api/childcategory/get`;
const childCategoryAdd = `${domin}/api/childcategory/add`;
const editChildCategory = `${domin}/api/childcategory/edit`;
const deleteChildCategory = `${domin}/api/childcategory/delete`;

// ======= POPULATE SUBCATEGORY DROPDOWN =======
async function populateSubCategoryDropdown() {
  const dropdown = document.getElementById("subCategory");
  if (!dropdown) return;

  try {
    const response = await fetch(subCategoryGet);
    if (!response.ok) throw new Error("Failed to fetch subcategories");

    const result = await response.json();
    const subcategories = result.data || result;

    dropdown.innerHTML = '<option value="" disabled selected>Select Sub Category</option>';
    const addedIds = new Set();

    subcategories.forEach(sub => {
      const subId = sub.id || sub._id || sub.Id;
      const subName = sub.subCategoryName || sub.SubCategoryName || sub.name || "";
      const catId = sub.categoryId || sub.CategoryId || "";
      const subStatus = sub.status !== undefined ? sub.status : sub.Status;
      
      if (!addedIds.has(subId) && (subStatus === true || subStatus === 1 || String(subStatus) === "true")) {
        addedIds.add(subId);
        const option = document.createElement("option");
        option.value = subId;
        option.setAttribute("data-category", catId);
        option.textContent = subName;
        dropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error loading subcategories for dropdown:", error);
  }
}

// ======= GET ALL CHILD CATEGORIES =======
async function getChildCategories() {
  const tableBody = document.getElementById("childCategoryTableBody");
  if (!tableBody) return;

  try {
    const response = await fetch(childCategoryGet);
    if (!response.ok) throw new Error("Failed to fetch child categories");

    const data = await response.json();
    tableBody.innerHTML = "";

    data.forEach((cat, index) => {
      const catId = cat.id || cat._id || cat.Id;
      const catName = cat.childCategoryName || cat.ChildCategoryName || cat.name || "";
      const subCatName = cat.subCategoryName || cat.SubCategoryName || "";
      const categoryName = cat.categoryName || cat.CategoryName || "";
      const catImg = cat.childCategoryImageUrl || cat.imageUrl || cat.ImageUrl;
      const catStatus = cat.status !== undefined ? cat.status : cat.Status;

      const imgUrl = catImg ? domin + catImg : "https://via.placeholder.com/40x40?text=No+Img";
      const statusBadge = (catStatus === true || catStatus === 1 || catStatus === "true")
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center justify-between gap20">
          <div class="body-text" style="flex:0 0 60px; max-width:60px;">${index + 1}</div>
          <div class="name flex items-center gap10">
            <img src="${imgUrl}" style="width:40px;height:40px;border-radius:6px;object-fit:cover;">
          </div>
          <div class="body-title-2">${categoryName}</div>
          <div class="body-title-2">${subCatName}</div>
          <div class="body-title-2">${catName}</div>
          <div class="body-text">${statusBadge}</div>
          <div class="list-icon-function">
            <div class="item text-primary" onclick="redirectToEditChildCategory('${catId}')">
              <i class="icon-edit-3"></i>
            </div>
          </div>
          <div class="list-icon-function">
            <div class="item text-danger" onclick="removeChildCategory('${catId}')">
              <i class="icon-trash-2"></i>
            </div>
          </div>
        </li>`;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error:", error);
    tableBody.innerHTML = `<li class="body-text text-danger">Failed to load child categories ❌</li>`;
  }
}

// ======= DELETE CHILD CATEGORY =======
async function removeChildCategory(id) {
  const token = localStorage.getItem("authToken");

  iziToast.question({
    timeout: false,
    overlay: true,
    displayMode: 'once',
    id: 'question',
    zindex: 999,
    title: 'Confirm',
    message: 'Delete this child category?',
    position: 'center',
    buttons: [
      ['<button><b>Yes</b></button>', async function (instance, toast) {
        instance.hide({}, toast);
        try {
          const response = await fetch(`${deleteChildCategory}/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
          const res = await response.json();
          if (response.ok) {
            iziToast.success({ title: "Deleted!", message: res.message || "Child category deleted", position: "topRight" });
            await getChildCategories();
          } else {
            iziToast.error({ title: "Error!", message: res.message || "Delete failed", position: "topRight" });
          }
        } catch (error) {
          console.error(error);
          iziToast.error({ title: "Error!", message: "Server error", position: "topRight" });
        }
      }],
      ['<button>No</button>', function (instance, toast) {
        instance.hide({}, toast);
      }]
    ]
  });
}

// ======= EDIT REDIRECT =======
function redirectToEditChildCategory(catId) {
  window.location.href = `edit-childcategory.php?id=${catId}`;
}

// ======= LOAD CHILD CATEGORY =======
async function loadChildCategory(id) {
  try {
    const response = await fetch(childCategoryGet);
    if (!response.ok) throw new Error("Failed to fetch child categories");

    const result = await response.json();
    const category = result.find(cat => String(cat.id || cat._id || cat.Id) === String(id));

    if (!category) {
      iziToast.error({ title: "Error", message: "Child Category not found", position: "topRight" });
      return;
    }

    const parentCat = document.getElementById("parentCategory");
    if (parentCat) {
      parentCat.value = category.categoryId || category.CategoryId || "";
      parentCat.dispatchEvent(new Event("change")); // trigger filter
    }

    const subCat = document.getElementById("subCategory");
    if (subCat) subCat.value = category.subCategoryId || category.SubCategoryId || "";

    const nameInput = document.getElementById("childCategoryName");
    if (nameInput) nameInput.value = category.childCategoryName || category.ChildCategoryName || category.name || "";

    const status = category.status ?? category.Status;
    const statusToggle = document.getElementById("statusToggle");
    if (statusToggle) statusToggle.checked = (status === true || status === 1 || status === "true");

    const imgUrl = category.childCategoryImageUrl || category.imageUrl || category.ImageUrl;
    let preview = document.getElementById("imagePreview");
    const icon = document.getElementById("uploadIcon");
    const text = document.getElementById("uploadText");

    if (imgUrl && preview) {
      preview.src = domin + imgUrl;
      preview.style.display = "block";
      if (icon) icon.style.display = "none";
      if (text) text.style.display = "none";
    }
  } catch (error) {
    console.error("loadChildCategory error:", error);
    iziToast.error({ title: "Error", message: "Failed to load child category data", position: "topRight" });
  }
}

// ======= ADD CHILD CATEGORY =======
function addChildCategory() {
  const form = document.getElementById("childcategory-add");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) return iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });

    const childCategoryName = document.getElementById("childCategoryName").value.trim();
    const categoryId = document.getElementById("parentCategory").value;
    const subCategoryId = document.getElementById("subCategory").value;
    const fileInput = document.getElementById("myFile");
    const file = fileInput ? fileInput.files[0] : null;
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!childCategoryName || !categoryId || !subCategoryId || !file) {
      return iziToast.error({ title: "Error", message: "Please fill all required fields", position: "topRight" });
    }

    const formData = new FormData();
    formData.append("ChildCategoryName", childCategoryName);
    formData.append("SubCategoryId", subCategoryId);
    formData.append("CategoryId", categoryId);
    formData.append("ImageFile", file);
    formData.append("Status", statusToggle);

    try {
      const response = await fetch(childCategoryAdd, {
        method: "POST", // ADD = POST
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        iziToast.success({ title: "Success", message: result.message || "Child category added", position: "topRight" });
        setTimeout(() => { window.location.href = "child-category-list.php"; }, 1500);
      } else {
        iziToast.error({ title: "Error", message: result.message || "Something went wrong", position: "topRight" });
      }
    } catch (error) {
      iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
    }
  });
}

// ======= UPDATE CHILD CATEGORY =======
function updateChildCategory(id) {
  const form = document.getElementById("childcategory-add");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) return iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });

    const childCategoryName = document.getElementById("childCategoryName").value.trim();
    const categoryId = document.getElementById("parentCategory").value;
    const subCategoryId = document.getElementById("subCategory").value;
    const fileInput = document.getElementById("myFile");
    const file = fileInput ? fileInput.files[0] : null;
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!childCategoryName || !categoryId || !subCategoryId) {
      return iziToast.error({ title: "Error", message: "Required fields are missing", position: "topRight" });
    }

    const formData = new FormData();
    formData.append("ChildCategoryName", childCategoryName);
    formData.append("SubCategoryId", subCategoryId);
    formData.append("CategoryId", categoryId);
    formData.append("Status", statusToggle);
    if (file) formData.append("ImageFile", file);

    try {
      const response = await fetch(`${editChildCategory}/${id}`, {
        method: "PUT", // EDIT = PUT
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const result = await response.json();
      if (response.ok) {
        iziToast.success({ title: "Success", message: result.message || "Child category updated", position: "topRight" });
        setTimeout(() => { window.location.href = "child-category-list.php"; }, 1500);
      } else {
        iziToast.error({ title: "Error", message: result.message || "Update failed", position: "topRight" });
      }
    } catch (error) {
      iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
    }
  });
}
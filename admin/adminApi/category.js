// ======================================================================= get categories ===========================================
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
      loadCategoryData(categoryId);
      updateCategory(categoryId);
    } else {
      AddCategories();
    }
  }
});

async function getCategories() {
  const api = `${domin}/api/category/get`;
  const tableBody = document.getElementById("categoryTableBody");

  try {
    const response = await fetch(api);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    tableBody.innerHTML = "";

    data.forEach((cat, index) => {

      const imgUrl = cat.imageUrl
        ? domin + cat.imageUrl
        : "https://via.placeholder.com/40x40?text=No+Img";

      const statusBadge = cat.status
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center gap20">

          <div class="body-text" style="flex:0 0 60px; max-width:60px;">
            ${index + 1}
          </div>

          <div class="name flex items-center gap10">
            <img src="${imgUrl}" 
                 style="width:40px;height:40px;border-radius:6px;object-fit:cover;">
          </div>

          <div class="body-title-2">${cat.name}</div>

          <div class="body-text">
            ${statusBadge}
          </div>

          <div class="list-icon-function">
            <div class="item edit" onclick="editCategory('${cat.id}')">
              <i class="icon-edit-3"></i>
            </div>
          </div>

          <div class="list-icon-function">
            <div class="item text-danger" onclick="deleteCategory('${cat.id}')">
              <i class="icon-trash-2"></i>
            </div>
          </div>

        </li>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error:", error);

    tableBody.innerHTML = `
      <li class="body-text text-danger">
        Failed to load categories ❌
      </li>
    `;
  }
}

async function AddCategories() {

  const form = document.getElementById("category-add");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = `${domin}/api/category/add`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      iziToast.error({
        title: "Error",
        message: "User not authenticated",
        position: "topRight"
      });
      return;
    }

    const categoryName = document.getElementById("categoryName").value.trim();
    const file = document.getElementById("myFile").files[0];
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!categoryName || !file) {
      iziToast.error({
        title: "Error",
        message: "Please fill all fields",
        position: "topRight"
      });
      return;
    }

    // ✅ Create FormData
    const formData = new FormData();
    formData.append("Name", categoryName);
    formData.append("ImageFile", file);
    formData.append("Status", statusToggle);

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
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
      iziToast.error({
        title: "Error",
        message: "Server error",
        position: "topRight"
      });
    }

  });

}



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
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          const res = await response.json();

          if (response.ok) {
            iziToast.success({
              title: "Deleted!",
              message: res.message || "Category deleted",
              position: "topRight"
            });
            getCategories(); // 🔄 reload list
          } else {
            iziToast.error({
              title: "Error!",
              message: res.message || "Delete failed",
              position: "topRight"
            });
          }
        } catch (error) {
          console.error(error);
          iziToast.error({
            title: "Error",
            message: "Server error",
            position: "topRight"
          });
        }
      }, true],
      ['<button>Cancel</button>', function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
      }]
    ]
  });

}

async function loadCategoryData(id) {
  const api = `${domin}/api/category/get/${id}`; 
  try {
    const response = await fetch(api);
    if (!response.ok) throw new Error("Failed to fetch category data");

    const data = await response.json();
    const cat = data.data || data; 

    const nameInput = document.getElementById("categoryName");
    const statusToggle = document.getElementById("statusToggle");
    const statusText = document.getElementById("statusText");

    if (nameInput) nameInput.value = cat.name || cat.Name || "";
    
    if (statusToggle) {
      statusToggle.checked = cat.status === true || cat.Status === true || cat.status === 1 || cat.Status === 1;
      if (statusText) statusText.innerText = statusToggle.checked ? "Active" : "Inactive";
    }
  } catch (error) {
    console.error("Error loading category:", error);
    iziToast.error({
      title: "Error",
      message: "Failed to load category details",
      position: "topRight"
    });
  }
}

async function updateCategory(id) {
  const form = document.getElementById("category-add");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = `${domin}/api/category/edit/${id}`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      iziToast.error({
        title: "Error",
        message: "User not authenticated",
        position: "topRight"
      });
      return;
    }

    const categoryName = document.getElementById("categoryName").value.trim();
    const file = document.getElementById("myFile").files[0];
    const statusToggle = document.getElementById("statusToggle").checked;

    if (!categoryName) {
      iziToast.error({
        title: "Error",
        message: "Category name is required",
        position: "topRight"
      });
      return;
    }

    const formData = new FormData();
    formData.append("Name", categoryName);
    // Only append the ImageFile if the user actually uploaded a new one during the edit
    if (file) {
      formData.append("ImageFile", file);
    }
    formData.append("Status", statusToggle);

    try {
      const response = await fetch(api, {
        method: "POST", // Change to PUT if your backend utilizes the PUT HTTP verb for updates
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        iziToast.success({
          title: "Success",
          message: result.message || "Category updated successfully",
          position: "topRight"
        });
        setTimeout(() => {
          window.location.href = "category-list.php";
        }, 1500);
      } else {
        iziToast.error({
          title: "Error",
          message: result.message || "Something went wrong",
          position: "topRight"
        });
      }
    } catch (error) {
      console.error(error);
      iziToast.error({
        title: "Error",
        message: "Server error",
        position: "topRight"
      });
    }
  });
}
// ==================================================================  end categorys ===========================================

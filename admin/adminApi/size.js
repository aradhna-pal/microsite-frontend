// ===================== CONFIG =====================
// const domin = "http://microsite_backend.workarya.com/";

// ===================== LOAD SIZE LIST =====================
async function loadSizes() {
  const api = `${domin}/api/admin/getsize`;
  const tableBody = document.getElementById("sizeTableBody");
  if (!tableBody) return;

  try {
    const res = await fetch(api);
    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach((item, index) => {
      const statusBadge = item.isActive
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center gap20">
          <div class="body-text" style="flex:0 0 60px; max-width:60px;">
            ${index + 1}
          </div>

          <div class="body-title-2">${item.sizeName}</div>
          <div class="body-text">${item.description}</div>
          <div class="body-text">${statusBadge}</div>

          <div class="list-icon-function">
            <div class="item edit" data-id="${item.id}">
              <i class="icon-edit-3"></i>
            </div>
          </div>

          <div class="list-icon-function">
            <div class="item trash" data-id="${item.id}">
              <i class="icon-trash-2"></i>
            </div>
          </div>
        </li>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (err) {
    console.error("Load size error:", err);
  }
}

// ===================== ON PAGE LOAD =====================
document.addEventListener("DOMContentLoaded", () => {
  loadSizes();
});

// ===================== ADD SIZE =====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addSizeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = `${domin}/api/admin/addsize`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      iziToast.error({
        title: "Error",
        message: "User not authenticated",
        position: "topRight"
      });
      return;
    }

    const formData = new FormData(form);

    const toggle = document.getElementById("statusToggle");
    formData.set("IsActive", toggle && toggle.checked ? "true" : "false");

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        iziToast.success({
          title: "Success",
          message: "Size added successfully",
          position: "topRight"
        });

        form.reset();
          setTimeout(() => {
          window.location.href = "size-list.php";
        }, 1200);
        loadSizes(); // refresh list
      } else {
        iziToast.error({
          title: "Error",
          message: data.message || "Failed to add size",
          position: "topRight"
        });
      }

    } catch (err) {
      console.error(err);
      iziToast.error({
        title: "Error",
        message: "Server error",
        position: "topRight"
      });
    }
  });
});

// ===================== DELETE SIZE =====================
document.addEventListener("click", function (e) {
  const trashBtn = e.target.closest(".trash");
  if (!trashBtn) return;

  const id = trashBtn.getAttribute("data-id");

  // ✅ First confirm
  iziToast.question({
    timeout: false,
    close: false,
    overlay: true,
    displayMode: 'once',
    title: 'Confirm',
    message: 'Are you sure you want to delete this size?',
    position: 'center',
    buttons: [
      ['<button><b>Yes, Delete</b></button>', async function (instance, toast) {

        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

        const token = localStorage.getItem("authToken");

        try {
          const res = await fetch(`${domin}/api/admin/deletesize/${id}`, {
            method: "DELETE", // change to GET if API needs GET
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json"
            }
          });

          const data = await res.json();

          if (res.ok) {
            iziToast.success({
              title: "Deleted",
              message: "Size deleted successfully",
              position: "topRight"
            });

            loadSizes(); // refresh list
          } else {
            iziToast.error({
              title: "Error",
              message: data.message || "Delete failed",
              position: "topRight"
            });
          }

        } catch (err) {
          console.error(err);
          iziToast.error({
            title: "Error",
            message: "Server error",
            position: "topRight"
          });
        }

      }, true],
      ['<button>No</button>', function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
      }]
    ]
  });
});


// =====================  end delete SIZE =====================



// ===================== UPDATE SIZE =====================
document.addEventListener("click", function (e) {
  const editBtn = e.target.closest(".edit");
  if (!editBtn) return;

  const id = editBtn.getAttribute("data-id");
  window.location.href = `edit-size.php?id=${id}`;
});



// const domin = "http://microsite_backend.workarya.com/";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;

  try {
    const res = await fetch(`${domin}/api/admin/getsize`);
    const data = await res.json();

    const item = data.find(x => x.id == id);
    if (!item) return;

    document.querySelector('input[name="SizeName"]').value = item.sizeName;
    document.querySelector('textarea[name="Description"]').value = item.description;
    document.getElementById("statusToggle").checked = item.isActive;

  } catch (err) {
    console.error(err);
  }
});








document.addEventListener("DOMContentLoaded", () => {
  const editForm = document.getElementById("editSizeForm");
  
  // ✅ Exit silently if we are not on the edit page
  if (!editForm) return;

  editForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem("authToken");

    if (!id || !token) {
      iziToast.error({ title: "Error", message: "Missing ID or Authentication token", position: "topRight" });
      return;
    }

    // ✅ Safely grab form values
    const formData = new FormData(editForm);
    const sizeNameInput = document.querySelector('[name="SizeName"]');
    const descInput = document.querySelector('[name="Description"]');
    const statusToggle = document.getElementById("statusToggle");

    if (sizeNameInput) formData.set("SizeName", sizeNameInput.value);
    if (descInput) formData.set("Description", descInput.value);
    formData.set("IsActive", statusToggle && statusToggle.checked ? "true" : "false");

    try {
      const res = await fetch(`${domin}/api/admin/editsize/${id}`, {
        method: "PUT", // Note: Some REST APIs require "PUT" for updates
        headers: {
          "Authorization": `Bearer ${token}`
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
        iziToast.success({ title: "Updated", message: data.message || "Size updated successfully", position: "topRight" });
        setTimeout(() => {
          window.location.href = "size-list.php";
        }, 1000);
      } else {
        console.error("API Response Error:", data);
        iziToast.error({ title: "Error", message: data.message || "Update failed", position: "topRight" });
      }

    } catch (err) {
      console.error("Catch Error:", err.message);
      iziToast.error({ title: "Error", message: err.message || "Server error occurred", position: "topRight" });
    }
  });
});

// ================= GET ACTIVE SIZES FOR DROPDOWNS =================
async function getActiveSizes() {
  try {
    const res = await fetch(`${domin}/api/admin/getsize`);
    let data = await res.json();
    data = Array.isArray(data) ? data : (data.data || []);
    return data.filter(size => {
      const status = size.isActive !== undefined ? size.isActive : (size.IsActive !== undefined ? size.IsActive : size.isactive);
      return status === true || status === 1 || String(status) === "true";
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}



// ===================== end update SIZE =====================
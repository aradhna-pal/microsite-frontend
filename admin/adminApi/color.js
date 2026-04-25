async function loadColors() {
  const tbody = document.getElementById("colorTableBody");
  const token = localStorage.getItem("authToken");

  if (!tbody || !token) return;

  try {
    const res = await fetch(`${domin}/api/admin/getcolor`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const colors = await res.json();
    tbody.innerHTML = "";

    colors.forEach((item, index) => {
      const statusBadge = item.isactive
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const li = document.createElement("li");
      li.className = "attribute-item flex items-center justify-between gap20";

      // ✅ IMPORTANT (fix)
      li.setAttribute("data-id", item.id);

      li.innerHTML = `
        <div class="body-text" style="flex:0 0 60px; max-width:60px;">
          ${index + 1}
        </div>

        <div class="name flex items-center gap10">
          <div style="
            width:20px;
            height:20px;
            border-radius:50%;
            border:1px solid #ccc;
            background:${item.colorcode || '#ccc'};
          "></div>
          <div class="body-title-2">${item.colorname}</div>
        </div>

        <div class="body-text">
          ${statusBadge}
        </div>

        <div class="list-icon-function">
          <div class="item text-primary" onclick="editcolor(${item.id})">
            <i class="icon-edit-3"></i>
          </div>
        </div>

        <div class="list-icon-function">
          <div class="item text-danger" onclick="deletecolor(${item.id})">
            <i class="icon-trash-2"></i>
          </div>
        </div>
      `;

      tbody.appendChild(li);
    });

  } catch (err) {
    console.error(err);
  }
}
document.addEventListener("DOMContentLoaded", loadColors);

// ===================== delete COLOR =====================

async function deletecolor(id) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    iziToast.error({
      title: 'Error',
      message: 'Unauthorized access'
    });
    return;
  }

  iziToast.question({
    timeout: false,
    close: false,
    overlay: true,
    displayMode: 'once',
    title: 'Confirm',
    message: 'Are you sure you want to delete this color?',
    position: 'center',
    buttons: [
      ['<button><b>YES</b></button>', async function (instance, toast) {

        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');

        try {
          const res = await fetch(`${domin}/api/admin/deletecolor/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (res.ok) {
            iziToast.success({
              title: 'Success',
              message: 'Color deleted successfully',
                position: "topRight"
            });

            // ✅ BEST: reload data from API
            await loadColors();

          } else {
            iziToast.error({
              title: 'Error',
              message: 'Failed to delete color'
            });
          }

        } catch (error) {
          console.error(error);
          iziToast.error({
            title: 'Error',
            message: 'Something went wrong'
          });
        }

      }, true],

      ['<button>NO</button>', function (instance, toast) {
        instance.hide({ transitionOut: 'fadeOut' }, toast, 'button');
      }]
    ]
  });
}
// ===================== end delete COLOR =====================


// ===========================add color ===========================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addColorForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) return;

    const isActive = document.getElementById("statusToggle").checked;

    const formData = new FormData(form);
    formData.set("isactive", isActive);

    try {
      const res = await fetch(`${domin}/api/admin/addcolor`, {
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
          message: "Color added successfully",
          position: "topRight"
        });

        form.reset();
        document.getElementById("statusToggle").checked = false;

        // refresh list
      setTimeout(() => {
    window.location.href = "color-list.php";
  }, 800);
        loadColors();

      } else {
        iziToast.error({
          title: "Error",
          message: data.message || "Add failed",
          position: "topRight"
        });
      }

    } catch (err) {
      console.error("Add color error:", err);
      iziToast.error({
        title: "Error",
        message: "Server error",
        position: "topRight"
      });
    }
  });
});

// ================= GET ACTIVE COLORS FOR DROPDOWNS =================
async function getActiveColors() {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${domin}/api/admin/getcolor`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    let data = await res.json();
    data = Array.isArray(data) ? data : (data.data || []);
    return data.filter(color => {
      const status = color.isactive !== undefined ? color.isactive : (color.IsActive !== undefined ? color.IsActive : color.isActive);
      return status === true || status === 1 || String(status) === "true";
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ===========================end add color ===========================


// =========================== edit color ===========================

async function editcolor(id) {
  window.location.href = `edit-color.php?id=${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("editColorForm");
  if (!form) return; // ✅ Exit silently if we are not on the Edit Color page
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) return;
  
  // ✅ 1. PREFILL DATA ON LOAD
  async function prefillData() {
    try {
      const res = await fetch(`${domin}/api/admin/getcolor`);
      const data = await res.json();
      
      // Safely extract array if wrapped
      const colors = Array.isArray(data) ? data : (data.data || []);
      const item = colors.find(c => c.id == id);
      
      if (item) {
        const nameInput = document.querySelector('input[name="colorname"]');
        const statusToggle = document.getElementById("statusToggle");

        if (nameInput) nameInput.value = item.colorname || "";
        if (statusToggle) statusToggle.checked = (item.isactive === true || item.isactive === "true" || item.isactive === 1);
      }
    } catch (err) {
      console.error("Prefill color error:", err);
    }
  }

  prefillData();

  // ✅ 2. HANDLE FORM SUBMIT FOR UPDATE
  form.addEventListener("submit", async (e) => {  
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      iziToast.error({ title: "Error", message: "Missing token", position: "topRight" });
      return;
    }

    const statusToggle = document.getElementById("statusToggle");
    const isActive = statusToggle ? statusToggle.checked : false;   
    const formData = new FormData(form);
    formData.set("isactive", isActive ? "true" : "false");
    
    try {
      const res = await fetch(`${domin}/api/admin/editcolor/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      // ✅ Catch HTML/PHP errors gracefully before JSON parsing
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
          message: data.message || "Color updated successfully",
          position: "topRight"
        });
        setTimeout(() => {
          window.location.href = "color-list.php";
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
      console.error("Edit color error:", err.message);
      iziToast.error({
        title: "Error",
        message: err.message || "Server error",
        position: "topRight"
      });
    }
  });
});

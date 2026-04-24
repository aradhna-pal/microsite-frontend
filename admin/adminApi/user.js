const allUser = `${domin}/api/users/getusers`
const editUser = `${domin}/api/users/updateuser/`
const deleteUser = `${domin}/api/users/deleteuser/`
const addUser = `${domin}/api/users/adduser`

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlId = urlParams.get("id");

  const isAllUser = window.location.pathname.toLowerCase().includes('all-user');
  const isAddUser = window.location.pathname.toLowerCase().includes('add-new-user');
  const isEditUser = window.location.pathname.toLowerCase().includes('edit-user');

  if (isAllUser) {
    const tableBody = document.getElementById("allUserTableBody");
    if (tableBody) {
      getUsers();
    }
    
    // Live Search Functionality
    const searchInput = document.getElementById("userSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll("#allUserTableBody li");
        
        rows.forEach(row => {
          const textContent = row.innerText.toLowerCase();
          if (textContent.includes(searchTerm)) {
            row.style.display = "";
          } else {
            row.style.display = "none";
          }
        });
      });
    }
  } 
  
  else if (isAddUser) {
    const form = document.getElementById("user-form");
    if (form) addNewUser();
  } 
  
  else if (isEditUser) {
    const form = document.getElementById("user-form");
    if (form) {
      if (urlId) {
        loadUserData(urlId);
        updateUserData(urlId);
      }
    }
  }
});

// ======= GET ALL USERS =======
async function getUsers() {
  const tableBody = document.getElementById("allUserTableBody");
  const token = localStorage.getItem("authToken");
  
  try {
    const response = await fetch(allUser, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch users");

    const result = await response.json();
    const data = result.data || result;
    
    tableBody.innerHTML = "";

    data.forEach((user, index) => {
      const userId = user.id || user._id || user.Id;
      const firstName = user.firstname || user.FirstName || "";
      const lastName = user.lastname || user.LastName || "";
      const email = user.email || user.Email || "";
      const role = user.role || user.Role || "USER";
      const isActive = user.isactive !== undefined ? user.isactive : user.IsActive;
      
      let formattedDate = "N/A";
      if (user.createdat || user.CreatedAt) {
        const dateObj = new Date(user.createdat || user.CreatedAt);
        formattedDate = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
      }

      const statusBadge = (isActive === true || isActive === 1 || isActive === "true")
        ? `<span class="badge badge-success">Active</span>`
        : `<span class="badge badge-danger">Inactive</span>`;

      const row = `
        <li class="attribute-item flex items-center justify-between gap20">
          <div class="body-text" style="flex:0 0 60px; max-width:60px;">${index + 1}</div>
          <div class="body-title-2">${firstName} ${lastName}</div>
          <div class="body-title-2">${email}</div>
          <div class="body-title-2">${role}</div>
          <div class="body-title-2">${formattedDate}</div>
          <div class="body-text">${statusBadge}</div>
          <div class="list-icon-function">
            <div class="item text-primary" onclick="redirectToEditUser('${userId}')">
              <i class="icon-edit-3"></i>
            </div>
          </div>
          <div class="list-icon-function">
            <div class="item text-danger" onclick="removeUser('${userId}')">
              <i class="icon-trash-2"></i>
            </div>
          </div>
        </li>`;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (error) {
    console.error("Error:", error);
    tableBody.innerHTML = `<li class="body-text text-danger">Failed to load users ❌</li>`;
  }
}

// ======= DELETE USER =======
async function removeUser(id) {
  const token = localStorage.getItem("authToken");

  iziToast.question({
    timeout: false,
    overlay: true,
    displayMode: 'once',
    id: 'question',
    zindex: 999,
    title: 'Confirm',
    message: 'Delete this user?',
    position: 'center',
    buttons: [
      ['<button><b>Yes</b></button>', async function (instance, toast) {
        instance.hide({}, toast);
        try {
          const response = await fetch(`${deleteUser}${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
          });
          const res = await response.json();
          
          if (response.ok) {
            iziToast.success({ title: "Deleted!", message: res.message || "User deleted", position: "topRight" });
            await getUsers();
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

// ======= REDIRECT TO EDIT =======
function redirectToEditUser(userId) {
  window.location.href = `edit-user.php?id=${userId}`;
}

// ======= LOAD USER (edit page) =======
async function loadUserData(id) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(allUser, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch user data");

    const result = await response.json();
    const data = result.data || result;
    const user = data.find(u => String(u.id || u._id || u.Id) === String(id));

    if (!user) {
      iziToast.error({ title: "Error", message: "User not found", position: "topRight" });
      return;
    }

    document.getElementById("firstName").value = user.firstname || user.FirstName || "";
    document.getElementById("lastName").value = user.lastname || user.LastName || "";
    document.getElementById("userEmail").value = user.email || user.Email || "";
    document.getElementById("userRole").value = user.role || user.Role || "USER";
    
    const status = user.isactive !== undefined ? user.isactive : user.IsActive;
    document.getElementById("statusToggle").checked = (status === true || status === 1 || status === "true");

  } catch (error) {
    console.error("loadUserData error:", error);
    iziToast.error({ title: "Error", message: "Failed to load user data", position: "topRight" });
  }
}

// ======= ADD OR UPDATE API LOGIC HANDLER =======
async function submitUserForm(apiEndpoint, method, successMsg, redirectPage) {
  const token = localStorage.getItem("authToken");
  if (!token) return iziToast.error({ title: "Error", message: "User not authenticated", position: "topRight" });

  const formData = new FormData();
  formData.append("firstname", document.getElementById("firstName").value.trim());
  formData.append("lastname", document.getElementById("lastName").value.trim());
  formData.append("email", document.getElementById("userEmail").value.trim());
  formData.append("role", document.getElementById("userRole").value);
  formData.append("isactive", document.getElementById("statusToggle").checked);
  
  const pwd = document.getElementById("userPassword");
  if (pwd && pwd.value.trim() !== "") {
    formData.append("password", pwd.value.trim());
  }

  try {
    const response = await fetch(apiEndpoint, {
      method: method,
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      iziToast.success({ title: "Success", message: result.message || successMsg, position: "topRight" });
      setTimeout(() => { window.location.href = redirectPage; }, 1500);
    } else {
      iziToast.error({ title: "Error", message: result.message || "Failed to save", position: "topRight" });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({ title: "Error", message: "Server error", position: "topRight" });
  }
}

function addNewUser() {
  document.getElementById("user-form").addEventListener("submit", (e) => { e.preventDefault(); submitUserForm(addUser, "POST", "User added successfully!", "all-user.php"); });
}

function updateUserData(id) {
  document.getElementById("user-form").addEventListener("submit", (e) => { e.preventDefault(); submitUserForm(`${editUser}${id}`, "PUT", "User updated successfully!", "all-user.php"); });
}
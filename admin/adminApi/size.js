// const domin = 'http://microsite_backend.workarya.com/';

document.addEventListener("DOMContentLoaded", function () {

  const api = `${domin}api/admin/getsize`;
  const tableBody = document.getElementById("sizeTableBody");

  fetch(api)
    .then(res => res.json())
    .then(data => {

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

    })
    .catch(err => console.error(err));

});



// *************************************** add size ********************************

// const domin = 'http://microsite_backend.workarya.com/';


document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("addSizeForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const api = `${domin}api/admin/addsize`;
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

    // toggle status
    const toggle = document.getElementById("statusToggle");
    formData.set("IsActive", toggle && toggle.checked ? "true" : "false");

    try {
      const res = await fetch(api, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
        credentials: "include"
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (res.ok) {
        iziToast.success({
          title: "Success",
          message: "Size added",
          position: "topRight"
        });
        form.reset();
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
        message: "Something went wrong",
        position: "topRight"
      });
    }

  });

});



// ************************************************** end add size **********************************************
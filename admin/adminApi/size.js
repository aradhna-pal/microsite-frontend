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
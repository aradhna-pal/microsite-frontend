
// const domin = 'http://microsite_backend.workarya.com';

document.addEventListener("DOMContentLoaded", function () {

  const api = `${domin}/api/category/get`;
  const tableBody = document.getElementById("categoryTableBody");

  fetch(api)
    .then(res => res.json())
    .then(data => {

      tableBody.innerHTML = "";

      data.forEach((cat, index) => {

        const imgUrl = cat.imageUrl
          ? domin + cat.imageUrl
          : "https://via.placeholder.com/40x40?text=No+Img";

        // ✅ same badge like size table
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
              <div class="item edit" data-id="${cat.id}">
                <i class="icon-edit-3"></i>
              </div>
            </div>

            <div class="list-icon-function">
              <div class="item trash" data-id="${cat.id}">
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

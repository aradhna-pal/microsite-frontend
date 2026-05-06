document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
  const tableBody = document.getElementById("order-list");
  if (!tableBody) return;

  const token = localStorage.getItem("authToken");

  try {
    const res = await fetch(`${domin}/api/checkout/admin/allorders`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    
    const result = await res.json();

    if (!result.status || !Array.isArray(result.data)) {
      tableBody.innerHTML = `<li class="body-text text-danger text-center">No orders found</li>`;
      return;
    }

    tableBody.innerHTML = "";

    result.data.forEach((item, index) => {
      const orderDate = new Date(item.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });

      // Order Status Badge Color Handling
      let statusText = item.orderStatus ? item.orderStatus.charAt(0).toUpperCase() + item.orderStatus.slice(1) : 'Pending';
      let statusBadge = `<span class="badge bg-warning text-dark" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; font-weight: 600;">${statusText}</span>`;
      
      if (statusText.toLowerCase() === 'delivered' || statusText.toLowerCase() === 'success') {
          statusBadge = `<span class="badge bg-success" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; color: #fff; font-weight: 600;">${statusText}</span>`;
      } else if (statusText.toLowerCase() === 'cancelled' || statusText.toLowerCase() === 'failed') {
          statusBadge = `<span class="badge bg-danger" style="padding: 6px 12px; font-size: 12px; border-radius: 6px; color: #fff; font-weight: 600;">${statusText}</span>`;
      }

      const row = `
        <li class="attribute-item flex items-center justify-between gap20">
          <div class="body-text" style="flex:0 0 60px; max-width:60px;">${index + 1}</div>
          
          <div class="name" style="flex: 1; min-width: 150px; overflow: hidden; text-overflow: ellipsis;">
            <a href="oder-detail.php?id=${item.id}" class="body-title-2">${item.firstName} ${item.lastName}</a>
          </div>
          
          <div class="body-text" style="flex: 1; min-width: 150px; overflow: hidden; text-overflow: ellipsis;" title="${item.email}">
            ${item.email}
          </div>
          
          <div class="body-text" style="flex: 0 0 100px;">${item.mobile}</div>
          <div class="body-text" style="flex: 0 0 80px;">${item.pincode}</div>
          <div class="body-text" style="flex: 0 0 80px;">${item.totalItems} Items</div>
          <div class="body-text" style="flex: 0 0 100px;">₹${item.grandTotal.toFixed(2)}</div>
          <div class="body-text" style="flex: 0 0 100px;">${item.paymentMethod}</div>
          <div class="body-text" style="flex: 0 0 100px;">${statusBadge}</div>
          <div class="body-text" style="flex: 0 0 100px;">${orderDate}</div>
          
          <div class="list-icon-function" style="flex: 0 0 80px;">
            <div class="item eye" onclick="viewOrder(${item.id})">
              <i class="icon-eye"></i>
            </div>
          
          </div>
        </li>
      `;

      tableBody.insertAdjacentHTML("beforeend", row);
    });

  } catch (err) {
    console.error("Order load error:", err);
    tableBody.innerHTML = `<li class="body-text text-danger">There was an error loading the orders.</li>`;
  }
}

function viewOrder(id) {
  window.location.href = `oder-detail.php?id=${id}`;
}

async function deleteOrder(id) {
  // Implement the delete API action here. Use your existing standard implementation block inside of iziToast.question
  // E.g.
  // fetch(\`${domin}/api/checkout/admin/deleteorder/${id}\`, { method: "DELETE" })
  
  // Assuming you are navigating this route later, you can add it just like in variant.js/product.js
  alert("Ready to implement DELETE functionality for order ID: " + id);
}



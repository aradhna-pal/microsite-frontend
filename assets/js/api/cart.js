
window.loadCart = async function() {
  try {
    const token = localStorage.getItem("token") || "";

    const res = await fetch(`${domain}/api/cart/get`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token
      }
    });

    const data = await res.json();
    const cartBody = document.getElementById("cartBody");
    const dropdownCarts = document.querySelectorAll(".dropdown-cart-products");

    // 1. Update cart counts and totals across the entire site
    document.querySelectorAll('.cart-count').forEach(el => {
      el.innerText = data.totalItems || 0;
    });
    document.querySelectorAll('.cart-total-price').forEach(el => {
      el.innerText = `₹${data.grandTotal || 0}`; // Using backend grandTotal
    });
    document.querySelectorAll('.summary-subtotal td:last-child').forEach(el => {
      el.innerText = `₹${data.grandTotal || 0}`;
    });
    document.querySelectorAll('.summary-total td:last-child').forEach(el => {
      el.innerText = `₹${data.grandTotal || 0}`;
    });

    if (!data.status || !data.data || !data.data.length) {
      if (cartBody) {
        cartBody.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center;">Your cart is empty</td>
          </tr>`;
      }
      dropdownCarts.forEach(el => {
        el.innerHTML = '<p class="text-center w-100 py-2" style="margin: 0;">No products in cart.</p>';
      });
      return;
    }

    let rows = "";
    let dropHtml = "";

    data.data.forEach(item => {
      const price =  item.price;
      const qty = item.quantity;
      const total = item.totalprice || (price * qty);
      const prodId = item.productId || item.productid || item.product_id;
      const varId = item.variantId || item.variantid || (item.variantIds && item.variantIds.length ? item.variantIds[0] : "") || "";

      rows += `
        <tr>
          <td class="product-col">
            <div class="product">
              <figure class="product-media">
                <img src="${item.image}" width="80">
              </figure>
              <h3 class="product-title">${item.name}</h3>
            </div>
          </td>

          <td class="price-col">₹${price}</td>

          <td class="quantity-col">
            <div class="cart-product-quantity">
                <input type="number" class="form-control" value="${qty}" min="1" max="10" step="1" data-decimals="0" required="" style="display: none;">
                <div class="input-group input-spinner">
                    <div class="input-group-prepend">
                        <button style="min-width: 26px" class="btn btn-decrement btn-spinner qty-btn" type="button" data-id="${prodId}" data-variant-id="${varId}" data-change="-1"><i class="icon-minus"></i></button>
                    </div>
                    <input type="text" style="text-align: center" class="form-control" required="" value="${qty}" readonly>
                    <div class="input-group-append">
                        <button style="min-width: 26px" class="btn btn-increment btn-spinner qty-btn" type="button" data-id="${prodId}" data-variant-id="${varId}" data-change="1"><i class="icon-plus"></i></button>
                    </div>
                </div>
            </div>
          </td>

          <td class="total-col">₹${total}</td>

          <td class="remove-col">
            <button class="btn-remove" data-id="${item.id}">✕</button>
          </td>
        </tr>
      `;

      dropHtml += `
        <div class="product">
            <div class="product-cart-details">
                <h4 class="product-title">
                    <a href="product.php?id=${prodId}">${item.name}</a>
                </h4>

                <span class="cart-product-info">
                    <span class="cart-product-qty">${qty}</span>
                    x ₹${price}
                </span>
            </div>

            <figure class="product-image-container">
                <a href="product.php?id=${prodId}" class="product-image">
                    <img src="${item.image}" alt="${item.productName}">
                </a>
            </figure>
            <a href="#" class="btn-remove" data-id="${item.id}" title="Remove Product"><i class="icon-close"></i></a>
        </div>
      `;
    });

    if (cartBody) {
      cartBody.innerHTML = rows;
    }
    dropdownCarts.forEach(el => {
      el.innerHTML = dropHtml;
      
      // Apply scrollbar if there are more than 5 items
      if (data.data.length > 5) {
          el.style.maxHeight = "420px"; // Estimated height for 5 items
          el.style.overflowY = "auto";
          el.style.overflowX = "hidden";
      } else {
          el.style.maxHeight = "none";
          el.style.overflowY = "visible";
      }
    });

  } catch (err) {
    console.error(err);
    iziToast.error({
      title: "Error",
      message: "Failed to load cart",
      position: "topRight"
    });
  }
}

document.addEventListener("DOMContentLoaded", loadCart);

// --- Handle Quantity Increment/Decrement ---
document.addEventListener("click", async function (e) {
  const qtyBtn = e.target.closest(".qty-btn");
  if (qtyBtn) {
    e.preventDefault();

    // Stop from decrementing if quantity is already 1
    const input = qtyBtn.closest('.input-spinner').querySelector('input[type="text"]');
    if (qtyBtn.getAttribute("data-change") === "-1" && parseInt(input.value) <= 1) {
      return; 
    }

    const productId = qtyBtn.getAttribute("data-id");
    const variantId = qtyBtn.getAttribute("data-variant-id");
    const change = qtyBtn.getAttribute("data-change");

    const formData = new FormData();
    formData.append("productId", productId);
    if (variantId) {
      formData.append("variantId", variantId);
    }
    formData.append("change", change);

    const token = localStorage.getItem("token");
    let guestId = localStorage.getItem("guestId");
    let headers = {};
    if (token) headers["Authorization"] = "Bearer " + token;
    else if (guestId) headers["guestId"] = guestId;

    try {
      qtyBtn.style.pointerEvents = "none"; // prevent double clicking

      const res = await fetch(`${domain}/api/cart/updatequantity`, {
        method: "PUT",
        headers: headers,
        body: formData,
      });

      const data = await res.json();
      
      if (data.status) {
        if (typeof window.loadCart === "function") window.loadCart(); // Refresh cart fully
      }
    } catch (err) {
      console.error("Update Qty Error:", err);
    }
  }
});

// --- Handle Remove Item and Clear Cart ---
document.addEventListener("click", async function (e) {
  // 1. Remove Single Item (X button in table & dropdown)
  const removeBtn = e.target.closest(".btn-remove");
  if (removeBtn) {
    e.preventDefault();
    const id = removeBtn.getAttribute("data-id");
    if (!id) return;

    const token = localStorage.getItem("token");
    let guestId = localStorage.getItem("guestId");
    let headers = {};
    if (token) headers["Authorization"] = "Bearer " + token;
    else if (guestId) headers["guestId"] = guestId;

    try {
      removeBtn.style.pointerEvents = "none"; // Disable temporarily to prevent multiple clicks
      const res = await fetch(`${domain}/api/cart/delete/${id}`, {
        method: "DELETE",
        headers: headers
      });
      
      if (res.ok) {
        iziToast.success({ title: "Removed", message: "Item removed from cart", position: "topRight", timeout: 2000 });
        if (typeof window.loadCart === "function") window.loadCart(); // Refresh the cart layout immediately
      } else {
        removeBtn.style.pointerEvents = "auto";
      }
    } catch (err) {
      console.error("Remove Item Error:", err);
      removeBtn.style.pointerEvents = "auto";
    }
  }

  // 2. Clear Entire Cart
  const clearBtn = e.target.closest("#btn-clear-cart");
  if (clearBtn) {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    let guestId = localStorage.getItem("guestId");
    let headers = {};
    if (token) headers["Authorization"] = "Bearer " + token;
    else if (guestId) headers["guestId"] = guestId;

    try {
      const res = await fetch(`${domain}/api/cart/clearcart`, {
        method: "DELETE",
        headers: headers
      });
      
      if (res.ok) {
        iziToast.success({ title: "Cleared", message: "Cart cleared successfully", position: "topRight" });
        if (typeof window.loadCart === "function") window.loadCart();
      }
    } catch (err) {
      console.error("Clear Cart Error:", err);
    }
  }
});

// --- Protect Checkout Links ---
document.addEventListener("click", function (e) {
  const checkoutBtn = e.target.closest('a[href*="checkout.php"]');
  if (checkoutBtn) {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault(); // Stop navigation
      iziToast.warning({
        title: "Login Required",
        message: "Please log in to proceed to checkout.",
        position: "topRight"
      });
      // Open the login modal automatically
      const loginModalLink = document.querySelector('a[href="#signin-modal"]');
      if (loginModalLink) {
        loginModalLink.click();
      }
    }
  }
});

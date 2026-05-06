document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (orderId && document.getElementById('order-items-list')) {
        loadOrderDetails(orderId);
    }
});

async function loadOrderDetails(id) {
    const token = localStorage.getItem("authToken");
    if (!token) {
        iziToast.error({ title: "Error", message: "Not authenticated", position: "topRight" });
        return;
    }

    try {
        const response = await fetch(`${domin}/api/checkout/order/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.status && result.order) {
            const order = result.order;
            const items = result.orderItems || [];

            // Format the Date
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit', month: 'short', year: 'numeric'
            });

            // Inject Status Badge identically to List styling
            let statusText = order.orderStatus ? order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1) : 'Pending';
            let statusBadge = `<span class="badge bg-warning text-dark" style="padding: 4px 10px; font-size: 12px; border-radius: 4px; font-weight: 600;">${statusText}</span>`;
            
            if (statusText.toLowerCase() === 'delivered' || statusText.toLowerCase() === 'success') {
                statusBadge = `<span class="badge bg-success" style="padding: 4px 10px; font-size: 12px; border-radius: 4px; color: #fff; font-weight: 600;">${statusText}</span>`;
            } else if (statusText.toLowerCase() === 'cancelled' || statusText.toLowerCase() === 'failed') {
                statusBadge = `<span class="badge bg-danger" style="padding: 4px 10px; font-size: 12px; border-radius: 4px; color: #fff; font-weight: 600;">${statusText}</span>`;
            }

            // Inject Summary Texts
            setText('order-page-title', `Order #${order.id}`);
            setText('breadcrumb-order-id', `Order #${order.id}`);
            setText('summary-order-id', `#${order.id}`);
            setText('summary-date', orderDate);
            document.getElementById('summary-status').innerHTML = statusBadge;
            setText('summary-total', `₹${order.grandTotal.toFixed(2)}`);
            setText('cart-subtotal', `₹${order.grandTotal.toFixed(2)}`);
            setText('cart-total', `₹${order.grandTotal.toFixed(2)}`);
            setText('payment-method', order.paymentMethod);
            
            // Format Address
            const addressText = `<b>${order.firstName} ${order.lastName}</b><br>${order.address}<br>${order.city}, ${order.state}<br>${order.country} - ${order.pincode}<br><br><b>Mobile:</b> ${order.mobile}<br><b>Email:</b> ${order.email}`;
            const addressEl = document.getElementById('shipping-address');
            if (addressEl) addressEl.innerHTML = addressText;

            // Populate Ordered Items
            const itemsList = document.getElementById('order-items-list');
            itemsList.innerHTML = ''; // clear loading state

            items.forEach(item => {
                const imgUrl = item.image ? item.image : "images/products/default.png";
                const row = `
                    <li class="product-item gap14">
                        <div class="image no-bg">
                            <img src="${imgUrl}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                        </div>
                        <div class="flex items-center justify-between gap40 flex-grow">
                            <div class="name" style="flex: 1;">
                                <div class="text-tiny mb-1">Product Name</div>
                                <a href="javascript:void(0);" class="body-title-2">${item.productName}</a>
                            </div>
                            <div class="name" style="flex: 0 0 80px;">
                                <div class="text-tiny mb-1">Quantity</div>
                                <div class="body-title-2">${item.quantity}</div>
                            </div>
                          
                            <div class="name" style="flex: 0 0 100px;">
                                <div class="text-tiny mb-1">Total</div>
                                <div class="body-title-2 tf-color-1">₹${item.totalPrice.toFixed(2)}</div>
                            </div>
                        </div>
                    </li>
                `;
                itemsList.insertAdjacentHTML('beforeend', row);
            });

        } else { iziToast.error({ title: "Error", message: "Order not found", position: "topRight" }); }
    } catch (error) { console.error(error); iziToast.error({ title: "Error", message: "Failed to fetch order details", position: "topRight" }); }
}
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
document.addEventListener("DOMContentLoaded", async () => {
    const ordersTableBody = document.getElementById("ordersTableBody");
    if (!ordersTableBody) return;

    const token = localStorage.getItem("token");
    if (!token) {
        ordersTableBody.innerHTML = `<tr><td colspan="14" class="text-center">Please log in to view your orders.</td></tr>`;
        return;
    }

    try {
        ordersTableBody.innerHTML = `<tr><td colspan="14" class="text-center">Loading your orders...</td></tr>`;
        
        const res = await fetch(`${domain}/api/checkout/myorders`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();
        
        // Adapt to common backend response structures
        const ordersArray = data.data || data.orders || (Array.isArray(data) ? data : []);

        if (data.status !== false && ordersArray.length > 0) {
            let rows = "";
            
            ordersArray.forEach((order, index) => {
                const orderId = order.id || order.orderId || order.order_id || (index + 1);
                const date = order.createdat || order.createdAt || order.orderDate || new Date().toISOString();
                const formattedDate = new Date(date).toLocaleDateString();
                const total = order.grandTotal || order.totalAmount || order.totalprice || order.total || "0.00";
                const status = order.orderStatus || order.status || order.PaymentStatus || "Pending";
                
                const name = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A';
                const email = order.email || 'N/A';
                const mobile = order.mobile || 'N/A';
                const address = order.address || 'N/A';
                const city = order.city || 'N/A';
                const state = order.state || 'N/A';
                const country = order.country || 'N/A';
                const items = order.totalItems || 0;
                const payment = order.paymentMethod || order.paymentmethod || 'N/A';
                
                // Store the order list details safely in the button
                const orderJson = encodeURIComponent(JSON.stringify(order));

                rows += `
                    <tr>
                        <td class="p-3">#${orderId}</td>
                        <td class="p-3">${name}</td>
                        <td class="p-3">${email}</td>
                        <td class="p-3">${mobile}</td>
                        <td class="p-3">${address}</td>
                        <td class="p-3">${city}</td>
                        <td class="p-3">${state}</td>
                        <td class="p-3">${country}</td>
                        <td class="p-3">${items}</td>
                        <td class="p-3">₹${total}</td>
                        <td class="p-3">${payment}</td>
                        <td class="p-3"><span style="background-color: #c96; color: #fff; padding: 4px 8px; border-radius: 3px; font-size: 1.2rem;">${status}</span></td>
                        <td class="p-3">${formattedDate}</td>
                        <td class="p-3"><a href="#" class="btn btn-outline-primary-2 btn-sm view-order-details" data-id="${order.id}" data-order="${orderJson}">View Details</a></td>
                    </tr>
                `;
            });
            ordersTableBody.innerHTML = rows;
        } else {
            ordersTableBody.innerHTML = `<tr><td colspan="14" class="text-center">You haven't placed any orders yet. <br><br> <a href="index.php" class="btn btn-outline-primary-2">Go Shopping</a></td></tr>`;
        }
    } catch (err) {
        console.error("My Orders error:", err);
        ordersTableBody.innerHTML = `<tr><td colspan="14" class="text-center text-danger">Failed to load orders.</td></tr>`;
    }
});

// --- Handle View Details Click ---
document.addEventListener("click", async function (e) {
    const btn = e.target.closest(".view-order-details");
    if (btn) {
        e.preventDefault();
        const orderId = btn.getAttribute("data-id");
        const orderDataRaw = btn.getAttribute("data-order");
        if (!orderId) return;

        // Extract the order info from the list
        let listOrder = {};
        if (orderDataRaw) {
            try {
                listOrder = JSON.parse(decodeURIComponent(orderDataRaw));
            } catch (err) {}
        }

        const originalText = btn.innerText;
        btn.innerText = "Loading...";
        btn.style.pointerEvents = "none";

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${domain}/api/checkout/order/${orderId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            
            btn.innerText = originalText;
            btn.style.pointerEvents = "auto";

            if (data.status && data.order) {
                // Merge the list info with the detail API response
                const mergedOrder = { ...listOrder, ...data.order };
                showOrderDetailsModal(mergedOrder, data.orderItems || []);
            } else {
                if (typeof iziToast !== 'undefined') {
                    iziToast.error({ title: "Error", message: data.message || "Failed to load order details.", position: "topRight" });
                } else {
                    alert("Failed to load order details.");
                }
            }
        } catch (err) {
            console.error("Order details error:", err);
            btn.innerText = originalText;
            btn.style.pointerEvents = "auto";
            if (typeof iziToast !== 'undefined') {
                iziToast.error({ title: "Error", message: "Something went wrong.", position: "topRight" });
            } else {
                alert("Something went wrong.");
            }
        }
    }
});

function showOrderDetailsModal(order, items) {
    // Remove existing modal if any
    const existingModal = document.getElementById("orderDetailsModal");
    if (existingModal) existingModal.remove();

    let itemsHtml = "";
    items.forEach((item, index) => {
        // Extract additional details like Size, Brand, and Variant
        let extraDetails = [];
        if (item.brandName) extraDetails.push(`Brand: ${item.brandName}`);
        
        let sizes = item.sizeNames || [];
        let variantName = item.variantName;
        let itemImage = item.image || "";

        // Gather swatches (Main + Variants)
        let swatches = [];
        let addedColors = new Set();
        
        if (item.colorNames && item.colorNames.length > 0) {
            swatches.push({ color: item.colorNames[0], image: item.image || "" });
            addedColors.add(item.colorNames[0]);
        }
        
        if (item.variants && Array.isArray(item.variants)) {
            item.variants.forEach(v => {
                if (v.colors && v.colors.length > 0 && !addedColors.has(v.colors[0])) {
                    swatches.push({ color: v.colors[0], image: v.image || item.image });
                    addedColors.add(v.colors[0]);
                }
            });
        }

        // Handle variant details if available
        if (item.variants && Array.isArray(item.variants) && item.variants.length > 0) {
            const v = item.variants[0];
            variantName = variantName || v.variantname || v.variantName;
            if (v.sizes && v.sizes.length > 0) sizes = v.sizes;
        }

        if (sizes.length > 0) extraDetails.push(`Size: ${sizes.join(", ")}`);
        if (variantName) extraDetails.push(`Variant: ${variantName}`);

        let extraHtml = extraDetails.length > 0 ? `<div style="font-size: 1.2rem; color: #777; margin-top: 4px;">${extraDetails.join(' | ')}</div>` : "";

        let swatchesHtml = "";
        if (swatches.length > 0) {
            swatchesHtml = `<div style="display: flex; gap: 5px; margin-top: 6px; align-items: center;"><span style="font-size: 1.2rem; color: #777;">Color:</span>`;
            swatches.forEach(s => {
                swatchesHtml += `<span title="${s.color}" onclick="document.getElementById('order-item-img-${index}').src='${s.image}'" style="display: inline-block; width: 16px; height: 16px; border-radius: 50%; background-color: ${s.color}; border: 1px solid #ccc; cursor: pointer;"></span>`;
            });
            swatchesHtml += `</div>`;
        }

        itemsHtml += `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img id="order-item-img-${index}" src="${itemImage}" alt="${item.productName}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                        <div>
                            <a href="product.php?id=${item.productId}" style="font-weight: 500;">${item.productName}</a>
                            ${extraHtml}
                            ${swatchesHtml}
                        </div>
                    </div>
                </td>
                <td>₹${item.discountPrice > 0 ? item.discountPrice : item.price}</td>
                <td>${item.quantity}</td>
                <td>₹${item.totalPrice}</td>
            </tr>
        `;
    });

    if (items.length === 0) {
        itemsHtml = `<tr><td colspan="4" class="text-center">No items found.</td></tr>`;
    }

    const formattedDate = new Date(order.createdAt || order.createdat || new Date()).toLocaleString();

    // Safe Fallbacks for missing details to avoid "undefined" text
    const name = `${order.firstName || ''} ${order.lastName || ''}`.trim() || 'N/A';
    const email = order.email || 'N/A';
    const phone = order.mobile || 'N/A';
    const addressParts = [order.address, order.city, order.state, order.country].filter(Boolean).join(', ');
    const fullAddress = addressParts ? `${addressParts}${order.pincode ? ' - ' + order.pincode : ''}` : 'N/A';
    const totalItemsCount = order.totalItems || items.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    const grandTotal = order.grandTotal || '0.00';
    const status = order.orderStatus || order.status || 'Pending';
    const paymentMethod = order.paymentMethod || 'N/A';

    const modalHtml = `
        <div class="modal fade" id="orderDetailsModal" tabindex="-1" role="dialog" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="orderDetailsModalLabel">Order Details (#${order.id})</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="icon-close"></i></span>
                        </button>
                    </div>
                    <div class="modal-body p-4">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <h6>Billing & Shipping Address</h6>
                                <p class="mb-0"><strong>Name:</strong> ${name}</p>
                                <p class="mb-0"><strong>Email:</strong> ${email}</p>
                                <p class="mb-0"><strong>Phone:</strong> ${phone}</p>
                                <p class="mb-0"><strong>Address:</strong> ${fullAddress}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Order Summary</h6>
                                <p class="mb-0"><strong>Date:</strong> ${formattedDate}</p>
                                <p class="mb-0"><strong>Payment Method:</strong> ${paymentMethod}</p>
                                <p class="mb-0"><strong>Status:</strong> <span class="badge" style="background-color: #c96; color: #fff; font-size: 1.1rem; font-weight: 400; text-transform: capitalize;">${status}</span></p>
                                <p class="mb-0"><strong>Total Items:</strong> ${totalItemsCount}</p>
                                <p class="mb-0"><strong>Grand Total:</strong> <span style="font-weight: bold; color: #c96;">₹${grandTotal}</span></p>
                            </div>
                        </div>
                        
                        <h6 class="mt-4">Order Items</h6>
                        <div class="table-responsive">
                            <table class="table table-bordered align-middle mb-0">
                                <thead class="table-light">
                                    <tr style="background-color: #ebebeb;">
                                        <th class="p-3">Product</th>
                                        <th class="p-3">Price</th>
                                        <th class="p-3">Quantity</th>
                                        <th class="p-3">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-primary-2 btn-sm" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Show using jQuery/Bootstrap if available
    if (window.jQuery && window.jQuery.fn.modal) {
        window.jQuery('#orderDetailsModal').modal('show');
    }
}

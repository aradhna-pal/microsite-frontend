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
                        <td class="p-3"><a href="#" class="btn btn-outline-primary-2 btn-sm">View Details</a></td>
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

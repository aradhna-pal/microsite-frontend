document.addEventListener("DOMContentLoaded", async () => {
    const summaryTable = document.getElementById("checkoutOrderSummary");
    if (!summaryTable) return;

    const token = localStorage.getItem("token");
    if (!token) {
        // Fallback protection: Redirect if accessed directly without logging in
        window.location.href = "index.php"; 
        return;
    }

    try {
        const res = await fetch(`${domain}/api/checkout/preview`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.status && data.cartItems && data.cartItems.length > 0) {
            let rows = "";
            
            // Build Product Items
            data.cartItems.forEach(item => {
                rows += `
                    <tr>
                        <td><a href="product.php?id=${item.productid}">${item.productName}</a> <br><small style="color: #ccc;">Qty: ${item.quantity}</small></td>
                        <td>₹${item.totalprice}</td>
                    </tr>
                `;
            });

            // Build Totals
            rows += `
                <tr class="summary-subtotal">
                    <td>Subtotal:</td>
                    <td>₹${data.grandTotal}</td>
                </tr>
              
                <tr class="summary-total">
                    <td>Total:</td>
                    <td>₹${data.grandTotal}</td>
                </tr>
            `;

            summaryTable.innerHTML = rows;
        } else {
            summaryTable.innerHTML = `<tr><td colspan="2" class="text-center">Your cart is empty. <br><br> <a href="index.php" class="btn btn-outline-primary-2">Go Shopping</a></td></tr>`;
            const btnOrder = document.querySelector('.btn-order');
            if (btnOrder) btnOrder.disabled = true;
        }
    } catch (err) {
        console.error("Checkout preview error:", err);
        summaryTable.innerHTML = `<tr><td colspan="2" class="text-center text-danger">Failed to load order summary.</td></tr>`;
    }
});
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
                        <td><a href="product.php?id=${item.productid}">${item.name}</a> <br><small style="color: #ccc;">Qty: ${item.quantity}</small></td>
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

            // Auto-fill address fields if available from API
            if (data.addressForm) {
                const form = document.getElementById("checkoutForm");
                if (form) {
                    if (data.addressForm.first_name) form.elements["FirstName"].value = data.addressForm.first_name;
                    if (data.addressForm.last_name) form.elements["LastName"].value = data.addressForm.last_name;
                    if (data.addressForm.email) form.elements["Email"].value = data.addressForm.email;
                    if (data.addressForm.mobile) form.elements["Mobile"].value = data.addressForm.mobile;
                    if (data.addressForm.country) form.elements["Country"].value = data.addressForm.country;
                }
            }
        } else {
            summaryTable.innerHTML = `<tr><td colspan="2" class="text-center">Your cart is empty. <br><br> <a href="index.php" class="btn btn-outline-primary-2">Go Shopping</a></td></tr>`;
            const btnOrder = document.querySelector('.btn-order');
            if (btnOrder) btnOrder.disabled = true;
        }
    } catch (err) {
        console.error("Checkout preview error:", err);
        summaryTable.innerHTML = `<tr><td colspan="2" class="text-center text-danger">Failed to load order summary.</td></tr>`;
    }

    // Handle Payment Method Selection
    document.querySelectorAll('.payment-method-link').forEach(link => {
        link.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            const paymentInput = document.getElementById('PaymentMethod');
            if (paymentInput && method) {
                paymentInput.value = method;
            }
        });
    });

    // Handle Place Order
    const checkoutForm = document.getElementById("checkoutForm");
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", async function(e) {
            e.preventDefault();

            const token = localStorage.getItem("token");
            if (!token) {
                iziToast.error({ title: "Error", message: "Please log in to place an order.", position: "topRight" });
                return;
            }

            // Prevent double submission
            if (checkoutForm.dataset.submitting === "true") return;
            checkoutForm.dataset.submitting = "true";

            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Processing...</span>';
            submitBtn.disabled = true;
            submitBtn.style.pointerEvents = 'none';

            const formData = new FormData(checkoutForm);

            try {
                const res = await fetch(`${domain}/api/checkout/placeorder`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                });

                const data = await res.json();

                if (data.status) {
                    iziToast.success({ title: "Success", message: data.message || "Order placed successfully!", position: "topRight" });
                    
                    submitBtn.innerHTML = '<span class="btn-text">Redirecting...</span>';

                    // Clear cart counts visually 
                    if (typeof window.loadCart === 'function') window.loadCart();

                    // Redirect to home or success page after 2 seconds
                    setTimeout(() => {
                        window.location.href = "dashboard.php"; 
                    }, 2000);
                } else {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.pointerEvents = 'auto';
                    checkoutForm.dataset.submitting = "false";
                    
                    iziToast.error({ title: "Error", message: data.message || "Failed to place order.", position: "topRight" });
                }
            } catch (err) {
                console.error("Place order error:", err);
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.style.pointerEvents = 'auto';
                checkoutForm.dataset.submitting = "false";
                iziToast.error({ title: "Server Error", message: "Something went wrong while placing your order.", position: "topRight" });
            }
        });
    }
});
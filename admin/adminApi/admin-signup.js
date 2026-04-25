const addAdmin = "http://microsite_backend.workarya.com/api/admin/add";

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    if (!registerForm) return;

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmpassword").value.trim(); // ✅ fixed
        const phone = document.getElementById("number").value.trim();

        // ✅ validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !phone) {
            iziToast.error({
                title: "Error",
                message: "All fields are required",
                position: "topRight"
            });
            return;
        }

        if (password !== confirmPassword) {
            iziToast.error({
                title: "Error",
                message: "Passwords do not match",
                position: "topRight"
            });
            return;
        }

        const formData = new FormData();

        // ✅ EXACT backend keys
        formData.append("FirstName", firstName);
        formData.append("LastName", lastName);
        formData.append("Email", email);
        formData.append("Phone", phone);
        formData.append("PasswordHash", password);

        try {
            const response = await fetch(addAdmin, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                iziToast.success({
                    title: "Success",
                    message: "Admin registered successfully",
                    position: "topRight"
                });

                registerForm.reset();
            } else {
                iziToast.error({
                    title: "Error",
                    message: data.message || "Failed to register",
                    position: "topRight"
                });
            }

        } catch (error) {
            console.error(error);
            iziToast.error({
                title: "Error",
                message: "Server error",
                position: "topRight"
            });
        }
    });
});
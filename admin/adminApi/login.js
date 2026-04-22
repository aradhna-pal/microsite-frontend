document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const loginApi = `${domin}api/admin/login`;

        const formData = new FormData(form);

        try {
            const response = await fetch(loginApi, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log("API Response:", data); // 🔍 debug

            // ✅ correct condition
            if (response.ok && data.status === true) {

                // ✅ correct token path
                const token = data?.data?.token;

                if (token) {
                    localStorage.setItem("authToken", token);
                }

                // ✅ success toast
                iziToast.success({
                    title: 'Success',
                    message: data.message || 'Login successful!',
                    position: 'topRight',
                    timeout: 2000
                });

                // ⏳ redirect after delay
                setTimeout(() => {
                    window.location.href = "index.php";
                }, 2000);

            } else {

                iziToast.error({
                    title: 'Error',
                    message: data.message || "Login failed",
                    position: 'topRight'
                });
            }

        } catch (error) {
            console.error("Error:", error);

            iziToast.error({
                title: 'Error',
                message: "Something went wrong",
                position: 'topRight'
            });
        }
    });

});
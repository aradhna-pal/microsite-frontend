document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("login-form");

    // ✅ LOGIN
    if (form) {
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
                console.log("API Response:", data);

                if (response.ok && data.status === true) {

                    const token = data?.data?.token;
                    if (token) {
                        localStorage.setItem("authToken", token);
                    }

                    iziToast.success({
                        title: 'Success',
                        message: data.message || 'Login successful!',
                        position: 'topRight',
                        timeout: 2000
                    });

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
                console.error(error);
                iziToast.error({
                    title: 'Error',
                    message: "Something went wrong",
                    position: 'topRight'
                });
            }
        });
    }

    // ✅ LOGOUT (SAFE CHECK)
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {

            // token remove
            localStorage.removeItem("authToken");

            iziToast.success({
                title: 'Logged out',
                message: 'You have been logged out',
                position: 'topRight',
                timeout: 1500
            });

            setTimeout(() => {
                window.location.href = "login.php";
            }, 1000);
        });
    }

});
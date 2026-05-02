
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName") || "My Account";

    const headerLoginLink = document.querySelector('a[href="#signin-modal"]');
    if (token && headerLoginLink) {
        const parentLi = headerLoginLink.parentElement;
        parentLi.innerHTML = `
            <a href="#" style="display:inline-block;margin-right:15px;">
                <i class="icon-user"></i>Hi, ${userName}
            </a>
            <a href="#" id="logoutBtn" style="display:inline-block;cursor:pointer;">
                Logout
            </a>
        `;

        document.getElementById("logoutBtn").addEventListener("click", function(e) {
            e.preventDefault();
            localStorage.removeItem("token");
            localStorage.removeItem("userName");

            iziToast.success({
                title: "Logged out",
                message: "You have been logged out",
                position: "topRight"
            });

            setTimeout(() => location.reload(), 1200);
        });
    }

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("singin-email").value.trim();
            const password = document.getElementById("singin-password").value.trim();

            if (!email || !password) {
                iziToast.warning({
                    title: "Required",
                    message: "Please enter email and password",
                    position: "topRight"
                });
                return;
            }

            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const btnSubmit = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<span>Logging in...</span>';
            btnSubmit.disabled = true;

            try {
                const res = await fetch(`${domain}/api/users/login`, {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();
                const token = data.data ? data.data.token : data.token;

                if (data.status && token) {
                    localStorage.setItem("token", token);

                    const firstName = data.data?.firstname || "User";
                    localStorage.setItem("userName", firstName);

                    iziToast.success({
                        title: "Success",
                        message: "Login successful",
                        position: "topRight"
                    });

                    setTimeout(() => location.reload(), 1200);
                } else {
                    iziToast.error({
                        title: "Error",
                        message: data.message || "Invalid credentials",
                        position: "topRight"
                    });
                }
            } catch (error) {
                console.error("Login Error:", error);
                iziToast.error({
                    title: "Server Error",
                    message: "Error during login",
                    position: "topRight"
                });
            } finally {
                btnSubmit.innerHTML = originalBtnText;
                btnSubmit.disabled = false;
            }
        });
    }
});

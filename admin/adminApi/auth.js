(function () {
    const isLoggedIn = localStorage.getItem("authToken");

    const currentPage = window.location.pathname.split("/").pop();

    // login page par ho to check na karo
    if (currentPage === "login.php") return;

    if (!isLoggedIn) {
        window.location.href = "login.php";
    }
})();
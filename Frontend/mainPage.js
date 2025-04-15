document.addEventListener("DOMContentLoaded", () => {
    // Show user icon + username if logged in
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const userInfo = document.getElementById("userInfo");

    if (authUser && authUser.username) {
        userInfo.innerHTML = `
            <i class="bi bi-person-circle"></i>
            <span>${authUser.username}</span>
        `;
    } else {
        userInfo.innerHTML = `
            <a href="login.html" style="color: white; text-decoration: none;">
                <i class="bi bi-box-arrow-in-right"></i> Login
            </a>
        `;
    }

    // Connect Button Listener
    document.getElementById("connectBtn").addEventListener("click", () => {
        alert("Thank you for showing interest! We will connect with you soon.");
    });

    // Blog submission (you can remove this if unused)
    async function submitBlog(title, content) {
        const response = await fetch("http://localhost:3000/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        const result = await response.json();
        console.log(result);
        alert(result.message);
    }

    // Example Blog Submit Button Handler
    const submitBtn = document.getElementById("submitBlog");
    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            const title = document.getElementById("blogTitle").value;
            const content = document.getElementById("blogContent").value;

            if (title && content) {
                submitBlog(title, content);
            } else {
                alert("Please enter both title and content!");
            }
        });
    }
});














































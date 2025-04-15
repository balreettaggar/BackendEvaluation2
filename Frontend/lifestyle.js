const isAdmin = false; // Toggle this based on real authentication
const isGuest = !localStorage.getItem("authToken"); // check if token exists


document.addEventListener("DOMContentLoaded", () => {
    const blogForm = document.getElementById("blogForm");
    const userBlogsContainer = document.getElementById("userBlogs");

    async function fetchUserBlogs() {
        try {
            const response = await fetch("http://localhost:3000/lifestyle-blogs");
            const blogs = await response.json();

            userBlogsContainer.innerHTML = blogs.length
                ? blogs.map(blog =>
                    `<article class="user-blog" id="blog-${blog.id}">
                        <h4>${blog.title}</h4>
                        <p><strong>By:</strong> ${blog.author}</p>
                        <p>${blog.content}</p>

                        ${blog.reported ? `<p style="color: red;"><strong>🚩 Reported</strong></p>` : ""}

                        <p><strong>Average Rating:</strong> ${blog.averageRating || "Not Rated Yet"}</p>

                        <label for="rating-${blog.id}">Rate this blog:</label>
                        <select id="rating-${blog.id}">
                            <option value="1">1 ⭐</option>
                            <option value="2">2 ⭐⭐</option>
                            <option value="3">3 ⭐⭐⭐</option>
                            <option value="4">4 ⭐⭐⭐⭐</option>
                            <option value="5">5 ⭐⭐⭐⭐⭐</option>
                        </select>
                        <button onclick="rateBlog(${blog.id})">Submit Rating</button>

                        <p>
                            <strong>Likes:</strong> <span id="likes-${blog.id}">${blog.likes}</span>
                            <button onclick="likeBlog(${blog.id})">👍 Like</button>
                        </p>
                        <p>
                            <strong>Dislikes:</strong> <span id="dislikes-${blog.id}">${blog.dislikes}</span>
                            <button onclick="dislikeBlog(${blog.id})">👎 Dislike</button>
                        </p>

                        ${isAdmin ? `
                            <button onclick="editBlog(${blog.id})">Edit</button>
                            <button onclick="deleteBlog(${blog.id})">Delete</button>
                        ` : `
                            <button onclick="reportBlog(${blog.id})">🚩 Report</button>
                        `}

                        <h5>Comments:</h5>
                        <div id="comments-${blog.id}">
                            ${blog.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join("")}
                        </div>
                        <input type="text" id="comment-input-${blog.id}" placeholder="Write a comment..." />
                        <button onclick="addComment(${blog.id})">Add Comment</button>
                    </article>`
                ).join("")
                : "<p>No blogs found.</p>";
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    }

    window.rateBlog = async (id) => {
        const rating = parseInt(document.getElementById(`rating-${id}`).value);
        try {
            const response = await fetch(`http://localhost:3000/rate-lifestyle-blog/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating })
            });
            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    window.likeBlog = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/like-lifestyle-blog/${id}`, { method: "PATCH" });
            const result = await response.json();
            if (result.likes !== undefined) {
                document.getElementById(`likes-${id}`).innerText = result.likes;
            }
        } catch (error) {
            console.error("Error liking blog:", error);
        }
    };

    window.dislikeBlog = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/dislike-lifestyle-blog/${id}`, { method: "PATCH" });
            const result = await response.json();
            if (result.dislikes !== undefined) {
                document.getElementById(`dislikes-${id}`).innerText = result.dislikes;
            }
        } catch (error) {
            console.error("Error disliking blog:", error);
        }
    };

    window.editBlog = async (id) => {
        const newTitle = prompt("Enter new title:");
        const newContent = prompt("Enter new content:");

        if (!newTitle || !newContent) return;

        try {
            const response = await fetch(`http://localhost:3000/edit-lifestyle-blog/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, content: newContent })
            });

            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error editing blog:", error);
        }
    };

    window.deleteBlog = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const response = await fetch(`http://localhost:3000/delete-lifestyle-blog/${id}`, { method: "DELETE" });
            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    window.addComment = async (id) => {
        const commentInput = document.getElementById(`comment-input-${id}`);
        const commentText = commentInput.value.trim();

        if (!commentText) return alert("Comment cannot be empty!");

        try {
            const response = await fetch(`http://localhost:3000/add-comment-lifestyle-blog/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user: "Anonymous", text: commentText })
            });

            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    // 🚩 Report blog
    window.reportBlog = async (id) => {
        if (!confirm("Are you sure you want to report this blog?")) return;
        try {
            const response = await fetch(`http://localhost:3000/report-lifestyle-blog/${id}`, {
                method: "PATCH"
            });
            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error reporting blog:", error);
        }
    };

    blogForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const token = localStorage.getItem("authToken"); // assuming you store auth token here
    // if (!token) {
    //     alert("Log in before proceeding.");
    //     return;
    // }

    // if (!token) {
    //     document.getElementById("loginPopup").style.display = "block";
    //     setTimeout(() => {
    //         window.location.href = "login.html"; // Redirect to login page
    //     }, 3000); // Give 3 seconds to let the popup show, then redirect
    //     return;
    // }


    // if (!token) {
    //     document.getElementById("loginPopup").style.display = "block";
    //     setTimeout(() => {
    //         window.location.href = "login.html"; // Redirect to login page
    //     }, 3000); // Wait for popup to show before redirecting
    //     return;
    // }
        const title = document.getElementById("blogTitle").value;
        const author = document.getElementById("blogAuthor").value;
        const content = document.getElementById("blogContent").value;

        const response = await fetch("http://localhost:3000/add-lifestyle-blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, content })
        });

        const result = await response.json();
        alert(result.message);
        blogForm.reset();
        fetchUserBlogs();
    });

    fetchUserBlogs();
});

window.addEventListener("load", () => {
    document.body.style.opacity = 0;
    setTimeout(() => {
        document.body.style.transition = "opacity 0.6s ease-in-out";
        document.body.style.opacity = 1;
    }, 100);
});

// function closePopup() {
//     document.getElementById("loginPopup").style.display = "none";
// }

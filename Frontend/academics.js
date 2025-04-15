document.addEventListener("DOMContentLoaded", () => {
    const blogForm = document.getElementById("blogForm");
    const blogsContainer = document.querySelector(".blogs");

    // Fetch and display blogs
    async function fetchBlogs() {
        try {
            const response = await fetch("http://localhost:3000/blogs"); // ✅ Fixed API endpoint
            const blogs = await response.json();

            blogsContainer.innerHTML = ""; // Clear previous data
            blogs.forEach((blog, index) => { // ✅ Use index as ID since backend lacks unique IDs
                blogsContainer.innerHTML += `
                    <div class="blog">
                        <div class="person">
                            <h4>${blog.title}</h4>
                            <p>${blog.author}</p>
                        </div>
                        <div class="content">${blog.content}</div>
                        <div class="blog-buttons">
                            <button onclick="editBlog(${index})">Edit</button> 
                            <button onclick="deleteBlog(${index})">Delete</button>
                        </div>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    }

    // Add a new blog
    blogForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const author = document.getElementById("blogAuthor").value;
        const content = document.getElementById("blogContent").value;

        try {
            const response = await fetch("http://localhost:3000/add-blog", { // ✅ Fixed API endpoint
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, content })
            });

            const result = await response.json();
            alert(result.message);
            blogForm.reset();
            fetchBlogs(); // Refresh blog list
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    });

    // Edit a blog
    window.editBlog = async (index) => { // ✅ Use index to target the blog
        const newTitle = prompt("Enter new title:");
        const newAuthor = prompt("Enter new author:");
        const newContent = prompt("Enter new content:");

        if (!newTitle || !newContent || !newAuthor) return alert("All fields are required!");

        try {
            const response = await fetch(`http://localhost:3000/update-blog/${index}`, { // ✅ Fixed API endpoint
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, author: newAuthor, content: newContent })
            });

            const result = await response.json();
            alert(result.message);
            fetchBlogs();
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    // Delete a blog
    window.deleteBlog = async (index) => { // ✅ Use index as ID
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const response = await fetch(`http://localhost:3000/delete-blog/${index}`, { // ✅ Fixed API endpoint
                method: "DELETE"
            });

            const result = await response.json();
            alert(result.message);
            fetchBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    fetchBlogs(); // Load blogs when the page loads
});

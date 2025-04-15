document.addEventListener("DOMContentLoaded", () => { 
    const blogForm = document.getElementById("blogForm");
    const userBlogsContainer = document.getElementById("userBlogs");

    async function fetchUserBlogs() {
        try {
            const response = await fetch("http://localhost:3000/blogs");
            const blogs = await response.json();

            userBlogsContainer.innerHTML = "";

            if (blogs.length === 0) {
                userBlogsContainer.innerHTML = "<p>No blogs found.</p>";
                return;
            }

            blogs.forEach((blog) => {
                userBlogsContainer.innerHTML += `
                    <article class="user-blog">
                        <h4>${blog.title}</h4>
                        <p><strong>By:</strong> ${blog.author}</p>
                        <p>${blog.content}</p>
                        <button onclick="editBlog(${blog.id}, '${blog.title.replace(/'/g, "\\'")}', '${blog.author.replace(/'/g, "\\'")}', '${blog.content.replace(/'/g, "\\'")}')">Edit</button>
                        <button onclick="deleteBlog(${blog.id})">Delete</button>
                    </article>
                `;
            });
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    }

    // Edit a blog
    window.editBlog = async (id, currentTitle = "", currentAuthor = "", currentContent = "") => {
        const newTitle = prompt("Enter new title:", currentTitle) || currentTitle;
        const newAuthor = prompt("Enter new author:", currentAuthor) || currentAuthor;
        const newContent = prompt("Enter new content:", currentContent) || currentContent;

        if (!newTitle || !newAuthor || !newContent) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/update-blog/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, author: newAuthor, content: newContent })
            });

            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    // Delete a blog
    window.deleteBlog = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const response = await fetch(`http://localhost:3000/delete-blog/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();
            alert(result.message);
            fetchUserBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
        }
    };

    fetchUserBlogs();
});







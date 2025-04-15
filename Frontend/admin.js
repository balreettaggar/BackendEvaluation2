// document.addEventListener("DOMContentLoaded", () => {
//   const adminBlogsContainer = document.getElementById("adminBlogs");

//   async function fetchAdminBlogs() {
//     try {
//       const response = await fetch("http://localhost:3000/admin/lifestyle-blogs");
//       const blogs = await response.json();

//       if (blogs.length === 0) {
//         adminBlogsContainer.innerHTML = "<p>No blogs found.</p>";
//       } else {
//         adminBlogsContainer.innerHTML = blogs.map(blog => `
//           <div class="blog-card" id="blog-${blog.id}">
//             <h2>${blog.title}</h2>
//             <div class="blog-details">
//               <p><strong>Author:</strong> ${blog.author}</p>
//               <p><strong>Description:</strong> ${blog.content}</p>
//               <p><strong>Date:</strong> ${new Date(blog.date).toLocaleString()}</p>
//               <p><strong>Likes:</strong> ${blog.likes} | <strong>Dislikes:</strong> ${blog.dislikes}</p>
//               <p><strong>Average Rating:</strong> ${blog.averageRating || "Not Rated Yet"}</p>
//               <div class="section-title">Comments:</div>
//               ${blog.comments && blog.comments.length > 0
//                 ? blog.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join("")
//                 : "<p>No comments yet.</p>"}
//               ${blog.ratings ? `<p><strong>All Ratings:</strong> ${blog.ratings.join(", ")}</p>` : ""}

//               <div class="admin-actions">
//                 <button class="delete-btn" onclick="AdminActions.delete(${blog.id})">Delete</button>
//               </div>
//             </div>
//           </div>
//         `).join("");
//       }
//     } catch (error) {
//       console.error("Error fetching admin blogs:", error);
//       adminBlogsContainer.innerHTML = "<p>Error loading blogs.</p>";
//     }
//   }

//   // Only delete action remains
//   window.AdminActions = {
//     delete: async (id) => {
//       if (confirm("Are you sure you want to delete this blog?")) {
//         try {
//           const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}`, {
//             method: "DELETE",
//           });

//           if (res.ok) {
//             document.getElementById(`blog-${id}`).remove();
//           } else {
//             alert("Failed to delete blog.");
//           }
//         } catch (err) {
//           console.error("Error deleting blog:", err);
//           alert("Error occurred while deleting.");
//         }
//       }
//     }
//   };

//   fetchAdminBlogs();
// });


//


// document.addEventListener("DOMContentLoaded", () => {
//   const adminBlogsContainer = document.getElementById("adminBlogs");

//   async function fetchAdminBlogs() {
//     try {
//       const response = await fetch("http://localhost:3000/admin/lifestyle-blogs");
//       const blogs = await response.json();

//       if (blogs.length === 0) {
//         adminBlogsContainer.innerHTML = "<p>No blogs found.</p>";
//       } else {
//         adminBlogsContainer.innerHTML = blogs.map(blog => `
//           <div class="blog-card" id="blog-${blog.id}" style="border: 2px solid ${blog.reported ? 'red' : '#ccc'}; padding: 10px; margin-bottom: 20px;">
//             <h2>${blog.title}</h2>
//             <div class="blog-details">
//               <p><strong>Blog ID:</strong> ${blog.id}</p>
//               <p><strong>Author:</strong> ${blog.author}</p>
//               <p><strong>Description:</strong> ${blog.content}</p>
//               <p><strong>Date:</strong> ${new Date(blog.date).toLocaleString()}</p>
//               <p><strong>Likes:</strong> ${blog.likes} | <strong>Dislikes:</strong> ${blog.dislikes}</p>
//               <p><strong>Average Rating:</strong> ${blog.averageRating || "Not Rated Yet"}</p>
//               <p><strong>Status:</strong> ${blog.reported ? "⚠️ Reported" : "✅ Clean"}</p>

//               <div class="section-title">Comments:</div>
//               ${blog.comments && blog.comments.length > 0
//                 ? blog.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join("")
//                 : "<p>No comments yet.</p>"}

//               ${blog.ratings ? `<p><strong>All Ratings:</strong> ${blog.ratings.join(", ")}</p>` : ""}

//               <div class="admin-actions" style="margin-top: 10px;">
//                 <button class="delete-btn" onclick="AdminActions.delete(${blog.id})">Delete</button>
//                 <button class="edit-btn" onclick="AdminActions.edit(${blog.id}, \`${blog.content.replace(/`/g, "\\`")}\`)">Edit</button>
//                 ${blog.reported ? `<button class="unreport-btn" onclick="AdminActions.unreport(${blog.id})">Mark as Clean</button>` : ""}
//               </div>
//             </div>
//           </div>
//         `).join("");
//       }
//     } catch (error) {
//       console.error("Error fetching admin blogs:", error);
//       adminBlogsContainer.innerHTML = "<p>Error loading blogs.</p>";
//     }
//   }

//   window.AdminActions = {
//     delete: async (id) => {
//       if (confirm("Are you sure you want to delete this blog?")) {
//         try {
//           const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}`, {
//             method: "DELETE",
//           });

//           if (res.ok) {
//             document.getElementById(`blog-${id}`).remove();
//           } else {
//             alert("Failed to delete blog.");
//           }
//         } catch (err) {
//           console.error("Error deleting blog:", err);
//           alert("Error occurred while deleting.");
//         }
//       }
//     },

//     edit: async (id, oldContent) => {
//       const newContent = prompt("Edit blog content:", oldContent);
//       if (newContent && newContent.trim() !== oldContent.trim()) {
//         try {
//           const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ content: newContent })
//           });

//           if (res.ok) {
//             alert("Blog updated successfully.");
//             fetchAdminBlogs();
//           } else {
//             alert("Failed to update blog.");
//           }
//         } catch (err) {
//           console.error("Error updating blog:", err);
//           alert("Error occurred while updating.");
//         }
//       }
//     },

//     unreport: async (id) => {
//       try {
//         const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}/unreport`, {
//           method: "PUT"
//         });

//         if (res.ok) {
//           alert("Blog marked as clean.");
//           fetchAdminBlogs();
//         } else {
//           alert("Failed to update report status.");
//         }
//       } catch (err) {
//         console.error("Error updating report status:", err);
//         alert("Error occurred while updating report status.");
//       }
//     }
//   };

//   fetchAdminBlogs();
// });


document.addEventListener("DOMContentLoaded", () => {
  const adminBlogsContainer = document.getElementById("adminBlogs");

  async function fetchAdminBlogs() {
    try {
      const response = await fetch("http://localhost:3000/admin/lifestyle-blogs");
      const blogs = await response.json();

      if (blogs.length === 0) {
        adminBlogsContainer.innerHTML = "<p>No blogs found.</p>";
      } else {
        adminBlogsContainer.innerHTML = blogs.map(blog => `
          <div class="blog-card" id="blog-${blog.id}" style="border: 2px solid ${blog.reported ? 'red' : '#ccc'}; padding: 10px; margin-bottom: 20px;">
            <h2>${blog.title}</h2>
            <div class="blog-details">
              <p><strong>Blog ID:</strong> ${blog.id}</p>
              <p><strong>Author:</strong> ${blog.author}</p>
              <p><strong>Description:</strong> ${blog.content}</p>
              <p><strong>Date:</strong> ${new Date(blog.date).toLocaleString()}</p>
              <p><strong>Likes:</strong> ${blog.likes} | <strong>Dislikes:</strong> ${blog.dislikes}</p>
              <p><strong>Average Rating:</strong> ${blog.averageRating || "Not Rated Yet"}</p>
              <p><strong>Status:</strong> ${blog.reported ? "⚠️ Reported" : "✅ Clean"}</p>

              <div class="section-title">Comments:</div>
              ${blog.comments && blog.comments.length > 0
                ? blog.comments.map(comment => `<p><strong>${comment.user}:</strong> ${comment.text}</p>`).join("")
                : "<p>No comments yet.</p>"}

              ${blog.ratings ? `<p><strong>All Ratings:</strong> ${blog.ratings.join(", ")}</p>` : ""}

              <div class="admin-actions" style="margin-top: 10px;">
                <button class="delete-btn" onclick="AdminActions.delete(${blog.id})">Delete</button>
                <button class="edit-btn" onclick="AdminActions.edit(${blog.id}, \`${blog.content.replace(/`/g, "\\`")}\`)">Edit</button>
                ${blog.reported ? `<button class="unreport-btn" onclick="AdminActions.unreport(${blog.id})">Mark as Clean</button>` : ""}
              </div>
            </div>
          </div>
        `).join("");
      }
    } catch (error) {
      console.error("Error fetching admin blogs:", error);
      adminBlogsContainer.innerHTML = "<p>Error loading blogs.</p>";
    }
  }

  window.AdminActions = {
    delete: async (id) => {
      if (confirm("Are you sure you want to delete this blog?")) {
        try {
          const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            document.getElementById(`blog-${id}`).remove();
          } else {
            alert("Failed to delete blog.");
          }
        } catch (err) {
          console.error("Error deleting blog:", err);
          alert("Error occurred while deleting.");
        }
      }
    },

    edit: async (id, oldContent) => {
      const newContent = prompt("Edit blog content:", oldContent);
      if (newContent && newContent.trim() !== oldContent.trim()) {
        try {
          const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ content: newContent })
          });

          if (res.ok) {
            alert("Blog updated successfully.");
            fetchAdminBlogs();
          } else {
            alert("Failed to update blog.");
          }
        } catch (err) {
          console.error("Error updating blog:", err);
          alert("Error occurred while updating.");
        }
      }
    },

    unreport: async (id) => {
      try {
        const res = await fetch(`http://localhost:3000/admin/lifestyle-blogs/${id}/unreport`, {
          method: "PUT"
        });

        if (res.ok) {
          alert("Blog marked as clean.");
          fetchAdminBlogs();
        } else {
          alert("Failed to update report status.");
        }
      } catch (err) {
        console.error("Error updating report status:", err);
        alert("Error occurred while updating report status.");
      }
    }
  };

  fetchAdminBlogs();
});
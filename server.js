const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const LIFESTYLE_FILE = "./lifestyle.json";
const ADMIN_FILE = "./admin.json";

// Ensure the JSON file exists
if (!fs.existsSync(LIFESTYLE_FILE)) {
    fs.writeFileSync(LIFESTYLE_FILE, "[]", "utf-8");
}

// Ensure admin.json exists
if (!fs.existsSync(ADMIN_FILE)) {
    fs.writeFileSync(ADMIN_FILE, "[]", "utf-8");
}

// Fetch all lifestyle blogs
app.get("/lifestyle-blogs", (req, res) => {
    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err || !data) return res.json([]);
        try {
            res.json(JSON.parse(data));
        } catch {
            res.status(500).json({ error: "Failed to parse blog data" });
        }
    });
});

app.patch("/report-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let blogs = JSON.parse(data);
        const blogIndex = blogs.findIndex(blog => blog.id === blogId);
        if (blogIndex === -1) return res.status(404).json({ error: "Blog not found" });

        blogs[blogIndex].reported = true;

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to report blog" });
            res.json({ message: "Blog reported successfully!" });
        });
    });
});


// Admin: Get all reported blogs
app.get("/admin/reported-lifestyle-blogs", (req, res) => {
    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read blog data" });

        const blogs = JSON.parse(data);
        const reportedBlogs = blogs.filter(blog => blog.reported);
        res.json(reportedBlogs);
    });
});


app.patch("/admin/unreport-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read blog data" });

        let blogs = JSON.parse(data);
        const blog = blogs.find(blog => blog.id === blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        blog.reported = false;

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to unreport blog" });
            res.json({ message: "Blog unreported successfully!" });
        });
    });
});


app.post("/add-lifestyle-blog", (req, res) => {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        let blogs = err || !data ? [] : JSON.parse(data);
        const newBlog = {
            id: Date.now(),
            title,
            author,
            content,
            likes: 0,
            dislikes: 0,
            comments: [],
            ratings: [],
            averageRating: null,
            date: new Date().toISOString()
        };

        blogs.push(newBlog);
        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to save blog" });

            // 🔄 Now write to admin.json as well
            fs.readFile(ADMIN_FILE, "utf-8", (err, adminData) => {
                let adminBlogs = err || !adminData ? [] : JSON.parse(adminData);
                adminBlogs.push(newBlog);
                fs.writeFile(ADMIN_FILE, JSON.stringify(adminBlogs, null, 2), "utf-8", (err) => {
                    if (err) return res.status(500).json({ error: "Blog added to lifestyle but failed to update admin!" });
                    res.status(201).json({ message: "Blog added successfully!", blog: newBlog });
                });
            });
        });
    });
});


// Like a blog
app.patch("/like-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let blogs = JSON.parse(data);
        const blogIndex = blogs.findIndex((blog) => blog.id === blogId);
        if (blogIndex === -1) return res.status(404).json({ error: "Blog not found" });

        blogs[blogIndex].likes += 1;

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to update likes" });
            res.json({ message: "Blog liked!", likes: blogs[blogIndex].likes });
        });
    });
});

// Dislike a blog
app.patch("/dislike-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let blogs = JSON.parse(data);
        const blogIndex = blogs.findIndex((blog) => blog.id === blogId);
        if (blogIndex === -1) return res.status(404).json({ error: "Blog not found" });

        blogs[blogIndex].dislikes += 1;

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to update dislikes" });
            res.json({ message: "Blog disliked!", dislikes: blogs[blogIndex].dislikes });
        });
    });
});

// Edit a blog
app.patch("/edit-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const { title, content, author } = req.body;

    if (!author) return res.status(400).json({ error: "Author is required for editing" });

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let blogs = JSON.parse(data);
        const blog = blogs.find(blog => blog.id === blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        if (blog.author !== author) {
            return res.status(403).json({ error: "Unauthorized: Only the author can edit this blog" });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to update blog" });
            res.json({ message: "Blog updated successfully!" });
        });
    });
});


// Delete a blog
// Delete a blog
app.delete("/delete-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const { author } = req.body;

    if (!author) return res.status(400).json({ error: "Author is required for deleting" });

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let blogs = JSON.parse(data);
        const blog = blogs.find(blog => blog.id === blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        if (blog.author !== author) {
            return res.status(403).json({ error: "Unauthorized: Only the author can delete this blog" });
        }

        const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(updatedBlogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete blog" });
            res.json({ message: "Blog deleted successfully!" });
        });
    });
});


// Add a comment
app.post("/add-comment-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const { user, text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Comment cannot be empty" });
    }

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        let blogs = JSON.parse(data);
        const blog = blogs.find(blog => blog.id === blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        blog.comments.push({ user: user || "Anonymous", text });

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            res.json({ message: "Comment added!" });
        });
    });
});

// Rate a blog
app.post("/rate-lifestyle-blog/:id", (req, res) => {
    const blogId = parseInt(req.params.id);
    const { rating } = req.body; // Expect rating from 1 to 5

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Invalid rating. Please provide a rating between 1 and 5." });
    }

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read data" });

        let blogs = JSON.parse(data);
        const blog = blogs.find(blog => blog.id === blogId);
        if (!blog) return res.status(404).json({ error: "Blog not found" });

        if (!blog.ratings) {
            blog.ratings = [];
        }

        blog.ratings.push(rating);
        blog.averageRating = (blog.ratings.reduce((a, b) => a + b, 0) / blog.ratings.length).toFixed(1);

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(blogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to update rating" });
            res.json({ message: "Rating submitted!", averageRating: blog.averageRating });
        });
    });
});

// Admin: Get all blogs with full details
app.get("/admin/lifestyle-blogs", (req, res) => {
    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err || !data) {
            return res.status(500).json({ error: "Failed to read blog data" });
        }
        try {
            const blogs = JSON.parse(data);
            res.json(blogs);
        } catch (error) {
            res.status(500).json({ error: "Failed to parse blog data" });
        }
    });
});

// Admin: Edit a blog
app.put('/admin/lifestyle-blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id);
    const { content } = req.body;
  
    fs.readFile('./lifestyle.json', 'utf-8', (err, data) => {
      if (err) return res.status(500).send('Error reading file');
  
      const blogs = JSON.parse(data);
      const blogIndex = blogs.findIndex(b => b.id === blogId);
  
      if (blogIndex === -1) return res.status(404).send('Blog not found');
  
      blogs[blogIndex].content = content;
  
      fs.writeFile('./lifestyle.json', JSON.stringify(blogs, null, 2), (err) => {
        if (err) return res.status(500).send('Error writing file');
        res.send('Blog updated successfully');
      });
    });
  });
  

  app.put('/admin/lifestyle-blogs/:id/unreport', (req, res) => {
    const blogId = parseInt(req.params.id);
  
    fs.readFile('./lifestyle.json', 'utf-8', (err, data) => {
      if (err) return res.status(500).send('Error reading file');
  
      const blogs = JSON.parse(data);
      const blogIndex = blogs.findIndex(b => b.id === blogId);
  
      if (blogIndex === -1) return res.status(404).send('Blog not found');
  
      blogs[blogIndex].reported = false;
  
      fs.writeFile('./lifestyle.json', JSON.stringify(blogs, null, 2), (err) => {
        if (err) return res.status(500).send('Error writing file');
        res.send('Blog marked as clean');
      });
    });
  });
  


// Admin: Delete a blog
app.delete("/admin/lifestyle-blogs/:id", (req, res) => {
    const blogId = parseInt(req.params.id);

    fs.readFile(LIFESTYLE_FILE, "utf-8", (err, data) => {
        if (err) return res.status(500).json({ error: "Failed to read blog data" });

        let blogs = JSON.parse(data);
        const blogExists = blogs.some(blog => blog.id === blogId);
        if (!blogExists) return res.status(404).json({ error: "Blog not found" });

        const updatedBlogs = blogs.filter(blog => blog.id !== blogId);

        fs.writeFile(LIFESTYLE_FILE, JSON.stringify(updatedBlogs, null, 2), "utf-8", (err) => {
            if (err) return res.status(500).json({ error: "Failed to delete blog" });
            res.json({ message: "Blog deleted successfully!" });
        });
    });
});


const ADMIN_CREDENTIALS = {
    username: "admin",
    password: "admin123",
};

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        // Admin credentials are correct, send a response to redirect to the admin page
        return res.json({ message: "Login successful!", role: "admin" });
    }

    // Optionally, check for regular users here (you can extend this later)
    fs.readFile(USERS_FILE, "utf-8", (err, data) => {
        let users = err || !data ? [] : JSON.parse(data);
        const user = users.find(user => user.username === username && user.password === password);

        if (!user) {
            return res.status(401).json({ error: "Invalid username or password!" });
        }

        // Send user role information for regular users (if you want to handle it)
        res.json({ message: "Login successful!", role: "user" });
    });
});


// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


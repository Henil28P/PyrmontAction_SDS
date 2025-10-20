<template>
  <div class="editorial-dashboard">
    <h2>Blog Management</h2>

    <!-- Add Blog -->
    <section class="add-blog">
      <h3>Add Blog</h3>
      <input
        v-model="title"
        placeholder="Blog Title"
        class="input"
        type="text"
      />
      <textarea
        v-model="content"
        placeholder="Blog Content"
        class="textarea"
      ></textarea>
      <button @click="addBlog" class="btn">Submit Blog</button>
    </section>

    <!-- Blog List -->
    <section class="blog-list">
      <h3>All Blogs</h3>
      <div v-if="blogs.length === 0">No blogs found.</div>
      <div
        v-for="blog in blogs"
        :key="blog._id"
        class="blog-item"
      >
        <h4>{{ blog.title }}</h4>
        <p>{{ blog.content }}</p>
        <p>Status: {{ blog.status }}</p>
        <div class="actions">
          <button
            v-if="blog.status !== 'approved'"
            @click="approveBlog(blog._id)"
            class="btn-approve"
          >
            Approve
          </button>
          <button @click="deleteBlog(blog._id)" class="btn-delete">
            Delete
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import editorialServices from "../editorialServices";

export default {
  name: "BlogManagement",
  data() {
    return {
      blogs: [],
      title: "",
      content: "",
      token: localStorage.getItem("token"),
    };
  },
  methods: {
    async fetchBlogs() {
      try {
        const res = await editorialServices.getAllBlogs(this.token);
        this.blogs = res.data;
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    },
    async addBlog() {
      try {
        await editorialServices.createBlog(this.token, {
          title: this.title,
          content: this.content,
        });
        this.title = "";
        this.content = "";
        this.fetchBlogs();
      } catch (err) {
        console.error("Error creating blog:", err);
      }
    },
    async approveBlog(id) {
      try {
        await editorialServices.approveBlog(this.token, id);
        this.fetchBlogs();
      } catch (err) {
        console.error("Error approving blog:", err);
      }
    },
    async deleteBlog(id) {
      if (!confirm("Are you sure you want to delete this blog?")) return;
      try {
        await editorialServices.deleteBlog(this.token, id);
        this.fetchBlogs();
      } catch (err) {
        console.error("Error deleting blog:", err);
      }
    },
  },
  mounted() {
    this.fetchBlogs();
  },
};
</script>

<style scoped>
.editorial-dashboard {
  padding: 20px;
}
.blog-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}
.btn {
  margin-top: 10px;
}
.actions button {
  margin-right: 10px;
}
</style>

<template>
  <div class="blogs-admin">
    <div class="blogs-hero">
      <div class="hero-text-block">
        <h1 class="hero-title">Blogs Admin</h1>
      </div>
    </div>

    <div class="blogs-container">
      <!-- Tabs -->
      <div class="tabs">
        <button 
          @click="activeTab = 'pending'" 
          :class="['tab-button', { active: activeTab === 'pending' }]"
        >
          Pending ({{ pendingBlogs.length }})
        </button>
        <button 
          @click="activeTab = 'approved'" 
          :class="['tab-button', { active: activeTab === 'approved' }]"
        >
          Approved ({{ approvedBlogs.length }})
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading">
        <p>Loading blogs...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="empty-state">
        <p>{{ error }}</p>
        <button @click="fetchBlogs" class="retry-button">Try Again</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="currentBlogs.length === 0" class="empty-state">
        <p>No {{ activeTab }} blogs found.</p>
      </div>

      <!-- Blogs Grid -->
      <div v-else class="blogs-grid">
        <BlogCardAdmin 
          v-for="(blog, index) in currentBlogs" 
          :key="blog._id" 
          :blog="blog"
          :style="{ '--animation-order': index }"
          @view="handleViewBlog"
          @approve="handleApproveBlog"
          @delete="handleDeleteBlog"
        />
      </div>
    </div>

    <!-- View Blog Modal -->
    <Teleport to="body">
      <div v-if="selectedBlog" class="modal-overlay" @click="selectedBlog = null">
        <div class="modal-content blog-view-modal" @click.stop>
          <button @click="selectedBlog = null" class="close-button">×</button>
          
          <h2 class="blog-title">{{ selectedBlog.title }}</h2>
          
          <div class="blog-meta">
            <span class="meta-author">{{ selectedBlog.author || 'Anonymous' }}</span>
            <span class="meta-separator">·</span>
            <span class="meta-date">{{ formatDate(selectedBlog.createdAt) }}</span>
            <span class="meta-separator">·</span>
            <span class="meta-status" :class="selectedBlog.status">{{ selectedBlog.status }}</span>
          </div>

          <div v-if="selectedBlog.imageUrl" class="blog-image-wrapper">
            <img 
              :src="`${SERVER_URL}${selectedBlog.imageUrl}`" 
              :alt="selectedBlog.title"
              class="blog-image" 
            />
          </div>

          <div class="blog-content">
            <p>{{ selectedBlog.content }}</p>
          </div>

          <div v-if="selectedBlog.status === 'pending'" class="modal-actions">
            <button @click="handleApproveBlog(selectedBlog)" class="btn-approve">
              Approve Blog
            </button>
            <button @click="handleDeleteBlog(selectedBlog)" class="btn-delete">
              Delete Blog
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BlogCardAdmin from '../components/Blogs/BlogCardAdmin.vue'
import api from '../../../services/api.js'
import SERVER_URL from '../../../config.js'
import { useUserStore } from '../../../stores/authStore.js'

const authStore = useUserStore()

const activeTab = ref('pending')
const blogs = ref([])
const selectedBlog = ref(null)
const loading = ref(false)
const error = ref(null)

const pendingBlogs = computed(() => blogs.value.filter(b => b.status === 'pending'))
const approvedBlogs = computed(() => blogs.value.filter(b => b.status === 'approved'))

const currentBlogs = computed(() => {
  return activeTab.value === 'pending' ? pendingBlogs.value : approvedBlogs.value
})

const fetchBlogs = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get('api/blogs/', authStore.token)
    blogs.value = Array.isArray(response) ? response : (response.data || [])
  } catch (err) {
    console.error('Error fetching blogs:', err)
    error.value = 'Failed to load blogs. Please try again later.'
  } finally {
    loading.value = false
  }
}

const handleViewBlog = (blog) => {
  selectedBlog.value = blog
}

const handleApproveBlog = async (blog) => {
  if (!confirm(`Approve blog "${blog.title}"?`)) return
  
  try {
    await api.put(`api/blogs/${blog._id}/approve`, {}, authStore.token)
    alert('Blog approved successfully!')
    selectedBlog.value = null
    await fetchBlogs()
  } catch (err) {
    console.error('Error approving blog:', err)
    alert('Failed to approve blog. Please try again.')
  }
}

const handleDeleteBlog = async (blog) => {
  if (!confirm(`Delete blog "${blog.title}"? This cannot be undone.`)) return
  
  try {
    await api.delete(`api/blogs/${blog._id}`, authStore.token)
    alert('Blog deleted successfully!')
    selectedBlog.value = null
    await fetchBlogs()
  } catch (err) {
    console.error('Error deleting blog:', err)
    alert('Failed to delete blog. Please try again.')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
@keyframes subtleBackgroundZoom {
  0% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes slideFadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.blogs-admin {
  min-height: 100vh;
  background: #fafafa;
  padding-top: 0;
}

.blogs-hero {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 3rem;
  background-color: #EBBD6D;
}

.blogs-hero::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/Gallery/header_image.png');
  background-size: cover;
  background-position: center;
  z-index: 1;
  animation: subtleBackgroundZoom 25s ease-in-out infinite alternate;
  transition: transform 0.5s ease-out, filter 0.5s ease-out;
}

.blogs-hero::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(235, 189, 109, 0.3), rgba(235, 189, 109, 0.2)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 80%);
  pointer-events: none;
  z-index: 2;
  transition: background 0.5s ease-out;
}

.hero-text-block {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 40%;
  background: linear-gradient(135deg, rgba(235, 189, 109, 0.9), rgba(208, 137, 39, 0.9));
  clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 3rem 0 2rem;
  box-sizing: border-box;
  z-index: 3;
  backdrop-filter: blur(3px);
  box-shadow: inset -3px 0 8px rgba(255, 255, 255, 0.1), 0 5px 15px rgba(0, 0, 0, 0.15);
  animation: slideFadeInLeft 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s backwards;
  transition: background 0.4s ease-out, transform 0.4s ease-out;
}

.hero-title {
  font-family: 'League Spartan', sans-serif;
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
  letter-spacing: 1.5px;
  color: #fff;
  text-shadow: 3px 3px 8px rgba(140, 75, 0, 0.4);
  animation: fadeIn 1.2s ease-out 0.6s backwards;
  transition: transform 0.4s ease-out;
}

.blogs-hero:hover::before {
  transform: scale(1.03);
}

.blogs-hero:hover::after {
  background: linear-gradient(rgba(235, 189, 109, 0.2), rgba(235, 189, 109, 0.1)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 85%);
}

.blogs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.tabs {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  border-bottom: 2px solid #e8e8e8;
}

.tab-button {
  background: none;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #6b6b6b;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #242424;
}

.tab-button.active {
  color: #EBBD6D;
  border-bottom-color: #EBBD6D;
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 18px;
}

.retry-button {
  margin-top: 16px;
  background: #fff;
  color: #334155;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.retry-button:hover {
  border-color: #EBBD6D;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 32px;
  color: #6b6b6b;
  cursor: pointer;
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f5f5f5;
  color: #242424;
}

.blog-title {
  font-size: 32px;
  font-weight: 700;
  color: #242424;
  margin: 0 0 16px 0;
  line-height: 1.2;
  padding-right: 40px;
}

.blog-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 14px;
}

.meta-author {
  color: #242424;
  font-weight: 500;
}

.meta-separator {
  color: #d0d0d0;
}

.meta-date {
  color: #6b6b6b;
}

.meta-status {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.meta-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.meta-status.approved {
  background: #d1fae5;
  color: #065f46;
}

.blog-image-wrapper {
  margin-bottom: 24px;
}

.blog-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.blog-content {
  margin-bottom: 32px;
}

.blog-content p {
  color: #242424;
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-approve,
.btn-delete {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-approve {
  background: #10b981;
  color: white;
}

.btn-approve:hover {
  background: #059669;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}

@media (max-width: 992px) {
  .hero-text-block {
    width: 45%;
    padding: 0 1.5rem 0 2.5rem;
  }
  .hero-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .blogs-hero {
    height: 250px;
  }
  .hero-text-block {
    width: 55%;
    clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
    padding: 0 2rem 0 1.5rem;
  }
  .hero-title {
    font-size: 2.5rem;
  }

  .tabs {
    overflow-x: auto;
  }

  .modal-content {
    padding: 24px;
  }

  .blog-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .blogs-hero {
    height: 200px;
  }
  .hero-text-block {
    width: 70%;
    clip-path: polygon(25% 0, 100% 0, 100% 100%, 0% 100%);
    padding: 0 1.5rem 0 1rem;
    backdrop-filter: blur(2px);
  }
  .hero-title {
    font-size: 2rem;
    letter-spacing: 1px;
  }
}
</style>

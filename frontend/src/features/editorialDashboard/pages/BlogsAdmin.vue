<template>
  <div class="blogs-wrapper">
    <div class="blogs-header">
      <h2 class="main-title">Blog Management</h2>
      <p class="subtitle">Review, approve, and manage blog submissions</p>
    </div>

    <div class="tabs-container">
      <button 
        @click="activeTab = 'pending'" 
        :class="['tab-button', { active: activeTab === 'pending' }]"
      >
        <span class="tab-text">Pending</span>
        <span class="tab-badge">{{ pendingBlogs.length }}</span>
      </button>
      <button 
        @click="activeTab = 'approved'" 
        :class="['tab-button', { active: activeTab === 'approved' }]"
      >
        <span class="tab-text">Approved</span>
        <span class="tab-badge">{{ approvedBlogs.length }}</span>
      </button>
    </div>

    <div class="tab-content">
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
.blogs-wrapper {
  background: white;
  border-radius: 0;
  border: none;
  box-shadow: none;
  padding: 0;
  margin: 0;
}

.blogs-header {
  padding: 24px 24px 20px;
  border-bottom: 1px solid #f3f4f6;
}

.main-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.subtitle {
  margin: 6px 0 0 0;
  color: #6b7280;
  font-size: 14px;
}

.tabs-container {
  display: flex;
  gap: 0;
  background: #f9fafb;
  padding: 0 24px;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  background: transparent;
  border: none;
  padding: 14px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #111827;
  background: rgba(0, 0, 0, 0.02);
}

.tab-button.active {
  color: #059669;
  border-bottom-color: #059669;
  background: white;
}

.tab-text {
  font-size: 14px;
}

.tab-badge {
  background: #e5e7eb;
  color: #374151;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
}

.tab-button.active .tab-badge {
  background: #d1fae5;
  color: #065f46;
}

.tab-content {
  padding: 24px;
  min-height: 400px;
}

.loading,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 16px;
}

.retry-button {
  margin-top: 16px;
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.retry-button:hover {
  border-color: #059669;
  color: #059669;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
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

@media (max-width: 768px) {
  .blogs-header {
    padding: 20px 16px 16px;
  }

  .main-title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .tabs-container {
    padding: 0 16px;
    overflow-x: auto;
  }

  .tab-button {
    padding: 12px 16px;
    font-size: 13px;
  }

  .tab-content {
    padding: 16px;
  }

  .blogs-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .modal-content {
    padding: 24px;
  }

  .blog-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 12px;
  }

  .tab-badge {
    padding: 1px 8px;
    font-size: 11px;
  }
}
</style>

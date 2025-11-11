<template>
  <div class="blogs-page">
    <div class="blogs-hero">
      <div class="hero-text-block">
        <h1 class="hero-title">Blogs</h1>
      </div>
    </div>

    <div class="blogs-container">
      <!-- Blog Details View -->
      <BlogDetails 
        v-if="selectedBlog" 
        :blog="selectedBlog" 
        @close="selectedBlog = null" 
      />

      <!-- Blog List View -->
      <div v-else>
        <!-- Create Blog Button -->
        <div class="blog-actions">
          <RouterLink :to="{ name: 'BlogSubmit' }" class="btn-create-blog">
            Create Blog Post
          </RouterLink>
          <button @click="showEditModal = true" class="btn-edit-blog">
            Edit Blog with Code
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
        <div v-else-if="blogs.length === 0" class="empty-state">
          <p>No blogs published yet. Check back soon!</p>
        </div>

        <!-- Blogs Grid -->
        <div v-else class="blogs-grid">
          <BlogCard 
            v-for="(blog, index) in blogs" 
            :key="blog._id" 
            :blog="blog"
            :style="{ '--animation-order': index }"
            @select="handleSelectBlog" 
          />
        </div>
      </div>
    </div>

    <!-- Edit Blog Modal -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Edit Blog with Code</h3>
            <button @click="closeEditModal" class="close-btn">&times;</button>
          </div>
          
          <div class="modal-body">
            <p class="modal-instruction">Enter the submission code you received when you created the blog:</p>
            
            <input 
              v-model="editCode" 
              type="text" 
              placeholder="Enter your blog code"
              class="code-input"
              @keyup.enter="submitEditCode"
            />
            
            <p v-if="editError" class="error-message">{{ editError }}</p>
          </div>

          <div class="modal-actions">
            <button @click="closeEditModal" class="btn-cancel">Cancel</button>
            <button @click="submitEditCode" class="btn-submit" :disabled="!editCode.trim()">
              Continue to Edit
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BlogCard from '../components/BlogCard.vue'
import BlogDetails from '../components/BlogDetails.vue'
import api from '../../../services/api.js'

const router = useRouter()

const blogs = ref([])
const selectedBlog = ref(null)
const loading = ref(false)
const error = ref(null)
const showEditModal = ref(false)
const editCode = ref('')
const editError = ref(null)

const fetchBlogs = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api.get('api/blogs/approved')
    console.log('API Response:', response)
    blogs.value = Array.isArray(response) ? response : (response.data || [])
    console.log('Fetched blogs:', blogs.value)
  } catch (err) {
    console.error('Error fetching blogs:', err)
    error.value = 'Failed to load blogs. Please try again later.'
  } finally {
    loading.value = false
  }
}

const handleSelectBlog = (blog) => {
  selectedBlog.value = blog
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closeEditModal = () => {
  showEditModal.value = false
  editCode.value = ''
  editError.value = null
}

const submitEditCode = async () => {
  if (!editCode.value.trim()) {
    editError.value = 'Please enter a valid code'
    return
  }

  editError.value = null

  try {
    // Verify the edit code exists
    console.log('Attempting to fetch blog with code:', editCode.value.trim())
    const response = await api.get(`api/blogs/edit/${editCode.value.trim()}`)
    
    console.log('API Response:', response)
    
    if (response && response._id) {
      // Navigate to edit page with the blog data
      router.push({ 
        name: 'BlogEdit', 
        params: { code: editCode.value.trim() }
      })
    } else {
      editError.value = 'Invalid code. Please check and try again.'
    }
  } catch (err) {
    console.error('Error verifying edit code:', err)
    if (err.response) {
      console.log('Error response:', err.response)
      editError.value = err.response.data?.message || 'Invalid code or blog not found.'
    } else {
      editError.value = 'Invalid code or blog not found. Please check your submission code.'
    }
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>

<style scoped>
@keyframes subtleBackgroundZoom {
  0% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.blogs-page {
  min-height: calc(100vh - 85px);
  background: #fafafa;
  padding-top: 85px;
}

.blogs-hero {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
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
  background: linear-gradient(rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3)),
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
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(6, 182, 212, 0.9));
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
  text-shadow: 3px 3px 8px rgba(0, 70, 60, 0.4);
  animation: fadeIn 1.2s ease-out 0.6s backwards;
  transition: transform 0.4s ease-out;
}

.blogs-hero:hover::before {
  transform: scale(1.03);
}

.blogs-hero:hover::after {
  background: linear-gradient(rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2)),
              radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 85%);
}

.blogs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.blog-actions {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.btn-create-blog {
  background: #242424;
  color: #ffffff;
  padding: 10px 20px;
  border: 1px solid #242424;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-create-blog:hover {
  background: #000000;
  border-color: #000000;
}

.btn-create-blog:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(36, 36, 36, 0.1);
}

.btn-edit-blog {
  background: white;
  color: #374151;
  padding: 10px 20px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-edit-blog:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.blogs-page__header {
  margin-bottom: 50px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.blogs-page__title {
  font-size: 42px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.blogs-page__subtitle {
  font-size: 18px;
  color: #64748b;
  margin: 0;
}

.btn-create {
  background: #06b6d4;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-create:hover {
  background: #0891b2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
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
  border-color: #10b981;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
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

  .blog-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-create-blog {
    width: 100%;
  }
  
  .btn-edit-blog {
    width: 100%;
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

/* Edit Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 28px;
  width: 480px;
  max-width: 92vw;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-body {
  margin-bottom: 24px;
}

.modal-instruction {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.6;
}

.code-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.code-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
  margin-bottom: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancel {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-submit {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #059669;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


<template>
  <div class="blog-edit-page">
    <div class="edit-container">
      <div class="edit-header">
        <button @click="goBack" class="back-button">
          <span>←</span> Back to Blogs
        </button>
        <h1 class="page-title">Edit Blog Post</h1>
        <p class="page-subtitle">Update your blog and resubmit for approval</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <p>Loading blog...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="goBack" class="btn-back">Return to Blogs</button>
      </div>

      <!-- Edit Form -->
      <div v-else-if="blog" class="edit-form">
        <div class="form-section">
          <div class="form-group">
            <label for="title">Blog Title *</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="Enter an engaging title for your blog"
              class="text-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="content">Content *</label>
            <textarea
              id="content"
              v-model="formData.content"
              placeholder="Share your thoughts, experiences, or insights..."
              class="textarea-input"
              rows="12"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Current Image</label>
            <div v-if="blog.image" class="current-image-preview">
              <img :src="getImageUrl(blog.image)" alt="Current blog image" />
            </div>
            <p v-else class="no-image-text">No image uploaded</p>
          </div>

          <div class="form-group">
            <label for="image">Update Image (Optional)</label>
            <input
              id="image"
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              class="file-input"
            />
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="New image preview" />
              <button @click="removeImage" class="remove-image-btn">Remove New Image</button>
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="showAuthorField" />
              <span>I want to remain anonymous</span>
            </label>
          </div>

          <div v-if="!showAuthorField" class="form-group">
            <label for="author">Author Name *</label>
            <input
              id="author"
              v-model="formData.author"
              type="text"
              placeholder="Your name"
              class="text-input"
              :required="!showAuthorField"
            />
          </div>
        </div>

        <div class="form-actions">
          <button @click="handleSubmit" class="btn-submit" :disabled="submitting">
            {{ submitting ? 'Updating...' : 'Update Blog' }}
          </button>
          <button @click="goBack" class="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
        <div class="modal-content success-modal" @click.stop>
          <h2 class="success-title">Blog Updated Successfully!</h2>
          <p class="success-subtitle">Pending Approval...</p>
          <p class="success-message">
            Your blog has been updated and resubmitted for admin review. 
            It will be published once approved.
          </p>

          <button @click="closeSuccessModal" class="btn-return">
            Return to Blogs
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../../../services/api.js'
import config from '../../../config.js'

const router = useRouter()
const route = useRoute()

const blog = ref(null)
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const showSuccessModal = ref(false)

const formData = ref({
  title: '',
  content: '',
  author: '',
  status: 'pending'
})

const showAuthorField = ref(false)
const imageFile = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

const fetchBlog = async () => {
  const code = route.params.code
  
  if (!code) {
    error.value = 'No edit code provided'
    loading.value = false
    return
  }

  try {
    const response = await api.get(`api/blogs/edit/${code}`)
    
    if (response && response._id) {
      blog.value = response
      formData.value = {
        title: response.title || '',
        content: response.content || '',
        author: response.author || '',
        status: 'pending'
      }
      showAuthorField.value = response.author === 'Anonymous'
    } else {
      error.value = 'Blog not found or invalid code'
    }
  } catch (err) {
    console.error('Error fetching blog:', err)
    error.value = 'Failed to load blog. Please check your code and try again.'
  } finally {
    loading.value = false
  }
}

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!formData.value.title || !formData.value.content) {
    alert('Please fill in all required fields')
    return
  }

  if (!showAuthorField.value && !formData.value.author) {
    alert('Please enter your name or check the anonymous option')
    return
  }

  submitting.value = true

  try {
    const submitData = new FormData()
    submitData.append('title', formData.value.title)
    submitData.append('content', formData.value.content)
    submitData.append('author', showAuthorField.value ? 'Anonymous' : formData.value.author)
    submitData.append('status', 'pending')
    
    if (imageFile.value) {
      submitData.append('image', imageFile.value)
    }

    const response = await api.put(`api/blogs/edit/${route.params.code}`, submitData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (response) {
      showSuccessModal.value = true
    }
  } catch (err) {
    console.error('Error updating blog:', err)
    alert('Failed to update blog. Please try again.')
  } finally {
    submitting.value = false
  }
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `${config.API_BASE_URL}/${imagePath}`
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push({ name: 'Blogs' })
}

const goBack = () => {
  router.push({ name: 'Blogs' })
}

onMounted(() => {
  fetchBlog()
})
</script>

<style scoped>
.blog-edit-page {
  min-height: calc(100vh - 200px);
  padding: 60px 20px;
  background: #f8fafc;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
}

.edit-header {
  margin-bottom: 40px;
}

.back-button {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-button:hover {
  background: #f8fafc;
  border-color: #10b981;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error-state p {
  color: #ef4444;
  font-size: 16px;
  margin-bottom: 20px;
}

.btn-back {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #059669;
}

.edit-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.text-input,
.textarea-input {
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.2s;
}

.text-input:focus,
.textarea-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.textarea-input {
  resize: vertical;
  min-height: 200px;
  line-height: 1.6;
}

.current-image-preview {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  max-width: 400px;
}

.current-image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.no-image-text {
  color: #9ca3af;
  font-size: 14px;
  font-style: italic;
  margin: 0;
}

.file-input {
  padding: 8px 0;
  font-size: 14px;
}

.image-preview {
  margin-top: 16px;
  border: 2px solid #10b981;
  border-radius: 6px;
  overflow: hidden;
  max-width: 400px;
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.remove-image-btn {
  width: 100%;
  padding: 8px;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-image-btn:hover {
  background: #fecaca;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-submit {
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 15px;
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

.btn-cancel {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f9fafb;
}

/* Success Modal */
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

.success-modal {
  background: white;
  border-radius: 8px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #10b981;
  margin: 0 0 12px 0;
}

.success-subtitle {
  font-size: 14px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
}

.success-message {
  font-size: 15px;
  color: #374151;
  line-height: 1.6;
  margin-bottom: 32px;
}

.btn-return {
  width: 100%;
  padding: 14px 24px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-return:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .edit-form {
    padding: 24px;
  }

  .page-title {
    font-size: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%;
  }
}
</style>

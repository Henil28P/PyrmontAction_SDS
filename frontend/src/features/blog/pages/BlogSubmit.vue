<template>
  <div class="blog-submit-page">
    <div class="container">
      <!-- Back Button -->
      <button @click="goBack" class="back-button">
        ← Back to Blogs
      </button>

      <h1 class="page-title">Create Blog Post</h1>

      <form @submit.prevent="handleSubmit" class="blog-form">
        <!-- Title -->
        <div class="form-group">
          <label for="title">Title <span class="required">*</span></label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="Enter blog title"
            required
          />
        </div>

        <!-- Body/Content -->
        <div class="form-group">
          <label for="content">Body <span class="required">*</span></label>
          <textarea
            id="content"
            v-model="formData.content"
            placeholder="Write your blog content..."
            rows="10"
            required
            maxlength="2000"
          ></textarea>
          <div class="char-count">
            {{ formData.content.length }}/2000 characters
          </div>
        </div>

        <!-- Image Upload -->
        <div class="form-group">
          <label for="image">Image <span class="required">*</span></label>
          <div class="image-upload-area">
            <input
              id="image"
              type="file"
              accept="image/*"
              @change="handleImageChange"
              ref="fileInput"
              required
            />
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
              <button type="button" @click="removeImage" class="remove-image">×</button>
            </div>
            <div v-else class="upload-placeholder">
              <span>📷</span>
              <p>Upload Image</p>
            </div>
          </div>
        </div>

        <!-- Author Checkbox -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="showAuthorField" />
            <span>Add my name as Author</span>
          </label>
        </div>

        <!-- Author Name (conditional) -->
        <div v-if="showAuthorField" class="form-group">
          <label for="author">Author</label>
          <input
            id="author"
            v-model="formData.author"
            type="text"
            placeholder="Your name"
          />
        </div>

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Submit Post' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Review/Confirm Modal -->
    <Teleport to="body">
      <div v-if="showReviewModal" class="modal-overlay" @click="showReviewModal = false">
        <div class="modal-content review-modal" @click.stop>
          <h2 class="modal-title">Review Submission</h2>
          
          <div class="review-section">
            <label class="review-label">Title:</label>
            <div class="review-value">{{ formData.title }}</div>
          </div>

          <div class="review-section">
            <label class="review-label">Body:</label>
            <div class="review-value content-preview">{{ formData.content }}</div>
          </div>

          <div v-if="imagePreview" class="review-section">
            <label class="review-label">Image:</label>
            <div class="review-image-wrapper">
              <img :src="imagePreview" alt="Blog image" class="review-image" />
            </div>
          </div>

          <div class="review-section">
            <label class="review-label">Author:</label>
            <div class="review-value">{{ formData.author || 'Anonymous' }}</div>
          </div>

          <div class="modal-actions">
            <button @click="showReviewModal = false" class="btn-cancel">Cancel</button>
            <button @click="confirmSubmit" class="btn-submit-modal" :disabled="submitting">
              {{ submitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Success Modal with Edit Code -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
        <div class="modal-content success-modal" @click.stop>
          <h2 class="success-title">Blog Submission Successful!</h2>
          <p class="success-subtitle">Pending Approval...</p>
          <p class="edit-instruction">
            Remember the submission code to edit the blog before it gets approved
          </p>
          
          <div class="edit-code-box">
            <div class="edit-code-text">{{ editCode }}</div>
          </div>

          <button @click="closeSuccessModal" class="btn-return">
            Return to Blogs
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../../services/api.js'

const router = useRouter()

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
const submitting = ref(false)
const showReviewModal = ref(false)
const showSuccessModal = ref(false)
const editCode = ref('')

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

const handleSubmit = () => {
  // Validate that an image is uploaded
  if (!imageFile.value) {
    alert('Please upload an image for your blog post')
    return
  }
  showReviewModal.value = true
}

const confirmSubmit = async () => {
  submitting.value = true
  
  try {
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.value.title)
    formDataToSend.append('content', formData.value.content)
    formDataToSend.append('author', formData.value.author || 'Anonymous')
    formDataToSend.append('status', 'pending')
    
    if (imageFile.value) {
      formDataToSend.append('file', imageFile.value)
    }

    const response = await api.postFormData('api/blogs/', formDataToSend)
    
    console.log('Blog submission response:', response)
    editCode.value = response.editCode || response.data?.editCode
    showReviewModal.value = false
    showSuccessModal.value = true
    
    // Reset form
    formData.value = {
      title: '',
      content: '',
      author: '',
      status: 'pending'
    }
    showAuthorField.value = false
    removeImage()
    
  } catch (error) {
    console.error('Error submitting blog:', error)
    const errorMsg = error.response?.data?.message || error.message || 'Failed to submit blog. Please try again.'
    alert(errorMsg)
  } finally {
    submitting.value = false
  }
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
  router.push({ name: 'Blogs' })
}

const goBack = () => {
  router.push({ name: 'Blogs' })
}
</script>

<style scoped>
.blog-submit-page {
  min-height: calc(100vh - 200px);
  padding: 60px 20px;
  background: #f8fafc;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.back-button {
  background: none;
  border: 1px solid #e5e7eb;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s ease;
  margin-bottom: 30px;
  font-weight: 600;
}

.back-button:hover {
  background: #f8fafc;
  border-color: #10b981;
  color: #1e293b;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 30px;
}

.blog-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #334155;
  font-size: 14px;
}

.required {
  color: #ef4444;
}

.form-group input[type="text"],
.form-group textarea {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #06b6d4;
}

.char-count {
  font-size: 13px;
  color: #64748b;
  text-align: right;
}

.image-upload-area {
  position: relative;
  min-height: 200px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
}

.image-upload-area:hover {
  border-color: #06b6d4;
}

.image-upload-area input[type="file"] {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  text-align: center;
  color: #94a3b8;
}

.upload-placeholder span {
  font-size: 48px;
  display: block;
  margin-bottom: 8px;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 6px;
}

.remove-image {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
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
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-actions {
  margin-top: 20px;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #06b6d4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0891b2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
  text-align: center;
}

.review-section {
  margin-bottom: 20px;
}

.review-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.review-value {
  color: #475569;
  line-height: 1.6;
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.content-preview {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 200px;
  overflow-y: auto;
}

.review-image-wrapper {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.review-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 4px;
  object-fit: contain;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.btn-cancel {
  flex: 1;
  padding: 12px 24px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-submit-modal {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit-modal:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-submit-modal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Modal */
.success-modal {
  text-align: center;
  max-width: 550px;
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.success-subtitle {
  color: #64748b;
  margin-bottom: 20px;
  font-size: 16px;
}

.edit-instruction {
  color: #334155;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.edit-code-box {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 32px;
}

.edit-code-text {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  user-select: all;
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

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 24px;
  }

  .page-title {
    font-size: 24px;
  }
}
</style>

<template>
  <section
      class="ask-us-hero fade-in"
      role="region"
      aria-labelledby="askUsTitle"
  >
    <div class="hero-overlay"></div>

    <div class="hero-content">
      <!-- Large heading  -->
      <h1 id="askUsTitle" class="ask-us-title">Send A Message</h1>

      <!-- Glass-like card with form -->
      <div class="form-card">
        <div
            v-if="submitted && !error"
            class="success-message"
            role="status"
            aria-live="polite"
        >
          Thank you for contacting us! Weâ€™ll get back to you soon.
        </div>

        <div
            v-if="submitted && error"
            class="error-message"
            role="status"
            aria-live="polite"
        >
          You have entered some wrong information in the form. Please try again.
        </div>

        <form @submit.prevent="handleSubmit" novalidate>
          <!-- First Name -->
          <div class="form-group">
            <label for="firstName">First name</label>
            <input
                v-model="form.firstName"
                id="firstName"
                type="text"
                :class="{'error-message-input-box': errorMessageForm.firstNameError}"
            />
          </div>

          <!-- Last Name -->
          <div class="form-group">
            <label for="lastName">Last name</label>
            <input
                v-model="form.lastName"
                id="lastName"
                type="text"
                :class="{'error-message-input-box': errorMessageForm.lastNameError}"
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="email">Email address</label>
            <input
                v-model="form.email"
                id="email"
                type="email"
                :class = "{'error-message-input-box': errorMessageForm.emailError}"
            />
          </div>

          <!-- Message -->
          <div class="form-group">
            <label for="message">Your message</label>
            <textarea
                v-model="form.message"
                id="message"
                rows="5"
                :class = "{'error-message-input-box': errorMessageForm.messageError}"
            ></textarea>
          </div>

          <!-- Full-width submit button -->
          <button
              type="submit"
              class="submit-btn"
              :disabled="submitting"
          >
            {{ submitting ? 'Submitting...' : 'Submit' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import contactUsAPIServices from '../services/contactServices'


const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  message: ''
})

const errorMessageForm = ref({
  firstNameError: false,
  lastNameError: false,
  emailError: false,
  messageError: false
})

const error = ref(false)
const submitted = ref(false)
const submitting = ref(false)

function processErrors(errors) {
  errorMessageForm.value.messageError = errors.includes("message");
  errorMessageForm.value.emailError = errors.includes("email");
  errorMessageForm.value.firstNameError = errors.includes("firstName");
  errorMessageForm.value.lastNameError = errors.includes("lastName");
}

async function handleSubmit() {
  submitted.value = false;

  try {
    errorMessageForm.value = {
      firstNameError: false,
      lastNameError: false,
      emailError: false,
      messageError: false,
    };
    submitting.value = true;
    error.value = false;

    const result = await contactUsAPIServices.sendInquiry(form.value);
    submitted.value = true;

    if (!result.ok) {
      processErrors(result.errors || []);
      error.value = true;
    } else {
      // success
      form.value = { firstName: "", lastName: "", email: "", message: "" };
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    // Unexpected runtime error (should be rare since service normalizes axios errors)
    console.error("Unexpected submission error:", err);
    error.value = true;
  } finally {
    submitting.value = false;
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@700&family=Inter:wght@400&display=swap');

/* Hero section */
.ask-us-hero {
  background: url('@/assets/Contact/pyrmont_harbour2.jpg') center/cover no-repeat;
  min-height: 80vh;
  position: relative;
  padding: 2rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Gradient overlay for background */
.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  /* Slightly transparent gradient overlay to enhance color depth */
  background: linear-gradient(
      rgba(0, 0, 0, 0.5),
      rgba(0, 0, 0, 0.7)
  );
  z-index: 1;
}

/* Container for heading + form in a centered column */
.hero-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.ask-us-title {
  font-family: 'League Spartan', sans-serif;
  font-size: 4rem;
  color: #fff;
  margin: 0;
  text-align: center;
  text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
  transition: transform 0.3s ease;
}

.form-card {
  /* Glassmorphism background */
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);

  max-width: 480px;
  width: 100%;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.success-message {
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  color: #2e7d32;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  animation: popIn 0.5s ease;
}


.error-message {
  background-color: #f5e9e8;
  border: 1px solid #e6cdc8;
  color: #bb0e05;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-align: center;
  animation: popIn 0.5s ease;
}

.error-message-input-box{
  border: 1px solid #c52d2d;
}


@keyframes popIn {
  0% {
    transform: scale(0.95);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-family: 'Inter', sans-serif;
  color: #fff;
}



input, textarea {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  font-size: 1rem;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  background-color: rgba(255,255,255,0.2);
  color: #fff;
  outline: none;
  transition: border 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
textarea:focus {
  border: 1px solid #fff;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
}

::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.submit-btn {
  width: 100%;
  background-color: #EBBD6D;
  color: #fff;
  font-family: 'League Spartan', sans-serif;
  font-weight: 700;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background-color: #ebae45;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 1s forwards ease-in-out;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: none;
  }
}

@media (max-width: 768px) {
  .ask-us-title {
    font-size: 3rem;
  }
  .form-card {
    padding: 1.5rem;
  }
}
</style>

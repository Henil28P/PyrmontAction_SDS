<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/auth';

const loginInput = ref({
    email: '',
    password: ''
});

const router = useRouter();
const authStore = useAuthStore();
const loginErrors = ref('');
const isLoading = ref(false);

const handleSubmit = async() => {
    try {
        loginErrors.value = '';
        isLoading.value = true;

        const result = await authStore.login(loginInput.value);
        
        if (result.success) {
            // Redirect based on user role
            if (authStore.isAdmin) {
                await router.push('/admin');
            } else if (authStore.isMember) {
                await router.push('/member');
            } else {
                await router.push('/');
            }
        } else {
            loginErrors.value = result.message || 'Login failed';
        }
    } catch (error) {
        console.error('Login error:', error);
        loginErrors.value = 'An unexpected error occurred. Please try again.';
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <head>
        <link href='https://fonts.googleapis.com/css?family=Manrope' rel='stylesheet'>
    </head>
    <body>
        <div class="login-form">
         
            <div class="login-form-left-side">
                <div class="left-side-content">
                    <div class="headings">

                        <span id="welcome-heading">Welcome back</span>
                        <span id="enter-details-description">Please enter your details</span>
                    </div>
                    <form class="login-entries" @submit.prevent="handleSubmit">
        
                        <div class="email-section">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="loginInput.email" required />
                        </div>
                        <div class="password-section">
                            <label for="password">Password</label>
                            <input type="password" id="password" v-model="loginInput.password" required />
                        </div>
                        <div class="error-and-forgot-password-section">
                            <span v-if="loginErrors" id="error-message">{{ loginErrors }}</span>
                            <a href="link" id="forgot-password-link"> Forgot Password </a>
                        </div>
                        
                        <button id="submitBtn" type="submit" :disabled="isLoading">
                            {{ isLoading ? 'Signing In...' : 'Sign In' }}
                        </button>

                        <div class="signup-container">
                            <span id="signup-text"> Don't have an account &nbsp</span>
                            <a id="signup-link" href="/joinus"> Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
            <div class="login-right-side">

            </div>
        </div>
    </body>

</template>


<style scoped>
    .login-form{
        display:inline-block;
        column-count: 2;
        width: 100vw;
        height: 87vh;
        column-gap: 0px;
        font-family: 'Inter', sans-serif;
        padding-bottom: 0px;
        
    }

    .login-entries{
        position: relative;
        margin:0rem 5rem 0rem 5rem;
        padding-top: 5vh;
    }

    .login-right-side{
        background-image: url("../../../assets/boat.jpeg");
        height: 87vh;
        margin: 0px;
        width: 50vw;
        align-items: center;
        background-size: cover;
        background-repeat: no-repeat;


    }

    .login-form-left-side{
        height:100%;
        margin: 0px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .email-section, .password-section{
        display: flex;
        flex-direction: column;
        font-size: small;
        font-weight: 300;
    }
    .login-form-left-side{
        padding-top: 10vh;
    }


    #signup-text{
        font-weight: 500;
        color: #828282;
    }
  
    .signup-container{
        display: flex;
        position: relative;
        font-size:small;
        justify-content: center;

    }

    .headings{
        position: relative;
        display: flex;
        flex-direction: column;
        padding: 2rem 5rem 0rem 5rem;
    
    }

    #forgot-password-link, #signup-link{
        display: flex;
        justify-self: right;
        font-size: small;
        font-family: 'Manrope', sans-serif;
        color: #41A6F5;
        font-weight: 550;
        grid-column: 2;
    }

    #password, #email{
        border: 1px solid #cbc8c8;
        border-radius: 5px;
        height:35px;
        margin-bottom:20px;
       
    }
    
    #welcome-heading{
        font-weight: bold;
        font-size: 40px;
        margin-bottom: 2px;

    }
    #enter-details-description{
        color: #828282;
        font-size: small;
        font-weight: medium;
        padding-left: 5px;
    }

    #submitBtn{
        position: relative;
        background-color: #ebae45;
        border: 0px;
        color: #FFFF;
        border-radius: 3px;
        margin: 50px 0px 25px 0px;
        height: 35px;
        width: 100%;
        font-size: small;
        font-family: 'Manrope', sans-serif;
        font-weight: bold;
    }

    .error-and-forgot-password-section{
        display:grid;
        grid-template-columns: repeat(2, 1fr);
        column-gap: 5px;
        
    }


    #error-message{
        color: red;
        text-align: left;
        font-size: small;
        grid-column: 1;

    }




 
</style>
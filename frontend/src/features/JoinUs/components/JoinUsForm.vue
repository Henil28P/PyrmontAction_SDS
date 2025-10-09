<script setup>
    import joinUsService from '../services/joinUsAuthService';
    import { computed, ref} from 'vue';
    import { useRouter } from 'vue-router';
    import useVuelidate from '@vuelidate/core';
    import { required, helpers, email, minLength, maxLength, numeric } from '@vuelidate/validators';

    const stateChosen = ref('Default');
    const stateOptions = ref([
        {text: 'State', value: "Default", placeholder: true},
        {text: 'NSW', value: "NSW", placeholder: false},
        {text: 'SA', value: "SA", placeholder: false},
        {text: 'WA', value: "WA", placeholder: false},
        {text: 'NT', value: "NT", placeholder: false},
        {text: 'QLD', value: "QLD", placeholder: false},
        {text: 'VIC', value: "VIC", placeholder: false},
        {text: 'TAS', value: "TAS", placeholder: false}
    ]);

    // Form Data Structure
    const formData = ref({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        mobilePhone: '',
        areaOfInterest: '',
        streetName: '',
        city: '',
        state: '',
        postcode: ''
    });

    function passwordCheck(){
        passwordValidator.value.minlength = formData.value.password.length >= 10;
        passwordValidator.value.uppercase = /[A-Z]/.test(formData.value.password);
        passwordValidator.value.lowercase = /[a-z]/.test(formData.value.password);
        passwordValidator.value.number = /[0-9]/.test(formData.value.password);
        passwordValidator.value.symbols = /[!@#$%^&*()/?]/.test(formData.value.password);
    }

    // Custom validator for vuelidator module
    const validNumber = helpers.withMessage(
      'Must be exactly 10 digits, start with 04',
      (value) => /^[0-9]{10}$/.test(value) && value.startsWith('04')
    );
    
    const stateValidator = helpers.withMessage(
      'State is required',
      (value) => value !== 'Default'
    );

    // Update the rules object
    const rules = computed(() => {
        return {
            email: { 
                required: helpers.withMessage('Email is required', required), 
                email: helpers.withMessage('Please enter a valid email address', email) 
            },
            password: {required: helpers.withMessage('Password is required', required)},
            firstName: { required: helpers.withMessage('First name is required', required) },
            lastName: { required: helpers.withMessage('Last name is required', required) },
            mobilePhone: { 
              validNumber: validNumber
            },
            areaOfInterest: { required: helpers.withMessage('Area of interest is required', required) },
            streetName: { required: helpers.withMessage('Street name is required', required) },
            city: { required: helpers.withMessage('City name is required', required) },
            state: { stateValidator: stateValidator },
            postcode: { 
                required: helpers.withMessage('Postcode is required', required),
                numeric: numeric,
                minLength: minLength(4),
                maxLength: maxLength(4)
             },
        };
    });

    // Vuelidate Variables
    const v$ = useVuelidate(rules, formData);

    const passwordValidator = ref({
        minlength: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbols: false,
    });



    const router = useRouter();

    const handleSubmit = async () => {
        try {
            formData.value.state = stateChosen.value;

            const result = await v$.value.$validate();
            console.log("Validation result:", result);
            console.log("Validation state:", v$.value);

            if (result) {
                await joinUsService.joinus(formData.value); // Create user successfully

                // ✅ After successful signup, call backend to create Stripe Checkout session
                const paymentResponse = await fetch("http://localhost:5000/api/payments/create-checkout-session", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: formData.value.email }),
                });

                const paymentSession = await paymentResponse.json();

                // ✅ If Stripe session created successfully → redirect user to Stripe payment page
                if (paymentSession?.url) {
                  window.location.href = paymentSession.url;
                  return; // stop here so router.push doesn’t run
                } else {
                  console.error("Stripe session not created:", paymentSession);
                  await router.push("/login"); // fallback if Stripe fails
                }
            }

        } catch (error) {
            console.error(error);
        }
    };
</script>

<template>
    <body>
        <div class="signup-container">
            <div class="signup-form-container">
                <form class="sign-entries" @submit.prevent="handleSubmit">
                    <h1 id="create-an-account-heading"> Become a member</h1>

                    <h2>Login Details</h2>
                    <div class="login-details-section">
                        <div class ="field">
                            <input id="email" placeholder="Email address" v-model="formData.email" :class="{'error-border': v$.email.$errors.length > 0}"/>
                            <span v-for="error in v$.email.$errors" class="error-message email-border">{{ error.$message }}</span>
                        </div>

                        <div class="field">
                            <input type="password" id="password" @input="passwordCheck" placeholder="Password" v-model="formData.password" :class="{'error-border': v$.password.$errors.length > 0}" />
                            <span v-for="error in v$.password.$errors" class="error-message password-border">{{ error.$message }}</span>
                            <ul class="password-requirement-section">
                                <li :class="{'password-accept': passwordValidator.minlength}">At least 10 characters</li>
                                <li :class="{'password-accept': passwordValidator.uppercase}">At least one upper-case letter</li>
                                <li :class="{'password-accept': passwordValidator.lowercase}">At least one lower-case letter</li>
                                <li :class="{'password-accept': passwordValidator.number}">At least one digit</li>
                                <li :class="{'password-accept': passwordValidator.symbols}">At least one symbol</li>
                            </ul>
                        </div>
                    </div>

                    <h2>Personal Details</h2>
                    <div class="personal-details-section">
                        <div class="name-section">
                            <div class="field">
                                <input type="text" id="first-name" v-model="formData.firstName" placeholder="First Name" :class="{'error-border': v$.firstName.$errors.length > 0}" />
                                <span v-for="error in v$.firstName.$errors" class="error-message">{{ error.$message }}</span>
                            </div>

                            <div class="field">
                                <input type="text" id="last-name" v-model="formData.lastName" placeholder="Last Name" :class="{'error-border': v$.lastName.$errors.length > 0}" />
                                <span v-for="error in v$.lastName.$errors" class="error-message">{{ error.$message }}</span>
                            </div>
                        </div>

                        <div class="other-personal-info-section">
                            <div class="field">
                                <input type="tel" id="mobile-phone" v-model="formData.mobilePhone" placeholder="Mobile Phone" :class="{'error-border': v$.mobilePhone.$errors.length > 0}" />
                                <span v-for="error in v$.mobilePhone.$errors" class="error-message">{{ error.$message }}</span>
                            </div>
                            <div class="field">
                                <input type="text" v-model="formData.areaOfInterest" :class="{'error-border': v$.areaOfInterest.$errors.length > 0}" id="areaOfInterestTextArea" placeholder="Area of Interest">
                                <span v-for="error in v$.areaOfInterest.$errors" class="error-message">{{ error.$message }}</span>
                            </div>
                        </div>
                    </div>

                    <h2>Address Details</h2>
                    <div class="address-details-section">
                        <div class="field">
                            <input type="text" id="street-name" :class="{'error-border': v$.streetName.$errors.length > 0}" v-model="formData.streetName" placeholder="Street Name"/>
                            <span v-for="error in v$.streetName.$errors" class="error-message">{{ error.$message }}</span>
                        </div>

                        <div class="state-and-city-row">
                            <div class="field">
                                <input type="text" id="city" :class="{'error-border': v$.city.$errors.length > 0}" v-model="formData.city" placeholder="City"/>
                                <span v-for="error in v$.city.$errors" class="error-message">{{ error.$message }}</span>
                            </div> 

                            <div class="field">
                                <select v-model="stateChosen" id="state" :class="v$.state.$errors.length > 0 ? 'error-border' : 'input-valid'" required>
                                    <option v-for="state in stateOptions" :value="state.value" :disabled="state.placeholder" :hidden="state.placeholder">
                                        {{ state.text }}
                                    </option>
                                </select>
                                <span v-for="error in v$.state.$errors" class="error-message">{{ error.$message }}</span>
                            </div>
                        </div>

                        <div class="field">
                            <input type="text" id="postcode" v-model="formData.postcode" placeholder="Postcode" :class="{'error-border': v$.postcode.$errors.length > 0}"/>
                            <span v-for="error in v$.postcode.$errors" class="error-message">{{ error.$message }}</span>
                        </div>
                    </div>
                    <button id="submitBtn" type="submit">Sign Up</button>
                </form>
            </div>
        </div>
    </body>
</template>

<style scoped>
   
    .error-message{
        color: #c90e21;
        font-size: small;
        margin:0px;
        display: block; /* ensure each error appears on its own line */
        margin-top: 4px; /* small gap between errors */
    }
    .error-border{
        border: 1px solid #c90e21;
    }
    .input-valid{
        border: 1px solid #cbc8c8;
    }
    body{
        background-color: #F8F8F8;
        height: 140vh;
        /* padding-bottom: 1500px; */
        padding-bottom: 150vh;
    }
    .signup-container{
        min-height: 120vh;
        display: flex;
        justify-content: center;
        background-color: #F8F8F8;
    }

    
    .signup-form-container{
        display: flex;
        padding: 3rem;
        width: 50%;
        min-height:100vh;
        justify-content: center;
        /* align-items: center; */
        /* max-height: 100vh; */
        box-sizing: border-box;
        background-color: white;
        border-radius: 5px;
        margin-top: 1rem;
        margin-bottom: 20px;
        
    }

    .sign-entries{
        width: 100%;
        min-height: 100%;
        
    }



    .login-details-section{
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    
    }

    ::placeholder{
        font-family: 'Inter', sans-serif;
        font-size: small;
        padding-left: 0.5rem;
    }



    h2{
      color: #EBBD6D;
      font-size: large;
      margin-bottom: 10px;
    }

    h3{
        color: #3A474E;
        font-size: large;
    }


    input, select{
        border-radius: 3px;
        border: 1px solid;
        background-color: #F8F8F8;
        border-color: #cbc8c8;
        height: 35px;
        width:100%;
    }
    
    

    h1{
        color: #ebae45;
        margin-bottom: 30px;
    }
  
    
    select{
        height: 35px;
        font-family: 'Inter', sans-serif;
        font-size: small;
        padding-left: 0.5rem;
        color: grey;
    }

    .field{
        padding: 0px;
        
        margin-bottom: 20px;
    }
  
    .name-section{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(1, 1fr);
        column-gap: 10px;
        margin-top: 10px;
        
    }
    .state-and-city-row{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(1, 1fr);
        column-gap: 10px;
    
    }

    
    #areaOfInterestTextArea{
        resize: none;
    }
    .password-accept{
        color: green;
        
    }
    .password-requirement-section{
        list-style-type: none;
        margin: 0;
        padding: 0;
        padding-top: 2px;
        font-size: 9px;
        color: #c90e21;
    }

    #submitBtn{
        position: relative;
        background-color: #ebae45;
        border: 0px;
        color: #FFFF;
        border-radius: 3px;
        margin: 30px 0px 25px 0px;
        height: 35px;
        width: 100%;
        font-size: small;
        font-family: 'Manrope', sans-serif;
        font-weight: bold;
    }

</style>

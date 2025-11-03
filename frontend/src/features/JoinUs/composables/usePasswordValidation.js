import { ref } from 'vue';

export function usePasswordValidation() {
  const passwordValidator = ref({
    minlength: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbols: false,
  });

  const validatePassword = (password) => {
    passwordValidator.value.minlength = password.length >= 10;
    passwordValidator.value.uppercase = /[A-Z]/.test(password);
    passwordValidator.value.lowercase = /[a-z]/.test(password);
    passwordValidator.value.number = /[0-9]/.test(password);
    passwordValidator.value.symbols = /[!@#$%^&*()/?]/.test(password);
  };

  return {
    passwordValidator,
    validatePassword,
  };
}
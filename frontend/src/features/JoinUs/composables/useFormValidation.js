import { ref, computed } from 'vue';
import useVuelidate from '@vuelidate/core';
import { getValidationRules } from './useValidationRules';

export function useFormValidation() {
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
    postcode: '',
  });

  const stateChosen = ref('Default');

  const rules = computed(() => getValidationRules());
  const v$ = useVuelidate(rules, formData);

  return {
    formData,
    stateChosen,
    v$,
  };
}
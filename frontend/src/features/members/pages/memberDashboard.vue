<script>
import { useRouter } from 'vue-router';
import memberServices  from '../services/memberServices'
import router from '@/router';
export default {
  data() {
    return {
      memberFirstName: "",
      memberLastName: "",
      memberPhoneNumber: "",
      memberPostCode: ""

    };
  },
  async created(){
    const router = useRouter();

    if(!localStorage.getItem('refreshToken')){
      await router.push("/login")
    }
  },
  async mounted() {
    const router = useRouter();

    try{
      const accessToken = await localStorage.getItem('accessToken');
      const response = await memberServices.memberDisplay(accessToken);
      // const memberData = await response.json();
      if(!response.ok || response.memberInfo.role_id !== 1){
        await router.push("/login")
      }
      else{
        this.memberFirstName = response.memberInfo.firstName;
        this.memberLastName = response.memberInfo.lastName;
        this.memberPhoneNumber = response.memberInfo.mobilePhone;
        this.memberPostCode = response.memberInfo.state;
      }
    }
    catch(error){
      await router.push("/login")
    }
    
  },

  methods: {
    logout(){
      localStorage.clear();
      router.push('/login')
    }
  }
};

</script>



<style scoped>
  
</style>

<template>
  <div class="">
    <h1>Member Dashboard</h1>
    <p>First Name: {{ memberFirstName }}</p>
    <p>Last Name: {{ memberLastName }}</p>
    <p>Phone Number: {{ memberPhoneNumber }}</p>
    <p>Postcode: {{ memberPostCode }}</p>
    <button @click="logout">Sign Out</button>
  </div>
</template>

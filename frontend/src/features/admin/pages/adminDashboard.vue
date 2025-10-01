<script>
    import { useRouter } from 'vue-router';
    import adminService from '../services/adminServices'
    import router from '@/router';

export default {
  data() {
    return {
      adminFirstName: "",
      adminLastName: "",
      adminPhoneNumber: "",
      adminPostCode: ""

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
      const response = await adminService.adminDisplay(accessToken);
      // const adminData = await response.json();
      if(!response.ok || response.adminInfo.role_id !== 0){
        await router.push("/login")
      }
      else{
        this.adminFirstName = response.adminInfo.firstName;
        this.adminLastName = response.adminInfo.lastName;
        this.adminPhoneNumber = response.adminInfo.mobilePhone;
        this.adminPostCode = response.adminInfo.state;
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



<template>
  <div class="">
    <h1>Admin Dashboard</h1>
    <p>First Name: {{ adminFirstName }}</p>
    <p>Last Name: {{ adminLastName }}</p>
    <p>Phone Number: {{ adminPhoneNumber }}</p>
    <p>Postcode: {{ adminPostCode }}</p>
    <button @click="logout">Sign Out</button>
  </div>
</template>

<style scoped>
  
</style>

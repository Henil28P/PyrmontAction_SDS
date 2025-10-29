<template>
    <div class="footer">
        

        <div class="footer-body">
            <div class="column-first">
                <div class="logo">
                    <router-link :to="{ name: 'home'}"><img src="../assets/logo-inverted.png" alt="image"></router-link>
                </div>
                <div class="social-media">
                    <a href="https://www.facebook.com/people/Pyrmont-Action/100066510758084/#" target="_blank" rel="noopener noreferrer" class="facebook">
                        <i class="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="https://www.instagram.com/pyrmontaction/" target="_blank" rel="noopener noreferrer" class="instagram">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                </div>
            </div>
            <div class="column">
                <h1>Our Partners</h1>
                <a href="https://pyrmontultimolandcare.org.au/" target="_blank" rel="noopener noreferrer">
                    Pyrmont Ultimo Landcare
                </a>
                <a href="https://jacksonslanding.net.au/" target="_blank" rel="noopener noreferrer">
                    Jacksons Landing
                </a>
            </div>
            <div class="column">
                <h1>Gallery</h1>
                <div class="gallery">
                    <img  v-for="image in images" :key="image.image_id" :src="`${SERVER_URL}${image.imageUrl}`" :alt="image.caption">
                </div>
            </div>
            <div class="column">
                <h1>Contact Us</h1>
                <div class="contact-us-body">
                    <p>
                        <i class="fa-solid fa-location-dot"></i> 79A John St, Pyrmont NSW 2009
                    </p>
                    <p>
                        <i class="fa-solid fa-phone"></i> (+61) 414 997 089
                    </p>
                    <p>
                        <i class="fa-solid fa-envelope"></i> convenor@pyrmontaction.org.au
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import galleryService from '../features/gallery/services/galleryServices'
import SERVER_URL from '@/config';
const images = ref([])

try{
    async function fetchData(){
        const response = await galleryService.getAllImages();
        images.value = response.slice(-8);
        console.log(images.value)
    }
    fetchData();
}
catch(error){
  console.log(error)
}
</script>

<style lang="css">
.footer {
    position: relative;
}

.acknowledgement {
  position: absolute;
  bottom: 43vh;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background: #EBBD6D;
  color: white;
  text-align: center;
  line-height: 100px;
  z-index: 10;
  padding: 10px;
  border-radius: 10px;
}

.acknowledgement h1 {
    font-size: 30px;
    font-weight: 400;
}

.acknowledgement p {
    font-size: 14px;
    line-height: 1.5;
    opacity: 100%;
    color: #fff;
}

.footer-body {
    background-color:#222222;
    height: 50vh;
    padding: 90px;
    display: flex;
    justify-content: space-between;
}

.footer .column {
    display: inline-block;
    width: 35%;
    border-left: 3px solid #EBBD6D;
    padding-left: 20px;
}

.footer .column-first {
    display: inline-block;
    width: 35%;
    opacity:100%;
    justify-content: center;
}

.footer-body h1 {
    text-transform: uppercase;
    font-size: 18px;
    padding-top: 8px;
    color: #ffff;
    padding-bottom: 10px;
    font-weight: 400;
}

.footer .logo {
    display: flex;
    align-items: center;
}

.footer .logo img {
    width: 100%;
    transition: .5s ease all;
}

.footer .social-media {
    display: flex;
    gap: 10px;
    padding-top: 10px;
    padding-left: 25%;
}

.footer-body p {
    font-size: 14px;
    line-height: 1.5;
    opacity: 60%;
    color: #fff;
}

.footer a {
    display: block;
    text-decoration: none;
    transition: .5s ease all;
    font-size: 14px;
    line-height: 2.0;
    opacity: 60%;
    color: #fff;
    padding-top: 2px;
}

.footer a:hover {
    color: #EBBD6D;
}

.footer i {
    opacity: 100%;
}

.footer .facebook,
.footer .instagram {
    cursor: pointer;
    display: flex !important;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    color: #fff;
    background-color: #000;
}

.footer .facebook:hover,
.footer .instagram:hover {
    background-color: #fff;
    color: #000;
}

.contact-us-body i {
    color: #fff;
    padding-top: 2px;
    padding-right: 5px
}

.gallery {
    width: 80%;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.gallery img {
    width: 50px;
    height: 50px;
    object-fit: cover;
}
</style>
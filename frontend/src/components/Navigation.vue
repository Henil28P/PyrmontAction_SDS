<script setup>
import { useUserStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import {logout} from '@/services/authServices';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    // Clear token from store
    userStore.logout();
    // Redirect to login page
    await router.push('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

console.log('Is Authenticated:', userStore.isAuthenticated);
</script>

<!-- src/components/Navigation.vue -->
<template>
  <header class="site-header">
    <nav>
      <div class="logo">
        <RouterLink :to="{ name: 'home' }">
          <img src="@/assets/logo.png" alt="Pyrmont logo" />
        </RouterLink>
      </div>

      <ul class="navigation">
        <li><RouterLink class="link" :to="{ name: 'about' }">About Us</RouterLink></li>
        <li><RouterLink class="link" :to="{ name: 'Events' }">Events</RouterLink></li>
        <li><RouterLink class="link" :to="{ name: 'Blogs' }">Blogs</RouterLink></li>
        <li class="dropdown">
          <span class="link">Projects ▾</span>
          <ul class="dropdown-menu">
            <li><RouterLink class="link" :to="{ name: 'projects', params: { projectType: 'open' }}">Open Projects</RouterLink></li>
            <li><RouterLink class="link" :to="{ name: 'projects', params: { projectType: 'closed' }}">Closed Projects</RouterLink></li>
          </ul>
        </li>
        <li><RouterLink class="link" :to="{ name: 'gallery' }">Gallery</RouterLink></li>
        <li><RouterLink class="link" :to="{ name: 'contact' }">Contact</RouterLink></li>
        <li v-if="!userStore.isAuthenticated">
          <RouterLink class="link" :to="{ name: 'Join Us' }">Join Us</RouterLink>
        </li>
        <li v-if="!userStore.isAuthenticated">
          <RouterLink class="login" :to="{ name: 'Login' }">Login</RouterLink>
        </li>
        <li v-if="userStore.isAuthenticated && userStore.getRole === 'member'">
          <RouterLink class="link" :to="{ name: 'memberDashboard' }">My Account</RouterLink>
        </li>
        <li v-if="userStore.isAuthenticated && (userStore.getRole === 'admin')">
          <RouterLink class="link" :to="{ name: 'adminDashboard' }">My Account</RouterLink>
        </li>
        <li v-if="userStore.isAuthenticated && userStore.getRole === 'editor'">
          <RouterLink class="link" :to="{ name: 'editorDashboard' }">My Account</RouterLink>
        </li>
        <li v-if="userStore.isAuthenticated">
          <button class="link logout-btn" @click="handleLogout">Logout</button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="css">
header {
  background-color: #fff;
  height: 85px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  transition: 0.4s ease all;
}

nav {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  height: 48px;
  width: auto;
  transition: 0.3s ease all;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  display: flex;
  align-items: center;
}

.link,
.login {
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  text-decoration: none;
  color: #222;
  border-bottom: 2px solid transparent;
  transition: 0.25s ease;
}

nav .link:hover {
    color: #EBBD6D;
    border-color: #EBBD6D;
}

.login {
  border: 1px solid #000;
  border-radius: 6px;
  padding: 6px 14px;
  font-weight: 600;
  transition: 0.25s ease;
}

nav .login:hover {
    background-color: #EBBD6D;
    border-color: #EBBD6D;
    color: #fff;
}

nav .logo {
    display: flex;
    align-items: center;
}

nav .logo img {
    width: 300px;
    transition: .5s ease all;
}

nav .navigation {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: flex-end;
}

nav .dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  list-style: none;
  z-index: 1000;
}

nav .dropdown:hover .dropdown-menu {
  display: block;
}

nav .dropdown-menu li {
  padding: 8% 8%;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
}
</style>

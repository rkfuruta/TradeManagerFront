<script setup>
import LoginForm from '../components/LoginForm.vue'
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
</script>

<template>
    <main :class="{ 'guest': !user }">
        <LoginForm v-if="!user"/>
    </main>
</template>

<style scoped>
.main-content main.guest {
    display: flex;
    justify-content: center;
}
</style>
<template>
    <div class="user-dropdown">
        <div v-if="user">
            <div class="name"> {{user.name}}</div>
        </div>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

export default {
    setup() {
        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);
        return {
            user
        }
    }
}
</script>
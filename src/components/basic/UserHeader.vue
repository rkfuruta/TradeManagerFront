<template>
    <div class="user-dropdown">
        <div v-if="user" class="dropdown">
            <div class="name"> {{user.name}}</div>
            <div class="dropdown-content">
                <a @click="redirect('/settings')">Settings</a>
                <a @click="logout">Logout</a>
            </div>
        </div>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/message';

export default {
    setup() {
        const userStore = useUserStore();
        const { user } = storeToRefs(userStore);
        return {
            user
        }
    },
    methods: {
        logout() {
            const userStore = useUserStore()
            userStore.logout();
            const messageStore = useMessageStore();
            this.redirect('/');
            messageStore.success("You have been logged out");
        },
        redirect(route) {
            this.$router.push(route);
        }
    }
}
</script>
<style scoped>
.user-dropdown {
    padding: 20px;
    cursor: pointer;
}
.dropdown {
    display: inline-block;
}
.dropdown-content {
    display: none;
    position: absolute;
    right: 0px;
    background-color: #383838;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
}
.dropdown-content a {
    color: rgba(235, 235, 235, 0.64);
    padding: 12px 16px;
    text-decoration: none;
    display: block;
}
.dropdown-content a:hover {
    background-color: #181818;
}
.dropdown:hover .dropdown-content {
    display: block;
}
</style>
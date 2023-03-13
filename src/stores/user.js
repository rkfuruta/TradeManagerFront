import { defineStore } from 'pinia'
import axios from "axios";
import { isJwtExpired } from 'jwt-check-expiration';
import { useMessageStore } from '@/stores/message';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        get() {
            return this.user;
        },
        async loginByToken(token) {
            const result = await axios.get(`/api/v1/users`, { headers: {'Authorization' : `Bearer ${token}` } });
            if (result.status === 200) {
                this.user = result.data
                const messageStore = useMessageStore();
                messageStore.success("You are successfully logged in");
            } else {
                messageStore.error("Account not found");
            }
        },
        token() {
            if (this.user) {
                this.checkToken();
                return this.user.token;
            }
            return null;
        },
        set(user) {
            this.user = user;
        },
        isLoggedIn() {
            this.checkToken();
            return (this.user);
        },
        checkToken() {
            if (this.user && isJwtExpired(this.user.token)) {
                this.logout();
                return false;
            }
        },
        logout() {
            this.user = null;
        }
    },
    persist: true
})
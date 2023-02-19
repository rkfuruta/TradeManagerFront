import { defineStore } from 'pinia'
import axios from "axios";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        get() {
            return this.user;
        },
        token() {
            if (this.user) {
                return this.user.token;
            }
            return null;
        },
        set(user) {
            this.user = user;
        },
        isLoggedIn() {
            return (this.user);
        },
        logout() {
            this.user = null;
        }
    },
    persist: true
})
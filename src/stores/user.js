import { defineStore } from 'pinia'
import axios from "axios";

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null
    }),
    actions: {
        set(user) {
            this.user = user;
        },
        isLoggedIn() {
            return (this.user);
        },
        logout() {
            this.user = null;
        }
    }
})
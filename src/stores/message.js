import { defineStore } from 'pinia'

export const useMessageStore = defineStore('alert', {
    state: () => ({
        message: null
    }),
    actions: {
        success(message, time = 8000) {
            this.message = { message, type: 'success' };
        },
        error(message, time = 8000) {
            this.message = { message, type: 'error' };
        },
        warning(message, time = 8000) {
            this.message = { message, type: 'warning' };
        },
        clear() {
            this.message = null;
        }
    }
})
import { defineStore } from 'pinia'
import axios from "axios";
import {useUserStore} from "@/stores/user";
import moment from "moment";

export const useInventoryStore = defineStore('inventory', {
    state: () => ({
        inventory: null,
        updated_at: null
    }),
    actions: {
        async get() {
            const updated = moment(this.updated_at);
            const now = moment().subtract(30, 'minutes');
            if (!this.inventory || updated.isBefore(now)) {
                const userStore = useUserStore();
                const result = await axios.get(`/api/v1/inventory`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
                if (result.data.data.inventory) {
                    this.inventory = result.data.data.inventory;
                    this.updated_at = moment();
                }
            }
            return this.inventory;
        },
        async reload() {
            const userStore = useUserStore();
            const result = await axios.get(`/api/v1/inventory?reload=true`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
            if (result.data.data.inventory) {
                this.inventory = result.data.data.inventory;
                this.updated_at = moment();
            }
        }
    },
    persist: true
})
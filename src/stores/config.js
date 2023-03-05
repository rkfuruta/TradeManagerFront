import { defineStore } from 'pinia'
import axios from "axios";
import {useUserStore} from "@/stores/user";
import moment from "moment";
import _ from "underscore";

export const useConfigStore = defineStore('config', {
    state: () => ({
        configs: [],
        updated_at: null
    }),
    actions: {
        async load() {
            const updated = moment(this.updated_at);
            const now = moment().subtract(30, 'minutes');
            if (!this.configs.length && (updated.isBefore(now) || this.updated_at === null)) {
                const userStore = useUserStore();
                const result = await axios.get(`/api/v1/config/list`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
                if (result.data.data.configs) {
                    this.configs = result.data.data.configs;
                    this.updated_at = moment();
                }
            }
        },
        async get(key = null) {
            await this.load()
            let config = null;
            if (key) {
                config = _.find(this.configs, (data) => {
                    return data.code === key;
                });
                return (!config)? null : config;
            }
            return this.configs;
        },
        async getValue(key) {
            const config = await this.get(key);
            return (config)? config.value : null;
        }
    },
    persist: true
})
import { defineStore } from 'pinia'

export const useFiltersStore = defineStore('filters', {
    state: () => ({
        bot: {
            page: 1,
            limit: 10,
            history: 45,
            filters: {
                filter: false,
                limit: 10,
                code: {
                    value: null,
                    options: ["blue", "success", "error", "warning", "exception"]
                },
                debug: false,
            }
        }
    }),
    actions: {},
    persist: true
})
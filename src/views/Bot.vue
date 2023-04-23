<template>
    <div class="console-actions">
        <button class="btn primary filters" @click="toggleFilters">Filters</button>
        <div class="filters-wrapper" v-show="filters">
            <div class="filter-options-wrapper">
                <div class="multiselect-code-wrapper fieldset filter-option">
                    <label>Code</label>
                    <Multiselect
                        class="multiselect-code"
                        v-model="bot.filters.code.value"
                        :options="bot.filters.code.options"
                        :mode="'multiple'"
                        :hideSelected="false"
                        :close-on-select="false"
                    />
                </div>
                <div class="limit fieldset filter-option">
                    <label>Limit</label>
                    <input v-model="bot.filters.limit">
                </div>
                <div class="debug fieldset filter-option">
                    <label>Remove debug</label>
                    <input type="checkbox" v-model="bot.filters.debug">
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn primary" @click="clearFilters">Clear</button>
                <button class="btn primary" @click="applyFilters">Apply</button>
            </div>
        </div>
    </div>
    <div class="console">
        <div v-for="log in logs" class="message" :class="log.code">
            <span class="timestamp">[{{ formatDate(log.createdAt) }}]</span>
            <span class="content" :title="log.message" :class="log.code">{{log.message}}</span>
        </div>
    </div>
</template>
<script setup>
import { useFiltersStore } from '@/stores/filters';
import {storeToRefs} from "pinia";
const filtersStore = useFiltersStore();
const { bot } = storeToRefs(filtersStore);
</script>
<script>
import axios from "axios";
import _ from "underscore";
import {useUserStore} from "@/stores/user";
import Multiselect from '@vueform/multiselect';
import {useFiltersStore} from "@/stores/filters";
import {storeToRefs} from "pinia";
const filtersStore = useFiltersStore();
export default {
    components: {
        Multiselect,
    },
    data() {
        return {
            logs: [],
            interval: null,
            last_id: null,
            filters: false
        }
    },
    mounted() {
        this.reload();
        this.interval = setInterval(this.reload, 5000);
    },
    unmounted() {
        clearInterval(this.interval);
    },
    methods: {
        async reload() {
            const userStore = useUserStore();
            const result = await axios.get(`/api/v1/bot/log${this.getFilters()}`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
            if (result.data.items.length) {
                this.logs = _.union(result.data.items, this.logs);
                const first = _.first(result.data.items);
                this.last_id = first.entity_id;
            }
        },
        getFilters() {
            if (!filtersStore.bot.filters.filter) {
                return `?page=1&limit=${filtersStore.bot.limit}&id=${this.last_id}`;
            }
            let filters = "?page=1";
            filters += `&limit=${filtersStore.bot.filters.limit}`;
            filters += `&id=${this.last_id}`;
            if (filtersStore.bot.filters.debug) {
                filters += `&debug=${!filtersStore.bot.filters.debug}`;
            }
            if (filtersStore.bot.filters.code.value && filtersStore.bot.filters.code.value.length) {
                filters += `&code=${filtersStore.bot.filters.code.value.join(",")}`;
            }
            return filters;
        },
        toggleFilters(){
            this.filters = !this.filters;
        },
        applyFilters() {
            filtersStore.bot.filters.filter = true;
            this.logs = [];
            this.last_id = 0
            this.reload();
        },
        clearFilters() {
            filtersStore.bot.filters.filter = false;
            this.logs = [];
            this.last_id = 0
            filtersStore.bot.filters.code.value = null;
            filtersStore.bot.filters.debug = false;
            filtersStore.bot.filters.limit = 10;
            this.reload();
        }
    }
}
</script>
<style scoped>
.console-actions {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
    flex-wrap: wrap;
}
.console-actions .filters-wrapper {
    width: 100%;
}
.console-actions .debug label {
    padding-right: 10px;
}
.console {
    background-color: black;
    width: 100%;
    border-radius: 5px;
    min-height: 100px;
    padding: 20px;
}
.timestamp {
    font-weight: bold;
    padding-right: 5px;
}
.timestamp::after {
    padding-left: 5px;
    content: "-";
}
.message {
    overflow: hidden;
}
.message.blue {
    color: blue;
}
.message.warning {
    color: yellow;
}
.message.error,
.message.exception {
    color: red;
}
.message.success {
    color: green;
}
.message .content.exception {
    text-decoration: underline;
}
.multiselect-code {
    min-width: 200px;
    --ms-bg: #383838;
    --ms-option-bg: #383838;
    --ms-dropdown-bg: #383838;
    --ms-option-bg-pointed: #181818;
    --ms-option-bg-selected: #181818;
    --ms-option-bg-selected-pointed: #181818;
    --ms-option-color-selected: rgba(235, 235, 235, 0.64);
    --ms-option-color-pointed: rgba(235, 235, 235, 0.64);
    --ms-option-color-selected-pointed: rgba(235, 235, 235, 0.64);
}
.filters-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}
.filter-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 20px;
    width: 100%;
}
.filter-options-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
}
.filter-option {
    display: flex;
    flex-wrap: wrap;
}
.filter-option.limit input {
    border: unset;
    width: 100%;
    background-color: #383838;
    color: rgba(235, 235, 235, 0.64);
    border-radius: 4px;
    padding: 10px;
}
@media only screen and (max-width: 450px) {
    .filter-option {
        width: 100%;
    }
}
</style>
<style src="@vueform/multiselect/themes/default.css"></style>
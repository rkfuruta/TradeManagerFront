<template>
    <div class="header">
        <div class="title">Bot Configuration</div>
    </div>
    <Vue3JsonEditor
        v-model="json"
        :expandedOnStart="true"
        :show-btns="true"
        :mode="code"
        @json-save="onJsonSave"
    />
</template>

<script>
import { Vue3JsonEditor } from 'vue3-json-editor';
import axios from "axios";
import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/message';

export default {
    components: {
        Vue3JsonEditor
    },
    data() {
        return {
            json: {}
        }
    },
    mounted() {
        this.loadBotConfig();
    },
    methods: {
        async loadBotConfig() {
            const userStore = useUserStore();
            const result = await axios.get(`/api/v1/bot/config`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
            this.json = result.data.config;
        },
        async onJsonSave(data) {
            const userStore = useUserStore();
            const result = await axios.post(`/api/v1/bot/config`, { config: data }, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
            if (result.data.success) {
                const messageStore = useMessageStore();
                messageStore.success("New bot config saved successfully");
            }
        }
    }
}
</script>
<style>
.header .title {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
}
.jsoneditor-vue {
    background-color: #F5F5F5;
}
</style>
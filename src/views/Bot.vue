<template>
    <div class="actions">
        <div class="debug">
            <label>Show debug</label>
            <input type="checkbox" v-model="debug">
        </div>
    </div>
    <div class="console">
        <div v-for="log in logs" class="message" :class="log.code">
            <div v-if="showLog(log)">
                <span class="timestamp">[{{ formatDate(log.createdAt) }}]</span>
                <span class="message" :class="log.code">{{log.message}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import _ from "underscore";
import {useUserStore} from "@/stores/user";
export default {
    data() {
        return {
            logs: [],
            interval: null,
            page: 1,
            limit: 10,
            history: 45,
            last_id: null,
            debug: true
        }
    },
    mounted() {
        this.load();
        this.interval = setInterval(this.reload, 5000);
    },
    unmounted() {
        clearInterval(this.interval);
    },
    methods: {
        async load() {
            const userStore = useUserStore();
            const result = await axios.get(`/api/v1/bot/log?page=1&limit=${this.history}&debug=${this.debug}`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
            if (result.data.items.length) {
                this.logs = result.data.items;
                const first = _.first(result.data.items);
                this.last_id = first.entity_id;
            }
        },
        async reload() {
            const userStore = useUserStore();
            const result = await axios.get(`/api/v1/bot/log?page=1&limit=${this.limit}&id=${this.last_id}&debug=${this.debug}`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } });
            if (result.data.items.length) {
                let logs = _.union(result.data.items, this.logs);
                const first = _.first(result.data.items);
                this.last_id = first.entity_id;
                if(logs.length > this.history) {
                    this.logs = logs.slice(0, this.history-logs.length);
                } else {
                    this.logs = logs;
                }
            }
        },
        showLog(log) {
            if (!this.debug && log.is_debug) {
                return false;
            }
            return true;
        }
    },
    watch: {
        debug() {
            this.logs = [];
            this.last_id = 0
            this.reload();
        }
    }
}
</script>
<style scoped>
.actions {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
}
.actions .debug label {
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
.message.blue {
    color: blue;
}
.message.warning {
    color: yellow;
}
.message.error {
    color: red;
}
.message.success {
    color: green;
}
</style>
<template>
    <div class="message" @click="clear">
        <div :class="message.type" class="content">
            <span>{{ message.message }}</span>
        </div>
    </div>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/stores/message';
export default {
    setup() {
        const messageStore = useMessageStore();
        const { message } = storeToRefs(messageStore);
        return {
            message
        }
    },
    methods: {
        clear() {
            const message = useMessageStore();
            message.clear();
        }
    },
    mounted() {
        setTimeout(this.clear, 8000);
    }
}
</script>

<style scoped>
.message {
    position: relative;
    display: flex;
    justify-content: center;
    top: 15px;
    left: 0px;
    width: 100%;
}
.message .content {
    width: 95%;
    border-radius: 5px;
    padding: 0.75rem 1.25rem;
}
.message .error {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
.message .success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}
.message .warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
</style>
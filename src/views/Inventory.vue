<template>
    <main>
        <div class="header">
            <div class="title">Inventory</div>
            <div class="actions">
                <button class="btn primary" @click="reload">
                    <font-awesome-icon icon="fa-solid fa-rotate" class="icon" />
                    <span>Reload</span>
                </button>
            </div>
        </div>
        <div class="items-wrapper" v-if="inventory && inventory.items">
            <div v-for="item in inventory.items">
                <Item :item="item" />
            </div>
        </div>
    </main>
</template>

<script setup>
import Item from '@/components/Item.vue';
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
const { inventory } = storeToRefs(inventoryStore);
</script>

<script>
import { useInventoryStore } from '@/stores/inventory';
const inventoryStore = useInventoryStore();
import { storeToRefs } from 'pinia';


export default {
    mounted() {
        inventoryStore.get();
    },
    methods: {
        reload() {
            inventoryStore.reload();
        }
    }
}
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.header .title {
    font-size: 30px;
    font-weight: bold;
}
</style>
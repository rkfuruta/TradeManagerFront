<template>
    <main>
        <div class="header">
            <div class="title">Inventory</div>
        </div>
        <div class="inventory-update">
            <div class="button">
                <button class="btn secondary" @click="reload">
                    <img class="icon" src="@/assets/icon/sync.svg" alt="Reload">
                    <span>Reload</span>
                </button>
            </div>
            <div class="updated-at">
<!--                <Date class="date" :date="updated_at"></Date>-->
            </div>
        </div>
        <div class="items-wrapper" v-if="inventory && inventory.items">
            <div class="inventory-item-container" v-for="item in inventory.items">
                <Item :item="item" />
            </div>
        </div>
    </main>
</template>

<script setup>
import Item from '@/components/Item.vue';
import Date from '@/components/Date.vue';
import {useUserStore} from "@/stores/user";
import {storeToRefs} from "pinia";
const { inventory, updated_at } = storeToRefs(inventoryStore);
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
    padding-bottom: 5px;
    border-bottom: 1px solid var(--secondary);
    width: 80%;
    margin-bottom: 15px;
}
.header .title {
    font-size: 30px;
    font-weight: bold;
    color: var(--secondary);
}
.inventory-update {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    align-items: center;
}
.inventory-update .icon {
    filter: var(--svg-white);
}
.inventory-update .button {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-bottom: 10px;
}
.inventory-update .btn {
    padding: 0.3rem 1rem;
}
.inventory-update .updated-at {
    margin-bottom: 10px;
}
.inventory-update .updated-at .date {
    font-size: 13px;
}
.items-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    grid-gap: 20px;
}
@media only screen and (max-width: 450px) {
    .inventory-item-container {
        width: 100%;
    }
}
</style>
<template>
    <div class="currency-selector">
        <select @change="onChange($event)" v-model="current">
            <option v-for="option in options" :value="option.value">{{option.label}}</option>
        </select>
    </div>
</template>
<script>
import {useCurrencyStore} from "@/stores/currency";
export default {
    data() {
        const currencyStore = useCurrencyStore();
        const currencyOptions = currencyStore.getOptions();
        return {
            options: currencyOptions,
            current: currencyStore.selected
        }
    },
    methods: {
        onChange(event) {
            const currencyStore = useCurrencyStore();
            currencyStore.change(event.target.value);
        }
    }
}
</script>
<style scoped>
.currency-selector select {
    border: unset;
    outline: 0px;
    -webkit-border-radius: 3px;
    background-color: var(--secondary);
    color: inherit;
    padding: 8px 10px;
}
</style>
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
    border: 1px solid inherit;
    outline: 0px;
    -webkit-border-radius: 0px;
    background-color: #383838;
    color: inherit;
    padding: 5px;
}
</style>
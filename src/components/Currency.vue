<template>
    <div class="currency-wrapper">
        <span class="currency-icon" v-if="show_icon" v-html="current.icon" :class="{ bold: bold }"></span>
        <span class="currency-value" :class="{ bold: bold }">{{ value }}</span>
    </div>
</template>

<script>
import {useCurrencyStore} from "@/stores/currency";
export default {
    props: {
        amount: 0,
        show_icon: {
            type: Boolean,
            default: true
        },
        bold: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        selected() {
            const currencyStore = useCurrencyStore();
            return currencyStore.selected;
        },
        current() {
            const currencyStore = useCurrencyStore();
            return currencyStore.getOption(this.selected);
        },
        value() {
            if (this.current.hasOwnProperty("convert")) {
                return this.current.convert(this.amount);
            }
            return this.amount;
        }
    }
}
</script>
<style scoped>
.currency-wrapper {
    display: flex;
    align-items: center;
}
.currency-icon :deep(img)  {
    display: flex;
    align-items: center;
    padding-right: 5px;
}
.currency-icon :deep(.coin-icon)  {
    width: 22px;
}
.currency-icon.bold,
.currency-value.bold{
    font-weight: bold;
}
</style>
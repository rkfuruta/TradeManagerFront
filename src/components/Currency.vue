<template>
    <div class="currency-wrapper">
        <span class="currency-icon" v-if="hasIcon" v-html="icon" :class="{ bold: bold }"></span>
        <span class="currency-symbol" v-if="hasSymbol" v-html="symbol" :class="{ bold: bold }"></span>
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
        show_symbol: {
            type: Boolean,
            default: true
        },
        bold: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        icon() {
            if (this.current.hasOwnProperty("icon")) {
                return `<img class="${this.current.value}-icon" src="${this.current.icon}" alt="${this.current.label}"/>`;
            }
        },
        hasIcon() {
            if (this.show_icon && this.current.hasOwnProperty("icon")) {
                return true;
            }
            return false;
        },
        symbol() {
            if (this.current.hasOwnProperty("symbol")) {
                return this.current.symbol;
            }
        },
        hasSymbol() {
            if (this.show_symbol && this.current.hasOwnProperty("symbol")) {
                return true;
            }
            return false;
        },
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
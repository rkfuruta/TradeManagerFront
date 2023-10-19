import { defineStore } from 'pinia'
import coin from "@/assets/icon/coin.svg";

const currencyOptions = {
    "coin": {
        "label": "Coin",
        "value": "coin",
        "icon": coin,
        "convert": (value) => {
            if (value === undefined || value === null) {
                value = 0;
            }
            return (value).toLocaleString('en-US', {
                maximumFractionDigits: 2
            });
        }
    },
    "brl": {
        "label": "Real",
        "value": "brl",
        "symbol": "R$",
        "convert": (value) => {
            return ((value * 0.614) * 5).toLocaleString('en-US', {
                maximumFractionDigits: 2
            });
        }
    },
    "usd": {
        "label": "Dollar",
        "value": "usd",
        "symbol": "$",
        "convert": (value) => {
            return (value * 0.614).toLocaleString('en-US', {
                maximumFractionDigits: 2
            });
        }
    }
};

export const useCurrencyStore = defineStore('currency', {
    state: () => ({
        selected: "coin",
    }),
    actions: {
        change(value) {
            this.selected = value;
        },
        getOption(value) {
            if (this.selected && currencyOptions.hasOwnProperty(value)) {
                return currencyOptions[value];
            }
            return currencyOptions.coin;
        },
        getCurrent() {
            if (this.selected && currencyOptions.hasOwnProperty(this.selected)) {
                return currencyOptions[this.selected];
            }
            return currencyOptions.coin;
        },
        getOptions() {
            return currencyOptions;
        }
    },
    persist: true
})
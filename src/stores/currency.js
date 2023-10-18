import { defineStore } from 'pinia'

const currencyOptions = {
    "coin": {
        "label": "Coin",
        "value": "coin",
        "icon": '<img class="coin-icon" src="../src/assets/icon/coin.svg" alt="coin"/>',
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
        "icon": "R$",
        "convert": (value) => {
            return ((value * 0.614) * 5).toLocaleString('en-US', {
                maximumFractionDigits: 2
            });
        }
    },
    "usd": {
        "label": "Dollar",
        "value": "usd",
        "icon": "$",
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
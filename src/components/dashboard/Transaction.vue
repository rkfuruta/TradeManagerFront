<template>
    <td class="item name">
        <div class="name">
            <div class="index">{{row}}</div>
            <a :href="steamUrl()" target="_blank">{{ transaction.market_name }}</a>
        </div>
        <TradeLockTimer :date="transaction.tradelock"></TradeLockTimer>
    </td>
    <td>
        <div class="purchase value">
            <Currency :amount="formatCurrency(transaction.purchase_value)" />
        </div>
    </td>
    <td>
        <div class="sell value" v-if="transaction.sell_value">
            <Currency :amount="formatCurrency(transaction.sell_value)" />
        </div>
    </td>
    <td>
        <div class="profit value" v-if="transaction.sell_value" :class="{ green: hasProfit(), red: !hasProfit()}">
            <Currency :amount="getProfit()" />
        </div>
    </td>
    <td>{{ getProfitPercent() }}</td>
    <td><Date :date="transaction.purchase_date" /></td>
    <td><Date :date="transaction.sell_date" /></td>
    <td>{{ getSellingDays() }}</td>
</template>
<script setup>
import Currency from "@/components/Currency.vue";
import Date from "@/components/Date.vue";
import TradeLockTimer from "@/components/TradeLockTimer.vue";
</script>
<script>
import moment from "moment-timezone";
export default {
    props: {
        transaction: {},
        index: 1
    },
    methods: {
        steamUrl() {
            return `https://steamcommunity.com/market/listings/730/${encodeURI(this.transaction.market_name)}`;
        },
        getProfit() {
            if (this.transaction.sell_value) {
                return this.formatCurrency(this.transaction.sell_value - this.transaction.purchase_value);
            }
        },
        getProfitPercent() {
            if (this.transaction.sell_value) {
                return ((this.transaction.sell_value - this.transaction.purchase_value)*100/this.transaction.purchase_value).toFixed(2) + "%"
            }
        },
        getSellingDays() {
            if (this.transaction.sell_date) {
                const pDate = moment.utc(this.transaction.purchase_date).tz('America/Sao_Paulo');
                const sDate = moment.utc(this.transaction.sell_date).tz('America/Sao_Paulo');
                return sDate.diff(pDate, "days");
            }
        },
        hasProfit() {
            return (this.transaction.sell_value - this.transaction.purchase_value) > 0;
        }
    },
    computed: {
        row() {
            return this.index + 1;
        }
    }
}
</script>
<style scoped>
.item.name {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.item.name .name {
    display: flex;
}
.item.name .trade-lock-timer {
    margin-right: 10px;
}
.item.name .name .index {
    font-weight: bold;
    padding-right: 10px;
}
.item.name .name a{
    color: rgba(235, 235, 235, 0.64);
    text-decoration: none;
    font-weight: bold;
}
</style>
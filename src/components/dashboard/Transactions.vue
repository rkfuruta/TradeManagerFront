<template>
    <div class="statistics">
        <div class="item">
            <div class="title">Purchases</div>
            <div class="value">
                <Currency :amount="totalPurchased" :bold="true"></Currency>
            </div>
        </div>
        <div class="item">
            <div class="title">Sales</div>
            <div class="value">
                <Currency :amount="totalSold" :bold="true"/>
            </div>
        </div>
        <div class="item">
            <div class="title">Profit</div>
            <div class="value">
                <Currency :amount="totalProfit" :bold="true"/>
            </div>
        </div>
        <div class="item">
            <div class="title">Avg. Profit</div>
            <div class="value">
                <Currency :amount="averageProfit" :bold="true"/>
            </div>
        </div>
        <div class="item">
            <div class="title">Items Value</div>
            <div class="value">
                <Currency :amount="itemsValueFormatted" :bold="true"/>
            </div>
        </div>
        <div class="item">
            <div class="title">Profit %</div>
            <div class="value">
                {{ profitPercentFormatted }}
            </div>
        </div>
        <div class="item">
            <div class="title">Profit forecast</div>
            <div class="value">
                <Currency :amount="profitForecast" :bold="true"/>
            </div>
        </div>
    </div>
    <div class="list-wrapper">
        <div class="data selector">
            <select name="transaction_dates" @change="changeDates($event)">
                <option v-for="date in dates">{{ getFormatedMonth(date) }}/{{ date.Year}}</option>
            </select>
        </div>
        <div class="list" v-if="transactions">
            <table class="transaction-wrapper">
                <tr>
                    <th>Item</th>
                    <th>Purchase Value</th>
                    <th>Sold Value</th>
                    <th>Profit</th>
                    <th>Profit %</th>
                    <th>Purchase Date</th>
                    <th>Sold Date</th>
                    <th>Days selling</th>
                </tr>
                <tr v-for="(transaction, index) in transactions">
                    <Transaction :transaction="transaction" :index="index" />
                </tr>
            </table>
        </div>
    </div>
</template>
<script setup>
import Transaction from "@/components/dashboard/Transaction.vue";
import Currency from "@/components/Currency.vue";
</script>
<script>
import axios from "axios";
import { useUserStore } from '@/stores/user';
import _ from 'underscore';
import transaction from "@/components/dashboard/Transaction.vue";

export default {
    data() {
        return {
            transactions: null,
            dates: null,
            year: null,
            month: null
        }
    },
    mounted() {
        const userStore = useUserStore();
        axios.get(`/api/v1/dashboard/transactions/dates`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } }).then((result) => {
            this.dates = result.data.data.results;
            if (result.data.data.results.length) {
                const now = result.data.data.results[0];
                this.year = now.Year;
                this.month = now.Month;
                this.getData()
            }
        });
    },
    methods: {
        getFormatedMonth(date) {
            return ("0" + date.Month).slice(-2);
        },
        changeDates(event) {
            const dates = event.target.value.split("/");
            this.month = dates[0];
            this.year = dates[1];
            this.getData();
        },
        getData() {
            const userStore = useUserStore();
            if (!this.year || !this.month) {
                return;
            }
            axios.get(`/api/v1/dashboard/transactions?month=${this.month}&year=${this.year}`, { headers: {'Authorization' : `Bearer ${userStore.token()}` } }).then((result) => {
                this.transactions = result.data.data.items;
            });
        }
    },
    computed: {
        totalPurchased() {
            let total = 0;
            _.each(this.transactions, (transaction) => {
                total += transaction.purchase_value;
            });
            if (total <= 0) {
                return 0;
            }
            return this.formatCurrency(total);
        },
        totalSold() {
            let total = 0;
            _.each(this.transactions, (transaction) => {
                total += transaction.sell_value;
            });
            if (total <= 0) {
                return 0;
            }
            return this.formatCurrency(total);
        },
        profit() {
            let total = 0;
            _.each(this.transactions, (transaction) => {
                if (transaction.sell_value) {
                    total += transaction.sell_value - transaction.purchase_value;
                }
            });
            return total;
        },
        totalProfit() {
            if (this.profit <= 0) {
                return 0;
            }
            return this.formatCurrency(this.profit);
        },
        averageProfit() {
            let total = 0;
            let amount = 0;
            _.each(this.transactions, (transaction) => {
                if (transaction.sell_value) {
                    amount++;
                    total += transaction.sell_value - transaction.purchase_value;
                }
            });
            if (amount === 0) {
                return 0;
            }
            return this.formatCurrency(total/amount);
        },
        itemsValue() {
            let total = 0;
            _.each(this.transactions, (transaction) => {
                if (transaction.purchase_value && !transaction.sell_value) {
                    total += transaction.purchase_value;
                }
            });
            if (total <= 0) {
                return 0;
            }
            return total;
        },
        itemsValueFormatted() {
            return this.formatCurrency(this.itemsValue);
        },
        profitPercent() {
            let total = 0;
            let profit = 0;
            _.each(this.transactions, (transaction) => {
                if (transaction.sell_value) {
                    total += transaction.purchase_value;
                    profit += transaction.sell_value - transaction.purchase_value;
                }
            });
            if (total <= 0) {
                return 0;
            }
            return (profit*100/total);
        },
        profitPercentFormatted() {
            return this.profitPercent.toFixed(2) + "%"
        },
        profitForecast() {
            if (this.profitPercent <= 0) {
                return 0;
            }
            let value = this.profit;
            let futureValue = this.itemsValue*this.profitPercent/100;
            return this.formatCurrency(value+futureValue);
        },
    }
}
</script>
<style scoped>
.list {
    overflow-x: auto;
}
.transaction-wrapper {
    width: 100%;
    min-width: 1200px;
    border-collapse: collapse;
}
.transaction-wrapper tr th {
    font-weight: bold;
}
.data.selector {
    display: flex;
    justify-content: end;
    margin-bottom: 10px;
}
.data.selector select {
    border:0px;
    outline:0px;
    -webkit-border-radius: 0px;
    background-color: #383838;
    color: #fff;
    padding: 5px;
}
.icon.coins {
    color: #daa520;
    padding-right: 5px;
}
.statistics {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-bottom: 2rem;
    flex-wrap: wrap;
    gap: 15px;
}
.statistics .item {
    background-color: #383838;
    padding: 20px;
    border-radius: 8px;
    min-width: 150px;
}
.statistics .item .title,
.statistics .item .value {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}
.transaction-wrapper tr:nth-child(even) {
    background-color: var(--color-background-soft);
}
@media only screen and (max-width: 450px) {
    .statistics {
        justify-content: space-evenly;
    }
}
</style>
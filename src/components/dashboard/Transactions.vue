<script setup>
import Transaction from "@/components/dashboard/Transaction.vue";
</script>
<template>
    <div class="statistics">
        <div class="item">
            <div class="title">Purchases</div>
            <div class="value">
                <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                {{ totalPurchased }}
            </div>
        </div>
        <div class="item">
            <div class="title">Sales</div>
            <div class="value">
                <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                {{ totalSold }}
            </div>
        </div>
        <div class="item">
            <div class="title">Profit</div>
            <div class="value">
                <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                {{ totalProfit }}
            </div>
        </div>
        <div class="item">
            <div class="title">Average Profit</div>
            <div class="value">
                <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                {{ averageProfit }}
            </div>
        </div>
        <div class="item">
            <div class="title">Average Profit %</div>
            <div class="value">
                <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                {{ averageProfitPercent }}
            </div>
        </div>
        <div class="item">
            <div class="title">Profit %</div>
            <div class="value">
                <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                {{ profitPercent }}
            </div>
        </div>
    </div>
    <div class="list" v-if="transactions">
        <div class="data selector">
            <select name="transaction_dates" @change="changeDates($event)">
                <option v-for="date in dates">{{ getFormatedMonth(date) }}/{{ date.Year}}</option>
            </select>
        </div>
        <table class="transaction-wrapper">
            <tr>
                <th>Item</th>
                <th>Purchase Date</th>
                <th>Purchase Value</th>
                <th>Sold Date</th>
                <th>Sold Value</th>
                <th>Profit</th>
                <th>Profit %</th>
                <th>Days selling</th>
            </tr>
            <tr v-for="transaction in transactions">
                <Transaction :transaction="transaction" />
            </tr>
        </table>
    </div>
</template>
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
            return this.formatCurrency(total);
        },
        totalSold() {
            let total = 0;
            _.each(this.transactions, (transaction) => {
                total += transaction.sell_value;
            });
            return this.formatCurrency(total);
        },
        totalProfit() {
            let total = 0;
            _.each(this.transactions, (transaction) => {
                if (transaction.sell_value) {
                    total += transaction.sell_value - transaction.purchase_value;
                }
            });
            return this.formatCurrency(total);
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
            return this.formatCurrency(total/amount);
        },
        averageProfitPercent() {
            let total = 0;
            let profit = 0;
            let amount = 0;
            _.each(this.transactions, (transaction) => {
                if (transaction.sell_value) {
                    total += transaction.purchase_value;
                    amount++;
                    profit += transaction.sell_value - transaction.purchase_value;
                }
            });
            if (total <= 0) {
                return 0;
            }
            return ((profit/amount)*100/total).toFixed(2) + "%";
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
            return (profit*100/total).toFixed(2) + "%";
        }
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
}
</style>
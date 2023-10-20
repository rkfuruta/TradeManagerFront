<template>
    <div class="item-wrapper" :class="{ 'not-tradable': !item.tradable }">
        <div class="head">
            <div class="image">
                <img :src="getImageUrl()">
            </div>
        </div>
        <div class="content">
            <span class="name" :title="item.market_name" @click="copyMarketName">{{item.market_name}}</span>
            <div class="info">
                <div class="market_value" title="Market Value" v-if="item.market_value > 0">
                    <img class="market_value-icon" src="@/assets/icon/market.svg" alt="market" />
                    <Currency :amount="formatCoins(item.market_value)" :show_icon="false"/>
                </div>
                <div class="market_value" title="Market Value" v-if="item.market_value < 0">
                    <span>Not sellable</span>
                </div>
                <div class="purchase_value" title="Purchase Value" v-if="item.purchase_value > 0">
                    <img class="purchase_value-icon" src="@/assets/icon/buy.svg" alt="purchase" />
                    <Currency :amount="formatCoins(item.purchase_value)" :show_icon="false"/>
                </div>
                <div class="sell_value" title="Recommended Sell Value" v-if="sell_price">
                    <img class="sell_value-icon" src="@/assets/icon/inventory.svg" alt="sell" />
                    <Currency :amount="sell_price" :show_icon="false"/>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="actions">
                <button class="btn lock" v-if="item.status === 0" @click="changeStatus">
                    <img src="@/assets/icon/lock.svg" alt="lock" />
                    Lock
                </button>
                <button class="btn unlock" v-if="item.status === 1" @click="changeStatus">
                    <img src="@/assets/icon/unlock.svg" alt="unlock" />
                    Unlock
                </button>
            </div>
            <div class="tradelock" v-if="item.tradelock">
                <img class="tradelock-icon" src="@/assets/icon/lock.svg" alt="lock" />
                <span>{{ timeLeft() }}</span>
            </div>
        </div>
    </div>
</template>
<script setup>
import Currency from "@/components/Currency.vue";
</script>
<script>
import moment from 'moment';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useInventoryStore } from '@/stores/inventory';
import { useConfigStore } from '@/stores/config';

export default {
    props: {
        item: {}
    },
    methods: {
        getImageUrl() {
            return `https://community.cloudflare.steamstatic.com/economy/image/${this.item.icon_url}`;
        },
        formatCoins(value) {
            return (value/100).toFixed(2)
        },
        timeLeft() {
            if (!this.item.tradelock) {
                return null;
            }
            const now = moment();
            const tradelock = moment(this.item.tradelock);
            let days = tradelock.diff(now, "days");
            let hours = tradelock.diff(now, "hours");
            let minutes = tradelock.diff(now, "minutes");
            minutes = minutes - (hours*60);
            hours = hours - (days*24)
            if (minutes > 0 && hours > 0) {
                hours++;
            } else {
                return `${minutes}M`;
            }
            return `${days}D ${hours}H`;
        },
        changeStatus() {
            const userStore = useUserStore();
            axios.post(
                `/api/v1/item/${this.item.entity_id}/status`,
                {
                    status: (this.item.status === 1)? 0 : 1,
                },
                { headers: {'Authorization' : `Bearer ${userStore.token()}` } }
            ).then((result) => {
                if (result.data.success) {
                    const item = result.data.data.item;
                    const inventory = useInventoryStore();
                    inventory.updateItem(item.entity_id, item);
                }
            });
        },
        copyMarketName(event) {
            let textArea = document.createElement("textarea");
            textArea.value = event.target.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
        }
    },
    computed: {
        sell_price() {
            return this.formatCurrency(this.item.purchase_value + ((this.item.purchase_value * 10)/100));
        }
    }
}
</script>
<style scope>
.sell_value,
.purchase_value {
    display: flex;
    align-items: center;
}
.item-wrapper {
    background-color: var(--primary-5);
    padding: 20px;
    border-radius: 4px;
    color: var(--primary);
}
.item-wrapper .name {
    font-weight: bold;
    width: 100%;
    min-height: 50px;
    font-size: 16px;
    margin-bottom: 5px;
}
.item-wrapper .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
    font-size: 13px;
}
.item-wrapper .content .copy {
    margin-left: 10px;
    cursor: pointer;
}
.tradelock {
    display: flex;
    align-items: center;
    font-size: 13px;
    padding-right: 15px;
}
.tradelock .tradelock-icon {
    filter: var(--svg-white);
    height: 13px;
    padding-right: 5px;
}
.content .info {
    width: 100%;
    display: flex;
    align-items: center;
}
.content .info > div {
    padding-right: 15px;
    display: flex;
    align-items: center;
}
.content .info > div > img {
    padding-right: 3px;
    height: 13px;
    filter: var(--svg-white);
}
.content .info > div:last-child {
    padding-right: unset;
}
.head .image {
    display: flex;
    justify-content: center;
    padding: 5px 0;
}
.head .image img {
    height: 150px;
}
.item-wrapper.not-tradable {
    background-color: var(--secondary-5);
}
.footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.btn.lock {
    width: 105px;
    background-color: var(--secondary);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn.lock img {
    padding-right: 3px;
    filter: var(--svg-white);
}
.btn.unlock {
    width: 105px;
    background-color: var(--primary-6);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn.unlock img {
    padding-right: 3px;
    filter: var(--svg-white);
}
@media only screen and (max-width: 450px) {
    .item-wrapper {
        width: 100%;
    }
}
</style>
<template>
    <div class="item-wrapper" :class="{ 'not-tradable': !item.tradable }">
        <div class="head">
            <span class="name" :title="item.market_name">{{item.market_name}}</span>
        </div>
        <div class="content">
            <div class="image">
                <img :src="getImageUrl()">
            </div>
        </div>
        <div class="footer">
            <div class="info">
                <div class="market_value" v-if="item.market_value > 0">
                    <font-awesome-icon icon="fa-solid fa-coins" class="icon coins" />
                    <span class="amount">{{ formatCoins(item.market_value) }}</span>
                </div>
                <div class="market_value" v-if="item.market_value < 0">
                    <span>Not sellable</span>
                </div>
                <div class="market_value" v-if="item.purchase_value > 0">
                    <font-awesome-icon icon="fa-solid fa-wallet" class="icon wallet" />
                    <span class="amount">{{ formatCoins(item.purchase_value) }}</span>
                </div>

            </div>
            <div class="updated">
                <span>{{ formattedUpdatedAt() }}</span>
            </div>
            <div class="tradelock" v-if="item.tradelock">
                <font-awesome-icon icon="fa-solid fa-lock" class="icon lock" />
                <span>{{ timeLeft() }}</span>
            </div>
            <div class="actions">
                <button class="btn red" v-if="item.status === 0" @click="changeStatus">
                    <font-awesome-icon icon="fa-solid fa-lock" class="icon lock" />
                    Lock
                </button>
                <button class="btn green" v-if="item.status === 1" @click="changeStatus">
                    <font-awesome-icon icon="fa-solid fa-lock-open" class="icon lock" />
                    Unlock
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useInventoryStore } from '@/stores/inventory';

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
        formattedUpdatedAt() {
            const updated = moment(this.item.updatedAt);
            return updated.format("DD/MM/YYYY HH:mm:ss");
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
        }
    }
}
</script>
<style scope>
.item-wrapper {
    background-color: #383838;
    width: 280px;
    padding: 20px;
    border-radius: 8px;
}
.item-wrapper .name {
    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    font-weight: bold;
}
.content .image {
    display: flex;
    justify-content: center;
    padding: 5px 0;
}
.content .image img {
    height: 150px;
}
.item-wrapper.not-tradable {
    background-color: rgba(20,20,25,1);
    cursor: not-allowed;
}
.footer {
    height: 80px;
}
.footer .tradelock {
    position: absolute;
    top: -30px;
    right: 0px;
}
.footer .info {
    display: flex;

}
.footer .info > div {
    margin-right: 10px;
}
.icon.coins,
.icon.lock,
.icon.wallet {
    color: #daa520;
    padding-right: 5px;
}
.btn.green {
    border-color: green;
    color: green;
}
.btn.red {
    border-color: red;
    color: red;
}
.actions {
    position: absolute;
    bottom: 0px;
    left: 0px;
}
.updated {
    position: absolute;
    bottom: 0px;
    right: 0px;
}
</style>
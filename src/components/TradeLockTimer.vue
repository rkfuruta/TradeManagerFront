<template>
    <div class="trade-lock-timer" v-if="date">
        <img v-if="show_icon" src="@/assets/icon/lock.svg">
        <span class="time-left">{{ timeLeft }}</span>
    </div>
</template>
<script>
import moment from "moment/moment";

export default {
    props: {
        date: null,
        has_time: false,
        show_icon: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        timeLeft() {
            if (!this.date) {
                return "";
            }
            let tradeLock = null;
            if (typeof this.date === "string") {
                tradeLock = moment.utc(this.date);
            } else {
                tradeLock = this.date;
            }
            if (!(tradeLock instanceof moment)) {
                return "";
            }
            const now = moment();
            let days = tradeLock.diff(now, "days");
            let hours = tradeLock.diff(now, "hours");
            let minutes = tradeLock.diff(now, "minutes");
            minutes = minutes - (hours * 60);
            hours = hours - (days * 24)
            if (minutes > 0 && hours > 0) {
                hours++;
            } else {
                return `${minutes}M`;
            }
            return `${days}D ${hours}H`;
        }
    }
}
</script>
<style>
.trade-lock-timer {
    display: flex;
    align-items: center;
}
.trade-lock-timer img {
    width: 22px;
    padding-right: 5px;
}
</style>
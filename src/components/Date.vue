<template>
    <div>
        <span>{{ formatted }}</span>
    </div>
</template>
<script>
import moment from "moment-timezone";
export default {
    props: {
        date: null,
        format:  {
            type: Boolean,
            default: true
        },
        timezone:  {
            type: Boolean,
            default: true
        },
        locale: {
            type: String,
            default: "America/Sao_Paulo"
        },
        formatPattern: {
            type: String,
            default: "DD/MM/YYYY HH:mm:ss"
        }
    },
    computed: {
        formatted() {
            if (!this.date) {
                return "";
            }
            let momentDate = null;
            if (typeof this.date === "string") {
                momentDate = moment.utc(this.date);
            } else {
                momentDate = this.date;
            }
            if (!(momentDate instanceof moment)) {
                return "";
            }
            if (this.timezone) {
                momentDate.tz(this.locale);
            }
            if (this.format) {
                return momentDate.format(this.formatPattern);
            }
            return momentDate;
        }
    }
}
</script>
import moment from "moment-timezone";

export default {
    install(app) {
        app.config.globalProperties.formatDate = (date) => {
            if (!date) {
                return;
            }
            return moment.utc(date).tz('America/Sao_Paulo').format("YYYY-MM-DD HH:mm:ss");
        }
        app.config.globalProperties.formatCurrency = (amount) => {
            if (!amount) {
                return;
            }
            return (amount/100).toFixed(2);
        }
    }
}
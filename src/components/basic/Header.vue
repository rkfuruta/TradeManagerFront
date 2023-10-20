<template>
    <div class="nav-bar" id="topnav">
        <div class="main">
            <div class="logo" @click="redirect('/')">
                <img src="@/assets/logo/eskinbo_primary.svg" alt="logo" />
            </div>
            <div class="item hamburger" @click="open">
                <img class="hamburger-icon" src="@/assets/icon/align-left.svg" alt="hamburger">
            </div>
            <div class="links">
                <div class="item inventory" @click="redirect('/inventory')">
                    <span>Inventory</span>
                </div>
                <div class="item bot" @click="redirect('/bot')">
                    <span>Bot</span>
                </div>
            </div>
        </div>
        <div class="left">
            <div class="content">
                <CurrencySelector />
                <UserHeader class="user-header item" />
            </div>
        </div>
    </div>
</template>
<script setup>
import UserHeader from "@/components/basic/UserHeader.vue";
import CurrencySelector from "@/components/CurrencySelector.vue";
</script>
<script>
export default  {
    methods: {
        redirect(route) {
            this.$router.push(route);
        },
        open() {
            let x = document.getElementById("topnav");
            if (x.className === "nav-bar") {
                x.className += " responsive";
            } else {
                x.className = "nav-bar";
            }
        }
    }
}

</script>

<style scoped>
.nav-bar {
    background-color: var(--secondary-3);
    color: white;
    width: 100%;
    justify-content: space-between;
    align-items: center;
}
.nav-bar .item {
    padding: 20px;
    cursor: pointer;
}
.nav-bar .left {
    position: absolute;
    top: 0;
    right: 0;
}
.nav-bar .left .content {
    display: flex;
    align-items: center;
}
.hamburger-icon {
    display: flex;
    filter: var(--svg-white);
}
.nav-bar .main .links {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
}
.nav-bar .main .links .item:hover {
    background-color: var(--secondary-4);
}
.nav-bar .logo {
    cursor: pointer;
    display: flex;
    padding-left: 15px;
    padding-right: 20px;
}
.nav-bar .logo img {
    width: 110px;
}
@media screen and (min-width: 601px) {
    .nav-bar .main .hamburger {
        display: none;
    }
    .nav-bar .main {
        display: flex;
    }
}
@media screen and (max-width: 600px) {
    .nav-bar .main .links .item {
        display: none;
    }
    .nav-bar.responsive {
        position: relative;
    }
    .nav-bar.responsive .main .links .item {
        float: none;
        display: block;
        text-align: left;
    }
    .nav-bar.responsive .main .links .item:hover {
        background-color: var(--secondary-4);
    }
    .nav-bar.responsive .main .links .item {
        background-color: var(--secondary-2);
        width: 100%;
    }
}
</style>
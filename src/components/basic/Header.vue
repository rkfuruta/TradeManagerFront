<template>
    <div class="nav-bar">
        <div class="main">
            <div class="item home" @click="redirect('/')">
                <span>Home</span>
            </div>
            <div class="item inventory" @click="redirect('/inventory')">
                <span>Inventory</span>
            </div>
        </div>
        <UserHeader class="user-header" />
    </div>
</template>
<script setup>
import UserHeader from "@/components/basic/UserHeader.vue";
</script>
<script>
export default  {
    methods: {
        redirect(route) {
            this.$router.push(route);
        }
    }
}

</script>

<style scoped>

.nav-bar {
    background-color: #383838;
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}
.nav-bar .main {
    display: flex;
}
.nav-bar .item {
    padding: 20px;
    cursor: pointer;
}
.nav-bar .item:hover {
    background-color: #181818;
}
.nav-bar .user-header {
    display: flex;
    justify-content: end;
}
</style>
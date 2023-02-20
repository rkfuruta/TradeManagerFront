<template>
    <div class="item-wrapper">
        <div class="head">
            <span class="name" :title="item.market_name">{{item.market_name}}</span>
        </div>
        <div class="content">

        </div>
        <div class="footer">

        </div>
    </div>
</template>
<script>
export default {
    props: {
        item: {}
    }
}
</script>
<style scope>
.item-wrapper {
    background-color: #383838;
    min-width: 250px;
    padding: 20px;
}
.item-wrapper .name {
    white-space: nowrap;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
}
</style>
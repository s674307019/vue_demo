<template>
    <div class="consumerLists">
        <div class="search">
            <input class="searchInput" type="text" placeholder="输入手机号/昵称/订单号搜索"
                   v-model="searchVal"
                   :class="{'searchInputBg':searchVal.length===0}">
            <img @touchend="searchBtnFn" src="../../../assets/icons/btn_search@2x.png" alt="">
        </div>
        <div class="orderMenu">
            <router-link to="/consumerLists/consumerProject" replace tag="section" class="menuList">项目消费清单</router-link>
            <router-link to="/consumerLists/consumerCard" replace tag="section" class="menuList">会员卡消费</router-link>
        </div>
        <router-view :searchVal="searchVal2"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'consumerLists',
        components: {},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
                searchVal2:''
            }
        },
        created() {
        },
        computed: {},
        watch: {},
        methods: {
            searchBtnFn(){
                if (this.searchVal){
                    this.searchVal2=this.searchVal
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/common.styl"
    .consumerLists
        width 100%
        .search
            .searchInputBg
                text-indent 2em
                background url("../../../assets/icons/icon_search.png") 25% center no-repeat $white
                background-size 13px
        @media screen and (min-width: 320px)
            .search
                .searchInputBg
                    background-position 17% center
        @media screen and (min-width: 375px)
            .search
                .searchInputBg
                    background-position 23% center
        @media screen and (min-width: 414px)
            .search
                .searchInputBg
                    background-position 26% center
        .orderMenu
            $flex()
            background-color $white
            $border(bottom)
            width @width
            height 50px
            .menuList
                flex 1
                text-align center
                color #C2C2C2
                font-weight 600
            .router-link-exact-active
                color $color7
</style>

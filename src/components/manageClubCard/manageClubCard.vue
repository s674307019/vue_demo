<template>
    <div class="manageClubCard">
        <div class="search">
            <input class="searchInput" type="text" placeholder="输入卡片名称搜索"
                   v-model="searchVal2"
                   :class="{'searchInputBg':searchVal2.length===0}"
                   @focus="$store.state.buttonShow=false">
            <img @touchend="searchBtnFn" src="../../assets/icons/btn_search@2x.png" alt="">
        </div>
        <div class="orderMenu">
            <router-link to="/manageClubCard/whole" replace tag="section" class="menuList">全部</router-link>
            <router-link to="/manageClubCard/onceCard" replace tag="section" class="menuList">次卡</router-link>
            <router-link to="/manageClubCard/discountCard" replace tag="section" class="menuList">折扣卡</router-link>
            <router-link to="/manageClubCard/experienceCard" replace tag="section" class="menuList">体验卡</router-link>
        </div>
        <router-view :searchVal="searchVal"></router-view>
        <router-link to="/publishCard" tag="button" v-show="$store.state.buttonShow">发布卡片</router-link>
    </div>
</template>

<script>
    export default {
        name: 'manageClubCard',
        components: {},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
                searchVal2:'' // 搜索 输入的值2
            }
        },
        created() {
        },
        computed: {},
        watch: {},
        methods: {
            searchBtnFn(){ // 失去焦点，设置searchVal的值
                this.$store.state.buttonShow=true
                this.searchVal=this.searchVal2
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .manageClubCard
        padding-bottom 50px
        width 100%
        .search
            .searchInputBg
                text-indent 2em
                background url("../../assets/icons/icon_search.png") 34% center no-repeat $white
                background-size 13px
        .orderMenu
            $flex()
            background-color $white
            width @width
            height 50px
            .menuList
                flex 1
                text-align center
                color #C2C2C2
                font-weight 600
            .router-link-exact-active
                color $color7
        button
            $button(fixed,$color6,$color7,100%)
        @media screen and (min-width: 320px)
            .search
                .searchInputBg
                    background-position 30% center
        @media screen and (min-width: 375px)
            .search
                .searchInputBg
                    background-position 33% center
        @media screen and (min-width: 414px)
            .search
                .searchInputBg
                    background-position 34% center
</style>

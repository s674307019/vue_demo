<template>
    <div class="accountAndSecurity">
        <div class="listsBox">
            <div class="listXs">
                <section class="listTitle">
                    <p>当前手机号</p>
                </section>
                <section class="listText">
                    <p>{{mobile}}</p>
                </section>
            </div>
        </div>
        <router-link :to="{name:'CheckVerify',params:{flag:'loginMobile'}}" tag="button">更换手机号</router-link>
    </div>
</template>

<script>
    export default {
        name: 'accountAndSecurity',
        components: {},
        data() {
            return {
                mobile:this.$store.state.STOREINFO.LOGINMOBILE
            }
        },
        created() {
        },
        methods: {}
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/common.styl"
    .accountAndSecurity
        position fixed
        top 0
        left 0
        background-color $color9
        width 100%
        height 100%
        overflow-y auto
        .listsBox
            .listXs:last-child
                border-bottom 0
        button
            $button(fixed,$color6,$color7,100%)
</style>

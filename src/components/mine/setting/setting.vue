<template>
    <div class="setting">
        <div class="listsBox">
            <!--<router-link to="/messageTemplate" tag="div" class="listXs arrows">-->
                <!--<section class="listTitle">-->
                    <!--<p>消息模板</p>-->
                <!--</section>-->
            <!--</router-link>-->
            <!--<router-link to="/pushMessage" tag="div" class="listXs arrows">-->
                <!--<section class="listTitle">-->
                    <!--<p>推送消息</p>-->
                <!--</section>-->
            <!--</router-link>-->
            <router-link to="/accountAndSecurity" tag="div" class="listXs arrows">
                <section class="listTitle">
                    <p>账号与安全</p>
                </section>
            </router-link>
        </div>
        <button @touchend="quitAccount">退出当前账号</button>
        <handle-box :handleStatus="handleStatus" :handleWords="'确定要退出吗？'" :confirmFn="confirmFn" :cancelFn="cancelFn"></handle-box>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import HandleBox from '../../common/handleBox'
    export default {
        name: 'setting',
        components: {HandleBox},
        data() {
            return {
                handleStatus:false
            }
        },
        created() {
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            confirmFn(){
                this.loadingShowA()
                localStorage.clear()
                sessionStorage.clear()
                this.$store.state.STOREINFO.ACCESSTOKEN=''
                let webUrl=window.location.href.split('#')[0]
                setTimeout(()=>{
                    this.loadingShowA()
                    window.location.href=webUrl
                },1500)
            },
            cancelFn(){
                this.handleStatus=false
            },
            quitAccount(){
                this.handleStatus=true
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../../assets/stylus/common.styl"
    .setting
        position fixed
        top 0
        left 0
        background-color $color9
        width 100%
        height 100%
        overflow-y auto
        button
            $button(fixed,$white,#F00,100%)
</style>

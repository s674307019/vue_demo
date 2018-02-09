<template>
  <div id="app">
    <tabBar v-show="tabBarShow"></tabBar>
    <router-view v-wechat-title="$route.meta.title" img-set="./static/logo.png"></router-view>
    <!--<transition name="cartoon">-->
    <!--</transition>-->
    <loading></loading>
    <error-alert></error-alert>
    <none-list></none-list>

    <div class="shopChecking" v-show="$store.state.shopChecking">店铺正在审核，不能进行营业</div>
    <check-pass v-show="$store.state.checkPass" :checkPassFn="checkPassFnA"></check-pass>
    <check-not-pass v-show="$store.state.checkNotPass" :checkReason="checkReasonA"></check-not-pass>
    <decline v-show="$store.state.decline" :declineWords="$store.state.declineWords"></decline>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'

  import TabBar from './components/tabBar/tabBar'
  import Loading from './components/common/loading'
  import ErrorAlert from './components/common/errorAlert'
  import NoneList from './components/common/noneList'

  import CheckPass from './components/home/checkPass' // 审核通过
  import CheckNotPass from './components/home/checkNotPass' // 审核失败
  import Decline from './components/home/decline' // 拒绝理由
  export default {
    name: 'app',
    components: { TabBar,Loading,ErrorAlert,NoneList,CheckPass,CheckNotPass,Decline },
    data(){
      return {
        tabBarShow: false // 菜单显示状态
      }
    },
    created(){
      let route = this.$route.path // 控制tabBar显示
      if (route === '/home' || route === '/mine') {
        this.tabBarShow = true

        if (this.$store.state.stateStatusVal==='0' || this.$store.state.stateStatusVal==='2' || !this.$store.state.stateStatusVal){ // 显示正在审核
          this.$store.state.shopChecking=true
        }
      } else {
        this.tabBarShow = false

        if (this.$store.state.stateStatusVal==='0' || this.$store.state.stateStatusVal==='2' || !this.$store.state.stateStatusVal){ // 显示正在审核
          this.$store.state.shopChecking=false
        }
      }
    },
    watch: {
      $route(to, from){
        let gearDate=document.getElementsByClassName('gearDate')[0]
        if (gearDate){ // 如果日期控件没关闭，则关闭
          document.body.removeChild(gearDate)
        }
        if (this.$store.state.reminderStatus){ // 路由发生变化，隐藏提示信息
          this.$store.state.reminderStatus=false
          this.$store.state.reminderWords=''
        }
        if (this.$store.state.loadingShow){ // 路由发生变化，关闭loading效果
          this.$store.state.loadingShow=false
        }

        if (to.path === '/home' || to.path === '/mine') { // （监听路由变化）控制tabBar显示
          this.tabBarShow = true

          if (this.$store.state.stateStatusVal==='0' || this.$store.state.stateStatusVal==='2' || !this.$store.state.stateStatusVal || !this.$store.state.stateStatusVal==='2'){ // 显示正在审核
            this.$store.state.shopChecking=true
          }
        } else{
          this.tabBarShow = false

          if (this.$store.state.stateStatusVal==='0' || this.$store.state.stateStatusVal==='2' || !this.$store.state.stateStatusVal){ // 显示正在审核
            this.$store.state.shopChecking=false
          }
        }
      }
    },
    methods:{
      ...mapActions(['checkPassFnA','checkReasonA'])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./assets/stylus/reset.styl"
  #app
    overflow hidden
    width 100%
    .cartoon-enter-active
      position absolute
      top 0
      right 0
      animation slideInRight .3s
    .cartoon-leave-active
      position absolute
      top 0
      left 0
      animation slideOutLeft .3s
    .shopChecking
      position fixed
      top 0
      left 0
      width 100%
      height 30px
      line-height @height
      font-size 12px
      color #FFF
      text-align center
      background-color #FF6405
</style>

<template>
    <div class="manageGoods">
        <div class="search">
            <input class="searchInput" type="text" placeholder="搜索商品项目名称"
                   v-model="searchVal"
                   @focus="addItemStatus=false"
                   @blur="addItemStatus=true"
                   :class="{'searchInputBg':searchVal.length===0}">
            <img @touchend="searchBtnFn" src="../../assets/icons/btn_search@2x.png" alt="">
        </div>
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="projectBox">
                <router-link :to="{name:'LookItem',query:{goodsId:gls.goodsId}}" tag="div" class="projectList" v-for="gls in goodsLists" :key="gls.goodsId">
                    <div class="projectInfo">
                        <section class="img"><img :src="gls.goodsImageUrl" alt=""></section>
                        <section class="text">
                            <p class="goodsName">{{gls.goodsName}}</p>
                            <p class="goodsMsg">类别：<span>{{gls.goodsTypeName}}</span></p>
                            <p class="goodsMsg">总价：<span class="money">&#165;{{gls.price}}</span></p>
                        </section>
                    </div>
                </router-link>
            </div>
        </pull-refresh>
        <router-link to="/addItem" tag="div" class="addBtn" v-show="addItemStatus"><img src="../../assets/icons/btn_add@2x.png" alt=""></router-link>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'manageGoods',
        components: {PullRefresh},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
                pageNo:1,
                goodsLists:[],
                addItemStatus:true,
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.getGoodsFn(this.pageNo,this.searchVal) // 获取数据
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            getGoodsFn(pn,gn,fun){ // 获取商品列表
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/goods/list`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        pageNo:pn,
                        pageSize:7,
                        goodsName:gn
                    }
                }).then((res) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        if(pn===1){
                            _this.goodsLists=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='还没有商品列表'
                                _this.$store.state.reminderStatus=true
                            }else {
                                _this.$store.state.reminderWords=''
                                _this.$store.state.reminderStatus=false
                            }
                        }else {
                            _this.goodsLists=_this.goodsLists.concat(d.data.list)
                            if (d.data.list.length===0){
                                _this.hasNoMore=true
                            }else {
                                _this.hasNoMore=false
                            }
                        }
                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            searchBtnFn(){ // 失去焦点
                this.getGoodsFn(this.pageNo,this.searchVal)
            },
            resetFn(){ // 重置上拉下拉数据
                this.intNumber={
                    downY:0,
                    upY:0
                }
            },
            pullDownFn(){
                // 下拉刷新
                this.pageNo=1
                this.searchVal=''
                this.hasNoMore=false
                this.getGoodsFn(this.pageNo,this.searchVal,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getGoodsFn(this.pageNo,this.searchVal,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/projectOrder.styl"
    .manageGoods
        width 100%
        .search
            .searchInputBg
                text-indent 2em
                background url("../../assets/icons/icon_search.png") 35% center no-repeat $white
                background-size 13px
        .orderMenu
            $flex()
            width @width
            height 50px
            .menuList
                flex 1
                text-align center
                color #C2C2C2
                font-weight 600
            .router-link-exact-active
                color $color7
        .addBtn
            position fixed
            left 50%
            bottom 40px
            margin-left -40px
            img
                width 80px
                height 80px
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
                    background-position 35% center
</style>

<template>
    <div class="chooseGoodsItem">
        <div class="search">
            <input class="searchInput" type="text" placeholder="搜索商品项目名称"
                   v-model="searchVal"
                   :class="{'searchInputBg':searchVal.length===0}">
            <img @touchend="searchBtnFn" src="../../assets/icons/btn_search@2x.png" alt="">
        </div>
        <pull-refresh :intNumber="intNumber" :pullDownFn="pullDownFn" :pullUpFn="pullUpFn" :hasNoMore="hasNoMore">
            <div class="content">
                <div class="goodsList" v-for="(goods,i) in goodsLists" :key="goods.goodsId" @touchend="checkFn(i)">
                    <span class="check" :class="{'checkActive':checkActive[i]}"></span>
                    <span class="img"><img :src="goods.goodsImageUrl" alt=""></span>
                    <p class="text">
                        <span>商品名：{{goods.goodsName}}</span>
                        <span></span>
                        <span>售价：<span class="money">&#165;{{goods.price}}</span></span>
                    </p>
                </div>
            </div>
        </pull-refresh>
        <button @touchend="addGoodsFn">确定</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import PullRefresh from '../common/pullRefresh'
    export default {
        name: 'chooseGoodsItem',
        components: {PullRefresh},
        data() {
            return {
                searchVal:'', // 搜索 输入的值
                goodsLists:[], // 模拟数据
                checkActive:[],
                checkGoods:[],
                pageNo:1,
                goodsName:'',
                intNumber:{
                    downY:0, // 下拉距离
                    upY:0 // 上拉距离
                },
                hasNoMore:false // 没有更多了
            }
        },
        created() {
            this.getGoodsFn(this.pageNo,this.goodsName)
        },
        computed: {},
        watch: {},
        methods: {
            ...mapActions(['loadingShowA']),
            checkFn(ind){ // 多选
                this.$set(this.checkActive,ind,!this.checkActive[ind])
            },
            addGoodsFn(){
                let _this=this
                let ca=this.checkActive
                if(ca.indexOf(true)!==-1){
                    ca.forEach((c,i)=>{
                        if (c){
                            _this.checkGoods.push(_this.goodsLists[i])
                        }
                    })
                    this.$store.state.chooseGoods=_this.checkGoods
                    _this.$router.back()
                }else {
                    _this.$store.state.errorMsg='请选择商品'
                    _this.$store.state.errorStatus=true
                }
            },
            getGoodsFn(pn,gn,fun){ // 获取商品列表
                let _this=this
                if (!fun){
                    _this.loadingShowA()
                }
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/cashier/search/goods/list`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        pageNo:pn,
                        pageSize:5,
                        goodsName:gn
                    }
                }).then((res) => {
                    if (fun){
                        fun()
                    }else {
                        _this.loadingShowA()
                    }
                    this.$store.state.loadingShow=false
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        if(pn===1){
                            _this.goodsLists=d.data.list
                            if(d.data.list.length===0){
                                _this.$store.state.reminderWords='当前还没有添加商品项目,去添加试试'
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
                    this.$store.state.loadingShow=false
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
                this.goodsName=''
                this.hasNoMore=false
                this.getGoodsFn(this.pageNo,this.goodsName,this.resetFn)
            },
            pullUpFn(){
                // 上拉加载
                this.pageNo++
                this.getGoodsFn(this.pageNo,this.goodsName,this.resetFn)
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .chooseGoodsItem
        width 100%
        background-color $white
        .search
            .searchInputBg
                text-indent 2em
                background url("../../assets/icons/icon_search.png") 34% center no-repeat $white
                background-size 13px
        .content
            padding 0 16px
            width 100%
            .goodsList
                padding 10px 0 10px 30px
                $border(bottom)
                width 100%
                font-size 0
                position relative
                .check
                    position absolute
                    left 0
                    top 50%
                    margin-top -10px
                    display inline-block
                    background url("../../assets/icons/btn_circle@2x.png") center no-repeat
                    background-size 20px
                    width 20px
                    height 20px
                .checkActive
                    background-image url("../../assets/icons/btn_check@2x.png")
                .img
                    vertical-align middle
                    img
                        width 112px
                        height 64px
                .text
                    margin-left 15px
                    display inline-block
                    vertical-align top
                    font-size 14px
                    line-height 20px
                    max-width 63%
                    span
                        &:first-child
                            display block
                            margin 5px 0 15px 0
                            width 100%
                            white-space nowrap
                            overflow hidden
                            text-overflow ellipsis
                        .money
                            display inline
                            color #F00
                &:last-child
                    border-bottom 0
        button
            $button(fixed,$color6,$color7,100%)
    @media screen and (min-width: 320px)
        .chooseGoodsItem
            .content
                .goodsList
                    .text
                        max-width 50%
            .search
                .searchInputBg
                    background-position 30% center
    @media screen and (min-width: 375px)
        .chooseGoodsItem
            .content
                .goodsList
                    .text
                        max-width 59%
            .search
                .searchInputBg
                    background-position 32% center
    @media screen and (min-width: 414px)
        .chooseGoodsItem
            .content
                .goodsList
                    .text
                        max-width 63%
            .search
                .searchInputBg
                    background-position 34% center
</style>

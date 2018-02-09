<template>
    <div class="addItem">
        <div class="goodsItem">
            <figure>
                <section>
                    <p class="upload">
                        <span>商品照片</span>
                        <span class="uploadRight">
                            <img class="img" v-show="goodsImage.length>0" :src="goodsImage" alt="">
                        </span>
                    </p>
                    <p>
                        <span>商品名称</span>
                        <input type="button" placeholder="请输入商品名称" maxlength="20" v-model="goodsName">
                    </p>
                    <p>
                        <span>类型</span>
                        <input type="button" v-model="goodsType">
                    </p>
                    <p>
                        <span>销售价格</span>
                        <input type="button" min="0" placeholder="请输入销售价格" v-model="price">
                    </p>
                    <p>
                        <span>单位</span>
                        <input type="button" placeholder="请输入单位" maxlength="5" v-model="unit">
                    </p>
                    <p>
                        <span>有效期</span>
                        <input style="appearance: none;background-color: #FFF;" id="datePinker" type="button" placeholder="请选择有效期" v-model="effectiveDate">
                    </p>
                </section>
            </figure>
            <figure>
                <figcaption>商品介绍</figcaption>
                <section class="textArea">
                    <p>
                        <textarea style="background: none" placeholder="商品特色、简介" maxlength="50" readonly v-model="goodsDesc"></textarea>
                        <span>2-50字</span>
                    </p>
                </section>
            </figure>
            <figure>
                <figcaption>使用须知</figcaption>
                <section class="textArea">
                    <p>
                        <textarea style="background: none" placeholder="使用时间人数等" maxlength="400" readonly v-model="useExplain"></textarea>
                        <span>2-400字</span>
                    </p>
                </section>
            </figure>
            <figure>
                <section class="switch">
                    <p>
                        <span>是否上架</span>
                        <section class="switchBox">
                            <switch-bar :switchStatus="putaway" :switchFn="putawayFn"></switch-bar>
                        </section>
                    </p>
                </section>
            </figure>
        </div>
        <router-link :to="{name:'EditorItem',query:{goodsId:goodsId}}" tag="button" replace v-show="!putaway">编辑</router-link>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import SwitchBar from '../common/switchBar'
    export default {
        name: 'addItem',
        components: {SwitchBar},
        data() {
            return {
                goodsType: '', // 商品分类列表
                putaway:null, //是否上架
                goodsId:'', // 商品id
                goodsImage: '', // 商品照片
                btn1Active:false, // 开关按钮状态
                btn2Active:true,
                goodsName:'', // 商品名称
                goodsTypeId:-1, // 商品类型
                price:'', // 商品价格
                unit:'次', // 商品单位
                effectiveDate:'', // 有效期
                goodsDesc:'', // 介绍
                useExplain:'', // 使用说明
            }
        },
        created() {
            this.goodsTypeListFn() // 获取分类
            this.goodsId=this.$route.query.goodsId
            if (this.goodsId){
                this.getGoodsDetail() // 获取商品详情
            }else {
                this.$router.replace('/manageGoods')
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            switchFn(){ // 开关按钮
            },
            putawayFn(){ // 是否上架
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/goods/shelf`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        goodsId:_this.goodsId,
                        state:_this.putaway?'0':'1'
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
                    if (d.code === 0){
                        _this.putaway = !_this.putaway
                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            wordsReplaceFn(w){ // 替换p标签
                let str1=w.replace(/(<p>)/g,'')
                let str2=str1.replace(/(<\/p>)/g,'\n')
                return str2
            },
            goodsTypeListFn(){ // 获取商品分类
                let _this=this
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/goods/type/list`,
                }).then((res) => {
                    let d=res.data
                    if (d.code === 0){
                        _this.goodsType=d.data[0].name
                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            getGoodsDetail(){ // 获取商品详情
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/goods/detail`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        goodsId:this.goodsId
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.goodsImage=d.data.goodsImage
                        _this.goodsName=d.data.goodsName
                        _this.goodsTypeId=d.data.goodsTypeId
                        _this.price=d.data.price
                        _this.unit=d.data.unit
                        _this.effectiveDate=d.data.effectiveDate
//                        _this.goodsDesc=d.data.goodsDesc
                        _this.goodsDesc=_this.wordsReplaceFn(d.data.goodsDesc)
//                        _this.useExplain=d.data.useExplain
                        _this.useExplain=_this.wordsReplaceFn(d.data.useExplain)
                        _this.putaway=d.data.state==='1'?true:false
                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/goodsItem.styl"
    .addItem
        padding-bottom 50px
        background-color $white
        width 100%
        .switchBox
            padding 0
            display inline-block
            vertical-align middle
            float right
        button
            $button(fixed,$color6,$color7,100%)
</style>

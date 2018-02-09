<template>
    <div class="addItem">
        <div class="goodsItem">
            <figure>
                <section>
                    <p class="upload">
                        <span>商品照片</span>
                        <span class="uploadRight">
                            <span class="uploadBtn">点击此处上传</span>
                            <img class="img" v-show="goodsImage.length>0" :src="urlPic+goodsImage" ref="goodsImage" alt="">
                            <span class="btn">
                                <div id="goodsPicBox"><div id="goodsPic" style="width: 100%;height: 100%;">上传</div></div>
                            </span>
                        </span>
                    </p>
                    <p>
                        <span>商品名称</span>
                        <input type="text" placeholder="请输入商品名称" maxlength="20" v-model="goodsName"  @focus="$store.state.buttonShow=false" @blur="$store.state.buttonShow=true">
                    </p>
                    <p>
                        <span>类型</span>
                        <select class="select" v-model="goodsTypeId">
                            <option v-for="gtl in goodsTypeList" :value="gtl.id">{{gtl.name}}</option>
                        </select>
                    </p>
                    <p>
                        <span>销售价格</span>
                        <input type="number" max="99999999" placeholder="请输入销售价格" v-model="price" @keyup="priceFn" @focus="$store.state.buttonShow=false" @blur="$store.state.buttonShow=true">
                    </p>
                    <p>
                        <span>单位</span>
                        <input type="button" placeholder="请输入单位" maxlength="5" v-model="unit">
                    </p>
                    <p>
                        <span>有效期</span>
                        <input style="appearance: none;background-color: #FFF;" id="datePinker" type="button" placeholder="请选择有效期" v-model="effectiveDate" :data-lcalendar="datePinkerStr">
                    </p>
                </section>
            </figure>
            <figure>
                <figcaption>商品介绍</figcaption>
                <section class="textArea">
                    <p>
                        <textarea placeholder="商品特色、简介" maxlength="50" v-model="goodsDesc" @keyup="goodsDescFn" @focus="$store.state.buttonShow=false" @blur="$store.state.buttonShow=true"></textarea>
                        <span>{{goodsDescNum}}-50字</span>
                    </p>
                </section>
            </figure>
            <figure>
                <figcaption>使用须知</figcaption>
                <section class="textArea">
                    <p>
                        <textarea placeholder="使用时间人数等" maxlength="400" v-model="useExplain" @keyup="useExplainFn" @focus="$store.state.buttonShow=false" @blur="$store.state.buttonShow=true"></textarea>
                        <span>{{useExplainNum}}-400字</span>
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
        <button @touchend="checkInputDataFn">确定</button>
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
                goodsTypeList: [{id:-1,name:'选择分类'}], // 商品分类列表
                putaway:true, //是否上架
                goodsId:'', // 商品id
                goodsImage: '', // 商品照片
                btn1Active:false, // 开关按钮状态
                btn2Active:true,
                urlPic:this.$store.state.STOREINFO.QINIUPREFIX, // 图片回显域名
                QiniuUploadToken:'', // 七牛上传文件token
                goodsName:'', // 商品名称
                goodsTypeId:-1, // 商品类型
                price:'', // 商品价格
                unit:'次', // 商品单位
                effectiveDate:'', // 有效期
                datePinkerStr:'', // 开始结束时间
                goodsDesc:'', // 介绍
                goodsDescNum:2, // 介绍字数
                useExplain:'', // 使用说明
                useExplainNum:2 // 使用说明字数
            }
        },
        created() {
            let date=this.timeFn() // 获取当前时间
            this.effectiveDate=date
            this.datePinkerStr=`${date},3999-12-31`

            this.goodsTypeListFn() // 获取商品分类
            this.getQiniuUploadToken() // 获取七牛token
        },
        mounted(){
            // 组件挂载完成初始化日期
            let calendar = new lCalendar()
            calendar.init({
                'trigger': '#datePinker', //标签id
                'type': 'date'
            })
        },
        methods: {
            ...mapActions(['loadingShowA']),
            switchFn(){ // 开关按钮
                this.btn1Active = !this.btn1Active
            },
            putawayFn(){ // 是否上架
                this.putaway = !this.putaway
            },
            timeFn(){ // 日期格式化函数
                let de = new Date()
                return de.getFullYear()+'-'
                    +((de.getMonth()+1)>=10?(de.getMonth()+1):'0'+(de.getMonth()+1))+'-'
                    +(de.getDate()>=10?de.getDate():'0'+de.getDate())
            },
            goodsTypeListFn(){ // 获取商品分类
                let _this=this
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/goods/type/list`,
                }).then((res) => {
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.goodsTypeList=_this.goodsTypeList.concat(d.data)
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
            uploadGoodsPicFn(res){ // 商品照片
                let _this=this
                let d=JSON.parse(res.response)
                this.goodsImage=d.key
                this.$refs.goodsImage.onload=function (e) {
                    e.stopPropagation()
                    _this.loadingShowA() // 图片加载完成关闭 加载中...
                }
            },
            getQiniuUploadToken(){ // 获取七牛上传token
                let _this=this
                this.$http({
                    method: 'GET',
                    url: `${_this.$URL}api/v1/base/qiniu/token`,
                }).then((res) => {
                    let d = res.data
//                    console.log(d)
                    if (d.code === 0) {
                        _this.$store.state.errorStatus=false
                        _this.QiniuUploadToken=d.data.token
                        qiniuImgUpload('goodsPic','goodsPicBox',false,_this.QiniuUploadToken,_this.urlPic,'goods_',_this.uploadGoodsPicFn,_this.getQiniuUploadToken,_this.loadingShowA)
                    }else {
                        _this.$store.state.errorMsg=d.msg
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    _this.$store.state.errorMsg='七牛token获取失败'
                    _this.$store.state.errorStatus=true
                    console.log(err)
                })
            },
            checkInputDataFn(){
                if (!this.goodsImage){
                    this.$store.state.errorMsg='请上传商品图片'
                    this.$store.state.errorStatus=true
                }else if(!this.goodsName){
                    this.$store.state.errorMsg='请输入商品名称'
                    this.$store.state.errorStatus=true
                }else if(this.goodsTypeId===-1){
                    this.$store.state.errorMsg='请选择商品类型'
                    this.$store.state.errorStatus=true
                }else if(!this.price){
                    this.$store.state.errorMsg='请输入销售价格'
                    this.$store.state.errorStatus=true
                }else if(parseFloat(this.price)>100000000){
                    this.$store.state.errorMsg='售价应小于100000000'
                    this.$store.state.errorStatus=true
                }else if(!this.goodsDesc){
                    this.$store.state.errorMsg='请输入商品介绍'
                    this.$store.state.errorStatus=true
                }else if(this.goodsDesc.length<2){
                    this.$store.state.errorMsg='商品介绍应在2-50字以内'
                    this.$store.state.errorStatus=true
                }else if(!this.useExplain){
                    this.$store.state.errorMsg='请输入使用说明'
                    this.$store.state.errorStatus=true
                }else if(this.useExplain.length<2){
                    this.$store.state.errorMsg='使用说明应在2-400字以内'
                    this.$store.state.errorStatus=true
                }else {
                    this.confirmFn()
                }
            },
            wordsSplitFn(w){ // 按照回车拆分，组合成字符串
                let arr=w.split(/\n/g)
                let str=''
                arr.forEach((c,i)=>{
                    str+=`<p>${c}</p>`
                })
                return str
            },
            confirmFn(){
                let _this=this
                _this.loadingShowA()
                let dataPost={
                    'goodsImage':_this.goodsImage,
                    'goodsName':_this.goodsName,
                    'goodsTypeId':_this.goodsTypeId,
                    'price':_this.price,
                    'unit':_this.unit,
                    'effectiveDate':_this.effectiveDate,
                    'goodsDesc':_this.wordsSplitFn(_this.goodsDesc),
                    'useExplain':_this.wordsSplitFn(_this.useExplain),
                    'state':_this.putaway?1:0
                }
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/goods/add`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:dataPost
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.goodsId=''
                        _this.goodsImage=''
                        _this.goodsName=''
                        _this.goodsTypeId=-1
                        _this.price=''
                        _this.unit=''
                        _this.effectiveDate=this.timeFn()
                        _this.goodsDesc=''
                        _this.useExplain=''
                        _this.putaway=true

                        _this.$store.state.errorMsg='<span style="color:#4CCF6F;">添加成功</span>'
                        _this.$store.state.errorStatus=true
                        setTimeout(()=>{
                            _this.$store.state.errorStatus=false
                            _this.$store.state.errorMsg=''
                            _this.$router.back()
                        },1500)
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
            goodsDescFn(){ // 商品介绍计数
                if (this.goodsDesc.length>2){
                    this.goodsDescNum=this.goodsDesc.length
                }
            },
            useExplainFn(){ // 使用说明计数
                this.useExplain=this.useExplain.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\.\。\，\、\,\;\；\:\'\“\”\：\：\n]/g,'')
                if (this.useExplain.length>2){
                    this.useExplainNum=this.useExplain.length
                }
            },
            priceFn(){ // 销售价格
                this.price=this.price.replace(/[^\d.]/g,'')
                let fv=this.price
                if (parseFloat(fv)>100000000){
                    this.$store.state.errorMsg='售价应小于100000000'
                    this.$store.state.errorStatus=true
                }else {
                    this.price=fv.trim().slice(0,fv.indexOf('.') === -1
                        ? fv.length
                        : fv.indexOf('.') + 3)
                }
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/goodsItem.styl"
    .addItem
        background-color $white
        width 100%
        .switchBox
            padding 0
            display inline-block
            vertical-align middle
            float right
    button
        border 0
        background-color $color6
        color $color7
        font-size 17px
        width 100%
        height 50px
</style>

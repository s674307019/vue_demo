<template>
    <div class="shopCertify">
        <div class="goodsItem">
            <figure>
                <figcaption>一、营业执照</figcaption>
                <section>
                    <p>
                        <span style="width: 42%;">营业执照注册号</span>
                        <input style="width: 58%;" type="tel" placeholder="请输入注册号" maxlength="15" v-model="businessNum" @keyup="businessNumFn">
                    </p>
                    <p class="upload">
                        <span>营业执照</span>
                        <span class="uploadRight">
                            <span class="uploadBtn">点击此处上传</span>
                            <img class="img" v-show="src" :src="urlPic+src" ref="src" alt="">
                            <span class="btn">
                                <div id="licenseBox"><div id="license" style="width: 100%;height: 100%;">上传</div></div>
                            </span>
                        </span>
                    </p>
                    <p>
                        <span>有效期</span>
                        <input style="appearance: none;" id="datePinker1" type="button" :data-lcalendar="datePinkerStr1" v-model="validity">
                    </p>
                    <p class="dueBox">
                        <span>到期日期</span>
                        <input class="dueDate" id="datePinker2" type="button" :data-lcalendar="datePinkerStr2" v-model="dueDate" v-show="!foreverActive">
                        <span class="forever" :class="{'foreverActive':foreverActive}" @touchend="foreverActive=!foreverActive">永久</span>
                    </p>
                    <p>
                        <span>法人</span>
                        <input type="text" placeholder="请输入法人名称" maxlength="12" v-model="legalPerson">
                    </p>
                    <p>
                        <span style="width: 34%;">身份证号码</span>
                        <input class="IDCardNo" style="width: 60%;" type="tel" placeholder="请输入法人代表身份证号码" maxlength="18" v-model="IDCardNo" @blur="IDCardNoFn">
                    </p>
                </section>
            </figure>
            <figure>
                <figcaption>二、商户信息</figcaption>
                <section>
                    <p>
                        <span>店铺名称</span>
                        <input type="text" placeholder="请输入店铺名称" maxlength="10" v-model="storeName">
                    </p>
                    <p>
                        <span>手机号</span>
                        <input type="tel" placeholder="请输入手机号" maxlength="11" v-model="phoneNum" @keyup="phoneNumFn">
                    </p>
                    <p>
                        <span>商家地址</span>
                        <input type="text" placeholder="请选择商铺地址" readonly @touchend="wxConfigFn" v-model="storeAddress">
                    </p>
                    <p>
                        <span>地址简称</span>
                        <input type="text" placeholder="请输入地址简称" maxlength="8" v-model="shortAddress">
                    </p>
                    <p class="upload">
                        <span style="width: 29%;">店铺LOGO</span>
                        <span class="uploadRight">
                            <span class="uploadBtn">点击此处上传</span>
                            <img class="img" v-show="logo" :src="urlPic+logo" ref="logo" alt="">
                            <span class="btn">
                                <div id="shopLogoBox"><div id="shopLogo" style="width: 100%;height: 100%;">上传</div></div>
                            </span>
                        </span>
                    </p>
                </section>
            </figure>
            <figure>
                <figcaption>店铺照片</figcaption>
                <section class="storePic">
                    <div class="shopPicBox">
                        <div class="shopPic">
                            <div class="picLists">
                                <span class="pic" v-for="(sPic,i) in storePic">
                                    <img :src="urlPic+sPic.imageName" alt="">
                                    <i class="delPic" @touchend="delPicFn(i)" v-show="storePic.length<3"></i>
                                </span>
                                <span class="uploadButton" >
                                    <div id="shopPicBox"><div id="shopPic" style="width: 100%;height: 100%;">+</div></div>
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </figure>
        </div>
        <button @touchend="checkInputStoreMsg">确定</button>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
    name: 'shopCertify',
    components: {},
    data() {
        return {
            phoneRegular:/^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            IDCardRegular:/(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
            urlPic:this.$store.state.STOREINFO.QINIUPREFIX, // 图片回显域名
            src: '', // 营业执照照片
            logo:'', // 店铺logo照片
            storePic:[], // 店铺照片
            validity:'1949-01-01', // 有效期
            dueDate:'2099-12-31', // 到期日期
            foreverActive:false, // 永久按钮
            QiniuUploadToken:'', // 七牛上传文件token
            businessNum:'', // 营业执照注册号
            legalPerson:'', // 法人
            IDCardNo:'', // 身份证号码
            storeName:'', // 店铺名称
            phoneNum:'', // 手机号
            storeAddress:'', // 商家地址
            shortAddress:'', // 地址简称
            storePoint:{}, // 商家经纬度
            datePinkerStr1:'',
            datePinkerStr2:''
        }
    },
    created() {
        this.datePinkerStr1=`1949-01-01,${this.timeFn()}`
        this.datePinkerStr2='1949-01-01,2099-12-31'

        // 判断是新建还是重新编辑
//        console.log(this.$route.params.editor)
        if (this.$store.state.decline && this.$route.params.editor){
            this.$store.state.shopChecking=false
            this.$store.state.decline=false
            this.getStoreInfoFn()
        }else {
            // 获取商家输入信息
            let storeMsg=this.$store.state.STOREMSG
            if (storeMsg.businessNum){
                this.businessNum=storeMsg.businessNum
                if (storeMsg.src){
                    this.src=storeMsg.src
                }
                this.validity=storeMsg.validity
                this.legalPerson=storeMsg.legalPerson
                this.IDCardNo=storeMsg.IDCardNo
                this.storeName=storeMsg.storeName
                this.phoneNum=storeMsg.phoneNum
                this.shortAddress=storeMsg.shortAddress

                if (storeMsg.logo){
                    this.logo=storeMsg.logo
                }
                if (storeMsg.storePic.length!==0){
                    this.storePic=storeMsg.storePic
                }

                if (storeMsg.dueDate==='3999-12-31'){
                    this.foreverActive=true
                    this.dueDate='1949-01-01'
                }else {
                    this.foreverActive=false
                    this.dueDate=storeMsg.dueDate
                }
            }


            // 商家经纬度
            let storePoint=this.$store.state.STOREPOINT
            if (storePoint && storePoint.lat){
                this.storePoint=storePoint
            }
            // 商家地址
            let storeInfoWindow=this.$store.state.STOREINFOWINDOW
            if (storeInfoWindow.contents){
                this.storeAddress=`${storeInfoWindow.province}${storeInfoWindow.city}${storeInfoWindow.section}${storeInfoWindow.contents}`
//                this.storeAddress=storeInfoWindow.section+storeInfoWindow.contents
            }
        }

        this.getQiniuUploadToken() // 获取七牛token
    },
    mounted(){
        // 组件挂载完成初始化日期
        let calendar1 = new lCalendar()
        calendar1.init({
            'trigger': '#datePinker1', //标签id
            'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        })
        let calendar2 = new lCalendar()
        calendar2.init({
            'trigger': '#datePinker2', //标签id
            'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
        })
    },
    methods: {
        ...mapActions(['loadingShowA']),
        uploadSrcFn(res){ // 营业执照照片
            let _this=this
            let d=JSON.parse(res.response)
            this.src=d.key
            this.$refs.src.onload=function (e) {
                e.stopPropagation()
                _this.loadingShowA() // 图片加载完成关闭 加载中...
            }
        },
        uploadLogoFn(res){ // 店铺logo
            let _this=this
            let d=JSON.parse(res.response)
            this.logo=d.key
            this.$refs.logo.onload=function (e) {
                e.stopPropagation()
                _this.loadingShowA() // 图片加载完成关闭 加载中...
            }
        },
        uploadstorePicFn(res){ // 店铺照片
            let _this=this
            let d=JSON.parse(res.response)
            this.storePic.push({imageName:d.key})

            setTimeout(() => {
                _this.loadingShowA() // 图片加载完成关闭 加载中...
            }, 1500)
        },
        getQiniuUploadToken(){ // 获取七牛上传token
            let _this=this
            this.$http({
                method: 'GET',
                url: `${_this.$URL}api/v1/base/qiniu/token`,
            }).then((res) => {
                let d = res.data
//                console.log('七牛token',d)
                if (d.code === 0) {
                    _this.$store.state.errorStatus=false
                    _this.QiniuUploadToken=d.data.token
                    qiniuImgUpload('license','licenseBox',false,_this.QiniuUploadToken,_this.urlPic,'store_',_this.uploadSrcFn,_this.getQiniuUploadToken,_this.loadingShowA)
                    qiniuImgUpload('shopLogo','shopLogoBox',false,_this.QiniuUploadToken,_this.urlPic,'store_',_this.uploadLogoFn,_this.getQiniuUploadToken,_this.loadingShowA)
                    qiniuImgUpload('shopPic','shopPicBox',false,_this.QiniuUploadToken,_this.urlPic,'store_',_this.uploadstorePicFn,_this.getQiniuUploadToken,_this.loadingShowA)
                }else {
                    _this.$store.state.errorMsg=d.msg
                    _this.$store.state.errorStatus=true
                }
            }).catch((err) => {
                _this.$store.state.errorMsg='七牛token获取失败'
                _this.$store.state.errorStatus=true
                console.log('七牛Error',err)
            })
        },
        timeFn(){ // 日期格式化函数
            let de = new Date()
            return de.getFullYear()+'-'
                +((de.getMonth()+1)>=10?(de.getMonth()+1):'0'+(de.getMonth()+1))+'-'
                +(de.getDate()>=10?de.getDate():'0'+de.getDate())
        },
        contrastFn(v){ // 比较时间，格式化时间
            let n=parseInt(v.replace(/-/g,''))
            return n
        },
        storeAddressFn(){
            // 储存商家信息$store
            let STOREMSG={
                businessNum:this.businessNum,
                src:this.src,
                validity:this.validity,
                dueDate:'',
                legalPerson:this.legalPerson,
                IDCardNo:this.IDCardNo,
                storeName:this.storeName,
                phoneNum:this.phoneNum,
                logo:this.logo,
                storePic:this.storePic,
                shortAddress:this.shortAddress
            }
            if (this.foreverActive){
                STOREMSG.dueDate='3999-12-31'
            }else {
                STOREMSG.dueDate=this.dueDate
            }
            this.$store.state.STOREMSG=STOREMSG
            this.$router.push('/map') // 跳转到map页
        },
        checkInputStoreMsg(){ // 验证输入信息
            if (!this.businessNum){
                this.$store.state.errorMsg='请输入营业执照注册号'
                this.$store.state.errorStatus = true
                return false
            }else if(this.businessNum.length!==15){
                this.$store.state.errorMsg='营业执照注册号应为15位'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.src){
                this.$store.state.errorMsg='请上传营业执照照片'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.validity){
                this.$store.state.errorMsg='请选择有效期'
                this.$store.state.errorStatus = true
                return false
            }else if(this.validity==='1900-01-01'){
                this.$store.state.errorMsg='请选择有效期开始时间'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.foreverActive && this.contrastFn(this.validity)>this.contrastFn(this.dueDate)){
                this.$store.state.errorMsg='开始时间不能大于结束时间'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.legalPerson){
                this.$store.state.errorMsg='请输入法人名称'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.IDCardRegular.test(this.IDCardNo)){
                this.$store.state.errorMsg='身份证号码格式不对'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.storeName){
                this.$store.state.errorMsg='请输入店铺名称'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.phoneNum){
                this.$store.state.errorMsg='请输入手机号'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.phoneRegular.test(this.phoneNum)){
                this.$store.state.errorMsg='手机号格式不对'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.storeAddress){
                this.$store.state.errorMsg='请选择商家地址'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.shortAddress){
                this.$store.state.errorMsg='请输入地址简称'
                this.$store.state.errorStatus = true
                return false
            }else if(this.shortAddress.length>8){
                this.$store.state.errorMsg='地址简称不能超过8个字符'
                this.$store.state.errorStatus = true
                return false
            }else if(!this.logo){
                this.$store.state.errorMsg='请选上传店铺LOGO'
                this.$store.state.errorStatus = true
                return false
            }else if(this.storePic.length===0){
                this.$store.state.errorMsg='请选上传店铺照片'
                this.$store.state.errorStatus = true
                return false
            }else {
                this.$store.state.errorStatus = false
                this.$store.state.errorMsg=''
//                return true
                this.confirmStoreInfoFn()
            }
        },
        confirmStoreInfoFn(){ // 确定按钮-提交数据
            let _this=this
            let dataPost={
                'registerNo': _this.businessNum,
                'businessLicense': _this.src,
                'storeName': _this.storeName,
                'address': _this.storeAddress,
                'shortAddress': _this.shortAddress,
                'mobile': _this.phoneNum,
                'storeLogo':_this.logo,
                'startDate':_this.validity,
                'endDate':'',
                'legalPerson':_this.legalPerson,
                'legalPersonNumber':_this.IDCardNo,
                'storeImages':JSON.stringify(_this.storePic),
                'lat': _this.storePoint.lat,
                'lng': _this.storePoint.lng
            }
            if (this.foreverActive){ // 如果选择的是永久，endDate为 3999-12-31
                dataPost.endDate='3999-12-31'
            }else {
                dataPost.endDate=_this.dueDate
            }

            _this.loadingShowA()
            this.$http({
                method:'POST',
                url:`${_this.$URL}api/v1/store/apply`,
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
                if (d.code === 0){
                    _this.$store.state.errorStatus=true
                    _this.$store.state.errorMsg='<span style="color:#0BDA31;">提交成功</span>'

                    // 修改本地储存信息
                    localStorage.setItem('REGISTERNO',_this.businessNum)// 保存---注册号
                    localStorage.setItem('BUSINESSLICENSE',_this.src)// 保存---营业执照
                    localStorage.setItem('STORENAME',_this.storeName)// 保存---店铺名字
                    localStorage.setItem('MOBILE',_this.phoneNum)// 保存---手机号码
                    localStorage.setItem('ADDRESS',_this.storeAddress)// 保存---地址
                    localStorage.setItem('SHORTADDRESS',_this.shortAddress)// 保存---地址简称
                    localStorage.setItem('STORELOGO',_this.logo)// 保存---店铺logo
                    localStorage.setItem('STOREIMAGES',JSON.stringify(_this.storePic))// 保存---店铺照片
                    localStorage.setItem('LNG',_this.storePoint.lng)// 保存---经度
                    localStorage.setItem('LAT',_this.storePoint.lat)// 保存---纬度
                    localStorage.setItem('ISPERFECTINFOMATION','Y')// 保存---是否已经完善信息，Y代表完善了信息，N代表没完善

                    _this.$store.state.STOREINFO={ // 登录信息
                        'ACCESSTOKEN': localStorage.getItem('ACCESSTOKEN'), // ---token
                        'TOKEN': localStorage.getItem('TOKEN'), // ---七牛token
                        'STOREID': localStorage.getItem('STOREID'), // ---店铺ID
                        'REGISTERNO': localStorage.getItem('REGISTERNO'), // ---注册号
                        'BUSINESSLICENSE': localStorage.getItem('BUSINESSLICENSE'), // ---营业执照
                        'BUSINESSLICENSEURL': localStorage.getItem('BUSINESSLICENSEURL'), // ---营业执照Url
                        'STORENAME': localStorage.getItem('STORENAME'),// ---店铺名字
                        'MOBILE': localStorage.getItem('MOBILE'), // ---手机号码
                        'LOGINMOBILE': localStorage.getItem('LOGINMOBILE'), // ---登录手机号码
                        'ADDRESS': localStorage.getItem('ADDRESS'), // ---地址
                        'STORELOGO': localStorage.getItem('STORELOGO'), // ---店铺logo
                        'STORELOGOURL': localStorage.getItem('STORELOGOURL'), // ---店铺logo地址
                        'STOREIMAGES': JSON.parse(localStorage.getItem('STOREIMAGES')), // ---店铺照片
                        'LNG': localStorage.getItem('LNG'), // ---经度
                        'LAT': localStorage.getItem('LAT'), // ---纬度
                        'ISPERFECTINFOMATION': localStorage.getItem('ISPERFECTINFOMATION'), // ---是否已经完善信息，Y代表完善了信息，N代表没完善
                        'QINIUPREFIX': localStorage.getItem('QINIUPREFIX') // ---图片回显域名
                    }

                    _this.$store.state.STOREMSG={}

                    setTimeout(()=>{
                        _this.$store.state.errorStatus = false
                        _this.$store.state.errorMsg=''
                        _this.$router.replace('/home') // 跳转到首页
                    },300)

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
        delPicFn(i){ // 删除店铺照片按钮
            this.storePic.splice(i,1)
        },
        wxConfigFn(){ // 获取签名
            let _this=this
            _this.loadingShowA()
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/wx/config`,
                params:{url:window.location.href.split('#')[0]}
            }).then((res) => {
                let d=res.data
                // console.log('微信签名信息data:',d)
                if (d.code === 0){
                    let config={
                        appId:d.data.appId,
                        timestamp:d.data.timestamp,
                        nonceStr:d.data.nonceStr,
                        signature:d.data.signature
                    }
                    _this.$wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: config.appId, // 必填，公众号的唯一标识
                        timestamp: config.timestamp, // 必填，生成签名的时间戳
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature, // 必填，签名，见附录1
                        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        jsApiList: [
                            'getLocation'
                        ]
                    })
                    _this.$wx.ready(()=>{
                        _this.$wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success(res) {
                                let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
                                let longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。

//                                console.log('微信定位信息：',latitude,longitude)
                                let center={lat:latitude,lng:longitude}
                                sessionStorage.setItem('CENTER',JSON.stringify(center))
                                _this.loadingShowA()
                                _this.storeAddressFn() // 储存输入信息，跳转到map页
                            },
                            fail(err){
//                                _this.$store.state.errorMsg='获取定位失败'
//                                _this.$store.state.errorStatus=true
                                console.log('获取定位失败：',err)
                                let center={lat:'30.629556',lng:'104.083011'}
                                sessionStorage.setItem('CENTER',JSON.stringify(center))
                            }
                        })
                    })
                }else {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg=d.msg
                    _this.$store.state.errorStatus=true
                }
            }).catch((err) => {
                _this.loadingShowA()
                _this.$store.state.errorMsg='微信签名错误'
                _this.$store.state.errorStatus=true
                console.log(err)
            })
        },
        getStoreInfoFn(){ // 获取店铺信息
            let _this=this
            _this.loadingShowA()
            this.$http({
                method:'GET',
                url:`${_this.$URL}api/v1/store/storeAuditInfo`,
                headers:{
                    accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                },
                params:{
                    storeId:_this.$store.state.STOREINFO.STOREID
                }
            }).then((res) => {
                _this.loadingShowA()
                let d=res.data
//                console.log(d)
                if (d.code === 0){
                    _this.businessNum=d.data.registerNo
                    _this.src=d.data.businessLicense
                    _this.storeName=d.data.storeName
                    _this.storeAddress=d.data.address
                    _this.shortAddress=d.data.shortAddress
                    _this.phoneNum=d.data.mobile
                    _this.logo=d.data.storeLogo
                    _this.validity=d.data.startDate
                    if (d.data.endDate==='3999-12-31'){
                        _this.foreverActive=true
                        _this.dueDate='1949-01-01'
                    }else {
                        _this.foreverActive=false
                        _this.dueDate=d.data.endDate
                    }
                    _this.legalPerson=d.data.legalPerson
                    _this.IDCardNo=d.data.legalPersonNumber
                    _this.storePic=JSON.parse(d.data.storeImages)
                    _this.storePoint.lng=d.data.lng
                    _this.storePoint.lat=d.data.lat

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
        businessNumFn(){ // 营业执照注册号
            this.businessNum=this.businessNum.replace(/\D/g,'')
        },
        IDCardNoFn(){ // 身份证
//            this.IDCardNo=this.IDCardNo.replace(/[^\d|chun]/g,'')
            if (!this.IDCardRegular.test(this.IDCardNo)){
                this.$store.state.errorMsg='请输入正确的身份证号码'
                this.$store.state.errorStatus=true
            }
        },
        phoneNumFn(){ // 手机号
            this.phoneNum=this.phoneNum.replace(/\D/g,'')
        }
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    @import "../../assets/stylus/goodsItem.styl"
    .shopCertify
        padding-bottom 50px
        width 100%
        height 100%
        background-color $white
        position relative
        .dueBox
            position relative
            .dueDate
                margin-right 60px
                appearance none
                width 50%
            .forever
                position absolute
                right 0
                top 13px
                border 1px solid #808080
                color #808080
                border-radius:3px
                font-size 17px
                width 54px
                height 28px
                text-align center
                line-height @height
            .foreverActive
                border 0
                color #FFF
                background-color #05DA2C
        .storePic
            padding 10px 15px
            .shopPicBox
                .shopPic
                    background-color $white
                    font-size 0
                    .picLists
                        .pic
                            display inline-block
                            vertical-align middle
                            margin 0 5px 5px 0
                            width 90px
                            height 90px
                            position relative
                            img
                                width 90px
                                height 90px
                            .delPic
                                position absolute
                                top -4px
                                right -4px
                                z-index 10
                                display block
                                background url("../../assets/icons/btn_cancel@2x.png") center no-repeat
                                background-size 20px
                                width 20px
                                height 20px
                        .uploadButton
                            display inline-block
                            vertical-align top
                            border 1px solid #D4D4D4
                            font-size 68px
                            color #D8D8D8
                            text-align center
                            width 90px
                            height @width
                            line-height @height
        button
            $button(absolute,$color6,$color7,100%)
        @media screen and (min-width: 320px) // iPhone 6p、7p手机
            .goodsItem
                figure
                    section
                        p
                            .IDCardNo
                                font-size 14px
        @media screen and (min-width: 375px) // iPhone 6p、7p手机
            .goodsItem
                figure
                    section
                        p
                            .IDCardNo
                                font-size 17px
</style>

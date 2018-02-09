<template>
    <div class="myInfo">
        <div class="listsBox">
            <div class="listXs">
                <section class="listTitle">
                    <p>店铺名称</p>
                </section>
                <section class="listText">
                    <input type="text" placeholder="请输入店铺名称" readonly v-model="storeName">
                </section>
            </div>
            <div class="listXs">
                <section class="listTitle">
                    <p>电话</p>
                </section>
                <section class="listText">
                    <input type="text" placeholder="请输入电话" maxlength="11" readonly v-model="mobile" @touchend="changeMobile">
                </section>
            </div>
            <div class="listXs address">
                <section class="listTitle">
                    <p>商家地址</p>
                </section>
                <section class="listText">
                    <!--<input type="text" placeholder="请输入商家地址" readonly v-model="address" @touchend="storeAddressFn">-->
                    <p ref="listTextHei" @touchend="storeAddressFn">{{address}}</p>
                </section>
            </div>
            <div class="listXs uploadBox">
                <section class="listTitle">
                    <p>店铺LOGO</p>
                </section>
                <section class="listText upload">
                    <span class="uploadImg">
                        <span class="uploadRight">
                            <span class="uploadBtn">点击上传LOGO</span>
                            <img class="img" v-show="storeLogo.length>0" :src="urlPic+storeLogo" ref="logo" alt="">
                            <span class="btn">
                                <div id="shopLogoBox"><div id="shopLogo" style="width: 100%;height: 100%;">上传</div></div>
                            </span>
                        </span>
                    </span>
                </section>
            </div>
        </div>
        <div class="shopPicBox">
            <section class="title">店铺照片</section>
            <div class="shopPic">
                <div class="picLists">
                    <span class="pic" v-for="(sPic,i) in storeImages">
                        <img :src="urlPic+sPic.imageName" alt="">
                        <i class="delPic" @touchend="delPicFn(i)"></i>
                    </span>
                    <span class="uploadButton" v-show="storeImages.length<3">
                        <div id="shopPicBox"><div id="shopPic" style="width: 100%;height: 100%;">+</div></div>
                    </span>
                </div>
            </div>
        </div>
        <button @touchend="confirmStoreInfo">确定</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name: 'myInfo',
        components: {},
        data() {
            return {
                urlPic:this.$store.state.STOREINFO.QINIUPREFIX,
                storeName:'',
                mobile:'',
                lng:'',
                lat:'',
                address:'',
                storeLogo:'',
                storeImages:[]
            }
        },
        created() {
//            console.log(JSON.parse(this.$store.state.STOREINFO.STOREIMAGES))
//            console.log(this.$refs.listTextHei.offsetHeight)
            // 登录保存的信息
            this.storeName=this.$store.state.STOREINFO.STORENAME
            this.mobile=this.$store.state.STOREINFO.MOBILE

            // 在地图页选择定位后，$store保存的信息
            let storeInfoWindow=this.$store.state.STOREINFOWINDOW
            if (storeInfoWindow.contents){
                this.lat=this.$store.state.STOREPOINT.lat
                this.lng=this.$store.state.STOREPOINT.lng
                this.address=`${storeInfoWindow.province}${storeInfoWindow.city}${storeInfoWindow.section}${storeInfoWindow.contents}`
//                this.address=storeInfoWindow.section+storeInfoWindow.contents
            }else {
                this.lat=this.$store.state.STOREINFO.LAT
                this.lng=this.$store.state.STOREINFO.LNG
                this.address=this.$store.state.STOREINFO.ADDRESS
            }

            // 点击到地图页之前保存的信息
            let myInfo=this.$store.state.MYINFO
            if (myInfo.storeLogo){
                this.storeLogo=myInfo.storeLogo
                this.storeImages=myInfo.storeImages
            }else { // 从缓存拿商家信息数据
                this.storeLogo=this.$store.state.STOREINFO.STORELOGO
//                this.storeImages=this.$store.state.STOREINFO.STOREIMAGES
                let storeImages=this.$store.state.STOREINFO.STOREIMAGES
                if (typeof storeImages==='string'){
                    this.storeImages=JSON.parse(storeImages)
                }else {
                    this.storeImages=this.$store.state.STOREINFO.STOREIMAGES
                }
            }

            this.getQiniuUploadToken() // 七牛token
        },
        methods: {
            ...mapActions(['loadingShowA']),
            storeAddressFn(){ // 获取商家地址
                // 储存商家信息$store
                let myInfo={
                    lng:this.lng,
                    lat:this.lat,
                    storeLogo:this.storeLogo,
                    storeImages:this.storeImages
                }
                this.$store.state.MYINFO=myInfo
                this.$router.push('/map') // 跳转到map页
            },
            uploadLogoFn(res){ // 店铺logo
//                console.log(res)
                let _this=this
                let d=JSON.parse(res.response)
                this.storeLogo=d.key
                this.$refs.logo.onload=function (e) {
                    e.stopPropagation()
                    _this.loadingShowA() // 图片加载完成关闭 加载中...
                }
            },
            uploadstorePicFn(res){ // 店铺照片
//                console.log(res)
                let _this=this
                let d=JSON.parse(res.response)
                this.storeImages.push({imageName:d.key})
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
//                    console.log(d)
                    if (d.code === 0) {
                        _this.$store.state.errorStatus=false
                        _this.QiniuUploadToken=d.data.token
                        qiniuImgUpload('shopLogo','shopLogoBox',false,_this.QiniuUploadToken,_this.urlPic,'store_',_this.uploadLogoFn,_this.getQiniuUploadToken,_this.loadingShowA)
                        qiniuImgUpload('shopPic','shopPicBox',false,_this.QiniuUploadToken,_this.urlPic,'store_',_this.uploadstorePicFn,_this.getQiniuUploadToken,_this.loadingShowA)
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
            confirmStoreInfo(){ // 确定-修改店铺信息
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'POST',
                    url:`${_this.$URL}api/v1/store/updateSellerInfo`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID
                    },
                    data:{
                        address:_this.address,
                        lat:_this.lat,
                        lng:_this.lng,
                        storeLogo:_this.storeLogo,
                        storeImages:JSON.stringify(_this.storeImages)
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        _this.$store.state.errorStatus=true
                        _this.$store.state.errorMsg='<span style="color:#4CCF6F;">修改成功</span>'
                        _this.$store.state.STOREINFO.STORELOGO=_this.storeLogo
                        localStorage.setItem('STORELOGO',_this.storeLogo)
                        _this.$store.state.STOREINFO.STOREIMAGES=_this.storeImages
                        localStorage.setItem('STOREIMAGES',JSON.stringify(_this.storeImages))

                        setTimeout(()=>{
                            _this.$store.state.errorStatus=false
                            _this.$store.state.errorMsg=''
                            _this.$router.back()
                        },2000)
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
                event.preventDefault()
                this.storeImages.splice(i,1)
            },
            changeMobile(){
                // 修改店铺手机号
                this.$router.push({name:'CheckVerify',params:{flag:'mobile'}})
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .myInfo
        position fixed
        top 0
        left 0
        padding-bottom 50px
        background-color $color9
        width 100%
        height 100%
        overflow-y auto
        .listsBox
            .address
                padding 13px
                height auto
                line-height normal
                .listTitle
                    margin-right 5%
                    vertical-align middle
                    width 24%
                .listText
                    vertical-align middle
                    float none
                    width 69%
                    p
                        padding 5px 0
                        line-height 20px
            .uploadBox
                border-bottom 0
                height 96px
                line-height @height
                .upload
                    .uploadImg
                        position relative
                        top 18px
                        font-size 0
                        text-align center
                        .uploadBtn
                            display inline-block
                            vertical-align top
                            font-size 14px
                            width 92px
                            height 65px
                            line-height @height
                        .img
                            position absolute
                            top -54px
                            left 0
                            width 92px
                            height 65px
                        .btn
                            position absolute
                            top -54px
                            left 0
                            opacity 0
                            display inline-block
                            vertical-align top
                            font-size 14px
                            width 92px
                            height 65px
        .shopPicBox
            .title
                padding 10px 15px
                font-size 14px
                color $color3
            .shopPic
                padding 16px 21px
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
                        vertical-align middle
                        border 1px solid #D4D4D4
                        font-size 68px
                        color #D8D8D8
                        text-align center
                        width 90px
                        height @width
                        line-height @height
        button
            $button(fixed,$color6,$color7,100%)
</style>

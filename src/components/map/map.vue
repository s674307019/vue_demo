<template>
    <div class="map">
        <!--百度地图 -s-->
        <baidu-map class="baiduMap" :style="{'height':mapHeight}" ak="ydsNGphKEzhEy8ZOcwjT0lic"
                   :center="center" :zoom="13">
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation> <!--缩放控件-->
            <bm-marker :position="center" @click="infoWindowOpen" :dragging="true" @dragend="dragendFn"> <!--点控件-->
                <bm-info-window :position="center"
                                :show="bmInfoWindow"
                                @close="infoWindowClose"
                                @open="infoWindowOpen">
                    <h3 style="color: #FC9F13;font-size: 16px;margin-bottom: 8px">{{infoWindow.title}}</h3>
                    <p style="color: #808080;font-size: 12px;">地址：{{infoWindow.contents}}</p>
                </bm-info-window> <!--点击点弹出位置信息控件-->
            </bm-marker>
            <bm-local-search style="margin-top: 50px;border: 0;"
                             :location="location"
                             :auto-viewport="true"
                             :forceLocal="true"
                             :selectFirstResult="false"
                             :panel="true"
                             :keyword="keyword"
                             @markersset="markersset"></bm-local-search> <!--地区检索-->
        </baidu-map>
        <!--百度地图 -e-->
        <div class="myPlace" @touchend="areaBoxShow=true" v-show="!areaBoxShow">
            <section class="text">
                <p>{{city}}<img src="../../assets/icons/btn_next@2x.png"/></p>
                <p><span>{{section}}</span>&nbsp;<span>{{building}}</span><img src="../../assets/icons/btn_next@2x.png"/></p>
            </section>
        </div>
        <div class="areaBox" v-show="areaBoxShow">
            <div class="inputMsg">
                <div class="selectArea">
                    <input class="area1" type="button" readonly v-model="location">
                    <img src="../../assets/icons/btn_down@2x.png" alt="">
                    <input id="chooseArea" class="area2" type="button" readonly v-model="chooseArea"/>
                </div>
                <input class="inputWords" type="text" placeholder="你要找的地址是哪儿" v-model="keyword">
                <span class="closeSearch" @touchend="areaBoxShow=false"><img src="../../assets/icons/btn_cancel@2x.png" alt=""></span>
            </div>
            <div class="areaListBox">
                <ul class="areaLists" @touchstart="areaListStartFn">
                    <li v-for="(areaList,i) in areaLists" @touchend="areaListFn(i)">
                        <h3>{{areaList.address}}</h3>
                        <p>{{areaList.city}}</p>
                    </li>
                </ul>
                <div class="noAreaList" v-show="noAreaList" :style="{'height':(mapHeight-50)+'px'}">还没有内容</div>
            </div>
        </div>
        <button v-show="!areaBoxShow" @touchend="confirmFn">确定</button>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import wx from 'weixin-js-sdk'
    import {BaiduMap,BmNavigation,BmMarker,BmInfoWindow,BmLocalSearch} from 'vue-baidu-map'
    export default {
        name: 'map',
        components: {
            BaiduMap,BmNavigation,BmMarker,BmInfoWindow,BmLocalSearch
        },
        data() {
            return {
                mapHeight:'', // 地图高度
                pointEnd:{lat:30.629541, lng:104.082975}, // 终点位置(商家位置)
//                center:{lng: 116.404, lat: 39.915}, // 中心位置，也是我的位置
                center:{lat: 0, lng: 0}, // 中心位置，也是我的位置
                bmInfoWindow:false, //点击点是否显示弹出位置信息控件
                infoWindow: { // 信息窗体
                    title: '',
                    contents: '',
                    section:'',
                    province:'',
                    city:'',
                    district:''
                },
                location: '', // 检索地区
                keyword: '', // 检索关键字
                areaBoxShow:false, // 搜索地址盒子
                chooseArea:'四川省,成都市,武侯区', // 选择的地址
                areaLists:[], // 搜索结果-地区列表
                noAreaList:false, // 获取的地区列表为空，显示没有检索到地区内容
                city:'定位中...', // 城市
                section:'---', // 路段
                building:'---', // 楼宇
                iStartY:0, // 手指触摸开始位置
                iEndY:0  // 手指触摸结束位置
            }
        },
        created() {
            // 获取可视区高度，设置地图高度
            this.mapHeight=((document.documentElement.clientHeight || document.body.clientHeight))+'px'
            this.areaFormatFn() // 格式化地址

            let point=JSON.parse(sessionStorage.getItem('CENTER')) // 微信授权后，获取的位置信息
            this.center=point?point:{lat: 0, lng: 0} // 微信授权后，获取的位置信息
//            console.log('打印定位信息：',this.center)
            if (this.center && this.center.lat){
                this.loadingShowA() // 加载中
                this.getAddressDetailFn(this.center.lat,this.center.lng) // 百度地址查询
            }else {
//                window.location.href='/store/index.html'
                this.$store.state.errorMsg='请允许获取位置信息'
                this.$store.state.errorStatus=true
            }
        },
        mounted(){
            // 初始化地区选择器
            let chooseArea = new LArea()
            chooseArea.init({
                'trigger': '#chooseArea', //触发选择控件的文本框，同时选择完毕后name属性输出到该位置
                // 'valueTo': '#value1', //选择完毕后id属性输出到该位置
                'keys': {
                    id: 'id',
                    name: 'name'
                }, //绑定数据源相关字段 id对应valueTo的value属性输出 name对应trigger的value属性输出
                'type': 1, //数据源类型
                'data': LAreaData //数据源
            })
        },
        watch: {
            chooseArea(nVal,oVal){ // 监听选择的地址变化
                this.areaFormatFn()
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            areaFormatFn(){ // 格式化选择的地址
                this.location=this.chooseArea.split(',')[1]
            },
            renderReverse(res){ // 回调函数
                console.log('回调函数res:',res)
            },
            getAddressDetailFn(lat,lng){ // 通过微信获取到的经纬度，请求百度接口，转化经纬度为地址详情
                let _this=this
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/baidu/map/address`,
                    params:{
                        location:`${lat},${lng}`,
                        pois:0
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=JSON.parse(res.data)
                    if (d.status === 0){
                        let r=d.result
//                        console.log(r)
                        _this.city=r.addressComponent.city // 城市
                        _this.section=r.business // 路段
                        _this.building=r.sematic_description // 楼宇

                        // 设置信息
                        _this.infoWindow.title = ''
//                        _this.infoWindow.contents=r.addressComponent.street
                        _this.infoWindow.contents=r.sematic_description
                        _this.infoWindow.section=r.business
                        _this.infoWindow.province=r.addressComponent.province
                        _this.infoWindow.city=r.addressComponent.city
                        _this.infoWindow.district=r.addressComponent.district // 区

                        // 选择的地址
                        _this.chooseArea=`${r.addressComponent.province},${r.addressComponent.city},${r.addressComponent.district}`
                    }else {
                        _this.$store.state.errorMsg='请求参数非法'
                        _this.$store.state.errorStatus=true
                    }
                }).catch((err) => {
                    _this.loadingShowA()
                    _this.$store.state.errorMsg='网络异常！'
                    _this.$store.state.errorStatus=true
                    console.log(err)

                })
            },
            infoWindowClose () { // 信息窗在此标注上关闭时触发此事件
                this.bmInfoWindow = false
            },
            infoWindowOpen () { // 信息窗在此标注上打开时触发此事件
                this.bmInfoWindow = true
            },
            markersset(obj){ // 输入搜索内容后，百度地图返回的位置信息列表
//                console.log('搜索返回信息：',obj)
                if (obj.length>0){
                    this.noAreaList = false
                    this.areaLists = obj
                }else {
                    this.noAreaList = true
                    this.areaLists = [] // 清空数组
                }
            },
            areaListStartFn(){
                this.iStartY=event.changedTouches[0].pageY
            },
            areaListFn(ind){ // 点击列表 - 获取当前经纬度
                this.iEndY=event.changedTouches[0].pageY-this.iStartY
                if (this.iEndY===0){
                    this.areaBoxShow = false
                    let p = this.areaLists[ind]
//                console.log(p)
                    this.center={lng:p.point.lng, lat:p.point.lat}
                    this.infoWindow.title = p.title
                    this.infoWindow.contents=p.address
//                this.infoWindow.province=p.province
                    this.infoWindow.province=''
//                this.infoWindow.city=p.city
                    this.infoWindow.city=''
                    this.infoWindow.section=''
                    this.infoWindow.district=''

                    this.city=p.city // 城市
                    this.section=p.address // 路段
                    this.building='' // 楼宇

                    this.bmInfoWindow=true
                }
            },
            confirmFn(){ // 确定按钮
                this.$store.state.STOREPOINT=this.center // 商家经纬度
                this.$store.state.STOREINFOWINDOW=this.infoWindow // 商家信息
//                console.log(this.$store.state.STOREINFOWINDOW)
                this.$router.go(-1) // 返回上一页
            },
            dragendFn(p){ // 拖拽结束触发事件
//                console.log(p.point.lat,p.point.lng)
                this.center.lat=p.point.lat
                this.center.lng=p.point.lng
                this.loadingShowA() // 加载中
                this.getAddressDetailFn(this.center.lat,this.center.lng) // 百度地址查询
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import "../../assets/stylus/common.styl"
    .map
        position relative
        width 100%
        .baiduMap
            width 100%
        .myPlace
            position fixed
            left 0
            bottom 71px
            z-index 9
            padding 0 20px
            width 100%
            line-height @height
            .text
                background-color $white
                border-radius 4px
                width 100%
                text-align center
                p
                    margin 0 auto
                    padding 14px 0
                    color $color7
                    font-size 14px
                    line-height 18px
                    width 90%
                    overflow hidden
                    white-space nowrap
                    text-overflow ellipsis
            &:first-child
                        $border(bottom)
                    img
                        vertical-align middle
                        margin-bottom 2px
                        margin-left 10px
                        width 7px
                        height 14px
        .areaBox
            position absolute
            top 0
            left 0
            z-index 10
            width 100%
            height 100%
            overflow-y auto
            .inputMsg
                position fixed
                top 0
                left 0
                z-index 10
                padding 10px
                background-color $color6
                width @width
                font-size 0
                .selectArea
                    position relative
                    padding-right 4px
                    display inline-block
                    vertical-align middle
                    width 20%
                    .area1
                        vertical-align middle
                        border 0
                        background none
                        border-radius 5px
                        text-align left
                        font-size 17px
                        width 80%
                        height 30px
                    img
                        vertical-align middle
                        width 12px
                        height 6px
                    .area2
                        position absolute
                        top 0
                        left 0
                        z-index 15
                        border 0
                        background none
                        opacity 0
                        width 100%
                        height 30px
                .inputWords
                    vertical-align bottom
                    border 0
                    border-radius 5px
                    text-align center
                    font-size 14px
                    width 71.5%
                    height 30px
                .closeSearch
                    margin-left 6px
                    img
                        vertical-align middle
                        width 22px
                        height 22px
            .areaListBox
                margin-top 50px
                background-color $white
                width 100%
                .areaLists
                    width @width
                    li
                        padding 8px 15px
                        $border(bottom)
                        h3
                            color $color7
                            font-size 17px
                        p
                            margin-top 4px
                            color $color3
                            font-size 14px
                .noAreaList
                    padding 74.3% 0
                    color $color7
                    width 100%
                    text-align center
        button
            $button(fixed,$color6,$color7,100%)
        @media screen and (min-width: 320px)
            .areaBox
                .inputMsg
                    .selectArea
                        width 24%
                    .inputWords
                        width 66%
        @media screen and (min-width: 375px)
            .areaBox
                .inputMsg
                    .selectArea
                        width 22%
                    .inputWords
                        width 70%
        @media screen and (min-width: 414px)
            .areaBox
                .inputMsg
                    .selectArea
                        width 18%
                    .inputWords
                        width 74%
</style>

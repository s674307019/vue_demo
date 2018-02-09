import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import wx from 'weixin-js-sdk'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        STOREINFO:{ // 登录信息
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
        },
        url:'http://192.168.0.29:8000/', // url
        // url:'http://twy.blue-cube.cn:8108/', // url
        // url:'http://qinzi.blue-cube.cn:8108/', // url
        // url:'http://ka.genshang.cn/', // url
        loadingShow:false, // 加载中
        errorStatus:false, // 错误信息状态
        errorMsg:'', // 错误信息提醒
        consumNo:'', // 收银-商品项目/卡片-消费码
        chooseGoods:[], // 收银-商品项目-选择的商品
        reminderStatus:false, // 列表提示信息状态
        reminderWords:'', // 列表提示信息
        STOREPOINT:{lat:localStorage.getItem('LAT'),lng:localStorage.getItem('LNG')}, // 店铺认证-商家经纬度
        STOREINFOWINDOW:{}, // 店铺认证-商家地址
        STOREMSG:{}, // 商铺认证，输入的信息
        MYINFO:{}, // myInfo我的信息
        buttonShow:true, // 发布卡片按钮-显示 隐藏
        contentText:'', // message.vue发送消息详情
        checkPass:false, // 店铺审核成功
        checkNotPass:false, // 店铺审核失败
        decline:false, // 拒绝
        declineWords:'', // 拒绝理由
        stateStatusVal:localStorage.getItem('stateStatusVal') // 店铺审核状态值
    },
    mutations: {
        loadingShowM(state){
            state.loadingShow = !state.loadingShow
        },
        errorStatusM(state){
            state.errorStatus = !state.errorStatus
        },
        wxConfigFnM(state){
            Axios({
                method:'GET',
                url:`${state.url}api/v1/wx/config`,
                params:{url:window.location.href.split('#')[0]}
            }).then((res) => {
                // state.loadingShow=false
                let d=res.data
                // console.log('微信签名信息data:',d)
                if (d.code === 0){
                    // state.loadingShow=false
                    let config={
                        appId:d.data.appId,
                        timestamp:d.data.timestamp,
                        nonceStr:d.data.nonceStr,
                        signature:d.data.signature
                    }
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: config.appId, // 必填，公众号的唯一标识
                        timestamp: config.timestamp, // 必填，生成签名的时间戳
                        nonceStr: config.nonceStr, // 必填，生成签名的随机串
                        signature: config.signature, // 必填，签名，见附录1
                        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        jsApiList: [
                            'getLocation',
                            'scanQRCode'
                        ]
                    })
                    wx.ready(()=>{
                        wx.getLocation({
                            type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                            success(res) {
                                let latitude = res.latitude // 纬度，浮点数，范围为90 ~ -90
                                let longitude = res.longitude // 经度，浮点数，范围为180 ~ -180。

                                // console.log('微信定位信息：',latitude,longitude)
                                let center={lat:latitude,lng:longitude}
                                sessionStorage.setItem('CENTER',JSON.stringify(center))

                            },
                            fail(err){
                                // state.errorMsg='获取定位失败'
                                // state.errorStatus=true
                                console.log('获取定位失败：',err)
                                let center={lat:'30.629556',lng:'104.083011'}
                                sessionStorage.setItem('CENTER',JSON.stringify(center))
                            }
                        })
                    })
                }else {
                    // state.loadingShow=false
                    state.errorMsg=d.msg
                    state.errorStatus=true
                }
            }).catch((err) => {
                // state.loadingShow=false
                state.errorMsg='微信签名错误'
                state.errorStatus=true
                console.log(err)
            })
        },
        checkPassFnM(state){ // 关闭审核通过弹窗
            event.preventDefault()
            state.checkPass=false
        },
        checkReasonM(state){ // 审核失败，产看理由
            event.preventDefault()
            state.checkNotPass=false
            state.decline=true
        }
    },
    actions: {
        loadingShowA({commit}){
            commit('loadingShowM')
        },
        errorStatusA({commit}){
            commit('errorStatusM')
        },
        wxConfigFnA({commit}){
            commit('wxConfigFnM')
        },
        checkPassFnA({commit}){
            commit('checkPassFnM')
        },
        checkReasonA({commit}){
            commit('checkReasonM')
        }
    },
    getters: {
        loadingShowG(state){
            return state.loadingShow
        },
        errorStatusG(state){
            return state.errorStatus
        },
        errorMsgG(state){
            return state.errorMsg
        },
        reminderWordsG(state){
            return state.reminderWords
        },
        reminderStatusG(state){
            return state.reminderStatus
        },
        WXCONFIGG(state){
            return state.WXCONFIG
        }
    }
})

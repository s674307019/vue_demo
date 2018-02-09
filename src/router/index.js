import Vue from 'vue'
import Router from 'vue-router'
import VueWechatTitle from 'vue-wechat-title'

import Index from '@/components/index'

import Home from '@/components/home/home'

import Mine from '@/components/mine/mine'
import MyInfo from '@/components/mine/myInfo'
import OrderCard from '@/components/mine/orderCard/orderCard'
import BeConfirmed from '@/components/mine/orderCard/beConfirmed'
import Completed from '@/components/mine/orderCard/completed'

import OrderProject from '@/components/mine/orderProject/orderProject'
import WaitRefund from '@/components/mine/orderProject/waitRefund'
import WaitConsumption from '@/components/mine/orderProject/waitConsumption'
import ProCompleted from '@/components/mine/orderProject/proCompleted'

import MyWallet from '@/components/mine/myWallet/myWallet'
import ParticularsIncome from '@/components/mine/myWallet/particularsIncome'
import ParticularsExpenditure from '@/components/mine/myWallet/particularsExpenditure'
import GoodsExpenditure from '@/components/mine/myWallet/goodsExpenditure'

import ConsumerLists from '@/components/mine/consumerLists/consumerLists'
import ConsumerProject from '@/components/mine/consumerLists/consumerProject'
import ConsumerCard from '@/components/mine/consumerLists/consumerCard'

import Setting from '@/components/mine/setting/setting'
import AccountAndSecurity from '@/components/mine/setting/accountAndSecurity'

import Login from '@/components/login/login'
import InputMobile from '@/components/login/inputMobile'
import InputVerify from '@/components/login/inputVerify'

import ChangeMobile from '@/components/changeMobile/changeMobile'
import CheckMobile from '@/components/changeMobile/checkMobile'
import CheckVerify from '@/components/changeMobile/checkVerify'

import ShopCertify from '@/components/shopCertify/shopCertify'

import Map from '@/components/map/map'

import Cashiering from '@/components/cashiering/cashiering'
import GoodsOrder from '@/components/cashiering/goodsOrder'
import CardOrder from '@/components/cashiering/cardOrder'
import ChooseGoodsItem from '@/components/cashiering/chooseGoodsItem'
import DealSuccess from '@/components/cashiering/dealSuccess'
import DealFail from '@/components/cashiering/dealFail'


import ManageClubCard from '@/components/manageClubCard/manageClubCard'
import Whole from '@/components/manageClubCard/whole'
import DiscountCard from '@/components/manageClubCard/discountCard'
import OnceCard from '@/components/manageClubCard/onceCard'
import ExperienceCard from '@/components/manageClubCard/experienceCard'
import PublishCard from '@/components/manageClubCard/publishCard'
import EditorCard from '@/components/manageClubCard/editorCard'
import DetailCard from '@/components/manageClubCard/detailCard'


import ManageMember from '@/components/manageMember/manageMember'
import MemberDetail from '@/components/manageMember/memberDetail'
import CalendarBuyCard from '@/components/manageMember/calendarBuyCard'


import ManageGoods from '@/components/manageGoods/manageGoods'
import AddItem from '@/components/manageGoods/addItem'
import EditorItem from '@/components/manageGoods/editorItem'
import LookItem from '@/components/manageGoods/lookItem'


import Statistics from '@/components/statistics/statistics'
import StatisticsData from '@/components/statistics/statisticsData'
import DataWeek from '@/components/statistics/dateClassify/week'
import DataMonth from '@/components/statistics/dateClassify/month'
import DataQuarter from '@/components/statistics/dateClassify/quarter'
import StatisticsExperienceData from '@/components/statistics/statisticsExperienceData'


import Message from '@/components/message/message'
import Sent from '@/components/message/sent'
import ChooseMember from '@/components/message/chooseMember'
import ChooseTemplate from '@/components/message/chooseTemplate'




Vue.use(Router)
Vue.use(VueWechatTitle)

export default new Router({
    // mode: 'history',
    // scrollBehavior: () => ({y: 0}),
    linkActiveClass: 'active',
    routes: [
        {
            path: '/home',
            name: 'Home',
            component: Home,
            meta: {
                title: '首页'
            }
        },
        {
            path: '/mine',
            name: 'Mine',
            component: Mine,
            meta: {
                title: '我的'
            }
        },
        {
            path: '/myInfo',
            name: 'MyInfo',
            component: MyInfo,
            meta: {
                title: '我的信息'
            }
        },
        {
            path: '/orderCard',
            name: 'OrderCard',
            component: OrderCard,
            meta: {
                title: '会员卡订单'
            },
            children:[
                { // 默认页
                    path: '',
                    name: 'BeConfirmed',
                    component: BeConfirmed
                },
                {
                    path: 'beConfirmed',
                    name: 'BeConfirmed',
                    component: BeConfirmed,
                    meta: {
                        title: '待确认'
                    }
                },
                {
                    path: 'completed',
                    name: 'Completed',
                    component: Completed,
                    meta: {
                        title: '已完成'
                    }
                }
            ]
        },
        {
            path: '/orderProject',
            name: 'OrderProject',
            component: OrderProject,
            meta: {
                title: '项目订单'
            },
            children:[
                { // 默认页
                    path: '',
                    name: 'OrderProject',
                    component: OrderProject
                },
                {
                    path: 'waitRefund',
                    name: 'WaitRefund',
                    component: WaitRefund,
                    meta: {
                        title: '待退款'
                    }
                },
                {
                    path: 'waitConsumption',
                    name: 'WaitConsumption',
                    component: WaitConsumption,
                    meta: {
                        title: '待消费'
                    }
                },
                {
                    path: 'proCompleted',
                    name: 'ProCompleted',
                    component: ProCompleted,
                    meta: {
                        title: '已完成'
                    }
                }
            ]
        },
        {
            path: '/myWallet',
            name: 'MyWallet',
            component: MyWallet,
            meta: {
                title: '我的钱包'
            }
        },
        { // 收入
            path: '/particularsIncome',
            name: 'ParticularsIncome',
            component: ParticularsIncome,
            meta: {
                title: '余额明细'
            }
        },
        { // 支出
            path: '/particularsExpenditure',
            name: 'ParticularsExpenditure',
            component: ParticularsExpenditure,
            meta: {
                title: '余额明细'
            }
        },
        { // 支出
            path: '/goodsExpenditure',
            name: 'GoodsExpenditure',
            component: GoodsExpenditure,
            meta: {
                title: '商品明细'
            }
        },
        { // 支出
            path: '/consumerLists',
            name: 'ConsumerLists',
            component: ConsumerLists,
            meta: {
                title: '消费清单'
            },
            children:[
                { // 默认页
                    path: '',
                    name: 'ConsumerProject',
                    component: ConsumerProject
                },
                {
                    path: 'consumerProject',
                    name: 'ConsumerProject',
                    component: ConsumerProject,
                    meta: {
                        title: '项目消费清单'
                    }
                },
                {
                    path: 'consumerCard',
                    name: 'ConsumerCard',
                    component: ConsumerCard,
                    meta: {
                        title: '会员卡消费'
                    }
                }
            ]
        },
        {
            path: '/setting',
            name: 'Setting',
            component: Setting,
            meta: {
                title: '设置'
            }
        },
        {
            path: '/accountAndSecurity',
            name: 'AccountAndSecurity',
            component: AccountAndSecurity,
            meta: {
                title: '帐号与安全'
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '登录'
            },
            children:[
                { // 默认页
                    path: '',
                    name: 'InputMobile',
                    component: InputMobile
                },
                {
                    path: 'inputMobile',
                    name: 'InputMobile',
                    component: InputMobile
                },
                {
                    path: 'inputVerify',
                    name: 'InputVerify',
                    component: InputVerify
                }
            ]
        },
        { // 修改手机号
            path: '/changeMobile',
            name: 'ChangeMobile',
            component: ChangeMobile,
            meta: {
                title: '输入新的手机号'
            },
            children:[
                {
                    path: 'checkMobile',
                    name: 'CheckMobile',
                    component: CheckMobile
                },
                {
                    path: 'checkVerify',
                    name: 'CheckVerify',
                    component: CheckVerify
                }
            ]
        },
        {
            path: '/shopCertify',
            name: 'ShopCertify',
            component: ShopCertify,
            meta: {
                title: '商铺认证'
            }
        },
        {
            path: '/map',
            name: 'Map',
            component: Map,
            meta: {
                title: '地图'
            }
        },
        {
            path: '/addItem',
            name: 'AddItem',
            component: AddItem,
            meta: {
                title: '添加项目'
            }
        },
        {
            path: '/editorItem',
            name: 'EditorItem',
            component: EditorItem,
            meta: {
                title: '编辑项目'
            }
        },
        {
            path: '/lookItem',
            name: 'LookItem',
            component: LookItem,
            meta: {
                title: '查看项目'
            }
        },
        {
            path: '/cashiering',
            name: 'Cashiering',
            component: Cashiering,
            meta: {
                title: '收银'
            }
        },
        {
            path: '/goodsOrder',
            name: 'GoodsOrder',
            component: GoodsOrder,
            meta: {
                title: '商品消费'
            }
        },
        { // 扫描结果
            path: '/cardOrder',
            name: 'CardOrder',
            component: CardOrder,
            meta: {
                title: '卡片消费'
            }
        },
        { // 选择商品项目
            path: '/chooseGoodsItem',
            name: 'ChooseGoodsItem',
            component: ChooseGoodsItem,
            meta: {
                title: '商品项目'
            }
        },
        {
            path: '/dealSuccess',
            name: 'DealSuccess',
            component: DealSuccess,
            meta: {
                title: '交易成功'
            }
        },
        {
            path: '/dealFail',
            name: 'DealFail',
            component: DealFail,
            meta: {
                title: '交易成功'
            }
        },
        { // 会员卡管理
            path: '/manageClubCard',
            name: 'ManageClubCard',
            component: ManageClubCard,
            meta: {
                title: '会员卡'
            },
            children:[
                { // 默认页
                    path: '',
                    name: 'Whole',
                    component: Whole
                },
                {
                    path: 'whole',
                    name: 'Whole',
                    component: Whole,
                    meta: {
                        title: '全部'
                    }
                },
                {
                    path: 'discountCard',
                    name: 'DiscountCard',
                    component: DiscountCard,
                    meta: {
                        title: '折扣卡'
                    }
                },
                {
                    path: 'onceCard',
                    name: 'OnceCard',
                    component: OnceCard,
                    meta: {
                        title: '次卡'
                    }
                },
                {
                    path: 'experienceCard',
                    name: 'ExperienceCard',
                    component: ExperienceCard,
                    meta: {
                        title: '体验卡'
                    }
                }
            ]
        },
        {
            path: '/publishCard',
            name: 'PublishCard',
            component: PublishCard,
            meta: {
                title: '发布会员卡'
            }
        },
        {
            path: '/editorCard',
            name: 'EditorCard',
            component: EditorCard,
            meta: {
                title: '编辑会员卡'
            }
        },
        { // 卡详情 - All
            path: '/detailCard',
            name: 'DetailCard',
            component: DetailCard,
            meta: {
                title: '会员卡详情'
            }
        },
        {
            path: '/manageMember',
            name: 'ManageMember',
            component: ManageMember,
            meta: {
                title: '会员管理'
            }
        },
        { // 会员详情
            path: '/memberDetail',
            name: 'MemberDetail',
            component: MemberDetail,
            meta: {
                title: '会员详情'
            }
        },
        {
            path: '/calendarBuyCard',
            name: 'CalendarBuyCard',
            component: CalendarBuyCard,
            meta: {
                title: '买卡记录'
            }
        },
        {
            path: '/manageGoods',
            name: 'ManageGoods',
            component: ManageGoods,
            meta: {
                title: '商品项目管理'
            }
        },
        {
            path: '/statistics',
            name: 'Statistics',
            component: Statistics,
            meta: {
                title: '会员卡统计'
            }
        },
        {
            path: '/statisticsData',
            name: 'StatisticsData',
            component: StatisticsData,
            meta: {
                title: '会员卡统计'
            },
            children:[
                {
                    path: 'dataWeek',
                    name: 'DataWeek',
                    component: DataWeek
                },
                { // 周数据
                    path: 'dataWeek',
                    name: 'DataWeek',
                    component: DataWeek,
                    meta: {
                        title: '会员卡统计'
                    }
                },
                { // 月数据
                    path: 'dataMonth',
                    name: 'DataMonth',
                    component: DataMonth,
                    meta: {
                        title: '会员卡统计'
                    }
                },
                { // 季度数据
                    path: 'dataQuarter',
                    name: 'DataQuarter',
                    component: DataQuarter,
                    meta: {
                        title: '会员卡统计'
                    }
                }
            ]
        },
        {
            path: '/statisticsExperienceData',
            name: 'StatisticsExperienceData',
            component: StatisticsExperienceData,
            meta: {
                title: '体验卡统计'
            }
        },
        {
            path: '/message',
            name: 'Message',
            component: Message,
            meta: {
                title: '发送消息'
            }
        },
        {
            path: '/sent',
            name: 'Sent',
            component: Sent,
            meta: {
                title: '已发送消息'
            }
        },
        {
            path: '/chooseMember',
            name: 'ChooseMember',
            component: ChooseMember,
            meta: {
                title: '会员列表'
            }
        },
        {
            path: '/chooseTemplate',
            name: 'ChooseTemplate',
            component: ChooseTemplate,
            meta: {
                title: '选择模版'
            }
        },
        {
            path: '/index',
            name: 'Index',
            component: Index,
            meta: {
                title: '亲子卡-商户'
            }
        },
        {
            path: '/',
            name: 'Index',
            redirect: '/index'
        }
        // {
        //     path: '/',
        //     name: 'Home',
        //     redirect: '/home'
        // }
    ]
})

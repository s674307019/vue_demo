<template>
    <div class="statisticsExperienceData">
        <div class="sDate">
            <span><input id="dateExperienceStart" type="button" v-model="startDate" :data-lcalendar="dateExperienceStart"></span>
            <span>至</span>
            <span><input id="dateExperienceEnd" type="button" v-model="endDate" :data-lcalendar="dateExperienceEnd"></span>
        </div>
        <div class="dataBox">
            <div class="dataChart">
                <div class="quarter">
                    <!--<IEcharts style="width: 100%;height: 350px;" ref="experienceData"-->
                              <!--:option="experience.option"-->
                              <!--:loading="experience.loading"-->
                    <!--&gt;</IEcharts>-->
                </div>
            </div>
        </div>
        <div class="particulars" v-show="total>0">
            <section class="list">
                <h3 class="yellow">售出</h3>
                <p>
                    <span>{{dataJson.sold}}</span>
                    <span>{{percentFn(dataJson.sold)}}%</span>
                </p>
            </section>
            <section class="list">
                <h3 class="red">已消费</h3>
                <p>
                    <span>{{dataJson.alreadyConsumed}}</span>
                    <span>{{percentFn(dataJson.alreadyConsumed)}}%</span>
                </p>
            </section>
            <section class="list">
                <h3 class="green">待消费</h3>
                <p>
                    <span>{{dataJson.nonConsumption}}</span>
                    <span>{{percentFn(dataJson.nonConsumption)}}%</span>
                </p>
            </section>
        </div>
        <div class="noData" v-show="noDataStatus">您当前暂未售出体验卡</div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    // import IEcharts from 'vue-echarts-v3/src/full.vue'
    export default {
        name: 'statisticsExperienceData',
        // components: {IEcharts},
        data() {
            return {
                endDate:'', // 当前(结束)日期
                startDate:'', // 开始日期
                dateExperienceStart:'',
                dateExperienceEnd:'',
                watchStatus:false, // 监听状态,记录created请求状态
                colors:['yellow','red','green'],
                total:0,
                dataArr:[],
                dataJson:{},
                noDataStatus:false, // 没有数据
                experience:{
                    loading: false,
                    option:{
                        title: {
                            text: '体验卡统计',
                            x: 'center',
                            y: '45%',
                            textStyle: {
                                color: '#453937',
                                fontSize: 20,
                            }

                        },
                        series: [
                            {
                                name:'人数',
                                type:'pie',
                                radius: ['60%', '70%'],
                                avoidLabelOverlap: false,
                                color: ['#FFDC71', '#FC6E51', '#4CCF6F'],
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center'
                                    },

                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data:[]
                            }
                        ]
                    }
                }
            }
        },
        created() {
            // 各格式化日期
            let date=this.timeFn()
            // 当月1号
            let otf=date.slice(0,7)+'-01'
            this.endDate=date
            this.startDate=otf
            this.dateExperienceStart=`2010-01-01,${this.startDate}`
            this.dateExperienceEnd=`2010-01-01,${this.endDate}`

            // 请求数据
            this.getStatiticsDataFn(`${this.startDate} 00:00:00`,`${this.endDate} 24:00:00`)
        },
        mounted(){
            let _this=this
            // 组件挂载完成初始化日期
            let calendarStart = new lCalendar()
            calendarStart.init({
                'trigger': '#dateExperienceStart', //标签id
                'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
            })
            let calendarEnd = new lCalendar()
            calendarEnd.init({
                'trigger': '#dateExperienceEnd', //标签id
                'type': 'date' //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
            })
        },
        computed: {
        },
        watch: {
            startDate(nv,ov){ // 监听开始日期变化
                let s=this.contrastFn(nv)
                let e=this.contrastFn(this.endDate)
                if (this.watchStatus){
                    if(s>e){
                        this.$store.state.errorMsg='开始日期不能大于结束日期'
                        this.$store.state.errorStatus=true
                    }else {
                        // 请求数据
                        this.dataArr=[]
                        this.getStatiticsDataFn(`${this.startDate} 00:00:00`,`${this.endDate} 24:00:00`)
                    }
                }
            },
            endDate(nv,ov){ // 监听结束日期变化
                let s=this.contrastFn(this.startDate)
                let e=this.contrastFn(nv)
                if (this.watchStatus){
                    if(s>e){
                        this.$store.state.errorMsg='结束日期不能小于开始日期'
                        this.$store.state.errorStatus=true
                    }else {
                        // 请求数据
                        this.dataArr=[]
                        this.getStatiticsDataFn(`${this.startDate} 00:00:00`,`${this.endDate} 24:00:00`)
                    }
                }
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
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
            getStatiticsDataFn(st,et){ // 获取数据
                let _this=this
                _this.loadingShowA()
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/experienceCardStatistics`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        startTime:st,
                        endTime:et
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        if (d.data){
                            _this.dataArr.push({value:d.data.sold,name:'售出'})
                            _this.dataArr.push({value:d.data.alreadyConsumed,name:'已消费'})
                            _this.dataArr.push({value:d.data.nonConsumption,name:'待消费'})
                            _this.experience.option.series[0].data=_this.dataArr
                            _this.total=d.data.sold+d.data.alreadyConsumed+d.data.nonConsumption
                            _this.dataJson=d.data
                            _this.$refs.experienceData.resize
                        }else {
                            _this.noDataStatus=true
                            _this.total=0
                            _this.experience.option.series[0].color=['#EDEDED']
                            _this.experience.option.series[0].data=[{value:0,name:'0'},{value:0,name:'0'},{value:0,name:'0'}]
                        }
                        _this.watchStatus=true // 监听可以执行了
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
            percentFn(v){
                let num=Math.round((v/this.total)*100)
                return num
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .statisticsExperienceData
        position fixed
        top 0
        let 0
        background-color #FFF
        padding-top 15px
        width 100%
        height 100%
        .sDate
            position absolute
            top 0
            left 0
            z-index 100
            background-color rgba(255,255,255,.6)
            width 100%
            height 40px
            line-height @height
            text-align center
            font-size 0
            span
                color #FF8000
                font-size 15px
                &:nth-of-type(2)
                    color #151515
                    margin 0 20px
                input
                    border 0
                    background none
                    color #FF8000
                    font-size 15px
                    text-align center
                    width 80px
        .dataBox
            width @width
            .dataChart
                width 100%
                overflow auto
                .month
                    width 100%
                    overflow auto
        .particulars
            padding 0 30px
            width 100%
            .list
                padding 14px 0
                border-bottom 1px solid #F2F2F2
                width @width
                h3
                    display inline-block
                    vertical-align middle
                    color #453937
                    font-size 16px
                    &:before
                        margin-right 16px
                        display inline-block
                        vertical-align middle
                        content ''
                        width 8px
                        height 8px
                        border-radius 4px
                .yellow
                    &:before
                        background-color #FFDC71
                .red
                    &:before
                        background-color #FC6E51
                .green
                    &:before
                        background-color #4CCF6F
                p
                    display inline-block
                    vertical-align middle
                    float right
                    color #453937
                    font-size 0
                    span
                        font-size 16px
                        &:first-child
                            margin-right 18px
                            color #808080
        .noData
            text-align center
            color #453937
            font-size 16px
            width 100%
</style>

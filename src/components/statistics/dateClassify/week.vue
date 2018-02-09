<template>
    <div class="week">
        <div class="dataBox">
            <h3 class="totalText">总计：{{total}}(人)</h3>
            <p class="person">当前人数</p>
            <div class="chartShadow">
                <!--<IEcharts style="width: 100%;height: 320px;" ref="week"-->
                          <!--:option="week.option" :loading="week.loading"-->
                <!--&gt;</IEcharts>-->
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    // import IEcharts from 'vue-echarts-v3/src/full.vue'
    export default {
        name: 'week',
        // components: {IEcharts},
        props:{
            cardType:{
                type:String
            }
        },
        data() {
            return {
                total:0,
                dataArr:[0,0,0,0,0,0,0],
                week:{
                    loading: false,
                    option: {
                        xAxis: [{
                            boundaryGap: false, // 文字和竖轴线对齐
                            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                            axisLine: { // x轴线
                                show: false
                            },
                            axisTick:{ // x轴刻度
                                show:false
                            },
                            splitLine: { //网格线
                                show: true,
                                lineStyle: {
                                    color: ['#D8D8D8'],
                                    type: 'solid'
                                }
                            }
                        }],
                        yAxis: [{
                            name: '人数',
                            axisLine: { // y轴线
                                show: false
                            },
                            axisTick:{ // y轴刻度
                                show:false
                            },
                            splitLine: { //网格线
                                show: false
                            }
                        }],
                        series: [{
                            name: '开卡人数',
                            type: 'line',
                            symbolSize: 8,
                            data: [],
                            itemStyle: {
                                normal: {
                                    color: '#FFC20C', // 圆点颜色
                                    lineStyle: {
                                        color: '#FFC20C' // 折线颜色
                                    }
                                }
                            },
                            label: {
                                normal: {
                                    show: true, //值显示
                                    position: 'top'
                                }
                            }
                        }]
                    }
                }
            }
        },
        created() {
            this.getStatiticsDataFn('week',this.cardType)
        },
        mounted(){
            window.onresize=this.$refs.week.resize
        },
        computed: {},
        watch: {
            cardType(nVal,oVal){
                if(nVal){
                    this.dataArr=[]
                    this.getStatiticsDataFn('week',this.cardType)
                }
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
            daysFn(v){ // 判断是周几
                let timestamp = Date.parse(new Date(v)) // 转为时间戳
                let day = ''
                let week = new Date(timestamp).getDay()
                if (week === 0) {
                    day = '周日'
                } else if (week === 1) {
                    day = '周一'
                } else if (week === 2) {
                    day = '周二'
                } else if (week === 3) {
                    day = '周三'
                } else if (week === 4) {
                    day = '周四'
                } else if (week === 5) {
                    day = '周五'
                } else if (week === 6) {
                    day = '周六'
                }
                return day
            },
            getStatiticsDataFn(dt,ct){
                let _this=this
                _this.loadingShowA()
                _this.total=0
                this.$http({
                    method:'GET',
                    url:`${_this.$URL}api/v1/store/userCensus`,
                    headers:{
                        accessToken:_this.$store.state.STOREINFO.ACCESSTOKEN
                    },
                    params:{
                        storeId:_this.$store.state.STOREINFO.STOREID,
                        dateKey:dt,
                        cardType:ct
                    }
                }).then((res) => {
                    _this.loadingShowA()
                    let d=res.data
//                    console.log(d)
                    if (d.code === 0){
                        let weekData=d.data
                        weekData.forEach((c,i)=>{
                            _this.total+=c.num
                        })

                        let week=weekData.map((c,i)=>{ // 周几
                            return _this.daysFn(c.joinTime)
                        })
                        let data=weekData.map((c,i)=>{ // 周几对应的数据
                            return c.num
                        })

                        week.forEach((w,i)=>{
                            if(w==='周一'){
                                _this.dataArr[0]=data[i]
                            }else if(w==='周二'){
                                _this.dataArr[1]=data[i]
                            }else if(w==='周三'){
                                _this.dataArr[2]=data[i]
                            }else if(w==='周四'){
                                _this.dataArr[3]=data[i]
                            }else if(w==='周五'){
                                _this.dataArr[4]=data[i]
                            }else if(w==='周六'){
                                _this.dataArr[5]=data[i]
                            }else{
                                _this.dataArr[6]=data[i]
                            }
                        })
                        _this.week.option.series[0].data=_this.dataArr
//                        console.log(_this.week.option.series[0].data)
//                        _this.$refs.week.resize
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
    .week
        width 100%
        .dataBox
            padding-bottom 17px
            width @width
            .totalText
                margin-left 15px
                color #C2C2C2
                font-size 17px
            .person
                margin 5px 0 0 15px
                color #453937
                font-size 8px
                &:before
                    display inline-block
                    margin-right 6px
                    content ''
                    background-color #FFC20C
                    width 6px
                    height 6px
                    border-radius 3px
            .dataChart
                width 100%
                overflow auto
            .chartShadow
                box-shadow 0 1px 1px rgba(70,65,83,.2)
</style>

<template>
    <div>
        <!--<IEcharts style="width: 100%;height: 350px;" ref="quarter"-->
                  <!--:option="quarter.option" :loading="quarter.loading"-->
        <!--&gt;</IEcharts>-->
        <div class="particulars" v-show="total>0">
            <section class="list" v-for="(da,i) in dataArr">
                <h3 :class="{'yellow':colors[i]}">{{da.name}}月</h3>
                <p>
                    <span>{{da.value}}</span>
                    <span>{{percentFn(da.value)}}%</span>
                </p>
            </section>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    // import IEcharts from 'vue-echarts-v3/src/full.vue'
    export default {
        name: 'quarter',
        // components: {IEcharts},
        props:{
            cardType:{
                type:String
            }
        },
        data() {
            return {
                colors:['yellow','red','green'],
                total:0,
                dataArr:[],
                quarter:{
                    loading: false,
                    option:{
                        title: {
                            text: '0',
                            subtext:'总人数',
                            x: 'center',
                            y: '40%',
                            textStyle: {
                                color: '#453937',
                                fontSize: 40,
                            },
                            subtextStyle:{
                                color:'#453937',
                                fontSize:16,
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
            this.getStatiticsDataFn('quarter',this.cardType)
        },
        mounted(){
            window.onresize=this.$refs.quarter.resize
        },
        computed: {},
        watch: {
            cardType(nVal,oVal){
                if(nVal){
                    this.dataArr=[]
                    this.getStatiticsDataFn('quarter',this.cardType)
                }
            }
        },
        methods: {
            ...mapActions(['loadingShowA']),
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
                        let quarterData=d.data
                        quarterData.forEach((c,i)=>{
                            _this.total+=c.num
                            _this.dataArr.push({value:c.num,name:parseInt(c.joinTime)})
                        })

                        if (_this.total===0){
                            _this.quarter.option.series[0].color=['#EDEDED']
                            _this.quarter.option.series[0].data=[{value:0,name:'0'},{value:0,name:'0'},{value:0,name:'0'}]
                        }else {
                            _this.quarter.option.title.text=_this.total // 总人数
                            _this.quarter.option.series[0].data=_this.dataArr // eCharts数据
                        }
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
    .particulars
        padding 0 30px 30px 30px
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
</style>

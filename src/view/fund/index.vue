<template>
    <div class="fundIndex">
        <div class="fundDiv">
            <p class="ft409EFF ft16 title">资金数据</p>
            <ul>
                <li>
                    <p>
                        <span>累计已结算订单数：</span>
                        <el-tooltip effect="dark" content="高拥宝中累计已完成结算的订单数" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.settled_num}}</b>
                </li>
                <li>
                    <p>
                        <span>当前待结算订单数：</span>
                        <el-tooltip effect="dark" content="高拥宝中当前待结算的订单数状态的订单数" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.wait_settled_num}}</b>
                </li>
                <li>
                    <p>
                        <span>累计已失效订单数：</span>
                        <el-tooltip effect="dark" content="高拥宝中订单状态为已失效的订单数" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.expired_num}}</b>

                </li>
                <li>
                    <p>
                        <span>累计推广佣金：</span>
                        <el-tooltip effect="dark" content="高拥宝累计获得的已结算的推广佣金" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.total_promote}}</b>
                </li>
                <li>
                    <p>
                        <span>平台累计赚取：</span>
                        <el-tooltip effect="dark" content="累计推广佣金-平台累计分佣" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.platform_earning}}</b>
                </li>
                <li>
                    <p>
                        <span>平台累计分佣：</span>
                        <el-tooltip effect="dark" content="订单分佣金额+订单奖励金额" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.platform_division}}</b>
                </li>
                <li>
                    <p>
                        <span>累计提现：</span>
                        <el-tooltip effect="dark" content="高拥宝累计已经提现的金额" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.total_cash}}</b>
                </li>
                <li>
                    <p>
                        <span>待结算：</span>
                        <el-tooltip effect="dark" content="高拥宝中当前待结算订单的待结算金额" placement="right">
                            <i class="el-icon-question"></i>
                        </el-tooltip>
                    </p>
                    <b>{{fundData.wait_settled}}</b>
                </li>
            </ul>
        </div>
        <div class="fundMain">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="订单记录" name="1">
                    <fund-index></fund-index>
                </el-tab-pane>
                <el-tab-pane label="提现记录" name="2">
                    <fund-cash></fund-cash>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import fundIndex from '../../components/modules/fund/fundIndex'
    import fundCash from '../../components/modules/fund/fundCash'

    export default {
        name: "index",
        data() {
            return {
                activeName: '1',
                fundData: {},
            }
        },
        mounted() {
            this.getFund()
        },
        components: {fundIndex, fundCash},
        methods: {
            getFund() {
                this.$post('withdraw/getStatistics', {})
                    .then(res=>{
                        this.fundData = res.info
                    })
            },
            handleClick(val) {
                console.log(val)
            }
        }
    }
</script>
<style scoped lang="scss">
    .fundIndex {
        padding: 80px 100px;
        .fundDiv {
            .title {
                height: 16px;
                line-height: 16px;
                padding-left: 10px;
                border-left: 2px solid #409EFF;
            }
            ul {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: wrap;
                li {
                    width: 320px;
                    margin-top: 40px;
                    p {
                        font-size: 12px;
                        color: #999;
                        line-height: 12px;
                        margin-bottom: 14px;
                    }
                    b {
                        font-size: 14px;
                        color: #666;
                        line-height: 12px;
                    }
                }
            }
        }
        .fundMain {
            margin-top: 60px;
        }
    }
</style>

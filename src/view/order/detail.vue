<template>
    <div class="orderDetail">
        <el-steps :active="activeSteps" align-center finish-status="success" process-status="process">
            <el-step :title="statusInfo.status_pay.tip_word" :description="statusInfo.status_pay.handle_time"></el-step>
            <el-step :title="statusInfo.status_received.tip_word"
                     :description="statusInfo.status_received.handle_time"></el-step>
            <el-step :title="statusInfo.status_settle.tip_word"
                     :description="statusInfo.status_settle.handle_time"></el-step>
            <!--<el-step :title="statusInfo.status_expire.tip_word"-->
                     <!--:description="statusInfo.status_expire.handle_time"></el-step>-->
        </el-steps>
        <el-collapse v-model="activeNames">
            <el-collapse-item title="订单详情" name="1">
                <ul>
                    <li class="thead">
                        <p>订单编号</p>
                        <p>商品名称</p>
                        <p>所属平台</p>
                        <p>购买数量</p>
                        <p>实付金额（元）</p>
                        <p>订单状态</p>
                    </li>
                    <li>
                        <p>{{orderData.order_sn}}</p>
                        <p>{{orderData.goods_name}}</p>
                        <p>{{orderData.platform_name}}</p>
                        <p>{{orderData.goods_num}}</p>
                        <p>{{orderData.order_amount}}</p>
                        <p>{{orderData.order_status_name}}</p>
                    </li>
                </ul>
            </el-collapse-item>
            <el-collapse-item title="推广信息" name="2">
                <ul>
                    <li class="thead">
                        <p>推广佣金(元)</p>
                        <p>推广用户</p>
                        <p>用户手机号码</p>
                        <p>角色类型</p>
                        <p>赚得佣金(元) </p>
                    </li>
                    <li>
                        <p>{{orderData.promote_commission}}</p>
                        <p>{{orderData.promoter}}</p>
                        <p>{{orderData.mobile}}</p>
                        <p>{{orderData.role_type}}</p>
                        <p>{{orderData.earn_commission}}</p>
                    </li>
                </ul>
            </el-collapse-item>

            <el-collapse-item title="奖励详情" name="3">
                <el-table :data="gridData">
                    <el-table-column property="reward" label="奖励金额(元)" width="272" align="center"></el-table-column>
                    <el-table-column property="user" label="奖励用户" width="280" align="center"></el-table-column>
                    <el-table-column property="mobile" label="用户手机号码" width="280" align="center"></el-table-column>
                    <el-table-column property="role_name" label="角色类型" width="280" align="center"></el-table-column>
                    <el-table-column property="reward_desc" label="奖励类型" width="280" align="center"></el-table-column>
                </el-table>
            </el-collapse-item>
        </el-collapse>

    </div>
</template>

<script>
    export default {
        name: "detail",
        data() {
            return {
                activeNames: ['1', '2', '3'],
                activeSteps: 1,
                gridData: [],
                orderData: {},
                statusInfo: {
                    status_pay:{},
                    status_received:{},
                    status_settle:{},
                }
            }
        },
        mounted() {
            this.getDetail()
        },
        methods: {
            getDetail() {
                this.$post('Order/detail', {
                    order_id: this.$route.query.order_id
                })
                    .then(res => {
                        this.activeSteps = res.statusInfo.step
                        this.statusInfo = res.statusInfo
                        this.orderData = res.orderInfo
                        this.gridData = res.rewardInfo
                    })
            }
        },
        watch: {
            $route(to, from) {
                if (this.$route.query.order_id) {
                    this.getDetail()
                }
            }
        }
    }
</script>
<style lang="scss">
    .orderDetail {
        .el-collapse {
            .el-collapse-item {
                .el-collapse-item__header {
                    height: 16px;
                    line-height: 16px;
                    color: #5B86FF;
                    font-size: 16px;
                    padding: 0 0 0 10px;
                    margin: 16px 0;
                    border-left: 2px solid #5B86FF;
                    border-bottom: none;
                    position: relative;

                }
                .el-collapse-item__wrap {
                    border-bottom: none;
                    .el-collapse-item__content {
                        padding: 0;
                    }
                }
            }
        }
    }
</style>

<style scoped lang="scss">
    .orderDetail {
        padding: 80px 100px;
        .el-steps {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 30px;
        }
        .el-collapse {
            border: none;
            .el-collapse-item {
                margin-bottom: 60px;
                ul {
                    li {
                        display: flex;
                        justify-content: stretch;
                        align-items: center;
                        width: 100%;
                        line-height: 24px;
                        padding: 10px 0;
                        p {
                            flex: 1;
                            text-align: center;
                        }
                    }
                    .thead {
                        background-color: #F0F3FA;
                    }
                }
            }
        }
    }
</style>

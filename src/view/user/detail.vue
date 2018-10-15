<template>
    <div class="userDetail">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="用户详情" name="1">
                <ul>
                    <li>
                        <p>
                            <label>用户头像：</label>
                            <img :src="detailInfo.head_img" alt="">
                        </p>
                        <p>
                            <label>昵称：</label>
                            <span>{{detailInfo.nickname}}</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <label>手机号码：</label>
                            <span>{{detailInfo.mobile}}</span>
                        </p>
                        <p>
                            <label>角色：</label>
                            <span>{{detailInfo.role_name}}</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <label>上级用户：</label>
                            <span>{{detailInfo.inviter_nickname}}</span>
                        </p>
                        <p>
                            <label>上级手机号码：</label>
                            <span>{{detailInfo.inviter_mobile}}</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <label>邀请码：</label>
                            <span>{{detailInfo.invitation_code}}</span>
                        </p>
                        <p>
                            <label>注册日期：</label>
                            <span>{{detailInfo.created_at_label}}</span>
                        </p>
                    </li>
                </ul>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    组织架构
                    <el-button round plain size="mini" @click.stop="goShowDialog1">详情</el-button>
                </template>
                <ul>
                    <li>
                        <p>
                            <label>下级会员：</label>
                            <span>{{detailInfo.one_level}}人</span>
                        </p>
                        <p>
                            <label>下级运营总监：</label>
                            <span>{{detailInfo.big_level}}人</span>
                        </p>
                    </li>
                </ul>
            </el-collapse-item>
            <!--<el-collapse-item name="3">-->
            <!--<template slot="title">-->
            <!--淘金币信息 <el-button type="primary" round plain size="mini">详情</el-button>-->
            <!--</template>-->
            <!--</el-collapse-item>-->
            <el-collapse-item name="4">
                <template slot="title">
                    收入报表
                    <el-button round plain size="mini" @click.stop="goShowDialog2">详情</el-button>
                </template>
                <ul>
                    <li>
                        <p>
                            <label>推广累计收益：</label>
                            <span>{{detailInfo.total_promote_earnings}}元</span>
                        </p>
                        <p>
                            <label>团队订单累计收益：</label>
                            <span>{{detailInfo.total_team_earnings}}元</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <label>高级总监收益：</label>
                            <span>{{detailInfo.total_senior_director_earnings}}元</span>
                        </p>
                    </li>
                </ul>
            </el-collapse-item>
            <el-collapse-item name="5">
                <template slot="title">
                    余额信息
                    <!--<el-button round plain size="mini" @click.stop="goShowDialog3">详情</el-button>-->
                </template>
                <ul>
                    <li>
                        <p>
                            <label>可提现：</label>
                            <span>{{detailInfo.balance}}元</span>
                        </p>
                        <p>
                            <label>已结算：</label>
                            <span>{{detailInfo.settlement_amount}}元</span>
                        </p>
                    </li>
                    <li>
                        <p>
                            <label>待结算：</label>
                            <span>{{detailInfo.being_settled}}元</span>
                        </p>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
        <div class="dialogDiv">
            <el-dialog :title="title" :visible.sync="showDialog" width="1200px">
                <el-tabs v-model="activeNameDialog1" @tab-click="handleClick" v-if="title=='组织架构'">
                    <el-tab-pane name="first">
                        <span slot="label">下级会员（{{total1}}）</span>
                        <v-table :dataType="1" @listenTotal1="getTotal1"></v-table>
                    </el-tab-pane>
                    <el-tab-pane name="second">
                        <span slot="label">下级运营总监（{{total2}}）</span>
                        <v-table :dataType="2" @listenTotal2="getTotal2"></v-table>
                    </el-tab-pane>
                </el-tabs>
                <div class="detailMoney" v-if="title=='收入报表'">
                    <v-form></v-form>
                </div>
                <!--<el-tabs v-model="activeNameDialog2" @tab-click="handleClick" v-if="title=='余额信息'">-->
                <!--<el-tab-pane label="可提现" name="first">-->
                <!--<v-money :dataType="1"></v-money>-->
                <!--</el-tab-pane>-->
                <!--<el-tab-pane label="已结算" name="second">-->
                <!--</el-tab-pane>-->
                <!--<el-tab-pane label="待结算" name="second">-->
                <!--</el-tab-pane>-->
                <!--</el-tabs>-->

            </el-dialog>
        </div>
    </div>
</template>

<script>
    import vTable from '../../components/modules/table/userDetail'
    import vForm from '../../components/modules/table/userDetailForm'
    import vMoney from '../../components/modules/table/userDetailMoney'

    export default {
        name: "detail",
        data() {
            return {
                activeNames: ['1', '2', '3', '4', '5'],
                detailInfo: {},               // 用户详情
                title: '',               // dialog弹框
                showDialog: false,
                activeNameDialog1: 'first',
                activeNameDialog2: 'first',
                total1: 0,
                total2: 0,
            }
        },
        mounted() {
            this.getDetail()
        },
        components: {vTable, vForm, vMoney},
        methods: {
            getDetail() {
                this.$post('User/detail', {
                    uid: this.$route.query.user_id
                })
                    .then(res => {
                        this.detailInfo = res
                    })
            },

            getTotal1(val) {
                this.total1 = val
            },
            getTotal2(val) {
                this.total2 = val
            },

            handleClick() {},

            goShowDialog1() {
                this.title = '组织架构'
                this.showDialog = true
            },
            goShowDialog2() {
                this.title = '收入报表'
                this.showDialog = true
            },
            goShowDialog3() {
                this.title = '余额信息'
                this.showDialog = true
            }
        },
        watch: {
            $route(to, from) {
                if (this.$route.query.user_id) {
                    this.showDialog = false
                    this.getDetail()
                }
            }
        }
    }
</script>
<style lang="scss">
    .userDetail {
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
    .userDetail {
        padding: 60px 20px;
        .el-collapse {
            border: none;
            .el-collapse-item {
                padding: 20px 80px;
                border-bottom: 10px solid #F0F3FA;
                .el-button {
                    position: absolute;
                    left: 360px;
                    top: 50%;
                    transform: translateY(-50%);
                    padding: 0;
                    width: 80px;
                    height: 24px;
                    line-height: 24px;
                }
                ul {
                    li {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        p {
                            flex: 1;
                            padding: 20px 0;
                            font-size: 12px;
                            label {
                                color: #999;
                            }
                            span {
                                color: #666;
                            }
                        }
                    }
                }
            }
        }
    }
</style>

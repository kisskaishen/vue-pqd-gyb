<template>
    <div class="cashing">
        <p class="tipsCash ft14 ft333">提现待审核金额: <span class="ft16 ftFE0000">￥{{withCountInfo}}</span></p>
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>提现编号：</label>
                    <el-input v-model="cashNumber" placeholder="请输入提现编号"></el-input>
                </el-col>
                <el-col>
                    <label>用户昵称</label>
                    <el-input v-model="userNick" placeholder="请输入用户昵称"></el-input>
                </el-col>
                <el-col>
                    <label>用户手机号码：</label>
                    <el-input v-model="userTel" placeholder="请输入用户手机号码"></el-input>
                </el-col>

            </el-row>

            <el-row>
                <el-col>
                    <label>提现账号：</label>
                    <el-input v-model="account" placeholder="请输入提现账号"></el-input>
                </el-col>
                <el-col>
                    <label>账户名称：</label>
                    <el-input v-model="accountName" placeholder="请输入账户名称"></el-input>
                </el-col>
                <el-col>
                    <label>账号类型：</label>
                    <el-select v-model="accountType" placeholder="请选择账号类型">
                        <el-option
                            v-for="item,index in accountTypes"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>提现时间：</label>
                    <el-date-picker
                        v-model="timeRange"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="updateDate">
                    </el-date-picker>
                </el-col>
            </el-row>
            <el-row class="tipsBtn">
                <el-button type="primary" round @click="searchBtn">检索</el-button>
            </el-row>

        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                header-align="center"
                style="width: 100%">
                <el-table-column prop="serial_number" label="提现编号" fixed align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户昵称" align="center"></el-table-column>
                <el-table-column prop="user_mobile" label="用户手机号码" align="center"></el-table-column>
                <el-table-column prop="to_account" label="提现账号" align="center"></el-table-column>
                <el-table-column prop="to_username" label="账户名称" align="center"></el-table-column>
                <el-table-column prop="pay_name" label="账号类型" align="center"></el-table-column>
                <el-table-column prop="money" label="提现金额（元）" align="center"></el-table-column>
                <el-table-column prop="service_charge" label="提现手续费" align="center"></el-table-column>
                <el-table-column prop="recieve_money" label="到账金额" align="center"></el-table-column>
                <el-table-column prop="created_at" label="提现时间" align="center"></el-table-column>
                <el-table-column prop="updated_at" label="审核时间" align="center"></el-table-column>
                <el-table-column prop="updated_at" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="cashBtn(scope)" v-if="scope.row.btn.audit">审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pageDiv">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 50]"
                :page-size="rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <div class="dialogDiv">
            <el-dialog
                title="审核信息"
                :visible.sync="cashDialog"
                width="640px">
                <div class="cashInfo">
                    <div class="lineDiv">
                        <p>
                            <label>到账金额：</label>
                            <span class="ftFE0000">{{cashInfo.recieve_money}}</span>
                        </p>
                        <p>
                            <label>提现方式：</label>
                            <span>{{cashInfo.pay_name}}</span>
                        </p>
                    </div>
                    <div class="lineDiv">
                        <p>
                            <label>提现账号：</label>
                            <span>{{cashInfo.to_account}}</span>
                        </p>
                        <p>
                            <label>账户名称：</label>
                            <span>{{cashInfo.to_username}}</span>
                        </p>
                    </div>
                    <div class="lineDiv">
                        <p>
                            <label>审核操作：</label>
                            <el-radio-group v-model="isCheckStatus">
                                <el-radio label="2">同意提现</el-radio>
                                <el-radio label="3">拒绝提现</el-radio>
                            </el-radio-group>
                            <el-input maxlength="100" type="textarea" :rows="3" placeholder="请简要描述拒绝提现的理由"
                                      v-model="rejectContent" v-if="isCheckStatus=='3'"></el-input>
                            <span class="textTips ft999 ft14" v-if="isCheckStatus=='3'">{{rejectContent.length}}/100</span>
                        </p>
                    </div>
                </div>
                <p slot="footer" class="dialog-footer">
                    <el-button @click="cashDialog = false">取 消</el-button>
                    <el-button type="primary" @click="sureCash">确 定</el-button>
                </p>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        props:['index'],
        name: "cashing",
        data() {
            return {
                cashNumber: '',              // 提现编号
                userNick: '',              // 用户昵称
                userTel: '',              // 用户手机号
                account: '',              // 提现账号
                accountName: '',              // 账号名称
                accountTypes: [
                    {label: '全部', value: '0'},
                    {label: '支付宝', value: '1'},
                    {label: '微信', value: '2'}
                ],
                accountType: '',              // 账户类型
                timeRange: '',             // 支付时间
                timeRangeFormat: '',             // 支付时间
                tableData: [],
                rows: 10,
                total: 0,
                currentPage: 1,
                withCountInfo: 0,           // 统计
                cashDialog: false,
                cashInfo: '',                // 审核信息数据
                isCheckStatus: '2',
                rejectContent: '',               // 拒绝理由
            }
        },
        mounted() {
            if (this.index == '1') {
                this.getList()
            }
        },
        methods: {

            getList() {
                this.$post('withdraw/list', {
                    status: 1,
                    serial_number: this.cashNumber,
                    user_name: this.userNick,
                    user_phone: this.userTel,
                    to_account: this.account,
                    to_username: this.accountName,
                    pay_type: this.accountType,
                    created_time_map: this.timeRangeFormat,
                    page: this.currentPage,
                    rows: this.rows
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                        this.withCountInfo = res.withCountInfo
                    })
            },
            // 支付时间
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 修改每页显示条数
            handleSizeChange(val) {
                this.rows = val
                this.getList()
            },
            // 切换当前页
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getList()
            },
            // 审核
            cashBtn(val) {
                this.cashInfo = val.row
                this.cashDialog = true
            },
            // 确定
            sureCash() {
                this.$post('withdraw/audit', {
                    id: this.cashInfo.id,
                    status: this.isCheckStatus,
                    refuse_msg: this.isCheckStatus == '3' ? this.rejectContent : ''
                })
                    .then(res => {
                        this.$message.success('审核成功')
                        this.cashDialog = false
                        this.getList()
                    })
            }
        },
        watch: {
            index(val) {
                if (val == '1') {
                    this.getList()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .cashing {
        .dialogDiv {
            .cashInfo {
                .lineDiv {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                    p {
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: flex-start;
                        flex: 1;
                        span {
                            padding-left: 24px;
                            margin-bottom: 8px;
                        }
                        span, label {
                            line-height: 20px;
                            height: 20px;
                        }
                        label {
                            margin: 20px 0;
                        }
                        .el-radio-group {
                            padding-left: 24px;
                            .el-radio {
                                margin: 0 20px 0 0;
                            }
                        }
                        .el-textarea {
                            width: 552px;
                            margin: 20px auto 0;
                        }
                        .textTips {
                            position: absolute;
                            right: 40px;
                            bottom: 0;
                        }

                    }
                }
            }
        }
    }
</style>

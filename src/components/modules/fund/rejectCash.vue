<template>
    <div class="rejectCash">
        <p class="tipsCash ft14 ft333">拒绝提现金额: <span class="ft16 ftFE0000">￥{{withCountInfo}}</span></p>
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
                    <label>审核时间：</label>
                    <el-date-picker
                        v-model="cashTimeRange"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="updateCashDate">
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
                <el-table-column prop="recieve_money" label="到账金额" align="center"></el-table-column>
                <el-table-column prop="recieve_money" label="拒绝原因" align="center"></el-table-column>
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
    </div>
</template>

<script>
    export default {
        props: ['index'],
        name: "rejectCash",
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
                timeRange: '',             // 提现时间
                timeRangeFormat: '',             // 提现时间
                cashTimeRange: '',             // 审核时间
                cashTimeRangeFormat: '',             // 审核时间
                tableData: [],
                rows: 10,
                total: 0,
                currentPage: 1,
                withCountInfo: 0,           // 统计
            }
        },
        mounted() {
            if (this.index == '3') {
                this.getList()
            }
        },
        methods: {
            getList() {
                this.$post('withdraw/list', {
                    status: 3,
                    serial_number: this.cashNumber,
                    user_name: this.userNick,
                    user_phone: this.userTel,
                    to_account: this.account,
                    to_username: this.accountName,
                    pay_type: this.accountType,
                    created_time_map: this.timeRangeFormat,
                    updated_time_map: this.cashTimeRangeFormat,
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
            updateCashDate(val) {
                this.cashTimeRangeFormat = val.join('/')
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
                console.log(val)
            },
        },
        watch: {
            index(val) {
                if (val == '3') {
                    this.getList()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .rejectCash {

    }
</style>

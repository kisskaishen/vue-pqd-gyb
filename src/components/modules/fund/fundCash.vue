<template>
    <div class="fundCash">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>用户昵称：</label>
                    <el-input v-model="userNick" placeholder="请输入用户昵称"></el-input>
                </el-col>
                <el-col>
                    <label>手机号码</label>
                    <el-input v-model="userTel" placeholder="请输入手机号码"></el-input>
                </el-col>
                <el-col>
                    <label>提现状态：</label>
                    <el-select v-model="status" placeholder="请选择提现状态">
                        <el-option
                            v-for="item,index in statuses"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>提现申请时间：</label>
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
                    <el-input v-model="cashNumber" placeholder="请输入提现账号"></el-input>
                </el-col>
                <el-col>
                    <label>提现账号名称：</label>
                    <el-input v-model="cashName" placeholder="请输入提现账号名称"></el-input>
                </el-col>

                <el-col>
                    <label>提现审核时间：</label>
                    <el-date-picker
                        v-model="checkTimeRange"
                        type="daterange"
                        range-separator="至"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="checkUpdateDate">
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
                <el-table-column prop="uid" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="user_name" label="用户昵称" align="center"></el-table-column>
                <el-table-column prop="user_mobile" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="to_account" label="提现账号" align="center"></el-table-column>
                <el-table-column prop="to_username" label="提现账号名称" align="center"></el-table-column>
                <el-table-column prop="pay_name" label="提现方式" align="center"></el-table-column>
                <el-table-column prop="money" label="提现金额（元）" align="center"></el-table-column>
                <el-table-column prop="status" label="提现状态" align="center"></el-table-column>
                <el-table-column prop="created_at" label="提现申请时间" align="center"></el-table-column>
                <el-table-column prop="updated_at" label="提现审核时间" align="center"></el-table-column>
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
        name: "fundCash",
        data() {
            return {
                userNick: '',             // 用户昵称
                userTel: '',             // 手机号
                statuses: [
                    {label: '全部 ', value: '0'},
                    {label: '处理中', value: '1'},
                    {label: '同意提现', value: '2'},
                    {label: '拒绝提现', value: '3'}
                ],
                status: '0',             // 提现状态
                cashNumber: '',             // 提现账号
                userName: '',             // 提现账号名称
                cashName: '',             // 用户手机号
                timeRange: '',             // 申请时间
                timeRangeFormat: '',             // 申请时间
                checkTimeRange: '',          // 审核时间
                checkTimeRangeFormat: '',          // 审核时间
                tableData: [],
                rows: 10,
                total: 0,
                currentPage: 1,
            }
        },
        mounted() {
            this.getList()
        },
        methods: {
            getList() {
                this.$post('withdraw/withdrawalLog', {
                    user_name: this.userNick,
                    user_phone: this.userTel,
                    to_account: this.cashNumber,
                    status: this.status,
                    to_username: this.userName,
                    created_time_map: this.timeRangeFormat,
                    updated_time_map: this.checkTimeRangeFormat,
                    page: this.currentPage,
                    rows: this.rows,
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                    })
            },
            // 支付时间
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 审核时间
            checkUpdateDate(val) {
                this.checkTimeRangeFormat = val.join('/')
            },
            // 修改每页显示条数
            handleSizeChange(val) {
                this.rows = val
            },
            // 切换当前页
            handleCurrentChange(val) {
                this.currentPage = val
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getList()
            },
        }
    }
</script>

<style scoped lang="scss">
    .fundCash {
        margin-top: 40px;
    }
</style>

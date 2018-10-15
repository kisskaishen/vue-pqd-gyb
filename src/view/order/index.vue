<template>
    <div class="orderIndex">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>订单编号</label>
                    <el-input v-model="orderNumber" placeholder="请输入订单编号"></el-input>
                </el-col>
                <el-col>
                    <label>商品ID</label>
                    <el-input v-model="goodsId" placeholder="请输入商品id"></el-input>
                </el-col>
                <el-col>
                    <label>订单状态</label>
                    <el-select v-model="status" placeholder="订单状态">
                        <el-option
                            v-for="item,index in statuses"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>商品名称</label>
                    <el-input v-model="goodsName" placeholder="请输入商品名称"></el-input>
                </el-col>
            </el-row>

            <el-row>
                <el-col>
                    <label>推广用户</label>
                    <el-input v-model="userName" placeholder="请输入推广用户"></el-input>
                </el-col>
                <el-col>
                    <label>用户手机号码</label>
                    <el-input v-model="userTel" placeholder="请输入用户手机号码"></el-input>
                </el-col>
                <el-col>
                    <label>平台类型</label>
                    <el-select v-model="type" placeholder="平台类型">
                        <el-option
                            v-for="item,index in types"
                            :label="item.platform_name"
                            :key="item.platform_id"
                            :value="item.platform_id"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>支付时间</label>
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
                <el-table-column prop="order_sn" label="订单编号" fixed align="center"></el-table-column>
                <el-table-column prop="goods_id" label="商品ID" align="center"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
                <el-table-column prop="platform_name" label="所属平台" align="center"></el-table-column>
                <el-table-column prop="goods_num" label="购买数量" align="center"></el-table-column>
                <el-table-column prop="order_amount" label="实付金额(元)" align="center"></el-table-column>
                <el-table-column prop="pay_time" label="支付时间" align="center" width="90"></el-table-column>
                <el-table-column prop="order_status_name" label="订单状态" align="center"></el-table-column>
                <el-table-column prop="promote_commission" label="推广佣金(元)" align="center"></el-table-column>
                <el-table-column prop="promoter" label="推广用户" align="center"></el-table-column>
                <el-table-column prop="mobile" label="用户手机号码" align="center"></el-table-column>
                <el-table-column prop="role_type" label="角色类型" align="center"></el-table-column>
                <el-table-column prop="earn_commission" label="赚得佣金(元)" align="center"></el-table-column>
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goDetail(scope)">详情</el-button>
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
        name: "index",
        data() {
            return {
                orderNumber: '',             // 订单编号
                goodsId: '',             // 商品id
                statuses: [],
                status: '',             // 订单状态
                goodsName: '',             // 商品名称
                userName: '',             // 推广用户
                userTel: '',             // 用户手机
                types: [],
                type: '',                // 平台类型
                timeRange: '',                // 支付时间
                timeRangeFormat: '',                // 支付时间
                tableData: [],
                rows: 10,
                currentPage: 1,
                total: 0,
            }
        },
        mounted() {
            this.getStatus()
            this.getType()
            this.getOrderList()
        },
        methods: {
            getStatus() {
                this.$post('Order/conf', {})
                    .then(res => {
                        this.statuses = res.orderStatus
                    })
            },
            getType() {
                this.$post('Platform/list', {})
                    .then(res => {
                        this.types = res
                    })
            },
            getOrderList() {
                this.$post('Order/list', {
                    order_sn: this.orderNumber,
                    goods_id: this.goodsId,
                    goods_name: this.goodsName,
                    order_status: this.status,
                    promoter: this.userName,
                    mobile: this.userTel,
                    platform_id: this.type,
                    pay_time_map: this.timeRangeFormat,
                    rows: this.rows,
                    page: this.currentPage
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = parseInt(res.total)
                    })
            },
            // 支付时间
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 每页多少条
            handleSizeChange(val) {
                this.rows = val
                this.getOrderList()
            },
            // 切换页面
            handleCurrentChange(val) {
                this.currentPage = val
                this.getOrderList()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getOrderList()
            },
            // 去详情页
            goDetail(val) {
                this.$router.push(`/order/detail?order_id=${val.row.order_id}`)
            }
        }
    }
</script>

<style scoped lang="scss">
    .orderIndex {
        padding: 80px 100px;
    }
</style>

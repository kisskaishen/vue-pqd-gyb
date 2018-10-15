<template>
    <div class="userIndex">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>用户昵称</label>
                    <el-input v-model="userNick" placeholder="请输入用户昵称"></el-input>
                </el-col>
                <el-col>
                    <label>手机号码</label>
                    <el-input v-model="userTel" placeholder="请输入手机号码"></el-input>
                </el-col>
                <el-col>
                    <label>角色类型</label>
                    <el-select v-model="userRole" placeholder="角色类型">
                        <el-option
                            v-for="item,index in userRoles"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>上级用户</label>
                    <el-input v-model="upUserName" placeholder="请输入上级用户"></el-input>
                </el-col>
            </el-row>

            <el-row>
                <el-col>
                    <label>上级手机号码</label>
                    <el-input v-model="upUserTel" placeholder="请输入上级手机号码"></el-input>
                </el-col>
                <el-col>
                    <label>邀请码</label>
                    <el-input v-model="inviteCode" placeholder="请输入邀请码"></el-input>
                </el-col>
                <el-col>
                    <label>注册日期</label>
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
                <el-table-column prop="uid" label="ID" fixed align="center"></el-table-column>
                <el-table-column prop="nickname" label="会员昵称" align="center"></el-table-column>
                <el-table-column prop="mobile" label="手机号码" align="center"></el-table-column>
                <el-table-column prop="role_name" label="角色类型" align="center"></el-table-column>
                <!--<el-table-column prop="goods_price" label="淘客币(个)" align="center"></el-table-column>-->
                <el-table-column prop="inviter_nickname" label="上级用户" align="center"></el-table-column>
                <el-table-column prop="inviter_mobile" label="上级手机号码" align="center"></el-table-column>
                <el-table-column prop="invitation_code" label="邀请码" align="center"></el-table-column>
                <el-table-column prop="created_at_label" label="注册日期" width="140" align="center"></el-table-column>
                <el-table-column prop="one_level" label="下级会员(人)" align="center"></el-table-column>
                <el-table-column prop="big_level" label="下级运营总监(人)" align="center"></el-table-column>
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
                userNick: '',                // 用户昵称
                userTel: '',                // 用户手机
                userRoles: [],
                userRole: '',                // 用户角色
                upUserName: '',                  // 上级用户
                upUserTel: '',                  // 上级手机号
                inviteCode: '',                  // 邀请码
                timeRange: '',                  // 注册日期
                timeRangeFormat:'',
                tableData: [],

                rows: 10,
                currentPage: 1,
                total: 0

            }
        },
        mounted() {
            this.getUserType()
            this.getUser()
        },
        methods: {
            // 用户角色
            getUserType() {
                this.$post('User/conf', {})
                    .then(res => {
                        this.userRoles = res.role
                    })
            },
            // 注册日期
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 用户列表
            getUser() {
                this.$post('User/list', {
                    nickname: this.userNick,
                    mobile: this.userTel,
                    role_id: this.userRole,
                    inviter_nickname: this.upUserName,
                    inviter_mobile: this.upUserTel,
                    invitation_code: this.inviteCode,
                    reg_time: this.timeRangeFormat,
                    page: this.currentPage,
                    rows: this.rows,
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                    })
            },
            // 每页多少条
            handleSizeChange(val) {
                this.rows = val
                this.getUser()
            },
            // 切换页面
            handleCurrentChange(val) {
                this.currentPage = val
                this.getUser()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getUser()
            },
            // 去详情页
            goDetail(val) {
                this.$router.push(`/user/detail?user_id=${val.row.uid}`)
            }
        }
    }
</script>

<style scoped lang="scss">
    .userIndex {
        padding: 80px 100px;
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
    }
</style>

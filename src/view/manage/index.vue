<template>
    <div class="manageIndex">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>用户名</label>
                    <el-input v-model="userName" placeholder="用户名"></el-input>
                </el-col>
                <el-col>
                    <label style="opacity: 0">按钮</label>
                    <el-button type="primary" round plain @click="searchBtn">检索</el-button>
                </el-col>
                <el-col>
                    <label style="opacity: 0">按钮</label>
                    <el-button type="primary" round @click="showAddAdmin">添加管理员</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                header-align="center"
                style="width: 100%">
                <el-table-column prop="admin_id" label="ID" fixed align="center"></el-table-column>
                <el-table-column prop="admin_name" label="用户名" align="center"></el-table-column>
                <el-table-column prop="add_time" label="加入时间" align="center"></el-table-column>
                <el-table-column prop="coupon_discount" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editBtn(scope)">编辑</el-button>
                        <el-button type="text" @click="deleteBtn(scope)">删除</el-button>
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
                :title="title"
                :visible.sync="openAddAdmin"
                width="400px">
                <p v-if="title!='删除管理员？'">
                    <label>用户名</label>
                    <el-input v-model="addUserName" placeholder="用户名"></el-input>
                </p>
                <p v-if="title!='删除管理员？'">
                    <label>密码</label>
                    <el-input type="password" v-model="addUserPwd" placeholder="密码"></el-input>
                </p>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="openAddAdmin = false">取 消</el-button>
                    <el-button type="primary" @click="sureAddAdmin" v-if="title=='添加管理员'">确 定</el-button>
                    <el-button type="primary" @click="sureEditAdmin" v-if="title=='编辑管理员'">确 定</el-button>
                    <el-button type="danger" @click="sureDeleteAdmin" v-if="title=='删除管理员？'">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "manageIndex",
        data() {
            return {
                userName: '',                    // 管理员姓名
                tableData: [],
                rows: 10,
                currentPage: 1,                 // 当前页数
                total: 0,                       // 总数据

                title: '',
                openAddAdmin: false,
                addUserName: '',
                addUserPwd: '',

                adminId: '',
            }
        },
        mounted() {
            this.getUserList()
        },
        methods: {
            getUserList() {
                this.$post('Adminer/adminList', {
                    page: this.currentPage,
                    rows: this.rows,
                    keywords: this.userName
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                    })
            },
            // 显示添加管理员弹框
            showAddAdmin() {
                this.title = '添加管理员'
                this.openAddAdmin = true
            },
            // 确认添加管理员
            sureAddAdmin() {
                this.$post('Adminer/addAdmin', {
                    user_name: this.addUserName,
                    password: this.addUserPwd
                })
                    .then(res => {
                        this.$message.success('添加成功~')
                        this.openAddAdmin = false
                        this.getUserList()
                    })
            },
            // 修改每页显示条数
            handleSizeChange(val) {
                this.rows = val
                this.getUserList()
            },
            // 切换当前页
            handleCurrentChange(val) {
                this.currentPage = val
                this.getUserList()
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getUserList()
            },
            // 编辑
            editBtn(val) {
                this.adminId = val.row.admin_id
                this.title = '编辑管理员'
                this.addUserName = val.row.admin_name
                this.openAddAdmin = true
            },
            // 确认编辑管理员
            sureEditAdmin() {
                this.$post('Adminer/editAdmin', {
                    admin_id: this.adminId,
                    user_name: this.addUserName,
                    password: this.addUserPwd
                })
                    .then(res => {
                        this.$message.success('编辑成功~')
                        this.openAddAdmin = false
                        this.getUserList()
                    })
            },
            // 删除
            deleteBtn(val) {
                this.adminId = val.row.admin_id
                this.title = '删除管理员？'
                this.openAddAdmin = true
            },
            // 确认删除
            sureDeleteAdmin() {
                this.$post('Adminer/delAdmin', {
                    admin_id: this.adminId
                })
                    .then(res => {
                        this.$message.success('删除成功~')
                        this.openAddAdmin = false
                        this.getUserList()
                    })
            }

        },
        watch: {
            openAddAdmin(val) {
                if (val == false) {
                    this.addUserName = ''
                    this.addUserPwd = ''
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .manageIndex {
        padding: 80px 100px;
        .dialogDiv {
            .el-dialog {
                p {
                    padding: 0 30px;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin: 10px 0;
                    label {
                        width: 100px;
                    }
                    .el-input {
                        width: 200px;
                    }
                }
            }
        }
    }
</style>

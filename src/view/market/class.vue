<template>
    <div class="marketClass">
        <ul>
            <li class="thead">
                <div>
                    <span>一级分类</span>
                    <el-tooltip class="item" effect="dark" content="新增一级分类" placement="top">
                        <i class="el-icon-circle-plus-outline" @click="addOneLevel"></i>
                    </el-tooltip>
                </div>
                <div>
                    <span>二级分类</span>
                </div>
            </li>
            <li v-for="item,index in treeData">
                <div class="ft999">
                    <p>
                        <span>{{item.label}}</span>
                        <el-tooltip effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit-outline" @click="editOneLevel(item)"></i>
                        </el-tooltip>

                        <el-tooltip effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete" @click="deleteOneLevel(item)"></i>
                        </el-tooltip>


                        <el-tooltip effect="dark" content="新增二级分类" placement="top">
                            <i class="el-icon-circle-plus-outline" @click="addTwoLevel(item,index)"></i>
                        </el-tooltip>
                    </p>
                </div>
                <div>
                    <p v-for="item,index in item.children" class="ft999">
                        <span>{{item.label}}</span>
                        <el-tooltip effect="dark" content="编辑" placement="top">
                            <i class="el-icon-edit-outline" @click="editTwoLevel(item)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top">
                            <i class="el-icon-delete" @click="deleteTwoLevel(item)"></i>
                        </el-tooltip>
                    </p>
                </div>
            </li>
        </ul>

        <div class="dialogDiv">
            <el-dialog
                :title="dialogTitle"
                :visible.sync="addDialog"
                width="360px">
                <p class="dialog-form" v-if="dialogTitle != '确认删除一级分类？'&&dialogTitle != '确认删除二级分类？'">
                    <label class="ftccc ft14">请输入分类名称</label>
                    <el-input v-model="className" maxLength="5" placeholder="最多5个字"></el-input>
                </p>
                <p slot="footer" class="dialog-footer">
                    <el-button round plain @click="addDialog = false">取 消</el-button>
                    <el-button round type="primary" :disabled="className.length>10" @click="sureOneAddDialog"
                               v-if="dialogTitle=='新增一级分类'">确 定
                    </el-button>
                    <el-button round type="primary" :disabled="className.length>10" @click="sureTwoAddDialog"
                               v-if="dialogTitle=='新增二级分类'">确 定
                    </el-button>
                    <el-button round type="primary" :disabled="className.length>10" @click="sureOneEditDialog"
                               v-if="dialogTitle=='编辑一级分类'">确 定
                    </el-button>
                    <el-button round type="primary" :disabled="className.length>10" @click="sureTwoEditDialog"
                               v-if="dialogTitle=='编辑二级分类'">确 定
                    </el-button>
                    <el-button round type="danger" @click="sureOneDeleteDialog"
                               v-if="dialogTitle=='确认删除一级分类？'">确 定
                    </el-button>
                    <el-button round type="danger" @click="sureTwoDeleteDialog"
                               v-if="dialogTitle=='确认删除二级分类？'">确 定
                    </el-button>
                </p>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "class",
        data() {
            return {
                addDialog: false,
                className: '',                      // 分类名称
                dialogTitle: '',                    // 弹框名称
                treeData: [],
                category_pid: '',                    // 二级分类的父级id
                category_id: '',                    // 二级分类的id
            }
        },
        mounted() {
            this.getClass()
        },
        methods: {
            getClass() {
                this.$post('MaterialCategory/tree', {})
                    .then(res => {
                        this.treeData = res
                    })
            },
            // 新增
            // 新增一级分类，显示一级分类弹框
            addOneLevel() {
                this.dialogTitle = '新增一级分类'
                this.addDialog = true
            },
            // 确认新增一级分类，关闭一级分类弹框
            sureOneAddDialog() {
                this.$post('MaterialCategory/add', {
                    category_name: this.className,
                    category_pid: '0'
                })
                    .then(res => {
                        this.$message.success('新增一级分类成功')
                        this.getClass()
                        this.addDialog = false
                    })
            },
            // 新增二级
            addTwoLevel(val, index) {
                this.dialogTitle = '新增二级分类'
                this.addDialog = true
                this.category_pid = val.value
            },
            // 确认新增二级分类，关闭二级分类弹框
            sureTwoAddDialog() {
                this.$post('MaterialCategory/add', {
                    category_name: this.className,
                    category_pid: this.category_pid
                })
                    .then(res => {
                        this.$message.success('新增二级分类成功')
                        this.getClass()
                        this.addDialog = false
                    })
            },

            // 编辑
            // 编辑一级分类
            editOneLevel(val) {
                this.dialogTitle = '编辑一级分类'
                this.className = val.label
                this.category_id = val.value
                this.addDialog = true
            },
            // 确认编辑一级分类
            sureOneEditDialog() {
                this.$post('MaterialCategory/edit', {
                    category_name: this.className,
                    category_pid: '0',
                    category_id: this.category_id
                })
                    .then(res => {
                        this.$message.success('编辑一级分类成功')
                        this.getClass()
                        this.addDialog = false
                    })
            },
            // 编辑二级分类
            editTwoLevel(val) {
                this.dialogTitle = '编辑二级分类'
                this.className = val.label
                this.category_pid = val.category_pid
                this.category_id = val.value
                this.addDialog = true
            },
            // 确认编辑二级分类
            sureTwoEditDialog() {
                this.$post('MaterialCategory/edit', {
                    category_name: this.className,
                    category_pid: this.category_pid,
                    category_id: this.category_id
                })
                    .then(res => {
                        this.$message.success('编辑二级分类成功')
                        this.getClass()
                        this.addDialog = false
                    })
            },

            // 删除
            // 删除一级分类
            deleteOneLevel(val) {
                this.dialogTitle = '确认删除一级分类？'
                this.category_id = val.value
                this.addDialog = true
            },
            // 确认删除一级分类
            sureOneDeleteDialog() {
                this.$post('MaterialCategory/del', {
                    category_id: this.category_id
                })
                    .then(res => {
                        this.$message.success('删除一级分类成功')
                        this.getClass()
                        this.addDialog = false
                    })
            },
            // 删除二级分类
            deleteTwoLevel(val) {
                this.dialogTitle = '确认删除二级分类？'
                this.category_id = val.value
                this.addDialog = true
            },
            // 确认删除二级分类
            sureTwoDeleteDialog() {
                this.$post('MaterialCategory/del', {
                    category_id: this.category_id
                })
                    .then(res => {
                        this.$message.success('删除二级分类成功')
                        this.getClass()
                        this.addDialog = false
                    })
            },


        },
        watch: {
            addDialog(val) {
                if (val == false) {
                    this.className = ''
                }
            },
            className(val) {
                if (val.length > 5) {
                    this.$message.error('最多5个字')
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .marketClass {
        padding: 80px 100px;
        ul {
            border: 1px solid #D9E0EF;
            li {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                border-bottom: 1px solid #F1F3F8;
                > div {
                    flex: 1;
                    padding-left: 50px;
                    p {
                        line-height: 50px;
                        i {
                            margin: 0 4px;
                        }
                    }
                }
            }
            .thead {
                height: 50px;
                background-color: #F0F3FA;
                border-bottom: 2px solid #D9E0EF;
            }
            .el-button, i {
                cursor: pointer;
            }
        }

        .dialogDiv {
            .el-dialog {
                .dialog-form {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    label {
                        margin-right: 10px;
                    }
                    .el-input {
                        width: 140px;
                    }
                }
                .dialog-footer {
                    text-align: center;
                }
            }
        }
    }
</style>

<template>
    <div class="goodsClass">
        <div class="addBtn">
            <el-button type="primary" @click="toAddClass">新增类目</el-button>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="switchTab">
            <el-tab-pane :label="item.platform_name" :name="item.platform_id" v-for="item,index in platformTypes"
                         :key="item.platform_id">
                <goods-class :tableInfo="tableData" @listenChangeSize="changeSize"
                             @listenChangePage="changePage" @listenShowDialog="showDialog"
                             @listenDelete="deleteGoods" @listenAgain="refreshGoods"></goods-class>
            </el-tab-pane>
        </el-tabs>
        <div class="dialogDiv">
            <el-dialog
                :title="typeTitle"
                :visible.sync="addClassDiolog"
                width="400px">
                <p>
                    <label>请填写类目名称</label>
                    <el-input v-model="className"></el-input>
                </p>
                <p>
                    <label>所属平台</label>
                    <el-select v-model="platformType">
                        <el-option
                            v-for="item,index in platformTypes"
                            :label="item.platform_name"
                            :key="item.platform_id"
                            :value="item.platform_id"></el-option>
                    </el-select>
                </p>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addClassDiolog = false">取 消</el-button>
                    <el-button type="primary" @click="sureAddClass">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import goodsClass from '../../components/modules/table/goodsClass'

    export default {
        name: "class",
        data() {
            return {
                activeName: '1',
                platformTypes: [],
                platformType: '1',
                tableData: {
                    list: [],
                    total: 0
                },
                page: 1,
                rows: 10,
                addClassDiolog: false,
                className: '',              // 新增类目名称
                typeTitle: '',              // 弹框title
                currentCatId: '',            // 当前cat_id
            }
        },
        mounted() {
            this.getPlatform()
            this.getCategory()
        },
        components: {goodsClass},
        methods: {

            switchTab(tab, event) {
                this.platformType = parseInt(tab.index) + 1
                this.getCategory()
            },
            // 平台列表
            getPlatform() {
                this.$post('Platform/list', {})
                    .then(res => {
                        this.platformTypes = res
                        console.log(this.platformTypes)
                    })
            },
            // 分类
            getCategory() {
                this.$post('GoodsCategory/list', {
                    platform_id: this.platformType || this.platformTypes[0].platform_id,
                    page: this.page,
                    rows: this.rows
                })
                    .then(res => {
                        this.tableData = res
                    })
            },
            // 子传父
            changeSize(val) {
                this.rows = val
                this.getCategory()
            },
            // 子传父
            changePage(val) {
                this.page = val
                this.getCategory()
            },
            // 子传父
            refreshGoods() {
                this.getCategory()
            },
            // 新增类目弹框
            // 去新增类目
            toAddClass() {
                this.platformType = ''
                this.typeTitle = '新增类目'
                this.addClassDiolog = true
            },
            // 显示编辑弹框
            showDialog(val) {
                this.typeTitle = '编辑类目'
                this.platformType = val.platform_id
                this.className = val.cat_name
                this.currentCatId = val.cat_id
                this.addClassDiolog = true
            },
            // 确认新增类目
            sureAddClass() {
                if (this.className==''|| this.platformType=='') {
                    this.$message.error('请填写必填项')
                } else {
                    if (this.currentCatId == '') {
                        this.$post('GoodsCategory/add', {
                            platform_id: this.platformType,
                            cat_name: this.className
                        })
                            .then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功',
                                    duration: 1200
                                })
                                this.getCategory()
                                this.addClassDiolog = false
                            })
                    } else {
                        this.$post('GoodsCategory/edit', {
                            platform_id: this.platformType,
                            cat_name: this.className,
                            cat_id: this.currentCatId
                        })
                            .then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '修改成功',
                                    duration: 1200
                                })
                                this.getCategory()
                                this.addClassDiolog = false

                            })
                    }
                }
            },
            // 删除商品类目
            deleteGoods(val) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$post('GoodsCategory/del', {
                        cat_id: val.row.cat_id
                    })
                        .then(res => {
                            this.tableData.list.splice(val.$index, 1)
                            this.$message({
                                type: 'success',
                                message: '删除成功',
                                duration: 1200
                            })
                            this.addClassDiolog = false

                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            }

        },
        watch: {
            addClassDiolog(val) {
                if (val == false) {
                    this.className = ''
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .goodsClass {
        position: relative;
        .addBtn {
            position: absolute;
            right: 40px;
            top: 4px;
            z-index: 9;
        }
        .dialogDiv {
            .el-dialog {
                p {
                    margin: 10px 0;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    label {
                        font-size: 12px;
                        color: #666;
                        margin-right: 20px;
                        width: 100px;
                        text-align: right;
                    }
                    .el-input, .el-select {
                        width: 200px;
                    }
                }
            }
        }
    }

</style>

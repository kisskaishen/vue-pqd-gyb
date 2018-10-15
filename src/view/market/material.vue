<template>
    <div class="marketMaterial">
        <div class="searchDiv">
            <el-row>
                <el-col style="width: auto">
                    <label>所属分类：</label>
                    <!--<el-select v-model="type1">-->
                    <!--<el-option-->
                    <!--v-for="item,index in types1"-->
                    <!--:key="item.category_id"-->
                    <!--:label="item.category_name"-->
                    <!--:value="item.category_id"></el-option>-->
                    <!--</el-select>-->
                    <!--<el-select v-model="type2">-->
                    <!--<el-option-->
                    <!--v-for="item,index in types2"-->
                    <!--:key="item.id"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value"></el-option>-->
                    <!--</el-select>-->
                    <el-cascader
                        :options="types"
                        v-model="type"
                        :show-all-levels="false">
                    </el-cascader>
                </el-col>
                <el-col style="width: auto">
                    <label>发布时间：</label>
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
                <el-col>
                    <label>发布状态：</label>
                    <el-select v-model="status">
                        <el-option
                            v-for="item,index in statuses"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row>
                <el-button type="primary" plain round @click="searchBtn">检索</el-button>
                <el-button type="primary" round @click="addMaterial">新增</el-button>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                header-align="center"
                style="width: 100%">
                <el-table-column prop="material_id" label="ID" width="100" align="center"></el-table-column>
                <el-table-column prop="material_name" label="素材名称" width="300" align="center"></el-table-column>
                <el-table-column prop="cat_path" label="所属分类" width="300" align="center"></el-table-column>
                <el-table-column prop="add_time_label" label="发布时间" width="300" align="center"></el-table-column>
                <el-table-column prop="status_label" label="发布状态" width="200" align="center"></el-table-column>
                <el-table-column prop="address" label="操作" width="200" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goDetail(scope)" v-if="scope.row.btn.edit">编辑</el-button>
                        <el-button type="text" @click="goDetailLook(scope)" v-if="scope.row.btn.view">查看</el-button>
                        <el-button type="text" @click="deleteBtn(scope)" v-if="scope.row.btn.del">删除</el-button>
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
        name: "material",
        data() {
            return {
                types: [],
                type: [],               // 分类
                timeRange: '',           // 发布时间
                timeRangeFormat: '',           // 发布时间
                statuses: [],
                status: '',              // 发布状态
                tableData: [],
                currentPage: 1,
                total: 0,
                rows: 10
            }
        },
        mounted() {
            this.getMaterialClass()
            this.getStatus()
            this.getMaterial()
        },
        methods: {
            // 素材分类
            getMaterialClass() {
                this.$post('MaterialCategory/tree', {})
                    .then(res => {
                        this.types = res
                    })
            },
            // 发布状态
            getStatus() {
                this.$post('Material/conf', {})
                    .then(res => {
                        this.statuses = res.status
                    })
            },
            // 素材列表
            getMaterial() {
                this.$post('Material/list', {
                    category_id: this.type[this.type.length - 1],
                    status: this.status,
                    add_time: this.timeRangeFormat,
                    page: this.currentPage,
                    rows: this.rows
                })
                    .then(res => {
                        this.total = res.total
                        this.tableData = res.list
                    })
            },

            // 时间
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 切换页面
            handleCurrentChange(val) {
                this.currentPage = val
                this.getMaterial()
            },
            // 每页显示条数
            handleSizeChange(val) {
                this.rows = val
                this.getMaterial()
            },
            // 编辑
            goDetail(val) {
                this.$router.push(`/market/editMaterial?material_id=${val.row.material_id}`)
            },
            // 查看
            goDetailLook(val) {
                this.$router.push(`/market/watchMaterial?material_id=${val.row.material_id}`)
            },
            // 删除
            deleteBtn(val) {
                this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$post('Material/del', {
                        material_id: val.row.material_id
                    })
                        .then(res => {
                            this.tableData.splice(val.$index, 1)
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getMaterial()
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 新增
            addMaterial() {
                this.$router.push('/market/addMaterial')
            },
            // 条件搜索
            searchBtn() {
                this.currentPage = 1
                this.getMaterial()
            }
        },
        watch:{
            $route(to,from) {
                if (to.fullPath == '/market/material') {
                    this.getMaterial()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .marketMaterial {
        padding: 80px 100px;
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
    }
</style>

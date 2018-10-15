<template>
    <div class="bannerIndex1">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>广告名称</label>
                    <el-input v-model="bannerName" placeholder="请输入广告名称"></el-input>
                </el-col>
                <el-col>
                    <label>广告位置</label>
                    <el-select v-model="bannerPage" placeholder="广告位置">
                        <el-option
                            v-for="item,index in bannerPages"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label style="opacity: 0">广告位置</label>
                    <el-button type="primary" round plain @click="searchBtn">检索</el-button>
                </el-col>
                <el-col>
                    <label style="opacity: 0">广告位置</label>
                    <el-button type="primary" round @click="addBanner">新增广告</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                fit
                header-align="center"
                style="width: 100%">
                <el-table-column prop="ad_id" label="广告ID" align="center" width="100"></el-table-column>
                <el-table-column prop="position_name" label="广告位置" align="center" width="200"></el-table-column>
                <el-table-column prop="ad_name" label="广告名称" align="center" width="200"></el-table-column>
                <el-table-column prop="img_src" label="广告图片" align="center" width="240">
                    <template slot-scope="scope">
                        <img :src="scope.row.img_src" alt="">
                    </template>
                </el-table-column>
                <el-table-column prop="ad_url" label="广告链接" align="center" width="200"></el-table-column>
                <el-table-column prop="is_show" label="是否显示" align="center" width="200">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.is_show=='1'"
                            @change="switchChange(scope)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="80"></el-table-column>
                <el-table-column prop="" label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editBtn(scope)" v-if="scope.row.btn.edit">编辑</el-button>
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
        <div class="dialogDiv">
            <el-dialog
                title="提示"
                :visible.sync="showDeleteDialog"
                width="30%">
                <span>确定删除此广告？</span>
                <p slot="footer" class="dialog-footer">
                    <el-button @click="showDeleteDialog = false">取 消</el-button>
                    <el-button type="primary" @click="sureDelete">确 定</el-button>
                </p>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: "index",
        data() {
            return {
                bannerName: '',          // 广告名称
                bannerPages: [],
                bannerPage: '',          // 广告位置
                tableData: [],
                rows: 10,
                currentPage: 1,
                total: 0,
                showDeleteDialog: false,        // 确认删除弹框
                ad_id: '',               // 被选中的id
            }
        },
        mounted() {
            this.getBannerConfig()
            this.getBanner()
        },
        methods: {
            getBannerConfig() {
                this.$post('Ad/conf', {})
                    .then(res => {
                        this.bannerPages = res.position
                    })
            },
            // 广告位列表
            getBanner() {
                this.$post('Ad/list', {
                    ad_name: this.bannerName,
                    position: this.bannerPage,
                    page: this.currentPage,
                    rows: this.rows,
                })
                    .then(res => {
                        this.tableData = res.list
                        this.total = res.total
                    })
            },
            // 切换
            switchChange(val) {
                let value = val.row.is_show == true ? '0' : '1'
                this.$post('Ad/changeField', {
                    ad_id: val.row.ad_id,
                    field: 'is_show',
                    value: value
                })
                    .then(res => {
                        this.$message.success('修改成功~')
                        this.getBanner()
                    })
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getBanner()
            },
            // 新增
            addBanner() {
                this.$router.push('/banner/addBanner')
            },
            // 编辑
            editBtn(val) {
                this.$router.push(`/banner/editBanner?ad_id=${val.row.ad_id}`)
            },
            // 删除
            deleteBtn(val) {
                this.ad_id = val.row.ad_id
                this.showDeleteDialog = true
            },
            // 确认删除
            sureDelete() {
                this.$post('Ad/del', {
                    ad_id: this.ad_id
                })
                    .then(res => {
                        this.getBanner()
                        this.showDeleteDialog = false
                    })
            },
            // 每页多少条
            handleSizeChange(val) {
                this.rows = val
                this.getBanner()
            },
            // 切换页面
            handleCurrentChange(val) {
                this.currentPage = val
                this.getBanner()
            },
        },
        watch: {
            $route(to, from) {
                this.getBanner()
            }
        }
    }
</script>
<style scoped lang="scss">
    .bannerIndex1 {
        padding: 80px 100px;
        .tableDiv {
            img {
                width: 200px;
                height: 100px;
                border: 1px solid #ccc;
            }
        }
    }
</style>

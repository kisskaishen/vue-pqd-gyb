<template>
    <div :class="isPadding=='dialog'?'dialogGoodsDiv':'goodsIndex'">
        <div class="searchDiv">
            <el-row>
                <el-col>
                    <label>平台分类</label>
                    <el-select v-model="platformType" placeholder="请选择平台分类">
                        <el-option
                            v-for="item,index in platformTypes"
                            :label="item.platform_name"
                            :key="item.platform_id"
                            :value="item.platform_id"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>商品ID</label>
                    <el-input v-model="goodsId" placeholder="请输入商品ID"></el-input>
                </el-col>
                <el-col>
                    <label>所属类目</label>
                    <el-select v-model="category" placeholder="所属类目">
                        <el-option
                            v-for="item,index in categoryes"
                            :label="item.cat_name"
                            :key="item.cat_id"
                            :value="item.cat_id"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>商品名称</label>
                    <el-input v-model="goodsName" placeholder="请输入商品名称"></el-input>
                </el-col>
            </el-row>

            <el-row>
                <el-col>
                    <label>是否上架</label>
                    <el-select v-model="isSale" placeholder="是否上架">
                        <el-option
                            v-for="item,index in isSales"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>是否推荐</label>
                    <el-select v-model="isRecommend" placeholder="是否推荐">
                        <el-option
                            v-for="item,index in isRecommends"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>是否有优惠券</label>
                    <el-select v-model="isCoupon" placeholder="是否有优惠券">
                        <el-option
                            v-for="item,index in isCoupons"
                            :label="item.label"
                            :key="item.value"
                            :value="item.value"></el-option>
                    </el-select>
                </el-col>
                <el-col>
                    <label>更新时间</label>
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
            <el-row :class="['tipsBtn', isPadding=='dialog'?'marginBottom':'']">
                <el-button type="primary" plain round @click="updateGoods" v-if="isPadding!='dialog'">同步商品数据</el-button>
                <el-button type="primary" round @click="searchBtn">检索</el-button>
            </el-row>
            <el-row class="tipsRow" v-if="isPadding!='dialog'">
                <p class="ft12 ft999">同步时间：{{upGoodsdate}}</p>
            </el-row>
        </div>
        <div class="tableDiv">
            <el-table
                :data="tableData"
                stripe
                header-align="center"
                highlight-current-row
                @current-change="currentRowChange"
                style="width: 100%">
                <el-table-column prop="goods_id" label="" fixed align="center" v-if="isPadding=='dialog'"
                                 width="55">
                    <template slot-scope="scope" v-if="singleGoodsId==scope.row.goods_id">
                        <i class="el-icon-check"></i>
                    </template>
                </el-table-column>
                <el-table-column prop="goods_id" label="ID" fixed align="center"></el-table-column>
                <el-table-column prop="goods_name" label="商品" align="center"></el-table-column>
                <el-table-column prop="cat_name" label="所属类目" align="center"></el-table-column>
                <el-table-column prop="platform_name" label="平台类型" align="center"></el-table-column>
                <el-table-column prop="goods_price" label="价格" align="center"></el-table-column>
                <el-table-column prop="coupon_discount" label="优惠券" align="center"></el-table-column>
                <el-table-column prop="commission" label="推广佣金" align="center"></el-table-column>
                <el-table-column prop="sales_count" v-if="isPadding!='dialog'" label="销量"
                                 align="center"></el-table-column>
                <el-table-column prop="last_update_label" label="最近更新时间" align="center"></el-table-column>
                <el-table-column prop="is_on_sale" label="是否上架" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.is_on_sale=='1'"
                            @change="switchSaleChange(scope)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="is_recommend" label="是否推荐" align="center">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.is_recommend=='1'"
                            @change="switchRecommendChange(scope)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" v-if="isPadding!='dialog'" align="center">
                    <template slot-scope="scope" v-if="scope.row.is_recommend == '1'">
                        <p class="ft409EFF" @click.stop="topClick(scope)">置顶</p>
                        <p class="ft67c23a" @click.stop="upClick(scope)">上移</p>
                        <p class="fte6a23c" @click.stop="downClick(scope)">下移</p>
                        <p class="ftf56c6c" @click.stop="bottomClick(scope)">置底</p>
                    </template>
                </el-table-column>
                <el-table-column prop="member_commission" v-if="isPadding!='dialog'" label="会员佣金比率" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.member_commission_price}}</span>
                        <span>({{scope.row.member_commission+'%'}})</span>
                    </template>
                </el-table-column>
                <el-table-column prop="director_commission" v-if="isPadding!='dialog'" label="运营总监佣金比率"
                                 align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.director_commission_price}}</span>
                        <span>({{scope.row.director_commission+'%'}})</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" v-if="isPadding!='dialog'" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="openSetting(scope)">佣金设置</el-button>
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
                title="设置推广佣金"
                :visible.sync="openSettingDialog"
                width="540px">
                <p>
                    <label>推广佣金</label>
                    <span>{{tuiguangMoney}}</span>
                </p>
                <p>
                    <label>会员佣金比例</label>
                    <el-input v-model="memberMoney"></el-input>
                    <i>%</i>
                    <span>获得佣金 {{getMemberMoney}}元</span>
                </p>
                <p>
                    <label>运营总监佣金比例</label>
                    <el-input v-model="managerMoney"></el-input>
                    <i>%</i>
                    <span>获得佣金 {{getManagerMoney}}元</span>
                </p>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="openSettingDialog = false">取 消</el-button>
                    <el-button type="primary" @click="sureSetting">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['fromPage'],
        name: "goodsIndex",
        data() {
            return {
                platformTypes: [],
                platformType: '1',        // 平台分类
                goodsId: '',                 // 商品id
                categoryes: [],
                category: '',                // 所属类目
                goodsName: '',               // 商品名称
                isSales: [],
                isSale: '',                  // 是否上架
                isRecommends: [],
                isRecommend: '',                  // 是否推荐
                isCoupons: [],
                isCoupon: '',                    // 是否有优惠券
                timeRange: '',                   // 更新时间
                timeRangeFormat: '',                   // 更新时间
                tableData: [],                   // 商品列表
                upGoodsdate: '',                 // 同步时间

                rows: 10,
                currentPage: 1,                 // 当前页数
                total: 0,                       // 总数据

                openSettingDialog: false,          // 佣金弹框
                tuiguangMoney: '',                   // 推广佣金
                memberMoney: '',                    // 会员佣金
                getMemberMoney: '',                    // 获取到会员佣金
                managerMoney: '',                    // 总监佣金
                getManagerMoney: '',                    // 获取到总监佣金
                currentGoodsId: '',                  // 当前goodsId
                singleGoodsId: '',                  // 当前goodsId
            }
        },
        mounted() {
            this.getPlatform()
            this.getCategory()
            this.getConfig()
            this.getGoodsList()
        },
        computed: {
            isPadding() {
                return this.fromPage
            }
        },
        methods: {
            updateDate(val) {
                this.timeRangeFormat = val.join('/')
            },
            // 平台列表
            getPlatform() {
                this.$post('Platform/list', {})
                    .then(res => {
                        this.platformTypes = res
                    })
            },
            // 所属类目
            getCategory() {
                this.$post('GoodsCategory/list', {
                    platform_id: this.platformType
                })
                    .then(res => {
                        this.categoryes = res.list
                    })
            },
            // 商品配置---是否
            getConfig() {
                this.$post('Goods/conf', {})
                    .then(res => {
                        this.isSales = res.is_on_sale
                        this.isRecommends = res.is_recommend
                        this.isCoupons = res.is_coupon
                    })
            },
            // 列表信息
            getGoodsList() {
                this.$post('Goods/list', {
                    platform_id: this.platformType,
                    goods_id: this.goodsId,
                    cat_id: this.category,
                    goods_name: this.goodsName,
                    is_on_sale: this.isSale,
                    is_recommend: this.isRecommend,
                    is_coupon: this.isCoupon,
                    last_update: this.timeRangeFormat,
                    page: this.currentPage,
                    rows: this.rows,
                })
                    .then(res => {
                        this.total = res.total
                        this.tableData = res.list
                        this.upGoodsdate = res.last_update
                    })
            },
            // 修改每页显示条数
            handleSizeChange(val) {
                this.rows = val
                this.getGoodsList()
            },
            // 切换当前页
            handleCurrentChange(val) {
                this.currentPage = val
                this.getGoodsList()
            },
            // 选中当前行
            currentRowChange(val) {
                this.singleGoodsId = val.goods_id
                this.$emit('listenCheckGoods', val)
            },
            // 同步商品数据
            updateGoods() {
                this.$post('Goods/syncGoods', {
                    platform_id: this.platformType
                })
                    .then(res => {
                        this.$message.success('同步成功~')
                    })
            },
            // 是否上架
            switchSaleChange(val) {
                let value = val.row.is_on_sale == '1' ? '0' : '1'
                this.$post('Goods/changeField', {
                    goods_id: val.row.goods_id,
                    field: 'is_on_sale',
                    value: value
                })
                    .then(res => {
                        this.$message.success('修改成功~')
                        setTimeout(()=>{
                            this.getGoodsList()
                        },200)
                    })
            },
            // 是否推荐
            switchRecommendChange(val) {
                let value = val.row.is_recommend == '1' ? '0' : '1'
                this.$post('Goods/changeField', {
                    goods_id: val.row.goods_id,
                    field: 'is_recommend',
                    value: value
                })
                    .then(res => {
                        this.$message.success('修改成功~')
                        setTimeout(()=>{
                            this.getGoodsList()
                        },200)
                    })
            },

            // 置顶
            topClick(val) {
                this.sortChange(val.row.goods_id,'top')
            },
            // 上移
            upClick(val) {
                this.sortChange(val.row.goods_id,'up')
            },
            // 下移
            downClick(val) {
                this.sortChange(val.row.goods_id,'down')
            },
            // 置底
            bottomClick(val) {
                this.sortChange(val.row.goods_id,'bottom')
            },
            sortChange(goodsid,where) {
                this.$post('Goods/goodsResort',{
                    goods_id:goodsid,
                    platform_id:this.platformType,
                    sort_type:where
                })
                    .then(res=>{
                        this.$message.success('操作成功~')
                        this.getGoodsList()
                    })
            },
            // 检索
            searchBtn() {
                this.currentPage = 1
                this.getGoodsList()
            },
            // 打开佣金设置弹框
            openSetting(val) {
                this.currentGoodsId = val.row.goods_id
                this.tuiguangMoney = val.row.commission
                this.memberMoney = val.row.member_commission
                this.getMemberMoney = val.row.member_commission_price
                this.managerMoney = val.row.director_commission
                this.getManagerMoney = val.row.director_commission_price
                this.openSettingDialog = true
            },
            // 确认修改佣金
            sureSetting() {
                this.$post('Goods/setCommission', {
                    goods_id: this.currentGoodsId,
                    member_commission: this.memberMoney,
                    director_commission: this.managerMoney
                })
                    .then(res => {
                        this.$message.success('修改成功')
                        this.getGoodsList()
                        this.openSettingDialog = false
                    })


            }
        }
    }
</script>

<style scoped lang="scss">
    .goodsIndex {
        padding: 80px 100px;
        p {
            cursor: pointer;
        }
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
        .dialogDiv {
            .el-dialog {
                p {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin: 10px 0;
                    label {
                        width: 120px;
                        text-align: right;
                        margin-right: 20px;
                    }
                    .el-input {
                        width: 200px;
                    }
                    span {
                        display: block;
                        text-align: left;
                        margin-left: 20px;
                    }
                }
            }
        }
    }

    .dialogGoodsDiv {
        padding: 20px 40px;
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
        .marginBottom {
            margin-bottom: 20px;
        }
    }
</style>

<template>
    <div class="addMaterial">
        <div class="metarialDiv">
            <label class="ft12 ft333">素材名称：</label>
            <el-input v-model="materialName" disabled maxLength="10" placeholder="请输入素材名称"></el-input>
            <span class="ft12 ftccc">（10个字以内）</span>
        </div>
        <div class="metarialDiv">
            <label class="ft12 ft333">所属分类：</label>
            <el-cascader
                :options="types"
                v-model="type"
                clearable
                disabled>
            </el-cascader>
        </div>

        <div class="metarialDiv">
            <label class="ft12 ft333">是否关联商品：</label>
            <el-radio-group v-model="isConnect" disabled>
                <el-radio label="0">否</el-radio>
                <el-radio label="1">是</el-radio>
            </el-radio-group>
            <el-button type="primary" size="mini" v-if="isConnect=='1'&&goodsName==''" @click="showDialog">选择商品
            </el-button>
            <span v-if="isConnect=='1'&&goodsName!=''" class="ft12 ft666">商品名称：{{goodsName}}</span>
            <el-button type="text" v-if="isConnect=='1'&&goodsName!=''" @click="showDialog">修改
            </el-button>
        </div>
        <div class="metarialDiv">
            <label class="ft12 ft333">素材文案：</label>
            <div>
                <vue-editor @listenEditor="getEditor" :datatext="editorData"></vue-editor>
            </div>
        </div>
        <div class="metarialDiv">
            <label class="ft12 ft333">上传图片：</label>
            <div class="imgList">
                <img :src="item" alt="" v-for="item,index in imgArr">
            </div>
        </div>
        <div class="metarialDiv">
            <label class="ft12 ft333">发布者：</label>
            <div>
                <img :src="publishPeopleUrl" alt="" width="148" height="148"
                     style="display: block;border:1px solid #ccc">
                <span>{{publishPeopleName}}</span>
            </div>
        </div>
        <div class="metarialDiv">
            <label class="ft12 ft333">发布：</label>
            <div class="imgList">
                <el-radio-group v-model="publishType" disabled>
                    <el-radio label="1">实时发布</el-radio>
                    <el-radio label="2">定时发布</el-radio>
                </el-radio-group>
                <el-date-picker
                    v-if="publishType=='2'"
                    v-model="publishTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                </el-date-picker>
            </div>
        </div>

        <div class="dialogDiv">
            <el-dialog title="商品列表" width="80%" :visible.sync="goodsDialog">
                <goods-list :fromPage="pageFrom" @listenCheckGoods="getCheckGoods"></goods-list>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="goodsDialog = false">取 消</el-button>
                    <el-button type="primary" @click="sureGoodsDialog">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import vueEditor from '../../components/page/VueEditor'
    import goodsList from '../goods/index'

    export default {
        name: "addMaterial",
        data() {
            return {
                pageFrom: 'dialog',
                materialName: '',        // 素材名称
                types: [],
                type: [],                   // 分类id
                type0: '',                   // 分类id0
                type1: '',                   // 分类id1
                isConnect: '0',          // 是否关联商品

                editorData: '',          // 富文本信息

                publishType: '1',         // 发布类型
                publishTime: '',         // 发布时间

                goodsId: '',         // 关联时的商品id
                goodsName: '',         // 关联时的商品名称

                imgObj: {type: 'platformIcon'},          // 上传图片需要的参数
                imageUrl: '',            // 上传的图片
                imgArr: [],                  // 图片的数组
                imgArrFormat: [],                  // 图片的数组
                // imgArrFormat: [{name: '', url: ''}],                  // 图片的数组
                // imgArrFormat: this.$route.query.material_id ? [{name: '', url: ''}] : [],                  // 图片的数组
                imgDialog: false,           // 显示上传图片的弹框
                publishPeopleUrl: '',            // 发布人头像
                publishPeopleName: '',           // 发布人姓名
                publishPeopleId: '',           // 发布人id

                goodsDialog: false,             // 显示商品的弹框

            }
        },
        components: {
            vueEditor,
            goodsList
        },
        mounted() {
            this.getMaterialClass()

            if (this.$route.query.material_id) {
                this.getDetail()
            }
            this.getMaterialPeople()
        },
        methods: {
            getDetail() {
                this.$post('Material/detail', {
                    material_id: this.$route.query.material_id
                })
                    .then(res => {
                        this.materialName = res.material_name
                        this.type1 = res.category_id
                        for (let i = 0; i < this.types.length; i++) {
                            if (this.types[i].children) {
                                for (let j = 0; j < this.types[i].children.length; j++) {
                                    if (this.types[i].children[j].value == res.category_id) {
                                        this.type0 = this.types[i].value
                                        this.type = [this.type0, this.type1]
                                    }
                                }
                            }
                        }
                        setTimeout(() => {
                            this.type = [this.type0, this.type1]
                        }, 300)
                        this.isConnect = res.is_relation_goods
                        this.goodsId = res.is_relation_goods == '1' ? res.goods_id : ''
                        this.goodsName = res.is_relation_goods == '1' ? res.goods_name : ''

                        this.editorData = res.material_copywriting

                        this.imgArr = res.image_list
                        for (let i = 0; i < this.imgArr.length; i++) {
                            this.imgArrFormat.push({name: i + 1, url: this.imgArr[i]})
                        }


                        this.publishType = res.status
                        this.publishTime = res.status == '2' ? res.add_time_label : ''

                    })
            },
            // 素材分类
            getMaterialClass() {
                this.$post('MaterialCategory/tree', {})
                    .then(res => {
                        this.types = res
                    })
            },
            // 显示商品弹框
            showDialog() {
                this.goodsDialog = true
            },
            // 选择商品
            getCheckGoods(val) {
                console.log(val)
                this.goodsId = val.goods_id
                this.goodsName = val.goods_name
            },
            // 点击确定按钮
            sureGoodsDialog() {
                this.goodsDialog = false
            },
            // 获取富文本信息
            getEditor(val) {
                this.editorData = val
            },
            // 上传前事件
            beforeUpload(file) {
                let self = this
                const isJPG = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
                const isLt1M = file.size / 1024 < 1024;
                if (!isJPG) {
                    self.$message.error('上传图片只能是 PNG/JPG/JPEG 格式!');
                }
                if (!isLt1M) {
                    self.$message.error('上传图片大小不能超过 1M!');
                }
                const isSize = new Promise(function (resolve, reject) {
                    let _URL = window.URL || window.webkitURL;
                    let img = new Image();
                    img.onload = function () {
                        let valid = img.width == 600 && img.height == 600;
                        valid ? resolve() : reject();
                    }
                    img.src = _URL.createObjectURL(file);
                }).then((res) => {
                    return file;
                }, () => {
                    self.$message({
                        type: 'error',
                        message: '上传图片大小必须是600*600!'
                    })
                    return Promise.reject();
                });
                return isJPG && isLt1M && isSize;
            },
            // 上传成功
            uploadSuccess(res, file) {
                this.imgArr.push(res.data)
            },
            // 移除事件
            handleRemove(file, fileList) {
                this.imgArr = []
                for (let i = 0; i < fileList.length; i++) {
                    this.imgArr.push(fileList[i].response.data)
                }
            },
            //
            handlePictureCardPreview(file) {
                console.log(file)
                this.imageUrl = file.url;
                this.imgDialog = true;
            },
            // 发布人
            getMaterialPeople() {
                this.$post('Material/publisherList', {})
                    .then(res => {
                        this.publishPeopleUrl = res.list[0].head_img
                        this.publishPeopleName = res.list[0].publisher_name
                        this.publishPeopleId = res.list[0].publisher_id
                    })
            },
            // 确定添加
            addMaterial() {
                this.$post('Material/edit', {
                    material_id: this.$route.query.material_id,
                    image_list: this.imgArr,
                    material_name: this.materialName,
                    category_id: this.type[this.type.length - 1],
                    is_relation_goods: this.isConnect,
                    goods_id: this.isConnect == '0' ? '' : this.goodsId,

                    material_copywriting: this.editorData,

                    publisher_id: this.publishPeopleId,
                    status: this.publishType,
                    add_time: this.publishType == '1' ? '' : this.publishTime,
                })
                    .then(res => {
                        this.$message.success(this.$route.query.material_id ? '编辑成功' : '添加成功')
                    })
            }
        },
        watch:{
            $route(to, from) {
                if (this.$route.query.material_id) {
                    this.getDetail()
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .addMaterial {
        padding: 80px 100px;
        .metarialDiv {
            .el-input {
                width: 400px;
            }
            .el-button {
                width: 200px;
            }
            margin-bottom: 34px;
            > label {
                display: block;
                line-height: 12px;
                margin-bottom: 14px;
            }
            .el-radio-group {
                margin-right: 40px;
            }
            .imgList {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .tipsDiv {
                    margin-left: 20px;
                    p {
                        line-height: 20px;
                    }
                }
                img {
                    width: 150px;
                    height: 150px;
                    border: 1px solid #ccc;
                }
            }

        }
        .pageDiv {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 0;
        }
    }
</style>

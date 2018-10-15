<template>
    <div class="addBanner">
        <div class="lineDiv">
            <p>
                <label>广告名称：</label>
                <el-input v-model="bannerName" maxlength="10" placeholder="请输入广告名称（最多10个字）"></el-input>
            </p>
        </div>
        <div class="lineDiv">
            <p>
                <label>广告类型：</label>
                <el-select v-model="bannerType" placeholder="请选择广告类型">
                    <el-option
                        v-for="item,index in bannerTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </p>
            <p>
                <label>广告位置：</label>
                <el-select v-model="bannerPage" placeholder="请选择广告位置">
                    <el-option
                        v-for="item,index in bannerPages"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </p>
        </div>
        <div class="lineDiv">
            <p>
                <label>广告链接：</label>
                <el-input v-model="bannerLink" placeholder="请输入广告链接"></el-input>
            </p>
        </div>
        <div class="lineDiv">
            <p>
                <label>链接类型：</label>
                <el-select v-model="linkType" placeholder="请选择链接类型">
                    <el-option
                        v-for="item,index in linkTypes"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </p>
        </div>
        <div class="lineDiv">
            <p>
                <label>广告图片：</label>
                <el-upload
                    :style="{width:imgWidth+'px',height:imgHeight+'px'}"
                    :action="this.$baseUrl+'Upload/index'"
                    :show-file-list="false"
                    :data="imgObj"
                    :on-success="successUpload"
                    :before-upload="beforeUpload">
                    <img v-if="bannerUrl" :src="bannerUrl" :width="imgWidth" :height="imgHeight">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
            <p class="imgTips">
                <span>广告图片要求明细：</span>
                <span>a.尺寸为{{imgWidth*2}}*{{imgHeight*2}}</span>
                <span>b.大小为300K以内</span>
                <span>c.图片背景为纯白底，商品图案居中显示</span>
                <span>d.图片可以添加品牌相关文字或logo</span>
            </p>
        </div>
        <div class="lineDiv">
            <p>
                <label>背景颜色：</label>
                <el-color-picker v-model="bgColor"></el-color-picker>
            </p>
        </div>
        <div class="lineDiv">
            <p>
                <label>默认排序：</label>
                <el-input v-model="sort" placeholder="请设置排序"></el-input>
            </p>
        </div>

        <div class="lineDiv">
            <el-button type="primary" round @click="addBanner">确认</el-button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "addBanner",
        data() {
            return {
                bannerName: '',          // 广告名称
                bannerTypes: [],
                bannerType: '',         // 广告类型
                bannerPages: [],
                bannerPage: 2,         // 广告位置
                bannerLink: '',         // 广告链接
                linkTypes: [],
                linkType: '',           // 链接类型

                imgObj: {type: 'adIndexBannerImg',token:this.$getCookie('token')},              // 上传图片类型
                bannerUrl: '',               // banner图片的url

                bgColor: '',             // 背景颜色

                sorts: [],
                sort: '',               // 排序

                imgWidth: 375,             // 图片宽
                imgHeight: 228,            // 图片高

            }
        },
        mounted() {
            this.getBannerConfig()
            this.getDetail()
        },
        methods: {
            // 获取banner配置项
            getBannerConfig() {
                this.$post('Ad/conf', {})
                    .then(res => {
                        this.bannerTypes = res.media_type
                        this.linkTypes = res.link_type
                        this.bannerPages = res.position
                    })
            },
            // 广告详情
            getDetail() {
                this.$post('Ad/detail', {
                    ad_id: this.$route.query.ad_id
                })
                    .then(res => {
                        this.bannerName = res.ad_name
                        this.bannerType = parseInt(res.media_type)
                        this.bannerPage = parseInt(res.position)
                        this.bannerLink = res.ad_url
                        this.linkType = parseInt(res.link_type)
                        this.bannerUrl = res.img_src
                        this.bgColor = res.bgcolor
                        this.sort = parseInt(res.sort)
                    })
            },
            // 上传图片
            beforeUpload(file) {
                let self = this
                const isJPG = file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg';
                const isLt300K = file.size / 1024 < 300;
                if (!isJPG) {
                    self.$message.error('上传banner只能是 PNG/JPG/JPEG 格式!');
                }
                if (!isLt300K) {
                    self.$message.error('上传banner大小不能超过 300KB!');
                }
                const isSize = new Promise(function (resolve, reject) {
                    let _URL = window.URL || window.webkitURL;
                    let img = new Image();
                    img.onload = function () {
                        let valid = img.width == self.imgWidth * 2 && img.height == self.imgHeight * 2;
                        valid ? resolve() : reject();
                    }
                    img.src = _URL.createObjectURL(file);
                }).then((res) => {
                    return file;
                }, () => {
                    self.$message({
                        type: 'error',
                        message: '上传banner大小必须是' + self.imgWidth * 2 + '*' + self.imgHeight * 2 + '!'
                    })
                    return Promise.reject();
                });
                return isJPG && isLt300K && isSize;
            },
            successUpload(res, file) {
                if (res.code == '200') {
                    this.bannerUrl = res.data
                } else {
                    this.$message.error(res.msg)
                }
            },
            // 确认
            addBanner() {
                this.$post('Ad/edit', {
                    ad_id: this.$route.query.ad_id,
                    ad_name: this.bannerName,
                    media_type: this.bannerType,
                    position: this.bannerPage,
                    ad_url: this.bannerLink,
                    link_type: this.linkType,
                    img_src: this.bannerUrl,
                    bgcolor: this.bgColor,
                    sort: this.sort
                })
                    .then(res => {
                        this.$message.success('修改成功~')
                        setTimeout(()=>{
                            this.$router.push('/banner/index')
                        })
                    })
            }
        },
        watch: {
            bannerPage(val) {
                switch (val) {
                    case 1:
                        this.imgWidth = 375
                        this.imgHeight = 110
                        this.imgObj.type = 'adIndexImg'
                        break;
                    case 2:
                        this.imgWidth = 375
                        this.imgHeight = 228
                        this.imgObj.type = 'adIndexBannerImg'
                        break;
                    case 3:
                        this.imgWidth = 375
                        this.imgHeight = 151
                        this.imgObj.type = 'adPaymentBannerImg'
                        break;
                    case 4:
                        this.imgWidth = 349
                        this.imgHeight = 140
                        this.imgObj.type = 'adAiTuiBannerImg'
                        break;
                    case 5:
                        this.imgWidth = 375
                        this.imgHeight = 666
                        this.imgObj.type = 'adInviterPoster'
                        break;
                }
            },
            $route(to, from) {
                if (this.$route.query.ad_id) {
                    document.title = '编辑广告'
                    this.getDetail()
                }
            }
        }
    }
</script>
<style lang="scss">
    .el-upload {
        position: relative;
        width: inherit;
        height: inherit;
        i {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
        }
    }

    .el-color-picker {
        .el-color-picker__trigger {
            width: 40px;
            height: 40px;
        }
    }
</style>
<style scoped lang="scss">
    .addBanner {
        padding: 80px 100px;
        .lineDiv {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 36px;
            p {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                label {
                    color: #333;
                    font-size: 12px;
                    margin-bottom: 14px;
                }
                .el-select {
                    width: 200px;
                    margin-right: 20px;
                }
                .el-input {
                    width: 400px;
                }

            }
            .imgTips {
                margin-left: 20px;
                padding-top: 26px;
                span {
                    line-height: 22px;
                    color: #999;
                    font-size: 12px;
                }
            }
            .el-button {
                width: 120px;
            }
        }
    }
</style>

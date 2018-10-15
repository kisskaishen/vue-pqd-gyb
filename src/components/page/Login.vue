<template>
    <div class="login-wrap">
        <v-canvas></v-canvas>
        <div class="ms-title">高拥宝后台</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入账号"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
                </el-form-item>
                <el-form-item prop="capatch" class="three">
                    <el-input placeholder="请输入验证码" v-model="ruleForm.capatch"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                    <img :src="capatchImg" alt="验证码" @click="refreshCaptcha">
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
    import vCanvas from '../common/loginCanvas'
    import guid from '../../config/guid'

    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: '',
                    capatch: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    capatch: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                },
                capatchImg: '',
                guid: ''
            }
        },
        components: {vCanvas},
        mounted() {
            this.guid = guid()
            this.$setCookie('guid', this.guid)
            this.capatchImg = this.$baseUrl + 'Passport/capatch?guid=' + this.guid
        },
        methods: {
            // 获取验证码
            refreshCaptcha() {
                this.guid = guid()
                this.$setCookie('guid',this.guid)
                this.capatchImg = this.$baseUrl + 'Passport/capatch?guid=' + this.guid
            },
            // 登陆接口
            login() {
                this.$post('passport/login', {
                    username: this.ruleForm.username,
                    password: this.ruleForm.password,
                    capatch: this.ruleForm.capatch,
                    guid: this.$getCookie('guid')
                })
                    .then(res => {
                        this.$setCookie('token', res.token);
                        this.$setCookie('username', this.ruleForm.username);
                        this.$message.success('登陆成功~')
                        this.$router.push('/index');
                    })
            },
            // 登录
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.login()
                    } else {
                        this.$message.error('请输入登录信息！')
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        .ms-title {
            position: absolute;
            top: 50%;
            width: 100%;
            margin-top: -230px;
            text-align: center;
            font-size: 30px;
            color: #fff;

        }

        .ms-login {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 300px;
            height: 200px;
            margin: -160px 0 0 -190px;
            padding: 40px;
            border-radius: 5px;
            background: #fff;
            .el-form {
                .el-form-item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .el-input {
                        width: 300px;
                    }
                }
                .three {
                    .el-input {
                        width: 180px;
                        margin-right: 16px;
                    }
                    img {
                        width: 100px;
                        vertical-align: middle;
                    }
                }
            }
        }
        .login-btn {
            text-align: center;
            button {
                width: 100%;
                height: 36px;
            }
        }
    }


</style>

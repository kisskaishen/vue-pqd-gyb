<template>
    <div class="editorDiv">
        <!--<div class="plugins-tips">-->
        <!--Vue-Quill-Editor：基于Quill、适用于Vue2的富文本编辑器。-->
        <!--访问地址：<a href="https://github.com/surmon-china/vue-quill-editor" target="_blank">vue-quill-editor</a>-->
        <!--</div>-->
        <!--<quill-editor ref="myTextEditor" v-model="content" :options="editorOption"-->
                      <!--@change="onEditorChange"></quill-editor>-->
        <el-input type="textarea" v-model="content" :rows="5" @change="onEditorChange" placeholder="请输入教材文案" maxlength="500"></el-input>
        <span class="ft14 ft999">{{content.length}}/500</span>
        <!--<el-button class="editor-btn" type="primary" @click="submit">提交</el-button>-->
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';

    export default {
        props: ['datatext'],
        name: 'editor',
        data: function () {
            return {
                content: '',

            }
        },
        components: {
            quillEditor
        },
        mounted() {
            setTimeout(() => {
                this.content = this.datatext
            }, 200)
        },
        methods: {
            onEditorChange(val) {
                this.content = val;
                this.$emit('listenEditor', val)
            },
            submit() {
                this.$message.success('提交成功！');
            },
        },
        watch: {
            content(val) {
                this.content = val
                if (val.length>=500) {
                    this.$message.error('素材内容最多500字,超过的将不会显示！')
                }
            }
        }
    }
</script>
<style scoped lang="scss">
    .editorDiv{
        position: relative;
        span {
            position: absolute;
            right: 20px;
            bottom: 10px;
        }
    }
</style>

<template>
    <div class="content">
        <div class="left">
            <div class="text-box">
                <img src="../../imgs/gyb/text.png" alt="">
            </div>
            <div class="btn-box">
                <img class="logo" src="../../imgs/gyb/logo.png" alt="">
                <div class="ios-btn"></div>
                <a target="_blank" href="https://mobile.baidu.com/item?docid=24827201&source=pc">
                    <div class="android-btn" @mouseover="android_mouseover" @mouseout="android_mouseout"></div>
                </a>
                <div class="android_hover_warp" v-show="is_show_android">
                    <img src="../../imgs/download/android.jpg">
                </div>
            </div>
        </div>
        <div class="right">
            <div class="l">
                <img src="../../imgs/gyb/l.png" alt="">
            </div>
            <div class="r">
                <img src="../../imgs/gyb/r.png" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "gybDownload",
        data(){
            return {
                is_show_android:false
            }
        },
        methods:{
            android_mouseover(){
                this.is_show_android = true;
            },
            android_mouseout(){
                this.is_show_android = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    * {
        margin: 0;
        padding: 0;
    }

    html,
    body {
        width: 100%;
        height: 100%;
        min-width: 1366px;
        min-height: 700px;
        /* height: 100vh; */
    }

    .content {
        min-width: 1366px;
        background-color: #56A1F5;
        background: linear-gradient(-45deg, rgba(86, 161, 245, 1), rgba(142, 204, 240, 1));

        overflow: hidden;
    }

    .content .left {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        padding-left: 150px;
    }

    .text-box {
        width: 584px;
    }

    .text-box img {
        width: 100%;
    }

    .btn-box {
        margin-top: 77px;
        position:relative;
    }

    .btn-box .logo {
        width: 117px;
    }

    .ios-btn,
    .android-btn {
        display: inline-block;
        width: 197px;
        height: 53px;
        cursor: pointer;
        transition: all 1s;
    }

    .ios-btn {
        margin-left: 31px;
        margin-right: 18px;
        background: url('../../imgs/gyb/ios.png') no-repeat;
    }

    .ios-btn:hover {
        background: url('../../imgs/gyb/ios-active.png') no-repeat;
    }

    .android-btn {
        background: url('../../imgs/gyb/android.png') no-repeat;
    }

    .android-btn:hover {
        background: url('../../imgs/gyb/android-active.png') no-repeat;
    }
    .android_hover_warp{
        position:absolute;
        top:-256px;
        left:342px;
        animation: myfirst 1s;
        -moz-animation: myfirst 1s; /* Firefox */
        -webkit-animation: myfirst 1s;  /* Safari 和 Chrome */
        -o-animation: myfirst 1s;   /* Opera */
    }
    @keyframes myfirst
    {
        0%   {left: 0;}
        100% {left: 342px;}
    }
    @-moz-keyframes myfirst /* Firefox */
    {
        0%   {left: 0;}
        100% {left: 342px;}
    }
    @-webkit-keyframes myfirst /* Safari 和 Chrome */
    {
        0%   {left: 0;}
        100% {left: 342px;}
    }
   @-o-keyframes myfirst /* Opera */
    {
        0%   {left: 0;}
        100% {left: 342px;}
    }
    .content .right {
        position: relative;
        float: right;
        width: 50%;
        /* width: calc(100% - 659px); */
        width: calc(100% - 734px);
        min-width: 600px;
        height: 100vh;
    }

    .content .right .l {
        position: absolute;
        left: 20%;
        top: 50%;
        transform: translateY(-25%);
        width: 50%;
        min-width: 344px;
        z-index: 100;
        animation: left 20s ease;
    }

    .content .right .l img {
        width: 100%;
    }

    .content .right .r {
        position: absolute;
        top: 50%;
        right: 5%;
        transform: translateY(-60%);
        width: 50%;
        min-width: 323px;
        animation: right 20s ease;
    }

    .content .right .r img {
        width: 100%;
    }

    @keyframes left {
        0% {
            transform: translateY(-15%);
        }

        100% {
            transform: translateY(-25%);
        }
    }

    @keyframes right {
        0% {
            transform: translateY(-65%);
        }

        100% {
            transform: translateY(-60%);
        }
    }
</style>

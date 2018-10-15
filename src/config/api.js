import vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import {setCookie, getCookie, clearCookie} from './util'
import outLogin from './outLogin'

axios.defaults.timeout = 5000;                        //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; 		// 请求头
// console.log(process.env.NODE_ENV)
let currentUrl = window.location.hostname
if (currentUrl == 'gmygladmin.pinquduo.top') {           // 开发环境
    axios.defaults.baseURL = 'http://gadminapi.pinquduo.top/'			// 开发公共接口
} else if (currentUrl == 'gmygladmintest.pinquduo.cn') {
    axios.defaults.baseURL = 'https://gadminapitest.pinquduo.cn/'			// 测试公共接口
} else if (currentUrl == 'gmygladmin.pinquduo.cn') {
    axios.defaults.baseURL = 'https://gadminapi.pqdshop.com/'			// 正式公共接口
} else if (currentUrl == 'localhost' || currentUrl == '127.0.0.1' || currentUrl == '192.168.1.170') {
    axios.defaults.baseURL = 'http://gadminapi.pinquduo.top/'			// 开发公共接口
}


// 请求拦截器
axios.interceptors.request.use((config) => {
        return config
    }, (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
axios.interceptors.response.use((response) => {
        return response
    }, (error) => {
        return Promise.reject(error)
    }
)

// 封装axios
export let baseUrl = axios.defaults.baseURL

// get
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params})
            .then(response => {
                if (response.data.code == '200') {
                    resolve(response.data.data)
                } else {
                    this.$message.error(response.data.msg)
                }
            })
            .catch(error => {
                reject(error)
            })
    })
}

// post
export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data, data.version = '1.0.0', data.token = getCookie('token')))
            .then((response) => {
                if (response.data.code == '200') {
                    resolve(response.data.data)
                } else if (response.data.code == '20001') {
                    outLogin()
                } else {
                    this.$message.error(response.data.msg)
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

// upload
export function upload(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then((response) => {
                if (response.data.code == '200') {
                    resolve(response.data.data)
                } else {
                    this.$message.error(response.data.msg)
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

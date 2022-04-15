
import axios from 'axios'

// https://zhuanlan.zhihu.com/p/274238013
// '10.1.70.10/students/202128010315003/tp5/public'
// let baseURL = '/api' // 开发环境
let baseURL ='tp5/public' // 生产环境
let token = null;


const service = axios.create({
    baseURL: baseURL,
    timeout: 30000 // 请求超时时间
})

const setToken = (value) => {
    token = value
}

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // console.log(config)
        
        // 在请求发送之前做一些处理
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        config.headers['Time'] = new Date().getTime()
        config.headers['X-Authorization'] = token

        if (config.method != 'get') {
            for (let key in config.data) {
                if (config.data[key] === '') {
                    delete config.data[key]
                }
            }
            config.data = JSON.stringify(config.data)
        }
        // console.log(config)
        return config
    },
    // 发送失败
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 这个状态码是和后端约定的
        // console.log(response)
        if (response.data.code == 200) {
            if (!token) {
                token = response.data?.token ?? null
            }
            // console.log(token)
            // console.log(response.data)
            return Promise.resolve(response.data)
         }
        return Promise.reject(response.data)
    },
    (error) => {
        // console.log(error)
        return Promise.reject(error.data)
    }
)

export {
    service,
    setToken
}


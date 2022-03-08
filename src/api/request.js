
import axios from 'axios'

let baseURL = '/api'// '10.1.70.10/students/202128010315003/tp5/public'
let messageReactive = null;
let token = null;


const service = axios.create({
    baseURL: baseURL,
    timeout: 30000 // 请求超时时间
})

const closeLoading = () => {
    if (messageReactive) {
        messageReactive.destroy();
        messageReactive = null;
    }
}
const setToken = (value) => {
    token = value
}

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        messageReactive = window.$message.loading("加载中...", { duration: 0 })
        
        // 在请求发送之前做一些处理
        config.headers['Content-Type'] = 'application/json;charset=UTF-8'
        config.headers['Time'] = new Date().getTime()
        config.headers['X-Authorization'] = token

        if (config.method != 'get') {
            for (var key in config.data) {
                if (config.data[key] === '') {
                    delete config.data[key]
                }
            }
            config.data = JSON.stringify(config.data)
        }
        return config
    },
    // 发送失败
    (error) => {
        closeLoading()
        window.$message.error('发送失败', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        closeLoading()
        // 这个状态码是和后端约定的
        // console.log(response)
        if (response.data.code == 200) {
            if (!token) {
                token = response.data?.token ?? null
            }
            // console.log(token)
            return Promise.resolve(response.data)
         }
        return Promise.reject(response)
    },
    (error) => {
        window.$message.error(error)
        closeLoading()
        return Promise.reject(error)
    }
)

export {
    service,
    setToken
}


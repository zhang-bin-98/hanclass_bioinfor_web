//   引入封装好的axios
//   ps:如果没有封装，正常引入axios即可
import { service, setToken } from "./request.js";

const userUrl = 'user'
const geneUrl = 'gene'

export const resetToken = setToken

/****************** 用户管理 **********************/
// 用户登录
export const userLogin = (data) => {
    // console.log(data)
    return service.post(`${userUrl}/login`, data)
}
// 用户注册
export const userCreate = (data) => {
    // console.log(data)
    return service.post(userUrl, data)
}
// 用户列表(信息)
export const userList = (user_id = null) => {
    // console.log(user_id)
    return service.get(user_id ? `${userUrl}/${user_id}` : userUrl)
}
// 更新(修改)用户信息
// 删除用户
export const userDelete = (user_id) => {
    // console.log(data)
    return service.delete(`${userUrl}/${user_id}`)
}

/****************** 基因数据管理 **********************/
// 基因列表
export const geneList = (params = null /* 筛选参数 */) => {
    // console.log(params)
    return service.get(geneUrl, { params })
}
// 基因条目的集合查询
export const geneSummary = () => {
    return service.get(`${geneUrl}/summary`)
}
// 基因条目的数量
export const geneCount = () => {
    return service.get(`${geneUrl}/count`)
}
// 添加基因信息
export const geneCreate = (data) => {
    // console.log(data)
    return service.post(geneUrl, data)
}
// 更新(修改)基因信息
// 删除基因信息
export const geneDelete = (gene_id) => {
    // console.log(data)
    return service.delete(`${geneUrl}/${gene_id}`)
}


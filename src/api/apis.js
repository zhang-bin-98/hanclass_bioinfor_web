//   引入封装好的axios
//   ps:如果没有封装，正常引入axios即可
import { service, setToken } from "./request.js";

const userUrl = 'user'
const seqUrl = 'seq'
const seqBlastUrl = 'blast'
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
    console.log(user_id)
    return service.get(user_id ? `${userUrl}/${user_id}` : userUrl)
}
// 更新(修改)用户信息
// 删除用户
export const userDelete = (user_id) => {
    // console.log(data)
    return service.delete(`${userUrl}/${user_id}`)
}

/****************** 序列数据管理 **********************/
// 序列列表
export const seqList = (params = null /* 筛选参数 */) => {
    // console.log(params)
    return service.get(seqUrl, { params })
}
// 序列条目的集合查询
export const seqSummary = () => {
    return service.get(`${seqUrl}/summary`)
}
// 序列条目的数量
export const seqCount = () => {
    return service.get(`${seqUrl}/count`)
}
// 添加序列信息
export const seqCreate = (data) => {
    // console.log(data)
    return service.post(seqUrl, data)
}
// 更新(修改)序列信息
export const seqUpdate = (data, seq_id) => {
    console.log(data)
    console.log(seq_id)
    return service.put(`${seqUrl}/${seq_id}`, data)
} 
// 删除序列信息
export const seqDelete = (seq_id) => {
    // console.log(data)
    return service.delete(`${seqUrl}/${seq_id}`)
}


/******************  *****************/
// blast
export const seqBlast = (data) => {
    return service.post(`${seqBlastUrl}`, data)
}
// gene express
export const geneList = () => {
    return service.get(`${geneUrl}`)
}
// gene express
export const geneExp = (data) => {
    return service.post(`${geneUrl}`, data)
}

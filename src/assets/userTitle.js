export const columns = [
    {
        name: 'user_id', 
        label: 'ID', 
        field: 'user_id', 
        align: 'left', 
        sortable: true
    },
    {
        name: 'username', 
        label: '用户名', 
        field: 'username', 
        align: 'left', 
        sortable: true
    },
    {
        name: 'email', 
        label: '电子邮箱', 
        field: 'email', 
        align: 'left', 
        sortable: true
    },
    {
        name: 'create_at', 
        label: '注册时间', 
        field: 'create_at', 
        align: 'left', 
        sortable: true
    }, // 需要格式化
    {
        name: 'user_role', 
        label: '用户权限', 
        field: 'user_role', 
        align: 'left', 
        sortable: true, 
        format: val => val === 1 ? '管理员' : '普通用户'
    },
    {
        name: 'action', 
        label: '操作', 
        field: 'user_id', 
        align: 'center'
    }
]
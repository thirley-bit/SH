import api from '@/api/api';
import httpService from '../utils/httpService';

//新建群聊
export async function getInsertGroup(params){
    return httpService.post('/groupChat/insertGroup',params)
}
//编辑群聊
export async function getUpdateGroup(params){
    return httpService.post('/groupChat/updateGroup',params)
}
//删除群聊
export async function getDeleteGroup(params){
    return httpService.get(`/groupChat/deleteGroup?id=${params}`,params)
}
//群聊列表
export async function getGroupList(params){
    return httpService.post('/groupChat/getGroupList',params)
}
//群聊学生家长列表
export async function getGroupUserList(params){
    return httpService.post('/user/getGroupUserList',params)
}
//通讯录列表
export async function getAddressBookList(params){
    return httpService.post('/user/getAddressBookList',params)
}
//私信列表
export async function getChatList(params){
    return httpService.post('/chat/getChatList',params)
}
//进入退出聊天窗口
export async function getUpdateChatList(params){
    return httpService.post('/chat/updateChatList',params)
}
//删除聊天记录
export async function getDeleteChatList(params){
    return httpService.post(`/chat/deleteChatList/${params}`,params)
}
//消息列表
export async function getMessageList(params){
    return httpService.post(`/chat/getMessageList`,params)
}
//socket连接前处理
export async function getBeforeConnect(params){
    return httpService.post('/chat/beforeConnect',params)
}
//socket连接
export async function getWebsocket(params){
    return httpService.post(`websocket/${params.userId}/${params.roomId}`,params)
}
//文件上传
export async function getUploadFile(params){
    return httpService.uploadFile('/file/uploadFile',params)
}

export async function getTeacherList(){
    let url = 'address/teacher/list'
    let data = api[url]
    return data
}
export async function getParentList(){
    let url = 'address/parent/list'
    let data = api[url]
    return data
}
export async function getCheckStudentsList(){
    let url = 'students/list'
    let data = api[url]
    return data
}
export async function getChatGroupList(){
    let url = 'chat/group/list'
    let data = api[url]
    return data
}
// export async function getMessageList(){
//     let url = 'message/list'
//     let data = api[url]
//     return data
// }
export async function getMessageDetail(){
    let url = 'message/detail'
    let data = api[url]
    return data
}
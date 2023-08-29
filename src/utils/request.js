// /**
//  * 封装通用的工具函数 ajax请求
//  */
 
// import axios from 'axios'
// import qs from 'qs'
 
// // 设置请求的服务器根路径
// axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com/'
 
// // 封装get和post请求
// export default {
//   get(url, params = {}) {
//     return new Promise((resolve, reject) => {
//       axios.get(url, { params })
//         .then(response => {
//           resolve(response.data) // 处理请求成功的结果
//         })
//         .catch(err => {
//           reject(err) // 处理请求失败的错误信息
//         })
//     })
//   },
//   post(url, params = {}) {
//     return new Promise((resolve, reject) => {
//       axios.post(url, qs.stringify(params))
//         .then(response => {
//           resolve(response.data) // 处理请求成功的结果
//         })
//         .catch(err => {
//           reject(err) // 处理请求失败的错误信息
//         })
//     })
//   }
// }
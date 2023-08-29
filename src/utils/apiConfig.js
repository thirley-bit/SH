let baseUrlPrefix = ''
const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
console.log('编译环境：',process.env.NODE_ENV)
switch (env) {
  case 'development':
    baseUrlPrefix = 'http://...'
    break
  case 'production':
    baseUrlPrefix = 'https://jsonplaceholder.typicode.com'
    break
}

const api = {
  baseUrl: baseUrlPrefix,
//其他相关变量
}

export default api
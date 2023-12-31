import { Component } from 'react'
import { View } from "@tarojs/components";
import 'taro-ui/dist/style/index.scss'
import { Provider } from 'react-redux'
import dva from './utils/dva'
import models from './models'

const dvaApp = dva.createApp({
  initialState:{},
  models
})

const store = dvaApp.getStore()
class App extends Component {
  

  render () {
    // this.props.children 是将要会渲染的页面
    return <Provider store={store}>{this.props.children}</Provider> 
  }
}

export default App

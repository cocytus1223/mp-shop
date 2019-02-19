# UGO 商城微信小程序 demo

## wepy 项目初始化

- 安装 wepy 脚手架工具

  ```bash
  npm install wepy-cli -g
  ```

- 查看安装的版本

  ```bash
  wepy --version
  ```

- 使用 wepy 命令初始化项目

  ```bash
  wepy init standard my-project # 初始化一个标准的项目
  wepy init empty my-project # 初始化一个空的项目
  ```

- 进入项目目录

  ```bash
  cd my-project
  ```

- 安装依赖包

  ```bash
  yarn
  ```

- 启动项目

  ```bash
  yarn dev
  ```

## 项目的目录说明

1. `dist`: 最终的打包目录
2. `node_modules`: 依赖包
3. `src`: 开发目录
4. `.editorconfig`: 统一编辑器的配置， 依赖 vscode 的插件 editorconfig
5. `.eslintrc`: eslint 的配置文件
6. `.prettierrc`: 这是 prettier 的配置文件，配合 prettier 插件，如果项目中有这个 prettierrc 文件，优先级比默认配置要高

## 项目的 app.json 的基本配置

### pages

1. 需要在 pages 中增加新的页面

   ```js
   pages: ['pages/index', 'pages/category', 'pages/cart', 'pages/my'];
   ```

2. 在 pages 中新建对应的文件

### window

```js
window: {
      navigationBarBackgroundColor: '#ff2d4a',
      navigationBarTitleText: 'UGO',
      navigationBarTextStyle: 'white'
    },
```

### tabBar

```js
tabBar: {
      selectedColor: '#ff2d4a',
      list: [
        {
          pagePath: 'pages/index',
          text: '首页',
          iconPath: '/assets/images/icon_home@3x.png',
          selectedIconPath: '/assets/images/icon_home_active@3x.png'
        },
        {
          pagePath: 'pages/category',
          text: '分类',
          iconPath: '/assets/images/icon_category@3x.png',
          selectedIconPath: '/assets/images/icon_category_active@3x.png'
        },
        {
          pagePath: 'pages/cart',
          text: '购物车',
          iconPath: '/assets/images/icon_cart@3x.png',
          selectedIconPath: '/assets/images/icon_cart_active@3x.png'
        },
        {
          pagePath: 'pages/my',
          text: '我的',
          iconPath: '/assets/images/icon_me@3x.png',
          selectedIconPath: '/assets/images/icon_me_active@3x.png'
        }
      ]
    }
```

## 首页开发

![index](src/assets/images/index.png)

### 轮播图

小程序自带 swiper 组件

1. 通过 wx.request 发送 ajax 请求获取轮播图的数据
2. 把响应数据存储到 data 里面（注意，在 wpy 中，数据存储在 data 中 data={}）
3. 修改 data 中的数据 this.imgList = res.data.data
   如果是同步的代码，不需要同步，如果是异步代码，需要调用`$apply()`进行同步
4. 把数据渲染到轮播图中

#### 轮播图中发送 ajax 请求优化说明

1. wepy 对于小程序中所有的异步方法都进行 promise 的支持
2. 但是需要手动开启 wepy 的 promise 与 async await
3. 如何开启 async 与 await

```bash
1. 进入项目根目录，安装runtime包  npm install wepy-async-function --save

2. 在app.wpy中引入引入runtime包   import 'wepy-async-function';

3. 在app.wpy中增加
export default class extends wepy.app {

    constructor () {
        super();
        this.use('promisify');
    }

}

4. 以后项目中就可以随意使用async 与 await了
```

### WxParse

微信富文本解析组件

1. 下载 wxParse
2. 把 wxParse 拷贝到 assets 中
3. 在 js 中引入 wxParse.js
4. 在 wxss 中引入 wxParse.wxss
5. 调用 WxParse.wxParse 方法，把 html 转成 wxml
6. 把结果渲染到页面中
   1. 在页面中引入 wxParse.wxml
   2. 在页面中渲染 `<template is="wxParse" data="{{wxParseData:article.nodes}}"/>`

### 购物车模块

点击加入购物车
根据当前商品的 goodsid 去购物车中判断是否有这个商品
有这个商品就让这件商品的数量+1
如果没有这个商品，往数组中添加一个对象，商品数量为 1

1. 从缓存中把购物车数据获取到
2. 根据 id 获取商品
3. 判断购物车中是否有当前商品
4. 没有这件商品，push 一个对象，商品数量为 1
5. 有这件商品，商品数量+1
6. 把 cart 存回 storage

提示信息、列表渲染、checkbox、监听属性

### 登录模块

1. 先调用微信提供的 api，wx.login()获取到一个 code
2. 发送一个 ajax 请求，把 code 传递到服务器
3. 服务器会把 code+appid+appsecret 发送给微信服务器
4. 微信服务器给我们的服务器返回 openid、session_key
5. 根据 openid 和 sessionkey 生成一个 token 响应给我
6. 后续的 wx.request ajax 请求都要带上 token
7. 服务器验证 token 合法性返回对应的数据

### 支付流程

1. 用户点击微信支付按钮
2. 发送 ajax 请求给服务器创建一个订单，获取订单编号
3. 订单预支付，发送 ajax 请求给指定订单编号的订单进行支付，服务器返回一个订单对象
4. 调用微信支付的 api 进行微信支付
5. 查询订单的最终状态，根据订单的最终状态提示用户

export default {
  pages: [
    'pages/index/index',
    'pages/address/index',
    'pages/center/center',
    'pages/authorize/index',
    'pages/order/index',
    'pages/detail/index',
    'pages/shipping/index',
    'pages/serviceLocation/index',
    'pages/companyCertification/index',
    'pages/transCompany/index',
  ],
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  tabBar: {
    borderStyle: 'white',
    selectedColor:'#CE0801',
    color:' #7F8389',
    list: [{
      text: '首页',
      iconPath: 'img/shouye.png',
      selectedIconPath: 'img/shouye.png',
      pagePath: 'pages/index/index',
    },
      {
        text: '订单',
        iconPath: 'img/dingdan.png',
        selectedIconPath: 'img/qiuhuoa.png',
        pagePath: 'pages/order/index'
      },
      {
        text: '积分商城',
        iconPath: 'img/jifenshangcheng.png',
        selectedIconPath: 'img/wodea.png',
        pagePath: 'pages/center/center'
      },
      {
        text: '个人中心',
        iconPath: 'img/gerenzhongxin.png',
        selectedIconPath: 'img/wodea.png',
        pagePath: 'pages/center/center'
      }]
  }
}

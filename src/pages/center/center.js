import NavBar from "@/components/NavBar";
import {Image, Text, View} from "@tarojs/components";
import Taro from '@tarojs/taro'
import React from "react";
import {useSelector} from "react-redux";
import {AtIcon} from "taro-ui";
import avatar from '../../img/logo.png'
import './center.less'

export default function () {
  const user = useSelector(state => state.user)

  console.log('center')

  function userAuth() {
    Taro.navigateTo({url: '/pages/authorize/index'})
  }

  return <View className='container'>
    <NavBar title='个人中心' />
    <View className='user-info'>
      <View className='info' onClick={userAuth}>
        <Image className='avatar' src={user.avatarurl || avatar} />
        <Text className='nick_name'>{user.nickname || '登录'}</Text>
      </View>
      <View className='circle'>
        <Text className='title'>信誉</Text>
        <Text className='number'>100</Text>
      </View>
    </View>
    <View className='content-c'>
      <View className='item'>
        <AtIcon value='home' size='18' color='#4FC469' />
        <View className='content'>
          <Text>{`地址 ${user.country || ''} ${user.province || ''} ${user.city || ''}`}</Text>
        </View>
      </View>
      <View className='item'>
        <AtIcon value='phone' size='18' color='#4FC469' />
        <View className='content'>
          <Text>15901320019</Text>
        </View>
      </View>
    </View>
    <View className='content-c' style={{marginTop: '10px'}}>
      <View className='item'>
        <AtIcon value='help' size='18' color='#4FC469' />
        <View className='content'>
          <Text>问题反馈</Text>
        </View>
      </View>
      <View className='item'>
        <AtIcon value='phone' size='18' color='#4FC469' />
        <View className='content'>
          <Text>致电客服</Text>
        </View>
      </View>
      <View className='item'>
        <AtIcon value='map-pin' size='18' color='#4FC469' />
        <View className='content'>
          <Text>服务网点</Text>
        </View>
      </View>
    </View>
    <View className='content-c' style={{marginTop: '10px'}}>
      <View className='item'>
        <AtIcon value='settings' size='18' color='#4FC469' />
        <View className='content'>
          <Text>设置</Text>
        </View>
      </View>
    </View>
  </View>
}


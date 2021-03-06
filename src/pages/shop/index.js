import {PRODUCT_LIST, PRODUCT_ORDER_SUBMIT} from "@/api";
import NavBar from "@/components/NavBar";
import {useInfiniteQuery} from "@/react-query/react";
import {request} from "@/utils/request";
import {Image, View} from '@tarojs/components'
import {usePullDownRefresh, useReachBottom} from "@tarojs/runtime";
import Taro from "@tarojs/taro";
import React from 'react'

import './index.less'

export default function () {

  console.log('shopping')

  const {data = [], fetchMore, canFetchMore, refetch} = useInfiniteQuery(PRODUCT_LIST, (key, page = 1) => request(PRODUCT_LIST, {
    page,
    type: 1
  }), {
    getFetchMore: lastGroup => lastGroup.nextPage
  })

  useReachBottom(async () => {
    canFetchMore && await fetchMore()
  })
  usePullDownRefresh(async () => {
    await refetch()
    Taro.stopPullDownRefresh()
  })

  function handleButton(id) {
    Taro.navigateTo({url: '/pages/shopDetail/index?id=' + id})
    // Taro.showModal({title: '确定兑换商品?'}).then(({confirm}) => {
    //   confirm && request(PRODUCT_ORDER_SUBMIT, {id}).then(() => {
    //     Taro.showToast({title: '兑换成功', icon: 'none'})
    //   })
    // })
  }

  return (
    <NavBar back home title='商城' viewBackGround='#F3F5F4'>
      <View className='index'>
        <View className='list'>
          {data.map(r => r.list.map(d => <View className='item'>
            <Image src={d.img.split(',')[0]} />
            <View className='title'>{d.name}</View>
            <View className='info'>
              <View className='info_s'>
                <View className='price'>￥{d.price}</View>
                <View className='num'>剩余 {d.num}</View>
              </View>
              <View className='button' onClick={() => handleButton(d.id)}>购买</View>
            </View>
          </View>))}
        </View>
      </View>
    </NavBar>
  )
}



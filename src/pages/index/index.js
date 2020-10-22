import {ORDER_INDEX_LIST, ORDER_STATUS_LIST} from "@/api";
import Panel from "@/components/Panel";
import Skeleton from "@/components/Skeleton";
import SwiperScroll from "@/components/SwiperScroll";
import dingwei from '@/img/dingwei.png'
import jiantou from "@/img/jiantou.png";
import shijian from '@/img/shijian.png'
import sousuo2 from '@/img/sousuo2.png'
import tujing1 from '@/img/tujing (1).png'
import tujing2 from '@/img/tujing (2).png'
import {queryCache} from "@/react-query";
import {useInfiniteQuery} from "@/react-query/react";
import {request} from "@/utils/request";
import {getDistance} from "@/utils/utils";
import {Image, Input, Picker, Text, View} from '@tarojs/components'
import {usePullDownRefresh, useReachBottom} from "@tarojs/runtime";
import Taro from "@tarojs/taro";
import React, {createContext, useContext, useMemo, useRef, useState} from 'react'
import {useSelector} from "react-redux";
import useEffectOnce from "react-use/lib/useEffectOnce";
import useUpdateEffect from "react-use/lib/useUpdateEffect";
import './index.less'

const orderStatus = {
  0: {
    text: '待接单',
    color: '#CE0801'
  },
  1: {
    text: '待配送',
    color: '#F0741C'
  },
  2: {
    text: '配送中',
    color: '#02BB00'
  },
  3: {
    text: '待完成',
    color: '#333333'
  },
  4: {
    text: '已完成',
    color: '#333333'
  },
  5: {
    text: '派送取消',
    color: '#333333'
  },
  6: {
    text: '派送异常',
    color: '#333333'
  },
  7: {
    text: '派送超时',
    color: '#333333'
  },
}
const discharge = ['国四', '国五', '国六']

function useData() {
  const [data, setData] = useState({})
  return {data, setData}
}

const ViewContext = createContext(useData)

export default function () {

  console.log('order')
  const swiperRef = useRef()

  return (
    <View className='index'>
      <ViewContext.Provider value={useData()}>
        <View className='item_container'>
          <SwiperScroll title='首页' ref={swiperRef} labels={['全部', '个人单', '企业单']} header={<Search />}>
            <AllListCurrentView swiperRef={swiperRef} />
            <PersonCurrentView swiperRef={swiperRef} />
            <CompanyCurrentView swiperRef={swiperRef} />
          </SwiperScroll>
        </View>
      </ViewContext.Provider>
    </View>
  )
}


function Search() {
  const {data, setData} = useContext(ViewContext)
  return <View className='search'>
    <View className='search_text'>
      <Image src={dingwei} style={{width: '31rpx', height: '38rpx', marginLeft: '20rpx'}} />
      <Picker mode='region' onChange={(e) => setData({...data, reginFrom: e.detail.value})}
        value={data.reginFrom || []}
      ><Text
        style={{whiteSpace: 'nowrap'}}
      >{data.reginFrom ? data.reginFrom[2] : '全国'}</Text></Picker>
      <Image src={jiantou} style={{width: '39rpx', height: '17rpx', marginLeft: '20rpx'}} />
      <Picker mode='region' onChange={(e) => setData({...data, reginTo: e.detail.value})}
        value={data.reginTo || []}
      ><Text
        style={{whiteSpace: 'nowrap'}}
      >{data.reginTo ? data.reginTo[2] : '全国'}</Text></Picker>
    </View>
    <View className='search_button'>
      <Input className='input' onBlur={e => setData({...data, keyWrod: e.detail.value})} value={data.keyWrod}
        placeholderClass='placeholder' placeholder='请输入关键词'
      />
      <Image src={sousuo2} style={{width: '34rpx', height: '34rpx'}} />
    </View>
  </View>
}

function ListView({data, canFetchMore, fetchMore, index, refetch, swiperRef}) {
  const {viewHeight} = useSelector(state => state.theme)
  const {currentLocation = {}} = useSelector(state => state.user)
  useReachBottom(async () => {
    index === swiperRef.current.current && canFetchMore && await fetchMore()
    setTimeout(refreshDom, 200)
  })
  usePullDownRefresh(async () => {
    index === swiperRef.current.current && await refetch()
    setTimeout(refreshDom, 200)
    Taro.stopPullDownRefresh()
  })

  function refreshDom() {
    const query = Taro.createSelectorQuery()
    query.select(`.container .item_content_${swiperRef.current.current}`).boundingClientRect().exec(res => {
      res[0] && swiperRef.current.setSwiperHeight(res[0].height > viewHeight ? res[0].height : viewHeight)
    })
  }

  function toDetail(d) {
    Taro.navigateTo({url: '/pages/detail/index?id=' + d.id})
  }

  return <View>
    {data.map((r, i) => r.list.map((d, j) => <PanelBlock id={`${index}_${i}_${j}`}><Panel padding={0}>
      <View className='item' onClick={() => toDetail(d)}>
        <View className='header'>
          <View style={{display: 'flex', alignItems: 'center'}}>
            <Image src={shijian} style={{width: `30rpx`, height: `30rpx`}} />
            <View><Text className='time'>{d.deliveryTimeStart}-{d.deliveryTimeStart}</Text></View>
          </View>
          <View className='distance'>
            距您{getDistance(currentLocation.latitude, currentLocation.longitude, d.latitudeFrom, d.longitudeFrom)}km
          </View>
        </View>
        <View className='center'>
          <View className='center_l'>
            <View><View className='icon' style={{
              background: {
                0: 'linear-gradient(90deg, #FBD249 0%, #F5A623 100%)',
                1: 'linear-gradient(90deg, #6DA9FF 0%, #277CF7 100%);'
              }[d.orderType]
            }}
            >{{0: '个人', 1: '企业'}[d.orderType]}</View></View>
            <View> <View className='title'>零部件200t，10m³共20托</View></View>
          </View>
          <View className='center_c' style={{display: 'flex', alignItems: 'center'}}>
            <Image src={tujing1} style={{width: '14rpx', height: '14rpx'}} />
            <View><Text>{d.addressFromDetail}</Text></View>
          </View>
          <View className='center_c' style={{display: 'flex', alignItems: 'center'}}>
            <Image src={tujing2} style={{width: '14rpx', height: '14rpx'}} />
            <View> <Text>{d.addressToDetail}</Text></View>
          </View>
        </View>
        <View className='bottom'>
          <View className='descs'>
            <View>
              <text className='number'>￥{d.amount || 0}</text>
            </View>
            <View>
              <text className='car_type'>{d.productName}</text>
            </View>
            <View>
              <text className='car_type'>{discharge[d.discharge]}</text>
            </View>
          </View>
          <View className='button_t'>
            抢单
          </View>
        </View>
      </View>
    </Panel>
    </PanelBlock>))}
  </View>
}

function PanelBlock({id, children}) {
  const [show, setShow] = useState(false)
  const isShow = useMemo(() => show, [show])
  useEffectOnce(() => {
    setTimeout(() => {
      Taro.createIntersectionObserver().relativeToViewport().observe(`.item_observer_${id}`, (res) => {
        if (res.intersectionRatio > 0) {
          setShow(true)
        } else if (res.intersectionRatio === 0) {
          setShow(false)
        }
      })
    }, 300)
  })
  return <View className={`item_observer_${id}`} id={id}>
    {isShow ? children : <Skeleton row={1} rowProps={{
      width: '100%%',
      height: '243px'
    }}
    ></Skeleton>}
  </View>
}

function getQueryFn(key, params,page=1){
  return request(key, {...params,page})
}

function AllListCurrentView({swiperRef}) {
  console.log('AllListCurrentView')
  const {data: param} = useContext(ViewContext)
  const {data = [], fetchMore, canFetchMore, refetch} = useInfiniteQuery([ORDER_INDEX_LIST,{...param,page:1}], getQueryFn, {
    getFetchMore: lastGroup => lastGroup.nextPage
  })
  return <ListView data={data} fetchMore={fetchMore} canFetchMore={canFetchMore} refetch={refetch} index={0}
    swiperRef={swiperRef}
  />
}

function PersonCurrentView({swiperRef}) {
  console.log('ListCurrentView')
  const {data: param} = useContext(ViewContext)
  const {data = [], fetchMore, canFetchMore, refetch} = useInfiniteQuery([ORDER_INDEX_LIST, {...param,page:1,type:0}], getQueryFn, {
    getFetchMore: lastGroup => lastGroup.nextPage
  })
  return <ListView data={data} fetchMore={fetchMore} canFetchMore={canFetchMore} refetch={refetch} index={1}
    swiperRef={swiperRef}
  />
}


function CompanyCurrentView({swiperRef}) {
  console.log('ListCurrentView')
  const {data: param} = useContext(ViewContext)
  const {data = [], fetchMore, canFetchMore, refetch} = useInfiniteQuery([ORDER_INDEX_LIST, {...param,page:1,type:1}], getQueryFn, {
    getFetchMore: lastGroup => lastGroup.nextPage
  })
  return <ListView data={data} fetchMore={fetchMore} canFetchMore={canFetchMore} refetch={refetch} index={2}
    swiperRef={swiperRef}
  />
}

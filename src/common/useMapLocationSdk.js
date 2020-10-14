import {WX_KEY} from "@/utils/Const";
import Taro from "@tarojs/taro";
import {useEffect, useRef, useState} from "react";
import useEffectOnce from "react-use/lib/useEffectOnce";
import useUpdateEffect from "react-use/lib/useUpdateEffect";

// eslint-disable-next-line import/no-commonjs
const QQMapWX = require('../utils/qqmap-wx-jssdk.min.js');

export function useMapLocationSdk() {

  const [location, setLocation] = useState()

  const qqMapSdkRef = useRef()
  useEffectOnce(() => {
    qqMapSdkRef.current = new QQMapWX({
      key: WX_KEY
    });
  })

  async function getLocation() {
    return new Promise((resolve, reject) => {
      Taro.chooseLocation().then(res => {
        qqMapSdkRef.current.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: r => {
            res.info = r.result.ad_info
            setLocation(res)
            resolve(res)
          },
        });
      })
    })
  }

  return [location, getLocation]
}

export function useMapDirectionSdkEffect({from, to}, effect, deps) {

  const qqMapSdkRef = useRef()
  useEffectOnce(() => {
    qqMapSdkRef.current = new QQMapWX({
      key: WX_KEY
    });
  })

  useUpdateEffect(() => {
    direction().then(res=>effect(res))
  }, [deps])


  async function direction() {
    return new Promise((resolve, reject) => {
      qqMapSdkRef.current.direction({
        mode: 'driving',
        sig: WX_KEY,
        from,
        to,
        success: (res, d) => {
          resolve(d)
        },
      });
    })
  }
}


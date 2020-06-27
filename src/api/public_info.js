import { axios } from '@/utils/request'

// 获取文章列表
// export function banner () {
//   return axios({
//     url: '/media/banner',
//     params: { 'type_': 'index' },
//     method: 'get'
//   })
// }

// export function setBanner (data) {
//   return axios({
//     url: '/media/banner',
//     method: 'post',
//     data: data
//   })
// }

export function UpdateBanner (id, data) {
  return axios({
    url: '/media/banner/' + id,
    method: 'put',
    data: data
  })
}

export function BannersManager (method, data) {
  if (method === 'get') {
    return axios({
      url: '/media/banners',
      method: 'get',
      params: { 'type_': 'index' },
      data: data
    })
  } else {
    return axios({
      url: '/media/banners',
      method: method,
      data: data
    })
  }
}

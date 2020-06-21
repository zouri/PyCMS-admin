import { axios } from '@/utils/request'

// 获取文章列表
export function banner () {
  return axios({
    url: '/index/banner',
    method: 'get'
  })
}

export function setBanner (data) {
  console.log(data, 'abcdef')
  return axios({
    url: '/index/banner',
    method: 'post',
    data: data
  })
}

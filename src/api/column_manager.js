import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     page_count_number: '',
 *     page_number: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
// 获取栏目树
export function GetColumns () {
  return axios({
    url: '/column',
    method: 'get'
  })
}

// 创建一个栏目
export function CreateColumn (data) {
  return axios({
    url: '/column',
    method: 'post',
    data: data
  })
}

// 删除栏目
export function DeleteColumns (data) {
  return axios({
    url: '/column',
    method: 'delete',
    data: data
  })
}

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
// 获取文章列表
export function articleList (parameter) {
  return axios({
    url: '/article',
    method: 'get',
    params: parameter
  })
}

// 批量删除文章
export function articleDelList (data) {
  // data == [id, id]
  return axios({
    url: '/article',
    method: 'delete',
    data: data
  })
}

// 删除一片文章
export function articleDel (id) {
  const url = '/article' + '/' + id
  // alert(url)
  return axios({
    url: url,
    method: 'delete'
  })
}

// 更新一片文章的状态
export function articleUpdateStatus (id, code) {
  const url = '/article' + '/' + id + '/status'
  // alert(url)
  return axios({
    url: url,
    method: 'put',
    data: code
  })
}

// 新增一片文章
export function articleAdd (data) {
  const url = '/article'
  // alert(url)
  return axios({
    url: url,
    method: 'post',
    data: data
  })
}

// 更新一片文章
export function articleUpdate (id, data) {
  const url = '/article' + '/' + id
  // alert(url)
  return axios({
    url: url,
    method: 'put',
    data: data
  })
}

// 获取一片文章信息
export function articleDetails (id) {
  const url = '/article' + '/' + id
  // alert(url)
  return axios({
    url: url,
    method: 'get'
  })
}

// export default (
//   articleList,
//   articleDelList
// )

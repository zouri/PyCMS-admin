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
export function docs (parameter) {
  return axios({
    url: '/document',
    method: 'get',
    params: parameter
  })
}

// 批量删除文章
export function docsDel (data) {
  // data == [id, id]
  return axios({
    url: '/document',
    method: 'delete',
    data: data
  })
}

// 删除一片文章
export function docDel (id) {
  const url = '/document' + '/' + id
  // alert(url)
  return axios({
    url: url,
    method: 'delete'
  })
}

// 新增一片文章
export function docAdd (data) {
  const url = '/document'
  // alert(url)
  return axios({
    url: url,
    method: 'post',
    data: data
  })
}

// 更新一片文章
export function docUpdate (doc_) {
  const url = '/document' + '/' + doc_.id
  // alert(url)
  return axios({
    url: url,
    method: 'put',
    data: doc_
  })
}

// 获取一片文章信息
export function docDetails (id) {
  const url = '/document' + '/' + id
  // alert(url)
  return axios({
    url: url,
    method: 'get'
  })
}

// 更新一片文章的状态
export function docUpdateAttr (id, attrName, attrValue) {
  const url = '/document' + '/' + id
  return axios({
      url: url,
      method: 'patch',
      data: { 'attr': attrName, 'value': attrValue }
  })
}

// export default (
//   articleList,
//   articleDelList
// )

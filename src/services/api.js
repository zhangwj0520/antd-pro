import { stringify } from 'qs';
import request from '@/utils/request';

//登录
export async function fakeAccountLogin(params) {
  return request('/api/med/user/login/account', {
    method: 'POST',
    body: params,
  });
}

//上传
export async function uploadFile(params) {
  return request('/api/med/list/add', {
    method: 'POST',
    body: params,
  });
}
//获取所有订单信息
export async function queryAllList() {
  return request('/api/med/list/');
}
//删除订单
export async function removeList(params) {
  return request('/api/med/list/delete', {
    method: 'POST',
    body: params,
  });
}
//获取某个订单
export async function queryOneList(params) {
  return request(`/api/med/list/${params}`);
}
//更新某个订单
export async function updateOneList(params) {
  //console.log(params)
  const {id,data}=params
  return request(`/api/med/list/edit/${id}`, {
    method: 'POST',
    body: {data},
  });
}
//更新时间
export async function updateListTime(params) {
  console.log(params)
  const {id,fahuo_time}=params
  return request(`/api/med/list/time/${id}`, {
    method: 'POST',
    body: {fahuo_time},
  });
}
//用户注册
export async function fakeRegister(params) {
  return request('/api/med/user/register', {
    ///api/med/user/login/register
    method: 'POST',
    body: params,
  });
}
//获取med for name
export async function fakeMedChartData(params) {
  //console.log(params)
  return request('/api/med/list/find', {
    method: 'POST',
    body: params,
  });
}

////
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}



export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

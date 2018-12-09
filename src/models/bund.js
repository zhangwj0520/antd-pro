import {
  queryAllList,
  removeList,
  queryOneList,
  updateOneList,
  removeFakeList,
  addFakeList,
  updateFakeList,
  updateListTime
} from '@/services/api';

export default {
  namespace: 'bund',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    queryOneList:{},
    queryOneData:[],
    detailList:{}
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryAllList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *deleteList({ payload }, { call, put }) {
      const response = yield call(removeList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
    *fetchOne({ payload }, { call, put }) {
      const response = yield call(queryOneList, payload);
      yield put({
        type: 'queryOne',
        payload: response.queryOne,
      });
    },
    *updateOne({ payload }, { call, put }) {
      const response = yield call(updateOneList, payload);
    },
    //更新订单时间
    *updateTime({ payload }, { call, put }) {
      const response = yield call(updateListTime, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    

    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.id) {
        callback = Object.keys(payload).length === 1 ? removeFakeList : updateFakeList;
      } else {
        callback = addFakeList;
      }
      const response = yield call(callback, payload); // post
      yield put({
        type: 'queryList',
        payload: response,
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        data: { list: payload },
      };
    },
    queryOne(state, { payload }) {
      return {
        ...state,
        queryOneList: payload ,
        queryOneData:payload.data,
      };
    },
    setOneList(state, { payload }) {
      return {
        ...state,
        detailList: payload ,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

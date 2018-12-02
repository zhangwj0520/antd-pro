import {
  queryAllList,
  removeList,
  removeFakeList,
  addFakeList,
  updateFakeList,
} from '@/services/api';

export default {
  namespace: 'bund',

  // state: {
  //   data: [],
  // },

  state: {
    data: {
      list: [],
      pagination: {},
    },
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
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};

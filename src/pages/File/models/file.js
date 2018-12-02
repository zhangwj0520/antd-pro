import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { uploadFile } from '@/services/api';

export default {
  namespace: 'file',
  state: {
    status: undefined,
  },

  effects: {
    *upload({ payload }, { call, put }) {
      const response = yield call(uploadFile, payload);
      if (response.status === 'ok') {
        message.success('提交成功');
        // yield put({
        //   type: 'uploadResponse',
        //   payload: response.status,
        // });
      }
    },
    *submitStepForm({ payload }, { call, put }) {
      yield call(fakeSubmitForm, payload);
      yield put({
        type: 'saveStepFormData',
        payload,
      });
      yield put(routerRedux.push('/form/step-form/result'));
    },
    *submitAdvancedForm({ payload }, { call }) {
      yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    uploadResponse(state, { payload }) {
      return {
        ...state,
        status: payload,
      };
    },
    onloadDefault(state) {
      return {
        ...state,
        status: undefined,
      };
    },
  },
};

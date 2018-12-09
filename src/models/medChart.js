import { fakeMedChartData } from '@/services/api';

export default {
  namespace: 'medchart',

  state: {
    medchartList:[],
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      //console.log(payload)
      const response = yield call(fakeMedChartData,payload);
      const {list}=response
      let medchartList=[]
      for(let i=0;i<list.length;i++){
        const cur=list[i];
        let obj={...cur,...cur.data[0]}
        delete obj.data
        medchartList.push(obj)    
      }
      yield put({
        type: 'save',
        payload: {medchartList},
      });
    },
    *fetchSalesData(_, { call, put }) {
      const response = yield call(fakeChartData);
      yield put({
        type: 'save',
        payload: {
          salesData: response.salesData,
        },
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      //console.log(payload)
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};

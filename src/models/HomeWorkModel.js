import {
  getListByType,
  getTypeSelect,
  getInsertHomework,
  getWorkList,
  getWorkById,
  getViewHomework,
  getCompleteWork,

  getSubjectList,
  getSubjectDetail,
  // getStudentsList,
  getFeedBackDetail,
  getEditFeedBack,
  getFeedBackList,
} from "../services/HomeWorkServices";

const model = {
  namespace: "HomeWork",
  state: {
    workList:[], //作业列表
    subjectType: [], //科目选择栏目
    subjectDetail: {}, //作业详情

    
    homeWorkArr: [], //作业列表
    studentsList: [], //学生列表
    
    submitListAll: [], //学生提交作业列表
    feedBack: [], //家长端反馈信息
    feedBackList: [], //教师端反馈信息列表
  },

  effects: {
    *getListByType({ payload }, { call, put }) {
      const response = yield call(getListByType, payload);
      let all = {
        id:0,
        name:'全部',
        value:'',
      }
      let data = response.data.unshift(all)
      if(response.status == 200){
        yield put({
          type: "changeSubjectType",
          payload: response.data,
        });
      }
      return response;
    },
    *getInsertHomework({ payload }, { call, put }) {
      const response = yield call(getInsertHomework, payload);
      return response;
    },
    *getWorkList({ payload }, { call, put }) {
      const response = yield call(getWorkList, payload);
      if(response.status == 200){
        yield put({
          type: "changeWorkList",
          payload: response.data,
        });
      }
      return response;
    },
    *getViewHomework({ payload }, { call, put }) {
      const response = yield call(getViewHomework, payload);
      return response;
    },
    *getWorkById({ payload }, { call, put }) {
      const response = yield call(getWorkById, payload);
      if (response.status == 200) {
        yield put({
          type: "changeSubjectDetail",
          payload: response.data,
        });
      }
      return response;
    },
    *getCompleteWork({ payload }, { call, put }) {
      const response = yield call(getCompleteWork, payload);
      console.log(response,'response')
      return response;
    },





    *getSubjectList({ payload }, { call, put }) {
      const response = yield call(getSubjectList, payload);
      if (response.code == 1) {
        yield put({
          type: "changeSubjectList",
          payload: response.data,
        });
      }
      return response;
    },
    
    *getSubjectDetail({ payload }, { call, put }) {
      const response = yield call(getSubjectDetail, payload);
      if (response.code == 1) {
        // yield put({
        //   type: "changeSubjectDetail",
        //   payload: response.data,
        // });
      }
      return response;
    },
    // *getStudentsList({ payload }, { call, put }) {
    //   const response = yield call(getStudentsList, payload);
    //   if (response.status == 200) {
    //     yield put({
    //       type: "changeStudentsLst",
    //       payload: response.data,
    //     });
    //   }
    //   return response;
    // },
    *getFeedBackDetail({ payload }, { call, put }) {
      const response = yield call(getFeedBackDetail, payload);
      if (response.code == 1) {
        yield put({
          type: "changeSubjectFeedBack",
          payload: response.data,
        });
      }
      return response;
    },
    *getEditFeedBack({ payload }, { call, put }) {
      const response = yield call(getEditFeedBack, payload);
      if (response.code == 1) {
        yield put({
          type: "changeEditFeedBack",
          payload: response.data,
        });
      }
      return response;
    },
    *getFeedBackList({ payload }, { call, put }) {
      const response = yield call(getFeedBackList, payload);
      if (response.code == 1) {
        yield put({
          type: "changeFeedBackList",
          payload: response.data,
        });
      }
      return response;
    },
  },
  reducers: {
    changeSubjectType(state, { payload }) {
      return {
        ...state,
        subjectType: payload,
      };
    },
    changeWorkList(state, { payload }) {
      return {
        ...state,
        workList: payload,
      };
    },
    changeSubjectList(state, { payload }) {
      return {
        ...state,
        homeWorkArr: payload,
      };
    },
    changeTimeSelect(state, { payload }) {
      return {
        ...state,
        homeWorkArr: payload,
      };
    },
    
    changeTypeSelect(state, { payload }) {
      return {
        ...state,
        homeWorkArr: payload,
      };
    },
    changeSubjectDetail(state, { payload }) {
      return {
        ...state,
        subjectDetail: payload,
      };
    },
    changeStudentsLst(state, { payload }) {
      return {
        ...state,
        studentsList: payload,
      };
    },

    changeSubjectFeedBack(state, { payload }) {
      return {
        ...state,
        feedBack: payload,
      };
    },
    changeEditFeedBack(state, { payload }) {
      return {
        ...state,
        feedBack: payload,
      };
    },
    changeFeedBackList(state, { payload }) {
      return {
        ...state,
        feedBackList: payload,
      };
    },
  },
};
export default model;

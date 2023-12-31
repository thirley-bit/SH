import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import { AtTabsPane } from "taro-ui";

import StudentsList from "@app/component/StudentsList/StudentsList";
import Table from "@app/component/Table/Table";
import FeedBack from "@app/component/FeedBack";
import MyTabs from "@app/component/MyTabs/MyTabs";
import GradientButton from "@app/component/GradientButton";
import normal from "@static/normal.png";
import { connect } from "react-redux";

import "./DetailContent.scss";

function DetailContent(props) {
  const {
    dispatch,
    userId,
    studentId,
    enter,
    user,
    id,
    pageSize,
    replyList,



    scoreTitle,
    scoreDetailArr,
    feedBack,
    feedBackList,
    studentsList,
  } = props;
  const [studentsData, setStudentsData] = useState([]);
  const [allSubmittedList, setAllSubmittedList] = useState([]);
  const [submittedList, setSubmittedList] = useState([]);
  const [notSubmittedList, setNotSubmittedList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [tabList, setTabList] = useState([]);
  const [isEdit, setIsEdit] = useState(false); //是否修改反馈 true：修改反馈 false：提交反馈

  useEffect(() => {
    dispatch({
      type: "Score/getScoreDetailArr",
    });
    if (user == 0 && enter == "homework") {
      
      let tab = [
        {
          title: "家长反馈",
        },
      ];
      setTabList(tab);
    } else {
      dispatch({
        type: "HomeWork/getCompleteSituationList",
        payload: {
          workId:id,
        },
      }).then((res) => {
        if (res.status == 200) {
          let newListAll = res.data;
          let newSubmittedList = res.data.filter((item) => item.status == 1);
          let newNotSubmittedList = res.data.filter((item) => item.status == 0);
          setAllSubmittedList(newListAll);
          setStudentsData(newListAll);
          setSubmittedList(newSubmittedList);
          setNotSubmittedList(newNotSubmittedList);
          let tab = [
            {
              id: 0,
              title: `全部(${newListAll.length})`,
            },
            {
              id: 1,
              title: `已交(${newSubmittedList.length})`,
            },
            {
              id: 2,
              title: `未交(${newNotSubmittedList.length})`,
            },
            {
              id: 3,
              title: `家长反馈`,
            },
          ];
          setTabList(tab);
        }
      });
    }
  }, [user]);

  const handleTabChange = (index) => {
    setCurrent(index);
    // 切换tab时请求不同的接口，展示不同的数据
    if (index == 0) {
      setStudentsData(allSubmittedList);
    } else if (index == 1) {
      setStudentsData(submittedList);
    } else if (index == 2) {
      setStudentsData(notSubmittedList);
    } else {
      setStudentsData(feedBackList);
    }
  };
  // const handleSend = () => {
  //   if (isEdit) {
  //     //处于修改反馈状态
  //     setIsEdit(false);
  //     dispatch({
  //       type: "HomeWork/getEditFeedBack",
  //     });
  //   } else {
  //     setIsEdit(true);
  //   }
  // };

  return (
    <View className='main'>
      <View className='tab'>
        {enter == "homework" && (
          <View>
            <MyTabs
              current={current}
              tabList={tabList}
              onClick={handleTabChange}
            >
              {tabList.map((item, index) => {
                return (
                  <AtTabsPane key={index} current={current} index={index}>
                    <View className='data'>
                      {user == 0 ? (
                        <FeedBack workId={id}></FeedBack>
                      ) : (
                        <View>
                          {item.id == 3 ? (
                            <FeedBack workId={id}></FeedBack>
                          ) : (
                            <StudentsList
                              current={current}
                              enter={enter}
                              id={id}
                              showData={studentsData}
                            />
                          )}
                        </View>
                      )}
                    </View>
                  </AtTabsPane>
                );
              })}
            </MyTabs>
          </View>
        )}
        {user == "1" && enter == "score" && (
          <Table columns={scoreTitle} dataSource={scoreDetailArr}></Table>
        )}
      </View>
    </View>
  );
}
export default connect((state) => ({
  user: state.users.user,
  pageSize: state.users.pageSize,
  userId: state.users.userId,
  studentId: state.users.studentId,
  replyList: state.HomeWork.replyList,

  scoreTitle: state.Score.scoreTitle,
  scoreDetailArr: state.Score.scoreDetailArr,
  feedBack: state.HomeWork.feedBack,
  feedBackList: state.HomeWork.feedBackList,
  studentsList: state.HomeWork.studentsList,
}))(DetailContent);

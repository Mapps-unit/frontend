/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FeedbackList from '../components/FeedbackBox/FeedbackList';
import FeedbackInputBox from '../components/FeedbackBox/FeedbackInputBox';
import MainSentence from '../components/FeedbackBox/MainSentence';
import { Header } from '../components';
import useRequestAuth from '../hooks/useRequestAuth';
import { getApiEndpoint, isError, urlOwnerNotFound } from '../utils/util';
import MyfeedbackList from '../components/FeedbackBox/MyfeedbackList';
// import { useMyInfo } from '../hooks/myInfo';
import { useRequest } from '../hooks/useRequest';

function FeedbackPage() {
  const [myFeedbacks, setMyFeedbacks] = useState(null);
  const [feedbacks, setFeedbacks] = useState(null);
  const [loading, setLoading] = useState(null);
  const [needReload, setNeedReload] = useState(false);
  // const { loggedIn, myInfo } = useMyInfo();
  const { myInfo } = useSelector((state) => ({
    myInfo: state.info.user,
  }));

  const endpoint = `${getApiEndpoint()}/feedback`;
  const { res: myFeedbacksRes, request: requestMyFeedbacks } = useRequestAuth({
    endpoint: endpoint,
    method: 'get',
  });

  const { res: feedbacksRes, request: requestFeedbacks } = useRequest({
    endpoint: endpoint,
    method: 'get',
  });

  const sendReloadSignal = () => {
    setNeedReload(!needReload);
  };

  useEffect(() => {
    if (!myInfo || myInfo.user_seq === -1) requestFeedbacks();
    else if (myInfo && myInfo.user_seq !== -1) requestMyFeedbacks();
  }, [myInfo, needReload]);
  useEffect(() => {
    if (feedbacksRes && feedbacksRes.data) {
      const { code, data, message } = feedbacksRes.data;
      if (isError(code) && urlOwnerNotFound(message)) {
        alert('정보를 가져올 수 없습니다.');
      } else if (isError(code)) {
        alert('데이터 베이스 에러입니다.');
      }
      if (data) {
        setFeedbacks(data.publicFeedback);
        setMyFeedbacks(data.myFeedback);
      }
    }
  }, [feedbacksRes]);

  useEffect(() => {
    if (myFeedbacksRes && myFeedbacksRes.data) {
      const { code, data, message } = myFeedbacksRes.data;
      if (isError(code) && urlOwnerNotFound(message)) {
        alert('정보를 가져올 수 없습니다.');
      } else if (isError(code)) {
        alert('데이터 베이스 에러입니다.');
      }
      if (data) {
        setFeedbacks(data.publicFeedback);
        setMyFeedbacks(data.myFeedback);
      }
    }
  }, [myFeedbacksRes]);

  useEffect(() => {
    if (myInfo && myInfo.user_seq !== -1 && myFeedbacks !== null)
      setLoading('loggedIn');
    else if (!myInfo || (myInfo.user_seq === -1 && myFeedbacks !== null))
      setLoading('guest');
  });

  return (
    <div css={[pageBox, paddingBottom]}>
      <Header pageType='feedback' />
      <div css={contentsBox}>
        <MainSentence />
        <FeedbackInputBox sendReloadSignal={sendReloadSignal} />
        {loading === 'loggedIn' && (
          <MyfeedbackList myFeedbacks={myFeedbacks} myInfo={myInfo} />
        )}
        {(loading === 'guest' || loading === 'loggedIn') && (
          <FeedbackList feedbacks={feedbacks} />
        )}
      </div>
    </div>
  );
}

const pageBox = css`
  background-color: #f2f2f2;
  min-width: 1124px;
`;

const paddingBottom = css`
  padding-bottom: 300px;
`;

const contentsBox = css`
  position: relative;
  top: 81px;
  min-height: 100vh;
  max-width: 1000px;
  padding: 0 20px;
  margin: 0 auto;
`;

export default FeedbackPage;

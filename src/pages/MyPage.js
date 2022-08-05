/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Header } from '../components';
import AddPagePopUp from '../components/MyPage/AddPagePopUp';
import EditPropfilePopUp from '../components/MyPage/EditProfilePopUp';
import BindingPagePopUp from '../components/MyPage/BindingPopUp';
import PageBlock from '../components/MyPage/PageBlock';
// import { useMyInfo } from '../hooks/myInfo';
import { useRequest } from '../hooks/useRequest';
import { useGetPersonalUrl } from '../hooks/useParamsUrl';
import {
  getApiEndpoint,
  isError,
  urlMatched,
  urlOwnerNotFound,
} from '../utils/util';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {
  createReplacementSinglePagesAction,
  createReplacementMultiPagesAction,
} from '../redux/slice';
import Azone from '../components/MyPage/Azone';
import { PAGE_MARGIN, PAGE_WIDTH } from '../styles/style';

function MyPage() {
  // const { myInfo } = useMyInfo();
  const history = useHistory();
  const pageUrl = useGetPersonalUrl();
  const [userSeq, setUserSeq] = useState(null);
  const [userMatched, setUserMatched] = useState(null);
  const [userUrl, setUserUrl] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [popUp, setPopUp] = useState(false);
  const [profilePopUp, setProfilePopUp] = useState(false);
  const [bindingPopUp, setBindingPopUp] = useState(false);

  const { myInfo, singlePagesState, multiPagesState } = useSelector(
    (state) => ({
      myInfo: state.info.user,
      singlePagesState: state.info.singlePages,
      multiPagesState: state.info.multiPages,
    })
  );
  const dispatch = useDispatch();

  const { res: pageUserRes, request: requestPageUserInfo } = useRequest({
    endpoint: `${getApiEndpoint()}/url/${pageUrl}/user`,
    method: 'get',
  });

  // eslint-disable-next-line no-unused-vars
  const { res: singlePagesData, request: requestSinglePagesData } = useRequest({
    endpoint: `${getApiEndpoint()}/user/page/singles/${userSeq}`,
    method: 'get',
  });

  // eslint-disable-next-line no-unused-vars
  const { res: multiPagesData, request: requestMultiPagesData } = useRequest({
    endpoint: `${getApiEndpoint()}/user/page/multies/${userSeq}`,
    method: 'get',
  });

  // 해당 페이지 정보 가져옴 -> pageUserRes에 변화
  useEffect(() => {
    requestPageUserInfo();
  }, []);

  // pageUserRes에 변화가 있으면 -> 데이터를 받아서 userseq, nickname 세팅.
  useEffect(() => {
    if (pageUserRes && pageUserRes.data) {
      const { code, data, message } = pageUserRes.data;
      if (isError(code) && urlOwnerNotFound(message)) {
        alert('페이지를 찾을 수 없습니다.');
        history.goBack();
      } else if (isError(code)) {
        alert('데이터 베이스 에러입니다.');
      }
      if (data) {
        setUserSeq(data.user_seq);
        setNickname(data.nickname);
      }
    }
    return () => {
      setUserSeq(null);
      setNickname(null);
    };
  }, [pageUserRes, history]);

  // 내 페이지인지 남의 페이지인지 확인 로직
  useEffect(() => {
    // 내 페이지일 경우
    if (myInfo && urlMatched(myInfo.url, pageUrl)) {
      setUserMatched(true);
      setNickname(myInfo.nickname);
      setUserUrl(myInfo.url);
      if (userSeq) {
        requestSinglePagesData();
        requestMultiPagesData();
      }
      // 다른 사람 페이지일 경우
    } else {
      setUserMatched(false);
    }
    // }
    return () => {
      setUserMatched(null);
      setNickname(null);
    };
  }, [
    pageUrl,
    myInfo,
    userSeq,
    requestPageUserInfo,
    requestSinglePagesData,
    requestMultiPagesData,
  ]);

  // 바인딩 페이지용 싱글페이지 목록 데이터 리덕스에 저장
  useEffect(() => {
    if (singlePagesData && singlePagesData.data) {
      dispatch(createReplacementSinglePagesAction(singlePagesData.data));
    }
    if (multiPagesData && multiPagesData.data) {
      dispatch(createReplacementMultiPagesAction(multiPagesData.data));
    }
  }, [singlePagesData, multiPagesData, dispatch]);

  function singlePagesimage() {
    if (singlePagesState && singlePagesState.message === 'ok') {
      const usersb = singlePagesState.data;
      return (
        <>
          {usersb.map((page, index) => {
            const semiIndex = index + 1;

            return (
              <div key={semiIndex}>
                <PageBlock
                  userUrl={userUrl}
                  data={page}
                  setPopUp={setPopUp}
                  popUp={popUp}
                  pageType='single'
                />
              </div>
            );
          })}
        </>
      );
    }
    return <div>no data</div>;
  }

  function multiPagesimage() {
    if (multiPagesState && multiPagesState.message === 'ok') {
      const multiPages = multiPagesState.data;
      return (
        <>
          {multiPages.map((page, index) => {
            const semiIndex = index + 1;

            return (
              <div key={semiIndex}>
                <PageBlock
                  userUrl={userUrl}
                  data={page}
                  setPopUp={setPopUp}
                  popUp={popUp}
                  pageType='multi'
                />
              </div>
            );
          })}
        </>
      );
    }
    return <div>no data</div>;
  }

  return (
    <div css={[positionRelative]}>
      <Header
        userMatch={userMatched}
        pageUrl={pageUrl}
        pageUserName={nickname}
        pageType='normal'
      />
      <div css={MyPageWrapper}>
        <Azone
          myInfo={myInfo}
          setPopUp={setProfilePopUp}
          popUp={profilePopUp}
          bindingPopUp={bindingPopUp}
        />
        {/* <hr css={[divLine]} /> */}
        <div css={MyPageBZoneWrapper}>
          <div css={MyPageBZone}>
            {multiPagesimage()}
            <PageBlock
              userUrl={userUrl}
              setPopUp={setBindingPopUp}
              popUp={bindingPopUp}
            />
            <div
              css={css`
                height: 20px;
                width: 100vw;
              `}
            />

            <hr css={[divLine]} />
            {singlePagesimage()}
            <PageBlock userUrl={userUrl} setPopUp={setPopUp} popUp={popUp} />
            <div css={[overFlowHidden]} />
          </div>
        </div>
        <div
          css={css`
            width: 100vw;
            display: flex;
            justify-content: center;
          `}
        />
      </div>
      {profilePopUp && (
        <EditPropfilePopUp
          userSeq={userSeq}
          setPopUp={setProfilePopUp}
          popUp={profilePopUp}
        />
      )}
      {bindingPopUp && (
        <BindingPagePopUp userSeq={userSeq} setPopUp={setBindingPopUp} />
      )}
      {popUp && (
        <AddPagePopUp userSeq={userSeq} setPopUp={setPopUp} popUp={popUp} />
      )}
    </div>
  );
}

export default MyPage;

const positionRelative = css`
  position: relative;
`;

const MyPageWrapper = css`
  min-width: ${PAGE_WIDTH};
  width: 90vw;
  margin: ${PAGE_MARGIN};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MyPageBZoneWrapper = css`
  width: 90vw;
  height: 300px;
  margin: ${PAGE_MARGIN};
  margin-top: 20px;
  background-color: white;
`;
const MyPageBZone = css`
  width: 100%;
  flex-wrap: wrap;
  display: flex;
`;

const divLine = css`
  width: 100%;
  height: 1px;
  background-color: lightgray;
`;

const overFlowHidden = css`
  overflow: hidden;
`;

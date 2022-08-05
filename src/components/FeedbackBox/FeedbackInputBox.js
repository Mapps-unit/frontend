/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
// import { useMyInfo } from '../../hooks/myInfo';
import useRequestAuth from '../../hooks/useRequestAuth';
import { mainColor } from '../../styles/color';
import { getApiEndpoint } from '../../utils/util';
import { PlainPopUp } from './PlainPopUp';

const inputColor = '#fff';

function FeedbackInputBox(props) {
  const [inputmessage, setInputmessage] = useState('');
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUpText, setPopUpText] = useState({
    topText: '',
    middleText: '',
    bottomText: '',
  });
  const { myInfo } = useSelector((state) => ({
    myInfo: state.info.user,
  }));
  const userSeq = localStorage.getItem('user_seq');
  const endpoint = `${getApiEndpoint()}/feedback/register/${userSeq}`;

  const feedbackRef = useRef(null);

  const { res, request } = useRequestAuth({
    endpoint: endpoint,
    method: 'post',
    data: {
      content: inputmessage,
    },
  });

  const { sendReloadSignal } = props;

  function closePopUp() {
    setShowPopUp(false);
  }

  function sendAlert() {
    // alert('피드백은 회원 가입 후에 작성 가능합니다!');
    setPopUpText({
      topText: '죄송합니다!',
      middleText: '',
      bottomText: '피드백은 회원 가입 후에 작성 가능합니다!',
    });
    setShowPopUp(true);
  }

  function sendQnA() {
    if (myInfo && myInfo.user_seq !== -1) {
      if (feedbackRef.current.value.length < 10) {
        // alert('10자 이상 작성해주셔야 합니다!')
        setPopUpText({
          topText: '죄송합니다!',
          middleText: '',
          bottomText: '10자 이상 작성해주셔야 합니다!',
        });

        setShowPopUp(true);
      } else {
        request();
        // alert(
        //   '온잇 팀이 의견을 검토하기까지는 피드백 화면에서 나의 의견을 확인할 수 없어요. 소중한 의견을 신속하게 확인할게요!'
        // );
        // localStorage.setItem('submitSuccess', 'true');
        setPopUpText({
          topText: '전송 완료',
          middleText: '보내주신 메시지가 무사히 전달되었어요!',
          bottomText:
            '온잇 팀이 의견을 검토하기까지는 피드백\n화면에서 나의 의견을 확인할 수 없어요.\n소중한 의견을 신속하게 확인할게요!',
        });
        feedbackRef.current.value = '';
        setShowPopUp(true);
      }
    } else {
      sendAlert();
    }
  }

  // useEffect(() => {
  //   if (localStorage.getItem('submitSuccess') === 'true') {
  //     setPopUpText({
  //       topText: '피드백 전달 완료',
  //       middleText: '',
  //       bottomText:
  //         '소중한 의견 감사합니다!\n\nONIT의 성장에 큰 도움이 될 거에요.',
  //     });
  //     setShowPopUp(true);
  //   }
  //   localStorage.removeItem('submitSuccess');
  // }, []);

  useEffect(() => {
    if (res && res.data) {
      // window.location.reload();
      sendReloadSignal();
    }
  }, [res]);

  const handleMessageChange = ({ target: { value } }) => {
    setInputmessage(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendQnA();
    }
  };

  return (
    <div css={[container]}>
      <PlainPopUp state={showPopUp} close={closePopUp} textObject={popUpText} />
      <input
        css={[removeInputCss, inputBox]}
        type='text'
        value={inputmessage}
        placeholder='온잇에 대한 생생한 의견을 보내주세요!'
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        ref={feedbackRef}
      />
      <button
        type='button'
        css={[removeButtonCss, buttonBox]}
        onClick={sendQnA}
      >
        보내기
      </button>
    </div>
  );
}

const container = css`
  background-color: ${inputColor};
  opacity: 1;
  display: flex;
  align-items: center;
  -webkit-box-align: center;
  -webkit-box-pack: center;
  justify-content: center;
  margin: 43.2px 20px 24.7px;
  border-radius: 48px;
  box-sizing: border-box;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
`;

const removeButtonCss = css`
    border: 0;
    outline 0;
`;

const buttonBox = css`
  width: 97.2px;
  height: 33.6px;
  margin-right: 6px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.4;
  color: #ffffff;
  border-radius: 28px;
  background-color: #2e2e2e;
  &:hover {
    background-color: ${mainColor};
  }
`;

const removeInputCss = css`
  border: none;
  box-shadow: none;
  font-size: 1em;
  appearance: none;
`;

const inputBox = css`
  display: block;
  width: 100%;
  height: 24px;
  font-size: 13.55px;
  border-radius: 48px;
  background-color: ${inputColor};
  padding: 12px 20px;
`;

export default FeedbackInputBox;

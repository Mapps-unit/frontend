/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Slider from 'react-slick';
import { feedbackPass } from '../../asset';
import { FeedbackContentsBox, randomColor } from './FeedbackContentsBox';

function MyfeedbackList({ myFeedbacks, myInfo }) {
  let prevColorIndex = null;
  function SampleNextArrow({ onClick }) {
    return (
      <button
        type='button'
        style={{
          position: 'absolute',
          top: 'calc(50% - 10px)',
          right: '5.5px',
          zIndex: 2,
          display: 'block',
          width: '11px',
          height: '20px',
          outline: '0px',
          border: '0px',
        }}
        onClick={onClick}
        onKeyUp={() => {}}
      >
        <img alt='pass button' src={feedbackPass} style={{ width: '11px' }} />
      </button>
    );
  }

  function SamplePrevArrow() {
    return <></>;
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div css={[ContentBox]}>
      <p css={[nicknameBox]}>{myInfo.nickname}님의 의견</p>
      <div css={[listBox]}>
        <Slider {...settings}>
          {myFeedbacks ? (
            myFeedbacks.map((Feedback) => {
              prevColorIndex = randomColor(prevColorIndex);
              return (
                <div key={Feedback.feedback_seq} css={[listItem]}>
                  <FeedbackContentsBox
                    Feedback={Feedback}
                    colorIndex={prevColorIndex}
                    isMinePublic={Feedback.public}
                  />
                </div>
              );
            })
          ) : (
            <p>{myInfo.nickname}님의 의견을 불러오는 중입니다.</p>
          )}
        </Slider>
      </div>
    </div>
  );
}

const ContentBox = css`
  display: flex;
  margin: 20px 20px 17.25px;
  box-sizing: border-box;
  flex-direction: column;
`;

const nicknameBox = css`
  margin-bottom: 9.86px;
  font-size: 14.8px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
`;

const listBox = css`
  width: 100%;
  min-height: 150px;
  padding: 1px 8.3px 0px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
  box-sizing: border-box;
`;

const listItem = css`
  margin: 14.784px 7.7px;
  height: 135.52px;
  width: calc(100% - 15.4px) !important;
  overflow: hidden;
`;

export default MyfeedbackList;

/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { BlockDrag, OrangeColorButton } from '../../styles/GlobalStyles';

function DoubleButtonPopUp(props) {
  const { confirmFunction, close, textObject } = props;

  return (
    <div css={[Container]} aria-hidden='true'>
      <div css={[Overlay]} aria-hidden='true'>
        <div css={[PopUpBox]}>
          <div css={[TopText]}>{textObject.topText}</div>
          <div css={[MiddleText]}>{textObject.middleText}</div>
          <div css={[BottomText]}>{textObject.bottomText}</div>
          <div css={ButtonLayout}>
            <button
              css={[ButtonForm, OrangeColorButton, BlockDrag]}
              type='button'
              onClick={confirmFunction}
            >
              확인
            </button>
            <button
              css={[ButtonForm, WhiteButtonColor, BlockDrag]}
              type='button'
              onClick={close}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoubleButtonPopUp;

const Container = css`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Overlay = css`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const PopUpBox = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 345px;
  margin: 15px;
  padding: 10px;
  object-fit: contain;
  border-radius: 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.16);
  background-color: white;
`;

const TopText = css`
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--red-orange, #ff3d00);
  margin-top: 17px;
  margin-bottom: 8px;
`;

const MiddleText = css`
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: var(--red-orange, #ff3d00);
`;

const BottomText = css`
  font-size: 12px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 18px;
  letter-spacing: normal;
  color: var(--black, #000000);
  white-space: pre-line;
  margin-top: 20px;
  margin-bottom: 5px;
`;

const ButtonLayout = css`
  display: flex;
  width: 80%;
  justify-content: space-evenly;
`;

const ButtonForm = css`
  width: 105px;
  height: 28px;
  font-size: 12px;
  text-align: center;
  border: none;
  border-radius: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 7px 30px 7px 30px;
  :hover:enabled {
    opacity: 0.8;
    cursor: pointer;
  }
`;

const WhiteButtonColor = css`
  color: #707070;
  border: solid 1px #707070;
  background-color: white;
  &:hover {
    background-color: #eee;
  }
`;

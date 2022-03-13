/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import {
  COLOR_STYLE,
  commonBtn,
  FlexColCenter,
  FlexSpaceBetween,
  InitButtonStyle,
  OrangeColorButton,
  RoundButtonSmall,
  getAbsoluteBtn,
  SHADOW_STYLE,
  BasicInputStyle,
} from '../../../styles/GlobalStyles';
import { useInitWidget, usePostImage } from '../../../hooks/widget';
import { TYPE_IMAGE } from '../../../utils/constantValue';
import { closeSet } from '../../../asset';

function PopImage(props) {
  const { label, endPop } = props;
  const [submitted, setSubmitted] = useState(false);
  const [isLocalUpload, setIsLocalUpload] = useState(true);
  const [thumbnail, setThumbnail] = useState('');
  const [localFiles, setLocalFiles] = useState(null);
  const { s3url, request } = usePostImage();

  const { init } = useInitWidget();

  const handleSubmit = () => {
    if (isLocalUpload && localFiles) {
      request(localFiles);
    }
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted && thumbnail) {
      init({ type: TYPE_IMAGE, data: { thumbnail } });
      endPop();
    }
  }, [thumbnail, submitted]);

  const handleThumbChange = ({ target: { value } }) => {
    setThumbnail(value);
  };

  useEffect(() => {
    if (s3url) {
      setThumbnail(s3url);
    }
  }, [s3url]);

  const handleLocalUpload = ({ target: { files } }) => {
    setLocalFiles(files);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const { btn, img } = getAbsoluteBtn(25, 42, 25);

  return (
    <div css={[Container]}>
      <div css={PopupHeader}>
        <p css={[PopupLabel]}>{label}</p>
        <button
          type='button'
          css={[commonBtn, btn]}
          onClick={() => {
            endPop();
          }}
        >
          <div css={img}>
            <img alt='img' height='50px' src={closeSet} />
          </div>
        </button>
      </div>

      <div css={[PopupColumnWrapper]}>
        <button
          type='button'
          css={[InitButtonStyle, ChangeModeButton, textColor(isLocalUpload)]}
          onClick={() => setIsLocalUpload(true)}
        >
          내 컴퓨터에서 업로드
        </button>
        <button
          type='button'
          css={[InitButtonStyle, ChangeModeButton, textColor(!isLocalUpload)]}
          onClick={() => setIsLocalUpload(false)}
        >
          링크로 업로드
        </button>
      </div>
      <div css={[Line]} />
      <div css={[PopUpBody]}>
        {!isLocalUpload && (
          <input
            type='thumbnail'
            name='thumbnail'
            value={thumbnail}
            css={[urlInputStyle]}
            placeholder='링크를 입력해주세요'
            onChange={handleThumbChange}
            onKeyDown={handleKeyDown}
          />
        )}
        {isLocalUpload && (
          <input
            type='file'
            name='imgae_file'
            accept='image/png, image/jpeg, image/gif'
            css={urlInputStyle}
            onChange={handleLocalUpload}
          />
        )}

        <button
          type='button'
          css={[InitButtonStyle, OrangeColorButton, RoundButtonSmall]}
          onClick={() => {
            handleSubmit();
          }}
        >
          업로드
        </button>
      </div>
    </div>
  );
}

const Container = css`
  ${FlexColCenter}
  ${SHADOW_STYLE.pale}
  width: 100%;
  margin: 30px 0 20px 0;
`;

const PopupHeader = css`
  margin-bottom: 35px;
  height: 20px;
`;

const PopupLabel = css`
  font-family: NotoSansCJKKR;
  font-size: 1.3rem;
  font-weight: 800;
`;

const PopupColumnWrapper = css`
  ${FlexSpaceBetween}
  width: 80%;
  margin: 0;
`;
const Line = css`
  border-bottom: solid;
  border-bottom-width: 1px;
  border-bottom-color: #c9c9c9;
  width: 100%;
`;
const PopUpBody = css`
  ${PopupColumnWrapper}
  height: 60px;
  align-items: center;
  margin-top: 30px;
`;

const urlInputStyle = css`
  ${BasicInputStyle}
  width: 80%;
  height: 24px;
  margin: 28px 15px 32px 0;
  padding: 8px 17px;
`;

function textColor(selected) {
  if (selected === true) {
    return css`
      color: ${COLOR_STYLE.black};
      border-bottom: 2px solid;
    `;
  } else {
    return css`
      color: ${COLOR_STYLE.brownishGrey};
    `;
  }
}

const ChangeModeButton = css`
  font-weight: 600;
  font-size: 1rem;
  padding: 5px 8%;
  display: block;
  margin: 0px;
`;

export default PopImage;

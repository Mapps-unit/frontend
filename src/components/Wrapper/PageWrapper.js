import React from 'react';
import { css } from '@emotion/css';

const PageWrapper = ({ children }) => (
  <div
    className={css`
      display: flex;
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      background-color: rightgrey;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    `}
  >
    {children}
  </div>
);

export default PageWrapper;

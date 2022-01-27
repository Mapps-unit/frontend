import React from 'react';
import { css } from '@emotion/css';

const EditWrapper = ({ children }) => (
  <div
    className={css`
      width: 100%;
      margin-left: auto;
      margin-right: auto;
    `}
  >
    {children}
  </div>
);

export default EditWrapper;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
  ToolBarButton,
  HeaderWrapper,
  ToolBarGroup,
  ToolBarPartition,
  BasicButton,
} from '..';
import postWidgetsInfo from '../../api/postWidgetsInfo';
import SaveEditPageData from '../../pages/SaveEditPageData';
import {
  createReplacementModalAction,
  createReplacementWidgetsAction,
} from '../../redux/slice';
import { convertForServer } from '../../utils/convert';

function ToolBar({ setIsPop }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { widgets, modal } = useSelector((state) => ({
    widgets: state.info.widgets,
    modal: state.info.modal,
  }));

  const new_widget_button_list = [
    {
      key: 0,
      label: '그림',
      emoji: '🖼',
      type: 'image',
      onClick: () => {
        dispatch(
          createReplacementModalAction({
            ...modal,
            popUpWindow: true,
          })
        );
        console.log('add image');
      },
    },
    {
      key: 1,
      label: '영상',
      emoji: '📼',
      type: 'video',
      onClick: () => {
        setIsPop({ on: 1, type: 'video' });
      },
    },
    {
      key: 2,
      label: '투두리스트',
      emoji: '✍️',
      type: 'todo',
      onClick: () => {
        setIsPop({ on: 1, type: 'todo' });
      },
    },
    {
      key: 3,
      label: '달력',
      emoji: '📆',
      type: 'calendar',
      onClick: () => {
        setIsPop({ on: 1, type: 'calendar' });
      },
    },
    {
      key: 4,
      label: '텍스트',
      emoji: 'T',
      type: 'text',
      onClick: () => {
        setIsPop({ on: 1, type: 'text' });
      },
    },
    {
      key: 5,
      label: '시계',
      emoji: '⏰',
      type: 'clock',
      onClick: () => {
        setIsPop({ on: 1, type: 'clock' });
      },
    },
    {
      key: 6,
      label: '방명록',
      emoji: '🙋‍♀️',
      type: 'todo',
      onClick: () => {
        setIsPop({ on: 1, type: 'guest book' });
      },
    },
  ];

  const NewWidgetButtons = new_widget_button_list.map((tool) => (
    <ToolBarButton
      key={tool.key}
      action={tool.onClick}
      emoji={tool.emoji}
      type={tool.type}
      label={tool.label}
    />
  ));

  const essential_button_list = [
    {
      key: 0,
      label: '미리보기',
      emoji: '🕶',
      type: 'preview',
      onClick: () => alert('미리보기 액션'),
    },
    {
      key: 1,
      label: '휴지통',
      emoji: '🗑',
      type: 'trash',
      onClick: () => alert('휴지통 액션'),
    },
  ];
  const EssentialButtons = essential_button_list.map((tool) => (
    <ToolBarButton
      key={tool.key}
      action={tool.onClick}
      emoji={tool.emoji}
      type={tool.type}
      label={tool.label}
    />
  ));

  return (
    <HeaderWrapper>
      <ToolBarGroup>{EssentialButtons}</ToolBarGroup>
      <ToolBarPartition />
      <ToolBarGroup>{NewWidgetButtons}</ToolBarGroup>
      <ToolBarPartition />
      <ToolBarGroup>
        <BasicButton
          label='Save'
          onClick={() => {
            console.log('do post :');
            const postData = convertForServer(widgets.list);
            console.log(postData);
            history.push({
              pathname: '/save',
              state: { postData },
            });
          }}
        />
      </ToolBarGroup>
    </HeaderWrapper>
  );
}

export default ToolBar;

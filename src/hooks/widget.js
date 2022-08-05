import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { createReplacementWidgetsAction } from '../redux/slice';
import { convertForRedux, convertForServer } from '../utils/convert';
// import { useMyInfo } from './myInfo';
import useRequestAuth from './useRequestAuth';
import { getApiEndpoint } from '../utils/util';
import {
  ACTION_CREATE,
  ACTION_EDIT,
  ACTION_NONE,
  TYPE_NEW,
} from '../utils/constantValue';
import { newWidgetHeight, newWidgetWidth } from '../styles/style';

// Type이 정해진 위젯을 수정/추가
export function useInitWidget() {
  const dispatch = useDispatch();
  const { widgets, modal } = useSelector((state) => ({
    widgets: state.info.widgets,
    modal: state.info.modal,
  }));

  const initWidget = (_type, _data) => {
    const changed = JSON.parse(JSON.stringify(widgets.list));
    const targetId = modal.targetWidgetId;
    const targetItem = changed.find((widget) => widget.i === targetId);

    targetItem.widget_type = _type;
    targetItem.widget_data = _data;
    if (targetItem.widget_action === ACTION_NONE || targetItem._id !== '') {
      targetItem.widget_action = ACTION_EDIT;
    }
    updateRedux(changed);
  };

  const updateRedux = (changed) => {
    if (changed) {
      dispatch(
        createReplacementWidgetsAction({
          count: widgets.count + 1,
          list: changed,
        })
      );
    }
  };

  const init = ({ type, data }) => {
    if (type && data) {
      initWidget(type, data);
    }
  };
  return { init };
}

// save widget data to redux (no need convert)
export function useUpdateWidgetsData() {
  const dispatch = useDispatch();

  const updateWidgets = (newData, type) => {
    if (type === TYPE_NEW)
      dispatch(
        createReplacementWidgetsAction({
          count: newData.length - 1,
          list: newData,
        })
      );
    else
      dispatch(
        createReplacementWidgetsAction({
          count: newData.length,
          list: newData,
        })
      );
  };
  return { updateWidgets };
}

// save widget data from server (need convert)
export function useSaveWidgetsFromServer() {
  const { updateWidgets } = useUpdateWidgetsData();

  const setWidgetState = (widgetList) => {
    const converted = convertForRedux(widgetList);
    updateWidgets(converted);
  };

  const save = (data) => {
    if (data) {
      setWidgetState(data);
    }
  };
  return { save };
}

export function usePostData() {
  const history = useHistory();
  // const { myInfo } = useMyInfo();
  const [postData, setPostData] = useState(null);
  const [pageUrl, setPageUrl] = useState('');
  const { myInfo } = useSelector((state) => ({
    myInfo: state.info.user,
  }));

  const userSeq = useMemo(() => {
    if (myInfo) {
      return myInfo.user_seq;
    }
    return null;
  }, [myInfo]);

  const { res, request } = useRequestAuth({
    endpoint: `${getApiEndpoint()}/user/${userSeq}/widgets/${pageUrl}`,
    method: 'post',
    data: postData,
  });

  useEffect(() => {
    if (postData && userSeq) {
      request();
    }
  }, [postData, userSeq]);

  useEffect(() => {
    if (res && res.data) {
      if (res.data.code === 'wrong_token') {
        history.push(`/main`);
      } else {
        history.push(`/${myInfo ? myInfo.url : '/'}`);
      }
    }
  }, [res]);

  const post = (data, url) => {
    if (data && url) {
      setPageUrl(url);
      setPostData(convertForServer(data));
    }
  };

  return { post };
}

export function usePostImage() {
  const [url, setUrl] = useState(null);
  const [data, setData] = useState(null);

  const { res, request: post } = useRequestAuth({
    endpoint: `${getApiEndpoint()}/local/image`,
    method: 'post',
    data,
    contentType: 'multipart/form-data',
  });

  useEffect(() => {
    if (res && res.data) {
      setUrl(res.data.data.thumbnail);
    }
    return () => {
      setUrl(null);
    };
  }, [res]);

  useEffect(() => {
    if (data) {
      post();
    }
  }, [data]);

  const request = (files) => {
    const formData = new FormData();
    formData.append('image_file', files[0]);
    setData(formData);
  };

  return {
    s3url: url,
    request,
  };
}

// 빈 위젯 위치 업데이트
export function useAddEmptyWidget() {
  const { widgets } = useSelector((state) => ({
    widgets: state.info.widgets,
  }));
  const { updateWidgets } = useUpdateWidgetsData();
  const addEmptyWidget = (mouseOverWidget) => {
    const newWidget = {
      widget_action: ACTION_CREATE,
      _id: '',
      widget_type: TYPE_NEW,
      widget_data: {},
      i: `${widgets.count}`,
      x: mouseOverWidget[0].x,
      y: mouseOverWidget[0].y,
      w: newWidgetWidth,
      h: newWidgetHeight,
      static: false,
    };
    const converted = widgets.list.filter(
      (element) => element.widget_type !== TYPE_NEW
    );
    updateWidgets([...converted, newWidget], TYPE_NEW);
  };
  return {
    addEmptyWidget,
  };
}

export function useReverseStaticWidget() {
  const dispatch = useDispatch();
  const { widgets } = useSelector((state) => ({
    widgets: state.info.widgets,
  }));

  const reverseStaticWidget = (_widgetId, _nextState) => {
    const changed = JSON.parse(JSON.stringify(widgets.list));
    const targetItem = changed.find((widget) => widget.i === _widgetId);
    if (targetItem.widget_action === ACTION_NONE || targetItem._id !== '') {
      targetItem.widget_action = ACTION_EDIT;
    }
    targetItem.static = _nextState;
    updateRedux(changed);
  };

  const updateRedux = (changed) => {
    if (changed) {
      dispatch(
        createReplacementWidgetsAction({
          ...widgets,
          list: changed,
        })
      );
    }
  };

  const reverseStatic = ({ widgetId, nextState }) => {
    if (widgetId && nextState) reverseStaticWidget(widgetId.id, nextState);
  };
  return { reverseStatic };
}

export function useUpdateTextWidgetData() {
  const { modal, widgets } = useSelector((state) => ({
    modal: state.info.modal,
    widgets: state.info.widgets,
  }));
  const dispatch = useDispatch();

  const updateTextData = (changedText) => {
    if (modal.targetWidgetId !== '-1') {
      const changed = JSON.parse(JSON.stringify(widgets.list));
      const targetId = modal.targetWidgetId;
      const targetItem = changed.find((widget) => widget.i === targetId);

      targetItem.widget_data.thumbnail = changedText;
      if (targetItem.widget_action === ACTION_NONE || targetItem._id !== '') {
        targetItem.widget_action = ACTION_EDIT;
      }
      dispatch(
        createReplacementWidgetsAction({
          ...widgets,
          list: changed,
        })
      );
    }
  };

  return { updateTextData };
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useRequestAuth from './useRequestAuth';
import { getApiEndpoint } from '../utils/util';
import { createReplacementUserAction } from '../redux/slice';

export function useSaveMyInfo() {
  const dispatch = useDispatch();

  const updateAll = ({ nickname, url, user_seq, field, profileImage }) => {
    dispatch(
      createReplacementUserAction({
        url,
        field,
        nickname,
        user_seq,
        profileImage,
      })
    );
  };

  const save = (data) => {
    if (data) {
      updateAll(data);
    }
  };

  return {
    save,
  };
}

export function useMyInfo() {
  const { res, request } = useRequestAuth({
    endpoint: `${getApiEndpoint()}/me`,
    method: 'get',
  });
  const { userInfo } = useSelector((state) => ({
    userInfo: state.info.user,
  }));

  const { save } = useSaveMyInfo();
  const [myInfo, setMyInfo] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    if (userInfo.user_seq === -1) {
      request();
    } else {
      setMyInfo(userInfo);
      setLoggedIn(true);
    }
    return () => {
      setMyInfo(null);
    };
  }, [userInfo]);

  useEffect(() => {
    if (res && res.data) {
      if (res.data.code === 'ok') {
        save(res.data.data);
        setMyInfo(res.data.data);
        setLoggedIn(true);
      } else {
        setMyInfo(null);
        setLoggedIn(false);
      }
    }
    return () => {
      setMyInfo(null);
      setLoggedIn(null);
    };
  }, [res]);

  return {
    loggedIn,
    myInfo,
    res,
    request,
  };
}

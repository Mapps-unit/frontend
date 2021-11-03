import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RenderEditPage({ match }) {
  console.log('SaveEditPageData page');
  const { userId } = match.params;
  const accessToken = localStorage.getItem('access_token');

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const endPoint = `http://${process.env.REACT_APP_SERVER_DOMAIN}/user/${userId}/edit`;
  const fetchTokens = async () => {
    try {
      setError(null);
      setData(null);
      setLoading(true);
      const response = await axios.post(postData, endPoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.code === 419) {
        setData(response.data.code);
      } else if (response.data.code === 401) {
        setData(response.data.code);
      } else {
        console.log('response data:', response.data);
        setData(response.data);
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  if (loading) {
    return <div>로딩중..</div>;
  }
  if (error) {
    return <div>에러가 발생했습니다.</div>;
  }
  // access_token 만료의 경우
  if (data === 419) {
    window.location.assign('/auth/token/refresh');
    return <div> 토큰이 만료되었습니다. </div>;
  } else if (data === 401) {
    return <div> 로그인을 다시 하세요. </div>;
  }
  if (!data) {
    return null;
  }
  return <div />;
}

export default RenderEditPage;
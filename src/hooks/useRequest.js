import axios from 'axios';
import { useCallback, useState } from 'react';

export function useRequest({ endpoint, method, headers, data }) {
  const [resultRes, setRes] = useState(null);

  const request = useCallback(() => {
    let axiosPromise;
    if (method === 'get') {
      axiosPromise = axios.get(endpoint, {
        headers,
        params: data,
      });
    } else if (method === 'post') {
      axiosPromise = axios.post(endpoint, data, {
        headers,
      });
    }

    axiosPromise
      .then((res) => {
        setRes(res);
      })
      .catch(() => {
        setRes({
          data: {
            code: 'error',
            message: '404 not found-server connection failed',
          },
        });
      });
  }, [endpoint, method, headers, data]);

  return { res: resultRes, request };
}

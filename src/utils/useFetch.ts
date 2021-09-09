import {Reducer, useEffect, useReducer} from 'react';

export interface FetchState<T> {
  loading: boolean;
  error?: unknown;
  data?: T;
}

type Action<T> =
  | {
      type: 'init' | 'start';
    }
  | {
      type: 'data';
      data: T;
    }
  | {
      type: 'error';
      error: unknown;
    };

const initialState: FetchState<any> = {
  loading: false, // データ取得中はtrueに設定される
  error: undefined, // データ取得でエラーになると設定される
  data: undefined, // データ取得結果が設定される
};

function reducer<T>(state: FetchState<T>, action: Action<T>): FetchState<T> {
  switch (action.type) {
    case 'init': // 初期状態に戻す
      return initialState;
    case 'start': // データ取得を開始する
      return {...state, loading: true};
    case 'data': // データ取得が正常終了する
      return {...state, loading: false, data: action.data};
    case 'error': // データ取得がエラー終了する
      return {...state, loading: false, error: action.error};
    default:
      // それ以外は起こりえないのでバグ検知のためthrow
      throw new Error('no such action type');
  }
}

const defaultParser = async (res: Response) => await res.json();

export function useFetch<T>(
  url: string,
  opts: RequestInit = {},
  parser: (res: Response) => Promise<T> = defaultParser,
): FetchState<T> {
  const [state, dispatch] = useReducer<Reducer<FetchState<T>, Action<T>>>(
    reducer,
    initialState,
  );
  useEffect(() => {
    let dispatchSafe = (action: Action<T>) => dispatch(action); // cleanupで無効にするため
    const abortController = new AbortController(); // cleanupでabortするため
    (async () => {
      if (!url) {
        return;
      }
      dispatchSafe({type: 'start'});
      try {
        const response = await fetch(url, {
          ...opts,
          signal: abortController.signal,
        });
        if (response.ok) {
          const body = await parser(response);
          dispatchSafe({type: 'data', data: body});
        } else {
          const e = new Error(`Fetch failed: ${response.statusText}`);
          dispatchSafe({type: 'error', error: e});
        }
      } catch (e) {
        dispatchSafe({type: 'error', error: e});
      }
    })();
    const cleanup = () => {
      dispatchSafe = () => null; // we should not dispatch after unmounted.
      abortController.abort();
      dispatch({type: 'init'});
    };
    return cleanup;
  }, [url, opts, parser]);
  return state;
}

type ApiCallExceptionType<T = never> = {
  detail: string & DetailBodyType<T>[];
};

type DetailBodyType<T> = {
  type: string;
  loc: string[];
  msg: string;
  input: T;
  url: string;
};

export default ApiCallExceptionType;

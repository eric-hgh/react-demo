import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
    code: number;
    msg: string
}
 
// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
    data?: T;
}
const URL = "http://localhost:53000"
enum RequestEnums {
    TIMEOUT = 20000,
    OVERDUE = 600, // 登录失效
    FAIL = 999, // 请求失败
    SUCCESS = 200, // 请求成功
}
const config = {
    // 默认地址
    baseURL: URL as string,
    // 设置超时时间
    // timeout: RequestEnums.TIMEOUT as number,
    // 跨域时候允许携带凭证
    // withCredentials: true
}
class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config);
        /**
         * 请求拦截器
         * 客户端发送请求 -> [请求拦截器] -> 服务器
         */
        this.service.interceptors.request.use(
            (config: AxiosRequestConfig | any) => {
                const token = localStorage.getItem('token') || '';
                return {
                    ...config,
                    headers: {
                        // 'x-access-token': token, // 请求头中携带token信息
                    }
                }
            },
            (error: AxiosError) => {
                // 请求报错
                Promise.reject(error)
            }
        )
 
        /**
         * 响应拦截器
         * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response; // 解构
                if (data.code === RequestEnums.OVERDUE) {
                    // 登录信息失效，应跳转到登录页面，并清空本地的token
                    localStorage.setItem('token', '');
                    return Promise.reject(response);
                }
                // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
                if (data.code && data.code !== RequestEnums.SUCCESS) {
                  message.error(data); // 此处也可以使用组件提示报错信息
                    return Promise.reject(response)
                }
                return response;
            },
            (error: AxiosError) => {
                const { response } = error;
                if (response) {
                    this.handleCode(response.status)
                }
                if (!window.navigator.onLine) {
                  message.error('网络连接失败');
                    // 可以跳转到错误页面，也可以不做操作
                    // return router.replace({
                    //   path: '/404'
                    // });
                }
            }
        )
    }
    handleCode(code: number): void {
        switch (code) {
            case 400:
              message.error("请求错误(400)");
                break;
            case 401:
              message.error("未授权，请重新登录(401)");
                break;
            case 403:
              message.error("拒绝访问(403)");
                break;
            case 404:
              message.error("请求出错(404)");
                break;
            case 408:
              message.error("请求超时(408)");
                break;
            case 500:
              message.error("服务器错误(500)");
                break;
            case 501:
              message.error("服务未实现(501)");
                break;
            case 502:
              message.error("网络错误(502)");
                break;
            case 503:
              message.error("服务不可用(503)");
                break;
            case 504:
              message.error("网络超时(504)");
                break;
            case 505:
              message.error("HTTP版本不受支持(505)");
                break;
            default:
              message.error(`连接出错(${code})!`);
                break;
        }
    }
    // 常用方法封装
    request<T>(config:AxiosRequestConfig): Promise<ResultData<T>> {
      return this.service.request(config);
    }

    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, { params });
    }
    post<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, params);
    }
    put<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.put(url, params);
    }
    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.delete(url, { params });
    }
}
// 导出一个实例对象
export default new RequestHttp(config);

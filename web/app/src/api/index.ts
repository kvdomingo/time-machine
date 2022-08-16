import { ReactElement, useEffect } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useDispatch, useSelector } from "../store/hooks";
import {
  selectLoggedIn,
  updateApiRequestLoading,
  updateGlobalNotification,
  updateLoggedIn,
  updateUser,
} from "../store/timeSlice";
import { UserLogin, UserResponse, UserSignup } from "./types/auth";
import { CheckInForm, CheckInResponse } from "./types/checkIn";

const baseURL = "/api";

const axi = axios.create({ baseURL, xsrfCookieName: "csrftoken", xsrfHeaderName: "X-CSRFToken" });

const api = {
  auth: {
    login(body: UserLogin): Promise<AxiosResponse<UserResponse>> {
      return axi.post("/auth/login", new URLSearchParams({ ...body }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    },
    refresh(): Promise<AxiosResponse> {
      return axi.get("/auth/refresh");
    },
    getUser(): Promise<AxiosResponse<UserResponse>> {
      return axi.get("/auth/user");
    },
    signUp(body: UserSignup): Promise<AxiosResponse<UserResponse>> {
      return axi.post("/auth/signup", new URLSearchParams({ ...body }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    },
    logout(): Promise<AxiosResponse> {
      return axi.get("/auth/logout");
    },
  },
  checkin: {
    list(): Promise<AxiosResponse<CheckInResponse[]>> {
      return axi.get("/checkin");
    },
    listAll(): Promise<AxiosResponse<CheckInResponse[]>> {
      return axi.get("/checkin/admin");
    },
    get(id: string): Promise<AxiosResponse<CheckInResponse>> {
      return axi.get(`/checkin/${id}`);
    },
    create(body: CheckInForm): Promise<AxiosResponse<CheckInResponse>> {
      return axi.post("/checkin", body);
    },
    update(id: string, body: CheckInForm): Promise<AxiosResponse<CheckInResponse>> {
      return axi.put(`/checkin/${id}`, body);
    },
    delete(id: string): Promise<AxiosResponse> {
      return axi.delete(`/checkin/${id}`);
    },
  },
};

export default api;

export function AxiosInterceptorProvider(props: { children: ReactElement }) {
  const dispatch = useDispatch();
  const loggedIn = useSelector(selectLoggedIn);

  useEffect(() => {
    function requestFulfilledInterceptor(config: AxiosRequestConfig) {
      dispatch(updateApiRequestLoading(true));
      return config;
    }

    function requestRejectedInterceptor(error: AxiosError) {
      return Promise.reject(error);
    }

    function responseFulfilledInterceptor(response: AxiosResponse) {
      dispatch(updateApiRequestLoading(false));
      return response;
    }

    async function responseRejectedInterceptor(error: AxiosError) {
      dispatch(updateApiRequestLoading(false));
      const { status } = error.response!;
      if (axios.isCancel(error)) {
        return Promise.reject(error);
      } else if (status === 401) {
        try {
          await api.auth.refresh();
          try {
            let res = await axi.request(error.config);
            return Promise.resolve(res);
          } catch (e) {
            return Promise.reject(e);
          }
        } catch (e) {
          api.auth.logout().finally(() => {
            dispatch(updateLoggedIn(false));
            dispatch(updateUser(null));
          });
        }
      } else if (400 <= status && status < 500 && loggedIn) {
        dispatch(
          updateGlobalNotification({
            type: "error",
            message: "An error occurred. Please try again later.",
            visible: true,
          }),
        );
      } else if (status >= 500) {
        dispatch(
          updateGlobalNotification({
            type: "error",
            message: "An error occurred. Please try again later.",
            visible: true,
          }),
        );
      }
      console.error(error);
      return Promise.reject(error);
    }

    const reqInterceptId = axi.interceptors.request.use(requestFulfilledInterceptor, requestRejectedInterceptor);
    const resInterceptId = axi.interceptors.response.use(responseFulfilledInterceptor, responseRejectedInterceptor);

    return () => {
      axi.interceptors.request.eject(reqInterceptId);
      axi.interceptors.response.eject(resInterceptId);
    };
  }, [dispatch, loggedIn]);

  return props.children;
}

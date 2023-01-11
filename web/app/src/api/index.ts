import { ReactElement, useEffect } from "react";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useDispatch } from "../store/hooks";
import { updateApiRequestLoading, updateGlobalNotification } from "../store/timeSlice";
import { CheckInForm, CheckInResponse, PaginatedResponse } from "./types/checkIn";

const baseURL = "/api";

const axi = axios.create({ baseURL, xsrfCookieName: "csrftoken", xsrfHeaderName: "X-CSRFToken" });

const api = {
  checkin: {
    list(): Promise<AxiosResponse<PaginatedResponse<CheckInResponse[]>>> {
      return axi.get("/checkin");
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
      } else if (status > 400) {
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
  }, [dispatch]);

  return props.children;
}

import { useEffect } from "react";
import api from "../api";
import { useDispatch, useSelector } from "../store/hooks";
import {
  selectEndDate,
  selectStartDate,
  updateCheckIns,
  updateCount,
  updateTagCache,
  updateTextLog,
} from "../store/timeSlice";

export default function useFetchCheckIns() {
  const dispatch = useDispatch();
  const startDate = useSelector(selectStartDate);
  const endDate = useSelector(selectEndDate);

  function fetchCheckIns(page: number = 1) {
    api.checkin
      .list(page, startDate, endDate)
      .then(res => {
        dispatch(updateCheckIns(res.data.results));
        dispatch(updateCount(res.data.count));
        dispatch(updateTagCache([...new Set(res.data.results.map(c => c.tag))]));
      })
      .catch(err => console.error(err.message));

    api.checkin
      .log(startDate, endDate)
      .then(res => {
        dispatch(updateTextLog(res.data));
      })
      .catch(err => console.error(err.message));
  }

  return fetchCheckIns;
}

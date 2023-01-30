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
      })
      .catch(err => console.error(err.message));

    api.checkin
      .log(startDate, endDate)
      .then(res => {
        dispatch(updateTextLog(res.data));
      })
      .catch(err => console.error(err.message));

    api.tagCache
      .list()
      .then(res => {
        dispatch(updateTagCache(res.data));
      })
      .catch(err => console.error(err.message));
  }

  return fetchCheckIns;
}

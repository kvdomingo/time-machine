import api from "../api";
import { useDispatch, useSelector } from "../store/hooks";
import {
  selectCombineTags,
  selectEndDate,
  selectSelectedTag,
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
  const tag = useSelector(selectSelectedTag);
  const combineTags = useSelector(selectCombineTags);

  function fetchCheckIns(page: number = 1) {
    api.checkin
      .list(page, startDate, endDate, tag)
      .then(res => {
        dispatch(updateCheckIns(res.data.results));
        dispatch(updateCount(res.data.count));
      })
      .catch(err => console.error(err.message));

    api.checkin
      .log(startDate, endDate, tag, combineTags)
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

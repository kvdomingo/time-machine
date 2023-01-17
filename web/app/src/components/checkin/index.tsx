import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { AccessTime, ArrowDropDown, Clear, FilterAlt } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import api from "../../api";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectTextLog, updateCheckIns, updateTextLog } from "../../store/timeSlice";
import { ViewOption } from "../../types/dateRangeViewOption";
import { DEFAULT_DATE_FORMAT } from "../../utils/constants";
import CheckInList from "./CheckInList";
import TextLog from "./TextLog";

const VIEW_OPTIONS: ViewOption[] = [
  {
    label: "Today",
    value: "day",
    start: moment().startOf("day"),
    end: moment().endOf("day"),
  },
  {
    label: "This week",
    value: "week",
    start: moment().startOf("isoWeek"),
    end: moment().endOf("day"),
  },
  {
    label: "This month",
    value: "month",
    start: moment().startOf("month"),
    end: moment().endOf("day"),
  },
  {
    label: "Custom",
    value: "custom",
    start: moment().startOf("day"),
    end: moment().endOf("day"),
  },
];

function CheckInView() {
  const textLog = useSelector(selectTextLog);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [tagCache, setTagCache] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<ViewOption>(VIEW_OPTIONS[0]);
  const [openPeriodSelectMenu, setOpenPeriodSelectMenu] = useState(false);
  const [customRangeStart, setCustomRangeStart] = useState(moment().startOf("isoWeek"));
  const [customRangeEnd, setCustomRangeEnd] = useState(moment().endOf("day"));
  const periodSelectorRef = useRef<any>(null!);

  useEffect(() => {
    fetchCheckIns();
  }, [selectedPeriod]);

  function fetchCheckIns(_page: number = page) {
    api.checkin
      .list(
        _page,
        selectedPeriod.value === "custom"
          ? customRangeStart.format(DEFAULT_DATE_FORMAT)
          : selectedPeriod.start.format(DEFAULT_DATE_FORMAT),
        selectedPeriod.value === "custom"
          ? customRangeEnd.format(DEFAULT_DATE_FORMAT)
          : selectedPeriod.end.format(DEFAULT_DATE_FORMAT),
      )
      .then(res => {
        dispatch(updateCheckIns(res.data.results));
        setCount(res.data.count);
        setTagCache([...new Set(res.data.results.map(c => c.tag))]);
      })
      .catch(err => console.error(err.message));

    api.checkin
      .log(
        selectedPeriod.value === "custom"
          ? customRangeStart.format(DEFAULT_DATE_FORMAT)
          : selectedPeriod.start.format(DEFAULT_DATE_FORMAT),
        selectedPeriod.value === "custom"
          ? customRangeEnd.format(DEFAULT_DATE_FORMAT)
          : selectedPeriod.end.format(DEFAULT_DATE_FORMAT),
      )
      .then(res => {
        dispatch(updateTextLog(res.data));
      })
      .catch(err => console.error(err.message));
  }

  function calculateCheckInHours() {
    return Object.values(textLog)
      .flat()
      .map(t => t.duration)
      .reduce((acc, val) => acc + val, 0);
  }

  return (
    <>
      <Helmet>
        <title>Time Machine</title>
      </Helmet>
      <Grid container spacing={2} my={2}>
        <Grid item md={8}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item md={12}>
              <ButtonGroup variant="text" ref={periodSelectorRef}>
                <Button
                  onClick={() => setOpenPeriodSelectMenu(open => !open)}
                  startIcon={<AccessTime />}
                  endIcon={<ArrowDropDown />}
                >
                  View: {selectedPeriod.label}
                </Button>
              </ButtonGroup>
              <Popper
                open={openPeriodSelectMenu}
                anchorEl={periodSelectorRef.current}
                transition
                disablePortal
                sx={{ zIndex: 99 }}
              >
                {({ TransitionProps }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={() => setOpenPeriodSelectMenu(false)}>
                        <MenuList autoFocusItem>
                          {VIEW_OPTIONS.map(v => (
                            <MenuItem
                              selected={v.value === selectedPeriod.value}
                              onClick={() => {
                                setSelectedPeriod(v);
                                setOpenPeriodSelectMenu(false);
                              }}
                            >
                              {v.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </Grid>
            {selectedPeriod.value === "custom" && (
              <>
                <Grid item md>
                  <DatePicker
                    onChange={value => setCustomRangeStart(value!.startOf("day"))}
                    value={customRangeStart}
                    renderInput={params => <TextField {...params} fullWidth label="Start date" />}
                    disableFuture
                  />
                </Grid>
                <Grid item md>
                  <DatePicker
                    onChange={value => setCustomRangeEnd(value!.endOf("day"))}
                    value={customRangeEnd}
                    renderInput={params => <TextField {...params} fullWidth label="End date" />}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item md={4}>
          Going on{" "}
          <b>
            {calculateCheckInHours().toFixed(2)} hour{calculateCheckInHours() !== 1 && "s"}
          </b>
        </Grid>
        <Grid item md={8}>
          <CheckInList count={count} page={page} setPage={setPage} fetchCheckIns={fetchCheckIns} tagCache={tagCache} />
        </Grid>
        <Grid item md={4}>
          {/*<Stats checkIns={filteredCheckIns} byTag={!!selectedTag} />*/}
          <TextLog />
        </Grid>
      </Grid>
    </>
  );
}

export default CheckInView;

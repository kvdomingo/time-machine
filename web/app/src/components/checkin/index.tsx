import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { AccessTime, ArrowDropDown } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grid,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";
import useFetchCheckIns from "../../hooks/useFetchCheckIns";
import { useDispatch, useSelector } from "../../store/hooks";
import { selectStartDate, selectTextLog, updateEndDate, updateStartDate } from "../../store/timeSlice";
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
  const dispatch = useDispatch();
  const textLog = useSelector(selectTextLog);
  const fetchCheckIns = useFetchCheckIns();
  const [page, setPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<ViewOption>(VIEW_OPTIONS[0]);
  const [openPeriodSelectMenu, setOpenPeriodSelectMenu] = useState(false);
  const [customRangeStart, setCustomRangeStart] = useState(moment().startOf("isoWeek"));
  const [customRangeEnd, setCustomRangeEnd] = useState(moment().endOf("day"));
  const periodSelectorRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    fetchCheckIns(page);
  }, [selectedPeriod, customRangeStart, customRangeEnd]);

  function calculateCheckInHours() {
    return Object.values(textLog)
      .flat()
      .map(t => t.duration)
      .reduce((acc, val) => acc + val, 0);
  }

  function handleChangeViewPeriod(viewPeriod: ViewOption) {
    setSelectedPeriod(viewPeriod);
    setOpenPeriodSelectMenu(false);
    dispatch(
      updateStartDate(
        viewPeriod.value === "custom"
          ? customRangeStart.format(DEFAULT_DATE_FORMAT)
          : viewPeriod.start.format(DEFAULT_DATE_FORMAT),
      ),
    );
    dispatch(
      updateEndDate(
        viewPeriod.value === "custom"
          ? customRangeEnd.format(DEFAULT_DATE_FORMAT)
          : viewPeriod.end.format(DEFAULT_DATE_FORMAT),
      ),
    );
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
                              key={v.value}
                              selected={v.value === selectedPeriod.value}
                              onClick={() => handleChangeViewPeriod(v)}
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
                    onChange={value => {
                      const start = value!.startOf("day");
                      setCustomRangeStart(start);
                      dispatch(updateStartDate(start.format(DEFAULT_DATE_FORMAT)));
                    }}
                    value={customRangeStart}
                    renderInput={params => <TextField {...params} fullWidth label="Start date" />}
                    disableFuture
                  />
                </Grid>
                <Grid item md>
                  <DatePicker
                    onChange={value => {
                      const end = value!.endOf("day");
                      setCustomRangeEnd(end);
                      dispatch(updateEndDate(end.format(DEFAULT_DATE_FORMAT)));
                    }}
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
          <CheckInList page={page} setPage={setPage} />
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

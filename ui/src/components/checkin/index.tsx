import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet";

import { AccessTime, ArrowDropDown } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  FormControlLabel,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import moment, { Moment } from "moment";
import pluralize from "pluralize";

import Stats from "@/components/checkin/Stats.tsx";
import { useDispatch, useSelector } from "@/store/hooks.ts";
import {
  selectCheckIns,
  selectCombineTags,
  selectTextLog,
  updateCombineTags,
  updateEndDate,
  updateStartDate,
} from "@/store/timeSlice.ts";
import { ViewOption } from "@/types/dateRangeViewOption.ts";
import { DEFAULT_DATE_FORMAT } from "@/utils/constants.ts";

import useFetchCheckIns from "../../hooks/useFetchCheckIns";
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
  const checkIns = useSelector(selectCheckIns);
  const textLog = useSelector(selectTextLog);
  const combineTags = useSelector(selectCombineTags);
  const fetchCheckIns = useFetchCheckIns();
  const [page, setPage] = useState(1);
  const [selectedPeriod, setSelectedPeriod] = useState<ViewOption>(
    VIEW_OPTIONS[0],
  );
  const [openPeriodSelectMenu, setOpenPeriodSelectMenu] = useState(false);
  const [customRangeStart, setCustomRangeStart] = useState(
    moment().startOf("isoWeek"),
  );
  const [customRangeEnd, setCustomRangeEnd] = useState(moment().endOf("day"));
  const periodSelectorRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    fetchCheckIns(page);
  }, [selectedPeriod, customRangeStart, customRangeEnd, combineTags]);

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

  function handleChangeStartDate(value: Moment | null) {
    const start = value!.startOf("day");
    setCustomRangeStart(start);
    dispatch(updateStartDate(start.format(DEFAULT_DATE_FORMAT)));
  }

  function handleChangeEndDate(value: Moment | null) {
    const end = value!.endOf("day");
    setCustomRangeEnd(end);
    dispatch(updateEndDate(end.format(DEFAULT_DATE_FORMAT)));
  }

  const checkInHours = useMemo(
    () =>
      Object.values(textLog)
        .flat()
        .reduce(
          (prevCheckin, currentCheckin) =>
            prevCheckin + currentCheckin.duration,
          0,
        ),
    [textLog],
  );

  const remainingHours = useMemo(() => 8 - checkInHours, [checkInHours]);

  return (
    <>
      <Helmet>
        <title>Time Machine</title>
      </Helmet>
      <div className="my-4 grid grid-cols-3 gap-4">
        <div className="col-span-3 md:col-span-2">
          <div className="grid grid-cols-2 items-center gap-2">
            <div className="col-span-2">
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
                className="z-10"
              >
                {({ TransitionProps }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: "left bottom",
                    }}
                  >
                    <Paper>
                      <ClickAwayListener
                        onClickAway={() => setOpenPeriodSelectMenu(false)}
                      >
                        <MenuList autoFocusItem>
                          {VIEW_OPTIONS.map(option => (
                            <MenuItem
                              key={option.value}
                              selected={option.value === selectedPeriod.value}
                              onClick={() => handleChangeViewPeriod(option)}
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
            {selectedPeriod.value === "custom" && (
              <>
                <div>
                  <DatePicker
                    onChange={handleChangeStartDate}
                    value={customRangeStart}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        label: "Start date",
                      },
                    }}
                  />
                </div>
                <div>
                  <DatePicker
                    onChange={handleChangeEndDate}
                    value={customRangeEnd}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        label: "End date",
                      },
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="col-span-3 mt-auto md:col-span-1" />
        <div className="col-span-3">
          <CheckInList page={page} setPage={setPage} />
        </div>
      </div>
      <div className="my-8 grid grid-cols-2">
        <div className="col-span-2 md:col-span-1">
          <div className="flex">
            <div>
              <p>
                Going on{" "}
                <b>
                  {checkInHours.toFixed(2)} {pluralize("hour", checkInHours)}
                </b>
              </p>
              <p>
                Remaining{" "}
                <b>
                  {remainingHours.toFixed(2)}{" "}
                  {pluralize("hour", remainingHours)}
                </b>
              </p>
            </div>
            <div className="my-auto ml-auto">
              <FormControlLabel
                control={
                  <Switch
                    checked={combineTags}
                    onChange={(_, checked) =>
                      dispatch(updateCombineTags(checked))
                    }
                  />
                }
                label="Combine tags"
              />
            </div>
          </div>
          <TextLog />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Stats checkIns={checkIns} />
        </div>
      </div>
    </>
  );
}

export default CheckInView;

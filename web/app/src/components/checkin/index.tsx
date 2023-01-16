import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { AccessTime, ArrowDropDown, Clear, FilterAlt } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  FormControlLabel,
  Grid,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Switch,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { cloneDeep } from "lodash-es";
import moment from "moment";
import { useSelector } from "../../store/hooks";
import { selectCheckIns, selectTextLog } from "../../store/timeSlice";
import { ViewOption } from "../../types/dateRangeViewOption";
import CheckInList from "./CheckInList";
import TextLog from "./TextLog";

function CheckInView() {
  const viewOptions: ViewOption[] = [
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
  const checkIns = useSelector(selectCheckIns);
  const textLog = useSelector(selectTextLog);
  const [groupCheckInTags, setGroupCheckInTags] = useState(true);
  const [filteredCheckIns, setFilteredCheckIns] = useState(cloneDeep(checkIns));
  const [selectedPeriod, setSelectedPeriod] = useState<ViewOption>(viewOptions[0]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [openPeriodSelectMenu, setOpenPeriodSelectMenu] = useState(false);
  const [customRangeStart, setCustomRangeStart] = useState(moment().startOf("isoWeek"));
  const [customRangeEnd, setCustomRangeEnd] = useState(moment().endOf("day"));
  const periodSelectorRef = useRef<any>(null!);

  useEffect(() => {
    let filtered: typeof checkIns;
    switch (selectedPeriod.value) {
      case "day": {
        filtered = checkIns.filter(
          c =>
            moment(c.created).isSameOrAfter(selectedPeriod.start) &&
            moment(c.created).isSameOrBefore(selectedPeriod.end),
        );
        break;
      }
      case "week": {
        filtered = checkIns.filter(c => moment(c.created).isSameOrAfter(selectedPeriod.start));
        break;
      }
      case "month": {
        filtered = checkIns.filter(c => moment(c.created).isSameOrAfter(selectedPeriod.start));
        break;
      }
      case "custom": {
        filtered = checkIns.filter(
          c => moment(c.created).isSameOrAfter(customRangeStart) && moment(c.created).isSameOrBefore(customRangeEnd),
        );
        break;
      }
      default: {
        filtered = cloneDeep(checkIns);
        break;
      }
    }
    filtered = filtered.filter(f => (!!selectedTag ? f.tag === selectedTag : true));
    setFilteredCheckIns(filtered);
  }, [selectedPeriod.value, checkIns, customRangeStart, customRangeEnd, selectedTag]);

  useEffect(() => {}, [checkIns]);

  function calculateCheckInHours() {
    return textLog.map(t => t.duration).reduce((acc, val) => acc + val, 0);
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
              {!!selectedTag && (
                <ButtonGroup variant="text">
                  <Button
                    startIcon={<FilterAlt />}
                    endIcon={
                      <IconButton size="small" onClick={() => setSelectedTag(null)}>
                        <Clear />
                      </IconButton>
                    }
                  >
                    Filter: #{selectedTag}
                  </Button>
                </ButtonGroup>
              )}
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
                          {viewOptions.map(v => (
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
        <Grid container item md={4} alignItems="center">
          <Grid item xs>
            Going on{" "}
            <b>
              {calculateCheckInHours()} hour{calculateCheckInHours() !== 1 && "s"}
            </b>
          </Grid>
          <Grid item xs container justifyContent="flex-end">
            <FormControlLabel
              control={<Switch checked={groupCheckInTags} onChange={e => setGroupCheckInTags(e.target.checked)} />}
              label="Group similar"
            />
          </Grid>
        </Grid>
        <Grid item md={8}>
          <CheckInList
            checkIns={filteredCheckIns}
            setSelectedTag={tag => setSelectedTag(prevTag => (prevTag === tag ? null : tag))}
          />
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

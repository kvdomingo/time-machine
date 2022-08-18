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
import { cloneDeep } from "lodash-es";
import moment from "moment/moment";
import { useSelector } from "../../store/hooks";
import { selectCheckIns } from "../../store/timeSlice";
import { getTimezoneOffsetMillis } from "../../utils/dateTime";
import CheckInList from "./CheckInList";
import Stats from "./Stats";

type viewOptionValue = "day" | "week" | "month" | "custom";

interface ViewOption {
  label: string;
  value: viewOptionValue;
}

function CheckInView() {
  const viewOptions: ViewOption[] = [
    {
      label: "Today",
      value: "day",
    },
    {
      label: "This week",
      value: "week",
    },
    {
      label: "This month",
      value: "month",
    },
    {
      label: "Custom",
      value: "custom",
    },
  ];
  const checkIns = useSelector(selectCheckIns);
  const [filteredCheckIns, setFilteredCheckIns] = useState(cloneDeep(checkIns));
  const [selectedPeriod, setSelectedPeriod] = useState<ViewOption>(viewOptions[1]);
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
            moment(c.created - getTimezoneOffsetMillis()).isSameOrAfter(moment().startOf("day")) &&
            moment(c.created - getTimezoneOffsetMillis()).isSameOrBefore(moment().endOf("day")),
        );
        break;
      }
      case "week": {
        filtered = checkIns.filter(c =>
          moment(c.created - getTimezoneOffsetMillis()).isSameOrAfter(moment().startOf("isoWeek")),
        );
        break;
      }
      case "month": {
        filtered = checkIns.filter(c =>
          moment(c.created - getTimezoneOffsetMillis()).isSameOrAfter(moment().startOf("month")),
        );
        break;
      }
      case "custom": {
        filtered = checkIns.filter(
          c =>
            moment(c.created - getTimezoneOffsetMillis()).isSameOrAfter(customRangeStart) &&
            moment(c.created - getTimezoneOffsetMillis()).isSameOrBefore(customRangeEnd),
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

  return (
    <>
      <Helmet>
        <title>Time Machine</title>
      </Helmet>
      <Grid container spacing={2} my={2}>
        <Grid item md={7}>
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
        <Grid item md={5} />
        <Grid item md={7}>
          <CheckInList
            checkIns={filteredCheckIns}
            setSelectedTag={tag => setSelectedTag(prevTag => (prevTag === tag ? null : tag))}
          />
        </Grid>
        <Grid item md={5}>
          <Stats checkIns={filteredCheckIns} byTag={!!selectedTag} />
        </Grid>
      </Grid>
    </>
  );
}

export default CheckInView;

import { Box } from "@mui/material";
import moment from "moment";
import { CheckInResponse } from "../../api/types/checkIn";

interface TextLogProps {
  checkIns: CheckInResponse[];
  groupCheckInTags: boolean;
}

function TextLog({ checkIns, groupCheckInTags }: TextLogProps) {
  function generateLog() {
    let textLog = `checkin ${moment().format("YYYY-MM-DD")}`;

    if (groupCheckInTags) {
      const uniqueTags = [...new Set(checkIns.reverse().map(c => c.tag))].sort((a, b) => a.localeCompare(b));
      const groupedTags: Record<string, CheckInResponse[]> = {};
      uniqueTags.forEach(tag => {
        groupedTags[tag] = checkIns.reverse().filter(c => c.tag === tag);
      });
      textLog = textLog.concat(
        ...Object.entries(groupedTags).map(([tag, checkins]) => {
          const tagDuration = checkins.reduce((acc, val) => acc + val.duration, 0);
          const activityString = checkins.map(c => c.activities);
          return `\n- ${tagDuration} hr${tagDuration === 1 ? "" : "s"} #${tag} ${activityString.join(", ")}`;
        }),
      );
    } else {
      textLog = textLog.concat(
        ...checkIns.reverse().map(c => `\n- ${c.duration} hr${c.duration === 1 ? "" : "s"} #${c.tag} ${c.activities}`),
      );
    }
    return textLog;
  }

  return (
    <Box
      component="textarea"
      readOnly
      sx={{
        p: 2,
        width: "100%",
        backgroundColor: "background.default",
        color: "text.primary",
        borderColor: "text.primary",
        boxShadow: "none",
        borderWidth: 1,
        borderRadius: 5,
        minHeight: 150,
      }}
      value={checkIns.length > 0 ? generateLog() : ""}
    />
  );
}

export default TextLog;

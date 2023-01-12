import { Box } from "@mui/material";
import moment from "moment";
import { CheckInResponse } from "../../api/types/checkIn";

interface TextLogProps {
  checkIns: CheckInResponse[];
}

function TextLog({ checkIns }: TextLogProps) {
  function generateLog() {
    let textLog = `checkin ${moment().format("YYYY-MM-DD")}`;
    return textLog.concat(
      ...checkIns.map(c => `\n- ${c.duration} hr${c.duration === 1 ? "" : "s"} #${c.tag} ${c.activities}`),
    );
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

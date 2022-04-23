import { createUseStyles } from "react-jss";
import { green } from "../theme";
import { FC } from "react";

const useStyles = createUseStyles({
  root: {
    borderRadius: 16,
    border: "1px solid " + green[6],
    gap: 16,
    display: "flex",
    flexDirection: "column",
    padding: 16,
    height: (height: number) => height,
    position: "relative",
    transition:
      "height 0.3s ease-in-out, padding 0.3s ease-in-out, border 0.3s ease-in-out",
  },
  hidden: {
    height: "0px !important",
    border: "none",
    overflow: "hidden",
    padding: 0,
  },
});

interface ControlContainerProps {
  hidden: boolean;
  height: number;
}

export const ControlContainer: FC<ControlContainerProps> = ({
  height,
  hidden,
  children,
}) => {
  const classes = useStyles(height);
  return (
    <div className={`${classes.root} ${hidden ? classes.hidden : ""}`}>
      {children}
    </div>
  );
};

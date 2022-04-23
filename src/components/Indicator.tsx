import { color, colors } from "theme";
import { createUseStyles } from "react-jss";

interface StyleProps {
  color: color;
  on: boolean;
  size: IndicatorSize;
  vertical?: boolean;
}

const unitSize = ({ size }: StyleProps) => (size === "large" ? 16 : 8);

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: ({ vertical }: StyleProps) => (vertical ? "column" : "row"),
    alignItems: "center",
    gap: (props: StyleProps) => {
      const size = unitSize(props);
      return props.vertical ? size / 2 : size;
    },
  },
  dot: {
    height: unitSize,
    width: unitSize,
    backgroundColor: ({ color, on }: StyleProps) => {
      if (on) {
        return colors[color][6];
      } else {
        return "rgba(0, 0, 0, 0)";
      }
    },
    borderRadius: "50%",
    border: ({ color }: StyleProps) => "1px solid " + colors[color][6],
    boxShadow: ({ color }: StyleProps) => "0 0 5px " + colors[color][6],
    transition: "background-color 0.05s ease-in",
    display: "block",
  },
});

type IndicatorSize = "small" | "large";

interface IndicatorProps {
  color: color;
  on: boolean;
  label: string;
  size?: IndicatorSize;
  vertical?: boolean;
}

export const Indicator = ({
  on,
  color,
  label,
  size,
  vertical,
}: IndicatorProps) => {
  const classes = useStyles({ on, color, size: size ?? "large", vertical });

  return (
    <div className={classes.root}>
      <span className={classes.dot} />
      <span>{label}</span>
    </div>
  );
};

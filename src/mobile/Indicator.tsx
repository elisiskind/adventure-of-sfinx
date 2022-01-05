import {color, getColor} from "theme"
import {createUseStyles} from "react-jss";

interface StyleProps {color: color, on: boolean};

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  dot: {
    height: 16,
    width: 16,
    backgroundColor: ({color, on}: StyleProps) => {
      if (on) {
        return getColor(color)[6];
      } else {
        return 'rgba(0, 0, 0, 0)';
      }
    },
    borderRadius: '50%',
    border: ({color}: StyleProps) => '1px solid ' + getColor(color)[6],
    boxShadow: ({color}: StyleProps) => '0 0 5px ' + getColor(color)[6],
    transition: 'background-color 0.05s ease-in',
    display: 'block'
  }
})

interface IndicatorProps {
  color: color;
  on: boolean;
  label: string;
}

export const Indicator = ({on, color, label}: IndicatorProps) => {
  const classes = useStyles({on, color});

  return <div className={classes.root}>
    <span className={classes.dot}/>
    <span>
      {label}
    </span>
  </div>
}
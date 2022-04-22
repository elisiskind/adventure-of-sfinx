import {createUseStyles} from "react-jss";
import {green} from "../theme";

const useStyles = createUseStyles({
  root: {
    position: "fixed",
    bottom: 16,
    opacity: 100,
    width: '100vw',
    transition: 'opacity 0.2s ease-in-out',
    display: 'flex',
    justifyContent: 'center'
  },
  inner: {
    width: 'fit-content',
    display: 'flex',
    justifyContent: "center",
    alignItems: "center",
    padding: '8px 16px',
    borderRadius: 4,
    gap: 8,
    animation: '$glow 2s infinite ease-in-out'
  },
  '@keyframes glow': {
    '0%, 100%': {
      boxShadow: `0 0 10px -5px ${green[0]}`
    },
    '50%': {
      boxShadow: `0 0 10px 5px ${green[2]}`
    }
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: 'column',
    gap: 4
  },
  button: {
    border: `1px solid ${green[6]}`,
  },
  hide: {
    opacity: 0,
  }
});

interface KeyboardHintProps {
  show: boolean,
  includeOptionHint: boolean
}

export const KeyboardHint = ({show, includeOptionHint}: KeyboardHintProps) => {
  const classes = useStyles();

  const selectOptionHint = <>
    <span>
      Select an option with
    </span>
    <div className={classes.buttonsContainer}>
      <img className={classes.button} src={'/icons/up.svg'} alt={'up arrow'}/>
      <img className={classes.button} src={'/icons/down.svg'} alt={'down arrow'}/>
    </div>
    <span>
      and press
    </span>
  </>

  return <div className={`${classes.root} ${show ? '' : classes.hide}`}>
    <div className={classes.inner}>
      {includeOptionHint ? selectOptionHint : 'Press'}
      <div className={classes.buttonsContainer}>
        <img className={classes.button} src={'/icons/enter.svg'} alt={'enter'}/>
      </div>
      <span>
      to continue
    </span>
    </div>
  </div>
}
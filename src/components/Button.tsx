import React, {FunctionComponent, useContext} from "react";
import {createUseStyles} from "react-jss";
import {green} from "theme";
import {LocalStorageContext} from "storage/LocalStorageProvider";

const useStyles = createUseStyles({
  button: {
    fontSize: 20,
    background: 'none',
    outline: 'none',
    border: '1px solid ' + green[6],
    borderRadius: 16,
    padding: '16px 32px',
    color: green[6],
    fontFamily: 'consolas, Courier New',
    animation: ({flicker}: { flicker: boolean }) => flicker ? 'textShadow 1.6s infinite' : 'none',
    cursor: 'pointer',

    '&:hover': {
      background: green[2]
    },

    '&:disabled': {
      border: '1px solid ' + green[1],
      color: green[1],
      backgroundColor: "black",
      cursor: "default"
    },

    '&:focus': {
      background: green[1]
    },
  }
})

interface ButtonProps {
  onClick: () => void | Promise<void>;
  handleKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void | Promise<void>;
  disabled?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({children, disabled, handleKeyPress, onClick}) => {
  const {flicker} = useContext(LocalStorageContext);

  const classes = useStyles({flicker});
  return <button className={classes.button} onClick={onClick} onKeyPress={handleKeyPress} disabled={disabled ?? false}>
    {children}
  </button>
}
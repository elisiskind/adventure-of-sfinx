import React, {FunctionComponent, useContext} from "react";
import {createUseStyles} from "react-jss";
import {green} from "theme";
import {LocalStorageContext} from "storage/LocalStorageProvider";

const useStyles = createUseStyles({
  button: {
    fontSize: 20,
    background: 'none',
    outline: 'none',
    border: '1px solid #Af7',
    borderRadius: 15,
    padding: '15px 30px',
    color: green[6],
    fontFamily: 'consolas, Courier New',
    animation: ({flicker}: { flicker: boolean }) => flicker ? 'textShadow 1.6s infinite' : 'none',
    cursor: 'pointer',

    '&:hover': {
      background: green[2]
    },
    '&:focus': {
      background: green[1]
    }
  }
})

interface ButtonProps {
  onClick: () => void | Promise<void>;
  handleKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void | Promise<void>;
}

export const Button: FunctionComponent<ButtonProps> = ({children, handleKeyPress, onClick}) => {
  const {flicker} = useContext(LocalStorageContext);

  const classes = useStyles({flicker});
  return <button className={classes.button} onClick={onClick} onKeyPress={handleKeyPress}>
    {children}
  </button>
}
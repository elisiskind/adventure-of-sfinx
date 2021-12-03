import React, {FunctionComponent} from "react";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  button: {
    fontSize: 20,
    background: 'none',
    outline: 'none',
    border: '1px solid #Af7',
    borderRadius: 15,
    padding: '15px 30px',
    color: '#Af7',
    fontFamily: 'consolas, Courier New',
    animation: 'textShadow 1.6s infinite',
    cursor: 'pointer',

    '&:hover': {
      background: 'rgb(170, 255, 119, 0.2)'
    },
    '&:focus': {
      background: 'rgb(170, 255, 119, 0.1)'
    }
  }
})

interface ButtonProps {
  onClick: () => void | Promise<void>;
  handleKeyPress?: (e: React.KeyboardEvent<HTMLElement>) => void | Promise<void>;
}

export const Button: FunctionComponent<ButtonProps> = ({children, handleKeyPress, onClick}) => {
  const classes = useStyles();
  return <button className={classes.button} onClick={onClick} onKeyPress={handleKeyPress}>
    {children}
  </button>
}
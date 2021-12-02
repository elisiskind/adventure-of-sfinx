import React, {FunctionComponent, useEffect, useState} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {sleep} from "utils";

const useStyles = createUseStyles({
  hide: {
    opacity: 0,
  },
  hideable: {
    height: '100%',
    '-webkit-transition': 'opacity 0.3s ease-in-out',
    '-moz-transition': 'opacity 0.3s ease-in-out',
    '-ms-transition': 'opacity 0.3s ease-in-out',
    '-o-transition': 'opacity 0.3s ease-in-out',
  }
})

export interface FadeProps {
  id: string;
  updateChild: (id: string) => void;
}

export const Fade: FunctionComponent<FadeProps> = ({children, updateChild, id}) => {
  const classes = useStyles();

  const [currentId, setCurrentId] = useState<string>('NONE');
  const [fadeState, setFadeState] = useState<boolean>(true);

  useEffect(() => {
    if (id !== currentId) {
      const fade = async () => {
        console.log('doing a quick lil fade ;)')
        if (children) {
          setFadeState(true);
          await sleep(300);
        }
        setCurrentId(id)
        updateChild(id);
        setFadeState(false);
      };
      fade()
    }
  }, [currentId, id, updateChild, children]);


  const fadeClasses = `${classes.hideable} ${fadeState ? classes.hide : ''}`

  return (
      <div className={fadeClasses}>
        {children}
      </div>
  );
}


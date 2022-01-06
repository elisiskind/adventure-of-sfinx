import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Fade} from "components/Fade";
import {createUseStyles} from "react-jss";
import {GameGraph, NodeId, TextOption} from "game/Nodes";
import {NodeTransitionContext} from "storage/NodeTransitionProvider";
import {green} from "theme";

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
  },
  screen: {
    borderRadius: 16,
    width: '60%',
    height: '70%',
    margin: '0 auto',
    border: "2px solid " + green[6],
    background: "black",
    animation: '1s ease-out 0s 1 expand',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '20px',
    fontSize: 20,
    gap: 16
  },
  messageContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  prompt: {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'flex-start',
    textAlign: 'left',
    maxWidth: 1024,
    width: '100%',
    marginTop: 24,
    marginBottom: 24
  },
  options: {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'flex-start',
    maxWidth: 1024,
    width: '100%'
  },
  bold: {
    fontWeight: "bold"
  }
})

export const TextAdventure = () => {
  const classes = useStyles();

  const {nodeId, updateNodeId, nodeFadeState} = useContext(NodeTransitionContext);
  const [index, setIndex] = useState<number>(0);
  const [nextIndex, setNextIndex] = useState<number>(0);

  const currentNode = GameGraph[nodeId];

  const selectNode = (id: NodeId) => {
    console.log('selected node: ' + id);
    updateNodeId(id, () => setIndex(0));
  }

  const updateNode = (newIndex: number) => {
    setIndex(newIndex);
    if (newIndex < currentNode.prompt.length - 1) {
      setTimeout(() => {
        setNextIndex(newIndex + 1)
      }, 3000)
    }
  }

  const fadeClasses = `${classes.hideable} ${nodeFadeState ? classes.hide : ''}`

  return <div className={classes.message}>
    <div className={fadeClasses}>
      <div className={classes.messageContainer}>
        <div className={classes.prompt}>
          {typeof currentNode.prompt === 'object' ? (
              <Fade id={nextIndex} updateChild={updateNode}>
                {currentNode.prompt[index]}
              </Fade>
          ) : currentNode.prompt
          }
        </div>
      </div>
      <div>
        <MessageSelector
            textOptions={typeof currentNode.prompt === 'object' && index < currentNode.prompt.length - 1 ? [] : currentNode.options}
            select={selectNode}/>
      </div>
    </div>
  </div>
};

interface MessageSelectorProps {
  textOptions: TextOption[];
  select: (key: NodeId) => void;
}

export const MessageSelector = ({textOptions, select}: MessageSelectorProps) => {
  const classes = useStyles();

  const [nextNode, setNextNode] = useState<string>('NONE_SET');
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    const optionsLength = textOptions.length;
    if (optionsLength === 0) {
      return;
    }
    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelected((((selected - 1) % optionsLength) + optionsLength) % optionsLength);
      } else if (e.key === 'ArrowDown') {
        setSelected((((selected + 1) % optionsLength) + optionsLength) % optionsLength);
      } else if (e.key === 'Enter' && optionsLength > 0) {
        console.log('Enter pressed', textOptions[selected])
        select(textOptions[selected][0]);
        setTimeout(() => {
          setSelected(0);
        }, 300);
      }
    }
    document.addEventListener("keydown", handleKeypress);
    return () => {
      document.removeEventListener('keydown', handleKeypress);
    }
  }, [selected, textOptions, select])

  return <Fade id={nextNode} updateChild={setNextNode}>
    <div className={classes.messageContainer}>
      <div className={classes.options}>
        {textOptions.map(([key, value], index) => {
          return <div key={index} className={index === selected ? classes.bold : ''}>
            {index === selected ? '>\u00A0' : '\u00A0\u00A0'}{value}
          </div>
        })}
      </div>
    </div>
  </Fade>
}
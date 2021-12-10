import * as React from 'react';
import {useEffect, useState} from 'react';
import {Fade} from "components/Fade";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({

  screen: {
    borderRadius: 15,
    width: '60%',
    height: '70%',
    margin: '0 auto',
    border: "2px solid #Af7",
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
    gap: 20
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
    maxWidth: '720px',
    width: '100%',
    marginTop: '20px',
    marginBottom: '20px'
  },
  options: {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'flex-start',
    maxWidth: '720px',
    width: '100%'
  },
  bold: {
    fontWeight: "bold"
  }
})

export interface TextGame {
  [key: string]: TextNode;
}

export interface TextNode {
  prompt: string | string[];
  options: TextOption[];
  onSelect?: () => (void | Promise<void>);
}

export type TextOption = [string, string];

export interface TextAdventureProps {
  game: TextGame;
  currentNodeId: string;
  updateNode: (nodeId: string) => void;
};

export const TextAdventure = ({game, currentNodeId, updateNode}: TextAdventureProps) => {
  const classes = useStyles();

  const [nextNodeId, setNextNodeId] = useState<string>(currentNodeId);

  const currentNode = game[currentNodeId];

  const update = (id: string) => {
    console.info('Updating node: ', id);
    game[id]?.onSelect?.();
    updateNode(id);
  }

  return <div className={classes.message}>
    <Fade id={nextNodeId} updateChild={update}>
      <div className={classes.messageContainer}>
        <div className={classes.prompt}>
          {currentNode.prompt}
        </div>
      </div>
      <div>
        <MessageSelector textOptions={currentNode.options} select={setNextNodeId}/>
      </div>
    </Fade>
  </div>
};

interface MessageSelectorProps {
  textOptions: TextOption[];
  select: (key: string) => void;
}

export const MessageSelector = ({textOptions, select}: MessageSelectorProps) => {
  const classes = useStyles();

  const [nextNode, setNextNode] = useState<string>('NONE_SET');
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    const optionsLength = textOptions.length;
    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setSelected((((selected - 1) % optionsLength) + optionsLength) % optionsLength);
      } else if (e.key === 'ArrowDown') {
        setSelected((((selected + 1) % optionsLength) + optionsLength) % optionsLength);
      } else if (e.key === 'Enter' && optionsLength > 0) {
        select(textOptions[selected][0]);
        setTimeout(() => {
          setSelected(0);
        }, 300);
      }
    }
    document.addEventListener("keydown", handleKeypress);
    return () => document.removeEventListener('keydown', handleKeypress);
  }, [selected, textOptions, select])

  return <Fade id={nextNode} updateChild={setNextNode}>
    <div className={classes.messageContainer}>
      <div className={classes.options}>
        {textOptions.map(([key, value], index) => {
          return <div className={index === selected ? classes.bold : ''}>
            {index === selected ? '>\u00A0' : '\u00A0\u00A0'}{value}
          </div>
        })}
      </div>
    </div>
  </Fade>
}
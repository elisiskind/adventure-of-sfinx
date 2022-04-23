import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { Fade } from "components/Fade";
import { createUseStyles } from "react-jss";
import { NodeId } from "game/Nodes";
import { NodeTransitionContext } from "storage/NodeTransitionProvider";
import { green } from "theme";
import { KeyboardControls } from "./KeyboardControls";
import { KeyboardHint } from "./KeyboardHint";

const useStyles = createUseStyles({
  hide: {
    opacity: 0,
  },
  hideable: {
    height: "100%",
    "-webkit-transition": "opacity 0.3s ease-in-out",
    "-moz-transition": "opacity 0.3s ease-in-out",
    "-ms-transition": "opacity 0.3s ease-in-out",
    "-o-transition": "opacity 0.3s ease-in-out",
  },
  screen: {
    borderRadius: 16,
    width: "60%",
    height: "70%",
    margin: "0 auto",
    border: "2px solid " + green[6],
    background: "black",
    animation: "1s ease-out 0s 1 expand",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
  },
  message: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: "20px",
    fontSize: 20,
    gap: 16,
  },
  messageContainer: {
    display: "flex",
    justifyContent: "center",
  },
  prompt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
    maxWidth: 1024,
    width: "100%",
    marginTop: 24,
    marginBottom: 24,
  },
  options: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    maxWidth: 1024,
    width: "100%",
  },
  bold: {
    fontWeight: "bold",
  },
});

export const TextAdventure = () => {
  const classes = useStyles();

  const {
    node: currentNode,
    updateNodeId,
    nodeFadeState,
    nodeId,
  } = useContext(NodeTransitionContext);
  const [promptIndex, setPromptIndex] = useState<number>(0);
  const [nextPromptIndex, setNextPromptIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  const selectNode = useCallback(
    (id: NodeId) => {
      console.log("Updating to " + id);
      updateNodeId(id, {}, () => {
        setNextPromptIndex(0);
        setPromptIndex(0);
        setSelectedOption(0);
      });
    },
    [updateNodeId]
  );

  const showOptions =
    typeof currentNode.options === "object" &&
    (typeof currentNode.prompt !== "object" ||
      promptIndex === currentNode.prompt.length - 1);
  const allowPromptAdvance =
    typeof currentNode.prompt === "object" &&
    promptIndex < currentNode.prompt.length - 1;

  const options = Object.entries(showOptions ? currentNode.options : {})
    .map((v) => v as [NodeId, string | string[]])
    .flatMap<[NodeId, string]>(([key, val]): [NodeId, string][] => {
      if (typeof val === "string") {
        return [[key, val]];
      } else {
        return val.map((v) => {
          return [key, v];
        });
      }
    });

  const showKeyboardHint =
    showHint && nodeId === "START_1" && (showOptions || promptIndex === 0);

  const onUp = useCallback(() => {
    if (showOptions && options.length > 0) {
      setSelectedOption(
        (selected) =>
          (((selected - 1) % options.length) + options.length) % options.length
      );
    }
  }, [showOptions, options]);

  const onDown = useCallback(() => {
    if (showOptions && options.length > 0) {
      setSelectedOption(
        (selected) =>
          (((selected + 1) % options.length) + options.length) % options.length
      );
    }
  }, [showOptions, options]);

  const onEnter = useCallback(() => {
    if (allowPromptAdvance) {
      setNextPromptIndex(promptIndex + 1);
    } else if (showOptions && options.length > 0) {
      selectNode(options[selectedOption][0]);
    } else if (typeof currentNode.options === "string") {
      selectNode(currentNode.options);
    }
  }, [
    showOptions,
    options,
    allowPromptAdvance,
    promptIndex,
    selectedOption,
    selectNode,
    currentNode.options,
  ]);

  const fadeClasses = `${classes.hideable} ${
    nodeFadeState ? classes.hide : ""
  }`;

  return (
    <>
      <KeyboardControls
        onUp={onUp}
        onDown={onDown}
        onEnter={onEnter}
        setShowHint={setShowHint}
      />
      <KeyboardHint
        show={showKeyboardHint}
        includeOptionHint={showOptions && options.length > 0}
      />
      <div className={classes.message}>
        <div className={fadeClasses}>
          <div className={classes.messageContainer}>
            <div className={classes.prompt}>
              {typeof currentNode.prompt === "object" ? (
                <Fade id={nextPromptIndex} updateChild={setPromptIndex}>
                  {currentNode.prompt[promptIndex]}
                </Fade>
              ) : (
                currentNode.prompt
              )}
            </div>
          </div>
          <div>
            <MessageSelector options={options} selected={selectedOption} />
          </div>
        </div>
      </div>
    </>
  );
};

interface MessageSelectorProps {
  options: [NodeId, string][];
  selected: number;
}

export const MessageSelector = ({
  options,
  selected,
}: MessageSelectorProps) => {
  const classes = useStyles();

  const [nextNode, setNextNode] = useState<string>("NONE_SET");

  return (
    <>
      <Fade id={nextNode} updateChild={setNextNode}>
        <div className={classes.messageContainer}>
          <div className={classes.options}>
            {options.map(([key, value], index) => {
              return (
                <div
                  key={index}
                  className={index === selected ? classes.bold : ""}
                >
                  {index === selected ? ">\u00A0" : "\u00A0\u00A0"}
                  {value}
                </div>
              );
            })}
          </div>
        </div>
      </Fade>
    </>
  );
};

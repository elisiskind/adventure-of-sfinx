import React, { useEffect, useRef } from "react";

interface KeyboardControlsProps {
  onUp: () => void;
  onDown: () => void;
  onEnter: () => void;
  setShowHint: (show: boolean) => void;
}

export const KeyboardControls = React.memo((props: KeyboardControlsProps) => {
  const hintTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      props.setShowHint(true);
    }, 4000);

    hintTimeout.current = timeout;

    return () => {
      clearTimeout(timeout);
    };
  }, [props]);

  useEffect(() => {
    const { onDown, onUp, onEnter } = props;
    const cancelHint = () => {
      if (hintTimeout.current) {
        clearTimeout(hintTimeout.current);
      }
      props.setShowHint(false);
    };

    const handleKeypress = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        cancelHint();
        onUp();
      } else if (e.key === "ArrowDown") {
        cancelHint();
        onDown();
      } else if (e.key === "Enter") {
        cancelHint();
        onEnter();
      }
    };

    const handleClick = () => {
      props.setShowHint(true);
    };

    document.addEventListener("keydown", handleKeypress);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeypress);
      document.removeEventListener("click", handleClick);
    };
  }, [props]);

  return <></>;
});

import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import { Button } from "components/Button";
import { CloudStorageContext } from "storage/CloudStorageProvider";
import { green } from "theme";
import { Coordinate, Coordinates, Ring, Sector } from "game/Coordinates";
import { NodeTransitionContext } from "storage/NodeTransitionProvider";
import { Indicator } from "../components/Indicator";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  controls: {
    position: "absolute",
    top: 0,
    left: "calc((100% - 394px) / 2)",
    margin: "0 auto",
    background: "black",
    display: "flex",
    border: "1px " + green[6] + " solid",
    borderTop: "none",
    borderRadius: "0 0 16px 16px",
    padding: 16,
  },
  controlsHidden: {
    top: "-100%",
  },
  prompt: {
    fontSize: 20,
    animation: "textShadow 1.6s infinite",
  },
  arrow: {
    height: 20,
    width: 20,
    transform: "rotate(-90deg)",
  },
  arrowButton: {
    padding: 8,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
  },
  selectors: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 8,
  },
  selector: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  indicators: {
    display: "flex",
    justifyContent: "space-between",
    flex: 1,
    gap: 4,
  },
});

interface ArrowButtonProps {
  dir: "up" | "down";
  onClick: () => void;
}

const ArrowButton = ({ dir, onClick }: ArrowButtonProps) => {
  const classes = useStyles();
  return (
    <Button className={classes.arrowButton} onClick={onClick}>
      <img
        alt={`${dir} arrow`}
        src={`icons/${dir}.svg`}
        className={classes.arrow}
      />
    </Button>
  );
};

export const CoordinateController = () => {
  const classes = useStyles();

  const { coordinates, update } = useContext(CloudStorageContext);

  const { updateNodeId, node } = useContext(NodeTransitionContext);
  const [ring, setRing] = useState<Ring>(new Coordinates(coordinates).ring);
  const [sector, setSector] = useState<Sector>(
    new Coordinates(coordinates).sector
  );

  const enableButton = ring !== null && sector !== null;

  const validateCoordinates = (
    targetCoordinates: Coordinate,
    currentCoordinates: Coordinate
  ) => {
    const target = new Coordinates(targetCoordinates);
    const current = new Coordinates(currentCoordinates);
    return target.equals(current.next()) || target.equals(current.previous());
  };

  const go = useCallback(
    (nextCoordinates: Coordinate) => {
      update({ warp: true }).then(() => {
        setTimeout(() => {
          try {
            if (node.travelInfo) {
              const { failure, target, success } = node.travelInfo;
              if (validateCoordinates(nextCoordinates, coordinates)) {
                if (target && nextCoordinates === target.coordinates) {
                  updateNodeId(target.node, {
                    coordinates: nextCoordinates,
                  });
                } else {
                  updateNodeId(success, {
                    coordinates: nextCoordinates,
                  });
                }
              } else {
                updateNodeId(failure);
              }
            }
          } catch (e) {
            console.error("Error updating coordinates", e);
          }
        }, 6700);
      });
    },
    [node.travelInfo, coordinates, updateNodeId, update]
  );

  const updateRing = (dir: -1 | 1) => {
    setRing((((ring - dir + 5) % 4) + 1) as Ring);
  };

  const updateSector = (dir: -1 | 1) => {
    setSector(Coordinates.toSector(Coordinates.fromSector(sector) + dir));
  };

  return (
    <>
      Wormhole Coordinates: {`${ring}${sector}`}
      <div className={classes.root}>
        <div className={classes.selectors}>
          <div className={classes.selector}>
            <ArrowButton dir={"up"} onClick={() => updateRing(-1)} />
            <div className={classes.indicators}>
              {[1, 2, 3, 4].map((r) => {
                return (
                  <Indicator
                    color={"purple"}
                    on={r === ring}
                    label={r.toString()}
                    size={"small"}
                    vertical={true}
                  />
                );
              })}
            </div>
            <ArrowButton dir={"down"} onClick={() => updateRing(1)} />
          </div>
          <div className={classes.selector}>
            <ArrowButton dir={"up"} onClick={() => updateSector(-1)} />
            <div className={classes.indicators}>
              {["A", "B", "C", "D", "E", "F"].map((s) => {
                return (
                  <Indicator
                    color={"purple"}
                    on={s === sector}
                    label={s}
                    size={"small"}
                    vertical={true}
                  />
                );
              })}
            </div>
            <ArrowButton dir={"down"} onClick={() => updateSector(1)} />
          </div>
        </div>
        <div>
          <Button
            onClick={() => {
              ring !== null && sector !== null && go(`${ring}${sector}`);
            }}
            disabled={!enableButton}
          >
            Go
          </Button>
        </div>
      </div>
    </>
  );
};

import * as React from "react";
import { useContext } from "react";
import { createUseStyles } from "react-jss";
import { Crt } from "components/Crt";
import { Gauge } from "components/Gauge";
import { Button } from "components/Button";
import { CloudStorageContext, Updates } from "storage/CloudStorageProvider";
import { green } from "theme";
import { CoordinateController } from "game/CoordinateControls";
import { NodeTransitionContext } from "storage/NodeTransitionProvider";
import { ControlContainer } from "./ControlContainer";

const useStyles = createUseStyles({
  root: {
    height: "100%",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
    animation: "1s ease-out 0s 1 expand",
  },
  row: {
    display: "flex",
    gap: 16,
    flexDirection: "row",
  },
  divider: {
    width: "100%",
    height: 0,
    borderBottom: "1px solid " + green[2],
  },
  mission: {
    textAlign: "left",
    flexShrink: 1,
    justifyContent: "center",
    alignItems: "left",
    display: "flex",
    flexDirection: "column",
  },
});

export const Controller = () => {
  const classes = useStyles();

  const {
    update,
    mission,
    mailDrop1LoggedIn,
    mailDrop2Unlocked,
    mailDrop2LoggedIn,
    shipUnlocked,
    warp,
    view,
  } = useContext(CloudStorageContext);

  const {
    node: { showSpaceship, travelInfo, engineOn },
  } = useContext(NodeTransitionContext);

  const showShip = view === "ship" && showSpaceship;
  const showCoordinates = !!travelInfo && showShip && !warp;

  return (
    <Crt>
      <div className={classes.root}>
        {mission !== undefined && (
          <div className={classes.mission}>
            Mission:<div>{mission}</div>
          </div>
        )}
        <ControlContainer height={120} hidden={!showCoordinates}>
          <CoordinateController />
        </ControlContainer>
        <ControlContainer hidden={!showShip} height={152}>
          Engines
          <div className={classes.row}>
            <Gauge
              level={warp ? 2 : engineOn ? 1 : 0}
              label={"Port Thruster"}
            />
            <Gauge
              level={warp ? 2 : engineOn ? 1 : 0}
              label={"Starboard Thruster"}
            />
          </div>
        </ControlContainer>
        {!warp && (
          <Button
            disabled={view === "mail-drop-1"}
            onClick={() => update({ view: "mail-drop-1" })}
          >
            Mail drop {process.env.REACT_APP_MD1_CODE}
          </Button>
        )}
        {!warp && mailDrop2Unlocked && (
          <Button
            disabled={view === "mail-drop-2"}
            onClick={() => update({ view: "mail-drop-2" })}
          >
            Mail drop {process.env.REACT_APP_MD2_CODE}
          </Button>
        )}
        {!warp && shipUnlocked && (
          <Button
            disabled={view === "ship"}
            onClick={async () => {
              const updates: Updates = { view: "ship" };
              if (mailDrop2LoggedIn) {
                updates.mission = "Rescue Princess Gorgonzola in 4E";
              } else if (mailDrop1LoggedIn) {
                updates.mission = "Find Chase in coordinates 1D";
              }
              await update(updates);
            }}
          >
            Back to ship
          </Button>
        )}
      </div>
    </Crt>
  );
};

import { useContext } from "react";
import { LocalStorageContext } from "../storage/LocalStorageProvider";
import { Button } from "../components/Button";
import {
  NodeIdContext,
  NodeUpdates,
} from "../storage/CloudStorageProvider";
import { Navigate } from "react-router-dom";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: 36,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  container: {},
});

export const AdminPage = () => {
  const classes = useStyles();

  const { admin } = useContext(LocalStorageContext);
  const { update } = useContext(NodeIdContext);

  const defaultUpdates: NodeUpdates = {
    shipUnlocked: false,
    mailDrop1LoggedIn: false,
    mailDrop2Unlocked: false,
    mailDrop2LoggedIn: false,
    view: "mail-drop-1",
    coordinates: "3A",
    history: ["3A"],
    nodeId: "START_1",
    gunDrawn: false,
    airlockTime: 0,
  };

  const level1Updates: NodeUpdates = {
    ...defaultUpdates,
    shipUnlocked: true,
    mailDrop1LoggedIn: true,
    view: "ship",
  };

  if (!admin) {
    return <Navigate to={"/"} />;
  }

  const resetApp = async () => {
    await update(defaultUpdates);
  };

  const level1 = async () => {
    await update(level1Updates);
  };

  const dockWithShip = async () => {
    await update({
      ...level1Updates,
      history: ["3A", "1D"],
      coordinates: "1D",
      nodeId: "DOCK_WITH_SHIP",
    });
  };

  const firstWarp = async () => {
    await update({
      ...level1Updates,
      nodeId: "COORDINATES_1",
    });
  };

  const rescueMission = async () => {
    await update({
      ...level1Updates,
      mailDrop2Unlocked: true,
      mailDrop2LoggedIn: true,
      history: ["3A", "1D"],
      coordinates: "1D",
      nodeId: "OPEN_BOX",
    });
  };

  const rescueMission2 = async () => {
    await update({
      ...level1Updates,
      history: ["3A", "1D", "2A", "4D", "3B", "1E", "2B"],
      mailDrop2Unlocked: true,
      mailDrop2LoggedIn: true,
      nodeId: "SECOND_WARP_2",
      coordinates: "2B",
    });
  };

  return (
    <div className={classes.root}>
      <Button onClick={resetApp}>Reset App</Button>
      <Button onClick={level1}>Level 1</Button>
      <Button onClick={firstWarp}>First warp</Button>
      <Button onClick={dockWithShip}>Dock with ship</Button>
      <Button onClick={rescueMission}>Rescue Mission</Button>
      <Button onClick={rescueMission2}>Rescue Mission 2</Button>
    </div>
  );
};

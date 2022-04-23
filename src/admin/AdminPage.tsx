import {useContext} from "react";
import {LocalStorageContext} from "../storage/LocalStorageProvider";
import {Button} from "../components/Button";
import {CloudStorageContext, NodeIdContext} from "../storage/CloudStorageProvider";
import {Navigate} from "react-router-dom";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: 36,
    alignItems: "center",
    justifyContent: 'center',
    height: '100vh'
  },
  container: {

  }
})


export const AdminPage = () => {

  const classes = useStyles();

  const {admin} = useContext(LocalStorageContext);
  const {update} = useContext(NodeIdContext);
  const {requireUnlocked} = useContext(CloudStorageContext);

  if (!admin) {
    return <Navigate to={'/'}/>
  }

  const resetApp = async () => {
    await update({
          shipUnlocked: false,
          mailDrop1LoggedIn: false,
          mailDrop2Unlocked: false,
          mailDrop2LoggedIn: false,
          view: 'mail-drop-1',
          coordinates: '3A',
          history: ['3A'],
          nodeId: 'START_1'
        }
    );
  }

  const level1 = async () => {
    await update({
          shipUnlocked: true,
          mailDrop1LoggedIn: true,
          mailDrop2Unlocked: false,
          mailDrop2LoggedIn: false,
          view: 'ship',
          coordinates: '3A',
          history: ['3A'],
          nodeId: 'START_1'
        }
    );
  }

  const firstWarp = async () => {
    await update({
          shipUnlocked: true,
          mailDrop1LoggedIn: true,
          mailDrop2Unlocked: false,
          mailDrop2LoggedIn: false,
          view: "ship",
          history: ['3A'],
          coordinates: '3A',
          nodeId: 'COORDINATES_1'
        }
    );
  }

  const dockWithShip = async () => {
    await update({
          shipUnlocked: true,
          mailDrop1LoggedIn: true,
          mailDrop2Unlocked: false,
          mailDrop2LoggedIn: false,
          view: "ship",
          history: ['3A', '1D'],
          coordinates: '1D',
          nodeId: 'DOCK_WITH_SHIP'
        }
    );
  }


  return <div className={classes.root}>
    <Button onClick={resetApp}>
      Reset App
    </Button>
    <Button onClick={level1}>
      Level 1
    </Button>
    <Button onClick={firstWarp}>
      First warp
    </Button>
    <Button onClick={dockWithShip}>
      Dock with ship
    </Button>
    <div className={classes.container}>
      <Button onClick={() => update({requireUnlocked: !requireUnlocked})}>
        {requireUnlocked ? 'Unlock' : 'Lock'}
      </Button>
    </div>
  </div>
}
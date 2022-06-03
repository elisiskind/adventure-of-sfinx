import React, { useContext, useState } from "react";
import { createUseStyles } from "react-jss";
import "styles/crt.css";
import { Crt } from "components/Crt";
import { Fade } from "components/Fade";
import { Button } from "components/Button";
import { green } from "theme";
import { NodeTransitionContext } from "../storage/NodeTransitionProvider";

const useStyles = createUseStyles({
  screen: {
    borderRadius: 16,
    width: "70%",
    maxWidth: "1024px",
    height: "80%",
    margin: "36px auto",
    border: "2px solid #Af7",
    background: "black",
    animation: "1s ease-out 0s 1 expand",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  heading: {
    height: "15%",
    borderBottom: "1px solid #Af7",
    animation: "textShadow 1.6s infinite",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  title: {
    margin: 0,
  },
  content: {
    height: "calc(85% - 60px)",
    padding: 32,
  },
  innerContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  prompt: {
    fontSize: 20,
    animation: "textShadow 1.6s infinite",
  },
  form: {
    color: green[6],
    fontFamily: "consolas, Courier New",
    borderRadius: 16,
    background: green[2],
    width: "80%",
  },
  field: {
    display: "flex",
    alignItems: "start",
    padding: 16,
  },
  formField: {
    fontSize: 20,
    background: "none",
    outline: "none",
    border: "none",
    color: green[6],
    fontFamily: "consolas, Courier New",
    animation: "textShadow 1.6s infinite",
    width: "100%",
    paddingLeft: 8,
  },
  message: {
    textAlign: "left",
    overflowY: "auto",
    textIndent: "2em",
    padding: 16,
    height: "calc(85% - 40px)",

    "&::-webkit-scrollbar": {
      width: 16,
    },
    "&::-webkit-scrollbar-track": {
      background: green[0],
      width: 16,
    },
    "&::-webkit-scrollbar-thumb": {
      background: green[5],
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: green[6],
    },
  },
  logoutButton: {
    height: "10%",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    textAlign: "left",
  },
});

export interface Message {
  paragraphs: (string | JSX.Element)[];
  signOff?: string;
  name?: string;
  title?: string;
}

export interface MailDropProps {
  loggedIn: boolean;
  message: Message;
  username: string;
  password: string;
  dropId: string;
  onLogin?: () => void;
}

export const MailDrop = ({
  message,
  password,
  username,
  dropId,
  onLogin,
  loggedIn,
}: MailDropProps) => {
  const classes = useStyles();

  const [usernameValue, setUsernameValue] = useState<string>("");
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [showLoggedInView, setShowLoggedInView] = useState<boolean>(loggedIn);
  const [showError, setShowError] = useState<boolean>(false);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  const { updateNodeId } = useContext(NodeTransitionContext);

  const MessageContent = (
    <div>
      {message.paragraphs.map((p, i) => {
        return <p key={i}>{p}</p>;
      })}
      <p style={{ textIndent: 0 }}>{message.signOff},</p>
      <p style={{ textIndent: 0, margin: 0 }}>{message.name}</p>
      <p style={{ textIndent: 0, margin: 0, fontStyle: "italic" }}>
        {message.title}
      </p>
    </div>
  );

  const submit = async () => {
    setShowError(false);
    setTimeout(() => {
      if (
        usernameValue.toLowerCase() === username &&
        passwordValue.toLowerCase() === password
      ) {
        onLogin?.();
      } else {
        setFailedAttempts((n) => n + 1);
        setShowError(true);
        if (failedAttempts > 14) {
          updateNodeId("FINED_BY_SPACE_CATS");
        }
      }
      setUsernameValue("");
      setPasswordValue("");
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  const loginView = (
    <div className={classes.innerContent}>
      <div className={classes.prompt}>Please log in to continue</div>
      <div className={classes.form}>
        <form autoComplete="off">
          <div className={classes.field}>
            <span className={classes.prompt}>Name:</span>
            <input
              id={"search_username"}
              type="text"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value.toUpperCase())}
              className={classes.formField}
              autoComplete="off"
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className={classes.field}>
            <span className={classes.prompt}>Password:</span>
            <input
              type="text"
              id={"search_password"}
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value.toUpperCase())}
              className={classes.formField}
              autoComplete="off"
              onKeyPress={handleKeyPress}
            />
          </div>
        </form>
      </div>
      <div>
        <Button onClick={submit} handleKeyPress={handleKeyPress}>
          Submit
        </Button>
      </div>
      <div className={classes.error}>
        {showError &&
          (failedAttempts < 3 ? (
            <div>Error: Invalid credentials.</div>
          ) : failedAttempts < 5 ? (
            <>
              <div>Error: Invalid credentials.</div>
              <div>
                Warning: Unauthorized access to mail drops is a galactic felony.
              </div>
            </>
          ) : failedAttempts < 7 ? (
            <>
              <div>Error: Invalid credentials.</div>
              <div>
                Warning: Unauthorized access to mail drops is a galactic felony.
                If you are caught attempting to gain access to unauthorized
                data, you can be fined up to 10,000 space credits
              </div>
            </>
          ) : failedAttempts < 13 ? (
            <>
              <div>Error: Invalid credentials.</div>
              <div>
                Warning: Unauthorized access to mail drops is a galactic felony.
                If you are caught attempting to gain access to unauthorized
                data, you can be fined up to 10,000 space credits. This is a
                serious fine because the Royal Galactic Empire takes your
                security very seriously.
              </div>
            </>
          ) : failedAttempts < 14 ? (
            <>
              <div>Error: Invalid credentials.</div>
              <div>
                Warning: Unauthorized access to mail drops is a galactic felony.
                If you are caught attempting to gain access to unauthorized
                data, you can be fined up to 10,000 space credits. This is a
                serious fine because the Royal Galactic Empire takes your
                security very seriously.
              </div>
              <div>
                If you continue to attempt unauthorized access of this sensitive
                data, the Royal Galactic Empire will be forced to take action.
              </div>
            </>
          ) : (
            <>
              Attempted hacking has been detected at this galactic network
              endpoint. Your location is being tracked, and space cats with
              laser have been sent to collect a space fine.
            </>
          ))}
      </div>
    </div>
  );

  const messageView = (
    <div className={classes.innerContent}>
      <div className={classes.message}>{MessageContent}</div>
    </div>
  );

  return (
    <Crt>
      <div className={classes.screen}>
        <div className={classes.heading}>
          <h1 className={classes.title}> GALACTIC ROYAL MAIL DROP</h1>
          <h3 className={classes.title}>Drop Id: {dropId}</h3>
        </div>
        <div className={classes.content}>
          <Fade
            id={loggedIn ? "loggedIn" : "loggedOut"}
            updateChild={(loginState) =>
              setShowLoggedInView(loginState === "loggedIn")
            }
          >
            {showLoggedInView ? messageView : loginView}
          </Fade>
        </div>
      </div>
    </Crt>
  );
};

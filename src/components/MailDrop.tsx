import React, {useState} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {Crt} from 'components/Crt';
import {Fade} from "components/Fade";
import {Button} from "components/Button";

const useStyles = createUseStyles({
  screen: {
    borderRadius: 15,
    width: '70%',
    maxWidth: '1024px',
    height: '100%',
    margin: '0 auto',
    border: "2px solid #Af7",
    background: "black",
    animation: '1s ease-out 0s 1 expand',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heading: {
    height: '15%',
    borderBottom: "1px solid #Af7",
    animation: 'textShadow 1.6s infinite',
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15
  },
  title: {
    margin: 0
  },
  content: {
    height: 'calc(85% - 60px)',
    padding: 30,
  },
  innerContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30
  },
  prompt: {
    fontSize: 20,
    animation: 'textShadow 1.6s infinite',
  },
  form: {
    color: '#Af7',
    fontFamily: 'consolas, Courier New',
    borderRadius: 15,
    background: 'rgb(170, 255, 119, 0.1)',
    width: '80%'
  },
  field: {
    display: 'flex',
    alignItems: 'start',
    padding: '20px'
  },
  formField: {
    fontSize: 20,
    background: 'none',
    outline: 'none',
    border: 'none',
    color: '#Af7',
    fontFamily: 'consolas, Courier New',
    animation: 'textShadow 1.6s infinite',
    width: '100%',
    paddingLeft: 10
  },
  message: {
    textAlign: 'left',
    overflowY: "scroll",
    textIndent: "2em",
    padding: 20,
    height: 'calc(85% - 40px)',

    '&::-webkit-scrollbar': {
      width: 20
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(170, 255, 119, 0.1)',
      width: 10
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(170, 255, 119, 0.9)',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(170, 255, 119, 1)'
    }
  },
  logoutButton: {
    height: '10%'
  }
})


export interface Message {
  paragraphs: string [];
  signOff?: string;
  name?: string;
  title?: string;
}

export interface MailDropProps {
  message: Message,
  username: string,
  password: string,
  dropId: string,
  onLogin?: (guest: boolean) => void;
}

export const MailDrop = ({message, password, username, dropId, onLogin}: MailDropProps) => {
  const classes = useStyles();

  const [loggedIn, setLoggedIn] = useState<boolean>(localStorage.getItem('loggedIn' + dropId) === 'true');

  const [usernameValue, setUsernameValue] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [showLoggedInView, setShowLoggedInView] = useState<boolean>(loggedIn);

  const MessageContent = <div>
    {message.paragraphs.map((p, i) => {
      return <p key={i}>{p}</p>
    })}
    <p style={{textIndent: 0}}>{message.signOff},</p>
    <p style={{textIndent: 0, margin: 0}}>{message.name}</p>
    <p style={{textIndent: 0, margin: 0, fontStyle: 'italic'}}>{message.title}</p>
  </div>

  const submit = async () => {
    if (usernameValue.toUpperCase() === username.toUpperCase() && passwordValue.toUpperCase() === password.toUpperCase()) {
      login();
      onLogin?.(false);
    } else if (usernameValue.toUpperCase() === 'guest'.toUpperCase() && passwordValue.toUpperCase() === 'taut bottom'.toUpperCase()) {
      onLogin?.(true);
    }
  }


  const handleKeyPress = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') {
      submit();
    }
  }

  const login = () => {
    localStorage.setItem('loggedIn' + dropId, 'true');
    setLoggedIn(true);
  }

  const logout = async () => {
    localStorage.removeItem('loggedIn' + dropId);
    setLoggedIn(false);
  }

  const loginView = <div className={classes.innerContent}>
    <div className={classes.prompt}>
      Please log in to continue
    </div>
    <div className={classes.form}>
      <form autoComplete="off">
        <div className={classes.field}>
                <span className={classes.prompt}>
                Name:
                </span>
          <input
              id={'search_username'}
              type="text"
              value={usernameValue}
              onChange={(e) => setUsernameValue(e.target.value.toUpperCase())}
              className={classes.formField}
              autoComplete="off"
              onKeyPress={handleKeyPress}
          />
        </div>
        <div className={classes.field}>
                <span className={classes.prompt}>
                Password:
                </span>
          <input type="text"
                 id={'search_password'}
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
  </div>

  const messageView = <div className={classes.innerContent}>
    <div className={classes.message}>
      {MessageContent}
    </div>
    <div className={classes.logoutButton}>
    <Button
        onClick={logout}>
      Logout
    </Button>
    </div>
  </div>

  return (
      <Crt>
        <div className={classes.screen}>
          <div className={classes.heading}>
            <h1 className={classes.title}> GALACTIC ROYAL MAIL DROP</h1>
            <h3 className={classes.title}>Drop Id: {dropId}</h3>
          </div>
          <div className={classes.content}>
            <Fade id={loggedIn ? 'loggedIn' : 'loggedOut'} updateChild={(loginState) =>  setShowLoggedInView(loginState === 'loggedIn')}>
              {showLoggedInView ? messageView : loginView}
            </Fade>
          </div>
        </div>
      </Crt>
  );
}


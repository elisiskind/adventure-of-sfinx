import React, {useContext, useState} from 'react';
import {createUseStyles} from "react-jss";
import "styles/crt.css";
import {StorageContext} from "storage/StorageProvider";
import {IntroMessage} from "level-0/Message";
import {sleep} from "utils";
import {Crt} from 'components/Crt';

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
    padding: 20
  },
  form: {
    color: '#Af7',
    fontFamily: 'consolas, Courier New',
    borderRadius: 15,
    background: 'rgb(170, 255, 119, 0.1)',
  },
  heading: {
    animation: 'textShadow 1.6s infinite',
    margin: '0 0 30px 0'
  },
  prompt: {
    fontSize: 20,
    animation: 'textShadow 1.6s infinite',
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
  button: {
    fontSize: 20,
    background: 'none',
    outline: 'none',
    border: '1px solid #Af7',
    borderRadius: 15,
    padding: '15px 30px',
    marginTop: 30,
    color: '#Af7',
    fontFamily: 'consolas, Courier New',
    animation: 'textShadow 1.6s infinite',
    cursor: 'pointer'
  },
  loginView: {},
  message: {
    textAlign: 'left',
    overflowY: "scroll",
    textIndent: "2em",
    padding: 20,

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
  hide: {
    opacity: 0
  },
  hideable: {
    '-webkit-transition': 'opacity 0.3s ease-in-out',
    '-moz-transition': 'opacity 0.3s ease-in-out',
    '-ms-transition': 'opacity 0.3s ease-in-out',
    '-o-transition': 'opacity 0.3s ease-in-out',
  }
})

export const MailDrop = () => {
  const classes = useStyles();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const {mutations, loggedIn} = useContext(StorageContext);

  const [loginState, setLoginState] = useState<'LOGGED_OUT' | 'FADE_1' | 'FADE_2' | 'LOGGED_IN'>(loggedIn ? 'LOGGED_IN' : 'LOGGED_OUT');

  const loginViewClasses = `${classes.loginView} ${classes.hideable}${loginState === 'FADE_1' ? ' ' + classes.hide : ''}`
  const messageClasses = `${classes.message} ${classes.hideable}${loginState === 'FADE_2' ? ' ' + classes.hide : ''}`

  const submit = async () => {
    let guestMode = null;
    if (username === process.env.REACT_APP_USERNAME!.toUpperCase() && password === process.env.REACT_APP_PASSWORD!.toUpperCase()) {
      guestMode = true;
    } else if (username === 'guest' && password === 'password') {
      guestMode = false;
    }

    if (guestMode !== null) {
      setLoginState('FADE_1')
      await sleep(300);
      setLoginState('FADE_2')
      mutations.login(guestMode);
      await sleep(300);
      setLoginState('LOGGED_IN')
    }
  }

  const logout = async () => {
    setLoginState('FADE_2')
    await sleep(300);
    mutations.logout();
    setLoginState('FADE_1')
    await sleep(300);
    setLoginState('LOGGED_OUT')
  }

  const message = <div className={messageClasses}>
    <IntroMessage/>
  </div>

  const loginView = <div className={loginViewClasses}>
    <div className={classes.heading}>
      <h1> GALACTIC ROYAL MAIL DROP</h1>
      <div className={classes.prompt}>
        Please log in to continue
      </div>
    </div>
    <form className={classes.form} autoComplete="off">
      <div className={classes.field}>
                <span className={classes.prompt}>
                Name:
                </span>
        <input
            id={'search_username'}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toUpperCase())}
            className={classes.formField}
            autoComplete="off"
        />
      </div>
      <div className={classes.field}>
                <span className={classes.prompt}>
                Password:
                </span>
        <input type="text"
               id={'search_password'}
               value={password}
               onChange={(e) => setPassword(e.target.value.toUpperCase())}
               className={classes.formField}
               autoComplete="off"
        />
      </div>
    </form>
    <div>
      <button className={classes.button} onClick={submit}>
        Submit
      </button>
    </div>
  </div>

  return (
      <Crt>
        <div className={classes.screen}>
          {loggedIn ? message : loginView}
        </div>
        {loggedIn && <button
            className={`${classes.button} ${classes.hideable}${loginState === 'FADE_2' ? ' ' + classes.hide : ''}`}
            onClick={logout}>
            Logout
        </button>}
      </Crt>
  );
}


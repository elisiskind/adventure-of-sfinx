import * as React from 'react';
import {useEffect, useState} from 'react';
import {Navigate} from "react-router-dom";

export interface RedirectorProps {
  to: string;
  mutation?: () => Promise<void>;
};

export const Redirector = ({mutation, to}: RedirectorProps) => {

  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    mutation?.().then(() => {
      setRedirect(true)
    }).catch(err => {
      console.error('Failed to execute mutation during redirect ', err)
    });
  }, [mutation]);

  if (redirect) {
    return <Navigate to={to}/>
  }

  return (
      <></>
  );
};
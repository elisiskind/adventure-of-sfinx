import React, { useContext } from "react";
import "styles/stars.sass";
import { LocalStorageContext } from "storage/LocalStorageProvider";

export const Stars = () => {
  const { flicker } = useContext(LocalStorageContext);

  return (
    <>
      <div id={"stars3"} />
      {flicker ? (
        <>
          <div id={"stars2"} />
          <div id={"stars"} />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

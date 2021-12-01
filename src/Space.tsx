import React from 'react';
import "./Space.css";

export const Space = () => {
  return (
      <div className="root">
        <div className="scene">
          <div className="wrap">
            <div className="wall wall-right"/>
            <div className="wall wall-left"/>
            <div className="wall wall-top"/>
            <div className="wall wall-bottom"/>
            <div className="wall wall-back"/>
          </div>
          <div className="wrap">
            <div className="wall wall-right"/>
            <div className="wall wall-left"/>
            <div className="wall wall-top"/>
            <div className="wall wall-bottom"/>
            <div className="wall wall-back"/>
          </div>
        </div>
      </div>
  );
}

import React from "react";
import ReactDOM from "react-dom";

import './style.css';

const App = () => {
  return (
    <div>
      <div>Hello React Boilerplate</div>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
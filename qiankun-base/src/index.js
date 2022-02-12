import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { registerMicroApps, start } from "qiankun";
import shared from './shared/index'
import App from "./App";
import "antd/dist/antd.css";
import "./index.css";


registerMicroApps([
  {
    name: "vueApp",
    entry: "//localhost:8081",
    container: "#container",
    activeRule: "/app-vue",
  },
  {
    name: "reactApp",
    entry: "//localhost:3001",
    container: "#container",
    activeRule: "/app-react",
    props:{
      shared
    }
  },
]);

start();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

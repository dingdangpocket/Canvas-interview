import ReactDOM from "react-dom";
import "./http/axios";
import { HashRouter as Router } from "react-router-dom";
import { ContextProvider } from "./context/ContextProvider";
import { Provider } from "react-redux";
import store from "./redux/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
var mountNode = document.getElementById("root");
ReactDOM.render(
  <Provider store={store}>
    <ContextProvider>
      <Router>
        <App name="DingDang" />
      </Router>
    </ContextProvider>
  </Provider>,
  mountNode
);
reportWebVitals();

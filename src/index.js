import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

import {combineReducers, createStore} from "redux"
import SystemReducer from "./reducers/System"
import ContentReducer from "./reducers/Content"
import {Provider} from "react-redux"

const RootReducer = combineReducers({ system: SystemReducer, content: ContentReducer })
const store = createStore(RootReducer)

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

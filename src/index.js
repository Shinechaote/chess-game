import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';




class App extends React.Component {
  render()
  {
    return <h1>hi</h1>
  }

}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

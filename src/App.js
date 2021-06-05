import React from 'react';
import './App.css';
import Header from './components/Header'
import OrderSearch from './components/OrderSearch';
class App extends React.Component {
  render() {
    return (
      <div className="App">
          <Header title={"INVOICE GENERATOR"}/>
        <OrderSearch />
      </div>
    );
  }
}

export default App;

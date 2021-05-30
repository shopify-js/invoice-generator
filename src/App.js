import Axios from 'axios';
import React from 'react';
import './App.css';
import Header from './components/header'
class App extends React.Component {

  state = {
    single: false,
    orders: [],
    singleOrder: {}
  }

  async componentDidMount() {
    const url = '/api/products';
    console.log('get products path : ' + url);
    let ordersList = await Axios.get(url);
    console.log(ordersList);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
          {this.state.single && this.state.single == true ? (
            <h2>Order #</h2>
          ) : (
            <h2>Recent Orders</h2>
          )}
        </header>
      </div>
    );
  }
}

export default App;

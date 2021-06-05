import Axios from 'axios';
import React from 'react';
import _ from 'lodash';

class OrderSearch extends React.Component {

    state = {
      single: false,
      orders: []
    }
  
    async componentDidMount() {
      let prod = await Axios.get('/api/products');
      let orders = await Axios.get('/api/orders');
      console.log(orders.data.edges);
      console.log(prod);
      this.setState({ orders: orders.data.edges });
    }
  
    render() {
      let { single, orders } = this.state;
      let ordersList = orders.map(order => {
        return (
            <li className="list-item">{order.node.id}</li>
        )
      })
      return (
        <div className="App">
          <header className="App-header">
            {single && single == true ? (
              <h2>Order #</h2>
            ) : (
              <h2>Recent Orders</h2>
            )}
          </header>
          <div>
                {_.isEmpty(orders) ? (
                    <p>No orders found</p>
                ) : (
                    <ul>
                        {ordersList}
                    </ul>
                )}
          </div>
        </div>
      );
    }
  }

export default OrderSearch;
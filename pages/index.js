import React from "react";
import getOrders from "../server/rest/getOrders";

class Index extends React.Component {
  state = {}

  render() {
    return (
      <div>
        <h1>List of orders</h1>
        <p>Sample app using React and Next.js</p>
      </div>
    )
  }
}

export async function getServerSideProps() {
  // await getOrders();
  return { props: {} }
}

export default Index;

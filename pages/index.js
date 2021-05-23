import React from "react";
import dbConnect from '../utils/dbConnect'

class Index extends React.Component {
  render() {
    return (
      <div>
        <p>Sample app using React and Next.js</p>
      </div>
    )
  }
}

export async function getServerSideProps() {
  await dbConnect()
  
  return { props: {} }
}

export default Index;

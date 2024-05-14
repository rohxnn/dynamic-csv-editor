import React from 'react'
import './Home.css';
//component
import UploadComponent from '../UploadComponent/UploadComponent';

function Home() {
 return (
     <div className="home">
         <UploadComponent></UploadComponent>
     </div>
 )
}

export default Home;
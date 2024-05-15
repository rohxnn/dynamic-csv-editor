import React from 'react'
import './Home.css';
//component
import UploadComponent from '../UploadComponent/UploadComponent';

function Home() {
    return (
        <>
            <header>
                <h1>Dynamic CSV Editor</h1>
            </header>
            <div className="container">
                <UploadComponent></UploadComponent>
            </div>
        </>
    )
}

export default Home;
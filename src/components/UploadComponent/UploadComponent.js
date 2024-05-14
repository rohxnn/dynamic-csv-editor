import React, { useState } from "react";
import './UploadComponent.css'
//parser
import Papa from 'papaparse';
//component
import DataComponent from "../DataComponent/DataComponent";

function UploadComponent() {

    const [result, setResults] = useState([]);

    const handleUploadChange = (e) => {
        Papa.parse(e.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: ((results) => {
                if (results.data) {
                    setResults(results.data);
                }
            })
        });
    }

    return (
        <>
            <div className="header-container">
                <label htmlFor="file" className="upload-button">
                    Upload
                </label>
                <input
                    id="file"
                    type="file"
                    name="file"
                    accept=".csv"
                    onChange={(e) => handleUploadChange(e)}
                    style={{ display: 'none' }}
                />

            </div>
            <div>
                <DataComponent results={result}></DataComponent>
            </div>
        </>

    );
}

export default UploadComponent;
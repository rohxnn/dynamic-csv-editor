import React, { useState } from "react";
import './UploadComponent.css'
//parser
import Papa from 'papaparse';
//component
import DataComponent from "../DataComponent/DataComponent";

function UploadComponent() {

    const [result, setResults] = useState([]);

    const [error, setError] = useState('');

    const handleUploadChange = (e) => {
        if (e.target.files[0].type === 'text/csv') {
            setError('');
            Papa.parse(e.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.data) {
                        setResults(results.data);
                    }
                },
            });
        } else {
            setError('File format not supported');
        }
    };

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
                <small style={{ color: 'red' }}>{error}</small>
            </div>
            <div>
                <DataComponent results={result}></DataComponent>
            </div>
        </>

    );
}

export default UploadComponent;
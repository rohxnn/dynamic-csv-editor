import React, { useEffect, useState } from "react";
import './DataComponent.css'
//parser
import Papa from 'papaparse';

function DataComponent({ results }) {
    const headers = Object.keys(results[0] || {});
    const [newResult, setNewResult] = useState([]);

    useEffect(() => {
        setNewResult(results);
    }, [results]);

    const handleAddClick = () => {
        const newRow = {};
        headers.forEach(header => {
            newRow[header] = '';
        });
        setNewResult([...newResult, newRow]);
    }

    const handleInputChange = (e, i) => {
        const { name, value } = e.target;
        const updatedList = [...newResult];
        updatedList[i][name] = value;
        setNewResult(updatedList);
    }


    const onClickDownload = () => {
        const confirmed = window.confirm('Do you want to download?');
        if(confirmed) {
            exportToCSV(newResult);
        }
     
    }

    const exportToCSV = (data) => {
        const csv = Papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = 'data.csv';
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }

    return (
        <div className="data-box">
            <div>
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {newResult.map((result, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex}>
                                        <input type="text" name={header} value={result[header]}
                                            onChange={(e) => handleInputChange(e, rowIndex)}></input>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {newResult.length > 0 && (
                <div className="button-box">
                    <div>
                        <button type="button" onClick={handleAddClick}>Add Item</button>
                    </div>
                    <div>
                        <button onClick={onClickDownload}>Download</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataComponent;

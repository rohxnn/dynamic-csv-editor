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
        console.log(newResult)
    }

    const handleInputChange = (e, i) => {
        console.log(e.target.name)
        const { name, value } = e.target;
        const updatedList = [...newResult];
        updatedList[i][name] = value;
        setNewResult(updatedList);
    }


    const onClickDownload = () => {
        exportToCSV(newResult);
    }

    const exportToCSV = (data) => {
        const csv = Papa.unparse(data);
        console.log(csv);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        console.log(blob)
        const anchor = document.createElement('a');
        console.log(anchor);
        anchor.href = URL.createObjectURL(blob);
        anchor.download = 'data.csv';
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    }

    return (
        <div>
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
                <div>
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

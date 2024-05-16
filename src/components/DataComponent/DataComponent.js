import React, { useEffect, useState } from "react";
import './DataComponent.css'
//parser
import Papa from 'papaparse';

function DataComponent({ results }) {
    const [headers, setHeaders] = useState([]);
    const [newResult, setNewResult] = useState([]);
    const [newColumn, setnewColumn] = useState('');
    const [searchItem, setSearchItem] = useState([]);
    const [error, setError] = useState('')
    const Swal = require('sweetalert2');

    useEffect(() => {
        setHeaders(Object.keys(results[0] || {}));
        setNewResult(results);
    }, [results]);

    useEffect(() => {
        const orginalResults = results;
        if (searchItem.value !== '') {
            setNewResult(orginalResults.filter((result =>
                result[searchItem.key].toLowerCase().includes(searchItem.value.toLowerCase()))))
        } else {
            setNewResult(results);
        }
    }, [searchItem.value])

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
        Swal.fire({
            title: "Do you want to download the changes?",
            showCancelButton: true,
            confirmButtonText: "download",
        }).then((result) => {
            if (result.isConfirmed) {
                exportToCSV(newResult);
                Swal.fire("downloaded!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("Cancelled", "", "info");
            }
        });
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

    const onClickDeleteRow = (i) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedRow = [...newResult];
                updatedRow.splice(i, 1);
                setNewResult(updatedRow);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }

    const onClickRemoveColumn = (i) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedColumn = [...headers];
                setNewResult(newResult.map(row => {
                    const updatedRow = { ...row };
                    delete updatedRow[updatedColumn[i]];
                    return updatedRow;
                }));
                updatedColumn.splice(i, 1);
                setHeaders(updatedColumn);
                Swal.fire({
                    title: "Deleted!",
                    text: "Your file has been deleted.",
                    icon: "success"
                });
            }
        });
    }

    const onClickAddColumn = () => {
        if (newColumn.trim() !== '') {
            setError('');
            setHeaders([...headers, newColumn]);
            setNewResult(prevResult => prevResult.map(row => ({ ...row, [newColumn]: '' })));
            setnewColumn('');
        } else {
            setError('Column name cannot be empty');
        }
    }

    const ascendingArrow = (header) => {
        const columnSortedResult = newResult.slice().sort((a, b) => {
            const valueA = typeof a[header] === 'string' ? a[header].toLowerCase().trim() : a[header].trim();
            const valueB = typeof b[header] === 'string' ? b[header].toLowerCase().trim() : b[header].trim();
            return valueA.localeCompare(valueB);
        });
        setNewResult(columnSortedResult)
    }

    const descendingArrow = (header) => {
        const columnSortedResult = newResult.slice().sort((a, b) => {
            const valueA = typeof a[header] === 'string' ? a[header].toLowerCase().trim() : a[header].trim();
            const valueB = typeof b[header] === 'string' ? b[header].toLowerCase().trim() : b[header].trim();
            return valueB.localeCompare(valueA);
        });
        setNewResult(columnSortedResult);
    }

    return (
        <div className="data-box">
            <div>
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>
                                    <div className="head-button-box">
                                        {header}
                                        <div className="sort-button">
                                            <button onClick={() => ascendingArrow(header)}>▲</button>
                                            <button onClick={() => descendingArrow(header)}>▼</button>
                                        </div>
                                        <button className="delete-button" onClick={() => onClickRemoveColumn(index)}>X</button>
                                    </div>
                                    <input type="text" className="search-input" onChange={(e) => setSearchItem({ key: header, value: e.target.value })} placeholder="search..."></input>
                                </th>
                            ))}
                            {newResult.length > 0 && (
                                <th>
                                    <div className="add-column-box">
                                        <input type="text" className="add-column" value={newColumn} onChange={(e) => setnewColumn(e.target.value)}></input>
                                        <button onClick={onClickAddColumn}>Add Column</button>
                                        {error && <span style={{ color: 'red' }}>{error}</span>}
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {newResult.map((result, rowIndex) => (
                            <tr key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <td key={colIndex}>
                                        <input className="text-input" type="text" name={header} value={result[header]}
                                            onChange={(e) => handleInputChange(e, rowIndex)}></input>
                                    </td>
                                ))}
                                <th>
                                    <button className="delete-button" onClick={() => onClickDeleteRow(rowIndex)}>X</button>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {newResult.length > 0 && (
                <div className="button-box">
                    <div>
                        <button type="button" className="click-button" onClick={handleAddClick}>Add Row</button>
                    </div>
                    <div>
                        <button className="click-button" onClick={onClickDownload}>Download</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataComponent;

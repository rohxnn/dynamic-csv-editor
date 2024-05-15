import React, { useEffect, useState } from "react";
import './DataComponent.css'
//parser
import Papa from 'papaparse';
//modal 
import ConfirmModal from '../../Modal/ConfirmModal';

function DataComponent({ results }) {
    const [headers, setHeaders] = useState([]);
    const [newResult, setNewResult] = useState([]);
    const [newColumn, setnewColumn] = useState('');
    const [searchItem, setSearchItem] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('')

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
        setShowModal(true); 
        const confirmed = window.confirm('Do you want to download?');
        if (confirmed) {
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

    const onClickDeleteRow = (i) => {
        const updatedRow = [...newResult];
        updatedRow.splice(i, 1);
        setNewResult(updatedRow);
    }

    const onClickRemoveColumn = (i) => {
        const updatedColumn = [...headers];
        setNewResult(newResult.map(row => {
            const updatedRow = { ...row };
            delete updatedRow[updatedColumn[i]];
            return updatedRow;
        }));
        updatedColumn.splice(i, 1);
        setHeaders(updatedColumn);
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

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        // Perform delete operation or any other action
        setShowModal(false);
    };

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
                                        <button onClick={() => onClickRemoveColumn(index)}>X</button>
                                    </div>
                                    <input type="text" onChange={(e) => setSearchItem({ key: header, value: e.target.value })}></input>
                                </th>
                            ))}
                            {newResult.length > 0 && (
                                <th>
                                    <input type="text" value={newColumn} onChange={(e) => setnewColumn(e.target.value)}></input>
                                    <button onClick={onClickAddColumn}>Add Column</button>
                                    {error && <span style={{ color: 'red' }}>{error}</span>}
                                </th>
                            )}
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
                                <th>
                                    <button onClick={() => onClickDeleteRow(rowIndex)}>X</button>
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
                        {showModal && (
                    <ConfirmModal
                    message="Are you sure you want to delete this item?"
                    onCancel={handleCancel}
                    onConfirm={handleConfirm}
                    showModal={showModal}
                    />
                    )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataComponent;

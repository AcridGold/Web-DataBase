import React, { useRef } from 'react';

function FileOperations({ onSave, onLoad }) {
    const fileInputRef = useRef(null);

    const handleLoadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onLoad(file.name);
        }
    };

    return (
        <div className="file-operations">
            <button onClick={() => onSave('titanic_data.json')}>
                Сохранить в файл
            </button>

            <button onClick={handleLoadClick}>
                Загрузить из файла
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept=".json"
            />
        </div>
    );
}

export default FileOperations;
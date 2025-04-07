import React, { useState } from 'react';

function SearchForm({ onSearch, onClear }) {
    const [field, setField] = useState('Name');
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(field, value);
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <select value={field} onChange={(e) => setField(e.target.value)}>
                <option value="PassengerId">ID</option>
                <option value="Name">Имя</option>
                <option value="Pclass">Класс</option>
                <option value="Age">Возраст</option>
                <option value="Survived">Выжил</option>
            </select>

            <input
                type={field === 'Age' || field === 'Pclass' ? 'number' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Введите ${field}`}
            />

            <button type="submit">Поиск</button>
            <button type="button" onClick={() => { setValue(''); onClear(); }}>
                Сброс
            </button>
        </form>
    );
}

export default SearchForm;
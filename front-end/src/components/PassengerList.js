import React from 'react';

function PassengerList({ passengers, onDelete }) {
    return (
        <div className="passenger-list">
            <h2>Список пассажиров ({passengers.length})</h2>
            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Класс</th>
                        <th>Возраст</th>
                        <th>Выжил</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {passengers.map((p) => (
                        <tr key={p.PassengerId}>
                            <td>{p.PassengerId}</td>
                            <td>{p.Name}</td>
                            <td>{p.Pclass}</td>
                            <td>{p.Age || 'N/A'}</td>
                            <td>{p.Survived ? '✅' : '❌'}</td>
                            <td>
                                <button onClick={() => onDelete(p.PassengerId)}>
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PassengerList;
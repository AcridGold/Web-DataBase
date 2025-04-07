import React, { useState } from 'react';

function PassengerForm({ onAdd }) {
    const [form, setForm] = useState({
        PassengerId: '',
        Survived: '0',
        Pclass: '3',
        Name: '',
        Sex: 'male',
        Age: '',
        SibSp: '0',
        Parch: '0',
        Ticket: '',
        Fare: '',
        Cabin: '',
        Embarked: 'S'
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({
            PassengerId: parseInt(form.PassengerId),
            Survived: parseInt(form.Survived),
            Pclass: parseInt(form.Pclass),
            Name: form.Name,
            Sex: form.Sex,
            Age: parseInt(form.Age),
            SibSp: parseInt(form.SibSp),
            Parch: parseInt(form.Parch),
            Ticket: form.Ticket,
            Fare: parseFloat(form.Fare),
            Cabin: form.Cabin,
            Embarked: form.Embarked
        });
    };

    return (
        <form onSubmit={handleSubmit} className="passenger-form">
            <input name="PassengerId" value={form.PassengerId} onChange={handleChange} placeholder="ID" required />
            <select name="Survived" value={form.Survived} onChange={handleChange}>
                <option value="0">Погиб</option>
                <option value="1">Выжил</option>
            </select>
            {/* Остальные поля формы */}
            <button type="submit">Добавить пассажира</button>
        </form>
    );
}
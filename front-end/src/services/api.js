/**
 * Сервис для работы с WASM-модулем базы данных пассажиров
 */

// Путь к WASM-модулю (измените при необходимости)
const WASM_PATH = '../../public/notebook.js';

// Загрузка WASM-модуля
export const loadWasmModule = async () => {
    try {
        const wasmModule = await import(WASM_PATH);
        const module = await wasmModule.default();
        console.log('WASM модуль успешно загружен');
        return module;
    } catch (error) {
        console.error('Ошибка загрузки WASM модуля:', error);
        throw error;
    }
};

// Инициализация базы данных с загрузкой из JSON
export const initializeDatabase = async (wasm) => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    wasm._init_database();

    try {
        const response = await fetch('/data/titanic.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const jsonStr = await response.text();
        const jsonPtr = wasm._malloc(jsonStr.length + 1);

        wasm.stringToUTF8(jsonStr, jsonPtr, jsonStr.length + 1);
        wasm._load_from_json(jsonPtr);
        wasm._free(jsonPtr);

        console.log('База данных инициализирована с Titanic.json');
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
        throw error;
    }
};

// Получение всех пассажиров
export const getAllPassengers = (wasm) => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    const jsonPtr = wasm._get_all_passengers();
    const jsonStr = wasm.UTF8ToString(jsonPtr);
    const passengers = JSON.parse(jsonStr);
    wasm._free_string(jsonPtr);

    return passengers;
};

// Добавление пассажира
export const addPassenger = (wasm, passenger) => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    const {
        PassengerId, Survived, Pclass, Name,
        Sex, Age, SibSp, Parch,
        Ticket, Fare, Cabin, Embarked
    } = passenger;

    const namePtr = wasm._malloc(Name.length + 1);
    const sexPtr = wasm._malloc(Sex.length + 1);
    const ticketPtr = wasm._malloc(Ticket.length + 1);
    const cabinPtr = wasm._malloc((Cabin || '').length + 1);
    const embarkedPtr = wasm._malloc(Embarked.length + 1);

    wasm.stringToUTF8(Name, namePtr, Name.length + 1);
    wasm.stringToUTF8(Sex, sexPtr, Sex.length + 1);
    wasm.stringToUTF8(Ticket, ticketPtr, Ticket.length + 1);
    wasm.stringToUTF8(Cabin || '', cabinPtr, (Cabin || '').length + 1);
    wasm.stringToUTF8(Embarked, embarkedPtr, Embarked.length + 1);

    wasm._add_passenger(
        PassengerId, Survived, Pclass,
        namePtr, sexPtr, Age, SibSp, Parch,
        ticketPtr, Fare, cabinPtr, embarkedPtr
    );

    // Освобождаем память
    [namePtr, sexPtr, ticketPtr, cabinPtr, embarkedPtr].forEach(ptr => wasm._free(ptr));
};

// Удаление пассажира по ID
export const deletePassenger = (wasm, passengerId) => {
    if (!wasm) throw new Error('WASM модуль не загружен');
    wasm._delete_passenger(passengerId);
};

// Поиск пассажиров
export const searchPassengers = (wasm, field, value) => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    const fieldPtr = wasm._malloc(field.length + 1);
    const valuePtr = wasm._malloc(value.length + 1);

    wasm.stringToUTF8(field, fieldPtr, field.length + 1);
    wasm.stringToUTF8(value, valuePtr, value.length + 1);

    const jsonPtr = wasm._search_passengers(fieldPtr, valuePtr);
    const jsonStr = wasm.UTF8ToString(jsonPtr);
    const results = JSON.parse(jsonStr);

    wasm._free(fieldPtr);
    wasm._free(valuePtr);
    wasm._free_string(jsonPtr);

    return results;
};

// Сохранение базы в файл
export const saveToFile = (wasm, filename) => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    const filenamePtr = wasm._malloc(filename.length + 1);
    wasm.stringToUTF8(filename, filenamePtr, filename.length + 1);

    wasm._save_to_file(filenamePtr);
    wasm._free(filenamePtr);
};

// Загрузка базы из файла
export const loadFromFile = async (wasm, file) => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    const filename = file.name;
    const filenamePtr = wasm._malloc(filename.length + 1);
    wasm.stringToUTF8(filename, filenamePtr, filename.length + 1);

    // Для работы с файловой системой в Emscripten
    const data = await file.arrayBuffer();
    wasm.FS.writeFile(filename, new Uint8Array(data));

    wasm._load_from_file(filenamePtr);
    wasm._free(filenamePtr);

    // Чтение обратно для обновления состояния
    return getAllPassengers(wasm);
};

// Вспомогательная функция для создания бинарного файла для скачивания
export const downloadDatabase = (wasm, filename = 'titanic_backup.dat') => {
    if (!wasm) throw new Error('WASM модуль не загружен');

    saveToFile(wasm, filename);

    try {
        const data = wasm.FS.readFile(filename);
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Ошибка при скачивании файла:', error);
        throw error;
    }
};
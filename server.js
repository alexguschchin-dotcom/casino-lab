const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Разрешаем CORS и JSON
app.use(cors());
app.use(express.json());

// Статика
app.use(express.static(path.join(__dirname, 'public')));

// Путь к файлу данных
const DATA_PATH = path.join(__dirname, 'data', 'state.json');

// Функция чтения/записи данных
function readData() {
    try {
        if (!fs.existsSync(DATA_PATH)) {
            // Создаём папку data, если её нет
            if (!fs.existsSync(path.dirname(DATA_PATH))) {
                fs.mkdirSync(path.dirname(DATA_PATH));
            }
            // Начальное состояние
            const initialState = { players: {} };
            fs.writeFileSync(DATA_PATH, JSON.stringify(initialState, null, 2));
            return initialState;
        }
        const raw = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error('Ошибка чтения данных:', err);
        return { players: {} };
    }
}

function writeData(data) {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Ошибка записи данных:', err);
    }
}

// API: получить состояние игрока
app.get('/api/player/:name', (req, res) => {
    const name = req.params.name;
    const data = readData();
    const player = data.players[name] || { completed: [], results: {}, totalScore: 0, bonusCount: 0 };
    res.json(player);
});

// API: сохранить состояние игрока
app.post('/api/player/:name', (req, res) => {
    const name = req.params.name;
    const newState = req.body;
    const data = readData();
    data.players[name] = newState;
    writeData(data);
    res.json({ success: true });
});

// Все остальные запросы → index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер квеста запущен на порту ${PORT}`);
});

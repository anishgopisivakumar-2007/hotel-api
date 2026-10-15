const express = require('express');

const PORT = process.env.PORT || 8080; 
const app = express();
let { rooms, validateRoom } = require('./roomsStore');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.post('/api/rooms', (req, res) => {
    const check = validateRoom(req.body);
    if (check.error) return res.status(400).json({ error: check.error });

    const newRoom = { id: `room-${Date.now()}`, ...check.validData };
    rooms.push(newRoom);
    res.status(201).json(newRoom);
});

app.get('/api/rooms', (req, res) => {
    let result = [...rooms];
    const { name, location, type, available, minPrice, maxPrice, sortBy, order, limit, offset } = req.query;

    if (name) result = result.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    if (location) result = result.filter(r => r.location.toLowerCase().includes(location.toLowerCase()));
    if (type) result = result.filter(r => r.type === type);
    if (available !== undefined) result = result.filter(r => r.available === (available === 'true'));
    if (minPrice) result = result.filter(r => r.pricepernight >= parseFloat(minPrice));
    if (maxPrice) result = result.filter(r => r.pricepernight <= parseFloat(maxPrice));

    if (sortBy) {
        const dir = order && order.toLowerCase() === 'desc' ? -1 : 1;
        result.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0) * dir);
    }

    const start = parseInt(offset) || 0;
    const size = parseInt(limit) || result.length;
    res.status(200).json(result.slice(start, start + size));
});

app.get('/api/rooms/:id', (req, res) => {
    const room = rooms.find(r => r.id === req.params.id);
    if (!room) return res.status(404).json({ error: "Record not found" });
    res.status(200).json(room);
});

app.put('/api/rooms/:id', (req, res) => {
    const index = rooms.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Record not found" });

    const check = validateRoom(req.body, req.params.id);
    if (check.error) return res.status(400).json({ error: check.error });

    rooms[index] = { id: req.params.id, ...check.validData };
    res.status(200).json(rooms[index]);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
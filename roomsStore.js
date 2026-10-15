const ALLOWED_TYPES = ["SINGLE", "DOUBLE", "SUITE", "DELUXE", "FAMILY"];

let rooms = [
    {
        id: "room-1",
        name: "Standard Cozy Single",
        location: "Floor 1 Wing A",
        type: "SINGLE",
        pricepernight: 99.99,
        capacity: 1,
        available: true,
        roomNumber: "RM101"
    }
];

function validateRoom(body, currentRoomId = null) {
    let { name, location, type, pricepernight, capacity, available, roomNumber } = body;

    if (typeof name !== 'string') return { error: "Name must be a string" };
    name = name.trim();
    if (name.length < 3 || name.length > 60) return { error: "Name must be between 3 and 60 characters" };

    if (typeof location !== 'string') return { error: "Location must be a string" };
    location = location.trim();
    if (location.length < 2 || location.length > 40) return { error: "Location must be between 2 and 40 characters" };

    if (!ALLOWED_TYPES.includes(type)) return { error: "Invalid room type" };

    if (typeof pricepernight !== 'number' || isNaN(pricepernight)) return { error: "Price must be a number" };
    if (pricepernight <= 0 || pricepernight > 100000) return { error: "Price out of bounds" };

    if (!Number.isInteger(capacity)) return { error: "Capacity must be an integer" };
    if (capacity < 1 || capacity > 10) return { error: "Capacity must be between 1 and 10" };

    if (typeof available !== 'boolean') return { error: "Available must be a boolean" };

    if (typeof roomNumber !== 'string') return { error: "Room number must be a string" };
    if (roomNumber.length < 4 || roomNumber.length > 20) return { error: "Room number must be 4-20 characters" };

    const isDuplicate = rooms.some(r => 
        r.roomNumber.toLowerCase() === roomNumber.toLowerCase() && r.id !== currentRoomId
    );
    if (isDuplicate) return { error: "Room number must be unique" };

    return { validData: { name, location, type, pricepernight, capacity, available, roomNumber } };
}

module.exports = { rooms, validateRoom };
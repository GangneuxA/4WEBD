require('dotenv').config()
const URLEVENT = process.env.URLEVENT;
const URLBUY = process.env.URLBUY;
const URLUSER = process.env.URLUSER;
const URLFRONT = process.env.URLFRONT;
let eventID = '';

beforeAll(() => {
   // Create a user and authenticate
    console.log("Hello ??")
});

afterAll(() => {
    // Delete the test user
    console.log("Done.")
});

describe('Event Controller', () => {
    it('should insert a new event', async () => {
        const newEvent = { name: 'Event', desc: 'Description', numberDispo: 10, price: 20 };

        const response = await fetch(URLEVENT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent),
        });

        const event = await response.json();
        eventID = event._id;

        expect(response.status).toBe(201);
    });

    it('should fetch all events with pagination', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLEVENT}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        expect(response.status).toBe(200);

    });

    it('should fetch an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLEVENT}/${eventID}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
        });

        expect(response.status).toBe(200);

    });

    it('should update an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedEvent = { name: 'update', desc: 'Description', numberDispo: 20, price: 20 };

        const response = await fetch(`${URLEVENT}/${eventID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(updatedEvent),
        });

        expect(response.status).toBe(200);

    });

    it('should delete an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(`${URLEVENT}/${eventID}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json' },
        });

        expect(response.status).toBe(200);

    });
});

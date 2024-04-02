require('dotenv').config()
const URLEVENT = process.env.URLEVENT;
const URLBUY = process.env.URLBUY;
const URLUSER = process.env.URLUSER;
const URLLOGIN = process.env.URLLOGIN;
let eventID = '';
let userId = '';
let jwt = '';

describe('Event Controller', () => {
    beforeAll(async () => {
        // Create a user
        const email = Math.random().toString(16).substring(2, 16) + '@example.test';
        const newUser = {email: email, firstname: 'Test', lastname: 'Mann', password: 'password'};
        const response = await fetch(`${URLUSER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });
        const userResponse = await response.json();
        userId = userResponse.data._id;

        // HACK : Manually wait for the user to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Authenticate as the new user
        const credentials = {email: newUser.email, password: newUser.password}
        const loginResponse = await fetch(`${URLLOGIN}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),

        })
        const loginJson = await loginResponse.json();
        jwt = loginJson.token;
        console.debug(`Grabbed auth token : ${jwt}`);

    });
    afterAll(() => {
        // Delete the test user
        console.log("This is where we should delete user " + userId);
    });

    it('should insert a new event', async () => {
        const newEvent = {name: 'Event', desc: 'Description', numberDispo: 10, price: 20};

        const response = await fetch(URLEVENT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
            headers: {'Accept': 'application/json'},
        });

        expect(response.status).toBe(200);

    });

    it('should fetch an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLEVENT}/${eventID}`, {
            method: 'GET',
            headers: {'Accept': 'application/json'},
        });

        expect(response.status).toBe(200);

    });

    it('should update an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedEvent = {name: 'update', desc: 'Description', numberDispo: 20, price: 20};

        const response = await fetch(`${URLEVENT}/${eventID}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            body: JSON.stringify(updatedEvent),
        });

        expect(response.status).toBe(200);

    });

    it('should delete an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(`${URLEVENT}/${eventID}`, {
            method: 'DELETE',
            headers: {'Accept': 'application/json'},
        });

        expect(response.status).toBe(200);

    });
});

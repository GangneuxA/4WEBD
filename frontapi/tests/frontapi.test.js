require('dotenv').config()
const URLEVENT = process.env.URLEVENT;
const URLBUY = process.env.URLBUY;
const URLUSER = process.env.URLUSER;
const URLUSERSERVICE = process.env.URLUSERSERVICE;
const URLLOGIN = process.env.URLLOGIN;
let eventId = '';
let testUserId = '';
let jwt = '';
let headers = {'Content-Type': 'application/json', 'Accept': 'application/json'};

const randomString = Math.random().toString(16).substring(2, 16);

describe('Front API tests', () => {
    // Before all tests : Get authentication token
    beforeAll(async () => {
        // Create a user
        const email = randomString + '@example.test';
        const newUser = {email: email, firstname: 'Test', lastname: 'Mann', password: 'password', role: 'admin'};
        const response = await fetch(`${URLUSERSERVICE}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newUser),
        });
        const userResponse = await response.json();
        testUserId = userResponse._id;

        // HACK : Manually wait for the user to be created
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Authenticate as the new user
        const credentials = {email: newUser.email, password: newUser.password}
        const loginResponse = await fetch(`${URLLOGIN}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(credentials),

        })
        const loginJson = await loginResponse.json();
        jwt = loginJson.token;
        headers.Authorization = `Bearer ${jwt}`;
        console.debug(`Grabbed auth token for test user.`);

    });
    // When tests are done : delete the test user
    afterAll(async () => {
        // Delete the test user
        const response = await fetch(`${URLUSER}`, {
            method: 'DELETE',
            headers: headers
        });
        const deleteResponse = await response.json();
        console.log("Deleting test user " + testUserId + " : " + deleteResponse.status);

    });

    it('should insert a new event', async () => {
        const newEvent = {name: `Event-${randomString}`, desc: 'Description', numberDispo: 10, price: 20};

        const response = await fetch(URLEVENT, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newEvent),
        });

        const event = await response.json();
        eventId = event.data._id;

        expect(response.status).toBe(200);
    });

    it('should fetch all events with pagination', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLEVENT}`, {
            method: 'GET',
            headers: headers,
        });

        expect(response.status).toBe(200);

    });

    it('should fetch an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLEVENT}/${eventId}`, {
            method: 'GET',
            headers: headers,
        });

        expect(response.status).toBe(200);

    });

    it('should update an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedEvent = {name: 'update', desc: 'Description', numberDispo: 20, price: 20};

        const response = await fetch(`${URLEVENT}/${eventId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedEvent),
        });

        expect(response.status).toBe(200);

    });

    it('should delete an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(`${URLEVENT}/${eventId}`, {
            method: 'DELETE',
            headers: headers,
        });

        expect(response.status).toBe(200);

    });
});

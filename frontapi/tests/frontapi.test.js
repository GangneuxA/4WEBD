require('dotenv').config()
const URLEVENT = process.env.URLEVENT;
const URLEVENTSERVICE = process.env.URLEVENTSERVICE;
const URLBUY = process.env.URLBUY;
const URLUSER = process.env.URLUSER;
const URLUSERSERVICE = process.env.URLUSERSERVICE;
const URLLOGIN = process.env.URLLOGIN;
const DELETE_USER_AFTER_TESTS = process.env.DELETE_USER_AFTER_TESTS;
let testEventId = '';
let testUserId = '';
let testBuyId = '';
let jwt = '';
let headers = {'Content-Type': 'application/json', 'Accept': 'application/json'};

const randomString = Math.random().toString(16).substring(2, 16);

async function createTestUserAndAuthenticate() {
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
    console.debug(`Grabbed auth token for test user : ${jwt}`);
}

async function deleteTestUser() {
    // Delete the test user
    const response = await fetch(`${URLUSER}`, {
        method: 'DELETE',
        headers: headers
    });
    const deleteResponse = await response.json();
    console.debug("Deleting test user " + testUserId + " : " + deleteResponse.status);
}

async function createTestEvent() {
    // Create an event
    const newEvent = {
        name: `Event-${randomString}`,
        desc: 'Event created during automated testing.',
        numberDispo: 10,
        price: 20
    };

    const eventResponse = await fetch(URLEVENTSERVICE, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newEvent),
    });

    const event = await eventResponse.json();
    testEventId = event._id;
}

async function deleteTestEvent() {
    // Delete the test user
    const eventResponse = await fetch(`${URLEVENTSERVICE}/${testEventId}`, {
        method: 'DELETE',
        headers: headers
    });
    const eventDeleteResponse = await eventResponse.json();
    console.debug(eventDeleteResponse);
    console.debug("Deleting test event " + testEventId + " : " + eventDeleteResponse.status);
}

describe('Front API tests', () => {
    // Before all tests : Create user and event
    beforeAll(async () => {
        await createTestUserAndAuthenticate();
        await createTestEvent();
    });
    // When tests are done : delete the test user
    afterAll(async () => {
        if (DELETE_USER_AFTER_TESTS) {
            await deleteTestUser();
        } else {
            console.debug("Test user was NOT DELETED. Set DELETE_USER_AFTER_TESTS env var to true.");
        }
        await deleteTestEvent();
    });

    // "event" tests
    it('should insert a new event', async () => {
        const newEvent = {name: `Event-${randomString}`, desc: 'Description', numberDispo: 10, price: 20};

        const response = await fetch(URLEVENT, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newEvent),
        });

        const event = await response.json();

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

        const response = await fetch(`${URLEVENT}/${testEventId}`, {
            method: 'GET',
            headers: headers,
        });

        expect(response.status).toBe(200);

    });

    it('should update an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const updatedEvent = {name: 'update', desc: 'Description', numberDispo: 20, price: 20};

        const response = await fetch(`${URLEVENT}/${testEventId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedEvent),
        });

        expect(response.status).toBe(200);

    });

    it('should delete an event by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1500));

        const response = await fetch(`${URLEVENT}/${testEventId}`, {
            method: 'DELETE',
            headers: headers,
        });

        expect(response.status).toBe(200);

    });

    // "buy" tests
    it('should insert a new buy', async () => {
        const newBuy = { user: testUserId, event: testEventId, count: 1 };

        const response = await fetch(URLBUY, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newBuy),
        });

        const createdBuy = await response.json();
        // TODO : This fails with a cryptic error message :
        //  "Failed to get account to"
        console.debug(createdBuy);
        testBuyId = createdBuy.data._id;

        expect(response.status).toBe(201);
    });


    it('should get all buys', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(URLBUY, {
            method: 'GET',
            headers: headers
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });


    it('should get buys by user ID', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLBUY}/${testUserId}`, {
            method: 'GET',
            headers: headers
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });

});

require('dotenv').config()
const URLBUY = process.env.URLBUY;
let buyID = ''

describe('Buy Controller', () => {
    
    it('should insert a new buy', async () => {
        const newBuy = { user: '65fc26b586ae5b50a1cdd5b3', event: '65fc25a586ae5b50a1cdd5b3', count: 1 }; 

        const response = await fetch(URLBUY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBuy),
        });

        const createdBuy = await response.json();
        buyID = createdBuy._id;

        expect(response.status).toBe(201);
    });

    
    it('should get all buys', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const response = await fetch(URLBUY, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });

    
    it('should get buys by user ID', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const userID = '65fc26b586ae5b50a1cdd5b3'; 
        const response = await fetch(`${URLBUY}/${userID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });

    it('should get buys by event ID', async () => {
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        const eventID = '65fc25a586ae5b50a1cdd5b3'; 
        const response = await fetch(`${URLBUY}/event/${eventID}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    });
});
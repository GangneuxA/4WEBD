require('dotenv').config()
const URLUSER = process.env.URLUSER;
let userID = ''

describe('User Controller', () => {

    it('should insert a new user', async () => {
        const newUser = { email: 'c', firstname: 'c', lastname: 'c', password: 'c' };
    
        const response = await fetch(`${URLUSER}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        });
    
        
        userID = await response.json();
        userID = userID._id;
    
       
        expect(response.status).toBe(201);
    
        
    });
    
    it('should get all users', async () => {
        
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(`${URLUSER}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
    
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    
    });
    
    it('should get a user by id', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const id = userID +'/'
        const response = await fetch(`${URLUSER}${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
    
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    
    });

    it('should update a user by ID', async () => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        const id = userID +'/'
        const updatedUser = { email: 'updated@example.com' };
        const response = await fetch(`${URLUSER}${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        userEmail = await response.json();
        userEmail = userEmail.email;
    
        expect(response.status).toBe(200);
        expect(userEmail).toBe('updated@example.com');
    
    });

    it('should delete a user by ID', async () => {

        await new Promise(resolve => setTimeout(resolve, 1500));

        const id = userID +'/'
        const response = await fetch(`${URLUSER}${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });
    
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
    
    });
});
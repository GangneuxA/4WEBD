require('dotenv').config()
const request = require("supertest");
const URLUSER = process.env.URLUSER;
let userID = ''

describe('User Controller', () => {

    it('should insert a new user', async () => {
        const newUser = { email: 'test@example.com', firstname: 'John', lastname: 'Doe', password: 'password123' };
    
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


    // it('should update a user by ID', async () => {
    // const updatedUser = { email: 'updated@example.com' };
    // const response = await request(app)
    //     .put('/users/'+userID)
    //     .send(updatedUser);
    // expect(response.status).toBe(200);
    // // Ajoutez d'autres assertions ici pour vérifier la structure de la réponse et les données retournées
    // });

    // it('should delete a user by ID', async () => {
    // const response = await request(app).delete('/users/'+userID);
    // expect(response.status).toBe(200);
    // // Ajoutez d'autres assertions ici pour vérifier la structure de la réponse et les données retournées
    // });
});
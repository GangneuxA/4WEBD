var express = require('express');
var router = express.Router();


const userControllers = require('../controllers/userControllers')
 
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authentification de l'utilisateur
 *     description: Authentifie un utilisateur en vérifiant les informations d'identification fournies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'adresse e-mail de l'utilisateur.
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Succès de l'authentification. Retourne les informations de l'utilisateur et un jeton d'accès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   description: Jeton d'accès JWT pour l'utilisateur authentifié.
 *       '401':
 *         description: Echec de l'authentification en raison d'un mot de passe incorrect ou d'un utilisateur non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur indiquant le problème d'authentification.
 *       '500':
 *         description: Une erreur s'est produite lors de l'authentification de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Error
 *                 message:
 *                   type: string
 *                   example: An error occurred while login
 *                 error:
 *                   type: string
 *                   example: Error message detailing the authentication error.
 */
router.post('', userControllers.login);


module.exports = router;

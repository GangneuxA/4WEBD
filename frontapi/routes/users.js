var express = require('express');
var router = express.Router();

const auth = require('../middleware/auth');
const userControllers = require('../controllers/userControllers')

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: unique user id.
 *         email:
 *           type: string
 *           description: The user's email address.
 *         firstname:
 *           type: string
 *           description: The user's firstname.
 *         lastname:
 *           type: string
 *           description: The user's lastname.
 *   
 */

/**
 * @swagger
 * /users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupère la liste des utilisateurs paginée
 *     tags: 
 *       - users
 *     description: Récupère la liste des utilisateurs avec pagination.
 *     parameters:
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalCount:
 *                   type: integer
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur lors de la récupération des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.get('/',auth, userControllers.index);

/**
 * @swagger
 * /users/{id}/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Récupérer un utilisateur par ID
 *     tags: 
 *       - users
 *     description: Récupère un utilisateur par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à récupérer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne l'utilisateur correspondant à l'ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Aucun utilisateur trouvé avec l'ID fourni.
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
 *                   example: No user 
 *       '500':
 *         description: Une erreur s'est produite lors de la récupération de l'utilisateur.
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
 *                   example: An error occurred while searching for user 
 *                 error:
 *                   type: string
 */
router.get("/:id", auth, userControllers.findById);
 
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Insérer un nouvel utilisateur
 *     tags: 
 *       - users
 *     description: Insère un nouvel utilisateur avec les détails fournis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - firstname
 *               - lastname
 *               - password
 *     responses:
 *       '201':
 *         description: Utilisateur inséré avec succès. Retourne les détails de l'utilisateur inséré.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Une erreur s'est produite lors de l'insertion du nouvel utilisateur.
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
 *                   example: An error occurred while inserting new user
 *                 error:
 *                   type: string
 */
router.post('/', userControllers.insert);
 
/**
 * @swagger
 * /users/{id}/:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Mettre à jour un utilisateur
 *     tags: 
 *       - users
 *     description: Met à jour les informations d'un utilisateur existant avec les détails fournis.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à mettre à jour
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne les informations mises à jour de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: Aucun utilisateur trouvé avec l'ID fourni.
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
 *                   example: No user found 
 *       '500':
 *         description: Une erreur s'est produite lors de la mise à jour de l'utilisateur.
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
 *                   example: An error occurred while updating user 
 *                 error:
 *                   type: string
 */
router.put('/',auth, userControllers.update);
 
/**
 * @swagger
 * /users/{id}/:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un utilisateur
 *     tags: 
 *       - users
 *     description: Supprime un utilisateur existant avec l'ID spécifié.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'utilisateur à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne l'utilisateur supprimé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: ID invalide fourni.
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
 *                   example: Invalid ID
 *       '404':
 *         description: Aucun utilisateur trouvé avec l'ID fourni.
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
 *                   example: No user found 
 *       '500':
 *         description: Une erreur s'est produite lors de la suppression de l'utilisateur.
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
 *                   example: An error occurred while deleting user 
 *                 error:
 *                   type: string
 */
router.delete('/',auth, userControllers.delete);



module.exports = router;

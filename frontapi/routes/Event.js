var express = require("express");
var router = express.Router();

const auth = require("../middleware/auth");
const EventControllers = require("../controllers/EventControllers");

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: unique event id.
 *         name:
 *           type: string
 *           description: The event's name.
 *         desc:
 *           type: string
 *           description: The event's description.
 *         placeDispo:
 *           type: integer
 *           description: .
 *         price:
 *           type: integer
 *           description: event price
 *   
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Récupérer la liste des événements
 *     description: Récupère la liste des événements paginée.
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Le numéro de la page à récupérer
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: perPage
 *         description: Nombre d'événements par page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne la liste paginée des événements.
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
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       '500':
 *         description: Une erreur s'est produite lors de la récupération des événements.
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
 *                   example: An error occurred while fetching event
 *                 error:
 *                   type: string
 */
router.get("/", EventControllers.index);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Récupérer un événement par ID
 *     description: Récupère un événement par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'événement à récupérer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne l'événement correspondant à l'ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Aucun événement trouvé avec l'ID fourni.
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
 *                   example: No event found 
 *       '500':
 *         description: Une erreur s'est produite lors de la récupération de l'événement.
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
 *                   example: An error occurred while fetching event
 *                 error:
 *                   type: string
 */
router.get("/:id", EventControllers.findById);

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Insérer un nouvel événement
 *     description: Insère un nouvel événement avec les détails fournis.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de l'événement.
 *               desc:
 *                 type: string
 *                 description: La description de l'événement.
 *               numberDispo:
 *                 type: integer
 *                 description: Le nombre de places disponibles pour l'événement.
 *               price:
 *                 type: number
 *                 description: Le prix de l'événement.
 *             required:
 *               - name
 *               - desc
 *               - numberDispo
 *               - price
 *     responses:
 *       '201':
 *         description: Événement inséré avec succès. Retourne les détails de l'événement inséré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/components/schemas/Event'
 *       '500':
 *         description: Une erreur s'est produite lors de l'insertion du nouvel événement.
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
 *                   example: An error occurred while inserting new Event
 *                 error:
 *                   type: string
 */
router.post("/", auth, EventControllers.insert);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Mettre à jour un événement
 *     description: Met à jour les informations d'un événement existant avec les détails fournis.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'événement à mettre à jour
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
 *               name:
 *                 type: string
 *                 description: Le nouveau nom de l'événement.
 *               desc:
 *                 type: string
 *                 description: La nouvelle description de l'événement.
 *               numberDispo:
 *                 type: integer
 *                 description: Le nouveau nombre de places disponibles pour l'événement.
 *               price:
 *                 type: number
 *                 description: Le nouveau prix de l'événement.
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne les informations mises à jour de l'événement.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Success
 *                 message:
 *                   type: string
 *                   example: Event updated successfully
 *                 updatedEvent:
 *                   $ref: '#/components/schemas/Event'
 *       '404':
 *         description: Aucun événement trouvé avec l'ID fourni.
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
 *                   example: No event found 
 *       '500':
 *         description: Une erreur s'est produite lors de la mise à jour de l'événement.
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
 *                   example: An error occurred while updating event 
 *                 error:
 *                   type: string
 */
router.put("/:id", auth, EventControllers.update);

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Supprimer un événement
 *     description: Supprime un événement existant avec l'ID spécifié.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID de l'événement à supprimer
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Succès de la requête. Retourne l'événement supprimé.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
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
 *         description: Aucun événement trouvé avec l'ID fourni.
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
 *                   example: No event found 
 *       '500':
 *         description: Une erreur s'est produite lors de la suppression de l'événement.
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
 *                   example: An error occurred while deleting event 
 *                 error:
 *                   type: string
 */
router.delete("/:id", auth, EventControllers.delete);

module.exports = router;

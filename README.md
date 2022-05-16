# Exercice de serveur HTTP

## Comment l'utiliser ?
Le serveur peut être démarré en utilisant la commande `npm start`. Vous pouvez regarder dans le `package.json`, dans la propriété `scripts`, ce que fait cette commande.

Pour le client, vous pouvez tester votre serveur en rajoutant des requêtes dans le fichier `client.js` et le lancer avec la commande `node client.js`. Si vous le voulez, vous pouvez également créer un script dans le `package.json` pour faciliter le lancement de client. Attention, un nom de script est forcément unique ! Par convention, on peut regrouper des scripts en ajoutant des préfix avec `:`. Exemples : `start:server`, `start:client`, `test:server`, `test:client`, ….

## Fonctions actuelles
* Liste les produits disponibles
* Récupère les informations d'un produits par son ID
* Insère un produit avec l'ID fourni

## Fonctions à implémenter
- [] Corriger la route `PUT /products/:id` pour qu'elle remplace un produit existant
- [] Créer une route permettant de rajouter des produits sans donner d'ID (lui en attribuer un  sur le serveur)
- [] Créer une route permettant de supprimer un produit
- [] Créer une route permettant de changer le prix d'un produit (sans l'écraser)

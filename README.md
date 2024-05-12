# Application Yam Master - Architecture applicative

Cette application est un jeu mobile codé en react-native, ayant pour but de travailler sur l'architecture applicative et les websockets.

Deux modes de jeu sont disponibles sur cette v1 de l'application :

- un mode multijoueur ou deux joueurs s'affronte
- un versus bot, avec actuellement deux niveaux disponibles, le niveau difficile n'est pas fini

Le bot utilise des fonctions conditionnelles ainsi qu'un réseau de neuronne pour le niveau moyen.
On a créé le model d'IA par réseau de neuronne avec la bibliothèque: Brain.js

La palette de couleur est inspirée de OIL 6 PALETTE de GrafxKid (https://lospec.com/palette-list/oil-6). Le jeu a été maquetté sur Figma.
Les animations des dés et des boutons ont été réalisées avec react reanimated (https://www.reanimated3.com/).

## 🚀 How to use

### Démarrer l'application web/mobile (front)

- Lancer `yarn` ou `npm install` pour installer les dépendances.
- Utilisation sur mobile : ouvrir `App.js` et changer le `socketEndpoint` en haut du fichier pour pointer vers votre ip.
- Exécuter `yarn start` ou `npm run start` pour démarrer l'application web/mobile.

### Démarrer le serveur node.js websocket (back)

- `cd` vers le dossier `websocket-server-folder`
- Exécuter `yarn` or `npm install` pour installer les dépendances.
- Exécuter `yarn start` or `npm run start` pour démarrer le serveur node.js websocket.

## 📝 Notes

Le code de l'IA se situe dans le dossier IA du dossier `websocket-server-folder`.
Dans le dossier `data` en input on a les valeurs des dés et en output les dés à lock sous format d'un tableau de valeurs booléennes.

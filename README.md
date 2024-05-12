# Application Yam Master - Architecture applicative

Cette application est un jeu mobile codé en react-native, ayant pour but de travailler sur l'architecture applicative et les websockets.

Deux modes de jeu sont disponibles sur cette v1 de l'application :
- un mode multijoueur ou deux joueurs s'affronte,
- un versus bot, avec actuellement deux niveaux disponibles, le niveau difficile est actuellement en cours de preparation

Le bot utilise un reseau de neuronne, actuellement celui d'une bibliothete: brain.js

La palette de couleur est inspirée de OIL 6 PALETTE de GrafxKid (https://lospec.com/palette-list/oil-6). Le jeu a été maquetté sur Figma. Les animations des dés et des bouttons ont été réalisées avec react reanimated (https://www.reanimated2.com/).

## 🚀 How to use

### Running the app

- Run `yarn` or `npm install`
- Open `App.js` and change the `socketEndpoint` at the top of the file to point to your endpoint.
- Open `app` with `yarn start` or `npm run start` to try it out.

### Running the server

- `cd` into the `backend` directory and run `yarn` or `npm install`, then run `yarn start` or `npm run start`
- Install [ngrok](https://ngrok.com/download) and run `ngrok http 3000` and copy the https url that looks something like this `https://f7333e87.ngrok.io`.

## 📝 Notes

React Native provides a socket-io compatible WebSocket implementation, some people get tripped up on the https requirement so this example helps to clarify how you can get it running.

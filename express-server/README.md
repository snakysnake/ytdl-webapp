# How to setup Express / Prisma Server

## First we need to install the dependencies...
`yarn add prisma typescript ts-node @types/node --save-dev`

`yarn add express @types/express`

`npx prisma init`

`yarn add @prisma/client`

We also need to set up the (postgre-)SQL server
... and then, after setting it up, paste credentials in to .env file

## Migrate Database
Das geht in dem wir den folgenden Command ausführen: 

`npx prisma migrate dev --name init`

`yarn add nodemon`

`yarn add cors`

## Start Server 

`yarn devStart`


GANZ WICHTIG:
1) vue build in ytdl/express-server/public/dist legen
....


--- allgemeines ---
server port einstellungen in "express-server"
target file einstellungen in background-worker.py
datenbank immer up 2 date halten mit dem filebestand


--- more (eng)...
you need to create https certificates or you need to change to http.
else you will get an error when making a request to this server.

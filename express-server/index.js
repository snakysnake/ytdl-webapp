import { PrismaClient } from '@prisma/client';
import express from 'express';
import bodyParser from 'body-parser';
import { login, register } from './shared.mjs';
import { verifyToken } from './middleware.mjs';

// start prisma client
const prisma = new PrismaClient()

// export server stuff
import https from "https";
import cors from "cors"
import fs from "fs";

const app = express();

// prepare to use json
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


// https://stackoverflow.com/questions/47742351/how-to-make-a-virtual-static-path-by-express
// var path = require('path');
// var STATIC_PATH = path.resolve(__dirname, './dist'); 
// app.use('/music', express.static(STATIC_PATH));

app.use(express.static('./public/dist'));
app.use('/music_thumbnails', express.static('./public/music_thumbnails'));
app.use('/music', express.static('./public/music'));


// get all users as json by posting

app.post('/createuser', async (req, res) => {
  // wir machen da iwie ne zuweisung und das as any nennt man in ts 'casten'
  const { name, password, email, keytocreateuser } = req.body;

  if (name.includes(" ")) {
    return res.status(418).send("I am a Teapot and a Space is not ok in username.");
  }

  // ----------------- CREATE STATEMENT ------------------
  // here its important to set a complex key :) 
  // dont do stuff like this in any project.. it was one of my first projects when it comes to serverside js 
  // and i did not really know what i was doing..
  // but i knew it was unsafe, but yeahhhhh

  if (keytocreateuser != process.env.CREATION_KEY) {
    return res.status(403).send("Incorrect Key");
  }

  const { success, message } = await register(email, name, password);
  if (!success) {
    return res.status(419).send(message);
  }


  return res.send(message);
  // ----------------------------------------------------
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(419).send("Missing info");
  }

  let response = await login(username, password)
  return res.json(response);
});

app.post('/lookforsong', verifyToken, async (req, res) => {
  let { name } = req.query;

  if (name == undefined) {
    name = "";
  }

  const getSongByName = await prisma.song.findMany({
    where: {
      OR: [{
        name: {
          contains: name,
        }
      },
      {
        album: {
          contains: name,
        }
      },
      {
        artist: {
          contains: name,
        }
      }],
      NOT: [{
        ready: 0,
        name: 'downloading',
      }]
    }
  });

  return res.json(getSongByName);
});

app.get('/getsongtodownload', async (req, res) => {
  const getSongToDownload = await prisma.song.findFirst({
    where: {
      ready: 0,
    },

    select: {
      id: true,
      link: true,
    }
  });

  if (getSongToDownload !== null) {
    // set song ready so our background script does not get con fu sed

    // figure out how to insert the id here... @benedev? xD
    let songToDownloadId = Object.values(getSongToDownload)[0];
    console.log("EOI: " + songToDownloadId);
    const setSongToReady = await prisma.song.update({
      where: {
        id: songToDownloadId,
      },
      data: {
        ready: 1,
      }
    })

    return res.json(getSongToDownload);
  } else {
    return res.json("0")
  }
});

app.post('/updatedownloadedsong', async (req, res) => {
  const { id, name, filename, image_filename, album, artist } = req.body;
  let id_int = parseInt(id);
  const updateDownloadedSong = await prisma.song.update({
    where: {
      id: id_int,
    },
    data: {
      name: name,
      filename: filename,
      image_filename: image_filename,
      album: album,
      artist: artist,
    }
  });
  if (updateDownloadedSong === null) {
    // " fail digga!!! "
    return res.json("0");
  }
  else {
    // nice, bre ;)
    return res.json("1")
  }
});

// write url to download to file, python will do the rest
app.post('/download', async (req, res) => {
  const { link } = req.body;
  console.log("Request to download :" + link);

  // wir überprüfen ob der link bereits in unserer datenbank vorhanden ist.. 
  const getSongByLink = await prisma.song.findUnique({
    where: {
      link: link,
    },
  });

  // wenn es keinen song mit dem link gibt... 
  if (getSongByLink === null) {
    // dann fügen wir es unserem downloadlink file hinzu, und danach, wenn das funktioniert hat
    // adden wir den song zu unserer datenbank
    if (isUrl(link)) {
      // link der datenbank hinzufügen
      const song = await prisma.song.create({
        data: {
          name: 'downloading',
          link: link,
          filename: 'downloading',
          image_filename: 'no',
          ready: 0,
        },
      })

      // success, if the file was saved
      console.log('Link appended and added to database!');
      // success.
      return res.json('1');
    }
    else {
      // fail.
      console.log(link + " ist keine gütlige URL");
      return res.json('0');
    }
  }
  else {
    return res.json('0');
  }
});


app.post('/makeSongAvailableForDownload', async (req, res) => {
  const { id } = req.body;

  console.log("Song erneut zum download freigeben: " + id);
  // TODO überprüfen ob es den song wirklich nicht gibt... 

  const updateSongById = await prisma.song.update({
    where: {
      id: id,
    },
    data: {
      ready: 0,
    }
  });
});


function isUrl(url) {
  var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  var regex = new RegExp(expression)
  if (url.match(regex)) {
    return true;
  }
  return false;
}


// ---- LETS GET THE PARTY STARTED
https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'MASTERKEY'
}, app).listen(3333, () => {
  console.log('Server running on Port 3333')
});
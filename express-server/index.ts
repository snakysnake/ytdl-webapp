import { PrismaClient } from '@prisma/client';

/**
 * Benedict Allerberger: 
 * Entweder importierst du nur „express“ und schreibst dann express.Request 
 * oder du importierst erst express und dann request und response
 */
import { Request, Response } from 'express';
import express from 'express';
import bodyParser from 'body-parser';




// start prisma client
const prisma = new PrismaClient()

// export server stuff
const https = require('https');
var cors = require('cors')
const fs = require('fs');
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

app.post('/createuser', async (req: Request, res: Response) => {
  // wir machen da iwie ne zuweisung und das as any nennt man in ts 'casten'
  const { name, password, email, keytocreateuser } = req.body as any;

  if (name.includes(" ")) {
    return res.status(418).send("I am a Teapot and a Space is not ok in username.");
  }

  // ----------------- CREATE STATEMENT ------------------
  // here its important to set a complex key :) 
  // dont do stuff like this in any project.. it was one of my first projects when it comes to serverside js 
  // and i did not really know what i was doing..
  // but i knew it was unsafe, but yeahhhhh
  if (keytocreateuser == process.env.CREATIONKEY) {
    try {
      const user = await prisma.user.create({
        data: {
          name: name,
          password: password,
          // anstelle von 'email: email,' kann man auch folgende kurzschreibweise nehmen:
          email: email,
          publickey: makeRandomString(32),
        },
      });
      res.json(user);
    }
    catch (e) {
      console.log(e);
      res.status(403).json('0');
    }
  }
  // ----------------------------------------------------
});

app.post('/login', async (req: Request, res: Response) => {
  const { name, password } = req.body as any;
  if (name !== undefined && password !== undefined) {
    console.log("Name: " + name);
    console.log("Passwort: " + password);

    const getUserByNameAndPassword: object | null = await prisma.user.findMany({
      where: {
        name: name,
        password: password,
      },
      select: {
        id: true,
      }
    });

    if (Object.keys(getUserByNameAndPassword).length > 0) {
      const userId = Object.values(getUserByNameAndPassword)[0].id;
      console.log("User(" + userId + ") seems to exist");
      const new_publicKey = makeRandomString(32) as string;
      const setUserPublicKey: object | null = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          publickey: new_publicKey,
        },
      });
      res.json(new_publicKey);
    }
    else {
      res.status(403).json("0");
    }
  }
  else {
    res.status(403).json("0");
  }

});

app.post('/lookforsong', async (req: Request, res: Response) => {
  var { name, publickey } = req.body as any;

  if (name === undefined) {
    name = "";
  }

  if (publickey !== undefined) {
    const checkIfPublicKeyExists: object | null = await prisma.user.findFirst({
      where: {
        publickey: publickey,
      },
    });

    if (checkIfPublicKeyExists !== null) {
      console.log("Key stimmt");
      const getSongByName: object | null = await prisma.song.findMany({
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

      res.json(getSongByName);
    }
    else {
      console.log("Key stimmt nicht");
      res.status(403).json("0");
    }
  }
  else {
    console.log("Kein Key angegeben");
    res.json("0");
  }
});

app.get('/getsongtodownload', async (req: Request, res: Response) => {
  const getSongToDownload: object | null = await prisma.song.findFirst({
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
    var songToDownloadId = Object.values(getSongToDownload)[0];
    console.log("EOI: " + songToDownloadId);
    const setSongToReady: object | null = await prisma.song.update({
      where: {
        id: songToDownloadId,
      },
      data: {
        ready: 1,
      }
    })

    res.json(getSongToDownload);
  } else {
    res.json("0")
  }
});


app.post('/updatedownloadedsong', async (req: Request, res: Response) => {
  const { id, name, filename, image_filename, album, artist } = req.body as any;
  var id_int = parseInt(id);
  const updateDownloadedSong: object | null = await prisma.song.update({
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
    res.json("0");
  }
  else {
    // nice, bre ;)
    res.json("1")
  }
});

// write url to download to file, python will do the rest
app.post('/download', async (req: Request, res: Response) => {
  const { link } = req.body as any;
  console.log("Request to download :" + link);

  // wir überprüfen ob der link bereits in unserer datenbank vorhanden ist.. 
  const getSongByLink: object | null = await prisma.song.findUnique({
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
      res.json('1');
    }
    else {
      // fail.
      console.log(link + " ist keine gütlige URL");
      res.json('0');
    }
  }
  else {
    res.json('0');
  }
});


app.post('/makeSongAvailableForDownload', async (req: Request, res: Response) => {
  const { id } = req.body as any;

  console.log("Song erneut zum download freigeben: " + id);
  // TODO überprüfen ob es den song wirklich nicht gibt... 

  const updateSongById: object | null = await prisma.song.update({
    where: {
      id: id,
    },
    data: {
      ready: 0,
    }
  });
});


function isUrl(url: string) {
  var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  var regex = new RegExp(expression)
  if (url.match(regex)) {
    return true;
  }
  return false;
}

function makeRandomString(length: number) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}


// ---- LETS GET THE PARTY STARTED
https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'MASTERKEY'
}, app).listen(3333, () => {
  console.log('Server running on Port 3333')
});
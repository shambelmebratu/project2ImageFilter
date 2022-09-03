import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async (req, res) => {
    let { image_url }: any = req.query;
    if (!image_url) {
      return res.status(422).send(`Unprocessable entity`);
    } else {
      filterImageFromURL(image_url)
        .then((result) => {
          res.sendFile(result);
          res.on(`finish`, () => deleteLocalFiles([result]));
        })
        .catch((err) => res.status(422).send(err));
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
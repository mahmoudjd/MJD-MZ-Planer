import mongoose from 'mongoose';

// the `strictQuery` option will be switched back to `false` by default in Mongoose 7.
mongoose.set('strictQuery', false);

/**
 * verbinden mit MongoDB-Datenbanken
 * @param {String} uri
*/
function connectToDb (uri) {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
      .then(() => {
        console.log('Connected to MongoDB');
        resolve();
      })
      .catch((error) => {
        console.error(`Error connecting to MongoDB: ${error}`);
        reject(error);
      });
  });
}

export { connectToDb };

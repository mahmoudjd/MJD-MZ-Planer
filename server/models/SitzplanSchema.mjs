import { Schema, mongoose } from 'mongoose';

const SitzplanSchema = new Schema({
  veranstaltung: {
    type: Schema.Types.ObjectId,
    ref: 'Veranstaltung'
  },
  typeTisch: {
    type: String
  },
  anzahlTische: {
    type: Number
  },
  stuehleProTisch: {
    type: Number
  },
  tische: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tisch'
    }
  ]
});

const Sitzplan = mongoose.model('Sitzplan', SitzplanSchema, 'plaene'); // CollectionName: plaene

export { Sitzplan };

import { mongoose, Schema } from 'mongoose';

const TischSchema = new Schema({
  veranstaltung: {
    type: Schema.Types.ObjectId,
    ref: 'Veranstaltung'
  },
  tischnr: Number,
  belegt: {
    type: Boolean,
    default: false
  },
  personen: [String]
});

const Tisch = mongoose.model('Tisch', TischSchema, 'tische');

export { Tisch };

import { mongoose, Schema } from 'mongoose';

export const VeranstaltungSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  datum: {
    type: String,
    required: true,
    validate: [validateDate, 'Invalid date format. Use YYYY-MM-DD.']
  },
  beginnZeit: {
    type: String,
    required: true,
    validate: [validateTime, 'Invalid time format. Use HH:MM (24-hour clock).']
  },
  sitzplan: {
    type: Schema.Types.ObjectId,
    ref: 'Sitzplan'
  },
  gaesteliste: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Gast'
    }
  ]
});

function validateDate (value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateTime (value) {
  return /^\d{2}:\d{2}$/.test(value);
}

const Veranstaltung = mongoose.model(
  'Veranstaltung',
  VeranstaltungSchema,
  'veranstaltungen'
); // CollectionName: veranstaltungen

export { Veranstaltung };

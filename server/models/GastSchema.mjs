import { mongoose, Schema } from 'mongoose';

const GastSchema = new Schema({
  veranstaltung: {
    type: Schema.Types.ObjectId,
    ref: 'Veranstaltung'
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
  },
  kinder: {
    type: Boolean,
    default: false,
    required: true
  },
  status: {
    type: String,
    required: true
  }
});

const Gast = mongoose.model('Gast', GastSchema, 'gaeste'); // CollectionName: gaeste

export { Gast };

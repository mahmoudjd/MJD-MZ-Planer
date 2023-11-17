import express from 'express';
import { Tisch } from '../models/TischSchema.mjs';
import { BASE_URI } from '../app.mjs';

const router = express.Router();

// holle alle Tische
router.get('/Tische', async (req, res) => {
  try {
    const responseBody = await createTischListBody();

    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// erstelle einen Tisch
router.post('/Tische/', async (req, res) => {
  const newTisch = new Tisch({
    veranstaltung: req.body.veranstaltung,
    tischnr: req.body.tischnr,
    belegt: req.body.belegt,
    personen: req.body.personen
  });
  try {
    const tisch = await newTisch.save();
    const responseBody = createTischResponse(tisch);
    res.status(201).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// holle einen Tisch anhand ID
router.get('/Tische/:id', async (req, res) => {
  try {
    const tischId = req.params.id;
    const tisch = await Tisch.findOne({ _id: tischId });
    if (!tisch) {
      return res.status(404).json({ msg: 'Tisch nicht gefunden' });
    }
    const responseBody = createTischResponse(tisch);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// aktualisiere einen Tisch anhand ID
router.put('/Tische/:id', async (req, res) => {
  try {
    const tischId = req.params.id;
    const tisch = await Tisch.findOneAndUpdate({ _id: tischId }, req.body, {
      new: true,
      upsert: true,
      rawResult: true,
      runValidators: true
    });
    if (!tisch) {
      return res.status(404).json({ msg: 'Tisch nicht gefunden' });
    }
    const responseBody = createTischResponse(tisch);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// lösche einen Tisch anhand ID
router.delete('/Tische/:id', async (req, res) => {
  try {
    const tischId = req.params.id;
    const tisch = await Tisch.findByIdAndRemove({ _id: tischId });
    if (!tisch) {
      return res.status(404).json({ msg: 'Tisch nicht gefunden' });
    }
    const responseBody = await createTischListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

async function createTischListBody () {
  try {
    const tische = await Tisch.find({});
    return {
      tische: tische.map((tisch) => {
        return {
          _id: tisch._id,
          veranstaltung: tisch.veranstaltung,
          tischnr: tisch.tischnr,
          belegt: tisch.belegt,
          personen: tisch.personen,
          _links: {
            self: {
              href: `${BASE_URI}/api/Tische/${tisch._id}`
            }
          }
        };
      }),
      _links: {
        self: {
          href: `${BASE_URI}/api/Tische`
        }
      }
    };
  } catch (error) {
    console.error(error);
  }
}

function createTischResponse (tisch) {
  if (tisch) {
    return {
      tisch,
      _links: {
        self: {
          href: `${BASE_URI}/api/Tische/${tisch._id}`
        },
        update: {
          method: 'PUT',
          href: `${BASE_URI}/api/Tische/${tisch._id}`
        },
        delete: {
          method: 'DELETE',
          href: `${BASE_URI}/api/Tische/${tisch._id}`
        },
        list: {
          href: `${BASE_URI}/api/Tische`
        }
      }
    };
  } else {
    return null;
  }
}

export { router as tische };

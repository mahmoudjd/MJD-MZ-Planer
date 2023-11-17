import express from 'express';
import { Gast } from '../models/GastSchema.mjs';
import { BASE_URI } from '../app.mjs';

const router = express.Router();

// holle alle Gaeste
router.get('/Gaeste', async (req, res) => {
  try {
    const responseBody = await createGastListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// erstelle einen Gast
router.post('/Gaeste', async (req, res) => {
  const newGast = new Gast({
    veranstaltung: req.body.veranstaltung,
    name: req.body.name,
    kinder: req.body.kinder,
    status: req.body.status
  });

  try {
    const gast = await newGast.save();
    const responseBody = createGastResponse(gast);
    res.status(201).json(responseBody);
  } catch (error) {
    res.status(501).json({ message: error });
  }
});

// holle einen Gast anhand ID
router.get('/Gaeste/:id', async (req, res) => {
  try {
    const gastId = req.params.id;
    const gast = await Gast.findOne({ _id: gastId });
    if (!gast) {
      return res.status(404).json({ msg: 'Gast nicht gefunden' });
    }
    const responseBody = createGastResponse(gast);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// aktualisiere einen Gast anhand ID
router.put('/Gaeste/:id', async (req, res) => {
  try {
    const gastId = req.params.id;
    const gast = await Gast.findOneAndUpdate({ _id: gastId }, req.body, {
      new: true,
      upsert: true,
      rawResult: true,
      runValidators: true
    });
    if (!gast) {
      return res.status(404).json({ msg: 'Gast nicht gefunden' });
    }
    const rsponseBody = createGastResponse(gast);
    res.status(200).json(rsponseBody);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// lösche einen Gast anhand ID
router.delete('/Gaeste/:id', async (req, res) => {
  try {
    const gastId = req.params.id;
    const gast = await Gast.deleteMany({ _id: gastId });
    if (!gast) {
      return res.status(404).json({ msg: 'Gast nicht gefunden' });
    }
    const responseBody = await createGastListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

async function createGastListBody () {
  try {
    const gaeste = await Gast.find({});
    return {
      gaeste: gaeste.map((gast) => {
        return {
          _id: gast._id,
          veranstaltung: gast.veranstaltung,
          name: gast.name,
          kinder: gast.kinder,
          status: gast.status,
          _links: {
            self: {
              href: `${BASE_URI}/api/Gaeste/${gast._id}`
            }
          }
        };
      }),
      _links: {
        self: {
          href: `${BASE_URI}/api/Gaeste`
        }
      }
    };
  } catch (error) {
    console.error(error);
  }
}

function createGastResponse (gast) {
  if (gast) {
    return {
      gast,
      _links: {
        self: {
          href: `${BASE_URI}/api/Gaeste/${gast._id}`
        },
        update: {
          method: 'PUT',
          href: `${BASE_URI}/api/Gaeste/${gast._id}`
        },
        delete: {
          method: 'DELETE',
          href: `${BASE_URI}/api/Gaeste/${gast._id}`
        },
        list: {
          href: `${BASE_URI}/api/Gaeste`
        }
      }
    };
  } else {
    return null;
  }
}

export { router as gaeste };

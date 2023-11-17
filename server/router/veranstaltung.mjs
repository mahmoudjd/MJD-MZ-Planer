import express from 'express';
import { BASE_URI } from '../app.mjs';
import { Veranstaltung } from '../models/VeranstaltungSchema.mjs';

const router = express.Router();

// holle alle Veranstaltungen
router.get('/Veranstaltungen', async (req, res) => {
  try {
    const responseBody = await createVeranstaltungListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// erstelle eine Veranstaltung
router.post('/Veranstaltungen', async (req, res) => {
  const newVeranstaltung = new Veranstaltung({
    title: req.body.title,
    datum: req.body.datum,
    beginnZeit: req.body.beginnZeit,
    sitzplan: req.body.sitzplan,
    gaesteliste: req.body.gaesteliste
  });
  try {
    const veranstaltung = await newVeranstaltung.save();
    const responseBody = createVeranstaltungResponse(veranstaltung);
    res.status(201).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// holle eine Veranstaltung anhand ID
router.get('/Veranstaltungen/:id', async (req, res) => {
  try {
    const veranstaltungId = req.params.id;
    const veranstaltung = await Veranstaltung.findOne({ _id: veranstaltungId });
    if (!veranstaltung) {
      return res.status(404).json({ msg: 'Veranstaltung nicht gefunden' });
    }
    const responseBody = createVeranstaltungResponse(veranstaltung);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// aktualisiere eine Veranstaltung anhand ID
router.put('/Veranstaltungen/:id', async (req, res) => {
  try {
    const veranstaltungId = req.params.id;
    const veranstaltung = await Veranstaltung.findOneAndUpdate(
      { _id: veranstaltungId },
      req.body,
      {
        new: true,
        upsert: true,
        rawResult: true,
        runValidators: true
      }
    );
    if (!veranstaltung) {
      return res.status(404).json({ msg: 'Veranstaltung nicht gefunden' });
    }
    const responseBody = createVeranstaltungResponse(veranstaltung);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// lösche eine Veranstaltung anhand ID
router.delete('/Veranstaltungen/:id', async (req, res) => {
  try {
    const veranstaltungId = req.params.id;
    const veranstaltung = await Veranstaltung.findByIdAndRemove({
      _id: veranstaltungId
    });
    if (!veranstaltung) {
      return res.status(404).json({ msg: 'Veranstaltung nicht gefunden' });
    }
    const responseBody = await createVeranstaltungListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

async function createVeranstaltungListBody () {
  try {
    const veranstaltungen = await Veranstaltung.find({});
    return {
      veranstaltungen: veranstaltungen.map((veranstaltung) => {
        return {
          _id: veranstaltung._id,
          title: veranstaltung.title,
          datum: veranstaltung.datum,
          beginnZeit: veranstaltung.beginnZeit,
          sitzplan: veranstaltung.sitzplan,
          gaesteliste: veranstaltung.gaesteliste,
          _links: {
            self: {
              href: `${BASE_URI}/api/Veranstaltungen/${veranstaltung._id}`
            }
          }
        };
      }),
      _links: {
        self: {
          href: `${BASE_URI}/api/Veranstaltungen`
        }
      }
    };
  } catch (error) {
    console.error(error);
  }
}

function createVeranstaltungResponse (veranstaltung) {
  if (veranstaltung) {
    return {
      veranstaltung,
      _links: {
        self: {
          href: `${BASE_URI}/api/Veranstaltungen/${veranstaltung._id}`
        },
        update: {
          method: 'PUT',
          href: `${BASE_URI}/api/Veranstaltungen/${veranstaltung._id}`
        },
        delete: {
          method: 'DELETE',
          href: `${BASE_URI}/api/Veranstaltungen/${veranstaltung._id}`
        },
        list: {
          href: `${BASE_URI}/api/Veranstaltungen`
        }
      }
    };
  } else {
    return null;
  }
}

export { router as veranstaltungen };

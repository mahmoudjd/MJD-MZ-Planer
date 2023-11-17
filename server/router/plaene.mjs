import express from 'express';
import { Sitzplan } from '../models/SitzplanSchema.mjs';
import { BASE_URI } from '../app.mjs';

const router = express.Router();

// holle alle Sitzplaene
router.get('/Plaene', async (req, res) => {
  try {
    const responseBody = await createSitzplanListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// erstelle einen Sitzplan
router.post('/Plaene/', async (req, res) => {
  const newPlan = new Sitzplan({
    veranstaltung: req.body.veranstaltung,
    typeTische: req.body.typeTische,
    anzahlTische: req.body.anzahlTische,
    stuehleProTisch: req.body.stuehleProTisch,
    tische: req.body.tische
  });
  try {
    const plan = await newPlan.save();
    const responseBody = createSitzplanResponse(plan);
    res.status(201).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// holle einen Sitzplan anhand ID
router.get('/Plaene/:id', async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await Sitzplan.findOne({ _id: planId });
    if (!plan) {
      return res.status(404).json({ msg: 'Sitzplan nicht gefunden' });
    }
    const responseBody = createSitzplanResponse(plan);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// aktualisiere einen Sitzplan anhand ID
router.put('/Plaene/:id', async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await Sitzplan.findOneAndUpdate({ _id: planId }, req.body, {
      new: true,
      upsert: true,
      rawResult: true,
      runValidators: true
    });
    if (!plan) {
      return res.status(404).json({ msg: 'Sitzplan nicht gefunden' });
    }
    const responseBody = createSitzplanResponse(plan);
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

// lösche einen Sitzplan anhand ID
router.delete('/Plaene/:id', async (req, res) => {
  try {
    const planId = req.params.id;
    const plan = await Sitzplan.findByIdAndRemove({
      _id: planId
    });
    if (!plan) {
      return res.status(404).json({ msg: 'Sitzplan nicht gefunden' });
    }
    const responseBody = await createSitzplanListBody();
    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

async function createSitzplanListBody () {
  try {
    const plaene = await Sitzplan.find({});
    return {
      plaene: plaene.map((plan) => {
        return {
          _id: plan._id,
          veranstaltung: plan.veranstaltung,
          typeTische: plan.typeTische,
          anzahlTische: plan.anzahlTische,
          stuehleProTisch: plan.stuehleProTisch,
          tische: plan.tische,
          _links: {
            self: {
              href: `${BASE_URI}/api/Plaene/${plan._id}`
            }
          }
        };
      }),
      _links: {
        self: {
          href: `${BASE_URI}/api/Plaene`
        }
      }
    };
  } catch (error) {
    console.error(error);
  }
}

function createSitzplanResponse (plan) {
  if (plan) {
    return {
      plan,
      _links: {
        self: {
          href: `${BASE_URI}/api/Plaene/${plan._id}`
        },
        update: {
          method: 'PUT',
          href: `${BASE_URI}/api/Plaene/${plan._id}`
        },
        delete: {
          method: 'DELETE',
          href: `${BASE_URI}/api/Plaene/${plan._id}`
        },
        list: {
          href: `${BASE_URI}/api/Plaene`
        }
      }
    };
  } else {
    return null;
  }
}
export { router as plaene };

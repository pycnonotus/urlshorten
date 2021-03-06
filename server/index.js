const express = require('express');
const cors = require('cors');
const monk = require('monk');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const { nanoid } = require('nanoid');
require('dotenv').config();

const db = monk(process.env.MONGODB_URI);
const urls = db.get('url-short');
urls.createIndex({ ant: 1 }, { unpipe: true }); // TEMP FIX

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const schema = yup.object().shape({
    ant: yup
        .string()
        .trim()
        .matches(/[a-z0-9_\-]/i),
    url: yup.string().trim().url().required(),
});

// app.get('/', (req, res) => {
//     res.json({
//         message: 'antcut - short url to the size of an ant ',
//     });
// });
// app.get('/url/:id', (req, res) => {
//     // TODO: redirect to url
// });

app.get('/:id', async (req, res) => {
    const { id: ant } = req.params;
    try {
        const url = await urls.findOne({ ant });
        if (url) {
            res.redirect(url.url);
        } else {
            res.redirect(`/?error=${ant} not found`);
        }
    } catch (err) {
        res.redirect(`/?error=Link not found`);
    }
});

app.post('/url', async (req, res, next) => {
    console.log(req.body);
    try {
        let { ant, url } = req.body;
        if (!ant) {
            // no alias was given so we randomize one
            ant = nanoid(4).toLowerCase();
        } else {
            const existing = await urls.findOne({ ant });
            if (existing) {
                throw new Error('ant is already in the nest');
            }
        }
        ant = ant.toLowerCase();
        await schema.validate({
            ant,
            url,
        });
        const secretPassword = nanoid(24).toLowerCase();
        const newUrl = {
            url,
            ant,
            secretPassword: secretPassword,
            views: 0,
            ipList: [],
        };
        const created = await urls.insert(newUrl);
        res.json(created);
    } catch (err) {
        if (err.message.startsWith('E11000')) {
            err.message = 'ant is already in the nest';
        }
        next(err);
    }
});

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status);
    } else {
        res.status(500); // <-- if we dk the problem
    }
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? ':)' : err.stack,
    });
});

const port = process.env.PORT || 2338;

app.listen(port, () => {
    console.log(`Server started on port` + port);
});

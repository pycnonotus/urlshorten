const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// app.get('/', (req, res) => {
//     res.json({
//         message: 'antcut - short url to the size of an ant ',
//     });
// });
// app.get('/url/:id', (req, res) => {
//     // TODO: redirect to url
// });

// app.get('/:id', (req, res) => {
//     // TODO: redirect to url
// });

// app.post('/url', (req, res) => {
//     // TODO: create url
// });

const port = process.env.PORT || 2338;

app.listen(port, () => {
    console.log(`Server started on port` + port);
});

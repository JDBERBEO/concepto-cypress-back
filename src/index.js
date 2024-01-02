require('dotenv').config()
const express = require('express')
const fs = require('fs/promises');
const cors = require('cors')
const morgan = require('morgan')

const port = process.env.PORT || 8000
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.get('/wishes', async (req, res) => {
  try {
    const data = await fs.readFile('src/data.json', 'utf-8');
    const wishes = JSON.parse(data).wishes;
    res.json(wishes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/wishes', async (req, res) => {
  try {
    const data = await fs.readFile('src/data.json', 'utf-8');
    const wishes = JSON.parse(data).wishes;

    const newWish = req.body;
    newWish.id = wishes.length + 1;

    wishes.push(newWish);

    await fs.writeFile('src/data.json', JSON.stringify({ wishes }, null, 2));

    res.json(newWish);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`)
})
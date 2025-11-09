import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('<h1>IT WORKS!</h1><p>Your web server is fine.</p>'));
app.listen(5000, () => console.log('Test server running at http://localhost:5000'));
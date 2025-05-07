const app = require('./app');
require('dotenv').config();

port = process.env.PORT;

// Conectar a la base de datos
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
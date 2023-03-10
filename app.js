const express = require('express');
// const path = require('path');
const createError = require('http-errors');
const morgan = require('morgan');
require('./config/allowedOrigins');
require('dotenv').config();
var cors = require('cors');
const app = express();
var cron = require('node-cron');
const {updateAutoStatutContrat,getContratToNotify} = require('./controllers/checkContratController');
//update auto statut contrat

// app.use(express.static(path.join(__dirname, 'build')));//front end build, views
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

const updateAuto = async ()=>{
  
  //update auto statut contrat, valide to expire
  await updateAutoStatutContrat()

  //sendNotif email auto for contrat expired in 45 days
  await getContratToNotify()

  // console.log("in update auto");
  
  cron.schedule('0 0 */22 * * *', async () => {
    //running the function every 20 hours
    await updateAutoStatutContrat()
    await getContratToNotify()
  });

   // cron.schedule('*/2 * * * *', async () => {
  //   console.log('running a task every 2 minutes');
  // });

}

updateAuto()

app.get('/', async (req, res, next) => {
  res.send({ message: 'Awesome it works 🐻' });
});

app.use('/api/client', require('./routes/client.route'));
app.use('/api/famille', require('./routes/famille.route'));
app.use('/api/service', require('./routes/service.route'));
app.use('/api/province', require('./routes/province.route'));
app.use('/api/ville', require('./routes/ville.route'));
app.use('/api/utilisateur', require('./routes/utilisateur.route'));
app.use('/api/equipement', require('./routes/equipement.route'));
app.use('/api/livraison', require('./routes/livraison.route'));
app.use('/api/contrat_maintenance', require('./routes/contrat_maintenance.route'));
app.use('/api/contrat_maintenance_gab', require('./routes/contrat_maintenance_gab.route'));
app.use('/api/contrat_garantie', require('./routes/contrat_garantie.route'));
app.use('/api/contrat_garantie_gab', require('./routes/contrat_garantie_gab.route'));

//traitement
app.use('/api/check_contrat', require('./routes/check_contrat.route'));

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'))
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

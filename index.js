import express from 'express';
import { QuickDB } from "quick.db";

const app = express();
const db = new QuickDB(process.env.QUICK_DB_LOCATION ? {filePath: process.env.QUICK_DB_LOCATION} : {});
const db_status = new QuickDB(process.env.QUICK_DB_LOCATION ? {filePath: process.env.QUICK_DB_LOCATION} : {});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile("root.html", { root: "views" });
});

app.get('/ois_control/:parameter', (req, res) => {
  res.sendFile("ois_control.html", { root: "views" });
});

app.get('/helm_output/:parameter', (req, res) => {
  res.sendFile("helm_output.html", { root: "views" });
});

app.get('/contacts_output/:parameter', (req, res) => {
  res.sendFile("contacts_output.html", { root: "views" });
});

app.get('/status_output/:parameter', (req, res) => {
  res.sendFile('status_output.html', { root: 'views' });
});

app.get('/status_control/:parameter', (req, res) => {
  res.sendFile('status_control.html', { root: 'views' });
});

app.get('/shot_calc', (req, res) => {
  res.sendFile("shot_calc.html", { root: "views" });
});

app.get('/local_screensaver', (req, res) => {
  res.sendFile("local_screensaver.html", { root: "views" });
});

//recieves the ship state and saves it to the database
app.post("/state/:parameter", (req, res) => {
  db.set(req.params.parameter, req.body);
  res.sendStatus(200);
});

//upon request, retrieves the ship state in the database and returns it
app.get('/state/:parameter', async (req, res) => {
  res.send(await db.get(req.params.parameter));
});

//recieves the ship status and saves it to the database
app.post("/status/:parameter", (req, res) => {
  db_status.set(req.params.parameter, req.body);
  res.sendStatus(200);
});

//upon request, retrieves the ship status in the database and returns it
app.get('/status/:parameter', async (req, res) => {
  res.send(await db_status.get(req.params.parameter));
});

app.listen(3000, () => {
  console.log('Express server initialized');
});

//test routes
app.get('/status_output_new/:parameter', (req, res) => {
  res.sendFile("status_output_new.html", { root: "views" });
});

app.get('/status_control_new/:parameter', (req, res) => {
  res.sendFile('status_control_new.html', { root: 'views' });
});
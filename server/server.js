import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import weeklynerd from './json/weeklynerd.json' assert { type: 'json' };
import leerdoelen from './json/leerdoelen.json' assert { type: 'json'};
import vakken from './json/vakken.json' assert { type: 'json'};



const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  
  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'Home',
    weeklyNerdData: weeklynerd,
  }));
});

app.get('/weekly-nerd', async (req, res) => {
  return res.send(renderTemplate('server/views/weekly-nerd.liquid', {
    title: 'Weekly Nerd',
    weeklyNerdData: weeklynerd
  }));
});

app.get('/projecten', async (req, res) => {
  return res.send(renderTemplate('server/views/projecten.liquid', {
    title: 'Mijn werk',
    vakken: vakken
  }));
});

app.get('/reflectie-leerdoelen', async (req, res) => {
  return res.send(renderTemplate('server/views/reflectie-leerdoelen.liquid', {
    title: 'Reflectie en Leerdoelen',
    leerdoelen: leerdoelen
  }));
});

// Detailpagina voor een specifieke blog
app.get('/weekly-nerd/:id', async (req, res) => {
  const id = req.params.id;
// Vind de blog met het juiste id
const nerd = weeklynerd.find((nerd) => nerd.id === id);

if (!nerd) {
  return res.status(404).send('Blog not found');
}

console.log(nerd)
  return res.send(renderTemplate('server/views/blog-detail.liquid', {
    title: `Blog Detail: ${nerd.title}`,
    nerd: nerd
  }));
});

const renderTemplate = (template, data) => {
  return engine.renderFileSync(template, data);
};

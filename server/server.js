import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import { weeklynerd } from './json/weeklynerd.js';
import { leerdoelen } from './json/leerdoelen.js';
import { vakken } from './json/vakken.js';
import { meesterproef } from './json/meesterproef.js';  

// Helperfunctie: kies willekeurig 1 element
function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  const topRatedNerds = weeklynerd.filter(nerd => nerd.interesse?.includes("Interesse: ⭐️⭐️⭐️⭐️⭐️"));
  
  const featuredNerd = getRandomItems(topRatedNerds, 1)[0] || null;
  console.log(featuredNerd);

  const randomVakken = getRandomItems(vakken, 3);

  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'Home',
    weeklyNerdData: weeklynerd,
    featuredNerd,
    randomVakken,
    meesterproef,
  }));
});

app.get('/weekly-nerd', async (req, res) => {
  return res.send(renderTemplate('server/views/weekly-nerd.liquid', {
    title: 'Weekly Nerd',
    weeklyNerdData: weeklynerd
  }));
});

app.get('/projecten', async (req, res) => {
  const id = req.query.id;
  const project = id ? vakken.find((vak) => vak.id === id) : null;

  return res.send(renderTemplate('server/views/projecten.liquid', {
    title: 'Mijn werk',
    vakken: vakken,
    selectedProject: project
  }));
});

app.get('/reflectie-leerdoelen', async (req, res) => {
  return res.send(renderTemplate('server/views/reflectie-leerdoelen.liquid', {
    title: 'Reflectie en Leerdoelen',
    leerdoelen: leerdoelen
  }));
});

app.get('/meesterproef', async (req, res) => {
  console.log(meesterproef);
  return res.send(renderTemplate('server/views/meesterproef.liquid', {
    title: 'Meesterproef',
    meesterproef
  }));
}
);

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

import { App } from '@tinyhttp/app';
import { logger } from '@tinyhttp/logger';
import { Liquid } from 'liquidjs';
import sirv from 'sirv';
import weeklynerd from './json/weeklynerd.json' assert { type: 'json' };


const hackathon = {
  id: 'Leerdoel 3',
  title: 'Hackathon',
  inleiding: 'Tijdens de hackathon moest ik samen met een team een website maken dat de "women in tech" presenteerd. Ons idee hiervoor was om een interactieve wereldkaart en klok te maken in een klaslokaal om te kunnen filteren in de afkomst en tijdperk van de vrouwen. vervolgens is het mogelijk om door de resulaten heen te scrollen een carousel en meer informatie te krijgen.',
  content: [
    {
      titel: 'Mijn inbreng',
      alinea: [
        'Ik was verantwoordelijk voor de de klok. ik heb deze met puur CSS gemaakt en het menu dat er in zit gemaakt met behulp van enchor positioning. In principe is dit een zelf gebouwde select element. Ik heb ook grote rol gespeeld in het reparen van code van anderen en en het samenvoegen.',
      ]
    },
    {
      titel: 'Nieuwe inzichten',
      alinea: [
        'Ik vond het lastig om onder tijdsdruk te werken, ik ben gewend om een lange tijd onderzoek te kunnen doen naar welke code ik wil gebruiken maar dit was voor dit project erg lastig.',
        'Ik was eerst van plan meer te gaan maken dan alleen de klok maar dit is door de tijdsdruk niet gelukt waardoor ik niet helemaal tevreden was met mijn inbreng.',
        'Het was wel een leuke ervaring om weer eens met andere mensen iets te maken. Het is erg leuk om te zien hoe het eindproduct er uit ziet als je alles zamen hebt gevoegd.',
      ]
    }
  ]
};

const engine = new Liquid({
  extname: '.liquid',
});

const app = new App();

app
  .use(logger())
  .use('/', sirv('dist'))
  .listen(3000, () => console.log('Server available on http://localhost:3000'));

app.get('/', async (req, res) => {
  console.log(weeklynerd)
  return res.send(renderTemplate('server/views/index.liquid', {
    title: 'Home'

  }));
});

app.get('/weekly-nerd', async (req, res) => {
  return res.send(renderTemplate('server/views/weekly-nerd.liquid', {
    title: 'Weekly Nerd',
    blogs: Object.values(blogs)
  }));
});

app.get('/hackaton', async (req, res) => {
  return res.send(renderTemplate('server/views/hackaton.liquid', {
    title: hackathon.title,
    inleiding: hackathon.inleiding,
    content: hackathon.content
  }));
});

app.get('/reflectie-leerdoelen', async (req, res) => {
  return res.send(renderTemplate('server/views/reflectie-leerdoelen.liquid', {
    title: 'Reflectie en Leerdoelen',
    leerdoelen: Object.values(leerdoelen)
  }));
});

// Detailpagina voor een specifieke blog
app.get('/weekly-nerd/blog/:id', async (req, res) => {
  const id = req.params.id;
  const blog = blogs[id];

  if (!blog) {
    return res.status(404).send('Blog not found');
  }

  return res.send(renderTemplate('server/views/blog-detail.liquid', {
    title: `Blog Detail: ${blog.title}`,
    blog: blog
  }));
});

const renderTemplate = (template, data) => {
  return engine.renderFileSync(template, data);
};

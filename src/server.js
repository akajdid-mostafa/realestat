const cors = require('cors');

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
};

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(cors(corsOptions));

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3005, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
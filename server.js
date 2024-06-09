const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/execute', (req, res) => {
  const { language, code } = req.body;

  let command;
  switch (language) {
    case 'javascript':
      command = `node -e "${code.replace(/"/g, '\\"')}"`;
      break;
    case 'python':
      command = `python -c "${code.replace(/"/g, '\\"')}"`;
      break;
    // Add cases for other languages here
    default:
      return res.status(400).send('Language not supported');
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

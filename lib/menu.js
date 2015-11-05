const Menu = require('menu');

const template = [
  {
    label: 'Gief!',
    submenu: [
       {
        label: 'About Gief!',
        accelerator: 'Command+I',
        selector: 'orderFrontStandardAboutPanel:'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        selector: 'terminate:'
      }
    ]
  }
];

module.exports = Menu.buildFromTemplate(template);

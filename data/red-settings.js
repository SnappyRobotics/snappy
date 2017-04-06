const _ = require(global.initLocation)

module.exports = {
  httpAdminRoot: "/red",
  httpNodeRoot: "/api",
  userDir: _.path("userDir", "red"),
  functionGlobalContext: {}, // enables global context,
  paletteCategories: [
    'subflows',
    'input',
    'output',
    'function',
    'social',
    'mobile',
    'storage',
    'analysis',
    'advanced'
  ],
  logging: 'fatal',

  editorTheme: {
    page: {
      title: "Snappy Robotics",
      favicon: _.path("public", "images", "logo.png"),
      css: "/absolute/path/to/custom/css/file"
    },
    header: {
      title: "Snappy Robotics",
      image: _.path("public", "images", "logo_white.png"),
      url: "https://SnappyRobotics.github.io" // optional url to make the header text/image a link to this url
    },
    deployButton: {
      type: "simple",
      label: "Run",
      icon: "/absolute/path/to/deploy/button/image" // or null to remove image
    },
    menu: { // Hide unwanted menu items by id. see editor/js/main.js:loadEditor for complete list
      "menu-item-import-library": false,
      "menu-item-export-library": false,
      "menu-item-keyboard-shortcuts": false,
      "menu-item-help": {
        label: "View Help Online",
        url: "https://SnappyRobotics.github.io/docs/backend"
      }
    },
    userMenu: false, // Hide the user-menu even if adminAuth is enabled
    login: {
      image: "/absolute/path/to/login/page/big/image" // a 256x256 image
    }
  },

}

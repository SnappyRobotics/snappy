const _ = require(global.initLocation)

module.exports = {
  httpAdminRoot: "/",
  httpNodeRoot: "/api",
  userDir: _.path("userDir", "red"),
  functionGlobalContext: {}, // enables global context,
  paletteCategories: [
    'subflows',
    'ROS',
    'snappy',
    'input',
    'output',
    'function',
    'social',
    'mobile',
    'storage',
    'analysis',
    'advanced'
  ],
  // logging: 'fatal',
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
      label: "Deploy",
      icon: null
    },
    menu: { // Hide unwanted menu items by id. see editor/js/main.js:loadEditor for complete list
      // "menu-item-view-menu": false,
      /*
      "menu-item-import": false,
      "menu-item-export": false,
      "menu-item-import-library": false,
      "menu-item-export-library": false,
      "menu-item-show-tips": false,
      "menu-item-search": false,
      "menu-item-config-nodes": false,
      "menu-item-workspace": false,
      "menu-item-subflow": false,
      "menu-item-node-red-version": false,
      "menu-item-keyboard-shortcuts": false,
      "menu-item-edit-palette": false,
      "menu-item-help": {
        label: "View Help Online",
        url: "https://SnappyRobotics.github.io/docs/backend"
      }*/
    }
  }
}

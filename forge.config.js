module.exports = {
  directories: {
    output: 'out',
    app: 'resources/'
  },
  packagerConfig: {
    asar: true,
    ignore: [
      'iracing/*',
      'setups/*',
      'out/*',
      '.git/*'
    ],
    extraResource: [
      './resources/.env'
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-wix',
      config: {
        name: 'iRacing Setups',
        manufacturer: 'JAR Software',
        language: '3082',
        ui: {
          chooseDirectory: true
        },
        icon: 'resources/icon.jpg'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
}

module.exports = {
  // outputDir: 'C:\\basalta2\\backend\\staticfiles',
  assetsDir: 'static/app'
  ,
  pages: {
    'main': {
      entry: 'src/pages/Main/main.js',
      template: 'public/main.html',
      filename: 'main.html',
      chunks: ['chunk-vendors', 'chunk-common', 'main']
    },
    'search': {
      entry: 'src/pages/Search/main.js',
      template: 'public/search.html',
      filename: 'search.html',
      chunks: ['chunk-vendors', 'chunk-common', 'search']
    },
    'user': {
      entry: 'src/pages/User/main.js',
      template: 'public/user.html',
      filename: 'user.html',
      chunks: ['chunk-vendors', 'chunk-common', 'user']
    },
    'prodorderdash': {
      entry: 'src/pages/ProdOrderDash/main.js',
      template: 'public/prodorderdash.html',
      filename: 'prodorderdash.html',
      chunks: ['chunk-vendors', 'chunk-common', 'prodorderdash']
    },
    'prodorderdashrib': {
      entry: 'src/pages/ProdOrderDashRib/main.js',
      template: 'public/prodorderdashrib.html',
      filename: 'prodorderdashrib.html',
      chunks: ['chunk-vendors', 'chunk-common', 'prodorderdashrib']
    },
    'prodordercontract': {
      entry: 'src/pages/ProdOrderContract/main.js',
      template: 'public/prodordercontract.html',
      filename: 'prodordercontract.html',
      chunks: ['chunk-vendors', 'chunk-common', 'prodordercontract']
    },
    'workertasks': {
      entry: 'src/pages/WorkerTasks/main.js',
      template: 'public/workertasks.html',
      filename: 'workertasks.html',
      chunks: ['chunk-vendors', 'chunk-common', 'workertasks']
    },
    'workershifts': {
      entry: 'src/pages/WorkerShifts/main.js',
      template: 'public/workershifts.html',
      filename: 'workershifts.html',
      chunks: ['chunk-vendors', 'chunk-common', 'workershifts']
    },
    'processtree': {
      entry: 'src/pages/ProcessTree/main.js',
      template: 'public/processtree.html',
      filename: 'processtree.html',
      chunks: ['chunk-vendors', 'chunk-common', 'processtree']
    },
    'prodordertree': {
      entry: 'src/pages/ProdOrderTree/main.js',
      template: 'public/prodordertree.html',
      filename: 'prodordertree.html',
      chunks: ['chunk-vendors', 'chunk-common', 'prodordertree']
    },
    'report': {
      entry: 'src/pages/Report/main.js',
      template: 'public/report.html',
      filename: 'report.html',
      chunks: ['chunk-vendors', 'chunk-common', 'report']
    },
    'community': {
      entry: 'src/pages/Community/main.js',
      template: 'public/community.html',
      filename: 'community.html',
      chunks: ['chunk-vendors', 'chunk-common', 'community']
    },
    'staff': {
      entry: 'src/pages/Staff/main.js',
      template: 'public/staff.html',
      filename: 'staff.html',
      chunks: ['chunk-vendors', 'chunk-common', 'staff']
    },
    'supply': {
      entry: 'src/pages/Supply/main.js',
      template: 'public/supply.html',
      filename: 'supply.html',
      chunks: ['chunk-vendors', 'chunk-common', 'supply']
    },
    'archive': {
      entry: 'src/pages/Archive/main.js',
      template: 'public/archive.html',
      filename: 'archive.html',
      chunks: ['chunk-vendors', 'chunk-common', 'archive']
    },
    'mdm': {
      entry: 'src/pages/Mdm/main.js',
      template: 'public/mdm.html',
      filename: 'mdm.html',
      chunks: [ 'chunk-vendors', 'chunk-common', 'mdm' ]
    },
    // 'tool': {
    //   entry: 'src/pages/Tool/main.js',
    //   template: 'public/tool.html',
    //   filename: 'tool.html',
    //   chunks: ['chunk-vendors', 'chunk-common', 'tool']
    // },
    'test': {
      entry: 'src/pages/Test/main.js',
      template: 'public/test.html',
      filename: 'test.html',
      chunks: [ 'chunk-vendors', 'chunk-common', 'test' ]
    },
    'test3': {
      entry: 'src/pages/Test3/main.js',
      template: 'public/test3.html',
      filename: 'test3.html',
      chunks: [ 'chunk-vendors', 'chunk-common', 'test3' ]
    },
    'test2': {
      entry: 'src/pages/Test2/main.js',
      template: 'public/test2.html',
      filename: 'test2.html',
      chunks: [ 'chunk-vendors', 'chunk-common', 'archive' ]
    }
  },
  // Сборка в продакшн варианте
  // mode: 'production',
  // Отключение хэширования имен формируемых файлов
  filenameHashing: false,
  // Активация компилятора шаблонов
  runtimeCompiler: true
}

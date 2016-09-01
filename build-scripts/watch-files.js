const TypeScriptDirWatcher = require('./dir-watchers').TypeScriptDirWatcher;
const JsDirWatcher = require('./dir-watchers').JsDirWatcher;
const DirWatcher = require('./dir-watchers').DirWatcher;
const ScssDirWatcher = require('./dir-watchers').ScssDirWatcher;

// one-page js views ----------------------------------------------
const rootDir = __dirname.replace('/build-scripts', '');

new JsDirWatcher({
	srcDir: '/scripts/site',
	buildDir: '/scripts/site/min',
	rootDir: rootDir,
	watch: true
});

new TypeScriptDirWatcher({
	srcDir: '/scripts/type-script',
	buildDir: '/scripts/type-script/min',
	rootDir: rootDir,
	watch: true
});

// new ScssDirWatcher({
// 	srcDir: '/css',
// 	buildDir: '/css',
// 	rootDir: rootDir,
// 	watch: true
// });
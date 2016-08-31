const exec = require("child_process").exec;
const fs = require("fs");
const babel = require("babel-core");
const rollup = require("rollup");
const sass = require("node-sass");

const onePageViewApisSrcDir = "scripts/templates-src";
const onePageViewApisDistDir = "scripts/templates-build";

function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}

class DirWatcher {
	constructor(config) {
		this.relPath = config.srcDir;
		this.srcDir = config.rootDir+config.srcDir;
		this.buildDir = config.rootDir+config.buildDir;
		this.watch = config.watch;
		this.rootDir = config.rootDir;
		if(this.watch) this.setWatch();
	}

	processDir(callback) {
		this._onFinish = callback;
		fs.readdir(this.srcDir, this._loopDir.bind(this));
	}

	_loopDir(err, files) {
		if(err) {
			console.log("err: ", err);
			return;
		}

		files.forEach(this.processFile.bind(this));
		this._onFinish();
	}

	_shouldProcessFile(fileName) {
		return true;
	}

	processFile(fileName) {
		console.log("base process file");
		this._shouldProcessFile(fileName);
		console.log("do something with fileName: ", fileName);
		/* */
	}

	setWatch() {
		console.log("is watching " + this.srcDir);
		fs.watch(this.srcDir, (event, fileName) => {
		  console.log("onChange");
		  this.processFile(fileName)
		});
	}

	_onFinish() { console.log("finished"); }
}

class JsDirWatcher extends DirWatcher {
	constructor(config) {
		super(config);
	}

	_shouldProcessFile(fileName) {
		console.log("_shouldProcessFile from JsDirWatcher");
		return /.js.map/.test(fileName) ? false : true;
	}

	processFile(fileName) {
		console.log("processFile ", this._shouldProcessFile(fileName));
		if(!this._shouldProcessFile(fileName)) return;

		var fileName = fileName.replace(".ts", ".js");

		this._doRollup(this.srcDir+"/"+fileName, (code) => {

			console.log('code: ', code);
			var result = babel.transform(code, { minified: true, compact: true, comments: false, presets: ["es2015"] });
			fs.writeFile(this.buildDir+"/"+fileName.replace(".js","")+".min.js", "/* file generated from "+this.relPath+"/"+fileName+" */\n"+result.code, (err) => {
				if (err) throw err;
				console.log("It\"s saved!");
			});
		});
	}

	_doRollup(startPath, callback) {
		console.log("_doRollup: ", startPath);

		rollup.rollup({
		  entry: startPath
		}).then( function ( bundle ) {
			console.log("rollup complete");
		  // Generate bundle + sourcemap
		  var result = bundle.generate({
		    // output format - "amd", "cjs", "es", "iife", "umd"
		    format: "iife"
		  });

		  callback( result.code );
		});

	}
}

class TypeScriptDirWatcher extends JsDirWatcher {
	constructor(config) {
		super(config);
		this.rootDir = config.rootDir
	}

	_shouldProcessFile(fileName) {
		console.log("_shouldProcessFile from TypeScriptDirWatcher: ", fileName);
		return /.ts/.test(fileName) || /.js.map/.test(fileName) ? false : true;
	}

	processDir(callback) {
		callback = callback || function() {};
		console.log("_checkTypeScriptConfig: ", this.rootDir+"tsconfig.json");
		fs.stat(this.rootDir+"tsconfig.json", (err, stats) => {
		  if(stats && stats.isFile()) this.callTsc(callback);
		  else this._addConfigToRoot(callback);
		});
	}

	setConfigOptions(obj) {
		this._configOptions = extend(this._configOptions, obj);
	}

	_getConfigOptionsString() {
		return JSON.stringify(this._configOptions)
	}

	/*
		writes config .json to root of directory.
	*/
	_addConfigToRoot(callback) {
		fs.writeFile(this.rootDir+"tsconfig.json", this._getConfigOptionsString(), (err) => {
		  if (err) throw err;
		  this.callTsc(callback);
		});
	}

	processFile(fileName) {
		fileName = fileName.replace(".ts", ".js");
		super.processFile(fileName);
	}

	setWatch() {
		console.log("is watching " + this.srcDir);
		fs.watch(this.srcDir, (event, fileName) => {
			this.callTsc(() => {
				this.processFile(fileName);
			}, fileName);
		});
	}

	callTsc(callback, fileName) {
		if(/.js/.test(fileName)) return;
		var call = "tsc";
		console.log("callTsc: ", fileName);
		if(fileName != undefined) call = "tsc -t \"ES2015\" " + this.srcDir+"/"+fileName;

		exec(call, (error, stdout, stderr) => {
		  if (error) {
		    console.error(`exec error: ${error}`);
		    return;
		  }
		  console.log("tsc done");
		  callback();
		});
	}
}
TypeScriptDirWatcher.prototype._configOptions = {
    "compilerOptions": {
        "module": "es2015",
        "noImplicitAny": true,
        "removeComments": true,
        "preserveConstEnums": true,
        "sourceMap": true,
        "target": "es6"
    },
    "exclude": [
        "node_modules",
        "test",
        "dist",
        "scripts/templates-build"
    ]
};

class ScssDirWatcher extends DirWatcher {
	constructor(config) {
		super(config);
	}

	processFile(fileName) {
		console.log("fileName: ", fileName);

		if(fileName && /_.+\.scss/.test(fileName)) { console.log("1"); return; }
		if(fileName && /\.css/.test(fileName)) { console.log("2"); return;}

		console.log("yo");

		this.processScss(fileName);
	}

	processScss(fileName) {
		sass.render({
		  file: this.srcDir+"/"+fileName,
		  outputStyle: "compressed"
		}, (err, result) => {
			fileName = fileName.replace(".scss", ".css");
			fs.writeFile(this.buildDir+"/"+fileName, result.css, function(err){
				console.log("saved css file");
			});
		});
	}
}

module.exports.DirWatcher = DirWatcher;
module.exports.JsDirWatcher = JsDirWatcher;
module.exports.TypeScriptDirWatcher = TypeScriptDirWatcher;
module.exports.ScssDirWatcher = ScssDirWatcher;


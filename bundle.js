(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\ksana2015\\a2048\\index.js":[function(require,module,exports){
var runtime=require("ksana2015-webruntime");
runtime.boot("a2048",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=React.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"C:\\ksana2015\\a2048\\src\\main.jsx","ksana2015-webruntime":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\index.js"}],"C:\\ksana2015\\a2048\\src\\main.jsx":[function(require,module,exports){

var maincomponent = React.createClass({displayName: "maincomponent",
  getInitialState:function() {
  	return {score:0, max:0, time:0, cells:[
      [11,12,13,14],[21,22,23,24],[31,32,33,34],[41,42,43,44]
    ]};
  },
  renderBoxs:function(item) {
    return React.createElement("td", null, item?item:'')
  },
  renderRows:function(row) {
    return React.createElement("tr", null, row.map(this.renderBoxs));
  },
  render: function() {
    return React.createElement("div", null, 
      React.createElement("h4", null, "鍵盤上 按 ↑ ↓ ← → 或 w s a d 或者"), 
      React.createElement("h4", null, "手指在 表格 之中 向 上下左右 滑動"), 
      React.createElement("h4", null, "數值都依方向移動 碰相同值就相加"), 
      React.createElement("h4", null, "累計相加值 即此 2048 遊戲的 得分"), React.createElement("br", null), 
      React.createElement("h4", null, "點左下角開始"), React.createElement("br", null), 
      "得分", React.createElement("span", {id: "score"}, this.state.score), "  " + ' ' +
      "最高", React.createElement("span", {id: "max"}, this.state.max), "  " + ' ' +
      "剩餘", React.createElement("span", {id: "time"}, this.state.time, "秒"), React.createElement("br", null), 
      React.createElement("button", {onClick: this.changedata}, "change"), 
      React.createElement("table", {border: "1"}, 
        this.state.cells.map(this.renderRows)
      )
    );
  },
  changedata:function() {
    var table=[], sum=m=0, n;
    for (var i=1;i<=4;i++) {
      var row=[];
      for (var j=1;j<=4;j++) {
        n=Math.floor(Math.random()*5);
        sum+=n, m=n>m?n:m;
        row.push(n);
      }
      table.push(row)
    }
    this.setState({cells:table,score:sum,max:m});
  }
});
module.exports=maincomponent;
},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\checkbrowser.js":[function(require,module,exports){
/** @jsx React.DOM */
/*
convert to pure js
save -g reactify
*/
var E=React.createElement;

var hasksanagap=(typeof ksanagap!="undefined");
if (hasksanagap && (typeof console=="undefined" || typeof console.log=="undefined")) {
		window.console={log:ksanagap.log,error:ksanagap.error,debug:ksanagap.debug,warn:ksanagap.warn};
		console.log("install console output funciton");
}

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage) || hasksanagap;
}
var featurechecks={
	"fs":checkfs
}
var checkbrowser = React.createClass({
	getInitialState:function() {

		var missingFeatures=this.getMissingFeatures();
		return {ready:false, missing:missingFeatures};
	},
	getMissingFeatures:function() {
		var feature=this.props.feature.split(",");
		var status=[];
		feature.map(function(f){
			var checker=featurechecks[f];
			if (checker) checker=checker();
			status.push([f,checker]);
		});
		return status.filter(function(f){return !f[1]});
	},
	downloadbrowser:function() {
		window.location="https://www.google.com/chrome/"
	},
	renderMissing:function() {
		var showMissing=function(m) {
			return E("div", null, m);
		}
		return (
		 E("div", {ref: "dialog1", className: "modal fade", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
		          E("h4", {className: "modal-title"}, "Browser Check")
		        ), 
		        E("div", {className: "modal-body"}, 
		          E("p", null, "Sorry but the following feature is missing"), 
		          this.state.missing.map(showMissing)
		        ), 
		        E("div", {className: "modal-footer"}, 
		          E("button", {onClick: this.downloadbrowser, type: "button", className: "btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return E("span", null, "browser ok")
	},
	render:function(){
		return  (this.state.missing.length)?this.renderMissing():this.renderReady();
	},
	componentDidMount:function() {
		if (!this.state.missing.length) {
			this.props.onReady();
		} else {
			$(this.refs.dialog1.getDOMNode()).modal('show');
		}
	}
});

module.exports=checkbrowser;
},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js":[function(require,module,exports){

var userCancel=false;
var files=[];
var totalDownloadByte=0;
var targetPath="";
var tempPath="";
var nfile=0;
var baseurl="";
var result="";
var downloading=false;
var startDownload=function(dbid,_baseurl,_files) { //return download id
	var fs     = require("fs");
	var path   = require("path");

	
	files=_files.split("\uffff");
	if (downloading) return false; //only one session
	userCancel=false;
	totalDownloadByte=0;
	nextFile();
	downloading=true;
	baseurl=_baseurl;
	if (baseurl[baseurl.length-1]!='/')baseurl+='/';
	targetPath=ksanagap.rootPath+dbid+'/';
	tempPath=ksanagap.rootPath+".tmp/";
	result="";
	return true;
}

var nextFile=function() {
	setTimeout(function(){
		if (nfile==files.length) {
			nfile++;
			endDownload();
		} else {
			downloadFile(nfile++);	
		}
	},100);
}

var downloadFile=function(nfile) {
	var url=baseurl+files[nfile];
	var tmpfilename=tempPath+files[nfile];
	var mkdirp = require("./mkdirp");
	var fs     = require("fs");
	var http   = require("http");

	mkdirp.sync(path.dirname(tmpfilename));
	var writeStream = fs.createWriteStream(tmpfilename);
	var datalength=0;
	var request = http.get(url, function(response) {
		response.on('data',function(chunk){
			writeStream.write(chunk);
			totalDownloadByte+=chunk.length;
			if (userCancel) {
				writeStream.end();
				setTimeout(function(){nextFile();},100);
			}
		});
		response.on("end",function() {
			writeStream.end();
			setTimeout(function(){nextFile();},100);
		});
	});
}

var cancelDownload=function() {
	userCancel=true;
	endDownload();
}
var verify=function() {
	return true;
}
var endDownload=function() {
	nfile=files.length+1;//stop
	result="cancelled";
	downloading=false;
	if (userCancel) return;
	var fs     = require("fs");
	var mkdirp = require("./mkdirp");

	for (var i=0;i<files.length;i++) {
		var targetfilename=targetPath+files[i];
		var tmpfilename   =tempPath+files[i];
		mkdirp.sync(path.dirname(targetfilename));
		fs.renameSync(tmpfilename,targetfilename);
	}
	if (verify()) {
		result="success";
	} else {
		result="error";
	}
}

var downloadedByte=function() {
	return totalDownloadByte;
}
var doneDownload=function() {
	if (nfile>files.length) return result;
	else return "";
}
var downloadingFile=function() {
	return nfile-1;
}

var downloader={startDownload:startDownload, downloadedByte:downloadedByte,
	downloadingFile:downloadingFile, cancelDownload:cancelDownload,doneDownload:doneDownload};
module.exports=downloader;
},{"./mkdirp":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js","fs":false,"http":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\fileinstaller.js":[function(require,module,exports){
/** @jsx React.DOM */

/* todo , optional kdb */

var HtmlFS=require("./htmlfs");
var html5fs=require("./html5fs");
var CheckBrowser=require("./checkbrowser");
var E=React.createElement;
  

var FileList = React.createClass({
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        var classes="btn btn-warning";
        if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return   E("button", {className: classes, 
			"data-filename": f.filename, "data-url": f.url, 
	            onClick: this.download
	       }, "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return E("tr", null, E("td", null, f.filename), 
	      E("td", null), 
	      E("td", {className: "pull-right"}, 
	      this.updatable(f), E("button", {className: classes, 
	               onClick: this.deleteFile, "data-filename": f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (E("tr", {"data-id": f.filename}, E("td", null, 
	      f.filename), 
	      E("td", null, f.desc), 
	      E("td", null, 
	      E("span", {"data-filename": f.filename, "data-url": f.url, 
	            className: classes, 
	            onClick: this.download}, "Download")
	      )
	  ));
	},
	showFile:function(f) {
	//	return <span data-id={f.filename}>{f.url}</span>
		return (f.ready)?this.showLocal(f):this.showRemote(f);
	},
	reloadDir:function() {
		this.props.action("reload");
	},
	download:function(e) {
		var url=e.target.dataset["url"];
		var filename=e.target.dataset["filename"];
		this.setState({downloading:true,progress:0,url:url});
		this.userbreak=false;
		html5fs.download(url,filename,function(){
			this.reloadDir();
			this.setState({downloading:false,progress:1});
			},function(progress,total){
				if (progress==0) {
					this.setState({message:"total "+total})
			 	}
			 	this.setState({progress:progress});
			 	//if user press abort return true
			 	return this.userbreak;
			}
		,this);
	},
	deleteFile:function( e) {
		var filename=e.target.attributes["data-filename"].value;
		this.props.action("delete",filename);
	},
	allFilesReady:function(e) {
		return this.props.files.every(function(f){ return f.ready});
	},
	dismiss:function() {
		$(this.refs.dialog1.getDOMNode()).modal('hide');
		this.props.action("dismiss");
	},
	abortdownload:function() {
		this.userbreak=true;
	},
	showProgress:function() {
	     if (this.state.downloading) {
	      var progress=Math.round(this.state.progress*100);
	      return (
	      	E("div", null, 
	      	"Downloading from ", this.state.url, 
	      E("div", {key: "progress", className: "progress col-md-8"}, 
	          E("div", {className: "progress-bar", role: "progressbar", 
	              "aria-valuenow": progress, "aria-valuemin": "0", 
	              "aria-valuemax": "100", style: {width: progress+"%"}}, 
	            progress, "%"
	          )
	        ), 
	        E("button", {onClick: this.abortdownload, 
	        	className: "btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return E("button", {onClick: this.dismiss, className: "btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (E("div", null, E("span", {className: "pull-left"}, "Usage:"), E("div", {className: "progress"}, 
		  E("div", {className: "progress-bar progress-bar-success progress-bar-striped", role: "progressbar", style: {width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		E("div", {ref: "dialog1", className: "modal fade", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("h4", {className: "modal-title"}, "File Installer")
		        ), 
		        E("div", {className: "modal-body"}, 
		        	E("table", {className: "table"}, 
		        	E("tbody", null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ), 
		        E("div", {className: "modal-footer"}, 
		        	this.showUsage(), 
		           this.showProgress()
		        )
		      )
		    )
		  )
		);
	},	
	componentDidMount:function() {
		$(this.refs.dialog1.getDOMNode()).modal('show');
	}
});
/*TODO kdb check version*/
var Filemanager = React.createClass({
	getInitialState:function() {
		var quota=this.getQuota();
		return {browserReady:false,noupdate:true,	requestQuota:quota,remain:0};
	},
	getQuota:function() {
		var q=this.props.quota||"128M";
		var unit=q[q.length-1];
		var times=1;
		if (unit=="M") times=1024*1024;
		else if (unit="K") times=1024;
		return parseInt(q) * times;
	},
	missingKdb:function() {
		if (ksanagap.platform!="chrome") return [];
		var missing=this.props.needed.filter(function(kdb){
			for (var i in html5fs.files) {
				if (html5fs.files[i][0]==kdb.filename) return false;
			}
			return true;
		},this);
		return missing;
	},
	getRemoteUrl:function(fn) {
		var f=this.props.needed.filter(function(f){return f.filename==fn});
		if (f.length ) return f[0].url;
	},
	genFileList:function(existing,missing){
		var out=[];
		for (var i in existing) {
			var url=this.getRemoteUrl(existing[i][0]);
			out.push({filename:existing[i][0], url :url, ready:true });
		}
		for (var i in missing) {
			out.push(missing[i]);
		}
		return out;
	},
	reload:function() {
		html5fs.readdir(function(files){
  			this.setState({files:this.genFileList(files,this.missingKdb())});
  		},this);
	 },
	deleteFile:function(fn) {
	  html5fs.rm(fn,function(){
	  	this.reload();
	  },this);
	},
	onQuoteOk:function(quota,usage) {
		if (ksanagap.platform!="chrome") {
			//console.log("onquoteok");
			this.setState({noupdate:true,missing:[],files:[],autoclose:true
				,quota:quota,remain:quota-usage,usage:usage});
			return;
		}
		//console.log("quote ok");
		var files=this.genFileList(html5fs.files,this.missingKdb());
		var that=this;
		that.checkIfUpdate(files,function(hasupdate) {
			var missing=this.missingKdb();
			var autoclose=this.props.autoclose;
			if (missing.length) autoclose=false;
			that.setState({autoclose:autoclose,
				quota:quota,usage:usage,files:files,
				missing:missing,
				noupdate:!hasupdate,
				remain:quota-usage});
		});
	},  
	onBrowserOk:function() {
	  this.totalDownloadSize();
	}, 
	dismiss:function() {
		this.props.onReady(this.state.usage,this.state.quota);
		setTimeout(function(){
			var modalin=$(".modal.in");
			if (modalin.modal) modalin.modal('hide');
		},500);
	}, 
	totalDownloadSize:function() {
		var files=this.missingKdb();
		var taskqueue=[],totalsize=0;
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) totalsize+=data;
						html5fs.getDownloadSize(files[idx].url,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			totalsize+=data;
			setTimeout(function(){that.setState({requireSpace:totalsize,browserReady:true})},0);
		});
		taskqueue.shift()({__empty:true});
	},
	checkIfUpdate:function(files,cb) {
		var taskqueue=[];
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) files[idx-1].hasUpdate=data;
						html5fs.checkUpdate(files[idx].url,files[idx].filename,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			files[files.length-1].hasUpdate=data;
			var hasupdate=files.some(function(f){return f.hasUpdate});
			if (cb) cb.apply(that,[hasupdate]);
		});
		taskqueue.shift()({__empty:true});
	},
	render:function(){
    		if (!this.state.browserReady) {   
      			return E(CheckBrowser, {feature: "fs", onReady: this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return E(HtmlFS, {quota: quota, autoclose: "true", onReady: this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return E(FileList, {action: this.action, files: this.state.files, remainPercent: remain})
			} else {
				setTimeout( this.dismiss ,0);
				return E("span", null, "Success");
			}
      		}
	},
	action:function() {
	  var args = Array.prototype.slice.call(arguments);
	  var type=args.shift();
	  var res=null, that=this;
	  if (type=="delete") {
	    this.deleteFile(args[0]);
	  }  else if (type=="reload") {
	  	this.reload();
	  } else if (type=="dismiss") {
	  	this.dismiss();
	  }
	}
});

module.exports=Filemanager;
},{"./checkbrowser":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\checkbrowser.js","./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js","./htmlfs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\htmlfs.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js":[function(require,module,exports){
/* emulate filesystem on html5 browser */
var get_head=function(url,field,cb){
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);
	xhr.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				cb(xhr.getResponseHeader(field));
			} else {
				if (this.status!==200&&this.status!==206) {
					cb("");
				}
			} 
	};
	xhr.send();	
}
var get_date=function(url,cb) {
	get_head(url,"Last-Modified",function(value){
		cb(value);
	});
}
var get_size=function(url, cb) {
	get_head(url,"Content-Length",function(value){
		cb(parseInt(value));
	});
};
var checkUpdate=function(url,fn,cb) {
	if (!url) {
		cb(false);
		return;
	}
	get_date(url,function(d){
		API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
			fileEntry.getMetadata(function(metadata){
				var localDate=Date.parse(metadata.modificationTime);
				var urlDate=Date.parse(d);
				cb(urlDate>localDate);
			});
		},function(){
			cb(false);
		});
	});
}
var download=function(url,fn,cb,statuscb,context) {
	 var totalsize=0,batches=null,written=0;
	 var fileEntry=0, fileWriter=0;
	 var createBatches=function(size) {
		var bytes=1024*1024, out=[];
		var b=Math.floor(size / bytes);
		var last=size %bytes;
		for (var i=0;i<=b;i++) {
			out.push(i*bytes);
		}
		out.push(b*bytes+last);
		return out;
	 }
	 var finish=function() {
		 rm(fn,function(){
				fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
					setTimeout( cb.bind(context,false) , 0) ; 
				},function(e){
					console.log("failed",e)
				});
		 },this); 
	 };
		var tempfn="temp.kdb";
		var batch=function(b) {
		var abort=false;
		var xhr = new XMLHttpRequest();
		var requesturl=url+"?"+Math.random();
		xhr.open('get', requesturl, true);
		xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
		xhr.responseType = 'blob';    
		xhr.addEventListener('load', function() {
			var blob=this.response;
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				fileWriter.write(blob);
				written+=blob.size;
				fileWriter.onwriteend = function(e) {
					if (statuscb) {
						abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
						if (abort) setTimeout( cb.bind(context,false) , 0) ;
				 	}
					b++;
					if (!abort) {
						if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
						else                    finish();
				 	}
			 	};
			}, console.error);
		},false);
		xhr.send();
	}

	get_size(url,function(size){
		totalsize=size;
		if (!size) {
			if (cb) cb.apply(context,[false]);
		} else {//ready to download
			rm(tempfn,function(){
				 batches=createBatches(size);
				 if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
				 API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
							fileEntry=_fileEntry;
						batch(0);
				 });
			},this);
		}
	});
}

var readFile=function(filename,cb,context) {
	API.fs.root.getFile(filename, function(fileEntry) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
					if (cb) cb.apply(cb,[this.result]);
				};            
	}, console.error);
}
var writeFile=function(filename,buf,cb,context){
	API.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.write(buf);
				fileWriter.onwriteend = function(e) {
					if (cb) cb.apply(cb,[buf.byteLength]);
				};            
			}, console.error);
	}, console.error);
}

var readdir=function(cb,context) {
	var dirReader = API.fs.root.createReader();
	var out=[],that=this;
	dirReader.readEntries(function(entries) {
		if (entries.length) {
			for (var i = 0, entry; entry = entries[i]; ++i) {
				if (entry.isFile) {
					out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
				}
			}
		}
		API.files=out;
		if (cb) cb.apply(context,[out]);
	}, function(){
		if (cb) cb.apply(context,[null]);
	});
}
var getFileURL=function(filename) {
	if (!API.files ) return null;
	var file= API.files.filter(function(f){return f[0]==filename});
	if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
	var url=getFileURL(filename);
	if (url) rmURL(url,cb,context);
	else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
	webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
		fileEntry.remove(function() {
			if (cb) cb.apply(context,[true]);
		}, console.error);
	},  function(e){
		if (cb) cb.apply(context,[false]);//no such file
	});
}
function errorHandler(e) {
	console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
	webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
		API.fs=fs;
		API.quota=grantedBytes;
		readdir(function(){
			API.initialized=true;
			cb.apply(context,[grantedBytes,fs]);
		},context);
	}, errorHandler);
}
var init=function(quota,cb,context) {
	navigator.webkitPersistentStorage.requestQuota(quota, 
			function(grantedBytes) {
				initfs(grantedBytes,cb,context);
		}, errorHandler
	);
}
var queryQuota=function(cb,context) {
	var that=this;
	navigator.webkitPersistentStorage.queryUsageAndQuota( 
	 function(usage,quota){
			initfs(quota,function(){
				cb.apply(context,[usage,quota]);
			},context);
	});
}
var API={
	init:init
	,readdir:readdir
	,checkUpdate:checkUpdate
	,rm:rm
	,rmURL:rmURL
	,getFileURL:getFileURL
	,writeFile:writeFile
	,readFile:readFile
	,download:download
	,get_head:get_head
	,get_date:get_date
	,get_size:get_size
	,getDownloadSize:get_size
	,queryQuota:queryQuota
}
module.exports=API;
},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\htmlfs.js":[function(require,module,exports){
var html5fs=require("./html5fs");
var E=React.createElement;

var htmlfs = React.createClass({
	getInitialState:function() { 
		return {ready:false, quota:0,usage:0,Initialized:false,autoclose:this.props.autoclose};
	},
	initFilesystem:function() {
		var quota=this.props.quota||1024*1024*128; // default 128MB
		quota=parseInt(quota);
		html5fs.init(quota,function(q){
			this.dialog=false;
			$(this.refs.dialog1.getDOMNode()).modal('hide');
			this.setState({quota:q,autoclose:true});
		},this);
	},
	welcome:function() {
		return (
		E("div", {ref: "dialog1", className: "modal fade", id: "myModal", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("h4", {className: "modal-title"}, "Welcome")
		        ), 
		        E("div", {className: "modal-body"}, 
		          "Browser will ask for your confirmation."
		        ), 
		        E("div", {className: "modal-footer"}, 
		          E("button", {onClick: this.initFilesystem, type: "button", 
		            className: "btn btn-primary"}, "Initialize File System")
		        )
		      )
		    )
		  )
		 );
	},
	renderDefault:function(){
		var used=Math.floor(this.state.usage/this.state.quota *100);
		var more=function() {
			if (used>50) return E("button", {type: "button", className: "btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		E("div", {ref: "dialog1", className: "modal fade", id: "myModal", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("h4", {className: "modal-title"}, "Sandbox File System")
		        ), 
		        E("div", {className: "modal-body"}, 
		          E("div", {className: "progress"}, 
		            E("div", {className: "progress-bar", role: "progressbar", style: {width: used+"%"}}, 
		               used, "%"
		            )
		          ), 
		          E("span", null, this.state.quota, " total , ", this.state.usage, " in used")
		        ), 
		        E("div", {className: "modal-footer"}, 
		          E("button", {onClick: this.dismiss, type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
		          more()
		        )
		      )
		    )
		  )
		  );
	},
	dismiss:function() {
		var that=this;
		setTimeout(function(){
			that.props.onReady(that.state.quota,that.state.usage);	
		},0);
	},
	queryQuota:function() {
		if (ksanagap.platform=="chrome") {
			html5fs.queryQuota(function(usage,quota){
				this.setState({usage:usage,quota:quota,initialized:true});
			},this);			
		} else {
			this.setState({usage:333,quota:1000*1000*1024,initialized:true,autoclose:true});
		}
	},
	render:function() {
		var that=this;
		if (!this.state.quota || this.state.quota<this.props.quota) {
			if (this.state.initialized) {
				this.dialog=true;
				return this.welcome();	
			} else {
				return E("span", null, "checking quota");
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return null;
		}
	},
	componentDidMount:function() {
		if (!this.state.quota) {
			this.queryQuota();

		};
	},
	componentDidUpdate:function() {
		if (this.dialog) $(this.refs.dialog1.getDOMNode()).modal('show');
	}
});

module.exports=htmlfs;
},{"./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\index.js":[function(require,module,exports){
var ksana={"platform":"remote"};
if (typeof window!="undefined") {
	window.ksana=ksana;
	if (typeof ksanagap=="undefined") {
		window.ksanagap=require("./ksanagap"); //compatible layer with mobile
	}
}
if (typeof process !="undefined") {
	if (process.versions && process.versions["node-webkit"]) {
  		if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  		ksana.platform="node-webkit";
  		window.ksanagap.platform="node-webkit";
		var ksanajs=require("fs").readFileSync("ksana.js","utf8").trim();
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		window.kfs=require("./kfs");
  	}
} else if (typeof chrome!="undefined"){//} && chrome.fileSystem){
//	window.ksanagap=require("./ksanagap"); //compatible layer with mobile
	window.ksanagap.platform="chrome";
	window.kfs=require("./kfs_html5");
	require("./livereload")();
	ksana.platform="chrome";
} else {
	if (typeof ksanagap!="undefined" && typeof fs!="undefined") {//mobile
		var ksanajs=fs.readFileSync("ksana.js","utf8").trim(); //android extra \n at the end
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		ksana.platform=ksanagap.platform;
		if (typeof ksanagap.android !="undefined") {
			ksana.platform="android";
		}
	}
}
var timer=null;
var boot=function(appId,cb) {
	ksana.appId=appId;
	if (ksanagap.platform=="chrome") { //need to wait for jsonp ksana.js
		timer=setInterval(function(){
			if (ksana.ready){
				clearInterval(timer);
				if (ksana.js && ksana.js.files && ksana.js.files.length) {
					require("./installkdb")(ksana.js,cb);
				} else {
					cb();		
				}
			}
		},300);
	} else {
		cb();
	}
}

module.exports={boot:boot
	,htmlfs:require("./htmlfs")
	,html5fs:require("./html5fs")
	,liveupdate:require("./liveupdate")
	,fileinstaller:require("./fileinstaller")
	,downloader:require("./downloader")
	,installkdb:require("./installkdb")
};
},{"./downloader":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","./fileinstaller":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\fileinstaller.js","./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js","./htmlfs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\htmlfs.js","./installkdb":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\installkdb.js","./kfs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs.js","./kfs_html5":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs_html5.js","./ksanagap":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js","./livereload":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js","./liveupdate":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\liveupdate.js","fs":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\installkdb.js":[function(require,module,exports){
var Fileinstaller=require("./fileinstaller");

var getRequire_kdb=function() {
    var required=[];
    ksana.js.files.map(function(f){
      if (f.indexOf(".kdb")==f.length-4) {
        var slash=f.lastIndexOf("/");
        if (slash>-1) {
          var dbid=f.substring(slash+1,f.length-4);
          required.push({url:f,dbid:dbid,filename:dbid+".kdb"});
        } else {
          var dbid=f.substring(0,f.length-4);
          required.push({url:ksana.js.baseurl+f,dbid:dbid,filename:f});
        }        
      }
    });
    return required;
}
var callback=null;
var onReady=function() {
	callback();
}
var openFileinstaller=function(keep) {
	var require_kdb=getRequire_kdb().map(function(db){
	  return {
	    url:window.location.origin+window.location.pathname+db.dbid+".kdb",
	    dbdb:db.dbid,
	    filename:db.filename
	  }
	})
	return React.createElement(Fileinstaller, {quota: "512M", autoclose: !keep, needed: require_kdb, 
	                 onReady: onReady});
}
var installkdb=function(ksanajs,cb,context) {
	console.log(ksanajs.files);
	React.render(openFileinstaller(),document.getElementById("main"));
	callback=cb;
}
module.exports=installkdb;
},{"./fileinstaller":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\fileinstaller.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs.js":[function(require,module,exports){
//Simulate feature in ksanagap
/* 
  runs on node-webkit only
*/

var readDir=function(path) { //simulate Ksanagap function
	var fs=nodeRequire("fs");
	path=path||"..";
	var dirs=[];
	if (path[0]==".") {
		if (path==".") dirs=fs.readdirSync(".");
		else {
			dirs=fs.readdirSync("..");
		}
	} else {
		dirs=fs.readdirSync(path);
	}

	return dirs.join("\uffff");
}
var listApps=function() {
	var fs=nodeRequire("fs");
	var ksanajsfile=function(d) {return "../"+d+"/ksana.js"};
	var dirs=fs.readdirSync("..").filter(function(d){
				return fs.statSync("../"+d).isDirectory() && d[0]!="."
				   && fs.existsSync(ksanajsfile(d));
	});
	
	var out=dirs.map(function(d){
		var content=fs.readFileSync(ksanajsfile(d),"utf8");
  	content=content.replace("})","}");
  	content=content.replace("jsonp_handler(","");
		var obj= JSON.parse(content);
		obj.dbid=d;
		obj.path=d;
		return obj;
	})
	return JSON.stringify(out);
}



var kfs={readDir:readDir,listApps:listApps};

module.exports=kfs;
},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs_html5.js":[function(require,module,exports){
var readDir=function(){
	return [];
}
var listApps=function(){
	return [];
}
module.exports={readDir:readDir,listApps:listApps};
},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js":[function(require,module,exports){
var appname="installer";
var switchApp=function(path) {
	var fs=require("fs");
	path="../"+path;
	appname=path;
	document.location.href= path+"/index.html"; 
	process.chdir(path);
}
var downloader={};
var rootPath="";

var deleteApp=function(app) {
	console.error("not allow on PC, do it in File Explorer/ Finder");
}
var username=function() {
	return "";
}
var useremail=function() {
	return ""
}
var runtime_version=function() {
	return "1.4";
}

//copy from liveupdate
var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp2");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    if (typeof data=="object") {
      data.dbid=dbid;
      callback.apply(context,[data]);    
    }  
  }
  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }
  script=document.createElement('script');
  script.setAttribute('id', "jsonp2");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}

var ksanagap={
	platform:"node-webkit",
	startDownload:downloader.startDownload,
	downloadedByte:downloader.downloadedByte,
	downloadingFile:downloader.downloadingFile,
	cancelDownload:downloader.cancelDownload,
	doneDownload:downloader.doneDownload,
	switchApp:switchApp,
	rootPath:rootPath,
	deleteApp: deleteApp,
	username:username, //not support on PC
	useremail:username,
	runtime_version:runtime_version,
	
}

if (typeof process!="undefined") {
	var ksanajs=require("fs").readFileSync("./ksana.js","utf8").trim();
	downloader=require("./downloader");
	console.log(ksanajs);
	//ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
	rootPath=process.cwd();
	rootPath=require("path").resolve(rootPath,"..").replace(/\\/g,"/")+'/';
	ksana.ready=true;
} else{
	var url=window.location.origin+window.location.pathname.replace("index.html","")+"ksana.js";
	jsonp(url,appname,function(data){
		ksana.js=data;
		ksana.ready=true;
	});
}
module.exports=ksanagap;
},{"./downloader":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","fs":false,"path":false}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js":[function(require,module,exports){
var started=false;
var timer=null;
var bundledate=null;
var get_date=require("./html5fs").get_date;
var checkIfBundleUpdated=function() {
	get_date("bundle.js",function(date){
		if (bundledate &&bundledate!=date){
			location.reload();
		}
		bundledate=date;
	});
}
var livereload=function() {
	if (started) return;

	timer1=setInterval(function(){
		checkIfBundleUpdated();
	},2000);
	started=true;
}

module.exports=livereload;
},{"./html5fs":"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\liveupdate.js":[function(require,module,exports){

var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    //console.log("receive from ksana.js",data);
    if (typeof data=="object") {
      if (typeof data.dbid=="undefined") {
        data.dbid=dbid;
      }
      callback.apply(context,[data]);
    }  
  }

  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }

  script=document.createElement('script');
  script.setAttribute('id', "jsonp");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}
var runtime_version_ok=function(minruntime) {
  if (!minruntime) return true;//not mentioned.
  var min=parseFloat(minruntime);
  var runtime=parseFloat( ksanagap.runtime_version()||"1.0");
  if (min>runtime) return false;
  return true;
}

var needToUpdate=function(fromjson,tojson) {
  var needUpdates=[];
  for (var i=0;i<fromjson.length;i++) { 
    var to=tojson[i];
    var from=fromjson[i];
    var newfiles=[],newfilesizes=[],removed=[];
    
    if (!to) continue; //cannot reach host
    if (!runtime_version_ok(to.minruntime)) {
      console.warn("runtime too old, need "+to.minruntime);
      continue; 
    }
    if (!from.filedates) {
      console.warn("missing filedates in ksana.js of "+from.dbid);
      continue;
    }
    from.filedates.map(function(f,idx){
      var newidx=to.files.indexOf( from.files[idx]);
      if (newidx==-1) {
        //file removed in new version
        removed.push(from.files[idx]);
      } else {
        var fromdate=Date.parse(f);
        var todate=Date.parse(to.filedates[newidx]);
        if (fromdate<todate) {
          newfiles.push( to.files[newidx] );
          newfilesizes.push(to.filesizes[newidx]);
        }        
      }
    });
    if (newfiles.length) {
      from.newfiles=newfiles;
      from.newfilesizes=newfilesizes;
      from.removed=removed;
      needUpdates.push(from);
    }
  }
  return needUpdates;
}
var getUpdatables=function(apps,cb,context) {
  getRemoteJson(apps,function(jsons){
    var hasUpdates=needToUpdate(apps,jsons);
    cb.apply(context,[hasUpdates]);
  },context);
}
var getRemoteJson=function(apps,cb,context) {
  var taskqueue=[],output=[];
  var makecb=function(app){
    return function(data){
        if (!(data && typeof data =='object' && data.__empty)) output.push(data);
        if (!app.baseurl) {
          taskqueue.shift({__empty:true});
        } else {
          var url=app.baseurl+"/ksana.js";    
          console.log(url);
          jsonp( url ,app.dbid,taskqueue.shift(), context);           
        }
    };
  };
  apps.forEach(function(app){taskqueue.push(makecb(app))});

  taskqueue.push(function(data){
    output.push(data);
    cb.apply(context,[output]);
  });

  taskqueue.shift()({__empty:true}); //run the task
}
var humanFileSize=function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};

var start=function(ksanajs,cb,context){
  var files=ksanajs.newfiles||ksanajs.files;
  var baseurl=ksanajs.baseurl|| "http://127.0.0.1:8080/"+ksanajs.dbid+"/";
  var started=ksanagap.startDownload(ksanajs.dbid,baseurl,files.join("\uffff"));
  cb.apply(context,[started]);
}
var status=function(){
  var nfile=ksanagap.downloadingFile();
  var downloadedByte=ksanagap.downloadedByte();
  var done=ksanagap.doneDownload();
  return {nfile:nfile,downloadedByte:downloadedByte, done:done};
}

var cancel=function(){
  return ksanagap.cancelDownload();
}

var liveupdate={ humanFileSize: humanFileSize, 
  needToUpdate: needToUpdate , jsonp:jsonp, 
  getUpdatables:getUpdatables,
  start:start,
  cancel:cancel,
  status:status
  };
module.exports=liveupdate;
},{}],"C:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js":[function(require,module,exports){
function mkdirP (p, mode, f, made) {
     var path = nodeRequire('path');
     var fs = nodeRequire('fs');
	
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    if (mode === undefined) {
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

},{}]},{},["C:\\ksana2015\\a2048\\index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcVXNlcnNcXGNoZW5cXEFwcERhdGFcXFJvYW1pbmdcXG5wbVxcbm9kZV9tb2R1bGVzXFxicm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXItcGFja1xcX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInNyY1xcbWFpbi5qc3giLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxcY2hlY2ticm93c2VyLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXGRvd25sb2FkZXIuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxcZmlsZWluc3RhbGxlci5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxodG1sNWZzLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXGh0bWxmcy5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxpbmRleC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxpbnN0YWxsa2RiLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXGtmcy5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxrZnNfaHRtbDUuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxca3NhbmFnYXAuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxcbGl2ZXJlbG9hZC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxsaXZldXBkYXRlLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXG1rZGlycC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJ1bnRpbWU9cmVxdWlyZShcImtzYW5hMjAxNS13ZWJydW50aW1lXCIpO1xyXG5ydW50aW1lLmJvb3QoXCJhMjA0OFwiLGZ1bmN0aW9uKCl7XHJcblx0dmFyIE1haW49UmVhY3QuY3JlYXRlRWxlbWVudChyZXF1aXJlKFwiLi9zcmMvbWFpbi5qc3hcIikpO1xyXG5cdGtzYW5hLm1haW5Db21wb25lbnQ9UmVhY3QucmVuZGVyKE1haW4sZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcclxufSk7IiwiXHJcbnZhciBtYWluY29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIm1haW5jb21wb25lbnRcIixcclxuICBnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcbiAgXHRyZXR1cm4ge3Njb3JlOjAsIG1heDowLCB0aW1lOjAsIGNlbGxzOltcclxuICAgICAgWzExLDEyLDEzLDE0XSxbMjEsMjIsMjMsMjRdLFszMSwzMiwzMywzNF0sWzQxLDQyLDQzLDQ0XVxyXG4gICAgXX07XHJcbiAgfSxcclxuICByZW5kZXJCb3hzOmZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwidGRcIiwgbnVsbCwgaXRlbT9pdGVtOicnKVxyXG4gIH0sXHJcbiAgcmVuZGVyUm93czpmdW5jdGlvbihyb3cpIHtcclxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFwidHJcIiwgbnVsbCwgcm93Lm1hcCh0aGlzLnJlbmRlckJveHMpKTtcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsIFwi6Y2155uk5LiKIOaMiSDihpEg4oaTIOKGkCDihpIg5oiWIHcgcyBhIGQg5oiW6ICFXCIpLCBcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsIFwi5omL5oyH5ZyoIOihqOagvCDkuYvkuK0g5ZCRIOS4iuS4i+W3puWPsyDmu5Hli5VcIiksIFxyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaDRcIiwgbnVsbCwgXCLmlbjlgLzpg73kvp3mlrnlkJHnp7vli5Ug56Kw55u45ZCM5YC85bCx55u45YqgXCIpLCBcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImg0XCIsIG51bGwsIFwi57Sv6KiI55u45Yqg5YC8IOWNs+atpCAyMDQ4IOmBiuaIsueahCDlvpfliIZcIiksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJoNFwiLCBudWxsLCBcIum7nuW3puS4i+inkumWi+Wni1wiKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLCBcbiAgICAgIFwi5b6X5YiGXCIsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJzY29yZVwifSwgdGhpcy5zdGF0ZS5zY29yZSksIFwiIMKgXCIgKyAnICcgK1xuICAgICAgXCLmnIDpq5hcIiwgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcIm1heFwifSwgdGhpcy5zdGF0ZS5tYXgpLCBcIiDCoFwiICsgJyAnICtcbiAgICAgIFwi5Ymp6aSYXCIsIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJ0aW1lXCJ9LCB0aGlzLnN0YXRlLnRpbWUsIFwi56eSXCIpLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksIFxyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmNoYW5nZWRhdGF9LCBcImNoYW5nZVwiKSwgXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJ0YWJsZVwiLCB7Ym9yZGVyOiBcIjFcIn0sIFxyXG4gICAgICAgIHRoaXMuc3RhdGUuY2VsbHMubWFwKHRoaXMucmVuZGVyUm93cylcclxuICAgICAgKVxyXG4gICAgKTtcclxuICB9LFxyXG4gIGNoYW5nZWRhdGE6ZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgdGFibGU9W10sIHN1bT1tPTAsIG47XHJcbiAgICBmb3IgKHZhciBpPTE7aTw9NDtpKyspIHtcclxuICAgICAgdmFyIHJvdz1bXTtcclxuICAgICAgZm9yICh2YXIgaj0xO2o8PTQ7aisrKSB7XHJcbiAgICAgICAgbj1NYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqNSk7XHJcbiAgICAgICAgc3VtKz1uLCBtPW4+bT9uOm07XHJcbiAgICAgICAgcm93LnB1c2gobik7XHJcbiAgICAgIH1cclxuICAgICAgdGFibGUucHVzaChyb3cpXHJcbiAgICB9XHJcbiAgICB0aGlzLnNldFN0YXRlKHtjZWxsczp0YWJsZSxzY29yZTpzdW0sbWF4Om19KTtcclxuICB9XHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cz1tYWluY29tcG9uZW50OyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xyXG4vKlxyXG5jb252ZXJ0IHRvIHB1cmUganNcclxuc2F2ZSAtZyByZWFjdGlmeVxyXG4qL1xyXG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xyXG5cclxudmFyIGhhc2tzYW5hZ2FwPSh0eXBlb2Yga3NhbmFnYXAhPVwidW5kZWZpbmVkXCIpO1xyXG5pZiAoaGFza3NhbmFnYXAgJiYgKHR5cGVvZiBjb25zb2xlPT1cInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlLmxvZz09XCJ1bmRlZmluZWRcIikpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlPXtsb2c6a3NhbmFnYXAubG9nLGVycm9yOmtzYW5hZ2FwLmVycm9yLGRlYnVnOmtzYW5hZ2FwLmRlYnVnLHdhcm46a3NhbmFnYXAud2Fybn07XHJcblx0XHRjb25zb2xlLmxvZyhcImluc3RhbGwgY29uc29sZSBvdXRwdXQgZnVuY2l0b25cIik7XHJcbn1cclxuXHJcbnZhciBjaGVja2ZzPWZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiAobmF2aWdhdG9yICYmIG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZSkgfHwgaGFza3NhbmFnYXA7XHJcbn1cclxudmFyIGZlYXR1cmVjaGVja3M9e1xyXG5cdFwiZnNcIjpjaGVja2ZzXHJcbn1cclxudmFyIGNoZWNrYnJvd3NlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIG1pc3NpbmdGZWF0dXJlcz10aGlzLmdldE1pc3NpbmdGZWF0dXJlcygpO1xyXG5cdFx0cmV0dXJuIHtyZWFkeTpmYWxzZSwgbWlzc2luZzptaXNzaW5nRmVhdHVyZXN9O1xyXG5cdH0sXHJcblx0Z2V0TWlzc2luZ0ZlYXR1cmVzOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGZlYXR1cmU9dGhpcy5wcm9wcy5mZWF0dXJlLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciBzdGF0dXM9W107XHJcblx0XHRmZWF0dXJlLm1hcChmdW5jdGlvbihmKXtcclxuXHRcdFx0dmFyIGNoZWNrZXI9ZmVhdHVyZWNoZWNrc1tmXTtcclxuXHRcdFx0aWYgKGNoZWNrZXIpIGNoZWNrZXI9Y2hlY2tlcigpO1xyXG5cdFx0XHRzdGF0dXMucHVzaChbZixjaGVja2VyXSk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBzdGF0dXMuZmlsdGVyKGZ1bmN0aW9uKGYpe3JldHVybiAhZlsxXX0pO1xyXG5cdH0sXHJcblx0ZG93bmxvYWRicm93c2VyOmZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9jaHJvbWUvXCJcclxuXHR9LFxyXG5cdHJlbmRlck1pc3Npbmc6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2hvd01pc3Npbmc9ZnVuY3Rpb24obSkge1xyXG5cdFx0XHRyZXR1cm4gRShcImRpdlwiLCBudWxsLCBtKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAoXHJcblx0XHQgRShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcclxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcclxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcclxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXHJcblx0XHQgICAgICAgICAgRShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImNsb3NlXCIsIFwiZGF0YS1kaXNtaXNzXCI6IFwibW9kYWxcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0sIFwiw5dcIiksIFxyXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIkJyb3dzZXIgQ2hlY2tcIilcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwicFwiLCBudWxsLCBcIlNvcnJ5IGJ1dCB0aGUgZm9sbG93aW5nIGZlYXR1cmUgaXMgbWlzc2luZ1wiKSwgXHJcblx0XHQgICAgICAgICAgdGhpcy5zdGF0ZS5taXNzaW5nLm1hcChzaG93TWlzc2luZylcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1mb290ZXJcIn0sIFxyXG5cdFx0ICAgICAgICAgIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZG93bmxvYWRicm93c2VyLCB0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkRvd25sb2FkIEdvb2dsZSBDaHJvbWVcIilcclxuXHRcdCAgICAgICAgKVxyXG5cdFx0ICAgICAgKVxyXG5cdFx0ICAgIClcclxuXHRcdCAgKVxyXG5cdFx0ICk7XHJcblx0fSxcclxuXHRyZW5kZXJSZWFkeTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcImJyb3dzZXIgb2tcIilcclxuXHR9LFxyXG5cdHJlbmRlcjpmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuICAodGhpcy5zdGF0ZS5taXNzaW5nLmxlbmd0aCk/dGhpcy5yZW5kZXJNaXNzaW5nKCk6dGhpcy5yZW5kZXJSZWFkeSgpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoIXRoaXMuc3RhdGUubWlzc2luZy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy5wcm9wcy5vblJlYWR5KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHM9Y2hlY2ticm93c2VyOyIsIlxyXG52YXIgdXNlckNhbmNlbD1mYWxzZTtcclxudmFyIGZpbGVzPVtdO1xyXG52YXIgdG90YWxEb3dubG9hZEJ5dGU9MDtcclxudmFyIHRhcmdldFBhdGg9XCJcIjtcclxudmFyIHRlbXBQYXRoPVwiXCI7XHJcbnZhciBuZmlsZT0wO1xyXG52YXIgYmFzZXVybD1cIlwiO1xyXG52YXIgcmVzdWx0PVwiXCI7XHJcbnZhciBkb3dubG9hZGluZz1mYWxzZTtcclxudmFyIHN0YXJ0RG93bmxvYWQ9ZnVuY3Rpb24oZGJpZCxfYmFzZXVybCxfZmlsZXMpIHsgLy9yZXR1cm4gZG93bmxvYWQgaWRcclxuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xyXG5cdHZhciBwYXRoICAgPSByZXF1aXJlKFwicGF0aFwiKTtcclxuXHJcblx0XHJcblx0ZmlsZXM9X2ZpbGVzLnNwbGl0KFwiXFx1ZmZmZlwiKTtcclxuXHRpZiAoZG93bmxvYWRpbmcpIHJldHVybiBmYWxzZTsgLy9vbmx5IG9uZSBzZXNzaW9uXHJcblx0dXNlckNhbmNlbD1mYWxzZTtcclxuXHR0b3RhbERvd25sb2FkQnl0ZT0wO1xyXG5cdG5leHRGaWxlKCk7XHJcblx0ZG93bmxvYWRpbmc9dHJ1ZTtcclxuXHRiYXNldXJsPV9iYXNldXJsO1xyXG5cdGlmIChiYXNldXJsW2Jhc2V1cmwubGVuZ3RoLTFdIT0nLycpYmFzZXVybCs9Jy8nO1xyXG5cdHRhcmdldFBhdGg9a3NhbmFnYXAucm9vdFBhdGgrZGJpZCsnLyc7XHJcblx0dGVtcFBhdGg9a3NhbmFnYXAucm9vdFBhdGgrXCIudG1wL1wiO1xyXG5cdHJlc3VsdD1cIlwiO1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG52YXIgbmV4dEZpbGU9ZnVuY3Rpb24oKSB7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0aWYgKG5maWxlPT1maWxlcy5sZW5ndGgpIHtcclxuXHRcdFx0bmZpbGUrKztcclxuXHRcdFx0ZW5kRG93bmxvYWQoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvd25sb2FkRmlsZShuZmlsZSsrKTtcdFxyXG5cdFx0fVxyXG5cdH0sMTAwKTtcclxufVxyXG5cclxudmFyIGRvd25sb2FkRmlsZT1mdW5jdGlvbihuZmlsZSkge1xyXG5cdHZhciB1cmw9YmFzZXVybCtmaWxlc1tuZmlsZV07XHJcblx0dmFyIHRtcGZpbGVuYW1lPXRlbXBQYXRoK2ZpbGVzW25maWxlXTtcclxuXHR2YXIgbWtkaXJwID0gcmVxdWlyZShcIi4vbWtkaXJwXCIpO1xyXG5cdHZhciBmcyAgICAgPSByZXF1aXJlKFwiZnNcIik7XHJcblx0dmFyIGh0dHAgICA9IHJlcXVpcmUoXCJodHRwXCIpO1xyXG5cclxuXHRta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUodG1wZmlsZW5hbWUpKTtcclxuXHR2YXIgd3JpdGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bXBmaWxlbmFtZSk7XHJcblx0dmFyIGRhdGFsZW5ndGg9MDtcclxuXHR2YXIgcmVxdWVzdCA9IGh0dHAuZ2V0KHVybCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdHJlc3BvbnNlLm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XHJcblx0XHRcdHdyaXRlU3RyZWFtLndyaXRlKGNodW5rKTtcclxuXHRcdFx0dG90YWxEb3dubG9hZEJ5dGUrPWNodW5rLmxlbmd0aDtcclxuXHRcdFx0aWYgKHVzZXJDYW5jZWwpIHtcclxuXHRcdFx0XHR3cml0ZVN0cmVhbS5lbmQoKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bmV4dEZpbGUoKTt9LDEwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmVzcG9uc2Uub24oXCJlbmRcIixmdW5jdGlvbigpIHtcclxuXHRcdFx0d3JpdGVTdHJlYW0uZW5kKCk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtuZXh0RmlsZSgpO30sMTAwKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG52YXIgY2FuY2VsRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XHJcblx0dXNlckNhbmNlbD10cnVlO1xyXG5cdGVuZERvd25sb2FkKCk7XHJcbn1cclxudmFyIHZlcmlmeT1mdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG52YXIgZW5kRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XHJcblx0bmZpbGU9ZmlsZXMubGVuZ3RoKzE7Ly9zdG9wXHJcblx0cmVzdWx0PVwiY2FuY2VsbGVkXCI7XHJcblx0ZG93bmxvYWRpbmc9ZmFsc2U7XHJcblx0aWYgKHVzZXJDYW5jZWwpIHJldHVybjtcclxuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xyXG5cdHZhciBta2RpcnAgPSByZXF1aXJlKFwiLi9ta2RpcnBcIik7XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciB0YXJnZXRmaWxlbmFtZT10YXJnZXRQYXRoK2ZpbGVzW2ldO1xyXG5cdFx0dmFyIHRtcGZpbGVuYW1lICAgPXRlbXBQYXRoK2ZpbGVzW2ldO1xyXG5cdFx0bWtkaXJwLnN5bmMocGF0aC5kaXJuYW1lKHRhcmdldGZpbGVuYW1lKSk7XHJcblx0XHRmcy5yZW5hbWVTeW5jKHRtcGZpbGVuYW1lLHRhcmdldGZpbGVuYW1lKTtcclxuXHR9XHJcblx0aWYgKHZlcmlmeSgpKSB7XHJcblx0XHRyZXN1bHQ9XCJzdWNjZXNzXCI7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJlc3VsdD1cImVycm9yXCI7XHJcblx0fVxyXG59XHJcblxyXG52YXIgZG93bmxvYWRlZEJ5dGU9ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRvdGFsRG93bmxvYWRCeXRlO1xyXG59XHJcbnZhciBkb25lRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XHJcblx0aWYgKG5maWxlPmZpbGVzLmxlbmd0aCkgcmV0dXJuIHJlc3VsdDtcclxuXHRlbHNlIHJldHVybiBcIlwiO1xyXG59XHJcbnZhciBkb3dubG9hZGluZ0ZpbGU9ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIG5maWxlLTE7XHJcbn1cclxuXHJcbnZhciBkb3dubG9hZGVyPXtzdGFydERvd25sb2FkOnN0YXJ0RG93bmxvYWQsIGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZWRCeXRlLFxyXG5cdGRvd25sb2FkaW5nRmlsZTpkb3dubG9hZGluZ0ZpbGUsIGNhbmNlbERvd25sb2FkOmNhbmNlbERvd25sb2FkLGRvbmVEb3dubG9hZDpkb25lRG93bmxvYWR9O1xyXG5tb2R1bGUuZXhwb3J0cz1kb3dubG9hZGVyOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xyXG5cclxuLyogdG9kbyAsIG9wdGlvbmFsIGtkYiAqL1xyXG5cclxudmFyIEh0bWxGUz1yZXF1aXJlKFwiLi9odG1sZnNcIik7XHJcbnZhciBodG1sNWZzPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIik7XHJcbnZhciBDaGVja0Jyb3dzZXI9cmVxdWlyZShcIi4vY2hlY2ticm93c2VyXCIpO1xyXG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xyXG4gIFxyXG5cclxudmFyIEZpbGVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7ZG93bmxvYWRpbmc6ZmFsc2UscHJvZ3Jlc3M6MH07XHJcblx0fSxcclxuXHR1cGRhdGFibGU6ZnVuY3Rpb24oZikge1xyXG4gICAgICAgIHZhciBjbGFzc2VzPVwiYnRuIGJ0bi13YXJuaW5nXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XHJcblx0XHRpZiAoZi5oYXNVcGRhdGUpIHJldHVybiAgIEUoXCJidXR0b25cIiwge2NsYXNzTmFtZTogY2xhc3NlcywgXHJcblx0XHRcdFwiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lLCBcImRhdGEtdXJsXCI6IGYudXJsLCBcclxuXHQgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRvd25sb2FkXHJcblx0ICAgICAgIH0sIFwiVXBkYXRlXCIpXHJcblx0XHRlbHNlIHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0c2hvd0xvY2FsOmZ1bmN0aW9uKGYpIHtcclxuICAgICAgICB2YXIgY2xhc3Nlcz1cImJ0biBidG4tZGFuZ2VyXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XHJcblx0ICByZXR1cm4gRShcInRyXCIsIG51bGwsIEUoXCJ0ZFwiLCBudWxsLCBmLmZpbGVuYW1lKSwgXHJcblx0ICAgICAgRShcInRkXCIsIG51bGwpLCBcclxuXHQgICAgICBFKFwidGRcIiwge2NsYXNzTmFtZTogXCJwdWxsLXJpZ2h0XCJ9LCBcclxuXHQgICAgICB0aGlzLnVwZGF0YWJsZShmKSwgRShcImJ1dHRvblwiLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLCBcclxuXHQgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRlbGV0ZUZpbGUsIFwiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lfSwgXCJEZWxldGVcIilcclxuXHQgICAgICAgIFxyXG5cdCAgICAgIClcclxuXHQgIClcclxuXHR9LCAgXHJcblx0c2hvd1JlbW90ZTpmdW5jdGlvbihmKSB7IFxyXG5cdCAgdmFyIGNsYXNzZXM9XCJidG4gYnRuLXdhcm5pbmdcIjtcclxuXHQgIGlmICh0aGlzLnN0YXRlLmRvd25sb2FkaW5nKSBjbGFzc2VzKz1cIiBkaXNhYmxlZFwiO1xyXG5cdCAgcmV0dXJuIChFKFwidHJcIiwge1wiZGF0YS1pZFwiOiBmLmZpbGVuYW1lfSwgRShcInRkXCIsIG51bGwsIFxyXG5cdCAgICAgIGYuZmlsZW5hbWUpLCBcclxuXHQgICAgICBFKFwidGRcIiwgbnVsbCwgZi5kZXNjKSwgXHJcblx0ICAgICAgRShcInRkXCIsIG51bGwsIFxyXG5cdCAgICAgIEUoXCJzcGFuXCIsIHtcImRhdGEtZmlsZW5hbWVcIjogZi5maWxlbmFtZSwgXCJkYXRhLXVybFwiOiBmLnVybCwgXHJcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc2VzLCBcclxuXHQgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRvd25sb2FkfSwgXCJEb3dubG9hZFwiKVxyXG5cdCAgICAgIClcclxuXHQgICkpO1xyXG5cdH0sXHJcblx0c2hvd0ZpbGU6ZnVuY3Rpb24oZikge1xyXG5cdC8vXHRyZXR1cm4gPHNwYW4gZGF0YS1pZD17Zi5maWxlbmFtZX0+e2YudXJsfTwvc3Bhbj5cclxuXHRcdHJldHVybiAoZi5yZWFkeSk/dGhpcy5zaG93TG9jYWwoZik6dGhpcy5zaG93UmVtb3RlKGYpO1xyXG5cdH0sXHJcblx0cmVsb2FkRGlyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJyZWxvYWRcIik7XHJcblx0fSxcclxuXHRkb3dubG9hZDpmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgdXJsPWUudGFyZ2V0LmRhdGFzZXRbXCJ1cmxcIl07XHJcblx0XHR2YXIgZmlsZW5hbWU9ZS50YXJnZXQuZGF0YXNldFtcImZpbGVuYW1lXCJdO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7ZG93bmxvYWRpbmc6dHJ1ZSxwcm9ncmVzczowLHVybDp1cmx9KTtcclxuXHRcdHRoaXMudXNlcmJyZWFrPWZhbHNlO1xyXG5cdFx0aHRtbDVmcy5kb3dubG9hZCh1cmwsZmlsZW5hbWUsZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5yZWxvYWREaXIoKTtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7ZG93bmxvYWRpbmc6ZmFsc2UscHJvZ3Jlc3M6MX0pO1xyXG5cdFx0XHR9LGZ1bmN0aW9uKHByb2dyZXNzLHRvdGFsKXtcclxuXHRcdFx0XHRpZiAocHJvZ3Jlc3M9PTApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe21lc3NhZ2U6XCJ0b3RhbCBcIit0b3RhbH0pXHJcblx0XHRcdCBcdH1cclxuXHRcdFx0IFx0dGhpcy5zZXRTdGF0ZSh7cHJvZ3Jlc3M6cHJvZ3Jlc3N9KTtcclxuXHRcdFx0IFx0Ly9pZiB1c2VyIHByZXNzIGFib3J0IHJldHVybiB0cnVlXHJcblx0XHRcdCBcdHJldHVybiB0aGlzLnVzZXJicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0LHRoaXMpO1xyXG5cdH0sXHJcblx0ZGVsZXRlRmlsZTpmdW5jdGlvbiggZSkge1xyXG5cdFx0dmFyIGZpbGVuYW1lPWUudGFyZ2V0LmF0dHJpYnV0ZXNbXCJkYXRhLWZpbGVuYW1lXCJdLnZhbHVlO1xyXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJkZWxldGVcIixmaWxlbmFtZSk7XHJcblx0fSxcclxuXHRhbGxGaWxlc1JlYWR5OmZ1bmN0aW9uKGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByb3BzLmZpbGVzLmV2ZXJ5KGZ1bmN0aW9uKGYpeyByZXR1cm4gZi5yZWFkeX0pO1xyXG5cdH0sXHJcblx0ZGlzbWlzczpmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xyXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJkaXNtaXNzXCIpO1xyXG5cdH0sXHJcblx0YWJvcnRkb3dubG9hZDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudXNlcmJyZWFrPXRydWU7XHJcblx0fSxcclxuXHRzaG93UHJvZ3Jlc3M6ZnVuY3Rpb24oKSB7XHJcblx0ICAgICBpZiAodGhpcy5zdGF0ZS5kb3dubG9hZGluZykge1xyXG5cdCAgICAgIHZhciBwcm9ncmVzcz1NYXRoLnJvdW5kKHRoaXMuc3RhdGUucHJvZ3Jlc3MqMTAwKTtcclxuXHQgICAgICByZXR1cm4gKFxyXG5cdCAgICAgIFx0RShcImRpdlwiLCBudWxsLCBcclxuXHQgICAgICBcdFwiRG93bmxvYWRpbmcgZnJvbSBcIiwgdGhpcy5zdGF0ZS51cmwsIFxyXG5cdCAgICAgIEUoXCJkaXZcIiwge2tleTogXCJwcm9ncmVzc1wiLCBjbGFzc05hbWU6IFwicHJvZ3Jlc3MgY29sLW1kLThcIn0sIFxyXG5cdCAgICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgXHJcblx0ICAgICAgICAgICAgICBcImFyaWEtdmFsdWVub3dcIjogcHJvZ3Jlc3MsIFwiYXJpYS12YWx1ZW1pblwiOiBcIjBcIiwgXHJcblx0ICAgICAgICAgICAgICBcImFyaWEtdmFsdWVtYXhcIjogXCIxMDBcIiwgc3R5bGU6IHt3aWR0aDogcHJvZ3Jlc3MrXCIlXCJ9fSwgXHJcblx0ICAgICAgICAgICAgcHJvZ3Jlc3MsIFwiJVwiXHJcblx0ICAgICAgICAgIClcclxuXHQgICAgICAgICksIFxyXG5cdCAgICAgICAgRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5hYm9ydGRvd25sb2FkLCBcclxuXHQgICAgICAgIFx0Y2xhc3NOYW1lOiBcImJ0biBidG4tZGFuZ2VyIGNvbC1tZC00XCJ9LCBcIkFib3J0XCIpXHJcblx0ICAgICAgICApXHJcblx0ICAgICAgICApO1xyXG5cdCAgICAgIH0gZWxzZSB7XHJcblx0ICAgICAgXHRcdGlmICggdGhpcy5hbGxGaWxlc1JlYWR5KCkgKSB7XHJcblx0ICAgICAgXHRcdFx0cmV0dXJuIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZGlzbWlzcywgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXCJPa1wiKVxyXG5cdCAgICAgIFx0XHR9IGVsc2UgcmV0dXJuIG51bGw7XHJcblx0ICAgICAgXHRcdFxyXG5cdCAgICAgIH1cclxuXHR9LFxyXG5cdHNob3dVc2FnZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwZXJjZW50PXRoaXMucHJvcHMucmVtYWluUGVyY2VudDtcclxuICAgICAgICAgICByZXR1cm4gKEUoXCJkaXZcIiwgbnVsbCwgRShcInNwYW5cIiwge2NsYXNzTmFtZTogXCJwdWxsLWxlZnRcIn0sIFwiVXNhZ2U6XCIpLCBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3NcIn0sIFxyXG5cdFx0ICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzIHByb2dyZXNzLWJhci1zdHJpcGVkXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgc3R5bGU6IHt3aWR0aDogcGVyY2VudCtcIiVcIn19LCBcclxuXHRcdCAgICBcdHBlcmNlbnQrXCIlXCJcclxuXHRcdCAgKVxyXG5cdFx0KSkpO1xyXG5cdH0sXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdCAgXHRyZXR1cm4gKFxyXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcclxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcclxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcclxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXHJcblx0XHQgICAgICAgICAgRShcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIFwiRmlsZSBJbnN0YWxsZXJcIilcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcclxuXHRcdCAgICAgICAgXHRFKFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJ0YWJsZVwifSwgXHJcblx0XHQgICAgICAgIFx0RShcInRib2R5XCIsIG51bGwsIFxyXG5cdFx0ICAgICAgICAgIFx0dGhpcy5wcm9wcy5maWxlcy5tYXAodGhpcy5zaG93RmlsZSlcclxuXHRcdCAgICAgICAgICBcdClcclxuXHRcdCAgICAgICAgICApXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcclxuXHRcdCAgICAgICAgXHR0aGlzLnNob3dVc2FnZSgpLCBcclxuXHRcdCAgICAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MoKVxyXG5cdFx0ICAgICAgICApXHJcblx0XHQgICAgICApXHJcblx0XHQgICAgKVxyXG5cdFx0ICApXHJcblx0XHQpO1xyXG5cdH0sXHRcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xyXG5cdH1cclxufSk7XHJcbi8qVE9ETyBrZGIgY2hlY2sgdmVyc2lvbiovXHJcbnZhciBGaWxlbWFuYWdlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcXVvdGE9dGhpcy5nZXRRdW90YSgpO1xyXG5cdFx0cmV0dXJuIHticm93c2VyUmVhZHk6ZmFsc2Usbm91cGRhdGU6dHJ1ZSxcdHJlcXVlc3RRdW90YTpxdW90YSxyZW1haW46MH07XHJcblx0fSxcclxuXHRnZXRRdW90YTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBxPXRoaXMucHJvcHMucXVvdGF8fFwiMTI4TVwiO1xyXG5cdFx0dmFyIHVuaXQ9cVtxLmxlbmd0aC0xXTtcclxuXHRcdHZhciB0aW1lcz0xO1xyXG5cdFx0aWYgKHVuaXQ9PVwiTVwiKSB0aW1lcz0xMDI0KjEwMjQ7XHJcblx0XHRlbHNlIGlmICh1bml0PVwiS1wiKSB0aW1lcz0xMDI0O1xyXG5cdFx0cmV0dXJuIHBhcnNlSW50KHEpICogdGltZXM7XHJcblx0fSxcclxuXHRtaXNzaW5nS2RiOmZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtIT1cImNocm9tZVwiKSByZXR1cm4gW107XHJcblx0XHR2YXIgbWlzc2luZz10aGlzLnByb3BzLm5lZWRlZC5maWx0ZXIoZnVuY3Rpb24oa2RiKXtcclxuXHRcdFx0Zm9yICh2YXIgaSBpbiBodG1sNWZzLmZpbGVzKSB7XHJcblx0XHRcdFx0aWYgKGh0bWw1ZnMuZmlsZXNbaV1bMF09PWtkYi5maWxlbmFtZSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSx0aGlzKTtcclxuXHRcdHJldHVybiBtaXNzaW5nO1xyXG5cdH0sXHJcblx0Z2V0UmVtb3RlVXJsOmZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgZj10aGlzLnByb3BzLm5lZWRlZC5maWx0ZXIoZnVuY3Rpb24oZil7cmV0dXJuIGYuZmlsZW5hbWU9PWZufSk7XHJcblx0XHRpZiAoZi5sZW5ndGggKSByZXR1cm4gZlswXS51cmw7XHJcblx0fSxcclxuXHRnZW5GaWxlTGlzdDpmdW5jdGlvbihleGlzdGluZyxtaXNzaW5nKXtcclxuXHRcdHZhciBvdXQ9W107XHJcblx0XHRmb3IgKHZhciBpIGluIGV4aXN0aW5nKSB7XHJcblx0XHRcdHZhciB1cmw9dGhpcy5nZXRSZW1vdGVVcmwoZXhpc3RpbmdbaV1bMF0pO1xyXG5cdFx0XHRvdXQucHVzaCh7ZmlsZW5hbWU6ZXhpc3RpbmdbaV1bMF0sIHVybCA6dXJsLCByZWFkeTp0cnVlIH0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSBpbiBtaXNzaW5nKSB7XHJcblx0XHRcdG91dC5wdXNoKG1pc3NpbmdbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG91dDtcclxuXHR9LFxyXG5cdHJlbG9hZDpmdW5jdGlvbigpIHtcclxuXHRcdGh0bWw1ZnMucmVhZGRpcihmdW5jdGlvbihmaWxlcyl7XHJcbiAgXHRcdFx0dGhpcy5zZXRTdGF0ZSh7ZmlsZXM6dGhpcy5nZW5GaWxlTGlzdChmaWxlcyx0aGlzLm1pc3NpbmdLZGIoKSl9KTtcclxuICBcdFx0fSx0aGlzKTtcclxuXHQgfSxcclxuXHRkZWxldGVGaWxlOmZ1bmN0aW9uKGZuKSB7XHJcblx0ICBodG1sNWZzLnJtKGZuLGZ1bmN0aW9uKCl7XHJcblx0ICBcdHRoaXMucmVsb2FkKCk7XHJcblx0ICB9LHRoaXMpO1xyXG5cdH0sXHJcblx0b25RdW90ZU9rOmZ1bmN0aW9uKHF1b3RhLHVzYWdlKSB7XHJcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm0hPVwiY2hyb21lXCIpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIm9ucXVvdGVva1wiKTtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7bm91cGRhdGU6dHJ1ZSxtaXNzaW5nOltdLGZpbGVzOltdLGF1dG9jbG9zZTp0cnVlXHJcblx0XHRcdFx0LHF1b3RhOnF1b3RhLHJlbWFpbjpxdW90YS11c2FnZSx1c2FnZTp1c2FnZX0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKFwicXVvdGUgb2tcIik7XHJcblx0XHR2YXIgZmlsZXM9dGhpcy5nZW5GaWxlTGlzdChodG1sNWZzLmZpbGVzLHRoaXMubWlzc2luZ0tkYigpKTtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR0aGF0LmNoZWNrSWZVcGRhdGUoZmlsZXMsZnVuY3Rpb24oaGFzdXBkYXRlKSB7XHJcblx0XHRcdHZhciBtaXNzaW5nPXRoaXMubWlzc2luZ0tkYigpO1xyXG5cdFx0XHR2YXIgYXV0b2Nsb3NlPXRoaXMucHJvcHMuYXV0b2Nsb3NlO1xyXG5cdFx0XHRpZiAobWlzc2luZy5sZW5ndGgpIGF1dG9jbG9zZT1mYWxzZTtcclxuXHRcdFx0dGhhdC5zZXRTdGF0ZSh7YXV0b2Nsb3NlOmF1dG9jbG9zZSxcclxuXHRcdFx0XHRxdW90YTpxdW90YSx1c2FnZTp1c2FnZSxmaWxlczpmaWxlcyxcclxuXHRcdFx0XHRtaXNzaW5nOm1pc3NpbmcsXHJcblx0XHRcdFx0bm91cGRhdGU6IWhhc3VwZGF0ZSxcclxuXHRcdFx0XHRyZW1haW46cXVvdGEtdXNhZ2V9KTtcclxuXHRcdH0pO1xyXG5cdH0sICBcclxuXHRvbkJyb3dzZXJPazpmdW5jdGlvbigpIHtcclxuXHQgIHRoaXMudG90YWxEb3dubG9hZFNpemUoKTtcclxuXHR9LCBcclxuXHRkaXNtaXNzOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5vblJlYWR5KHRoaXMuc3RhdGUudXNhZ2UsdGhpcy5zdGF0ZS5xdW90YSk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBtb2RhbGluPSQoXCIubW9kYWwuaW5cIik7XHJcblx0XHRcdGlmIChtb2RhbGluLm1vZGFsKSBtb2RhbGluLm1vZGFsKCdoaWRlJyk7XHJcblx0XHR9LDUwMCk7XHJcblx0fSwgXHJcblx0dG90YWxEb3dubG9hZFNpemU6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZmlsZXM9dGhpcy5taXNzaW5nS2RiKCk7XHJcblx0XHR2YXIgdGFza3F1ZXVlPVtdLHRvdGFsc2l6ZT0wO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR0YXNrcXVldWUucHVzaChcclxuXHRcdFx0XHQoZnVuY3Rpb24oaWR4KXtcclxuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmICghKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSB0b3RhbHNpemUrPWRhdGE7XHJcblx0XHRcdFx0XHRcdGh0bWw1ZnMuZ2V0RG93bmxvYWRTaXplKGZpbGVzW2lkeF0udXJsLHRhc2txdWV1ZS5zaGlmdCgpKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pKGkpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHRcclxuXHRcdFx0dG90YWxzaXplKz1kYXRhO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhhdC5zZXRTdGF0ZSh7cmVxdWlyZVNwYWNlOnRvdGFsc2l6ZSxicm93c2VyUmVhZHk6dHJ1ZX0pfSwwKTtcclxuXHRcdH0pO1xyXG5cdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2hlY2tJZlVwZGF0ZTpmdW5jdGlvbihmaWxlcyxjYikge1xyXG5cdFx0dmFyIHRhc2txdWV1ZT1bXTtcclxuXHRcdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dGFza3F1ZXVlLnB1c2goXHJcblx0XHRcdFx0KGZ1bmN0aW9uKGlkeCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkgZmlsZXNbaWR4LTFdLmhhc1VwZGF0ZT1kYXRhO1xyXG5cdFx0XHRcdFx0XHRodG1sNWZzLmNoZWNrVXBkYXRlKGZpbGVzW2lkeF0udXJsLGZpbGVzW2lkeF0uZmlsZW5hbWUsdGFza3F1ZXVlLnNoaWZ0KCkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSkoaSlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcdFxyXG5cdFx0XHRmaWxlc1tmaWxlcy5sZW5ndGgtMV0uaGFzVXBkYXRlPWRhdGE7XHJcblx0XHRcdHZhciBoYXN1cGRhdGU9ZmlsZXMuc29tZShmdW5jdGlvbihmKXtyZXR1cm4gZi5oYXNVcGRhdGV9KTtcclxuXHRcdFx0aWYgKGNiKSBjYi5hcHBseSh0aGF0LFtoYXN1cGRhdGVdKTtcclxuXHRcdH0pO1xyXG5cdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xyXG5cdH0sXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCl7XHJcbiAgICBcdFx0aWYgKCF0aGlzLnN0YXRlLmJyb3dzZXJSZWFkeSkgeyAgIFxyXG4gICAgICBcdFx0XHRyZXR1cm4gRShDaGVja0Jyb3dzZXIsIHtmZWF0dXJlOiBcImZzXCIsIG9uUmVhZHk6IHRoaXMub25Ccm93c2VyT2t9KVxyXG4gICAgXHRcdH0gaWYgKCF0aGlzLnN0YXRlLnF1b3RhIHx8IHRoaXMuc3RhdGUucmVtYWluPHRoaXMuc3RhdGUucmVxdWlyZVNwYWNlKSB7ICBcclxuICAgIFx0XHRcdHZhciBxdW90YT10aGlzLnN0YXRlLnJlcXVlc3RRdW90YTtcclxuICAgIFx0XHRcdGlmICh0aGlzLnN0YXRlLnVzYWdlK3RoaXMuc3RhdGUucmVxdWlyZVNwYWNlPnF1b3RhKSB7XHJcbiAgICBcdFx0XHRcdHF1b3RhPSh0aGlzLnN0YXRlLnVzYWdlK3RoaXMuc3RhdGUucmVxdWlyZVNwYWNlKSoxLjU7XHJcbiAgICBcdFx0XHR9XHJcbiAgICAgIFx0XHRcdHJldHVybiBFKEh0bWxGUywge3F1b3RhOiBxdW90YSwgYXV0b2Nsb3NlOiBcInRydWVcIiwgb25SZWFkeTogdGhpcy5vblF1b3RlT2t9KVxyXG4gICAgICBcdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCF0aGlzLnN0YXRlLm5vdXBkYXRlIHx8IHRoaXMubWlzc2luZ0tkYigpLmxlbmd0aCB8fCAhdGhpcy5zdGF0ZS5hdXRvY2xvc2UpIHtcclxuXHRcdFx0XHR2YXIgcmVtYWluPU1hdGgucm91bmQoKHRoaXMuc3RhdGUudXNhZ2UvdGhpcy5zdGF0ZS5xdW90YSkqMTAwKTtcdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiBFKEZpbGVMaXN0LCB7YWN0aW9uOiB0aGlzLmFjdGlvbiwgZmlsZXM6IHRoaXMuc3RhdGUuZmlsZXMsIHJlbWFpblBlcmNlbnQ6IHJlbWFpbn0pXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2V0VGltZW91dCggdGhpcy5kaXNtaXNzICwwKTtcclxuXHRcdFx0XHRyZXR1cm4gRShcInNwYW5cIiwgbnVsbCwgXCJTdWNjZXNzXCIpO1xyXG5cdFx0XHR9XHJcbiAgICAgIFx0XHR9XHJcblx0fSxcclxuXHRhY3Rpb246ZnVuY3Rpb24oKSB7XHJcblx0ICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0ICB2YXIgdHlwZT1hcmdzLnNoaWZ0KCk7XHJcblx0ICB2YXIgcmVzPW51bGwsIHRoYXQ9dGhpcztcclxuXHQgIGlmICh0eXBlPT1cImRlbGV0ZVwiKSB7XHJcblx0ICAgIHRoaXMuZGVsZXRlRmlsZShhcmdzWzBdKTtcclxuXHQgIH0gIGVsc2UgaWYgKHR5cGU9PVwicmVsb2FkXCIpIHtcclxuXHQgIFx0dGhpcy5yZWxvYWQoKTtcclxuXHQgIH0gZWxzZSBpZiAodHlwZT09XCJkaXNtaXNzXCIpIHtcclxuXHQgIFx0dGhpcy5kaXNtaXNzKCk7XHJcblx0ICB9XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzPUZpbGVtYW5hZ2VyOyIsIi8qIGVtdWxhdGUgZmlsZXN5c3RlbSBvbiBodG1sNSBicm93c2VyICovXHJcbnZhciBnZXRfaGVhZD1mdW5jdGlvbih1cmwsZmllbGQsY2Ipe1xyXG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHR4aHIub3BlbihcIkhFQURcIiwgdXJsLCB0cnVlKTtcclxuXHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gdGhpcy5ET05FKSB7XHJcblx0XHRcdFx0Y2IoeGhyLmdldFJlc3BvbnNlSGVhZGVyKGZpZWxkKSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuc3RhdHVzIT09MjAwJiZ0aGlzLnN0YXR1cyE9PTIwNikge1xyXG5cdFx0XHRcdFx0Y2IoXCJcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IFxyXG5cdH07XHJcblx0eGhyLnNlbmQoKTtcdFxyXG59XHJcbnZhciBnZXRfZGF0ZT1mdW5jdGlvbih1cmwsY2IpIHtcclxuXHRnZXRfaGVhZCh1cmwsXCJMYXN0LU1vZGlmaWVkXCIsZnVuY3Rpb24odmFsdWUpe1xyXG5cdFx0Y2IodmFsdWUpO1xyXG5cdH0pO1xyXG59XHJcbnZhciBnZXRfc2l6ZT1mdW5jdGlvbih1cmwsIGNiKSB7XHJcblx0Z2V0X2hlYWQodXJsLFwiQ29udGVudC1MZW5ndGhcIixmdW5jdGlvbih2YWx1ZSl7XHJcblx0XHRjYihwYXJzZUludCh2YWx1ZSkpO1xyXG5cdH0pO1xyXG59O1xyXG52YXIgY2hlY2tVcGRhdGU9ZnVuY3Rpb24odXJsLGZuLGNiKSB7XHJcblx0aWYgKCF1cmwpIHtcclxuXHRcdGNiKGZhbHNlKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0Z2V0X2RhdGUodXJsLGZ1bmN0aW9uKGQpe1xyXG5cdFx0QVBJLmZzLnJvb3QuZ2V0RmlsZShmbiwge2NyZWF0ZTogZmFsc2UsIGV4Y2x1c2l2ZTogZmFsc2V9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcclxuXHRcdFx0ZmlsZUVudHJ5LmdldE1ldGFkYXRhKGZ1bmN0aW9uKG1ldGFkYXRhKXtcclxuXHRcdFx0XHR2YXIgbG9jYWxEYXRlPURhdGUucGFyc2UobWV0YWRhdGEubW9kaWZpY2F0aW9uVGltZSk7XHJcblx0XHRcdFx0dmFyIHVybERhdGU9RGF0ZS5wYXJzZShkKTtcclxuXHRcdFx0XHRjYih1cmxEYXRlPmxvY2FsRGF0ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxmdW5jdGlvbigpe1xyXG5cdFx0XHRjYihmYWxzZSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG52YXIgZG93bmxvYWQ9ZnVuY3Rpb24odXJsLGZuLGNiLHN0YXR1c2NiLGNvbnRleHQpIHtcclxuXHQgdmFyIHRvdGFsc2l6ZT0wLGJhdGNoZXM9bnVsbCx3cml0dGVuPTA7XHJcblx0IHZhciBmaWxlRW50cnk9MCwgZmlsZVdyaXRlcj0wO1xyXG5cdCB2YXIgY3JlYXRlQmF0Y2hlcz1mdW5jdGlvbihzaXplKSB7XHJcblx0XHR2YXIgYnl0ZXM9MTAyNCoxMDI0LCBvdXQ9W107XHJcblx0XHR2YXIgYj1NYXRoLmZsb29yKHNpemUgLyBieXRlcyk7XHJcblx0XHR2YXIgbGFzdD1zaXplICVieXRlcztcclxuXHRcdGZvciAodmFyIGk9MDtpPD1iO2krKykge1xyXG5cdFx0XHRvdXQucHVzaChpKmJ5dGVzKTtcclxuXHRcdH1cclxuXHRcdG91dC5wdXNoKGIqYnl0ZXMrbGFzdCk7XHJcblx0XHRyZXR1cm4gb3V0O1xyXG5cdCB9XHJcblx0IHZhciBmaW5pc2g9ZnVuY3Rpb24oKSB7XHJcblx0XHQgcm0oZm4sZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRmaWxlRW50cnkubW92ZVRvKGZpbGVFbnRyeS5maWxlc3lzdGVtLnJvb3QsIGZuLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBjYi5iaW5kKGNvbnRleHQsZmFsc2UpICwgMCkgOyBcclxuXHRcdFx0XHR9LGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJmYWlsZWRcIixlKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0IH0sdGhpcyk7IFxyXG5cdCB9O1xyXG5cdFx0dmFyIHRlbXBmbj1cInRlbXAua2RiXCI7XHJcblx0XHR2YXIgYmF0Y2g9ZnVuY3Rpb24oYikge1xyXG5cdFx0dmFyIGFib3J0PWZhbHNlO1xyXG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0dmFyIHJlcXVlc3R1cmw9dXJsK1wiP1wiK01hdGgucmFuZG9tKCk7XHJcblx0XHR4aHIub3BlbignZ2V0JywgcmVxdWVzdHVybCwgdHJ1ZSk7XHJcblx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignUmFuZ2UnLCAnYnl0ZXM9JytiYXRjaGVzW2JdKyctJysoYmF0Y2hlc1tiKzFdLTEpKTtcclxuXHRcdHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7ICAgIFxyXG5cdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGJsb2I9dGhpcy5yZXNwb25zZTtcclxuXHRcdFx0ZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XHJcblx0XHRcdFx0ZmlsZVdyaXRlci5zZWVrKGZpbGVXcml0ZXIubGVuZ3RoKTtcclxuXHRcdFx0XHRmaWxlV3JpdGVyLndyaXRlKGJsb2IpO1xyXG5cdFx0XHRcdHdyaXR0ZW4rPWJsb2Iuc2l6ZTtcclxuXHRcdFx0XHRmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdHVzY2IpIHtcclxuXHRcdFx0XHRcdFx0YWJvcnQ9c3RhdHVzY2IuYXBwbHkoY29udGV4dCxbIGZpbGVXcml0ZXIubGVuZ3RoIC8gdG90YWxzaXplLHRvdGFsc2l6ZSBdKTtcclxuXHRcdFx0XHRcdFx0aWYgKGFib3J0KSBzZXRUaW1lb3V0KCBjYi5iaW5kKGNvbnRleHQsZmFsc2UpICwgMCkgO1xyXG5cdFx0XHRcdCBcdH1cclxuXHRcdFx0XHRcdGIrKztcclxuXHRcdFx0XHRcdGlmICghYWJvcnQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGI8YmF0Y2hlcy5sZW5ndGgtMSkgc2V0VGltZW91dChiYXRjaC5iaW5kKGNvbnRleHQsYiksMCk7XHJcblx0XHRcdFx0XHRcdGVsc2UgICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG5cdFx0XHRcdCBcdH1cclxuXHRcdFx0IFx0fTtcclxuXHRcdFx0fSwgY29uc29sZS5lcnJvcik7XHJcblx0XHR9LGZhbHNlKTtcclxuXHRcdHhoci5zZW5kKCk7XHJcblx0fVxyXG5cclxuXHRnZXRfc2l6ZSh1cmwsZnVuY3Rpb24oc2l6ZSl7XHJcblx0XHR0b3RhbHNpemU9c2l6ZTtcclxuXHRcdGlmICghc2l6ZSkge1xyXG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7XHJcblx0XHR9IGVsc2Ugey8vcmVhZHkgdG8gZG93bmxvYWRcclxuXHRcdFx0cm0odGVtcGZuLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0IGJhdGNoZXM9Y3JlYXRlQmF0Y2hlcyhzaXplKTtcclxuXHRcdFx0XHQgaWYgKHN0YXR1c2NiKSBzdGF0dXNjYi5hcHBseShjb250ZXh0LFsgMCwgdG90YWxzaXplIF0pO1xyXG5cdFx0XHRcdCBBUEkuZnMucm9vdC5nZXRGaWxlKHRlbXBmbiwge2NyZWF0ZTogMSwgZXhjbHVzaXZlOiBmYWxzZX0sIGZ1bmN0aW9uKF9maWxlRW50cnkpIHtcclxuXHRcdFx0XHRcdFx0XHRmaWxlRW50cnk9X2ZpbGVFbnRyeTtcclxuXHRcdFx0XHRcdFx0YmF0Y2goMCk7XHJcblx0XHRcdFx0IH0pO1xyXG5cdFx0XHR9LHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG52YXIgcmVhZEZpbGU9ZnVuY3Rpb24oZmlsZW5hbWUsY2IsY29udGV4dCkge1xyXG5cdEFQSS5mcy5yb290LmdldEZpbGUoZmlsZW5hbWUsIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xyXG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHRcdFx0cmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGlmIChjYikgY2IuYXBwbHkoY2IsW3RoaXMucmVzdWx0XSk7XHJcblx0XHRcdFx0fTsgICAgICAgICAgICBcclxuXHR9LCBjb25zb2xlLmVycm9yKTtcclxufVxyXG52YXIgd3JpdGVGaWxlPWZ1bmN0aW9uKGZpbGVuYW1lLGJ1ZixjYixjb250ZXh0KXtcclxuXHRBUEkuZnMucm9vdC5nZXRGaWxlKGZpbGVuYW1lLCB7Y3JlYXRlOiB0cnVlLCBleGNsdXNpdmU6IHRydWV9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcclxuXHRcdFx0ZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XHJcblx0XHRcdFx0ZmlsZVdyaXRlci53cml0ZShidWYpO1xyXG5cdFx0XHRcdGZpbGVXcml0ZXIub253cml0ZWVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGlmIChjYikgY2IuYXBwbHkoY2IsW2J1Zi5ieXRlTGVuZ3RoXSk7XHJcblx0XHRcdFx0fTsgICAgICAgICAgICBcclxuXHRcdFx0fSwgY29uc29sZS5lcnJvcik7XHJcblx0fSwgY29uc29sZS5lcnJvcik7XHJcbn1cclxuXHJcbnZhciByZWFkZGlyPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcclxuXHR2YXIgZGlyUmVhZGVyID0gQVBJLmZzLnJvb3QuY3JlYXRlUmVhZGVyKCk7XHJcblx0dmFyIG91dD1bXSx0aGF0PXRoaXM7XHJcblx0ZGlyUmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGVudHJpZXMpIHtcclxuXHRcdGlmIChlbnRyaWVzLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgZW50cnk7IGVudHJ5ID0gZW50cmllc1tpXTsgKytpKSB7XHJcblx0XHRcdFx0aWYgKGVudHJ5LmlzRmlsZSkge1xyXG5cdFx0XHRcdFx0b3V0LnB1c2goW2VudHJ5Lm5hbWUsZW50cnkudG9VUkwgPyBlbnRyeS50b1VSTCgpIDogZW50cnkudG9VUkkoKV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0QVBJLmZpbGVzPW91dDtcclxuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbb3V0XSk7XHJcblx0fSwgZnVuY3Rpb24oKXtcclxuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbbnVsbF0pO1xyXG5cdH0pO1xyXG59XHJcbnZhciBnZXRGaWxlVVJMPWZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcblx0aWYgKCFBUEkuZmlsZXMgKSByZXR1cm4gbnVsbDtcclxuXHR2YXIgZmlsZT0gQVBJLmZpbGVzLmZpbHRlcihmdW5jdGlvbihmKXtyZXR1cm4gZlswXT09ZmlsZW5hbWV9KTtcclxuXHRpZiAoZmlsZS5sZW5ndGgpIHJldHVybiBmaWxlWzBdWzFdO1xyXG59XHJcbnZhciBybT1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XHJcblx0dmFyIHVybD1nZXRGaWxlVVJMKGZpbGVuYW1lKTtcclxuXHRpZiAodXJsKSBybVVSTCh1cmwsY2IsY29udGV4dCk7XHJcblx0ZWxzZSBpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7XHJcbn1cclxuXHJcbnZhciBybVVSTD1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XHJcblx0d2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlbmFtZSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XHJcblx0XHRmaWxlRW50cnkucmVtb3ZlKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW3RydWVdKTtcclxuXHRcdH0sIGNvbnNvbGUuZXJyb3IpO1xyXG5cdH0sICBmdW5jdGlvbihlKXtcclxuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbZmFsc2VdKTsvL25vIHN1Y2ggZmlsZVxyXG5cdH0pO1xyXG59XHJcbmZ1bmN0aW9uIGVycm9ySGFuZGxlcihlKSB7XHJcblx0Y29uc29sZS5lcnJvcignRXJyb3I6ICcgK2UubmFtZSsgXCIgXCIrZS5tZXNzYWdlKTtcclxufVxyXG52YXIgaW5pdGZzPWZ1bmN0aW9uKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KSB7XHJcblx0d2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0oUEVSU0lTVEVOVCwgZ3JhbnRlZEJ5dGVzLCAgZnVuY3Rpb24oZnMpIHtcclxuXHRcdEFQSS5mcz1mcztcclxuXHRcdEFQSS5xdW90YT1ncmFudGVkQnl0ZXM7XHJcblx0XHRyZWFkZGlyKGZ1bmN0aW9uKCl7XHJcblx0XHRcdEFQSS5pbml0aWFsaXplZD10cnVlO1xyXG5cdFx0XHRjYi5hcHBseShjb250ZXh0LFtncmFudGVkQnl0ZXMsZnNdKTtcclxuXHRcdH0sY29udGV4dCk7XHJcblx0fSwgZXJyb3JIYW5kbGVyKTtcclxufVxyXG52YXIgaW5pdD1mdW5jdGlvbihxdW90YSxjYixjb250ZXh0KSB7XHJcblx0bmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YShxdW90YSwgXHJcblx0XHRcdGZ1bmN0aW9uKGdyYW50ZWRCeXRlcykge1xyXG5cdFx0XHRcdGluaXRmcyhncmFudGVkQnl0ZXMsY2IsY29udGV4dCk7XHJcblx0XHR9LCBlcnJvckhhbmRsZXJcclxuXHQpO1xyXG59XHJcbnZhciBxdWVyeVF1b3RhPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcclxuXHR2YXIgdGhhdD10aGlzO1xyXG5cdG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZS5xdWVyeVVzYWdlQW5kUXVvdGEoIFxyXG5cdCBmdW5jdGlvbih1c2FnZSxxdW90YSl7XHJcblx0XHRcdGluaXRmcyhxdW90YSxmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW3VzYWdlLHF1b3RhXSk7XHJcblx0XHRcdH0sY29udGV4dCk7XHJcblx0fSk7XHJcbn1cclxudmFyIEFQST17XHJcblx0aW5pdDppbml0XHJcblx0LHJlYWRkaXI6cmVhZGRpclxyXG5cdCxjaGVja1VwZGF0ZTpjaGVja1VwZGF0ZVxyXG5cdCxybTpybVxyXG5cdCxybVVSTDpybVVSTFxyXG5cdCxnZXRGaWxlVVJMOmdldEZpbGVVUkxcclxuXHQsd3JpdGVGaWxlOndyaXRlRmlsZVxyXG5cdCxyZWFkRmlsZTpyZWFkRmlsZVxyXG5cdCxkb3dubG9hZDpkb3dubG9hZFxyXG5cdCxnZXRfaGVhZDpnZXRfaGVhZFxyXG5cdCxnZXRfZGF0ZTpnZXRfZGF0ZVxyXG5cdCxnZXRfc2l6ZTpnZXRfc2l6ZVxyXG5cdCxnZXREb3dubG9hZFNpemU6Z2V0X3NpemVcclxuXHQscXVlcnlRdW90YTpxdWVyeVF1b3RhXHJcbn1cclxubW9kdWxlLmV4cG9ydHM9QVBJOyIsInZhciBodG1sNWZzPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIik7XHJcbnZhciBFPVJlYWN0LmNyZWF0ZUVsZW1lbnQ7XHJcblxyXG52YXIgaHRtbGZzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHsgXHJcblx0XHRyZXR1cm4ge3JlYWR5OmZhbHNlLCBxdW90YTowLHVzYWdlOjAsSW5pdGlhbGl6ZWQ6ZmFsc2UsYXV0b2Nsb3NlOnRoaXMucHJvcHMuYXV0b2Nsb3NlfTtcclxuXHR9LFxyXG5cdGluaXRGaWxlc3lzdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHF1b3RhPXRoaXMucHJvcHMucXVvdGF8fDEwMjQqMTAyNCoxMjg7IC8vIGRlZmF1bHQgMTI4TUJcclxuXHRcdHF1b3RhPXBhcnNlSW50KHF1b3RhKTtcclxuXHRcdGh0bWw1ZnMuaW5pdChxdW90YSxmdW5jdGlvbihxKXtcclxuXHRcdFx0dGhpcy5kaWFsb2c9ZmFsc2U7XHJcblx0XHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtxdW90YTpxLGF1dG9jbG9zZTp0cnVlfSk7XHJcblx0XHR9LHRoaXMpO1xyXG5cdH0sXHJcblx0d2VsY29tZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRFKFwiZGl2XCIsIHtyZWY6IFwiZGlhbG9nMVwiLCBjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwiLCBpZDogXCJteU1vZGFsXCIsIFwiZGF0YS1iYWNrZHJvcFwiOiBcInN0YXRpY1wifSwgXHJcblx0XHQgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXHJcblx0XHQgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxyXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIldlbGNvbWVcIilcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcclxuXHRcdCAgICAgICAgICBcIkJyb3dzZXIgd2lsbCBhc2sgZm9yIHlvdXIgY29uZmlybWF0aW9uLlwiXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmluaXRGaWxlc3lzdGVtLCB0eXBlOiBcImJ1dHRvblwiLCBcclxuXHRcdCAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIn0sIFwiSW5pdGlhbGl6ZSBGaWxlIFN5c3RlbVwiKVxyXG5cdFx0ICAgICAgICApXHJcblx0XHQgICAgICApXHJcblx0XHQgICAgKVxyXG5cdFx0ICApXHJcblx0XHQgKTtcclxuXHR9LFxyXG5cdHJlbmRlckRlZmF1bHQ6ZnVuY3Rpb24oKXtcclxuXHRcdHZhciB1c2VkPU1hdGguZmxvb3IodGhpcy5zdGF0ZS51c2FnZS90aGlzLnN0YXRlLnF1b3RhICoxMDApO1xyXG5cdFx0dmFyIG1vcmU9ZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh1c2VkPjUwKSByZXR1cm4gRShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJBbGxvY2F0ZSBNb3JlXCIpO1xyXG5cdFx0XHRlbHNlIG51bGw7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgaWQ6IFwibXlNb2RhbFwiLCBcImRhdGEtYmFja2Ryb3BcIjogXCJzdGF0aWNcIn0sIFxyXG5cdFx0ICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxyXG5cdFx0ICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJTYW5kYm94IEZpbGUgU3lzdGVtXCIpXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXHJcblx0XHQgICAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzXCJ9LCBcclxuXHRcdCAgICAgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXJcIiwgcm9sZTogXCJwcm9ncmVzc2JhclwiLCBzdHlsZToge3dpZHRoOiB1c2VkK1wiJVwifX0sIFxyXG5cdFx0ICAgICAgICAgICAgICAgdXNlZCwgXCIlXCJcclxuXHRcdCAgICAgICAgICAgIClcclxuXHRcdCAgICAgICAgICApLCBcclxuXHRcdCAgICAgICAgICBFKFwic3BhblwiLCBudWxsLCB0aGlzLnN0YXRlLnF1b3RhLCBcIiB0b3RhbCAsIFwiLCB0aGlzLnN0YXRlLnVzYWdlLCBcIiBpbiB1c2VkXCIpXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmRpc21pc3MsIHR5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHRcIiwgXCJkYXRhLWRpc21pc3NcIjogXCJtb2RhbFwifSwgXCJDbG9zZVwiKSwgXHJcblx0XHQgICAgICAgICAgbW9yZSgpXHJcblx0XHQgICAgICAgIClcclxuXHRcdCAgICAgIClcclxuXHRcdCAgICApXHJcblx0XHQgIClcclxuXHRcdCAgKTtcclxuXHR9LFxyXG5cdGRpc21pc3M6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGF0LnByb3BzLm9uUmVhZHkodGhhdC5zdGF0ZS5xdW90YSx0aGF0LnN0YXRlLnVzYWdlKTtcdFxyXG5cdFx0fSwwKTtcclxuXHR9LFxyXG5cdHF1ZXJ5UXVvdGE6ZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiY2hyb21lXCIpIHtcclxuXHRcdFx0aHRtbDVmcy5xdWVyeVF1b3RhKGZ1bmN0aW9uKHVzYWdlLHF1b3RhKXtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHt1c2FnZTp1c2FnZSxxdW90YTpxdW90YSxpbml0aWFsaXplZDp0cnVlfSk7XHJcblx0XHRcdH0sdGhpcyk7XHRcdFx0XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHt1c2FnZTozMzMscXVvdGE6MTAwMCoxMDAwKjEwMjQsaW5pdGlhbGl6ZWQ6dHJ1ZSxhdXRvY2xvc2U6dHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5xdW90YSB8fCB0aGlzLnN0YXRlLnF1b3RhPHRoaXMucHJvcHMucXVvdGEpIHtcclxuXHRcdFx0aWYgKHRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQpIHtcclxuXHRcdFx0XHR0aGlzLmRpYWxvZz10cnVlO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLndlbGNvbWUoKTtcdFxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcImNoZWNraW5nIHF1b3RhXCIpO1xyXG5cdFx0XHR9XHRcdFx0XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUuYXV0b2Nsb3NlKSB7XHJcblx0XHRcdFx0dGhpcy5kaWFsb2c9dHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJEZWZhdWx0KCk7IFxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZGlzbWlzcygpO1xyXG5cdFx0XHR0aGlzLmRpYWxvZz1mYWxzZTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5xdW90YSkge1xyXG5cdFx0XHR0aGlzLnF1ZXJ5UXVvdGEoKTtcclxuXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuZGlhbG9nKSAkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHM9aHRtbGZzOyIsInZhciBrc2FuYT17XCJwbGF0Zm9ybVwiOlwicmVtb3RlXCJ9O1xyXG5pZiAodHlwZW9mIHdpbmRvdyE9XCJ1bmRlZmluZWRcIikge1xyXG5cdHdpbmRvdy5rc2FuYT1rc2FuYTtcclxuXHRpZiAodHlwZW9mIGtzYW5hZ2FwPT1cInVuZGVmaW5lZFwiKSB7XHJcblx0XHR3aW5kb3cua3NhbmFnYXA9cmVxdWlyZShcIi4va3NhbmFnYXBcIik7IC8vY29tcGF0aWJsZSBsYXllciB3aXRoIG1vYmlsZVxyXG5cdH1cclxufVxyXG5pZiAodHlwZW9mIHByb2Nlc3MgIT1cInVuZGVmaW5lZFwiKSB7XHJcblx0aWYgKHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9uc1tcIm5vZGUtd2Via2l0XCJdKSB7XHJcbiAgXHRcdGlmICh0eXBlb2Ygbm9kZVJlcXVpcmUhPVwidW5kZWZpbmVkXCIpIGtzYW5hLnJlcXVpcmU9bm9kZVJlcXVpcmU7XHJcbiAgXHRcdGtzYW5hLnBsYXRmb3JtPVwibm9kZS13ZWJraXRcIjtcclxuICBcdFx0d2luZG93LmtzYW5hZ2FwLnBsYXRmb3JtPVwibm9kZS13ZWJraXRcIjtcclxuXHRcdHZhciBrc2FuYWpzPXJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoXCJrc2FuYS5qc1wiLFwidXRmOFwiKS50cmltKCk7XHJcblx0XHRrc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcclxuXHRcdHdpbmRvdy5rZnM9cmVxdWlyZShcIi4va2ZzXCIpO1xyXG4gIFx0fVxyXG59IGVsc2UgaWYgKHR5cGVvZiBjaHJvbWUhPVwidW5kZWZpbmVkXCIpey8vfSAmJiBjaHJvbWUuZmlsZVN5c3RlbSl7XHJcbi8vXHR3aW5kb3cua3NhbmFnYXA9cmVxdWlyZShcIi4va3NhbmFnYXBcIik7IC8vY29tcGF0aWJsZSBsYXllciB3aXRoIG1vYmlsZVxyXG5cdHdpbmRvdy5rc2FuYWdhcC5wbGF0Zm9ybT1cImNocm9tZVwiO1xyXG5cdHdpbmRvdy5rZnM9cmVxdWlyZShcIi4va2ZzX2h0bWw1XCIpO1xyXG5cdHJlcXVpcmUoXCIuL2xpdmVyZWxvYWRcIikoKTtcclxuXHRrc2FuYS5wbGF0Zm9ybT1cImNocm9tZVwiO1xyXG59IGVsc2Uge1xyXG5cdGlmICh0eXBlb2Yga3NhbmFnYXAhPVwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGZzIT1cInVuZGVmaW5lZFwiKSB7Ly9tb2JpbGVcclxuXHRcdHZhciBrc2FuYWpzPWZzLnJlYWRGaWxlU3luYyhcImtzYW5hLmpzXCIsXCJ1dGY4XCIpLnRyaW0oKTsgLy9hbmRyb2lkIGV4dHJhIFxcbiBhdCB0aGUgZW5kXHJcblx0XHRrc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcclxuXHRcdGtzYW5hLnBsYXRmb3JtPWtzYW5hZ2FwLnBsYXRmb3JtO1xyXG5cdFx0aWYgKHR5cGVvZiBrc2FuYWdhcC5hbmRyb2lkICE9XCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRrc2FuYS5wbGF0Zm9ybT1cImFuZHJvaWRcIjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxudmFyIHRpbWVyPW51bGw7XHJcbnZhciBib290PWZ1bmN0aW9uKGFwcElkLGNiKSB7XHJcblx0a3NhbmEuYXBwSWQ9YXBwSWQ7XHJcblx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImNocm9tZVwiKSB7IC8vbmVlZCB0byB3YWl0IGZvciBqc29ucCBrc2FuYS5qc1xyXG5cdFx0dGltZXI9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKGtzYW5hLnJlYWR5KXtcclxuXHRcdFx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcclxuXHRcdFx0XHRpZiAoa3NhbmEuanMgJiYga3NhbmEuanMuZmlsZXMgJiYga3NhbmEuanMuZmlsZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9pbnN0YWxsa2RiXCIpKGtzYW5hLmpzLGNiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2IoKTtcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LDMwMCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNiKCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cz17Ym9vdDpib290XHJcblx0LGh0bWxmczpyZXF1aXJlKFwiLi9odG1sZnNcIilcclxuXHQsaHRtbDVmczpyZXF1aXJlKFwiLi9odG1sNWZzXCIpXHJcblx0LGxpdmV1cGRhdGU6cmVxdWlyZShcIi4vbGl2ZXVwZGF0ZVwiKVxyXG5cdCxmaWxlaW5zdGFsbGVyOnJlcXVpcmUoXCIuL2ZpbGVpbnN0YWxsZXJcIilcclxuXHQsZG93bmxvYWRlcjpyZXF1aXJlKFwiLi9kb3dubG9hZGVyXCIpXHJcblx0LGluc3RhbGxrZGI6cmVxdWlyZShcIi4vaW5zdGFsbGtkYlwiKVxyXG59OyIsInZhciBGaWxlaW5zdGFsbGVyPXJlcXVpcmUoXCIuL2ZpbGVpbnN0YWxsZXJcIik7XHJcblxyXG52YXIgZ2V0UmVxdWlyZV9rZGI9ZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVxdWlyZWQ9W107XHJcbiAgICBrc2FuYS5qcy5maWxlcy5tYXAoZnVuY3Rpb24oZil7XHJcbiAgICAgIGlmIChmLmluZGV4T2YoXCIua2RiXCIpPT1mLmxlbmd0aC00KSB7XHJcbiAgICAgICAgdmFyIHNsYXNoPWYubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgIGlmIChzbGFzaD4tMSkge1xyXG4gICAgICAgICAgdmFyIGRiaWQ9Zi5zdWJzdHJpbmcoc2xhc2grMSxmLmxlbmd0aC00KTtcclxuICAgICAgICAgIHJlcXVpcmVkLnB1c2goe3VybDpmLGRiaWQ6ZGJpZCxmaWxlbmFtZTpkYmlkK1wiLmtkYlwifSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBkYmlkPWYuc3Vic3RyaW5nKDAsZi5sZW5ndGgtNCk7XHJcbiAgICAgICAgICByZXF1aXJlZC5wdXNoKHt1cmw6a3NhbmEuanMuYmFzZXVybCtmLGRiaWQ6ZGJpZCxmaWxlbmFtZTpmfSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcXVpcmVkO1xyXG59XHJcbnZhciBjYWxsYmFjaz1udWxsO1xyXG52YXIgb25SZWFkeT1mdW5jdGlvbigpIHtcclxuXHRjYWxsYmFjaygpO1xyXG59XHJcbnZhciBvcGVuRmlsZWluc3RhbGxlcj1mdW5jdGlvbihrZWVwKSB7XHJcblx0dmFyIHJlcXVpcmVfa2RiPWdldFJlcXVpcmVfa2RiKCkubWFwKGZ1bmN0aW9uKGRiKXtcclxuXHQgIHJldHVybiB7XHJcblx0ICAgIHVybDp3aW5kb3cubG9jYXRpb24ub3JpZ2luK3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZStkYi5kYmlkK1wiLmtkYlwiLFxyXG5cdCAgICBkYmRiOmRiLmRiaWQsXHJcblx0ICAgIGZpbGVuYW1lOmRiLmZpbGVuYW1lXHJcblx0ICB9XHJcblx0fSlcclxuXHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlaW5zdGFsbGVyLCB7cXVvdGE6IFwiNTEyTVwiLCBhdXRvY2xvc2U6ICFrZWVwLCBuZWVkZWQ6IHJlcXVpcmVfa2RiLCBcclxuXHQgICAgICAgICAgICAgICAgIG9uUmVhZHk6IG9uUmVhZHl9KTtcclxufVxyXG52YXIgaW5zdGFsbGtkYj1mdW5jdGlvbihrc2FuYWpzLGNiLGNvbnRleHQpIHtcclxuXHRjb25zb2xlLmxvZyhrc2FuYWpzLmZpbGVzKTtcclxuXHRSZWFjdC5yZW5kZXIob3BlbkZpbGVpbnN0YWxsZXIoKSxkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xyXG5cdGNhbGxiYWNrPWNiO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzPWluc3RhbGxrZGI7IiwiLy9TaW11bGF0ZSBmZWF0dXJlIGluIGtzYW5hZ2FwXHJcbi8qIFxyXG4gIHJ1bnMgb24gbm9kZS13ZWJraXQgb25seVxyXG4qL1xyXG5cclxudmFyIHJlYWREaXI9ZnVuY3Rpb24ocGF0aCkgeyAvL3NpbXVsYXRlIEtzYW5hZ2FwIGZ1bmN0aW9uXHJcblx0dmFyIGZzPW5vZGVSZXF1aXJlKFwiZnNcIik7XHJcblx0cGF0aD1wYXRofHxcIi4uXCI7XHJcblx0dmFyIGRpcnM9W107XHJcblx0aWYgKHBhdGhbMF09PVwiLlwiKSB7XHJcblx0XHRpZiAocGF0aD09XCIuXCIpIGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuXCIpO1xyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuLlwiKTtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0ZGlycz1mcy5yZWFkZGlyU3luYyhwYXRoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBkaXJzLmpvaW4oXCJcXHVmZmZmXCIpO1xyXG59XHJcbnZhciBsaXN0QXBwcz1mdW5jdGlvbigpIHtcclxuXHR2YXIgZnM9bm9kZVJlcXVpcmUoXCJmc1wiKTtcclxuXHR2YXIga3NhbmFqc2ZpbGU9ZnVuY3Rpb24oZCkge3JldHVybiBcIi4uL1wiK2QrXCIva3NhbmEuanNcIn07XHJcblx0dmFyIGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuLlwiKS5maWx0ZXIoZnVuY3Rpb24oZCl7XHJcblx0XHRcdFx0cmV0dXJuIGZzLnN0YXRTeW5jKFwiLi4vXCIrZCkuaXNEaXJlY3RvcnkoKSAmJiBkWzBdIT1cIi5cIlxyXG5cdFx0XHRcdCAgICYmIGZzLmV4aXN0c1N5bmMoa3NhbmFqc2ZpbGUoZCkpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdHZhciBvdXQ9ZGlycy5tYXAoZnVuY3Rpb24oZCl7XHJcblx0XHR2YXIgY29udGVudD1mcy5yZWFkRmlsZVN5bmMoa3NhbmFqc2ZpbGUoZCksXCJ1dGY4XCIpO1xyXG4gIFx0Y29udGVudD1jb250ZW50LnJlcGxhY2UoXCJ9KVwiLFwifVwiKTtcclxuICBcdGNvbnRlbnQ9Y29udGVudC5yZXBsYWNlKFwianNvbnBfaGFuZGxlcihcIixcIlwiKTtcclxuXHRcdHZhciBvYmo9IEpTT04ucGFyc2UoY29udGVudCk7XHJcblx0XHRvYmouZGJpZD1kO1xyXG5cdFx0b2JqLnBhdGg9ZDtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSlcclxuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkob3V0KTtcclxufVxyXG5cclxuXHJcblxyXG52YXIga2ZzPXtyZWFkRGlyOnJlYWREaXIsbGlzdEFwcHM6bGlzdEFwcHN9O1xyXG5cclxubW9kdWxlLmV4cG9ydHM9a2ZzOyIsInZhciByZWFkRGlyPWZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIFtdO1xyXG59XHJcbnZhciBsaXN0QXBwcz1mdW5jdGlvbigpe1xyXG5cdHJldHVybiBbXTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cz17cmVhZERpcjpyZWFkRGlyLGxpc3RBcHBzOmxpc3RBcHBzfTsiLCJ2YXIgYXBwbmFtZT1cImluc3RhbGxlclwiO1xyXG52YXIgc3dpdGNoQXBwPWZ1bmN0aW9uKHBhdGgpIHtcclxuXHR2YXIgZnM9cmVxdWlyZShcImZzXCIpO1xyXG5cdHBhdGg9XCIuLi9cIitwYXRoO1xyXG5cdGFwcG5hbWU9cGF0aDtcclxuXHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmPSBwYXRoK1wiL2luZGV4Lmh0bWxcIjsgXHJcblx0cHJvY2Vzcy5jaGRpcihwYXRoKTtcclxufVxyXG52YXIgZG93bmxvYWRlcj17fTtcclxudmFyIHJvb3RQYXRoPVwiXCI7XHJcblxyXG52YXIgZGVsZXRlQXBwPWZ1bmN0aW9uKGFwcCkge1xyXG5cdGNvbnNvbGUuZXJyb3IoXCJub3QgYWxsb3cgb24gUEMsIGRvIGl0IGluIEZpbGUgRXhwbG9yZXIvIEZpbmRlclwiKTtcclxufVxyXG52YXIgdXNlcm5hbWU9ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxudmFyIHVzZXJlbWFpbD1mdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gXCJcIlxyXG59XHJcbnZhciBydW50aW1lX3ZlcnNpb249ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIFwiMS40XCI7XHJcbn1cclxuXHJcbi8vY29weSBmcm9tIGxpdmV1cGRhdGVcclxudmFyIGpzb25wPWZ1bmN0aW9uKHVybCxkYmlkLGNhbGxiYWNrLGNvbnRleHQpIHtcclxuICB2YXIgc2NyaXB0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNvbnAyXCIpO1xyXG4gIGlmIChzY3JpcHQpIHtcclxuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcbiAgfVxyXG4gIHdpbmRvdy5qc29ucF9oYW5kbGVyPWZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIGlmICh0eXBlb2YgZGF0YT09XCJvYmplY3RcIikge1xyXG4gICAgICBkYXRhLmRiaWQ9ZGJpZDtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbZGF0YV0pOyAgICBcclxuICAgIH0gIFxyXG4gIH1cclxuICB3aW5kb3cuanNvbnBfZXJyb3JfaGFuZGxlcj1mdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJ1cmwgdW5yZWFjaGFibGVcIix1cmwpO1xyXG4gICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbbnVsbF0pO1xyXG4gIH1cclxuICBzY3JpcHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnaWQnLCBcImpzb25wMlwiKTtcclxuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdvbmVycm9yJywgXCJqc29ucF9lcnJvcl9oYW5kbGVyKClcIik7XHJcbiAgdXJsPXVybCsnPycrKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTsgXHJcbn1cclxuXHJcbnZhciBrc2FuYWdhcD17XHJcblx0cGxhdGZvcm06XCJub2RlLXdlYmtpdFwiLFxyXG5cdHN0YXJ0RG93bmxvYWQ6ZG93bmxvYWRlci5zdGFydERvd25sb2FkLFxyXG5cdGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZXIuZG93bmxvYWRlZEJ5dGUsXHJcblx0ZG93bmxvYWRpbmdGaWxlOmRvd25sb2FkZXIuZG93bmxvYWRpbmdGaWxlLFxyXG5cdGNhbmNlbERvd25sb2FkOmRvd25sb2FkZXIuY2FuY2VsRG93bmxvYWQsXHJcblx0ZG9uZURvd25sb2FkOmRvd25sb2FkZXIuZG9uZURvd25sb2FkLFxyXG5cdHN3aXRjaEFwcDpzd2l0Y2hBcHAsXHJcblx0cm9vdFBhdGg6cm9vdFBhdGgsXHJcblx0ZGVsZXRlQXBwOiBkZWxldGVBcHAsXHJcblx0dXNlcm5hbWU6dXNlcm5hbWUsIC8vbm90IHN1cHBvcnQgb24gUENcclxuXHR1c2VyZW1haWw6dXNlcm5hbWUsXHJcblx0cnVudGltZV92ZXJzaW9uOnJ1bnRpbWVfdmVyc2lvbixcclxuXHRcclxufVxyXG5cclxuaWYgKHR5cGVvZiBwcm9jZXNzIT1cInVuZGVmaW5lZFwiKSB7XHJcblx0dmFyIGtzYW5hanM9cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhcIi4va3NhbmEuanNcIixcInV0ZjhcIikudHJpbSgpO1xyXG5cdGRvd25sb2FkZXI9cmVxdWlyZShcIi4vZG93bmxvYWRlclwiKTtcclxuXHRjb25zb2xlLmxvZyhrc2FuYWpzKTtcclxuXHQvL2tzYW5hLmpzPUpTT04ucGFyc2Uoa3NhbmFqcy5zdWJzdHJpbmcoMTQsa3NhbmFqcy5sZW5ndGgtMSkpO1xyXG5cdHJvb3RQYXRoPXByb2Nlc3MuY3dkKCk7XHJcblx0cm9vdFBhdGg9cmVxdWlyZShcInBhdGhcIikucmVzb2x2ZShyb290UGF0aCxcIi4uXCIpLnJlcGxhY2UoL1xcXFwvZyxcIi9cIikrJy8nO1xyXG5cdGtzYW5hLnJlYWR5PXRydWU7XHJcbn0gZWxzZXtcclxuXHR2YXIgdXJsPXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoXCJpbmRleC5odG1sXCIsXCJcIikrXCJrc2FuYS5qc1wiO1xyXG5cdGpzb25wKHVybCxhcHBuYW1lLGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0a3NhbmEuanM9ZGF0YTtcclxuXHRcdGtzYW5hLnJlYWR5PXRydWU7XHJcblx0fSk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHM9a3NhbmFnYXA7IiwidmFyIHN0YXJ0ZWQ9ZmFsc2U7XHJcbnZhciB0aW1lcj1udWxsO1xyXG52YXIgYnVuZGxlZGF0ZT1udWxsO1xyXG52YXIgZ2V0X2RhdGU9cmVxdWlyZShcIi4vaHRtbDVmc1wiKS5nZXRfZGF0ZTtcclxudmFyIGNoZWNrSWZCdW5kbGVVcGRhdGVkPWZ1bmN0aW9uKCkge1xyXG5cdGdldF9kYXRlKFwiYnVuZGxlLmpzXCIsZnVuY3Rpb24oZGF0ZSl7XHJcblx0XHRpZiAoYnVuZGxlZGF0ZSAmJmJ1bmRsZWRhdGUhPWRhdGUpe1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdH1cclxuXHRcdGJ1bmRsZWRhdGU9ZGF0ZTtcclxuXHR9KTtcclxufVxyXG52YXIgbGl2ZXJlbG9hZD1mdW5jdGlvbigpIHtcclxuXHRpZiAoc3RhcnRlZCkgcmV0dXJuO1xyXG5cclxuXHR0aW1lcjE9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdGNoZWNrSWZCdW5kbGVVcGRhdGVkKCk7XHJcblx0fSwyMDAwKTtcclxuXHRzdGFydGVkPXRydWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzPWxpdmVyZWxvYWQ7IiwiXHJcbnZhciBqc29ucD1mdW5jdGlvbih1cmwsZGJpZCxjYWxsYmFjayxjb250ZXh0KSB7XHJcbiAgdmFyIHNjcmlwdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzb25wXCIpO1xyXG4gIGlmIChzY3JpcHQpIHtcclxuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcbiAgfVxyXG4gIHdpbmRvdy5qc29ucF9oYW5kbGVyPWZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJyZWNlaXZlIGZyb20ga3NhbmEuanNcIixkYXRhKTtcclxuICAgIGlmICh0eXBlb2YgZGF0YT09XCJvYmplY3RcIikge1xyXG4gICAgICBpZiAodHlwZW9mIGRhdGEuZGJpZD09XCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGRhdGEuZGJpZD1kYmlkO1xyXG4gICAgICB9XHJcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW2RhdGFdKTtcclxuICAgIH0gIFxyXG4gIH1cclxuXHJcbiAgd2luZG93Lmpzb25wX2Vycm9yX2hhbmRsZXI9ZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwidXJsIHVucmVhY2hhYmxlXCIsdXJsKTtcclxuICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW251bGxdKTtcclxuICB9XHJcblxyXG4gIHNjcmlwdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdpZCcsIFwianNvbnBcIik7XHJcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnb25lcnJvcicsIFwianNvbnBfZXJyb3JfaGFuZGxlcigpXCIpO1xyXG4gIHVybD11cmwrJz8nKyhuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7IFxyXG59XHJcbnZhciBydW50aW1lX3ZlcnNpb25fb2s9ZnVuY3Rpb24obWlucnVudGltZSkge1xyXG4gIGlmICghbWlucnVudGltZSkgcmV0dXJuIHRydWU7Ly9ub3QgbWVudGlvbmVkLlxyXG4gIHZhciBtaW49cGFyc2VGbG9hdChtaW5ydW50aW1lKTtcclxuICB2YXIgcnVudGltZT1wYXJzZUZsb2F0KCBrc2FuYWdhcC5ydW50aW1lX3ZlcnNpb24oKXx8XCIxLjBcIik7XHJcbiAgaWYgKG1pbj5ydW50aW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbnZhciBuZWVkVG9VcGRhdGU9ZnVuY3Rpb24oZnJvbWpzb24sdG9qc29uKSB7XHJcbiAgdmFyIG5lZWRVcGRhdGVzPVtdO1xyXG4gIGZvciAodmFyIGk9MDtpPGZyb21qc29uLmxlbmd0aDtpKyspIHsgXHJcbiAgICB2YXIgdG89dG9qc29uW2ldO1xyXG4gICAgdmFyIGZyb209ZnJvbWpzb25baV07XHJcbiAgICB2YXIgbmV3ZmlsZXM9W10sbmV3ZmlsZXNpemVzPVtdLHJlbW92ZWQ9W107XHJcbiAgICBcclxuICAgIGlmICghdG8pIGNvbnRpbnVlOyAvL2Nhbm5vdCByZWFjaCBob3N0XHJcbiAgICBpZiAoIXJ1bnRpbWVfdmVyc2lvbl9vayh0by5taW5ydW50aW1lKSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJydW50aW1lIHRvbyBvbGQsIG5lZWQgXCIrdG8ubWlucnVudGltZSk7XHJcbiAgICAgIGNvbnRpbnVlOyBcclxuICAgIH1cclxuICAgIGlmICghZnJvbS5maWxlZGF0ZXMpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwibWlzc2luZyBmaWxlZGF0ZXMgaW4ga3NhbmEuanMgb2YgXCIrZnJvbS5kYmlkKTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBmcm9tLmZpbGVkYXRlcy5tYXAoZnVuY3Rpb24oZixpZHgpe1xyXG4gICAgICB2YXIgbmV3aWR4PXRvLmZpbGVzLmluZGV4T2YoIGZyb20uZmlsZXNbaWR4XSk7XHJcbiAgICAgIGlmIChuZXdpZHg9PS0xKSB7XHJcbiAgICAgICAgLy9maWxlIHJlbW92ZWQgaW4gbmV3IHZlcnNpb25cclxuICAgICAgICByZW1vdmVkLnB1c2goZnJvbS5maWxlc1tpZHhdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgZnJvbWRhdGU9RGF0ZS5wYXJzZShmKTtcclxuICAgICAgICB2YXIgdG9kYXRlPURhdGUucGFyc2UodG8uZmlsZWRhdGVzW25ld2lkeF0pO1xyXG4gICAgICAgIGlmIChmcm9tZGF0ZTx0b2RhdGUpIHtcclxuICAgICAgICAgIG5ld2ZpbGVzLnB1c2goIHRvLmZpbGVzW25ld2lkeF0gKTtcclxuICAgICAgICAgIG5ld2ZpbGVzaXplcy5wdXNoKHRvLmZpbGVzaXplc1tuZXdpZHhdKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAobmV3ZmlsZXMubGVuZ3RoKSB7XHJcbiAgICAgIGZyb20ubmV3ZmlsZXM9bmV3ZmlsZXM7XHJcbiAgICAgIGZyb20ubmV3ZmlsZXNpemVzPW5ld2ZpbGVzaXplcztcclxuICAgICAgZnJvbS5yZW1vdmVkPXJlbW92ZWQ7XHJcbiAgICAgIG5lZWRVcGRhdGVzLnB1c2goZnJvbSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBuZWVkVXBkYXRlcztcclxufVxyXG52YXIgZ2V0VXBkYXRhYmxlcz1mdW5jdGlvbihhcHBzLGNiLGNvbnRleHQpIHtcclxuICBnZXRSZW1vdGVKc29uKGFwcHMsZnVuY3Rpb24oanNvbnMpe1xyXG4gICAgdmFyIGhhc1VwZGF0ZXM9bmVlZFRvVXBkYXRlKGFwcHMsanNvbnMpO1xyXG4gICAgY2IuYXBwbHkoY29udGV4dCxbaGFzVXBkYXRlc10pO1xyXG4gIH0sY29udGV4dCk7XHJcbn1cclxudmFyIGdldFJlbW90ZUpzb249ZnVuY3Rpb24oYXBwcyxjYixjb250ZXh0KSB7XHJcbiAgdmFyIHRhc2txdWV1ZT1bXSxvdXRwdXQ9W107XHJcbiAgdmFyIG1ha2VjYj1mdW5jdGlvbihhcHApe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIGlmICghKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSBvdXRwdXQucHVzaChkYXRhKTtcclxuICAgICAgICBpZiAoIWFwcC5iYXNldXJsKSB7XHJcbiAgICAgICAgICB0YXNrcXVldWUuc2hpZnQoe19fZW1wdHk6dHJ1ZX0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgdXJsPWFwcC5iYXNldXJsK1wiL2tzYW5hLmpzXCI7ICAgIFxyXG4gICAgICAgICAgY29uc29sZS5sb2codXJsKTtcclxuICAgICAgICAgIGpzb25wKCB1cmwgLGFwcC5kYmlkLHRhc2txdWV1ZS5zaGlmdCgpLCBjb250ZXh0KTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxuICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKXt0YXNrcXVldWUucHVzaChtYWtlY2IoYXBwKSl9KTtcclxuXHJcbiAgdGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHJcbiAgICBvdXRwdXQucHVzaChkYXRhKTtcclxuICAgIGNiLmFwcGx5KGNvbnRleHQsW291dHB1dF0pO1xyXG4gIH0pO1xyXG5cclxuICB0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7IC8vcnVuIHRoZSB0YXNrXHJcbn1cclxudmFyIGh1bWFuRmlsZVNpemU9ZnVuY3Rpb24oYnl0ZXMsIHNpKSB7XHJcbiAgICB2YXIgdGhyZXNoID0gc2kgPyAxMDAwIDogMTAyNDtcclxuICAgIGlmKGJ5dGVzIDwgdGhyZXNoKSByZXR1cm4gYnl0ZXMgKyAnIEInO1xyXG4gICAgdmFyIHVuaXRzID0gc2kgPyBbJ2tCJywnTUInLCdHQicsJ1RCJywnUEInLCdFQicsJ1pCJywnWUInXSA6IFsnS2lCJywnTWlCJywnR2lCJywnVGlCJywnUGlCJywnRWlCJywnWmlCJywnWWlCJ107XHJcbiAgICB2YXIgdSA9IC0xO1xyXG4gICAgZG8ge1xyXG4gICAgICAgIGJ5dGVzIC89IHRocmVzaDtcclxuICAgICAgICArK3U7XHJcbiAgICB9IHdoaWxlKGJ5dGVzID49IHRocmVzaCk7XHJcbiAgICByZXR1cm4gYnl0ZXMudG9GaXhlZCgxKSsnICcrdW5pdHNbdV07XHJcbn07XHJcblxyXG52YXIgc3RhcnQ9ZnVuY3Rpb24oa3NhbmFqcyxjYixjb250ZXh0KXtcclxuICB2YXIgZmlsZXM9a3NhbmFqcy5uZXdmaWxlc3x8a3NhbmFqcy5maWxlcztcclxuICB2YXIgYmFzZXVybD1rc2FuYWpzLmJhc2V1cmx8fCBcImh0dHA6Ly8xMjcuMC4wLjE6ODA4MC9cIitrc2FuYWpzLmRiaWQrXCIvXCI7XHJcbiAgdmFyIHN0YXJ0ZWQ9a3NhbmFnYXAuc3RhcnREb3dubG9hZChrc2FuYWpzLmRiaWQsYmFzZXVybCxmaWxlcy5qb2luKFwiXFx1ZmZmZlwiKSk7XHJcbiAgY2IuYXBwbHkoY29udGV4dCxbc3RhcnRlZF0pO1xyXG59XHJcbnZhciBzdGF0dXM9ZnVuY3Rpb24oKXtcclxuICB2YXIgbmZpbGU9a3NhbmFnYXAuZG93bmxvYWRpbmdGaWxlKCk7XHJcbiAgdmFyIGRvd25sb2FkZWRCeXRlPWtzYW5hZ2FwLmRvd25sb2FkZWRCeXRlKCk7XHJcbiAgdmFyIGRvbmU9a3NhbmFnYXAuZG9uZURvd25sb2FkKCk7XHJcbiAgcmV0dXJuIHtuZmlsZTpuZmlsZSxkb3dubG9hZGVkQnl0ZTpkb3dubG9hZGVkQnl0ZSwgZG9uZTpkb25lfTtcclxufVxyXG5cclxudmFyIGNhbmNlbD1mdW5jdGlvbigpe1xyXG4gIHJldHVybiBrc2FuYWdhcC5jYW5jZWxEb3dubG9hZCgpO1xyXG59XHJcblxyXG52YXIgbGl2ZXVwZGF0ZT17IGh1bWFuRmlsZVNpemU6IGh1bWFuRmlsZVNpemUsIFxyXG4gIG5lZWRUb1VwZGF0ZTogbmVlZFRvVXBkYXRlICwganNvbnA6anNvbnAsIFxyXG4gIGdldFVwZGF0YWJsZXM6Z2V0VXBkYXRhYmxlcyxcclxuICBzdGFydDpzdGFydCxcclxuICBjYW5jZWw6Y2FuY2VsLFxyXG4gIHN0YXR1czpzdGF0dXNcclxuICB9O1xyXG5tb2R1bGUuZXhwb3J0cz1saXZldXBkYXRlOyIsImZ1bmN0aW9uIG1rZGlyUCAocCwgbW9kZSwgZiwgbWFkZSkge1xyXG4gICAgIHZhciBwYXRoID0gbm9kZVJlcXVpcmUoJ3BhdGgnKTtcclxuICAgICB2YXIgZnMgPSBub2RlUmVxdWlyZSgnZnMnKTtcclxuXHRcclxuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ2Z1bmN0aW9uJyB8fCBtb2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBmID0gbW9kZTtcclxuICAgICAgICBtb2RlID0gMHgxRkYgJiAofnByb2Nlc3MudW1hc2soKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIW1hZGUpIG1hZGUgPSBudWxsO1xyXG5cclxuICAgIHZhciBjYiA9IGYgfHwgZnVuY3Rpb24gKCkge307XHJcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdzdHJpbmcnKSBtb2RlID0gcGFyc2VJbnQobW9kZSwgOCk7XHJcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xyXG5cclxuICAgIGZzLm1rZGlyKHAsIG1vZGUsIGZ1bmN0aW9uIChlcikge1xyXG4gICAgICAgIGlmICghZXIpIHtcclxuICAgICAgICAgICAgbWFkZSA9IG1hZGUgfHwgcDtcclxuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIG1hZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGVyLmNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnRU5PRU5UJzpcclxuICAgICAgICAgICAgICAgIG1rZGlyUChwYXRoLmRpcm5hbWUocCksIG1vZGUsIGZ1bmN0aW9uIChlciwgbWFkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcikgY2IoZXIsIG1hZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgbWtkaXJQKHAsIG1vZGUsIGNiLCBtYWRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcclxuICAgICAgICAgICAgLy8gdGhlcmUgYWxyZWFkeS4gIElmIHNvLCB0aGVuIGhvb3JheSEgIElmIG5vdCwgdGhlbiBzb21ldGhpbmdcclxuICAgICAgICAgICAgLy8gaXMgYm9ya2VkLlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgZnMuc3RhdChwLCBmdW5jdGlvbiAoZXIyLCBzdGF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHN0YXQgZmFpbHMsIHRoZW4gdGhhdCdzIHN1cGVyIHdlaXJkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCB0aGUgb3JpZ2luYWwgZXJyb3IgYmUgdGhlIGZhaWx1cmUgcmVhc29uLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcjIgfHwgIXN0YXQuaXNEaXJlY3RvcnkoKSkgY2IoZXIsIG1hZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBjYihudWxsLCBtYWRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1rZGlyUC5zeW5jID0gZnVuY3Rpb24gc3luYyAocCwgbW9kZSwgbWFkZSkge1xyXG4gICAgdmFyIHBhdGggPSBub2RlUmVxdWlyZSgncGF0aCcpO1xyXG4gICAgdmFyIGZzID0gbm9kZVJlcXVpcmUoJ2ZzJyk7XHJcbiAgICBpZiAobW9kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbW9kZSA9IDB4MUZGICYgKH5wcm9jZXNzLnVtYXNrKCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbDtcclxuXHJcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdzdHJpbmcnKSBtb2RlID0gcGFyc2VJbnQobW9kZSwgOCk7XHJcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgZnMubWtkaXJTeW5jKHAsIG1vZGUpO1xyXG4gICAgICAgIG1hZGUgPSBtYWRlIHx8IHA7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyMCkge1xyXG4gICAgICAgIHN3aXRjaCAoZXJyMC5jb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ0VOT0VOVCcgOlxyXG4gICAgICAgICAgICAgICAgbWFkZSA9IHN5bmMocGF0aC5kaXJuYW1lKHApLCBtb2RlLCBtYWRlKTtcclxuICAgICAgICAgICAgICAgIHN5bmMocCwgbW9kZSwgbWFkZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIGFueSBvdGhlciBlcnJvciwganVzdCBzZWUgaWYgdGhlcmUncyBhIGRpclxyXG4gICAgICAgICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xyXG4gICAgICAgICAgICAvLyBpcyBib3JrZWQuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdDtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKHApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycjEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnIwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzdGF0LmlzRGlyZWN0b3J5KCkpIHRocm93IGVycjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hZGU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1rZGlyUC5ta2RpcnAgPSBta2RpclAubWtkaXJQID0gbWtkaXJQO1xyXG4iXX0=

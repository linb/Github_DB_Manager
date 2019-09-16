// It's a module witohout UI elements
xui.Class('Module.GitHubDBHandler', 'xui.Module',{
    Instance:{
        DB_ROOT_PATH:"__crossui_db",
        OBJ_SCHEMA_FILE:".gitkeep",

        // Dependency libs
        Required:[
            "[Base64]https://linb.github.io/CrossUI_Assets/thirdparty/base64.min.js",
            "[Octokit]https://linb.github.io/CrossUI_Assets/thirdparty/octokit-rest.min.js"
        ],
        // To initialize properties
        properties : {
        },
        // To initialize instance(e.g. properties)
        initialize : function(){
            // set a global variable, for other html calling
            window.xui_GithubHandler = this;
        },     
        // api
        getGithubClient:function(){
            if(this.clientWithAuth){
                return this.clientWithAuth;
            }else{
                // this.ensureGithubAuth();
                throw new Error("No github auth yet!");
            }
        },
        ensureGithubAuth:function(){
            var api = this;
            var loginLayer = api.loginLayer;
            if(!loginLayer){
                loginLayer = api.loginLayer= (new xui.UI.Div())
                    .setDock('cover')
                    .setShowEffects("Slide In TB")
                    .setHideEffects("Slide In TB")
                    .setPanelBgClr("#fff")
                    .setIframeAutoLoad("{/}pages/GithubLoginLayer.html");
                // ensure effects
                loginLayer.render(true);
            }

            function showGithubLogInLayer(){
                var body=xui('body'),
                    top = body.first().topZindex();
                loginLayer.setZIndex(top+1).setDisplay('');
                loginLayer.show(body).setDock('cover',true);
            }

            var token = api.getToken();
            if(!token){
                showGithubLogInLayer();
            }else{
                api.clientWithAuth = new Octokit({
                    auth: 'token ' + token
                });
                api.getGithubClient().users.getAuthenticated().then(function(rsp){
                    api._userProfile = rsp.data;
                    api.fireEvent("onGithubLogin", [rsp.data.login, rsp.data.avatar_url, rsp.data, token]);

                    var action = api._lastActionConf;
                    if(action){
                        action.fun.apply(action.scope, action.params);
                        delete api._lastActionConf;
                    }
                }, function(e){
                    api.clientWithAuth = null;
                    if(err.message == "Bad credentials"){
                        showGithubLogInLayer();
                    }
                });
            }
        },
        getToken:function (){
            return this._githubAccessToken || ( this._githubAccessToken  = xui.Cookies.get('access_token'));
        },
        setToken: function (token){
            var ns=this;
            xui.Cookies.set("access_token", ns._githubAccessToken = token);
        },
        getGithubUser:function(){
            return this._userProfile && this._userProfile.login || "";
        },
        setLastActionConf:function(conf){
            this._lastActionConf = conf;
        },
        githubTokenResponse:function(tokenHash){
            var ns=this,
                paras = xui.urlDecode(tokenHash);
            // save to cookie
            if(paras.access_token){
                ns.setToken(paras.access_token);
                if(ns.loginLayer){
                    ns.loginLayer.hide();
                }            
            }
            ns.ensureGithubAuth();
        },
        githubLogout:function(){
            var ns=this;
            ns.fireEvent("onGithubLogout", [ns.getGithubUser(), ns._githubAccessToken]);

            xui.Cookies.remove("access_token");
            delete ns._githubAccessToken;
            delete ns.clientWithAuth;
            delete ns._userProfile;

            ns.ensureGithubAuth();
        },
        // APIs
        // for repo
        listRepos : function(requestId, cur_page, page_size, nameIn, sort, order, onSuccess, onFail){
            var api=this,
                clientWithAuth = this.getGithubClient();
            clientWithAuth.search.repos({
                q: "user:" +api.getGithubUser() + (nameIn?("+"+nameIn + "+in:name"):""),
                sort:sort||"updated",
                order:order || "desc",
                page:cur_page|| 1,
                per_page:page_size || 20
            }).then( function(rst){
                var repos = [];
                rst.data.items.forEach( function(v, i){
                    repos.push({
                        id:v.name,
                        caption:v.name,
                        tagVar:v
                    });
                });
                var args = [requestId, repos, rst.data.total_count||0, cur_page, page_size];
                if(false !== xui.tryF(onSuccess, args))
                    api.fireEvent("onReposList", args);
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", [requestId,"listRepos",xui.Debugger.getErrMsg(e)]);
                }
            });            
        },
        repoExist :  function(requestId, repo, onExist, onNotExist){
            var api=this,
                clientWithAuth = api.getGithubClient();  
            clientWithAuth.repos.get({
                owner:api.getGithubUser(),
                repo:repo
            }).then(function(){
                xui.tryF(onExist,[requestId, repo]);
            }).catch(function(){
                xui.tryF(onNotExist,[requestId, repo]);
            });
        },

        // for  object
        listObjects : function(requestId, repo, filter, onSuccess, onFail){
            var api=this,
                clientWithAuth = this.getGithubClient();            
            clientWithAuth.repos.getContents({
                owner:api.getGithubUser(),
                repo:repo,
                path: api.DB_ROOT_PATH
            }).then(function(rst){
                var objs=[];
                rst.data.forEach(function(v,i){
                    if("dir"==v.type){
                        if(!filter || (xui.isFun(filter) ? filter(v,i) : true)){
                            objs.push(v.name);
                        }
                    }
                }); 
                var args = [requestId, objs];
                if(false !== xui.tryF(onSuccess, args))
                    api.fireEvent("onObjectsList", args);                
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", [requestId, "listObjects", xui.Debugger.getErrMsg(e)]);
                }
            });
        },
        objectExist:function(requestId, repo, objectName, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient();  
            clientWithAuth.repos.getContents({
                owner:api.getGithubUser(),
                repo:repo,
                path: api.DB_ROOT_PATH+"/"+objectName
            }).then(function(rst){
                if(xui.isArr(rst)){
                    xui.tryF(onSuccess, [requestId, objectName]);
                }else{
                    var e= new Error("Not an object dir");
                    if(false!==xui.tryF(onFail,[e] )){
                        api.fireEvent("onError", ["objectExist",requestId, xui.Debugger.getErrMsg(e)]);
                    }
                }
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", ["objectExist",requestId, xui.Debugger.getErrMsg(e)]);
                }
            });
        },
        createObject : function(requestId, repo,  objectName, schema, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient();
            clientWithAuth.repos.createFile({
                owner:api.getGithubUser(),
                repo:repo,
                path: api.DB_ROOT_PATH+"/"+objectName+"/"+api.OBJ_SCHEMA_FILE,
                message:"Created by CrossUI GitHub DB",
                content: Base64.encode( JSON.stringify(schema)||" " )
            }).then(function(rsp){
                var info = rsp.data.content;
                item._id=itemId;
                var args = [requestId, objectName];
                if(false !== xui.tryF(onSuccess, args))
                    api.fireEvent("onObjectCreate", args);                
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", ["createObject",requestId, xui.Debugger.getErrMsg(e)]);
                }
            }); 
        },
        deleteObject:function(requestId, repo, objectName, onSuccess, onFail){
            var api=this,
                sourceOwner = api.getGithubUser(),
                sourceRepo = repo,
                path = api.DB_ROOT_PATH+"/"+objectName;
 
            let masterSha="";
            let tree="";
            function getMasterSha(){
                return clientWithAuth.git.getRef({
                  owner:sourceOwner,
                  repo:sourceRepo,
                  ref:"heads/master"
                });
            }
            function getTree(rsp){
                masterSha = rsp.data.object.sha;
                return clientWithAuth.git.getTree({
                    owner:sourceOwner,
                    repo:sourceRepo,
                    recursive: "1",
                    tree_sha: masterSha
                });
            }
            function modifyTree(rsp){
               tree = rsp.data.tree;
               tree = tree.filter(v => {return v.type=="tree" ? false: (v.path!=path && !v.path.startsWith(path+"/"))});
               return clientWithAuth.git.createTree({
                    owner:sourceOwner,
                    repo:sourceRepo,
                    tree:tree
                });
            };
            function commitTree(rsp){
                return  clientWithAuth.git.createCommit({
                    owner:sourceOwner,
                    repo:sourceRepo,
                    message:"for delete",
                    tree: rsp.data.sha,
                    parents: [masterSha]
                });
            };
            function updateRef(rsp){
                return clientWithAuth.git.updateRef({
                    owner:sourceOwner,
                    repo:sourceRepo,
                    ref:"heads/master",
                    sha: rsp.data.sha
                })
            };
            // use create tree to delete quickly
            getMasterSha()
                .then(getTree)
                .then(modifyTree)
                .then(commitTree)
                .then(updateRef)
                .then(rsp => {
                    var args = [requestId, objectName];
                    if(false !== xui.tryF(onSuccess, args))
                        api.fireEvent("onObjectDelete", args);      
                }).catch((e)=>{
                    api.fireEvent("onError", ["deleteObject",requestId, xui.Debugger.getErrMsg(e)]);
                });
        },

        // for item
        listItems : function(requestId, repo, objectName, withSchema, cur_page, page_size, wordIn, order, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient();
            clientWithAuth.search.code({
                q: (wordIn?(wordIn+" "):"") + "path:"+api.DB_ROOT_PATH+"/"+objectName+"/ extension:json",
                sort:"indexed",
                order:order || "desc",
                page:cur_page|| 1,
                per_page:page_size || 20
            }).then( function(rst){
                var promises = [],schema={};
                if(withSchema){
                    promises.push(
                        api.readItem(requestId, repo, objectName, this.OBJ_SCHEMA_FILE,function(req, objectName, itemId, json){
                            xui.merge(schema, json, 'all');
                            return false;
                        }, function(e){
                            xui.log("No schema file "+api.OBJ_SCHEMA_FILE+":"+e);
                            return false;
                        }) 
                    );
                }
                var items = [], item,fid;
                rst.data.items.forEach( function(v, i){
                    fid=v.repository.name.replace(/\.json$/,"");
                    items.push(item = {
                        // these two keys are reserved
                        _id:fid
                    });
                    promises.push(api.readItem(requestId+":"+fid, repo, objectName, fid, function(req, objectName, itemId, json){
                        xui.merge(item, json, 'without');
                        return false;
                    }, function(e){
                        xui.log("No item file: " + fid+ " - " +e);
                        return false;
                    }));
                });
                Promise.all(promises).then(function(){
                     var args = [requestId, objectName, items, schema, rst.data.total_count||0, cur_page, page_size];
                     if(false !== xui.tryF(onSuccess, args))
                        api.fireEvent("onItemsList", args);
                }).catch(e=>{
                     api.fireEvent("onError", ["listItems",requestId, xui.Debugger.getErrMsg(e)]);
                });
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", ["listItems",requestId, xui.Debugger.getErrMsg(e)]);
                }
            });            
        },
        itemExist:function(requestId, repo, objectName, itemId, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient();  
            itemId = xui.isHash(itemId)?itemId._id:itemId;
            clientWithAuth.repos.getContents({
                owner:api.getGithubUser(),
                repo:repo,
                path: api.DB_ROOT_PATH+"/"+objectName+"/"+itemId + ".json"
            }).then(function(rst){
                if(rst.type=="file")
                    xui.tryF(onSuccess, [requestId, rst.sha, objectName, itemId]);
                else{
                    var e="Not an item file";
                    if(false!==xui.tryF(onFail,[new Error(e)] ))
                        api.fireEvent("onError", ["itemExist",requestId, e]);
                }
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", ["itemExist",requestId, xui.Debugger.getErrMsg(e)]);
                }
            });
        },
        readItem : function(requestId, repo, objectName, itemId, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient();
            itemId = xui.isHash(itemId)?itemId._id:itemId;
            // return a promise
            return clientWithAuth.repos.getContents({
                owner:api.getGithubUser(),
                repo:repo,
                path: api.DB_ROOT_PATH+"/"+objectName+"/"+(itemId==api.OBJ_SCHEMA_FILE?itemId:(itemId + ".json"))
            }).then(function(rst){
                // folder
                if(rst.data[0]){
                    var e="This's a dir, not a file!";
                    if(false!==xui.tryF(onFail,[e] )){
                        api.fireEvent("onError", ["readItem",requestId, xui.Debugger.getErrMsg(e)]);
                    }
                }
                else{
                    var content = Base64.decode( rst.data.content );
                        item = false;
                    try{
                        item = JSON.parse(content);
                    }catch(e){
                        item = xui.unserialize(content);
                    }
                    if(item===false){
                        throw new Error("Not JSON: " + content);
                    }
                    item._id=itemId;
                    var args = [requestId, objectName, item, itemId, rst.data.sha];
                    if(false !== xui.tryF(onSuccess, args))
                        api.fireEvent("onItemRead", args);                           
                }
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", ["readItem",requestId, xui.Debugger.getErrMsg(e)]);
                }
            });
        },
        createItem : function(requestId, repo,  objectName, item, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient(),
                content = JSON.stringify(item), 
                itemId = xui.rand();
            clientWithAuth.repos.createFile({
                owner:api.getGithubUser(),
                repo:repo,
                path: api.DB_ROOT_PATH+"/"+objectName+"/"+itemId + ".json",
                message:"Created by CrossUI GitHub DB",
                content: Base64.encode( content||"" )
            }).then(function(rsp){
                var info = rsp.data.content;
                item._id=itemId;
                var args = [requestId, objectName, item,  itemId, info.sha, {
                    id: info.path,
                    path: info.path,
                    objectName:objectName,
                    caption: info.name,
                    type: info.type,
                    sha: info.sha,
                    tagVar:info
                }, path.replace(/[^\/]*$/,'').replace(/\/$/,'')];
                if(false !== xui.tryF(onSuccess, args))
                    api.fireEvent("onItemCreate", args);                
            }).catch(function(e){
                if(false!==xui.tryF(onFail,[e] )){
                    api.fireEvent("onError", ["createItem",requestId, xui.Debugger.getErrMsg(e)]);
                }
            });            
        },
        updateItem : function(requestId, repo, objectName, item, itemId, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient(),
                content = JSON.stringify(item);
            itemId = itemId || item._id;
            api.itemExist(requestId, repo, objectName, itemId, function(req, sha){
                clientWithAuth.repos.updateFile({
                    owner:api.getGithubUser(),
                    repo:repo,
                    path: api.DB_ROOT_PATH+"/"+objectName+"/"+itemId + ".json",
                    sha:sha,                    
                    message:"Updated by CrossUI GitHub DB",
                    content: Base64.encode( content )
                }).then(function(rsp){
                    item._id = itemId;
                    var args = [requestId, objectName, item, itemId];
                    if(false !== xui.tryF(onSuccess, args))
                        api.fireEvent("onItemUpdate", args);                    
                }).catch(function(e){
                    if(false!==xui.tryF(onFail,[e] )){
                        api.fireEvent("onError", ["updateItem",requestId, xui.Debugger.getErrMsg(e)]);
                    }
                });
            },function(req, msg){
                if(false!==xui.tryF(onFail,[new Error(msg)] )){
                    api.fireEvent("onError", ["updateItem",requestId, msg]);
                }
            });
        },
        deleteItem : function(requestId, repo, objectName, itemId, onSuccess, onFail){
            var api=this,
                clientWithAuth = api.getGithubClient();
            itemId = xui.isHash(itemId)?itemId._id:itemId;
            api.itemExist(requestId, repo, objectName, itemId, function(req, sha){
                clientWithAuth.repos.deleteFile({
                    owner:api.getGithubUser(),
                    repo:repo,
                    path: api.DB_ROOT_PATH+"/"+objectName+"/"+itemId + ".json",
                    sha:sha,                    
                    message:"Deleted by CrossUI GitHub DB"
                }).then(function(rsp){
                    var args = [requestId, objectName, itemId];
                    if(false !== xui.tryF(onSuccess, args))
                        api.fireEvent("onItemDelete", args);                    
                }).catch(function(e){
                    if(false!==xui.tryF(onFail,[e] )){
                        api.fireEvent("onError", ["deleteItem",requestId, xui.Debugger.getErrMsg(e)]);
                    }
                });
            },function(req, msg){
                if(false!==xui.tryF(onFail,[new Error(msg)] )){
                    api.fireEvent("onError", ["deleteItem",requestId, msg]);
                }
            });
        },
        iniComponents:function(){
            // [[Code created by CrossUI RAD Studio
            var host=this, children=[], append=function(child){children.push(child.get(0));};

            return children;
            // ]]Code created by CrossUI RAD Studio
        }
    }, 
    Static:{
        $Functions:{
            ensureGithubAuth : function(){},
            githubLogout : function(){},

            setLastActionConf : function(lastActionConf/*Object, {fun:Function, scope:Object, params:Array}*/){},
            listRepos : function(requestId /*String, the given request id*/, 
                                  cur_page /*Number, current page*/,
                                  page_size /*Number, per page count*/,
                                  nameIn /*String, search word*/, 
                                  order/*String, desc, asc*/, 
                                  onSuccess /*Function, function(requestId, repos:[{id,caption,tagVar}], total_count, cur_page, page_size){}*/, 
                                  onFail/*Function, function(errorMessage){}*/){},
            repoExist: function(requestId /*String, the given request id*/, 
                                repo /*String, repo name */, 
                                onExist/*Function, function(requestId, repo){}*/, 
                                onNotExist/*Function, function(requestId, repo){}*/){},

            objectExist:function(requestId /*String, the given request id*/, 
                                repo /*String, repo name */, 
                                objectName /*String, object name*/, 
                                onSuccess /*Function, function(requestId, objectName){}*/, 
                                onFail/*Function, function(errorMessage){}*/){},
            listObjects: function(requestId /*String, requestid*/, 
                                  repo /*String, repo name */, 
                                  filter /*Function, function(obj:{}, key){}*/, 
                                  onSuccess /*Function, function(requestId, objects:[objectName]){} */, 
                                  onFail/*Function*/){},
            createObject:function(requestId /*String, the given request id*/, 
                                 repo /*String, repo name */, 
                                 objectName /*String, object name*/, 
                                 schema /*Object, {columns:,...}*/, 
                                 onSuccess /*Function, function(requestId, objectName){} */, 
                                 onFail/*Function, function(errorMessage){}*/){},
            deleteObject:function(requestId /*String, the given request id*/, 
                                 repo /*String, repo name */, 
                                 objectName /*String, object name*/, 
                                 onSuccess /*Function, function(requestId, objectName){}*/, 
                                 onFail/*Function, function(errorMessage){}*/){},

            listItems : function(requestId /*String, the given request id*/, 
                                  repo /*String, repo name */, 
                                  objectName /*String, object name*/, 
                                  withSchema /*Boolean, get schema or not*/,
                                  cur_page /*Number, current page*/,
                                  page_size /*Number, per page count*/,
                                  wordIn /*String, search word*/, 
                                  order/*String, desc, asc*/, 
                                  onSuccess /*Function, function(requestId, objectName, items:[{}], schema:{columns:,...}, total_count, cur_page, page_size){}*/, 
                                  onFail/*Function, function(errorMessage){}*/){},
            itemExist:function(requestId /*String, the given request id*/, 
                                repo /*String, repo name */, 
                                objectName /*String, object name*/, 
                                itemId/*String, item id*/, 
                                onSuccess /*Function, function(requestId, sha, objectName, itemId){}*/, 
                                onFail/*Function, function(errorMessage){}*/){},
            readItem:function(requestId /*String, the given request id*/, 
                               repo /*String, repo name */, 
                               objectName /*String, object name*/, 
                               itemId/*String, item id*/, 
                               onSuccess /*Function, function(requestId , objectName, item, itemId, sha){} */, 
                               onFail/*Function, function(errorMessage){}*/){},
            createItem:function(requestId /*String, the given request id*/, 
                                 repo /*String, repo name */, 
                                 objectName /*String, object name*/, 
                                 item /*Object, item object*/, 
                                 onSuccess /*Function, function(requestId, objectName, item, itemId, sha, itemInfo:{id,path,caption,type,objectName,tagVar}){} */, 
                                 onFail/*Function, function(errorMessage){}*/){},
            updateItem:function(requestId /*String, the given request id*/, 
                                 repo /*String, repo name */, 
                                 objectName /*String, object name*/, 
                                 item /*Object, item object*/, 
                                 itemId/*String, item id*/, 
                                 onSuccess /*Function, function(requestId, objectName, item, itemId){}*/, 
                                 onFail/*Function, function(errorMessage){}*/){},
            deleteItem:function(requestId /*String, the given request id*/, 
                                 repo /*String, repo name */, 
                                 objectName /*String, object name*/, 
                                 itemId/*String/Object, item id/item*/, 
                                 onSuccess /*Function, function(requestId, objectName, itemId){}*/, 
                                 onFail/*Function, function(errorMessage){}*/){}
        },
        // export prop
        $DataModel:{
            // repo name
            repoName: "",
            // object(table) name
            objectName: ""
        },
        $EventHandlers :{
            onError : function(funName /*String, function name*/,
                                      requestId /*String, the given request id*/, 
                                      error /*String, error message*/){},
            onGithubLogin : function(username /*String, user name*/, 
                                      avatar /*String, user avatar url*/, 
                                      user /*Object, user object*/,
                                      token /*String, token*/
                                     ){},
            onGithubLogout : function(username /*String, user name*/, token /*String, token*/){},
 
            onReposList : function(requestId /*String, requestid*/, 
                  repos /*Array, [{id,caption,tagVar}], result list*/, 
                  total_count /*Number, total count*/,
                  cur_page /*Number, current page*/,
                  page_size /*Number, per page count*/
                 ){},
            
            onObjectsList: function(requestId /*String, requestid*/, 
                  objs /*Array, [objectName], result list*/
                 ){},

            onObjectCreate : function(requestId /*String, the given request id*/, 
                                             objectName /*String, object name*/
                                            ){},
            onObjectDelete : function(requestId /*String, the given request id*/, 
                                             objectName /*String, object name*/
                                            ){},

            onItemsList : function(requestId /*String, the given request id*/, 
                                          objectName/*String, object name*/, 
                                          items /*Array, result list [{}]*/, 
                                          schema /*Object, schema object {columns:,...}*/, 
                                          total_count /*Number, total count*/,
                                          cur_page /*Number, current page*/,
                                          page_size /*Number, per page count*/
                                         ){},
            onItemRead : function(requestId /*String, the given request id*/, 
                                         objectName/*String, object name*/, 
                                         item /*Object, item object*/,
                                         itemId/*String, item id*/, 
                                         sha/*String, GitHub file sha*/
                                        ){},
            onItemCreate : function(requestId /*String, the given request id*/, 
                                          objectName/*String, object name*/, 
                                          item /*Object, item object*/,
                                          itemId/*String, item id*/, 
                                          sha/*String, GitHub file sha*/, 
                                          itemInfo /*Object, {id,path,caption,type,objectName,tagVar}*/
                                          ){},
            onItemUpdate : function(requestId /*String, the given request id*/, 
                                          objectName/*String, object name*/, 
                                          item /*Object, item object*/,
                                          itemId/*String, item id*/
                                          ){},
            onItemDelete : function(requestId /*String, the given request id*/, 
                                          objectName/*String, object name*/, 
                                          itemId/*String, item id*/
                                          ){}
        }
    }
});
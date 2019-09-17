// The default code is a module class (inherited from xui.Module)
// Ensure that all the value of "key/value pair" does not refer to external variables
// Sub module don't support async functions
xui.Class('Module.TableView', 'xui.Module',{
    Instance:{
        // Dependencies css
        Dependencies: [],
        // Required modules
        Required:[],
        // To initialize properties
        properties : {},

        // To initialize instance(e.g. properties)
        initialize : function(){
        },

        // To initialize internal components (mostly UI controls)
        // *** If you're not a skilled, dont modify this function manually ***
        iniComponents : function(){
            // [[Code created by CrossUI RAD Studio
            var host=this, children=[], append=function(child){children.push(child.get(0));};
            
            append(
                xui.create("xui.UI.TreeGrid")
                .setHost(host,"xui_ui_treegrid21")
                .setDirtyMark(false)
                .setLeft("0em")
                .setTop("0em")
                .setRowNumbered(true)
            );
            
            return children;
            // ]]Code created by CrossUI RAD Studio
        },
        // To determine how properties affects this module
        propSetAction : function(prop){
        },
        functions:{
            "setResult":{
                "desc":"",
                "params":[
                    {
                        "id":"req",
                        "type":"String",
                        "desc":""
                    },
                    {
                        "id":"obj",
                        "type":"String",
                        "desc":""
                    },
                    {
                        "id":"items",
                        "type":"Array",
                        "desc":""
                    },
                    {
                        "id":"schema",
                        "type":"Hash",
                        "desc":""
                    }
                ],
                "actions":[
                    {
                        "desc":"log",
                        "type":"other",
                        "target":"msg",
                        "args":[
                            "{args}"
                        ],
                        "method":"log"
                    },
                    {
                        "desc":"set header",
                        "type":"control",
                        "target":"xui_ui_treegrid21",
                        "args":[
                            { },
                            {
                                "header":"{args[3]}",
                                "rows":"{args[2]}"
                            }
                        ],
                        "method":"setProperties"
                    }
                ]
            }
        }
    },
    // export
    Static:{
        $DataModel:{
        },
        $EventHandlers:{
        },
        $Functions:{
        }
    }
});
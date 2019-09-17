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
                .setTagCmds([
                    {
                        "id":"del",
                        "type":"text",
                        "location":"left",
                        "itemClass":"xuicon xui-uicmd-close",
                        "tag":"row"
                    }
                ])
                .onCmd([
                    {
                        "desc":"del",
                        "type":"control",
                        "target":"xui_ui_treegrid21",
                        "args":[ ],
                        "method":"removeRows",
                        "conditions":[
                            {
                                "left":"{args[2]}",
                                "symbol":"=",
                                "right":"del"
                            }
                        ],
                        "event":3
                    }
                ])
            );
            
            append(
                xui.create("xui.UI.Block")
                .setHost(host,"xui_ui_block38")
                .setDock("bottom")
                .setLeft("18.333333333333332em")
                .setTop("15.833333333333334em")
                .setHeight("3.3333333333333335em")
            );
            
            host.xui_ui_block38.append(
                xui.create("xui.UI.PageBar")
                .setHost(host,"xui_ui_pagebar")
                .setLeft("0.8333333333333334em")
                .setTop("0.8333333333333334em")
                .setCaption("Page")
                .onPageSet([
                    {
                        "desc":"set prop",
                        "type":"other",
                        "target":"var",
                        "args":[
                            "page",
                            "{args[1]}"
                        ],
                        "method":"page.properties"
                    },
                    {
                        "desc":"refresh",
                        "type":"control",
                        "target":"xui_ui_btn_refresh",
                        "args":[ ],
                        "method":"fireClickEvent"
                    }
                ])
            );
            
            append(
                xui.create("xui.UI.Block")
                .setHost(host,"xui_ui_block41")
                .setDock("top")
                .setLeft("19.166666666666668em")
                .setTop("16.666666666666668em")
                .setHeight("3.3333333333333335em")
            );
            
            host.xui_ui_block41.append(
                xui.create("xui.UI.ComboInput")
                .setHost(host,"xui_ui_ci_search")
                .setDirtyMark(false)
                .setLeft("2.5em")
                .setTop("0.8333333333333334em")
                .setWidth("24.583333333333332em")
                .setLabelSize("8em")
                .setLabelCaption("Search word")
                .setType("input")
                .setImageClass("xui-icon-search")
                .setCommandBtn("delete")
            );
            
            host.xui_ui_block41.append(
                xui.create("xui.UI.HTMLButton")
                .setHost(host,"xui_ui_btn_refresh")
                .setLeft("30em")
                .setTop("0.8333333333333334em")
                .setWidth("6.666666666666667em")
                .setCaption("Refresh")
                .onClick([
                    {
                        "desc":"set query",
                        "type":"other",
                        "target":"var",
                        "args":[
                            "word",
                            "{page.xui_ui_ci_search.getValue()}"
                        ],
                        "method":"page.properties",
                        "event":1
                    },
                    {
                        "desc":"send msg",
                        "type":"page",
                        "target":"App",
                        "args":[
                            "{page.postMessage()}",
                            undefined,
                            undefined,
                            "refreshItemList",
                            "{page.properties.path}",
                            "{page.properties.page}",
                            "{page.properties.word}",
                            "{page.functions.setResult}"
                        ],
                        "method":"postMessage",
                        "redirection":"page::",
                        "event":1
                    }
                ])
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
                    },
                    {
                        "id":"total_count",
                        "type":"Number",
                        "desc":""
                    },
                    {
                        "id":"cur_page",
                        "type":"Number",
                        "desc":""
                    },
                    {
                        "id":"page_size",
                        "type":"Number",
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
                        "desc":"set grid",
                        "type":"control",
                        "target":"xui_ui_treegrid21",
                        "args":[
                            { },
                            {
                                "header":"{args[3].prop}",
                                "rawData":"{args[2]}"
                            }
                        ],
                        "method":"setProperties"
                    },
                    {
                        "desc":"set page size",
                        "type":"control",
                        "target":"xui_ui_pagebar",
                        "args":[
                            "{page.xui_ui_pagebar.setPageCount()}",
                            undefined,
                            undefined,
                            "{args[6]}"
                        ],
                        "method":"setPageSize",
                        "redirection":"other:callback:call"
                    },
                    {
                        "desc":"set total page",
                        "type":"control",
                        "target":"xui_ui_pagebar",
                        "args":[
                            "{page.xui_ui_pagebar.setTotalCount()}",
                            undefined,
                            undefined,
                            "{args[4]}"
                        ],
                        "method":"setTotalCount",
                        "redirection":"other:callback:call"
                    },
                    {
                        "desc":"set cur page",
                        "type":"control",
                        "target":"xui_ui_pagebar",
                        "args":[
                            "{page.xui_ui_pagebar.setPage()}",
                            undefined,
                            undefined,
                            "{args[5]}"
                        ],
                        "method":"setPage",
                        "redirection":"other:callback:call"
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
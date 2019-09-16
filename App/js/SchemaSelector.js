// The default code is a module class (inherited from xui.Module)
// Ensure that all the value of "key/value pair" does not refer to external variables
// Sub module don't support async functions
xui.Class('App.SchemaSelector', 'xui.Module',{
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
                xui.create("xui.APICaller")
                .setHost(host,"api_1")
                .setResponseCallback([
                    {
                        "type":"host",
                        "name":"setText"
                    }
                ])
                .setProxyType("AJAX")
                .setResponseType("TEXT")
            );
            
            append(
                xui.create("xui.UI.Dialog")
                .setHost(host,"xui_ui_dialog6")
                .setLeft("11.666666666666666em")
                .setTop("2.5em")
                .setWidth("33.333333333333336em")
                .setCaption("Select a schema")
                .setMinBtn(false)
            );
            
            host.xui_ui_dialog6.append(
                xui.create("xui.UI.Layout")
                .setHost(host,"xui_ui_layout13")
                .setItems([
                    {
                        "id":"before",
                        "size":160,
                        "min":10,
                        "locked":false,
                        "folded":false,
                        "hidden":false,
                        "cmd":false,
                        "pos":"before"
                    },
                    {
                        "id":"main",
                        "size":80,
                        "min":10
                    }
                ])
                .setLeft("0em")
                .setTop("0em")
                .setType("horizontal")
            );
            
            host.xui_ui_layout13.append(
                xui.create("xui.UI.List")
                .setHost(host,"xui_ui_list5")
                .setDirtyMark(false)
                .setItems([
                    {
                        "id":"Schema_card1.js",
                        "caption":"Schema_card1"
                    }
                ])
                .setDock("fill")
                .setLeft("1.6666666666666667em")
                .setTop("9.166666666666666em")
                .setWidth("26.666666666666668em")
                .setBorderType("none")
                .setLabelSize("8.333333333333334em")
                .setLabelPos("none")
                .setValue("a")
                .onItemSelected([
                    {
                        "desc":"set url",
                        "type":"control",
                        "target":"api_1",
                        "args":[
                            { },
                            {
                                "queryURL":"data/{args[1].id}"
                            }
                        ],
                        "method":"setProperties",
                        "event":2
                    },
                    {
                        "desc":"call",
                        "type":"control",
                        "target":"api_1",
                        "args":[ ],
                        "method":"invoke",
                        "onOK":0,
                        "onKO":1,
                        "okFlag":"_DI_succeed",
                        "koFlag":"_DI_fail"
                    }
                ]),
                "before"
            );
            
            host.xui_ui_layout13.append(
                xui.create("xui.UI.Input")
                .setHost(host,"xui_ui_input1")
                .setReadonly(true)
                .setDirtyMark(false)
                .setDock("fill")
                .setLeft("5.833333333333333em")
                .setTop("8.333333333333334em")
                .setWidth("18em")
                .setHeight("10em")
                .setLabelSize("8em")
                .setLabelPos("none")
                .setMultiLines(true),
                "main"
            );
            
            host.xui_ui_dialog6.append(
                xui.create("xui.UI.Block")
                .setHost(host,"xui_ui_block19")
                .setDock("bottom")
                .setLeft("12.5em")
                .setTop("20.833333333333332em")
                .setHeight("2.4166666666666665em")
                .setBorderType("none")
            );
            
            host.xui_ui_block19.append(
                xui.create("xui.UI.HTMLButton")
                .setHost(host,"xui_ui_htmlbutton3")
                .setLeft("3.0833333333333335em")
                .setTop("0.5833333333333334em")
                .setWidth("6em")
                .setCaption("OK")
            );
            
            return children;
            // ]]Code created by CrossUI RAD Studio
        },
        // To determine how properties affects this module
        propSetAction : function(prop){
        },
        functions:{
            "setText":{
                "desc":"",
                "params":[
                    {
                        "id":"text",
                        "type":"String",
                        "desc":""
                    }
                ],
                "actions":[
                    {
                        "desc":"set text",
                        "type":"control",
                        "target":"xui_ui_input1",
                        "args":[
                            "{page.xui_ui_input1.setUIValue()}",
                            undefined,
                            undefined,
                            "{args[0]}"
                        ],
                        "method":"setUIValue",
                        "redirection":"other:callback:call"
                    },
                    {
                        "desc":"print",
                        "type":"other",
                        "target":"msg",
                        "args":[
                            "{args}"
                        ],
                        "method":"log"
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
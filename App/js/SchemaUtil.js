// The default code is a module class (inherited from xui.Module)
// Ensure that all the value of "key/value pair" does not refer to external variables
// Sub module don't support async functions
xui.Class('App.SchemaUtil', 'xui.Module',{
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
                .setHost(host,"xui_ui_treegrid32")
                .setDirtyMark(false)
                .setLeft("0em")
                .setTop("0em")
                .setRowNumbered(true)
                .setHeader([
                    {
                        "id":"col1",
                        "_cells":{ },
                        "_serialId":"-h_a",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "width":"8em",
                        "_hcellheight":"2em",
                        "type":"input",
                        "caption":"col1",
                        "_region":2
                    },
                    {
                        "id":"col2",
                        "_cells":{ },
                        "_serialId":"-h_b",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "width":"8em",
                        "_hcellheight":"2em",
                        "type":"input",
                        "caption":"col2",
                        "_region":2
                    },
                    {
                        "id":"col3",
                        "_cells":{ },
                        "_serialId":"-h_c",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "width":"8em",
                        "_hcellheight":"2em",
                        "type":"input",
                        "caption":"col3",
                        "_region":2
                    },
                    {
                        "id":"col4",
                        "_cells":{ },
                        "_serialId":"-h_d",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "width":"8em",
                        "_hcellheight":"2em",
                        "type":"input",
                        "caption":"col4",
                        "_region":2
                    }
                ])
            );
            
            return children;
            // ]]Code created by CrossUI RAD Studio
        },
        // To determine how properties affects this module
        propSetAction : function(prop){
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
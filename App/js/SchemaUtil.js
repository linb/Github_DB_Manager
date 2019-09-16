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
                        "id":"First Name",
                        "caption":"First Name",
                        "type":"input",
                        "width":"8em",
                        "_cells":{ },
                        "_serialId":"-h_e",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "_hcellheight":"1.8333333333333333em",
                        "_region":2
                    },
                    {
                        "id":"Last Name",
                        "caption":"Last Name",
                        "type":"input",
                        "width":"8em",
                        "_cells":{ },
                        "_serialId":"-h_f",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "_hcellheight":"1.8333333333333333em",
                        "_region":2
                    },
                    {
                        "id":"age",
                        "caption":"age",
                        "type":"number",
                        "width":"8em",
                        "precision":0,
                        "increment":10,
                        "min":0,
                        "max":200,
                        "_cells":{ },
                        "_serialId":"-h_g",
                        "_colWidth":"8em",
                        "_cellWidth":"8em",
                        "_hcellheight":"1.8333333333333333em",
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
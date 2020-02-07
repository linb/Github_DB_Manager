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
                .setDock("none")
                .setLeft("15.833333333333334em")
                .setTop("6.666666666666667em")
                .setRowNumbered(true)
                .setHeader([
                    {
                        "id":"fname",
                        "caption":"First Name",
                        "type":"input",
                        "width":"8em"
                    },
                    {
                        "id":"lname",
                        "caption":"Last Name",
                        "type":"input",
                        "width":"8em"
                    },
                    {
                        "id":"age",
                        "caption":"age",
                        "type":"number",
                        "width":"8em",
                        "precision":0,
                        "increment":10,
                        "min":0,
                        "max":200
                    }
                ])
            );
            
            append(
                xui.create("xui.UI.Label")
                .setHost(host,"xui_ui_label3")
                .setLeft("7.5em")
                .setTop("2.5em")
                .setWidth("28.916666666666668em")
                .setCaption("Useless, except for build table/object schema json")
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
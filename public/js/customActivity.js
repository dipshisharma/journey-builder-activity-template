define(['postmonger'], function (Postmonger) {

    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    console.log('In Custom Activity.js');
    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);
    connection.on('requestedSchema', onRequestSchema);

    connection.on('clickedNext', save);
   
    function onRender() {
        console.log('In Render');
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');
        connection.trigger('requestSchema');
    }

    function onRequestSchema(data){
        console.log('*** requestSchema ***');
        if(data.error){
            console.log('Error in request schema');
        }else{
            var i=0;
            //loop through the fields, and create inputs (labels & hidden inputs for values) for all the DE fields
            $.each(data.schema, function (key, DEField) {
                
                var DEFieldHandlerBar = '{{'+ DEField.key + '}}';
                var DEFieldName = DEField.name;

                //create field label
                var fieldLabel = document.createElement("label");
                fieldLabel.innerHTML = DEFieldName;
                fieldLabel.name = DEFieldName;
                fieldLabel.id = DEFieldName;
                fieldLabel.className = "slds-form-element__label";
                document.getElementById("journeyDEFields").appendChild(fieldLabel);
                
                //create hidden input field with value as the handleBar of the field
                var fieldLabelHiddenInput = document.createElement("input");
                fieldLabelHiddenInput.type = "hidden";
                fieldLabelHiddenInput.name = "InputHidden-"+i;
                fieldLabelHiddenInput.id = "InputHidden-"+i;
                fieldLabelHiddenInput.value = DEFieldHandlerBar;
                document.getElementById("journeyDEFields").appendChild(fieldLabelHiddenInput);
                var lineBreak = document.createElement("br");
                document.getElementById("journeyDEFields").appendChild(lineBreak);
                // console.log('Get Input field: '+ document.getElementById('subKey').value);

                //create a picklist with all the DE fields to allow for mapping the TextKit fields
                var textKitFields = document.createElement("select");
                textKitFields.name = "Select-" + i;
                textKitFields.id = "Select-"+ i;
                textKitFields.className ="slds-select";
                var option1 = document.createElement("option");
                option1.value = "None";
                option1.text = "None";
                textKitFields.appendChild(option1);

                $.each(data.schema, function (key, DEField) {
                    var DEFieldName = DEField.name;

                    //add options to the picklist field created
                    var option = document.createElement("option");
                    option.value = DEFieldName;
                    option.text = DEFieldName;
                    option.id = DEFieldName + "option";
                    textKitFields.appendChild(option);
                    // document.getElementById('textKitFields').appendChild(textKitFields);
                });
                document.getElementById("textKitFields").appendChild(textKitFields);
                var lineBreak = document.createElement("br");
                document.getElementById("textKitFields").appendChild(lineBreak);

                console.log('i: '+i);
                i+=1;
                console.log('i: '+i);
            });
        }
    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        
        if (data) {
            payload = data;
            console.log('In Initialize'+data);
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log(inArguments);

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                // if (key === 'testArg') {
                //     testArg = val;
                // } 
              
            });
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log('*** onGetTokens ***');
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        
        console.log('*** called Save in Custom activity ***');
        var email = $('#email').val();
        var subKey = $('#subKey').val();
        var inArgs='';

        // Get the container element
        var container = document.getElementById('step1');

        var inputs = container.getElementsByTagName('input');
        for (var index = 0; index < inputs.length; ++index) {
            // deal with inputs[index] element.
            
            console.log('Input found, Id: '+ inputs[index].id);
            var id= 'InputHidden-'+index;
            var inputHidden = document.getElementById(id).value;
            id = 'Select-'+index;
            var select = document.getElementById(id);
            var selectVal = select.options[select.selectedIndex].value;
            inArgs += selectVal+':'+inputHidden+',';
        }
        console.log(inArgs);
        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            /*
                Example of using the Contact Modal Data Binding
                "subscriberKey": "{{Contact.Attribute.Custom_Journey_Activity_DE.SubscriberKey}}",
                "emailAddress": "{{Contact.Attribute.Custom_Journey_Activity_DE.EmailAddress}}"

                Example of using the Event/Journey Context
                "subscriberKey": "{{Event.DEAudience-e11248bc-6e36-7a7f-9ef0-887766743227.SubscriberKey}}",
                "emailAddress": "{{Event.DEAudience-e11248bc-6e36-7a7f-9ef0-887766743227.EmailAddress}}"

                Example of using the plain text data entered in the field on config screen
                var email = $('#email').val();
                var subKey = $('#subKey').val();

                "subscriberKey": subKey,
                "emailAddress": email
            */
           "SubscriberKey":"{{Event.DEAudience-e11248bc-6e36-7a7f-9ef0-887766743227.SubscriberKey}}",
           "EmailAddress":"{{Event.DEAudience-e11248bc-6e36-7a7f-9ef0-887766743227.EmailAddress}}",
           "PhoneNumber":"{{Event.DEAudience-e11248bc-6e36-7a7f-9ef0-887766743227.PhoneNumber}}",
            // "subscriberKey": subKey,
            // "emailAddress": email,
            // "testArg": "testArg",
        }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }


});

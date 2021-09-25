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
            //loop through the fields, and create inputs (labels & hidden inputs for values) for all the DE fields
            console.log(data);
            // $.each(inArguments, function (index, inArgument) {
                $.each(data.schema, function (key, DEField) {
                    var DEFieldHandlerBar = '{{'+ DEField.key + '}}';
                    var DEFieldName = DEField.name;

                    console.log('Requested Key: '+ key);
                    console.log('Requested Value - DE Key: '+ DEFieldHandlerBar);
                    console.log('Requested Value - DE Field Name: '+ DEFieldName);
                    var input = document.createElement("input");
                    input.setAttribute('type', 'text');
                    input.setAttribute('value','test');
                    console.log('Get Input field: '+ document.getElementById('phoneNumber'));
                });
            // });
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

        console.log('In Custom Activity, Email: '+email+ ', SubKey: '+ subKey);

        payload['arguments'].execute.inArguments = [{
            "tokens": authTokens,
            // "subscriberKey": "{{Contact.Attribute.Custom_Journey_Activity_DE.SubscriberKey}}",
            "subscriberKey": subKey,
            // "emailAddress": "{{Contact.Attribute.Custom_Journey_Activity_DE.EmailAddress}}",
            "emailAddress": email,
            "testArg": "testArg"
        }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }


});

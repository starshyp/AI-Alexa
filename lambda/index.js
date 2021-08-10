/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Greetings! How may I help you today?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//ref: https://dabblelab.com/templates/2-alexa-remote-api-example-skill
const SummaryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SummaryIntent';
    },
    async handle(handlerInput) {
        let speakOutput = null;

        // let elevators = await getRemoteData('https://rocketapis.azurewebsites.net/api/elevators')
        // .then((response) => {
        //     let elevators = JSON.parse(response);

        let elevators = await getRemoteData('https://rocketapis.azurewebsites.net/api/elevators')
        let elevatorsParsed = JSON.parse(elevators)
        let buildings = await getRemoteData('https://rocketapis.azurewebsites.net/api/building')
        let buildingsParsed = JSON.parse(buildings)
        let customers = await getRemoteData('https://rocketapis.azurewebsites.net/api/customer')
        let customersParsed = JSON.parse(customers)
        let elevStatus = await getRemoteData('https://rocketapis.azurewebsites.net/api/elevators/notactive')
        let elevStatusParsed = JSON.parse(elevStatus)
        let batteries = await getRemoteData('https://rocketapis.azurewebsites.net/api/batteries')
        let batteriesParsed = JSON.parse(batteries)
        let cities = await getRemoteData('https://rocketapis.azurewebsites.net/api/address/city')
        let citiesParsed = JSON.parse(cities)
        let quotes = await getRemoteData('https://rocketapis.azurewebsites.net/api/quotes')
        let quotesParsed = JSON.parse(quotes)
        let leads = await getRemoteData('https://rocketapis.azurewebsites.net/api/lead')
        let leadsParsed = JSON.parse(leads)

        // .then((response) => {
        //     let buildings = JSON.parse(response);

         speakOutput = `Greetings! There are currently ${elevatorsParsed.length} elevators deployed in the ${buildingsParsed.length} buildings of your ${customersParsed.length} customers. Currently, ${elevStatusParsed.length} elevators are not in Running Status and are being serviced. ${batteriesParsed.length} Batteries are deployed across ${citiesParsed} cities. On another note you currently have ${quotesParsed.length} quotes awaiting processing. You also have ${leadsParsed.length} leads in your contact requests.`;
        // })
        // .catch((err) => {
        //     console.log(`ERROR: ${err.message}`);
        //     // set an optional error message here
        //     // outputSpeech = err.message;
        //   });
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const ElevatorStatusIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ElevatorStatusIntent';
    },
    async handle(handlerInput) {
        let speakOutput = null;
        let elevId = handlerInput.requestEnvelope.request.intent.slots.elevId.value;

        await getRemoteData('https://rocketapis.azurewebsites.net/api/elevators/' + elevId)
            .then((response) => {
            let elevStatusParsed = JSON.parse(response);
            speakOutput = `The status of elevator ${elevId} is ${elevStatusParsed.status}.`;
        })
            .catch((err) => {
                console.log(`ERROR: ${err.message}`);
                // set an optional error message here
                // outputSpeech = err.message;
            });
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const QuoteTypeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuoteTypeIntent';
    },
    async handle(handlerInput) {
        let speakOutput = null;
        let bType = handlerInput.requestEnvelope.request.intent.slots.bType.value;

        await getRemoteData('https://rocketapis.azurewebsites.net/api/quotes/' + bType)
            .then((response) => {
            let quoteTypeParsed = JSON.parse(response);
                if (bType === quoteTypeParsed.buildingType) {
                    speakOutput = `There are ${quoteTypeParsed.length} ${bType} quotes.`;
                } else {
                    speakOutput = `Please specify commercial, residential, or hybrid.`;
                }
            // speakOutput = `There are ${quoteTypeParsed.length} ${bType} quotes.`;
            })
            .catch((err) => {
                console.log(`ERROR: ${err.message}`);
                // set an optional error message here
                // outputSpeech = err.message;
            });
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const getRemoteData = (url) => new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
  });
  
  const skillBuilder = Alexa.SkillBuilders.custom();

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        SummaryIntentHandler,
        ElevatorStatusIntentHandler,
        QuoteTypeIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
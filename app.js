import { CallClient, CallAgent } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
const { CommunicationIdentityClient } = require('@azure/communication-identity');

let call;
let callAgent;
let tokenCredential = "";
const submitToken = document.getElementById("token-submit");
const callButton = document.getElementById("call-button");
const nbSendDtmfButtons = 12;
let sendDtmfButtons = [];
for (let i = 0; i < nbSendDtmfButtons; i++) {
    sendDtmfButtons[i] = document.getElementById(`send-dtmf-${i}-button`);
}
const sendDtmf2Button = document.getElementById("send-dtmf-2-button");
const sendDtmf3Button = document.getElementById("send-dtmf-3-button");
const hangUpButton = document.getElementById("hang-up-button");

const acsConnectionString = process.env['ACS_CONNECTION_STRING'];
const acsToken = process.env['ACS_TOKEN'];
const acsTo = process.env['ACS_TO'];

submitToken.addEventListener("click", async () => {
    const callClient = new CallClient();

    if (acsToken == null || acsToken == "") {
        // Instantiate the identity client
        const identityClient = new CommunicationIdentityClient(acsConnectionString);
        
        let identityResponse = await identityClient.createUser();
        console.log(`Created an identity with ID: ${identityResponse.communicationUserId}`);
        
        // Issue an access token with a validity of 24 hours and the "voip" scope for an identity
        let tokenResponse = await identityClient.getToken(identityResponse, ["voip"]);

        // Get the token and its expiration date from the response
        const { token, expiresOn } = tokenResponse;
        console.log(`Issued an access token with 'voip' scope that expires at ${expiresOn}:`);
        console.log(token);
        acsToken = token;
    }

    try {
        tokenCredential = new AzureCommunicationTokenCredential(acsToken);
        callAgent = await callClient.createCallAgent(tokenCredential);
        callButton.disabled = false;
        submitToken.disabled = true;
        console.log("Successfully submitted token!");
    } catch(error) {
        window.alert("Please submit a valid token!");
    }
})

callButton.addEventListener("click", () => {

    console.log(`Starting call to ${acsTo}`);

    call = callAgent.startCall(
        [{id: acsTo}]
    );
    
    // toggle button states
    for (let i = 0; i < nbSendDtmfButtons; i++) {
        sendDtmfButtons[i].disabled = false;
    }
    hangUpButton.disabled = false;
    callButton.disabled = true;
});

for (let i = 0; i < nbSendDtmfButtons; i++) {
    sendDtmfButtons[i].addEventListener("click", () => {

        let dtmf;
        switch (i) {
            case 9:
                dtmf = ("Star");
                break;
            case 10:
                dtmf = ("Num0");
                break;
            case 11:
                dtmf = ("Pound");
                break;
            default:
                dtmf = (`Num${i + 1}`);
        }
        console.log(`Sending DTMF ${dtmf}`);
        call.sendDtmf(dtmf);
    });
}

hangUpButton.addEventListener("click", () => {

    console.log("Hanging up the call");

    // end the current call
    call.hangUp({ forEveryone: true });

    // toggle button states
    for (let i = 0; i < nbSendDtmfButtons; i++) {
        sendDtmfButtons[i].disabled = true;
    }
    hangUpButton.disabled = true;
    callButton.disabled = false;
    submitToken.disabled = false;
});

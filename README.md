# Synopsys

This test app can be used to call an ACS user.

# References

- https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/pstn-call?pivots=platform-web
- https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/identity/access-tokens?tabs=windows&pivots=programming-language-javascript

# Install

```
npm install
```

# ACS resource

## Get the To identity
- Go to ACS resource, Identities & User Access Tokens.
- Select Voice and video calling (VOIP) and click on Generate.
- Copy Identity, this will be the To.

## Setup WebHook filter
- Go to ACS resource, Events.
- Create an Event Subscription.
- Set the filter:
```
data.to.rawId String begins with <To identity>
```

## Optional: get the ACS Connection string
- This is only ok for local testing, don't the connection string in a public service.
- Go to ACS resource, Keys.
- Copy the Connection string.
- To get the Connection string using az cli:
```
apt install jq

ACS_SUBSCRIPTION="Azure Communication Services"
RG=nuance-test-rg
ACS=nuance-test-acs

OUT=$(az communication list-key --name $ACS --resource-group $RG --subscription "$ACS_SUBSCRIPTION")

ACS_CONNECTION_STRING=$(echo $OUT | jq -r '.primaryConnectionString')

echo $ACS_CONNECTION_STRING
```

## Get a user token (to use in a public web app)
- This can be used for a public web application, the token will expire after 1 day.
- Go to ACS resource, Identities & User Access Tokens.
- Select Voice and video calling (VOIP) and click on Generate.
- Copy the User Access token, this will be the From.


# Set environment

```
export ACS_TO="<To identity>"

# Optional: to use the ACS connection for local testing
export ACS_CONNECTION_STRING="<ACS connection string>"

# Or, to use the user token
export ACS_TOKEN="<user token>"
```

# Run

```
npx parcel index.html -p 8084
```

# Optional: expose the app publicly

- This is only ok if ACS_CONNECTION_STRING has not been set.
- Install Azure Dev tunnel.
- Start the tunnel:
```
devtunnel login
devtunnel create --allow-anonymous
devtunnel port create -p 8084
devtunnel host
```

# Try the app

- Navigate to http://localhost:8084 or https://<dev tunnel>
- Click on Initialize.
- Click on Talk to copilot.
- etc.

# Debug in vscode

https://parceljs.org/recipes/debugging/

Sample launch.json
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch app in Chrome",
            "url": "http://localhost:8084",
            "webRoot": "${workspaceFolder}",
            "sourceMapPathOverrides": {
                "/__parcel_source_root/*": "${webRoot}/*"
            }
        }
    ]
}
```

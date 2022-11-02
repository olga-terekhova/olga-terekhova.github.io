Useful links:
https://medium.com/hackernoon/serverless-telegram-bot-on-aws-lambda-851204d4236c
https://levelup.gitconnected.com/simple-telegram-bot-with-python-and-aws-lambda-5eab1066b466

I will not use the Serverless framework for now, because I want to figure out all steps that the framework hides under the hood. 

Steps:
1. Create a new Telegram bot and get Telegram API token.
   1. Write to @BotFather in Telegram to create a new bot.  
   <p align="center"><img src="tg_bot1.png" alt="Creating a new bot" width="500" style="text-align:center;"></p>
   2. Copy a token returned by BotFather.
2. Create Lambda function.
   1. Execution role - select that predefined role with S3 access right away.
   2. Environment variables - add a new variable TELEGRAM_TOKEN and paste the value of the token. 
   3. Create an API endpoint as a trigger. Go to Function overview - Add trigger. Follow the steps described at https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html:  
   <p align="center"><img src="aws_api1.png" alt="Creating a new bot" width="500" style="text-align:center;"></p>  
   The newly created trigger will show the API endpoint. 
3. Provide the API endpoint as a webhook for the bot.  
   Send this command in the terminal (replace [TELEGRAM_TOKEN] and [API_ENDPOINT] with your values):
   
   ```
   curl --request POST --url https://api.telegram.org/bot[TELEGRAM_TOKEN]/setWebhook --header 'content-type: application/json' --data '{"url": "[API_ENDPOINT]"}'
   ```
   
   Response:  
   
   ```
   {"ok":true,"result":true,"description":"Webhook was set"}
   ```

A simple program which reads a message sent by the bot:

```
import json
import os
import sys

here = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(here, "./vendored"))

# import requests

TOKEN = os.environ['TELEGRAM_TOKEN']
BASE_URL = "https://api.telegram.org/bot{}".format(TOKEN)

def lambda_handler(event, context):
    data = json.loads(event["body"])
    message = str(data['message']["text"])
    chat_id = data["message"]["chat"]["id"]
    first_name = str(data["message"]["chat"]["first_name"])
    if "check" in message:
        response = "Hello {}, I will check the status".format(first_name)
        print(response)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```


   

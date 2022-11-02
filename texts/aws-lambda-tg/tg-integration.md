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

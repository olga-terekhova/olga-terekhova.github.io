I'm waiting to get my Canadian citizenship. In theory, I should know about all important updates about my case by email. Rumor is, sometimes these emails do not arrive due to some glitches, so it's still better to check the citizenship application tracker every day. Oh my, a repetitive manual task that I might need to be doing for around a year? This just begs for automation. 

My first iteration is to whip up some Python code that takes credentials from a config file, logs into the tracker, shows the tracker window and parses most important information - date of last update and timeline milestones. This script alone saves me from opening the window and logging in, and it checks status both for me and for my partner. But let's be honest - it's not fully automated! I want to be able to check the status while on my phone, or, better yet, to get notified when something changes, without any need for manual actions!

So my biggest ambition now is to wrap the code into a labmda function which runs every day or gets triggered from a Telegram bot! 🤩 
The question is - will I make before my citizenship process is completed?

What we have now:
Python code
A sample AWS Lambda function

![A list of Labmda functions](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws1.png)

![A stub of AWS function](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws2.png)

hello


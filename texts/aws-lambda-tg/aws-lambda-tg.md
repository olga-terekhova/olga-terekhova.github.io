# Building a serverless script that checks the status for Canadian citizenship application

I'm waiting to get my Canadian citizenship. In theory, I should know about all important updates about my case by email. Rumor is, sometimes these emails do not arrive due to some glitches, so it's still better to check the citizenship application tracker every day. Oh my, a repetitive manual task that I might need to be doing for around a year? This just begs for automation. 


## Simple version

My first iteration is to whip up some Python code that takes credentials from a config file, logs into the tracker, shows the tracker window and parses most important information - date of last update and timeline milestones. This script alone saves me from opening the window and logging in, and it checks status both for me and for my partner. But let's be honest - it's not fully automated! I want to be able to check the status while on my phone, or, better yet, to get notified when something changes, without any need for manual actions!

So my biggest ambition now is to wrap the code into a labmda function which runs every day or gets triggered from a Telegram bot! 🤩 
The question is - will I make before my citizenship process is completed?

## Serverless version

What we have now:
Python code

### Why Lambda?

EC2 vs Lambda

A sample AWS Lambda function

> ![A list of Labmda functions](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws1.png)

> ![A stub of AWS function](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws2.png)

### Figuring out storage
The credentials are stored in a config file, so we need to put the file somewhere our function can access. 

Functions can use /tmp space up to 512MB. That would be more than enough space for us, but /tmp is ephemeral, meaning that it may get emptied by AWS between function runs. We need something persistent. 

Another option would be to host a file outside of AWS, like on GitHub. However, the file is senstitive, because it contains credentials for the IRCC account, so at least it should be stored in a private repository, not a public one! I believe that code hosting site is not an appropriate place for credentials, so I want to place the file somewhere in AWS. 

This gives us a choice between AWS storage offerings. [Here](https://dzone.com/articles/confused-by-aws-storage-options-s3-ebs-amp-efs-explained) to read about the difference between S3, EBS and EFS. For our case we just need a basic text file stored, so EFS suits us the best. EFS provides us basic file structure paradigm for storing a simple file in a conventional format, and it provides us elasticity of size, which means we only use as much disk space as our small file needs. 
https://aws.amazon.com/blogs/compute/using-amazon-efs-for-aws-lambda-in-your-serverless-applications/

We create an instance of EFC by searching for EFC and Creating a File System.
> ![Creating a File System](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws3.png)

Any name will do. Choose a default VPC. 
> ![Creating a File System](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws4.png)

And it's created!
> ![Creating a File System](https://github.com/olga-terekhova/olga-terekhova.github.io/blob/main/texts/aws-lambda-tg/aws5.png)

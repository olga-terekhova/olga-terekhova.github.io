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

> ![A list of Labmda functions](aws1.png)

> ![A stub of AWS function](aws2.png)

### Figuring out storage
The credentials are stored in a config file, so we need to put the file somewhere our function can access. 

Functions can use /tmp space up to 512MB. That would be more than enough space for us, but /tmp is ephemeral, meaning that it may get emptied by AWS between function runs. We need something persistent. 

Another option would be to host a file outside of AWS, like on GitHub. However, the file is senstitive, because it contains credentials for the IRCC account, so at least it should be stored in a private repository, not a public one! I believe that code hosting site is not an appropriate place for credentials, so I want to place the file somewhere in AWS. 

This gives us a choice between AWS storage offerings. [Here](https://dzone.com/articles/confused-by-aws-storage-options-s3-ebs-amp-efs-explained) to read about the difference between S3, EBS and EFS. For our case we just need a basic text file stored, so EFS suits us the best. EFS provides us basic file structure paradigm for storing a simple file in a conventional format, and it provides us elasticity of size, which means we only use as much disk space as our small file needs. 
One of consequences of using AWS Storage is the need to configure our Lambda function to work within VPC.
https://aws.amazon.com/blogs/compute/using-amazon-efs-for-aws-lambda-in-your-serverless-applications/

We create an instance of EFC by searching for EFC and Creating a File System.
> ![Creating a File System](aws3.png)

Any name will do. Choose a default VPC. 
> ![Creating a File System](aws4.png)

And it's created!
> ![Creating a File System](aws5.png)


### Attaching storage to the Lambda function

Select the newly created file system, go to Details - Access points. There are none yet, so let's create an access point for our EFS file system.

>  ![Creating an access point](aws6.png)

I'll define name as lambda-citizenship-efs and will not specify any POSIX parameters for now and leave all other parameters at default or empty values.

Now go to the list of Lamda functions, select the needed function, go to Actions - View details - Configuration - VPC - Edit VPC. Choose your default VPC.

NB: drawing!

Warning:
> When you connect a function to a VPC in your account, it does not have access to the internet unless your VPC provides access. To give your function access to the internet, route outbound traffic to a NAT gateway in a public subnet
> https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html?icmpid=docs_lambda_console#vpc-internet
> By default, Lambda runs your functions in a secure VPC with access to AWS services and the internet. Lambda owns this VPC, which isn't connected to your account's default VPC. When you connect a function to a VPC in your account, the function can't access the internet unless your VPC provides access.

More info at https://aws.amazon.com/blogs/compute/using-amazon-efs-for-aws-lambda-in-your-serverless-applications/


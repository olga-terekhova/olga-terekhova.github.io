# Building a serverless script that checks the status for Canadian citizenship application

I'm waiting to get my Canadian citizenship. In theory, I should know about all important updates about my case by email. Rumor is, sometimes these emails do not arrive due to some glitches, so it's still better to check the citizenship application tracker every day. Oh my, a repetitive manual task that I might need to be doing for around a year? This just begs for automation. 


## Simple version

My first iteration is to whip up some Python code that takes credentials from a config file, logs into the tracker, shows the tracker window and parses most important information - date of last update and timeline milestones. This script alone saves me from opening the window and logging in, and it checks status both for me and for my partner. But let's be honest - it's not fully automated! I want to be able to check the status while on my phone, or, better yet, to get notified when something changes, without any need for manual actions!

So my biggest ambition now is to wrap the code into a labmda function which runs every day or gets triggered from a Telegram bot! 🤩 
The question is - will I make before my citizenship process is completed?

` hello world `

## Serverless version

What we have now:
Python code

### Why Lambda?

EC2 vs Lambda

A sample AWS Lambda function

> ![A list of Labmda functions](aws1.png)

> ![A stub of AWS function](aws2.png)

### Figuring out storage

Available options...  
Let it be S3 due to pricing, see...

Create a new S3 bucket. Assign a unique name (tip: generate a random number to generate a unique name).  
Keep ACLs disabled by default. Block all public access to this bucket.  
Versioning off for now. What are the downsides of enabling versioning?

![New bucket created](aws8.png)

Copy the ARN of the new bucket.

Click on the name of the new bucket and go to the Objects tab to create folders and to upload the config file. 

![File uploaded](aws9.png)



### Giving Lambda access to S3

Create a new execution role according to the guide:

https://aws.amazon.com/premiumsupport/knowledge-center/lambda-execution-role-s3-bucket/

Insert the ARN of the S3 bucket copied on the previous step and add "/\*" at the end, so that the new inline policy statement looks like this:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3AccessStatement",
            "Action": [
                "s3:GetObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::s3-925332/*"
            ]
        }
    ]
}
```

Go to the list of Lambda functions and select our function. In Configuration - Execution role - Choose Edit. In the dropdown of existing roles choose the previously created role. 

### Reading from S3

A sample script reading from S3 would look like this:

```
import json
import boto3
 
def lambda_handler(event, context):
    s3_client = boto3.client("s3")
    s3_bucket_name = 's3-925332'
    object_key = 'projects/citizenship/cred.config'
    file_content = s3_client.get_object(
      Bucket=s3_bucket_name, Key=object_key)["Body"].read()
    return {
        'statusCode': 200,
        'body': file_content
    }
```

### Accessing Lambda through REST APIs

https://stackoverflow.com/questions/50276852/lambda-function-within-vpc-doesnt-have-access-to-public-internet

https://medium.com/@shontauro/how-can-i-turn-my-restful-api-into-a-serverless-application-and-deploy-it-to-aws-lambda-step-by-ec7ce38e18be

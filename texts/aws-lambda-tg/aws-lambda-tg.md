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

<p align="center"><img src="aws1.png" alt="A list of Lambda functions" width="500" style="text-align:center;"></p>

<p align="center"><img src="aws2.png" alt="A stub of AWS function" width="500" style="text-align:center;"></p>

### Figuring out storage

Available options...  
Let it be S3 due to pricing, see...

Create a new S3 bucket. Assign a unique name (tip: generate a random number to generate a unique name).  
Keep ACLs disabled by default. Block all public access to this bucket.  
Versioning off for now. What are the downsides of enabling versioning?

<p align="center"><img src="aws8.png" alt="New bucket created" width="500" style="text-align:center;"></p>

Copy the ARN of the new bucket.

Click on the name of the new bucket and go to the Objects tab to create folders and to upload the config file. 

<p align="center"><img src="aws9.png" alt="File uploaded" width="500" style="text-align:center;"></p>

### Checklist for the lambda function

- Has access to S3 through execution role
- Has 512 mb allocated memory and 30 timeout
- Has chromium and puppeteer-core installed in Lambda layers

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

Actually, let's give it all access there is, so that Lambda functions can also write to S3.  
https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_s3_rw-bucket.html

### Reading from S3

#### Python

A sample script reading from S3 in Python would look like this:

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

#### Node.js

A sample script reading from S3 in Node.js would look like this:

```
const AWS = require('aws-sdk')

exports.handler = async (event) => {
    var s3 = new AWS.S3();
    let contentFile;
    let response;
    try {
    const file = await s3
      .getObject({ Bucket: 's3-925332', Key: 'projects/citizenship/cred.config' })
      .promise();
    contentFile = file.Body.toString();
    response = {
        statusCode: 200,
        body: contentFile,
    };
    } catch (err) {
    response = {
        statusCode: 500,
        body: err,
    };
    }
    return response;
};
```

AWS Lambda has acces to AWS SDK by default, but not the latest version. 

Note that:


```
const file = await s3
    .getObject({ Bucket: 's3-925332', Key: 'projects/citizenship/cred.config' })
    .promise();
```

same as

```
const file = await s3.getObject({ Bucket: 's3-925332', Key: 'projects/citizenship/cred.config' }).promise();
```

An example using puppeteer on nodejs:  
https://gist.github.com/apal21/4746f9d3935f24485e40d5fd054f3202

https://gist.github.com/apal21/80c2cfe3606d30ae7d1c655ba6100ea4 - thank you for the example!


### Accessing a webpage from Lambda

A layer with Selenium and Chromium in python:
https://github.com/vittorio-nardone/selenium-chromium-lambda

Awesome layers:
https://github.com/mthenw/awesome-layers

Before layers:
https://robertorocha.info/setting-up-a-selenium-web-scraper-on-aws-lambda-with-python/ (cool data journalist!)

Issues:
https://stackoverflow.com/questions/67807768/chrome-driver-and-chromium-binaries-are-not-working-on-aws-lambda

Using puppetter:  
https://awstip.com/how-to-run-puppeteer-on-aws-lambda-using-layers-b1583ebd7120  
(layer with puppeteer) https://github.com/RafalWilinski/serverless-puppeteer-layers   (not recently updated)


(npm) https://acloudguru.com/blog/engineering/serverless-browser-automation-with-aws-lambda-and-puppeteer  
(dockerfile) https://aws.amazon.com/blogs/architecture/field-notes-scaling-browser-automation-with-puppeteer-on-aws-lambda-with-container-image-support/  
(decrease size) https://oxylabs.io/blog/puppeteer-on-aws-lambda  
(configuring) https://medium.com/limehome-engineering/running-pyppeteer-on-aws-lambda-with-serverless-62313b3fe3e2  

(installing pupeteer) https://www.npmjs.com/package/chrome-aws-lambda  
(some discussion on above) https://stackoverflow.com/questions/57408181/how-to-bundle-headless-chromium-module-with-aws-lambda
(github) https://github.com/alixaxel/chrome-aws-lambda - looks good but without a preconfigured layer. should use puppetter-core

(fresh preconfigured layer) https://www.npmjs.com/package/@sparticuz/chromium
https://github.com/Sparticuz/chromium

(fresh preconfigured layer) https://github.com/shelfio/chrome-aws-lambda-layer
(using above) https://acloudguru.com/blog/engineering/serverless-browser-automation-with-aws-lambda-and-puppeteer
(also using above) https://www.techmagic.co/blog/running-headless-chrome-with-aws-lambda-layers/
(above mentioned in the comments) https://dev.to/gerybbg/puppeteer-in-an-aws-lambda-function-part-2-4hfi

---

Let's try using https://www.npmjs.com/package/@sparticuz/chromium. It's fresh! 
Downloaded a layer generated by the actions in the repo:
https://github.com/Sparticuz/chromium/actions -> chromium.zip

Upload to S3 bucket.
Create folder named lib. Upload zip to the folder. copy the URL.
Go to console - Lambda - Layers - Create layer. Paste the URL.

Go to Lambda - Function - citizenship-ircc. Click on the Layers in the chart which brings you to the bottom of the page. Add a new custom layer and specify it as the newly created chromium-aws.

It's only chromium! 
Let's find puppeteer too.
Chromium 107.0.5296.0 - Puppeteer v18.1.0 - this would make me install puppeteer-core from somewhere else. 

We probably will need to install npm locally to create the layer.


Order of merge layers doesn't matter in our case (when does it?).

#### Installing chromium


#### Installing puppeteer-core

##### Installing nodejs and uploading dependencies

Let's follow these steps:  
https://medium.com/@anjanava.biswas/nodejs-runtime-environment-with-aws-lambda-layers-f3914613e20e

Like  
```
npm install --save puppeteer-core@18.1.0
```

Discussion on how to install:  
https://stackoverflow.com/questions/34437900/how-to-load-npm-modules-in-aws-lambda

How to use github for building layers:  
https://www.qloudx.com/a-simpler-way-to-manage-lambda-layers-with-npm-dependencies/

From AWS:  
https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html

Also these:  
https://blog.insighture.com/article/running-puppeteer-in-lambda/

Some thought about whether two libraries should be in the same layer:  
https://dev.to/gerybbg/puppeteer-in-an-aws-lambda-function-part-2-4hfi

---

Let's try https://github.com/shelfio/chrome-aws-lambda-layer. Go to Lambda - Functions - citizenship-ircc. Click on the Layers in the chart which brings you to the bottom of the page. Add a new custom layer and specify ARN for your region from https://github.com/shelfio/chrome-aws-lambda-layer.

Now the function works! Both dependencies (puppeteer-core and chromium) are found. This is a default node.js stub created by Amazon with only two checks for dependencies added.

```
exports.handler = async (event) => {
    const puppeteer = require("puppeteer-core");
    const chromium = require("@sparticuz/chrome-aws-lambda");
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
```

### Accessing DOM, making screenshots

https://stackoverflow.com/questions/55237748/how-to-get-text-inside-div-in-puppeteer


```
const AWS = require('aws-sdk');
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const BUCKET_NAME = 's3-925332';  // name of the AWS S3 bucket to store configs and results
const PROJECT_PATH = 'projects/citizenship/'; // path in the S3 bucket to the project directory 

async function save_screenshot(elem, filename, isPage){
    var s3 = new AWS.S3();
    var key_name = PROJECT_PATH + 'output/' + filename;
    let screenshot;
    if (isPage == true) {
        screenshot = await elem.screenshot({fullPage: true});
    }
    else {screenshot = await elem.screenshot();}
    const params = { Bucket: BUCKET_NAME, Key: key_name, Body: screenshot };
    await s3.putObject(params).promise();
}

async function save_page(page, filename){
    var s3 = new AWS.S3();
    var key_name = PROJECT_PATH + 'output/' + filename;
    let dumpHTML = await page.content();
    const params = { Bucket: BUCKET_NAME, Key: key_name, Body: dumpHTML };
    await s3.putObject(params).promise();
    
}

async function checkPerson (credPerson) {
    var namePerson = credPerson.name;
    var loginPerson = credPerson.login;
    var passwordPerson = credPerson.password;
    
    var res;
    let browser;

    try {
        browser = await puppeteer.launch({
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.goto("https://cst-ssc.apps.cic.gc.ca/en/login", { waitUntil: 'networkidle2' });
        await save_screenshot(page, 'step1'+namePerson+'.png', true);
        await save_page(page, 'step1' + namePerson + '.html');
        
        
        const signInButton = await page.waitForXPath("//button[text()[contains(., 'Sign into your tracker account')]]");
        await signInButton.click( {waitUntil: 'domcontentloaded'});
        await save_screenshot(page, 'step2'+ namePerson+'.png', true);
        await save_page(page, 'step2' + namePerson + '.html');
        
        const uci = await page.waitForSelector('#uci');
        await uci.type(loginPerson);
        const password = await page.waitForSelector('#password');
        await password.type(passwordPerson);
        const submitButton = await page.waitForXPath("//button[text()[contains(., 'Sign in')]]");
        await submitButton.click({waitUntil: 'domcontentloaded'});
        
        const lastUpdateDateEl = await page.waitForXPath("//dd[contains(@class,'date-text')]");
        await save_screenshot(page, 'step3'+ namePerson+'.png', true);
        await save_page(page, 'step3' + namePerson + '.html');
        
        let lastUpdateDateVal = await (await lastUpdateDateEl.getProperty('textContent')).jsonValue();
        const lastUpdateDate = lastUpdateDateVal.trim();
        
        var activities = await page.$x("//li[@class='activity']");
        let result_activities = [];
         for (let acti in activities){
            let acti_element = activities[acti];
            const acti_date_el = await page.evaluate( (el) =>  {
                let elements = el.getElementsByClassName('date');
                let result = '';
                if(elements.length>0) {
                    result = elements[0].textContent.trim();
                }
                return result;
            }, acti_element);
            const acti_status_el = await page.evaluate( (el) =>  {
                let elements = el.getElementsByClassName('activity-title');
                let result = '';
                if(elements.length>0) {
                    result = elements[0].textContent.trim();
                }
                return result;
            }, acti_element);
            const acti_text_el = await page.evaluate( (el) =>  {
                let elements = el.getElementsByClassName('activity-text');
                let result = '';
                if(elements.length>0) {
                    result = elements[0].textContent.trim();
                }
                return result;
            }, acti_element);
            let acti_object = {activity_date: acti_date_el, activity_status: acti_status_el, activity_text: acti_text_el};
            result_activities.push(acti_object);
        }
        let result_person = {name: namePerson, status: "ok",  lastUpdateDate: lastUpdateDate, timeline: result_activities};
        res = JSON.stringify(result_person);
        
        let res_area = await page.$x("//section[@class='application-history-container']"); 
        await save_screenshot(res_area[0], 'timeline'+namePerson+'.png', false);
        
    }
    catch (e){
        console.log(e);
        console.log("Error");
        res = {name: namePerson, status: "error"};
    }
    finally {
        await browser.close();
    }
    return res;
}

async function checkPeople () {
    var s3 = new AWS.S3();
    let contentFile;
    let response='';
    try {
        const file = await s3
         .getObject({ Bucket: BUCKET_NAME, Key: PROJECT_PATH + 'config/cred.config' })
         .promise();
        contentFile = file.Body.toString();
        let credFile = JSON.parse(contentFile);
        let credentials = credFile.credentials;
        let results = [];
        for (let cred in credentials){
            if (credentials[cred].check == 'TRUE') {
                results.push(await checkPerson(credentials[cred]));
            }
        response = {
            statusCode: 200,
            body: results,
            };
        }
    } catch (err) {
        response = {
            statusCode: 500,
            body: err,
        };
    }
    return response;
}

exports.handler = async (event) => {
    return await checkPeople();
}; 

```

### Sending email with the function details

https://aws.amazon.com/premiumsupport/knowledge-center/lambda-send-email-ses/

Execution role

Actually, we'll create a new function altogether. We will not need to send email everytime. But for the simplicity sake I will use the same execution role for both functions. 

Go to IAM -> Roles -> current lambda role (LambdaWriteAccessRole in my case) -> Permissions -> Custom policy (LambdaAccessS3 in my case) -> JSON tab.
Add the code to other statements:

```
{
            "Effect": "Allow",
            "Action": [
                "ses:SendEmail",
                "ses:SendRawEmail"
            ],
            "Resource": "*"
        }
```

Create identity and verify your email address. For our purposes we'll stay in the Amazon SES Sandbox environment, meaning that we'll send emails from a verified email address to a verified email address (might be the same one). 

In order to avoid storing your email in the source code, make a new environment variable for the function, with key = "email" and value = your email.

```
var AWS = require("aws-sdk");
var ses = new AWS.SES({ region: "ca-central-1" });
var emailAddress = process.env.email;
const BUCKET_NAME = process.env.bucket_name;  // name of the AWS S3 bucket to store configs and results
const PROJECT_PATH = 'projects/citizenship/'; // path in the S3 bucket to the project directory 

exports.handler = async function (event) {  
  var s3 = new AWS.S3();
  let S3_params_text = { Bucket: BUCKET_NAME, Delimiter: '/', Prefix: PROJECT_PATH + 'output/timeline-text/' };
  const listKeysText = await s3.listObjectsV2(S3_params_text).promise();
  
  let keysTextContents = listKeysText.Contents;
  let str_update = '';
  
  for (let t in keysTextContents){
    let key = keysTextContents[t].Key;
    let file = await s3
         .getObject({ Bucket: BUCKET_NAME, Key: key })
         .promise();
        let contentFile = file.Body.toString();
        let jsonResult = JSON.parse(contentFile);
        str_update+=(jsonResult.name + ': ' + jsonResult.lastUpdateDate + ' | ');
        
  }
  console.log(str_update);
  
  var params = {
    Destination: {
      ToAddresses: [emailAddress],
    },
    Message: {
      Body: {
        Text: { Data: "Citizenship Tracker Update - " + str_update },
      },

      Subject: { Data: "Citizenship Tracker Update - " + str_update },
    },
    Source: emailAddress,
  };
  let emailSent = ses.sendEmail(params).promise();
  return "ok";
  
};
```

To list all files generated by the function we need to add the following policy to the execution role:

```
{
            "Action": [
                "s3:ListBucket*"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::s3-925332"
            ]
        }
```

Notice that return value is a constant. Initially it was:

```
return ses.sendEmail(params).promise();
```

But this function would be invoked twice. I assumed there was something not expected with the type of the response and AWS thought the first run was unsuccessful. With return value as a constant the function runs once as expected. 

### Chaining Lambda functions into a sequence

Options:

- A higher level lambda function invoking other funtions:
    - Event
    - Response
- Step Functions (Amazon scripts)
- Flags system (Functions start up after previous functions leave flag files). 

https://www.refinery.io/post/how-to-chain-serverless-functions-call-invoke-a-lambda-from-another-lambda  
(funny how there ebbs and flows between code-only and GUI methods to create sequences. Datastage had a tool to design sequences, py code evolved to be handled by Airflow, now AWS Lambda need there own dedicated tools for sequencing)  
https://www.refinery.io/post/jumping-the-rabbit-hole-walking-around-web-app-obfuscation-with-request-interception - mmm, some rabbit hole about scraping obfuscated sites. Also, maps!  


For now, Invoking with the event type:

In the execution role add this policy (copy the ARN of your function that sends email):
```
{
            "Effect": "Allow",
            "Action": "lambda:InvokeFunction",
            "Resource": "arn:aws:lambda:ca-central-1:633389222153:function:citizenship-status-email"
        }
```

The invocation: 
       
```
const lambdaParams = {
            FunctionName: 'citizenship-status-email',
            InvocationType: 'Event',
            };
        var lambda = new AWS.Lambda();
        const lambdaResult = await lambda.invoke(lambdaParams).promise();
```

### Scheduling  

https://www.refinery.io/post/how-to-schedule-an-aws-lambda-execution-serverless-scheduling-cron-jobs  

Use EventBridge to schedule daily run of the lambda function.   
<p align="center"><img src="awsEventBridge1.png" alt="Creating an event on a schedule" width="500" style="text-align:center;"></p>
<p align="center"><img src="awsEventBridge2.png" alt="Specifying the schedule" width="500" style="text-align:center;"></p>
<p align="center"><img src="awsEventBridge3.png" alt="Specifying the function to run" width="500" style="text-align:center;"></p>
    
### Accessing Lambda through REST APIs

https://stackoverflow.com/questions/50276852/lambda-function-within-vpc-doesnt-have-access-to-public-internet

https://medium.com/@shontauro/how-can-i-turn-my-restful-api-into-a-serverless-application-and-deploy-it-to-aws-lambda-step-by-ec7ce38e18be

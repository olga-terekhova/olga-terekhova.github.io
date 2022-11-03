There was a small piece of code in the telegram example that I used. Ended up not needed, but it might me useful - understanding relative paths on AWS:

```
here = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.join(here, "./vendored"))
```

Lambda from another Lambda:  https://www.sqlshack.com/calling-an-aws-lambda-function-from-another-lambda-function/  
Invoking using a queue:  https://stackoverflow.com/questions/70993296/invoke-a-aws-lambda-function-n-number-of-times-in-a-loop-get-back-responses-for  
Using AWS Step:  https://stackoverflow.com/questions/35754766/nodejs-invoke-an-aws-lambda-function-from-within-another-lambda-function  

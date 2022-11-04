Looks like a good description of going from S3 object to Buffer to base64 String (in NodeJS):   
https://stackoverflow.com/questions/62708802/how-to-convert-buffer-into-image-using-nodejs  

Same in Python:  
https://stackoverflow.com/questions/62332583/django-python-convert-image-from-aws-s3-bucket-to-base64

Compare encoding into base64 in python:  
https://stackabuse.com/encoding-and-decoding-base64-strings-in-python/
and nodejs:  
https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/

Interesting library for asynchrounous work with Telegram bots:  
https://github.com/aiogram/aiogram

I ended up not needing to convert files into base64:  

```
file_content = file['Body'].read()
f64 = base64.b64encode(file_content)
b64_message = f64.decode('utf-8')
```        

Because I just sent a file:  

```
 file_content = file['Body'].read()
file_dict = {"photo": file_content}
data_res = {"chat_id": chat_id, "caption": "Test Caption"}
url = BASE_URL + "/sendPhoto" 
requests.post(url, data = data_res, files = file_dict)
```

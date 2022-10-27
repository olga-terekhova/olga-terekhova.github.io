Assuming

```
let creds = JSON.parse(contentFile);
let credentials = creds.credentials;
```

Why these are not identical?

```
for(let i = 0; i< credentials.length; i++){
    console.log(credentials[i]);
}
```

and

```
for (let cred in credentials){
    console.log(cred);
    }
```

Oh, got it. This works:

```
for (let cred in credentials){
        console.log(credentials[cred]);
    }
```

cred is not the object of the array itself. It's an iterator of this array. I still need to write credentials[cred] to access the object corresponding to the index. 

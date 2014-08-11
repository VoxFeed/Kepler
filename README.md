# Kepler-JQ

Kepler-JQ is a light weight Job Queue for Node.js. It runs a Node.js server that is ready to get jobs and store them
to a small MongoDB database or get the instruction to pull jobs from it.

## How to use.

### 1. Download the code.

### 2. Run mongodb. 
```
  $ mongod
```

### 3. Install dependencies.
````
  npm install
```
### 4. Run the server.
```
  node server.js
```
### 5. Copy the api file into your app.
```
  cp lib/keppler_api.js /path/to/yourapp/lib
```
### 6. Require the api from whenever you want to use it.
```
  var kp = require(`path/to/keppler_api.js`);
  
  /*
    put method:
    Sends a job with a namespace 'query' and a specific configuration for this fake app, 
    the object is completely free for you to define and use within your workers and 
    requesters. The object sent as a second parameter will be serialized and stored as 
    string, you will recover it later.
  */
    kp.put("query", {cmd: "req", source: "twitter", ids: [1,2,3]}, function(data){
      console.log("Data after put ", data);
    });
  
  /*
    pet method:
    Finds a job with namespace 'query' and returns a json string in the following format:
    {status:"success", jobId:"someid", data:{cmd:"req", src:"twitter", ids:[1,2,3]}};
    
    Once a job is found and returned through this method it gets deleted from the 
    database.
  */
    keppler.get("query", function getCallback(data) {
      var jsonData = JSON.parse(data);
      if (jsonData.status === "success") {
        TwitterRequester.request(jsonData.ids, someCallback);
      }
    });
  
  /*
    removeOne method:
    Finds a job with a given jobId and removes it from a database. If found and removed,
    it will respond with a  json string in the following format:
    {status : "success", jobId : "someid"}
    
    The jobId returned should match with the one you sent to the method, it is returned 
    soyou can be sure the right job got deleted.
    
    If the job was not found it will return a json string in the following format:
    {status : "fail", message : "not found"};
  */
  
  var idToRemove = 'someid';
  keppler.remove('idToRemove', function removeCallback(data) {
    var jsonData = JSON.parse(data);
    if (jsonData.status === 'success' && jsonData.jobId === idToRemove) {
      someCallback();
    }
  });
  
```

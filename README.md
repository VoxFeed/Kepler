# Kepler-JQ

Kepler-JQ is a light weight Job Queue for Node.js. It's a package that connects to a mongoDB database and it's ready to get and store jobs with customized data.

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
  cp lib/kepler.js /path/to/yourapp/lib
```
### 6. Require the api from whenever you want and use it.
```
  var kp = require(`path/to/kepler.js`);
  
  /*
    put method:
    Sends a job with a namespace 'query' and a specific configuration for this fake app, 
    the object is completely free for you to define and use within your workers and 
    requesters. The object sent as a second parameter will be serialized and stored as 
    string, you will recover it later. This job will be pushed into the queue.
  */
    kp.put("query", {cmd: "req", source: "twitter", ids: [1,2,3]}, function(data){
      console.log("Data after put ", data);
    });
  
  /*
    pet method:
    Finds a job with namespace 'query' and returns a json string in the following format:
    {status:"success", jobId:"someid", data:{cmd:"req", src:"twitter", ids:[1,2,3]}};
    
    Once a job is found and returned through this method it gets deleted from the 
    queue.
  */
    kp.get("query", function getCallback(data) {
      var jsonData = JSON.parse(data);
      if (jsonData.status === "success") {
        TwitterRequester.request(jsonData.ids, someCallback);
      }
    });
  
  /*
    remove method:
    Finds a job with a given jobId and removes it from the queue. If found and removed,
    it will respond with a  json string in the following format:
    {status : "success", jobId : "someid"}
    
    The jobId returned should match with the one you sent to the method, it is returned 
    so you can be sure the right job got deleted.
    
    If the job was not found it will return a json string in the following format:
    {status : "fail", message : "not found"};
  */
  
  var idToRemove = 'someid';
  kp.remove('idToRemove', function removeCallback(data) {
    var jsonData = JSON.parse(data);
    if (jsonData.status === 'success' && jsonData.jobId === idToRemove) {
      someCallback();
    }
  });
  
  /*
    removeAll method:
    Finds all jobs within a given namespace and removes them from the queue. 
    If found and removed it will return a json string in the following format:
    {status : "success", count : Number}
    
    The count returned represents the amount of jobs removed.
    
    If no jobs where found it will return a json string in the following format:
    {status : "fail", message : "not found"};
  */
  
  kp.removeAll("query", function removeCallback(data) {
    var jsonData = JSON.parse(data);
    if (jsonData.status === 'success' && jsonData.count > 0) {
      someCallback();
    }
  });
  
```
// Testing UPDATE
kp.put('NAMESPACE_1', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('Testing UPDATE (N1)', error, data);

    kp.put('NAMESPACE_1', {id : 7654321, user : 'user', foo : 'bar'}, function(error, data){
        console.log('Testing UPDATE (N1)', error, data);

        // Testing REMOVE_ALL
        kp.removeAll('NAMESPACE_1', function(error, data){
            console.log('Testing REMOVE_ALL', error, data);
        });

    });

});

kp.put('NAMESPACE_2', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('Testing UPDATE (N2)', error, data);

    // Testing FETCH and REMOVE
    kp.fetch('NAMESPACE_2', function(error, data){
        console.log('Testing FETCH', error, data);
        if(!error){

            kp.remove(data.jobId, function(error, data){
                console.log('Testing REMOVE', error, data);
            });

        }
    });

});

kp.put('NAMESPACE_3', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('Testing UPDATE (N3)', error, data);

    // Testing GET
    kp.get('NAMESPACE_3', function(error, data){
        console.log('Testing GET', error, data);
    });

});
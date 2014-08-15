var kp_client = require("../lib/kepler");

var kp = new kp_client({
    host : 'localhost'
});

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
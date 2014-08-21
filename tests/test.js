var kp_client = require("../lib/kepler");

var kp = new kp_client({
    host : 'localhost'
});

// Testing UPDATE
kp.put('NAMESPACE_1', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('\n\nTesting UPDATE (N1)\n', error, data);

    kp.put('NAMESPACE_1', {id : 7654321, user : 'user', foo : 'bar'}, function(error, data){
        console.log('\n\nTesting UPDATE (N1)\n', error, data);

        // Testing REMOVE_ALL
        kp.removeAll('NAMESPACE_1', function(error, data){
            console.log('\n\nTesting REMOVE_ALL\n', error, data);
        });

    });

});

kp.put('NAMESPACE_2', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('\n\nTesting UPDATE (N2)\n', error, data);

    // Testing FETCH and REMOVE
    kp.fetch('NAMESPACE_2', function(error, data){
        console.log('\n\nTesting FETCH\n', error, data);
        if(!error){

            kp.remove(data.jobId, function(error, data){
                console.log('\n\nTesting REMOVE\n', error, data);
            });

        }
    });

});

kp.put('NAMESPACE_3', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('\n\nTesting UPDATE (N3)\n', error, data);

    // Testing GET
    kp.get('NAMESPACE_3', function(error, data){
        console.log('\n\nTesting GET\n', error, data);
    });

});

// Testing GET MULTIPLE
kp.put('NAMESPACE_4', {id : 1234567, user : 'user', foo : 'bar'}, function(error, data){
    console.log('\n\nTesting UPDATE (N4)\n', error, data);

    kp.put('NAMESPACE_4', {id : 7654321, user : 'user', foo : 'bar'}, function(error, data){
        console.log('\n\nTesting UPDATE (N4)\n', error, data);

        // Testing GET MULTIPLE
        kp.getMultiple('NAMESPACE_4', 10, function(error, data){
            console.log('\n\nTesting GET MULTIPLE\n', error, data);
        });

    });

});
inlets = 2;
outlets = 4;

var parsed; // global??

setinletassist(0,"json string");

function anything()
{
	var a = arrayfromargs(messagename, arguments);
	parsed = JSON.parse(a[0]);
	outlet(0, parsed);
}

Object.resolve = function(path, obj) {
    return path.split('.').reduce(function(prev, curr) {
        return prev ? prev[curr] : undefined
    }, obj || obj)
}

function get(obj, path)
{
	var myObj = parsed[obj];
	var out = Object.resolve(path, myObj);
	// post('get result: ' + out + '\n');
	outlet(1, out);
}

function deepSet(obj, path, value) {
    var schema = obj;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;
    // post(JSON.stringify(schema, null, 2) + '\n');
    // post('deep set!! ' + JSON.stringify(schema, null, 2) + '\n');
    return schema;
}

function set(obj, path, value)
{
	// post('setting ' + obj + ' ' + path + ' to ' + value + '\n');
	var myObj = parsed[obj];
	parsed[obj] = deepSet(myObj, path, value);
	get(obj, path);
}

function stringify(obj)
{
	var myObj = parsed[obj];
	outlet(2, JSON.stringify(myObj));
}

function post(obj, address)
{
	var myObj = parsed[obj];
	var string = JSON.stringify(myObj);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', address);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhr.onreadystatechange = function(r) {
                                
                                outlet(3, r.status);

                            }


    xhr.send(string);

}


var mongoose = require('mongoose');
var async = require('async');
var md5 = require('md5');

var conn = mongoose.createConnection('mongodb://127.0.0.1/user_demo');
//console.log("connection !:",conn);

var users_schema = mongoose.Schema({}, {
	strict: false,
	collection: 'users'
});
var users_profile_schema = mongoose.Schema({}, {
	strict: false,
	collection: 'usersProfile'
});

var users = conn.model('users', users_schema);
var usersProfile = conn.model('usersProfile', users_profile_schema);

//defining json array for user data
var user_data = [{
	'firstName': 'a',
	'email': 'a@gmail.com',
	'lastName': 'u',
	'password': md5('dhfghff'),
	'DOB': "1994-10-04",
	'mobileNo': 9676745745
    },
    {
	'firstName': 'b',
	'email': 'b@gmail.com',
	'lastName': 'w',
	'password': md5('hdfg'),
	'DOB': "1998-11-14",
	'mobileNo': 7859829300
    },
    {
	'firstName': 'c',
	'email': 'c@gmail.com',
	'lastName': 'x',
	'password': md5('eyuryr'),
	'DOB': "1991-10-21",
	'mobileNo': 9874352104
    },
    {
	'firstName': 'd',
	'email': 'd@gmail.com',
	'lastName': 'y',
	'password': md5('rerhe'),
	'DOB': "2000-06-06",
	'mobileNo': 9882352441
    },
    {
	'firstName': 'e',
	'email': 'e@gmail.com',
	'lastName': 'z',
	'password': md5('eyweuyttt'),
	'DOB': "1999-10-20",
	'mobileNo': 1109745745
}];

// //calling insert and notify function
insertAndNotify(user_data, function(err) {
	if(err) {
		console.log("error");
		process.exit();
	} else {
		//console.log("All done!",user_data);
		process.exit();
	}
})

// //inert and notify function body
function insertAndNotify(records, main_callback) {
	async.eachLimit(records, 5, function(row, callback) {
		//console.log("row:",row);
		var new_users = new users({
			firstName: row.firstName,
			email: row.email,
			lastName: row.lastName,
			password: row.password,
		});
		var new_users_profile = new usersProfile({
			user_id: new_users._id,
			DOB: row.DOB,
			mobileNo: row.mobileNo
		});
		
		new_users.save(function(err, row) {
			if(err) {
				console.log("error: ",err);
				callback(err);
			} else {
				console.log("row for user collection:",row);
				//console.log("usersProfile",new_users_profile);
				new_users_profile.save(function(err, row) {
					if(err) {
						console.log("error:",err);
						callback(err);
					} else {
						console.log("row for user profile collection:", row);
						callback();
					}
			    });
		    }
		    }); 
	    }, function(err) {
		main_callback(err);
	})
}

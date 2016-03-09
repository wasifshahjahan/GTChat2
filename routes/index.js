var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var status = false;
var sql = require("mssql");

var Connection = require("tedious").Connection;
/* var dbConfig = {
    server: "192.168.1.244",
    user: "sa",
    password: "sa@123",   
    port: 1433,
    options: { encrypt: true, database: 'PankajNodeJs' }
}; */

var dbConfig = {
    userName: 'gtadmin1@jxqw748l9k',
    password: 'M0rph!us',
    server: 'jxqw748l9k.database.windows.net',
    // If you are on Azure SQL Database, you need these next options.
   options: { encrypt: true, database: 'PankajNodeJs' }
};

var mycon = new Connection(dbConfig);
mycon.on('connect', function (err) { console.log("New Pankaj connection connect to sql db"); });
var Request = require("tedious").Request;
var Types = require("tedious").TYPES
function registersqldb(fname, lname, email, pwd) {
    //request = new Request("INSERT INTO [PankajNodeJs].[dbo].[AzureLogin] (id, FirstName, LastName, Email, Password) OUTPUT INSERTED.id VALUES (0,'aaa','aa','ss@email','@pwd');", function (err) {
    request = new Request("Insert into AzureLogin( FirstName, LastName, Email, Password) values(?,?,?,?)", 'pankaj', 'kumar', 'pankaj@gmail.com', '152345', function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('id', Types.INT, 0);
    request.addParameter('fname', Types.NVarChar, fname);
    request.addParameter('lname', Types.NVarChar, lname);
    request.addParameter('email', Types.NVarChar, email);
    request.addParameter('pwd', Types.NVarChar, pwd);
    request.on('row', function (columns) {
        columns.foreach(function (column) {
            if (column.value === null) {
                console.log("Pankaj this is null");
            }
            else {
                console.log("Item inserted:" + column.value);
            }
        });
    });
    mycon.execSql(request);
};
function registerSql(fname, lname, user, pwd) {
    
    var ids = 0;
    var conn = new sql.Connection(dbConfig);
    var req = new sql.Request(conn);
    console.log("DB is conneted here for Register pankaj " + conn + "hgdck" + req);
    console.log("First name :" + fname + ",Last name: " + lname + ",User: " + user + ",Password: " + pwd);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        var pankaj = {
            FirstName: fname,
            LastName: lname,
            Email: user,
            Password: pwd
        };
        console.log("Now execute query");
        console.log(pankaj);
        
        req.query('INSERT INTO AzureLogin SET ?', pankaj, function (err, recordset) {
            //req.query('INSERT INTO AzureLogin (id,FirstName,LastName, Email, Password) VALUES (?, ?, ?, ?, ?)', [0, fname, lname, user, pwd], function (err, recordset) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("successfully registered New User" + recordset);
            }
            console.log("execute query");
            conn.close();
        });
        console.log(req.query);
    })
    console.log(req.query);
    
    return status;
}

/* GET home page. */
router.get('/', function (req, res) {
    res.render('pankaj', { title: 'pankaj' });
});
router.get('/chat', function (req, res) {
    res.render('pankaj', { pankaj: 'pankaj is online now' });
});

router.post('/register', function (req, res) {
    if (req.body.db == 'MySql') {
        registerMySql(req.body.fname, req.body.lname, req.body.email, req.body.password);
       /// $('#msg').appendtext("Successfully registerd");
        res.render('pankaj', { title: 'Pankaj kumar', value: 'successfully register now login' });
    }
    else {
        // registerqldb(req.body.fname, req.body.lname, req.body.email, req.body.password);
        // registerSql(req.body.fname, req.body.lname, req.body.email, req.body.password);
        insertRow(req.body.fname, req.body.lname, req.body.email, req.body.password);
       // $('#msg').appendtext("Successfully registerd");
        res.render('pankaj', { title: 'Pankaj kumar', value: 'successfully register now login' });
    }
});
router.post('/login', function (req, res) {
    if (req.body.db == 'MySql') {
        console.log("This is MySql login");
        //login(req.body.email, req.body.password);
        if (req.body.email != '' && req.body.password != '') {
            console.log("calling function");
            var conn = new mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'sa@123',
                database: 'nodejs'

            })
            //conn.connect();
            console.log("DB is conneted here for login pankaj ");
            // console.log(user + "" + pwd);
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                conn.query('SELECT * from AzureLogin where Email=\'' + req.body.email + '\' and Password=\'' + req.body.password + '\'', function (err, recordset) {
                    console.log(recordset);
                    //  console.log(recordset[0].Email);
                    if (recordset.length == 0) {
                        res.render('confirm', { value: 'Invalid Login' });
                    }
                    else {
                        for (var i = 0; i < recordset.length; i++) {
                            console.log(recordset[i].Email);
                            if (recordset[i].Email == req.body.email && recordset[i].Password == req.body.password) {
                                console.log(1);
                                status = true;
                                console.log(status);
                                res.render('confirm', { value: 'You are Logged In.' });
                                break;
                            }
                            else {
                                status = false;
                                console.log(status);
                                res.render('confirm', { value: 'Invalid Login' });
                            }
                       
            
                        }
                    }
            
            
            //conn.close();
                });
            })
        }
        else {
            console.log("Please fill all field");
        }
    }
    else {
        var emailid = req.body.email;
        var password = req.body.password;
        console.log("This is sql login>>>" + req.body.email + ",,," + req.body.password);
        console.log("This is sql login>>>" + emailid + ",,," + password);
        var conn = new sql.Connection(dbConfig);
        var req = new sql.Request(conn);
        console.log("DB is conneted here pankaj ");
        conn.connect(function (err) {
            if (err) {
                console.log(err);
                return;
            }
            console.log("now executing query , where Email=\'' + req.body.email + '\' and Password=\'' + req.body.password + '\'  where Email='+ emailid+' and Password='+ password+'");
            req.query('select * from AzureLogin', function (err, recordset) {
                //console.log(recordset.length);
                // console.log(recordset[0].Email);
                if (recordset.length == 0) {
                    res.render('confirm', { value: 'Invalid Login' });
                }
                else {
                    for (var i = 0; i < recordset.length; i++) {
                        console.log(recordset[i].Email);
                        if (recordset[i].Email == emailid && recordset[i].Password == password) {
                            console.log(1);
                            status = true;
                            console.log(status);
                            res.render('chat', { pankaj: recordset[i].FirstName });
                            break;
                        }
                        else if(i== recordset.length-1) {
                            status = false;
                            console.log(status);
                            res.render('confirm', { value: 'Invalid Login' });
                        }
                       
            
                    }
                }
                conn.close();
            });
        })
    }
   // res.render('pankaj', { title: 'Pankaj kumar', value: 'successfully register now login' });
});
function registerMySql(fname, lname, user, pwd) {
    var conn = new mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'sa@123',
        database: 'nodejs'
    })
    console.log("DB is conneted here for login pankaj ");
    console.log("First name :" + fname + ",Last name: " + lname + ",User: " + user + ",Password: " + pwd);
    conn.connect(function (err) {
        if (err) {
            console.log(err);
            return;
        }
        conn.query('INSERT INTO azurelogin (id,FirstName,LastName, Email, Password) VALUES (?, ?, ?, ?, ?)', [0, fname, lname, user, pwd], function (err, recordset) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("successfully registered New User");
            }
        });
    })
    return status;
}
function insertRow(fname, lname, user, pwd) {
    var dbConn = new sql.Connection(dbConfig);
    dbConn.connect().then(function () {
        var transaction = new sql.Transaction(dbConn);
        transaction.begin().then(function () {
            var request = new sql.Request(transaction);
            request.query("Insert into AzureLogin (FirstName,LastName, Email, Password) values ('" + fname + "','" + lname + "','" + user + "','" + pwd + "')")
        .then(function () {
                transaction.commit().then(function (recordSet) {
                    console.log(recordSet);
                    
                    dbConn.close();
                }).catch(function (err) {
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                });
            }).catch(function (err) {
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
            });
            
        }).catch(function (err) {
            console.log(err);
            dbConn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });
}
//insertRow('pankajsaini.vce@gmail.com', '9917906036');

router.get('/changepassword', function (req, res) {
    res.render('changepassword', { value: 'Pankaj change password.' });
});
router.post('/changepassword', function (req, res) {
    if (req.body.email == '' && req.body.oldpassword == '' && req.body.newpassword == '' && req.body.confirmpassword == '') {
        res.render('changepassword', { pankaj: 'Please Fill all field corectly' });
    }
    else if (req.body.newpassword != req.body.confirmpassword) {
        res.render('changepassword', { pankaj: 'Your Confirm password do not match.' });
    }
    else {
        if (req.body.db == 'MySql') {
            console.log("you are use mysql db to change password");
            // connection.query('UPDATE users SET Name = ? WHERE UserID = ?', [name, userId])
            var conn = new mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'sa@123',
                database: 'nodejs'
            })
            console.log("DB is conneted here for update password pankaj ");
            console.log("email :" + req.body.email + ",old password: " + req.body.oldpassword + ",new password: " + req.body.newpassword + ",confirm password: " + req.body.confirmpassword);
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                conn.query('SELECT * from AzureLogin where Email=\'' + req.body.email + '\' and Password=\'' + req.body.oldpassword + '\'', function (err, recordset) {
                    console.log(recordset);
                    //console.log(recordset[0].Email);
                    if (recordset.length == 0) {
                        res.render('changepassword', { pankaj: 'Invalid account to change passsword in mysql' });
                    }
                    else {
                        console.log("Account is coorect now change pwd");
                        conn.query('UPDATE azurelogin SET Password = ? WHERE Email = ?', [req.body.newpassword, req.body.email], function (err, recordset) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("successfully update password New User");
                                res.render('changepassword', { pankaj: 'Your  password Successfully updated in MySql' });
                            }
                        });
                    }
                });
             
            })
           
        }
        else {
            var emailid1 = req.body.email;
            var password1 = req.body.oldpassword;
            var pwd = req.body.newpassword;
            var pwd2 = req.body.confirmpassword;
            console.log("you are use sql db to change password");
            var conn = new sql.Connection(dbConfig);
            var req = new sql.Request(conn);
            console.log("DB is conneted here for changepassword pankaj ");
            console.log("email :" + emailid1 + ",old password: " + password1 + ",new password: " + pwd + ",confirm password: " + pwd2);
            conn.connect(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                
                console.log("Now execute query");
                
                
                req.query('Select * from AzureLogin', function (err, recordset) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(recordset.length);
                        for (var i = 0; i < recordset.length; i++) {
                            if (recordset[i].Email == emailid1 && recordset[i].Password == password1) {
                                console.log(1);
                                status = true;
                                conn.close();
                                var dbConn = new sql.Connection(dbConfig);
                                dbConn.connect().then(function () {
                                    var transaction = new sql.Transaction(dbConn);
                                    transaction.begin().then(function () {
                                        var request = new sql.Request(transaction);
                                        request.query("Update AzureLogin SET Password='"+pwd+"' where Email='"+emailid1+"'")
        .then(function () {
                                            transaction.commit().then(function (recordSet) {
                                                console.log(recordSet);
                                                dbConn.close();
                                                res.render('changepassword', { pankaj: 'Your  password Successfully updated in Sql' });
                                               
                                            }).catch(function (err) {
                                                console.log("Error in Transaction Commit " + err);
                                                dbConn.close();
                                                res.render('changepassword', { pankaj: 'Error in Transaction Commit' });
                                            });
                                        }).catch(function (err) {
                                            console.log("Error in Transaction Begin " + err);
                                            dbConn.close();
                                            res.render('changepassword', { pankaj: 'Error in Transaction Begin' });
                                        });
            
                                    }).catch(function (err) {
                                        console.log(err);
                                        dbConn.close();
                                        res.render('changepassword', { pankaj: 'Inavlid Account Exception' });

                                    });
                                }).catch(function (err) {
                                    console.log(err);
                                    res.render('changepassword', { pankaj: 'Invalid account Exception' });

                                });
                                //req.query('UPDATE azurelogin SET Password = ? WHERE Email = ?', [pwd, emailid1], function (err, recordset) {
                                //    if (err) {
                                //        console.log(err);
                                //    }
                                //    else {
                                //        console.log("successfully update password New User");
                                //        res.render('changepassword', { pankaj: 'Your  password Successfully updated in Sql' });

                                //    }
                                //});
                                break;
                            }
                            else if(i==recordset.length-1) {
                                status = false;
                                // console.log(status);
                                res.render('changepassword', { pankaj: 'invalid account to change password in sql' });
                                break;
                            }
                       
            
                        }
                    }
                 
                });
            });
        }
    }
    //res.render('changepassword', { value: 'Pankaj change password.' });
});
module.exports = router;
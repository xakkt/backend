const fs = require('fs')

var newObj = []
fs.readFile('./database_dump/malls.json', 'utf8',  function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); 
    for(let i=0 ; i < obj.length; i++){
    //     if(obj[i].first_name){
    //  let userInfo =   {
    //         "first_name":obj[i].first_name,"last_name":obj[i].last_name,"profile_pic" : 'abc.jpeg' , "status": obj[i].status,"last_login":null,"ncrStatus":obj[i].ncr_status,"superbuckId":obj[i].superbuckid,"dob":null,"address": [{ "name" : 'xyz' , "address" : "plot 2" , "address_type" :"Office" , "pincode" : "" , "phoneno": 4578475447 ,"countrycode" :obj[i].country_id , "city":" Meerut" ,"region" :"" , "state" : '' , "country" :"india" 
    //         }] ,"password":"Root@123" ,"contact_no":4555544554, "email":obj[i].email
    //     }
    //     console.log('========================',userInfo)

    //     newObj.push(userInfo);
    //    json = JSON.stringify(newObj); //convert it back to json
    // //    fs.writeFileSync('./mongoCollection/user.json', json, 'utf8', function ( data){
    // //     console.log(data)
    // //        });
    // } else if(obj[i].name){
    //     let departmentInfo ={
    //         "name" :obj[i].name, "description" :obj[i].description,
    //         "logo":obj[i].logo
    //     }
    //     console.log('========================',departmentInfo)
    //     newObj.push(departmentInfo);
    //    json = JSON.stringify(newObj);

    // //    fs.writeFileSync('./mongoCollection/department.json', json, 'utf8', function ( data){
    // //     console.log(data)
    // //        });
    // } else 
    
    
    if(obj[i].sunday_end){
        let storeInfo ={
            "name" :obj[i].name, "address" :obj[i].address, "city" : obj[i].city, "state" :obj[i].state,"zipcode"
:obj[i].zip,"contact_no":4555544554, "time_schedule":{
        "Monday": { startTime: obj[i].monday_start, endTime: obj[i].monday_end },
        "Tuesday": { startTime: obj[i].tuesday_start, endTime: obj[i].tuesday_end },
        "Wednesday": { startTime: obj[i].wednesday_start, endTime: obj[i].wednesday_end },
        "Thursday": { startTime: obj[i].thrusday_start, endTime: obj[i].thrusday_end  },
        "Friday": { startTime: obj[i].friday_start, endTime: obj[i].friday_end  },
        "Saturday": { startTime: obj[i].saturday_start, endTime: obj[i].saturday_end  },
        "Sunday": { startTime: obj[i].sunday_start, endTime: obj[i].sunday_end  }
}
        }
    
        newObj.push(storeInfo);
       json = JSON.stringify(newObj);
      
    }

    fs.writeFileSync('./mongoCollection/store.json', json, 'utf8', function ( data){
        console.log(data)
           });

 // write it back 
        
    }//now it an object
   
}});

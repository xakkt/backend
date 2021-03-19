
const fs = require('fs')
const StreamArray = require('stream-json/streamers/StreamArray');
const jsonStream = StreamArray.withParser();

newObj =[]
jsonStream.on('data', ({key, value}) => {
    let user = {
        "first_name":value.first_name,"last_name":value.last_name,"profile_pic" : value.photo , "status": value.status,"ncrStatus":value.ncr_status,"superbuckId":value.superbuckid,"dob":'',"address": [{ "name" : value.address , "address" : value.address, "address_type":'Home' , "pincode" : 45754 , "phoneno": value.mobile_no,"countrycode" :value.country_id , "city":value.city ,"region" :"" , "state" : value.state  , "country" :''
        }] ,"password":value.password ,"contact_no":value.mobile_no, "email":value.email
    }
    newObj.push(user)

  json = JSON.stringify(newObj); //convert it back to json
const file = fs.createWriteStream('./mongoCollection/users.json');
file.write(json)
file.end();
})
jsonStream.on('end', () => {
    console.log('All done');
});

fs.createReadStream('./database_dump/users.json').pipe(jsonStream.input);























// fs.readFile('./database_dump/user6.json', 'utf8',  function readFileCallback(err, data){
//     if (err){
//         console.log(err);
//     } else {
//     obj = JSON.parse(data); 
//     for(let i=0 ; i < obj.length; i++){
//         if(obj[i].first_name){
//      let userInfo =   {
//             "first_name":obj[i].first_name,"last_name":obj[i].last_name,"profile_pic" : obj[i].photo , "status": obj[i].status,"ncrStatus":obj[i].ncr_status,"superbuckId":obj[i].superbuckid,"dob":'',"address": [{ "name" : obj[i].address , "address" : obj[i].address, "address_type":'Home' , "pincode" : 45754 , "phoneno": obj[i].mobile_no,"countrycode" :obj[i].country_id , "city":obj[i].city ,"region" :"" , "state" : obj[i].state  , "country" :''
//             }] ,"password":obj[i].password ,"contact_no":obj[i].mobile_no, "email":obj[i].email
//         }
//        console.log('========================',obj[i].address)

//         newObj.push(userInfo);
//        json = JSON.stringify(newObj); //convert it back to json
//        fs.writeFileSync('./mongoCollection/user6.json', json, 'utf8', function ( data){
//         console.log(data)
//            });
//     } else if(obj[i].description){
//         let departmentInfo ={
//             "name" :obj[i].name, "description" :obj[i].description,
//             "logo":obj[i].logo
//         }
//         console.log('========================',departmentInfo)
//         newObj.push(departmentInfo);
//        json = JSON.stringify(newObj);

//        fs.writeFileSync('./mongoCollection/department.json', json, 'utf8', function ( data){
//         console.log(data)
//            });
//     } else if(obj[i].sunday_end){
//         let storeInfo ={
//             "name" :obj[i].name, "address" :obj[i].address, "city" : obj[i].city, "state" :obj[i].state,"zipcode"
// :obj[i].zip,"contact_no":4555544554, "time_schedule":{
//         "Monday": { startTime: obj[i].monday_start, endTime: obj[i].monday_end },
//         "Tuesday": { startTime: obj[i].tuesday_start, endTime: obj[i].tuesday_end },
//         "Wednesday": { startTime: obj[i].wednesday_start, endTime: obj[i].wednesday_end },
//         "Thursday": { startTime: obj[i].thrusday_start, endTime: obj[i].thrusday_end  },
//         "Friday": { startTime: obj[i].friday_start, endTime: obj[i].friday_end  },
//         "Saturday": { startTime: obj[i].saturday_start, endTime: obj[i].saturday_end  },
//         "Sunday": { startTime: obj[i].sunday_start, endTime: obj[i].sunday_end  }
// }
//         }
    
//         newObj.push(storeInfo);
//        json = JSON.stringify(newObj);
//        fs.writeFileSync('./mongoCollection/store.json', json, 'utf8', function ( data){
//         console.log(data)
//            });
      
//     }
        
//     }
   
// }});

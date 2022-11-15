const fs =  require("fs");
const dotenv = require('dotenv')
const express = require('express');
const csv = require("@pinemach/csv");
const csvjson = require("csvjson");
const axios = require('axios');
const writeCSV = require('write-csv')
const stringify = require('csv-stringify');
const parse = require('csv-parse');
const csv_parser = require('csv-parser');

const ps = require('prompt-sync')
const prompt = ps();

// const path = require('path');

const app = express();

// import {data} from './public/js/users.js';
const { data } = require('./public/js/users.js');

dotenv.config();

// import { data } from './users.js'

app.use(express.static(__dirname + '/public'));
// app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  // res.sendFile('index.html');
  res.sendFile('index.html')
});


const api =
  "https://random-data-api.com/api/v2/users";

const fetchData = () => {
  return new Promise((resolve, reject) => {
    const fetch_data = axios.get(api);

    if (fetch_data) { 
      resolve(fetch_data);
      return;
    }

    reject("Request Failed, Try again");
  });
};


// Method 1 to write csv file -

let writeCsv = () => {
  fetchData()
    .then((apiData) => {

      let csvData = csvjson.toCSV(apiData.data, {
        headers: "key",
      });

      fs.writeFileSync("./users.csv", csvData); // Writing csv data in users.csv
    })
    .catch((message) => {
      console.log(message);
    });
};
writeCsv();


//  Method 2 to write csv file - 


// const path = __dirname + "/users.csv";
// fs.writeFileSync(path, csv.write(data));



// Method 3 to write csv file

// stringify(data, {
//   header: true
// }, function (err, output) {
//   fs.writeFile(__dirname+'/users.csv', output);
// })



// Method - 4 to write csv file
// fs.writeFile("users.csv", data, "utf-8", (err) => {
//   if (err) console.log(err);
//   else console.log("Data saved");
// });


// 💥 sort data
const filterData = () => {
  const fileData = fs.readFileSync("./users.csv", { encoding: "utf-8" });

  const arrayString = fileData.split("\n");

  arrayString.forEach((element) => {
    let property = element.split(",");

    fs.writeFileSync("./users-sorted.csv", property[1] + "\n", { flag: "a" });
  });
};

filterData();




// 💥 find user by id and user_name -
const findUser = (id) => {
  const csvFileData = fs.readFileSync("./users.csv",  { encoding: "utf-8" });
  const toJson = csvjson.toObject(csvFileData);

  const result = toJson.filter((user)=>{
    return id.toString() === user.id;
  })
  return result;
  
}
findUser(1);


fs.createReadStream('../csv_files/users.csv')
  .pipe(csv_parser({}))
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log('The List of userName you can search for : ');

    for (var x in results)
      console.log(results[x].username);

    // take input from real-time user for username search
    let input = prompt('Enter the username of the person and search data related to it : ');

    // search the username in csv file and output it's all data
    for (var x in results) {
      if (results[x].username == input) {
        console.log(`You Enter the name is ${input} and the data is : `);
        console.log(results[x]);
        flag = true;
        break;
      }
    }

    if (flag == false)
      console.log('looks like you entered the invalid username!');
  });



// Read CSV File -

// Method - 1

// var parser = parse({ columns: true }, function (err, records) {
//   console.log(records);
// });

// fs.createReadStream(__dirname + '/users.csv').pipe(parser);


// Method - 2
// fs.createReadStream("users.csv", { encoding: "utf-8" })
//   .on("data", (chunk) => {
//     console.log(chunk);
//   })
//   .on("error", (error) => {
//     console.log(error);
//   });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})



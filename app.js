const fs = require("fs");
const dotenv = require('dotenv')
const express = require('express');
const csvjson = require("csvjson");
const axios = require('axios');
const csv_parser = require('csv-parser');

const ps = require('prompt-sync')
const prompt = ps();

const objToCsv = require('obj-csv');

const app = express();


dotenv.config();


app.use(express.static(__dirname + '/public'));
// app.use('/public', express.static('public'));

app.get('/', (req, res) => {
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

// 💥 Writng and Appending data in CSV files

const n = prompt(`Enter no of users: `);
let count = 0;

let stopinterval = () => {
  clearInterval(interval); // Stop the interval if the condition holds true
}
// let interval = setInterval(function () { writeCsv(); stopinterval(count); }, 1000);

let interval = setInterval(
  function writeCsv() {
    if (count > n) {
      stopinterval(interval); // Stop the interval if the condition holds true
    }
    else {
      count++;
    }

    if (fs.existsSync("./users.csv")) {
      fetchData()
        .then((apiData) => {
          let csvData = csvjson.toCSV(apiData.data, {
            headers: "key",
          });

          fs.appendFileSync("users.csv", csvData);
        })
        .catch((message) => {
          console.log(message);
        });
    }
    else {
      fetchData()
        .then((apiData) => {

          let csvData = csvjson.toCSV(apiData.data, {
            headers: "key",
          });

          fs.writeFileSync("users.csv", csvData); // Writing csv data in users.csv
        })
        .catch((message) => {
          console.log(message);
        });
    }
  }, 1000
);

// writeCsv();

// 💥 sort data
const storedArray = [];

const filterData = () => {
  fs.createReadStream('./users.csv')
    .pipe(csv_parser({}))
    .on('data', (data) => storedArray.push(data))  //push data into javascript object
    .on('end', () => {
      let x = 0;
      for (let x in storedArray) { } //count number of users in csv file

      // sorting are done here by changing values
      for (let i = 0; i < x; i++) {
        if (storedArray[i].username > storedArray[i + 1].username) {
          let temp = storedArray[i];
          storedArray[i] = storedArray[i + 1];
          storedArray[i + 1] = temp;
          i = -1;
        }
      }

      // module converts javascript object into csv format
      objToCsv(storedArray, ['id', 'uid', 'password', 'first_name', 'last_name', 'username', 'email', 'avatar', 'gender', 'phone_number', 'social_insurance_number', 'date_of_birth','address'], function (err, file) {

        // after converting write file into sorted_users.csv file in utf-8 format encoding
        fs.writeFileSync('.users_sorted.csv', file, 'utf-8', err => {
          if (err)
            console.log('something went wrong')
        })
      });
    });
};

filterData();




// 💥 find user by id or user_name -

const result = [];
let flag = false;

fs.createReadStream('./users.csv')
  .pipe(csv_parser({}))
  .on('data', (data) => result.push(data))
  .on('end', () => {
    console.log('username of users: ');

    for (let x in result)
      console.log(result[x].username);

    // take input from real-time user for username search
    let input = prompt('Enter the username of user ');

    // search the username in csv file and output it's all data
    for (let x in result) {
      if (result[x].username == input) {
        console.log(result[x]);
        flag = true;
        break;
      }
    }

    if (flag == false)
      console.log('invalid username!');
  });


/*💥 To delete file -
const deletefile = ()=>{
  const del = prompt(`Press 1 if you want to delete csv file created for again execution of code`);
  if(del == 1){
    fs.unlinkSync("users.csv");
  }
};
deletefile();
*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})



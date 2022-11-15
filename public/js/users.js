// api url
const api_url =
  "https://random-data-api.com/api/v2/users";

// Defining async function

// let data;
async function getapi(url) {

  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  let data = await response.json();
  // console.log(data);
  if (response) {
    hideloader();
  }
  show(data);
}
// Calling that async function
getapi(api_url);


// Function to hide the loader
function hideloader() {
  document.getElementById('loading').style.display = 'none';
}
// Function to define innerHTML for HTML table
function show(data) {
  let tab =
    `<tr>
		<th>Id</th>
		<th>FirstName</th>
		<th>LastName</th>
		<th>UserName</th>
		<th>Email</th>
		<th>Avatar</th>
		<th>Gender</th>
		<th>DOB</th>
		<th>Address</th>
		</tr>`;

  tab += `<tr>
	<td>${data['id']} </td>
	<td>${data['first_name']} </td>
	<td>${data['last_name']} </td>
	<td>${data['username']} </td>
	<td>${data['email']} </td>
	<td>${data['avatar']} </td>
	<td>${data['gender']} </td>
	<td>${data['date_of_birth']} </td>
	<td>${data['address']['city']}, ${data['address']['street_name']}, ${data['address']['street_address']}, ${data['address']['zip_code']}  </td>
</tr>`;
  // for more users data we use for loop in above table
  // like -> 

  // for (let i = 0; i < keys.length; i++) {
  //   console.log(person[keys[i]]);
  // }

  // Setting innerHTML as tab variable
  document.getElementById("users").innerHTML = tab;
}


// export {data}
// module.exports = {data}

// 💥 Writing data in csv file ->
// const dataTable = document.getElementById("users");
// const btnExportToCsv = document.getElementById("btnExportToCsv");

// btnExportToCsv.addEventListener("click", () => {
//   const exporter = new TableCSVExporter(dataTable);
//   const csvOutput = exporter.convertToCSV();
//   const csvBlob = new Blob([csvOutput], { type: "text/csv" });
//   const blobUrl = URL.createObjectURL(csvBlob);
//   const anchorElement = document.createElement("a");

//   anchorElement.href = blobUrl;
//   anchorElement.download = "table-export.csv";
//   anchorElement.click();

//   setTimeout(() => {
//     URL.revokeObjectURL(blobUrl);
//   }, 1000);
// });
var xhttp ;

window.onload = function initializePage(){
  let submitButton = document.querySelector("#btnSubmit");

  let items = document.querySelectorAll("input");
  for(let i = 0; i< items.length - 1; i++){
    items[i].addEventListener("input", checkTextField);
}

  //sendRequest(); // you can add parameters to this function as needed
};

function checkTextField(event){
  let element = event.target;
  let items = document.querySelectorAll("input");


  // check if all the fields are filled
  let numFilled = 0;

  for(let i = 0; i< items.length-1; i++){
    if(items[i].value.length > 0 ){
      numFilled++;
    }
  }

  if(numFilled =2){
    document.querySelector("#btnSubmit").disabled = false;
  }
  else{
    document.querySelector("#btnSubmit").disabled = true;
  }

}

// TODO: function retrieves data from the text fields and uses them to send an AJAX request to the server
function sendRequest(){
  let obj= {};
  let items = document.querySelectorAll("input");
  for(let i = 0; i< items.length-1; i++){
    if(items[i].value.length > 0 ){
      obj[items[i].name]=items[i].value;
    }
  }
  const url = new URL(`http://localhost:8000/fridges/search/items`);
  url.search = new URLSearchParams(obj);
  alert(obj);
  alert(url.search);
  alert(url);
  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
  xhttp.open("GET",url, true);

  //always alerts failure even when successful
	xhttp.onreadystatechange = function() {

    if (xhttp.readyState==4) {
    // only check when state is "the communication is done"
    if (xhttp.status==200){
         console.log(xhttp.responseText);
         return false;
    }else{
          alert("Something negative happened");
 }
}}


    /* if (/*xhttp.readyState === 4 && xhttp.status ==200) {

      console.log(xhttp.responseText);
    }
    else{alert("failure");} */
   // specify what should happen when the server sends a response
    //alert(url);
  xhttp.send();

}

// TODO: function processes the response received from the server
function processResults(){
  console.log(xhttp);
  console.log(xhttp.status);
  if (xhttp.readyState === XMLHttpRequest.DONE || xhttp.status === 200) {
    let data = JSON.parse(xhttp.responseText);
    console.log(xhttp.responseText);
    populateStudents(xhttp.responseText);
  }
  else {
    console.log("There was a problem with the request.");
  }

}

// populate the table with student data received from the server
function populateStudents(students){
  let table = document.querySelector("table");

  // iterate through all the objects in the students array
  for(let student of students){
    // save the information for the current in variables
    let studentID = student.snum;
    let firstName = student.fname;
    let lastName = student.lname;
    let course = student.course;
    let assignmentGrade = student.agrade;
    let tutorialGrade = student.tgrade;
    let examGrade = student.egrade;

    // time to create a new HTML element!
    // 1). we first need to create a new row
    let row = document.createElement("tr");
    row.id = studentID;

    // create a cell for the student ID, update its text value, and append it to the row
    let iDCell = document.createElement("td");
    iDCell.textContent = studentID;
    row.appendChild(iDCell);

    // create a cell for the first name, update its text value, and append it to the row
    let fNameCell = document.createElement("td");
    fNameCell.textContent = firstName;
    row.appendChild(fNameCell);

    // create a cell for the last name, update its text value, and append it to the row
    let lNameCell = document.createElement("td");
    lNameCell.textContent = lastName;
    row.appendChild(lNameCell);

    // create a cell for the course, update its text value, and append it to the row
    let courseCell = document.createElement("td");
    courseCell.textContent = course;
    row.appendChild(courseCell);

    // create a cell for the assignment grade, update its text value, and append it to the row
    let aGradeCell = document.createElement("td");
    aGradeCell.textContent = assignmentGrade.toFixed(2);
    row.appendChild(aGradeCell);

    // create a cell for the tutorial grade, update its text value, and append it to the row
    let tGradeCell = document.createElement("td");
    tGradeCell.textContent = tutorialGrade.toFixed(2);
    row.appendChild(tGradeCell);

    // create a cell for the exam grade, update its text value, and append it to the row
    let eGradeCell = document.createElement("td");
    eGradeCell.textContent = examGrade.toFixed(2);
    row.appendChild(eGradeCell);

    // append the row to the table
    table.appendChild(row);
  }
}

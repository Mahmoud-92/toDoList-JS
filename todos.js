/* Select all the necessary Elements  */
var input = document.querySelector(".input_task");
var mainTodoContainer = document.getElementById("mainDiv");
var addingButton = document.querySelector(".add_task");
var deleteAllBtn = document.querySelector(".clear_all");
var completedButton = document.querySelector(".completed");
var removeButton = document.querySelector(".trash");
var selectAllBtn = document.getElementById("select All");
var completeSelectedBtn = document.getElementById("mark Selected");
var todoListArray = [];
var editMode = false;
var selectMode = false;
var selectAllMode = false;

function bindData(elementsArray) {
  for (let index = 0; index < elementsArray.length; index++) {

    elementsArray[index].itemIndex = index;

    localStorage.setItem("todoList", JSON.stringify(elementsArray));

    /*test Div*/
    var testDiv = document.createElement("div");
    testDiv.classList.add("p-2");
    testDiv.innerText = elementsArray[index].value;

    /*layOut Div*/
    var layOut = document.createElement("div");
    layOut.classList.add("d-flex","align-items-baseline");

    if (elementsArray[index].completed) {
      layOut.classList.add("completed")
    };




    /* Selection Div */
    var selectBox = document.createElement("input");
    selectBox.classList.add("form-check-input","p-2");
    selectBox.type="checkbox";

    if (selectAllMode){
      selectBox.checked=true;
      checkMark(elementsArray[index],true);
    }
    else{
      selectBox.checked=false;
      checkMark(elementsArray[index],false);
    }

    selectBox.addEventListener('change', (event) => {
     
     setSelected(elementsArray[index],event.target.checked);
     checkMark(elementsArray[index],event.target.checked);
     
    });
    




    /* Button Div */
    var buttonDiv = document.createElement("div");
    buttonDiv.classList.add("button","ms-auto","p-2");

    /* completed button element1 */

    var completeButton = document.createElement("button");
    completeButton.classList.add("completed");
    completeButton.innerHTML = '<i class="bi bi-check-circle"></i>';
    completeButton.onclick = function () {
      markAsCompleted(elementsArray[index]);
    };
    /* Edit Button */

    var editBtn = document.createElement("button");

    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';

    editBtn.classList.add("editBtn");

    editBtn.onclick = function () {
      document.getElementById("AddEdit").innerHTML="Edit";
      editWorking(elementsArray[index]);
    };

    /* trash button element */

    var trashButton = document.createElement("button");

    trashButton.innerHTML = '<i class="bi bi-x-circle"></i>';

    trashButton.classList.add("trash");

    trashButton.onclick = function () {
      trashWork(elementsArray[index])
    };

    //Appending to each other

    document.getElementById("todoListItems").appendChild(layOut);

    layOut.appendChild(selectBox);

    layOut.appendChild(testDiv);

    layOut.appendChild(buttonDiv);

    buttonDiv.appendChild(completeButton);

    buttonDiv.appendChild(editBtn);

    buttonDiv.appendChild(trashButton);
  }
  
};

addingButton.addEventListener("click", function (e) {
  /* stoping button behaviour */
  e.preventDefault();


  if (editMode){
    editItem();
  }

  /* Create all the elements */
  else if (input.value.trim()) {

    //push data to array

    var itemObj = {
      value: input.value,
      completed: false,
    };

    todoListArray.push(itemObj);
    // console.log(todoListArray);

    localStorage.setItem("todoList", JSON.stringify(todoListArray));

    document.getElementById("todoListItems").innerHTML = "";
    bindData(todoListArray);

    /* when the add button click clear the input value */
    input.value = "";
  } else if (input.value === "") {
    alert("please fill the input field");
  };

  document.getElementById("AddEdit").innerHTML="Add Item";
  
  editMode = false;
});



deleteAllBtn.addEventListener("click", function (e) {
  /* stoping button behaviour */
  e.preventDefault();


  if (selectMode){
    clearSelected();
  }

  else {
    deleteAllElements();
  }
  selectAllBtn.checked=false;
  document.getElementById("deleteAllOrSelected").innerHTML="Clear All";
  selectMode=false;

});


selectAllBtn.onclick = function (e) {
  
    document.getElementById("todoListItems").innerHTML = "";
    selectAllMode=e.target.checked;
    bindData(todoListArray);
   
  };

var itemsToMark=[];
function checkMark (element,mark){
  if (mark) {
    itemsToMark.push(element);
  }
  else {
    itemsToMark=itemsToMark.filter(item => item!=element)
  }
};

completeSelectedBtn.onclick = function (){
  for (let index = 0; index < todoListArray.length; index++) {
    if(itemsToMark.includes(todoListArray[index])){
    todoListArray[index].completed=!todoListArray[index].completed;//itemsToMark.includes(todoListArray[index]);
    }


  }
  selectAllBtn.checked=false;
  selectAllMode=false;
  document.getElementById("todoListItems").innerHTML = "";
  bindData(todoListArray);

}   
    



var itemArrayToEdit;
function editWorking(elementArray) {
  editMode = true ;
  document.getElementById("todoInput").value = elementArray.value;
  itemArrayToEdit = elementArray;
};

function editItem() {
  itemArrayToEdit.value = document.getElementById("todoInput").value;
  //console.log(todoListArray);
  input.value="";
  document.getElementById("todoListItems").innerHTML = "";
  bindData(todoListArray);
};

function markAsCompleted(elementArray) {
  elementArray.completed = true;
  document.getElementById("todoListItems").innerHTML = "";
  bindData(todoListArray);
};

function trashWork(element) {
  todoListArray.splice(element.itemIndex, 1);
 // todoListArray = todoListArray.filter(item => item.itemIndex != element.itemIndex);
  
  //console.log(todoListArray);
  document.getElementById("todoListItems").innerHTML = "";
  bindData(todoListArray);
};


var itemsToDelete=[];
function setSelected(element,isChecked) {
  if(isChecked==true){
  itemsToDelete.push(element);
  }
  else if(isChecked==false) {
    itemsToDelete=itemsToDelete.filter(item => item!=element);
  };
  if (itemsToDelete.length != 0) {
    document.getElementById("deleteAllOrSelected").innerHTML="Clear Selected"
    selectMode=true;
  }
  else {
    document.getElementById("deleteAllOrSelected").innerHTML="Clear All"
    selectMode=false;
  }
  
};



function clearSelected() {
  if(itemsToDelete.length!= 0){
    todoListArray = todoListArray.filter(item => !itemsToDelete.includes(item));
    document.getElementById("todoListItems").innerHTML = "";
    bindData(todoListArray);
    
  }
};
 


function deleteAllElements() {
  localStorage.removeItem('todoList');
  todoListArray=[];
  input.value = "";
  bindData(todoListArray);
  document.getElementById("todoListItems").innerHTML = "";
}


// loadPage()
(function loadPage(id) {
  var localData = localStorage.getItem("todoList");
  if (localData) {
    //  console.log('stored data',localData);
    todoListArray = JSON.parse(localData);
    bindData(todoListArray);
  }
})();

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("AddEdit").click();
  }
});

// config = {
//     altInput: true,
//     altFormat: "F Y",
//     dateFormat: "Y-m-d",
//     defaultDate: Date.now()
// }
const dailyTable = document.querySelector('.dailyTable').getElementsByTagName('tbody')[0]
const weeklyTable = document.querySelector('.weeklyTable').getElementsByTagName('tbody')[0]
const monthlyTable = document.querySelector('.monthlyTable').getElementsByTagName('tbody')[0]

const habitlabel = document.querySelector('#habitlabel')
const habitType = document.querySelector('#habitType')
const habitName = document.querySelector('#NewHabitName')
const datePickerMonth = document.querySelector('#month')
const datePickerYil = document.querySelector('#year')


var DataName;
var rowTobeChanged;
function modalKeyUp(e){
    if (e.keyCode === 13) {
        e.preventDefault();
        document.getElementById("AddHabitButton").click();
       }
}
function SetModalType(type) {
   
    habitType.innerHTML = type;
    labelText = `Add your new ${(type === 0 ? "daily" : (type === 1 ? "weekly" : "monthly"))} habit...`
    habitlabel.innerHTML = labelText;
    habitName.value = "";

}
function AddHabit() {

    if (habitName.value !== "") {
        if (rowTobeChanged === undefined) {
            var table;
            if (habitType.innerHTML == 0) {
                table = dailyTable;
            } else if (habitType.innerHTML == 1) {
                table = weeklyTable;
            } else {
                table = monthlyTable;
            }
            objRowData = {};
            var mainTable = table.parentElement;
            for (j = 1; j < mainTable.rows[0].cells.length; j++) {
                if (j == 1) {
                    objRowData["name"] = habitName.value;
                } else {
                    objRowData[`${j-1}`] = false;
                }
            }
            insertRow(table,objRowData,false);
        } else {
            rowTobeChanged.cells[1].innerHTML = habitName.value;
            rowTobeChanged = undefined;
        }
        
        
    }
    Save();
}

var tableToObj = function (table) {
    objTableData = [];
    objRowData = [];
    for (i = 0; i < table.rows.length; i++) {
        objRowData = {}
        for (j = 1; j < table.rows[i].cells.length; j++) {

            if (j == 1) {
                objRowData["name"] = table.rows[i].cells[j].innerHTML;
            } else {
                var cell = table.rows[i].cells[j];
                objRowData[`h${j-1}`] = cell.firstChild.checked;
            }
        }
        objTableData.push(objRowData);
    }
    return objTableData;
}


function insertRow(table, objRowData, copyData) {
    var row = table.insertRow(-1)
   
    var rowIndex  = table.rows.length - 1;
    row.setAttribute("index", rowIndex);
    var cellEditRow = row.insertCell(-1)
  
    var btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-default"
    deleteButton.onclick = function () { deleteRow(table, this) };

    var deleteImage = document.createElement("i");
    deleteImage.className = "fa fa-trash-o editButton";
    deleteImage.setAttribute("title", "Delete");
    deleteButton.appendChild(deleteImage);
    

    var editButton = document.createElement("button");
    editButton.className = "btn btn-default"
    editButton.onclick = function () { editRow(table, this) };
   

    var editImage = document.createElement("i");
    editImage.className = "fa fa-pencil editButton"
    editImage.setAttribute("title", "Edit");
    editButton.appendChild(editImage);

    btnGroup.appendChild(deleteButton);
    btnGroup.appendChild(editButton);

    cellEditRow.appendChild(btnGroup);

    var headerCell = document.createElement("th")
    // headerCell.setAttribute("scope", "col");
    headerCell.setAttribute("class", "align-middle");
    headerCell.innerHTML = objRowData.name;
    row.appendChild(headerCell);
    var mainTable = row.parentElement.parentElement;
    for (var i = 2; i < mainTable.rows[0].cells.length; i++) {
        var cell = row.insertCell(-1)
        // cell.setAttribute("scope", "col");
        cell.setAttribute("class", "align-middle");
        var CellContent = document.createElement("input")
        CellContent.className = "form-check-input"
        CellContent.type = "checkbox"
        if (copyData==true) {
            CellContent.checked = objRowData[`h${i-1}`];
        }
        CellContent.onclick = function () { cellCheckChanged() };
        cell.appendChild(CellContent)
    }
}

function deleteRow(table, button) {

    var i = button.parentElement.parentElement.parentElement.rowIndex;
    table.deleteRow(i-1)
    Save();
}

function editRow(table, button) {
    
    rowTobeChanged = button.parentElement.parentElement.parentElement;
    labelText = `Edit your habit...`
    habitlabel.innerHTML = labelText;
    habitName.value = rowTobeChanged.cells[1].innerHTML;
    // const myModal = document.querySelector('#AddHabit')
    var myModal = new bootstrap.Modal(document.getElementById('AddHabit'), {
        keyboard: false,focus: true
    })
    myModal.show()
}
function cellCheckChanged() {
    Save();
}

function Save() {
    var data = JSON.stringify(monthToObj());
    localStorage.setItem(DataName, data);
}
var monthToObj = function () {
    let monthData = '{"daily": [], "weekly" : [], "monthly" :[]}';
    var objmonthData = JSON.parse(monthData);
    objmonthData.daily = tableToObj(dailyTable);
    objmonthData.weekly = tableToObj(weeklyTable);
    objmonthData.monthly = tableToObj(monthlyTable);
    return objmonthData;
}
function loadTables(data, copyData) {
    if (data == undefined) {
        clearTable();
        
    } else {
        json = JSON.parse(data);
       
        for (i = 0; i < json.daily.length; i++) {
           
            insertRow(dailyTable,json.daily[i],copyData);
        }
        for (i = 0; i < json.weekly.length; i++) {
            insertRow(weeklyTable,json.weekly[i],copyData);
        }
        for (i = 0; i < json.monthly.length; i++) {
            insertRow(monthlyTable,json.monthly[i],copyData);
        }

    }
}

function clearTable() {
    dailyTable.innerHTML = "";
    weeklyTable.innerHTML = "";
    monthlyTable.innerHTML = "";
    // for (j = 0; j < dailyTable.rows.length; j++) {
    //     dailyTable.deleteRow(j);
    //     console.log(dailyTable.innerHTML)
    // }
    // for (j = 0; j <= weeklyTable.rows.length; j++) {
    //     weeklyTable.deleteRow(j);
    // }
    // for (j = 0; j <= monthlyTable.rows.length; j++) {
    //     monthlyTable.deleteRow(j);
    // }

}

function copyPreviousMonth() {
   var d = new Date(datePickerYil.value, datePickerMonth.selectedIndex, 1);
   d.setMonth( d.getMonth() - 1);
   var year = d.getFullYear();
   var month = d.getMonth() + 1
   var DataNamePrevious = `${year}-${month}`;
   loadTables(localStorage[DataNamePrevious],false);
    Save();

}


// flatpickr("input[type=date]", config);
datePickerYil.value = new Date().getFullYear();
datePickerMonth.selectedIndex = new Date().getMonth();

function LoadData() {
   
    // localStorage.clear();
    var year = datePickerYil.value;
    var month = datePickerMonth.selectedIndex + 1;
    DataName = `${year}-${month}`;
   
    clearTable();
    
    loadTables(localStorage[DataName],true);
}

LoadData();



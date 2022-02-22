config = {
    altInput: true,
    altFormat: "F Y",
    dateFormat: "Y-m-d",
    defaultDate: Date.now()
}
const dailyTable = document.querySelector('.dailyTable')
const weeklyTable = document.querySelector('.weeklyTable')
const monthlyTable = document.querySelector('.monthlyTable')

const habitlabel = document.querySelector('#habitlabel')
const habitType = document.querySelector('#habitType')
const habitName = document.querySelector('#NewHabitName')
const datePicker = document.querySelector('#datePicker')
var DataName;
function SetModalType(type) {
   
    habitType.innerHTML = type;
    labelText = `Add your new ${(type === 0 ? "daily" : (type === 1 ? "weekly" : "monthly"))} habit...`
    habitlabel.innerHTML = labelText;
    habitName.value = "";

}
function AddHabit() {
    if (habitName.value !== "") {
        var table;
        if (habitType.innerHTML == 0) {
            table = dailyTable;
        } else if (habitType.innerHTML == 1) {
            table = weeklyTable;
        } else {
            table = monthlyTable;
        }
        objRowData = {};
        for (j = 1; j < table.rows[0].cells.length; j++) {
            if (j == 1) {
                objRowData["name"] = habitName.value;
            } else {
                objRowData[`${j-1}`] = false;
            }
        }
        insertRow(table,objRowData);
        
    }
    Save();
}

var tableToObj = function (table) {
    objTableData = [];
    objRowData = [];
    for (i = 1; i < table.rows.length; i++) {
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


function insertRow(table, objRowData) {
    var row = table.getElementsByTagName('tbody')[0].insertRow(-1)
   
    var rowIndex  = table.rows.length - 1;
    row.setAttribute("index", rowIndex);
    var celldeleteButton = row.insertCell(-1)
    celldeleteButton.setAttribute("scope", "col");
    var deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-outline-dark btn-sm"
    deleteButton.type = "button"
    deleteButton.innerHTML = "x";
    
    deleteButton.onclick = function () { deleteRow(table, this) };
    celldeleteButton.appendChild(deleteButton);


    var headerCell = document.createElement("th")
    headerCell.setAttribute("scope", "col");
    headerCell.innerHTML = objRowData.name;
    row.appendChild(headerCell);

    for (var i = 2; i < table.rows[0].cells.length; i++) {
        var cell = row.insertCell(-1)
        cell.setAttribute("scope", "col");
        var CellContent = document.createElement("input")
        CellContent.className = "form-check-input"
        CellContent.type = "checkbox"
        CellContent.checked = objRowData[`h${i-1}`];
        CellContent.onclick = function () { cellCheckChanged() };
        cell.appendChild(CellContent)
    }
}

function deleteRow(table, button) {

    var i = button.parentElement.parentElement.rowIndex;
    table.deleteRow(i)
    Save();
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
function loadTables(data) {
    if (data == undefined) {
        clearTable();
    } else {
        json = JSON.parse(data);
        for (i = 0; i < json.daily.length; i++) {
            insertRow(dailyTable,json.daily[i]);
        }
        for (i = 0; i < json.weekly.length; i++) {
            insertRow(weeklyTable,json.weekly[i]);
        }
        for (i = 0; i < json.monthly.length; i++) {
            insertRow(monthlyTable,json.monthly[i]);
        }

    }
}

function clearTable() {
    for (var j = 1; j < dailyTable.rows.length; j++) {
        dailyTable.deleteRow(j);
    }
    for (var j = 1; j < weeklyTable.rows.length; j++) {
        weeklyTable.deleteRow(j);
    }
    for (var j = 1; j < monthlyTable.rows.length; j++) {
        monthlyTable.deleteRow(j);
    }
}




flatpickr("input[type=date]", config);

function LoadData() {
    // localStorage.clear();
    var date = new Date(datePicker.value);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    DataName = `${year}-${month}`;
    clearTable();
    loadTables(localStorage[DataName]);
}

LoadData();



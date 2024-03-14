// Function to mark attendance when Enter key is pressed
document.getElementById("studentId").addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        markAttendance();
    }
});

function markAttendance() {
    var studentId = document.getElementById("studentId").value;
    // AJAX request to mark attendance
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/mark-attendance", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById("message").innerText = response.message;
            document.getElementById("studentId").value = "";
            getAttendanceList(); // Refresh attendance list after marking attendance
        }
    };
    xhr.send(JSON.stringify({ studentId: studentId }));
}

function dumpSheet() {
    var sheetName = document.getElementById("sheetName").value;
    if (sheetName === "" || sheetName === null) {
        document.getElementById("message").innerText = "Please enter a sheet name";
        return;
    }
    // AJAX request to dump the sheet
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/dump-sheet", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'blob'; // Set response type to blob
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            console.log(xhr.response)
            console.log(xhr.status)
            var blob = new Blob([xhr.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${sheetName}.xlsx`;
            link.click();
        }
    };
    xhr.send(JSON.stringify({ sheetName: sheetName }));
}


function resetForm() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/reset-attendance", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(xhr.responseText);
            document.getElementById("message").innerText = response.message;
            // Clear attendance list on the webpage
            document.getElementById("attendanceList").innerHTML = "";
        }
    };
    xhr.send();
}

function getAttendanceList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/get-attendance-list", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(xhr.responseText);
            var attendanceList = response.attendanceList;
            var attendanceHTML = "<h3>Attendance List</h3><ul>";
            attendanceList.forEach(function(item) {
                attendanceHTML += `<li>${item[0]} - ${item[1]} - ${item[2]} ${item[3]}</li>`;
            });
            attendanceHTML += "</ul>";
            document.getElementById("attendanceList").innerHTML = attendanceHTML;
        }
    };
    xhr.send();
}

// Function to update error message when typing a new user
document.getElementById("studentId").addEventListener("input", function() {
    document.getElementById("message").innerText = "";
});

// Function to update error message when typing a new user
document.getElementById("sheetName").addEventListener("input", function() {
    document.getElementById("message").innerText = "";
});

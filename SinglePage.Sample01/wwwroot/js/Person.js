
// Form
var form = document.getElementById("form");

// Buttons
var btnAdd = document.getElementById("btnAdd");
var btnEdit = document.getElementById("btnEdit");
var btnDelete = document.getElementById("btnDelete");
var btnRefresh = document.getElementById("btnRefresh");
var btnConfirmDelete = document.getElementById("btnConfirmDelete");

// Inputs
var id = document.getElementById("id");
var firstName = document.getElementById("firstName");
var lastName = document.getElementById("lastName");
var email = document.getElementById("email");

// Validation Messages
var firstNameValidationMessage = document.getElementById("firstNameValidationMessage");
var lastNameValidationMessage = document.getElementById("lastNameValidationMessage");
var emailValidationMessage = document.getElementById("emailValidationMessage");

// Delete Modal
var confirmDeleteModal = document.getElementById("confirmDeleteModal");
var confirmDeleteModalId = document.getElementById("confirmDeleteModalId");
var confirmDeleteModalBody = document.getElementById("confirmDeleteModalBody");

// Details Modal
var detailsModal = document.getElementById("detailsModal");
var detailsModalBody = document.getElementById("detailsModalBody");

// Others
var chkSelectAll = document.getElementById("selectAll");
var tbody = document.querySelector("tbody");
var resultMessage = document.getElementById("resultMessage");

//Event Listeners
form.addEventListener("submit", Add);
btnRefresh.addEventListener("click", LoadData);
btnEdit.addEventListener("click", Edit);
btnDelete.addEventListener("click", DeleteSelected);
chkSelectAll.addEventListener("click", SelectDeselectAll);
confirmDeleteModal.addEventListener("show.bs.modal", ConfirmDelete);
detailsModal.addEventListener("show.bs.modal", Details);


//Functionalties
var allRowsCount = 0;
var selectedRows = [];
var idRowForDelete;

window.onload = LoadData();

function LoadData() {
    console.log("start loading");
    RefreshPage();
    chkSelectAll.checked = false;
    tbody.innerHTML = "";
    //Consuming REST api
    fetch("http://Localhost:5268/Person/GetAll")
        .then((res) => res.json())
        .then((dto) => {
            console.log({ dto });
            console.table(dto);
            let html = "";
            allRowsCount = dto.length;
            /*console.log('allRowsCount: ' + allRowsCount);*/
            dto.forEach(function (dto) {
                html += `<tr id="${dto.id}">
                  <td><input id="${dto.id}" class="form-check-input" type="checkbox" name="chk" onClick="SelectRow(this);"</td>
                  <td id="firstNameCell">${dto.firstName}</td>
                  <td id="lastNameCell">${dto.lastName}</td>
                  <td id="emailCell">${dto.email}</td>
                     <td>
                    <input id="${dto.id}" onClick="GetDetails(this);" class="btn btn-outline-primary btn-sm" type="button" value="Details" data-bs-toggle="modal" data-bs-target="#detailsModal">
                    <input id="${dto.id}" onClick="ConfirmDelete(this);" class="btn btn-outline-danger btn-sm" type="button" value="Delete" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">                   
                  </td>
                </tr>`;
            });
            tbody.innerHTML = html;
        });
}

function Add(e) {
    e.preventDefault();
    let isValidData = ValidateFormData();

    if (isValidData) {
        let dto = {
            Id: "",
            FirstName: firstName.value,
            LastName: lastName.value,
            Email: email.value
        };
        fetch("http://Localhost:5268/Person/Post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            },
            body: JSON.stringify(dto)
        }).then((res) => {
            if (res.status === 409) {
                emailValidationMessage.innerText = `Person with Email : ${email.value} already exist`;
                email.classList.add("is-invalid");
            } else if (res.status === 200) {
                TriggerResultMessage("Operation Successful");
                LoadData();
            } else {
                TriggerResultMessage("Operation Failed");
            }
        });
    }
}
function Edit() {
    console.log("start editing");
    const isValidData = ValidateFormData();
    if (isValidData) {
        const dto = {
            Id: id.value,
            FirstName: firstName.value,
            LastName: lastName.value,
            Email: email.value
        };

        fetch("http://Localhost:5268/Person/Put", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            },
            body: JSON.stringify(dto)
        }).then((res) => {
            if (res.status === 409) {
                email.innerText = `Person with email : ${email.value} already exist`;
                email.classList.add("is-invalid");
            } else if (res.status === 200) {
                TriggerResultMessage("Operation Successful");
                LoadData();
            } else {
                TriggerResultMessage("Operation Failed");
            }
        });
    }
}

function Delete() {
    fetch("http://Localhost:5268/Person/Delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
        },
        body: JSON.stringify({ Id: idRowForDelete }),
    }).then((res) => {
        if (res.status == 200) {
            TriggerResultMessage("Operation Successful");
            LoadData();
        } else {
            TriggerResultMessage("Operation Failed");
        }
    });
    idRowForDelete = "";
}

function DeleteSelected() {
    let checkBox = document.getElementsByName("chk");
    console.log("Mahdi");
    if (checkBox.checked === false) {
        ErrorEvent("Not valid");
    }
    else { document.getElementById(selectedRows.id); }
    Delete();
}

function SelectDeselectAll() {
    const checkBoxes = document.getElementsByName("chk");
    console.clear();
    console.log("SelectDeselectAll()");
    console.log("selectedRows: " + selectedRows.length);
    if (chkSelectAll.checked) {
        console.log("checked");

        for (let i = 0; i < checkBoxes.length; i++) {

            checkBoxes[i].checked = true;
        }
    } else {
        console.log("unChecked");

        for (let i = 0; i < checkBoxes.length; i++) {

            checkBoxes[i].checked = false;
        }
    }

}

function SelectRow(checkBox) {
    console.clear();
    if (checkBox.checked === true) {
        selectedRows.push(checkBox.id);
    }
    else selectedRows.splice(selectedRows.indexOf(checkBox.id), 1);

    console.log(`selectedRows: ${selectedRows.length}`);

    switch (selectedRows.length) {
        case 1:

            RefreshPage();
            btnEdit.disabled = false;
            btnDelete.disabled = false;
            id.value = selectedRows[0];
            firstName.value = document.querySelector(
                `tr[id="${selectedRows[0]}"] td[id="firstNameCell"]`
            ).innerText;
            lastName.value = document.querySelector(
                `tr[id="${selectedRows[0]}"] td[id="lastNameCell"]`
            ).innerText;
            email.value = document.querySelector(
                `tr[id="${selectedRows[0]}"] td[id="emailCell"]`
            ).innerText;
            break;
        case selectedRows.length > 1:
            RefreshPage();
            break;

        default:
            RefreshPage();
            break;
    }
}

function GetDetails(button) {
    console.log(button.id);
    let id = button.id;
    console.log(id);
    fetch(`http://Localhost:5268/Person/Get?id=${id}`)
        .then((res) => res.json())
        .then((json) => {
            let inModalUl = document.querySelectorAll(".card li");
            inModalUl[0].innerText = `First Name : ${json.firstName}`;
            inModalUl[1].innerText = `Last Name : ${json.lastName}`;
            inModalUl[2].innerText = `Email : ${json.email}`;
        });
}

function RefreshPage() {
    btnAdd.disabled = false;
    btnEdit.disabled = false;
    btnDelete.disabled = false;

    firstName.classList.remove("is-invalid", "is-valid");
    lastName.classList.remove("is-invalid", "is-valid");
    email.classList.remove("is-invalid", "is-valid");

    firstName.value = "";
    firstName.value = "";
    lastName.value = "";
    email.value = "";

    firstNameValidationMessage.innerText = "";
    lastNameValidationMessage.innerText = "";
    emailValidationMessage.innerText = "";

}

function ValidateFormData() {
    let isValidData = true;

    if (firstName.value === "") {
        firstNameValidationMessage.innerText = "First name is required";
        firstName.classList.add("is-invalid");
        isValidData = false;
    } else {
        firstName.classList.add("is-valid");
    }

    if (lastName.value === "") {
        lastNameValidationMessage.innerText = "Lastname is required";
        lastName.classList.add("is-invalid");
        isValidData = false;
    } else {
        lastName.classList.add("is-valid");
    }

    if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(email.value)) {
        email.innerText = "Richtig email";
        email.classList.add("is-valid");
        isValidData = true;

        //const validateEmail = (email) => {
        //    return email.match(
        //        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        //    );
        //};
    }
    return isValidData;
}

function ConfirmDelete(button) {
    console.clear();
    //console.log(button);
    //console.log(button.id);
    idRowForDelete = button.id;
    console.log(idRowForDelete);
    PassDetails(idRowForDelete);
    console.log(btnConfirmDelete);
    btnConfirmDelete.addEventListener("click", Delete);
}

function PassDetails(id) {
    let firstName = document.querySelector(
        `tr[id="${id}"] td[id="firstNameCell"]`
    ).innerText;
    let lastName = document.querySelector(
        `tr[id="${id}"] td[id="lastNameCell"]`
    ).innerText;
    let email = document.querySelector(
        `tr[id="${id}"] td[id="emailCell"]`
    ).innerText;
    confirmDeleteModalBody.innerHTML = `You are deleting :<br><strong>First Name : ${firstName}<br>Last Name : ${lastName}<br>Email : ${email}</strong><br>Are you sure ?`;
}

function TriggerResultMessage(message) {
    resultMessage.innerText = message;
    resultMessage.style.opacity = "1";
    setTimeout(function () {
        resultMessage.style.opacity = "0";
    }, 2000);
}
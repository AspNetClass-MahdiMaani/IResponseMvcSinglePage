
// Form
var form = document.getElementById("form");

// Buttons
var btnInsert = document.getElementById("btnInsert");
var btnEdit = document.getElementById("btnEdit");
var btnDelete = document.getElementById("btnDelete");
var btnRefresh = document.getElementById("btnRefresh");
var btnDeleteConfirm = document.getElementById("btnDeleteConfirm");

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
var deleteConfirmModal = document.getElementById("deleteConfirmModal");
var inDeleteConfirmModalId = document.getElementById("inDeleteConfirmModalId");
var deleteConfirmModalBody = document.getElementById("deleteConfirmModalBody");

// Details Modal
var detailsModal = document.getElementById("detailsModal");

// Others
var chkSelectAll = document.getElementById("selectAll");
var tbody = document.querySelector("tbody");
var resultMessage = document.getElementById("resultMessage");

//Event Listeners
form.addEventListener("submit", Add);
btnRefresh.addEventListener("click", LoadData);
//btnEdit.addEventListener("click", Edit);
//chkSelectAll.addEventListener("click", DeselectAll);
//deleteConfirmModal.addEventListener("show.bs.modal", ConfirmDelete);
//detailsModal.addEventListener("show.bs.modal", Details);


//Functionalties
var selectedRows = [];
var allRowsCount;

window.onload = LoadData();

function LoadData() {
    console.log("start loading");
    RefreshForm();
    chkSelectAll.checked = false;
    DeselectAll();
    tbody.innerHTML = "";
    //Consuming REST api
    fetch("http://Localhost:5268/Person/GetAll")
        .then((res) => res.json())
        .then((dto) => {
            console.log({ dto });
            console.table(dto);
            let html = "";
           // allRowsCount = json.response.length;
            dto.forEach(function (dto) {
                html += `<tr id="${dto.id}">
                  <td><input id="selectRow" class="form-check-input" type="checkbox" name="${dto.id}" onClick="SelectRow(this);"</td>
                  <td id="fntd">${dto.firstName}</td>
                  <td id="lntd">${dto.lastName}</td>
                  <td id="etd">${dto.email}</td>
                  <td>
                    <input class="btn btn-outline-primary btn-sm" type="button" value="Details" data-bs-toggle="modal" data-bs-target="#detailsModal">
                    <input class="btn btn-outline-danger btn-sm" type="button" value="Delete" data-bs-toggle="modal" data-bs-target="#deleteConfirmModal">                   
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

//function Edit() {
//    RefreshForm(false);
//    let isValidData = ValidateFormData();

//    if (isValidData) {
//        let updateDto = {
//            Id: iptId.value,
//            FirstName: iptFirstName.value,
//            LastName: iptLastName.value,
//            NationalCode: iptNationalCode.value,
//        };

//        fetch("http://Localhost:5100/Person/Update", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//                Accept: "*/*",
//            },
//            body: JSON.stringify(updateDto),
//        }).then((res) => {
//            if (res.status == 409) {
//                vmNationalCode.innerText = `Person with NationalCode : ${iptNationalCode.value} already exist`;
//                iptNationalCode.classList.add("is-invalid");
//            } else if (res.status == 200) {
//                TriggerResultMessage("Operation Successful");
//                LoadData();
//            } else {
//                TriggerResultMessage("Operation Failed");
//            }
//        });
//    }
//}

//function Delete() {
//    let id = idInDeleteConfirmModal.value;
//    fetch("http://Localhost:5100/Person/Delete", {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json",
//            Accept: "*/*",
//        },
//        body: JSON.stringify({ Id: id }),
//    }).then((res) => {
//        if (res.status == 200) {
//            TriggerResultMessage("Operation Successful");
//            LoadData();
//        } else {
//            TriggerResultMessage("Operation Failed");
//        }
//    });
//    idInDeleteConfirmModal.value = "";
//}

//function DeleteSelected() {
//    let deleteSelectedDto = { DeletePersonDtosList: [] };
//    selectedRowsList.forEach((personId) => {
//        deleteSelectedDto.DeletePersonDtosList.push({ Id: personId });
//    });
//    fetch("http://Localhost:5100/Person/DeleteSelected", {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json",
//            Accept: "*/*",
//        },
//        body: JSON.stringify(deleteSelectedDto),
//    }).then((res) => {
//        if (res.status == 200) {
//            TriggerResultMessage("Operation Successful");
//            LoadData();
//        } else {
//            TriggerResultMessage("Operation Failed");
//        }
//    });
//}

function DeselectAll() {
    document.querySelectorAll("#selectRow").forEach((checkBox) => {
        chkSelectAll.checked = false;
        //    if (chkSelectAll.checked) {
        //        if (!selectedRowsList.includes(checkBox.name)) {
        //            checkBox.checked = true;
        //            selectedRowsList.push(checkBox.name);
        //        }
        //    } else {
        //        checkBox.checked = false;
        //        selectedRowsList = [];
        //    }
        //});
        //if (chkSelectAll.checked) {
        //    btnInsert.disabled = true;
        //    btnEdit.disabled = true;
        //    btnDelete.disabled = false;
        //    RefreshForm();
        //} else {
        //    btnInsert.disabled = false;
        //    btnEdit.disabled = true;
        //    btnDelete.disabled = true;
        //    RefreshForm();
        //}
    })
}

//function SelectRow(checkBox) {
//    if (checkBox.checked == true) {
//        selectedRowsList.push(checkBox.name);
//    } else selectedRowsList.splice(selectedRowsList.indexOf(checkBox.name), 1);

//    if (selectedRowsList.length != allRowsCount) cbxSelectAll.checked = false;
//    else cbxSelectAll.checked = true;

//    if (selectedRowsList.length >= 1) {
//        btnDeleteSelected.disabled = false;
//        btnInsert.disabled = true;
//    } else {
//        btnDeleteSelected.disabled = true;
//        btnInsert.disabled = false;
//    }

//    if (selectedRowsList.length == 1) {
//        btnEdit.disabled = false;
//        RefreshForm();
//        iptId.value = selectedRowsList[0];
//        iptFirstName.value = document.querySelector(
//            `tr[id="${selectedRowsList[0]}"] td[id="FNTD"]`
//        ).innerText;
//        iptLastName.value = document.querySelector(
//            `tr[id="${selectedRowsList[0]}"] td[id="LNTD"]`
//        ).innerText;
//        iptNationalCode.value = document.querySelector(
//            `tr[id="${selectedRowsList[0]}"] td[id="NCTD"]`
//        ).innerText;
//    } else {
//        btnEdit.disabled = true;
//        RefreshForm(true);
//    }
//}

//function Details(event) {
//    let clickedButton = event.relatedTarget;
//    let id = clickedButton.parentNode.parentNode.id;

//    fetch(`http://Localhost:5100/Person/Details?id=${id}`)
//        .then((res) => res.json())
//        .then((json) => {
//            let inModalUl = document.querySelectorAll(".card li");
//            inModalUl[0].innerText = `First Name : ${json.firstName}`;
//            inModalUl[1].innerText = `Last Name : ${json.lastName}`;
//            inModalUl[2].innerText = `National Code : ${json.nationalCode}`;
//        });
//}

function RefreshForm() {
   
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
        lastNameValidationMessage.innerText = "Last name is required";
        lastName.classList.add("is-invalid");
        isValidData = false;
    } else {
        lastName.classList.add("is-valid");
    }

    if (! /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(email.value)) {
        email.innerText = "Wrong email";
        email.classList.add("is-invalid");
        isValidData = false;

        //const validateEmail = (email) => {
        //    return email.match(
        //        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        //    );
        //};
    }
    return isValidData;
}

//function ConfirmDelete(event) {
//    let clickedButton = event.relatedTarget;

//    if (clickedButton.value == "Delete") {
//        let id = clickedButton.parentNode.parentNode.id;
//        idInDeleteConfirmModal.value = id;

//        PassDetailsToDeleteConfirm(id);

//        btnDeleteConfirm.addEventListener("click", Delete);
//    } else {
//        if (selectedRowsList.length == 1)
//            PassDetailsToDeleteConfirm(selectedRowsList[0]);
//        else
//            deleteConfirmModalBody.innerHTML = `Your are deleting <strong>${selectedRowsList.length} records</strong> , Are you sure ? `;

//        btnDeleteConfirm.addEventListener("click", DeleteSelected);
//    }
//}

//function PassDetailsToDeleteConfirm(id) {
//    let firstName = document.querySelector(
//        `tr[id="${id}"] td[id="FNTD"]`
//    ).innerText;
//    let lastName = document.querySelector(
//        `tr[id="${id}"] td[id="LNTD"]`
//    ).innerText;
//    let nationalCode = document.querySelector(
//        `tr[id="${id}"] td[id="NCTD"]`
//    ).innerText;
//    deleteConfirmModalBody.innerHTML = `You are deleting :<br><strong>First Name : ${firstName}<br>Last Name : ${lastName}<br>National Code : ${nationalCode}</strong><br>Are you sure ?`;
//}

function TriggerResultMessage(message) {
    resultMessage.innerText = message;
    resultMessage.style.opacity = "1";
    setTimeout(function () {
        resultMessage.style.opacity = "0";
    }, 2000);
}
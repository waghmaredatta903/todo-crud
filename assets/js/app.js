const cl = console.log;

const todoForm = document.getElementById('todoForm')
const inputControl = document.getElementById('inputControl')
const addtodoBtn = document.getElementById('addtodoBtn')
const updatetodoBtn = document.getElementById('updatetodoBtn')
const todocontainer = document.getElementById('todocontainer')
const spinner = document.getElementById('spinner')

const BASE_URL = `https://crud-b22-e9992-default-rtdb.asia-southeast1.firebasedatabase.app`;
const TODO_URL = `${BASE_URL}/todos.json`;

let todoArr = [];

//read-todo//
let xhr = new XMLHttpRequest()
xhr.open('GET', TODO_URL)
xhr.send(null)
xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
        let res = JSON.parse(xhr.response)
        for (const key in res) {
            res[key].id = key;
            todoArr.unshift(res[key])
            readtodo(todoArr)
        }
    } else {
        cl(`somthing want wrong ..?`)
    }
}

// cl(todoArr)
function readtodo(arr) {
    let result = ``;
    arr.forEach(ele => {
        result += `<li class="list-group-item d-flex justify-content-between" id="${ele.id}" >
                                <strong>${ele.todoinput}</strong>
                                <div>
                                    <i onclick="eidttodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="deletetodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>
                            </li>`;
    });
    todocontainer.innerHTML = result;

}
//create todo//
function oncreatetodo(eve) {
    spinner.classList.remove('d-none')
    eve.preventDefault()
    let todoObj = {
        todoinput: inputControl.value

    }
    let xhr = new XMLHttpRequest()
    xhr.open('POST', TODO_URL)
    xhr.send(JSON.stringify(todoObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            let li = document.createElement('li');
            li.id = res.name;
            li.className = `list-group-item d-flex justify-content-between`;
            li.innerHTML = `
                                <strong>${todoObj.todoinput}</strong>
                                <div>
                                    <i onclick="eidttodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="deletetodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>
                            </li>`;
            todocontainer.prepend(li)
            todoForm.reset()

            Swal.fire({
                title: "Creae Successfully..!!!",
                text: "post data has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        } else {

        }

        spinner.classList.add('d-none')
    }
}

//edit-todo//
function eidttodo(ele) {
    spinner.classList.remove('d-none')

    // cl(ele)
    let edit_id = ele.closest('li').id;
    // cl(edit_id)
    localStorage.setItem('UPDATE_ID', edit_id)
    let edit_url = `${BASE_URL}/todos/${edit_id}.json`;

    let xhr = new XMLHttpRequest()
    xhr.open('GET', edit_url)
    xhr.send(null)
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            // cl(res)
            inputControl.value = res.todoinput
            addtodoBtn.classList.add('d-none')
            updatetodoBtn.classList.remove('d-none')
        }
        spinner.classList.add('d-none')

    }
}

//update-todo//
function onupdatetodo() {
    spinner.classList.remove('d-none')

    let UPDATE_ID = localStorage.getItem('UPDATE_ID')
    let updateObj = {
        todoinput: inputControl.value
    }
    // cl(updateObj)
    let update_url = `${BASE_URL}/todos/${UPDATE_ID}.json`;
    let xhr = new XMLHttpRequest()
    xhr.open("PATCH", update_url)
    xhr.send(JSON.stringify(updateObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response)
            let li = document.getElementById(UPDATE_ID)
            li.innerHTML = `<strong>${updateObj.todoinput}</strong>
                                <div>
                                    <i onclick="eidttodo(this)" class="fa-regular fa-pen-to-square fa-2x text-primary"></i>
                                    <i onclick="deletetodo(this)" class="fa-solid fa-trash fa-2x text-danger"></i>
                                </div>`;
            todoForm.reset()
            addtodoBtn.classList.remove('d-none');
            updatetodoBtn.classList.add('d-none')
        } else {
            cl(`somthing want wrong..?`)

            
            Swal.fire({
                title: "Updated Successfully..!!!",
                text: "post data has been successfully..!!",
                icon: "success",
                timer: 4000
            });
        }
       
    }
      spinner.classList.add('d-none')
}

//delete-todo//
function deletetodo(ele) {
    spinner.classList.remove('d-none')

    let delete_id = ele.closest('li').id;
    //cl(delete_id)
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            let delete_url = `${BASE_URL}/todos/${delete_id}.json`;
            let xhr = new XMLHttpRequest()
            xhr.open('DELETE', delete_url)
            xhr.send(null)
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response)
                    ele.closest('li').remove()

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                } else {
                    cl(`somthing want wrong..?`)
                }
                
            }
            spinner.classList.add('d-none')
        }
    });
}

todoForm.addEventListener('submit', oncreatetodo)
updatetodoBtn.addEventListener('click', onupdatetodo)
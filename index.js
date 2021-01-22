const db = firebase.firestore();

const taskForm = document.getElementById("task-form");
const tasksContainer = document.getElementById("tasks-container");



let editStatus = false;
let id = '';

/**
 * Save a New Task in Firestore
 * @param {string} title the title of the Task
 * @param {string} description the description of the Task
 */
const saveTask = (title, description, emailid, gender, contact, age, bg) =>
  db.collection("tasks").doc().set({
    title,
    description,
    emailid,
    gender,
    contact,
    age,
    bg,
  });

const getTasks = () => db.collection("tasks").get();

const onGetTasks = (callback) => db.collection("tasks").onSnapshot(callback);

const deleteTask = (id) => db.collection("tasks").doc(id).delete();

const getTask = (id) => db.collection("tasks").doc(id).get();

const updateTask = (id, updatedTask) => db.collection('tasks').doc(id).update(updatedTask);

window.addEventListener("DOMContentLoaded", async (e) => {
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";
    var s = 1;
    querySnapshot.forEach((doc) => {
      const task = doc.data();

      if (s % 2 == 0) {
        s++;
        tasksContainer.innerHTML += `<div class="card card-body mt-2 border-primary" style="text-align: center;">
    <div class="row no-gutters">
    <div class="col-md-4">
      <img
        src="https://img.icons8.com/bubbles/2x/school.png"
        height="80%" class="card-img" alt="...">
      <br><br>
      <button class="btn btn-outline-primary btn-delete " data-id="${doc.id}">
        Delete
      </button>
      <button class="btn btn-outline-danger btn-edit" data-id="${doc.id}">
        Edit
      </button>
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h1 class="card-text"><i class="fa fa-user-graduate"></i>&nbsp;<b>Kishore D</b></h1>
        <h5 class="card-text">
          <center>
            <h3 class="profilePage__rollNo">${task.description}</h3>
          </center>
        </h5>
        <p class="card-text"><i class="fa fa-users"></i>&nbsp;Gender: ${task.gender}</p>
        <p class="card-text"><i class="fa fa-file"></i>&nbsp;Age: ${task.age}</p>
        <p class="card-text"><i class="fa fa-tint"></i>&nbsp;Blood Group: ${task.bg}</p>
        <a href="mailto:${task.emailid}" class="profilePage__email">
          <span>
            <div class="fa fa-envelope"></div>&nbsp;${task.emailid}
          </span>
        </a><br><a href="tel:+91${task.contact}" class="profilePage__email profilePage__phone"><span>
            <div class="fa fa-phone"></div>&nbsp;+91 ${task.contact}
          </span>

        </a>
      </div>
    </div>
  </div>
  </div>`;
      } else {
        s++;
        tasksContainer.innerHTML += `<div class="card card-body mt-2 border-info" style="text-align: center;">
    <div class="row no-gutters">
    <div class="col-md-4">
      <img
        src="https://img.icons8.com/bubbles/2x/school.png"
        height="80%" class="card-img" alt="...">
      <br><br>
      <button class="btn btn-outline-primary btn-delete " data-id="${doc.id}">
        Delete
      </button>
      <button class="btn btn-outline-danger btn-edit" data-id="${doc.id}">
        Edit
      </button>
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h1 class="card-text"><i class="fa fa-user-graduate"></i>&nbsp;<b>Kishore D</b></h1>
        <h5 class="card-text">
          <center>
            <h3 class="profilePage__rollNo">${task.description}</h3>
          </center>
        </h5>
        <p class="card-text"><i class="fa fa-users"></i>&nbsp;Gender: ${task.gender}</p>
        <p class="card-text"><i class="fa fa-file"></i>&nbsp;Age: ${task.age}</p>
        <p class="card-text"><i class="fa fa-tint"></i>&nbsp;Blood Group: ${task.bg}</p>
        <a href="mailto:${task.emailid}" class="profilePage__email">
          <span>
            <div class="fa fa-envelope"></div>&nbsp;${task.emailid}
          </span>
        </a><br><a href="tel:+91${task.contact}" class="profilePage__email profilePage__phone"><span>
            <div class="fa fa-phone"></div>&nbsp;+91 ${task.contact}
          </span>

        </a>
      </div>
    </div>
  </div>
  </div>`;
      }
    });


    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) =>
      btn.addEventListener("click", async (e) => {
        console.log(e.target.dataset.id);
        
        try {
          await deleteTask(e.target.dataset.id);

          swal("Done! Your student data has been deleted!", {
            icon: "success",
          });
         
          
        } catch (error) {
          console.log(error);
        }
      })
    );

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();
          taskForm["task-title"].value = task.title;
          taskForm["task-description"].value = task.description;
          taskForm["task-emailid"].value = task.emailid;
          taskForm["task-gender"].value = task.gender;
          taskForm["task-contact"].value = task.contact;
          taskForm["task-age"].value = task.age;
          taskForm["task-bg"].value = task.bg;


          editStatus = true;
          id = doc.id;
          taskForm["btn-task-form"].innerText = "Update";

        } catch (error) {
          console.log(error);
        }
      });
    });
  });
});

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskForm["task-title"];
  const description = taskForm["task-description"];
  const emailid = taskForm["task-emailid"];
  const gender = taskForm["task-gender"];
  const contact = taskForm["task-contact"];
  const age = taskForm["task-age"];
  const bg = taskForm["task-bg"];

  try {
    if (!editStatus) {
      swal("Thank You!", "You data has been saved!", "success");
      await saveTask(title.value, description.value, emailid.value, gender.value, contact.value, age.value, bg.value);


    } else {




      await updateTask(id, {
        title: title.value,
        description: description.value,
        emailid: emailid.value,
        gender: gender.value,
        contact: contact.value,
        age: age.value,
        bg: bg.value,

      })
      swal("Thank You!", "Your Data has been updated!", "success");
      editStatus = false;
      id = '';
      taskForm['btn-task-form'].innerText = 'Save';
    }

    taskForm.reset();

    title.focus();
  } catch (error) {
    console.log(error);
  }
});



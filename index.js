const db = firebase.firestore();
const taskform = document.getElementById('task-form');
const tasksContainer = document.getElementById('task-container');

let editStatus = false;
let id = '';

const saveTask = (title, description) =>
    //Guardar datos en una coleccion asrincrona
    db.collection('task').doc().set({
        title,
        description,
    });

//funcion obtener tareas 
const getTask = () => db.collection('task').get();

//para traer los datos para actualizar
const getTasks = (id) => db.collection('task').doc(id).get();

const onGetTask = (callback) => db.collection('task').onSnapshot(callback);

const deleteTask = id => db.collection('task').doc(id).delete();

//para actualizar
const UpdateTask = (id, UpdateTask) =>
    db.collection('task').doc(id).update(UpdateTask);




window.addEventListener('DOMContentLoaded', async(e) => {

    //ongettask viene de firebase
    onGetTask((querySnapshot) => {
        tasksContainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            console.log(doc.data());

            const task = doc.data();
            task.id = doc.id;
            tasksContainer.innerHTML +=
                `
                </br>
                <div class="card text-white bg-primary mb-3" style="max-width: 20rem;">
                <div class="card-header">${task.title}</div>
                <div class="card-body">                    
                <p>${task.description}</p>
                </div>

                <div class="card-footer btn-sm">
                <button class="btn btn-danger btn-delete" data-id="${task.id}">
                🗑 Delete
              </button>
              <button class="btn btn-success btn-edit" data-id="${task.id}">
              🖉 Edit
            </button>
                </div>
                </div>`;

            const btnDelete = document.querySelectorAll('.btn-delete');
            btnDelete.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    await deleteTask(e.target.dataset.id)
                })
            });
            const bntEdit = document.querySelectorAll('.btn-edit');
            bntEdit.forEach(btn => {
                btn.addEventListener('click', async(e) => {
                    const doc = await getTasks(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskform['task-title'].value = task.title;
                    taskform['task-description'].value = task.description;
                    taskform['btn-task-form'].innerText = "Update";


                })
            })
        });
    });
});

taskform.addEventListener("submit", async(e) => {
    e.preventDefault();
    const title = taskform['task-title'];
    const description = taskform['task-description'];

    if (!editStatus) {
        await saveTask(title.value, description.value);
    } else {
        await UpdateTask(id, {
            title: title.value,
            description: description.value
        });

        editStatus = false;
        id = '';
        taskform['btn-task-form'].innerText = 'Save';
    }

    await getTask();

    taskform.reset();
    title.focus();

});
// Seleccion de elementos
const refresh = document.querySelector(".refresh");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("item");

// Nombre de las Clases
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle";
const LINE_THROUGH = "lineThrough";

//variables
let LIST, id;

//Obtener tareas desde el almacenamiento local
let data = localStorage.getItem("TODO");

//Verificar si los datos no estan vacios
if(data){

    LIST = JSON.parse(data);
    id = LIST.length; //Settear la id al ultimo de la lista
    loadList(LIST); //Carga la lista a la interfaz del usuario

}else{
    //si los datos estan vacio
    LIST = [];
    id = 0;
}

//Cargar tareas a la interfaz del usuario
function loadList(array){
    array.forEach(function(item){
        addToDo(item.name, item.id, item.done, item.trash);
    })
}

// Limpiar el almacenamiento local
refresh.addEventListener("click", function(){
    localStorage.clear();
    location.reload();
})

// Mostrar la fecha
const today = new Date();
const options = { weekday : "long", day:"numeric", month:"long"};

dateElement.innerHTML = today.toLocaleDateString("es-ES", options);

//Creacion de función para agregar una tarea a la lista
function addToDo (toDo, id, done, trash){

    if(trash){
        return;
    }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item =    `
                    <li class="item">
                        <i class="far ${DONE} co" job="complete" id="${id}"></i>
                        <p class="text ${LINE}">${toDo}</p>
                        <i class="fas fa-trash de" job="delete" id="${id}"></i>
                    </li>
                    `;
    const position = "beforeend";

    list.insertAdjacentHTML(position, item);
}

//Agregar una entrada a la lista con la tecla ENTER
document.addEventListener("keyup", function(event){
    if(event.keyCode == 13){
        const toDo = input.value;
        // Si el input no está vacio:
        if(toDo){
            addToDo(toDo, id, false, false);
            //almacenar los items en lista
            LIST.push({
                name : toDo,
                id : id,
                done : false,
                trash : false
            });
            //Agregar tareas al almacenamiento local (este codigo debe agregarse donde LIST es actualizada)
            localStorage.setItem("TODO", JSON.stringify(LIST));

            id++;
        }
        input.value = "";
    }
});


//Completar una tarea
function completeToDo(element){
    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//Eliminar una tarea
function removeToDo(element){
    element.parentNode.parentNode.removeChild(element.parentNode);

    LIST[element.id].trash = true;
}

list.addEventListener("click", function(event){
    const element = event.target; // Retorna el elemento cliqueado dentro de la lista
    const elementJob = element.attributes.job.value; //Completa o elimina

    if(elementJob == "complete"){
        completeToDo(element);
    }else if(elementJob == "delete"){
        removeToDo(element);
    }
    //Agregar tareas al almacenamiento local (este codigo debe agregarse donde LIST es actualizada)
    localStorage.setItem("TODO", JSON.stringify(LIST));

})
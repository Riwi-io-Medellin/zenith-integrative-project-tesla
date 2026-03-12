import { btnBack, btnCreate, modalCourses, coverCourseIn, previewImg, placeHolder, courseTitle, courseDesc, moduleCont, btnModule, coursePublic, cateSelect, gameSelect, submitBtn, modalTitle} from "./elements.js";

const port = "http://127.0.0.1:4000/api/courses";

//-----------------form logic----------------------------//

let courseData = null;

let myModules = [];

async function loadCourses(){

    try {
        
        const response = await fetch(`${port}/`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });

        if(response.ok){

            const data = await response.json();
            const created = data.data.created || [];
            const enrolled = data.data.enrolled || [];

            courseData = created[0] || null;

            if(courseData){
                myModules = courseData.modules || [];
                myModules.sort((a,b) => a.order_index - b.order_index);

                editMode();
                loadData();
                renderCards();
            }

        };


    } catch (error) {
    
        console.error("Connection error (Server might be down):", error);

    };

}

async function createOrEdit(){

    console.log("title:", courseTitle.value);
    console.log("desc:", courseDesc.value);
    console.log("category:", cateSelect.value);
    console.log("game:", gameSelect.value);
    console.log("photo:", coverCourseIn.value);

    const dataCourse = {
        title: courseTitle.value.trim(),
        description: courseDesc.value.trim(),
        photo: coverCourseIn.value.trim(),
        isPublic: coursePublic.checked,
        category: cateSelect.value,
        game: gameSelect.value,
        modules:  myModules.map((m, idx) => ({

            title: m.title.trim(),
            content: m.content.trim(),
            order_index: idx
        
        }))

    };



    if (!dataCourse.title || !dataCourse.description || !dataCourse.category || !dataCourse.game) {

        showErrorUI("Please fill in the title, description, and select both a category and a game mode.");
        return;

    };

    const method = courseData ? "PUT" : "POST";
    const url = courseData ? `${port}/${courseData.course_id}`: `${port}/`

    console.log("courseData:", courseData);
    console.log("url:", url);
    console.log("method:", method);

    try {

        const response = await fetch(url, {
            method,
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataCourse)            
        })

        if(response.ok){

            const result = await response.json();

            if(!courseData){
                courseData = result.data
                editMode()
            }

            console.log(`${method} exitoso`);
            console.table(result);
            toggle(false);

        }
        
    } catch (error) {

        console.error("Error to connect" + error.message);
        showErrorUI(error.message)
    
    }

}

function loadData(){

    if (courseData) {
        courseTitle.value = courseData.title || "";
        courseDesc.value = courseData.description || "";
        coverCourseIn.value = courseData.photo || courseData.cover_photo || "";
        coursePublic.checked = courseData.is_public || false;
        cateSelect.value = courseData.category_id || "";
        gameSelect.value = courseData.game_id || "";
        
        // Forzamos previsualización de imagen
        coverCourseIn.dispatchEvent(new Event('input'));
    }

}

function renderCards(){

    if(!moduleCont){
        return
    }

    moduleCont.innerHTML = ""

    if(myModules.length === 0){
        
        moduleCont.innerHTML = `
            <div class="text-center text-muted my-auto opacity-50" id="no-modules-msg">
                <i class="bi bi-folder2-open display-4"></i>
                <p class="small mt-2">No modules added yet</p>
            </div>`;
        return

    }
        
    myModules.forEach((mod, index) => {

        const card = document.createElement('div');
        card.className = 'module-card fade-in';
        card.id = `mod-${mod.id}`;
        
        card.innerHTML = `
            <div class="d-flex align-items-start gap-3">
                <div class="index-badge mt-1">${index + 1}</div>
                <div class="flex-grow-1">
                    <input type="text" 
                            class="module-title-input" 
                            value="${mod.title || ""}" 
                            placeholder="Module Title">
                    <textarea class="module-content-area" 
                                rows="2" 
                                placeholder="Module description...">${mod.content || ""}</textarea>
                </div>
                <button class="btn btn-delete-mod mt-1">
                    <i class="bi bi-x-circle-fill"></i>
                </button>
            </div>
        `;

        const titleIn = card.querySelector('.module-title-input');
        const contentIn = card.querySelector('.module-content-area');
        const deleteBtn = card.querySelector('.btn-delete-mod');

        titleIn.addEventListener('input', (e) => mod.title = e.target.value);
        contentIn.addEventListener('input', (e) => mod.content = e.target.value);
        deleteBtn.addEventListener('click', () => removeModule(mod.id));

        moduleCont.appendChild(card);
    
    });

}

function addModule(){

    const tempId = 'temp-' + crypto.randomUUID(); 
    
    const newModule = {
        id: tempId,
        title: '',
        content: '',
        order_index: myModules.length
    };
    
    myModules.push(newModule);
    renderCards();
}

function removeModule(id) {
    myModules = myModules.filter(m => m.id !== id);
    renderCards();
}

function editMode(){

    btnCreate.innerHTML = "<i class='bi bi-pencil-square me-2'></i>Edit Course";
    modalTitle.textContent = "Edit your course:";
    submitBtn.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>Update`;

}


function showErrorUI(message) {
    const msg = document.createElement('div');
    msg.className = "alert alert-danger mt-3 fade-in shadow-sm";
    msg.innerHTML = `<strong>Error:</strong> ${message}`;
    
    const container = document.querySelector('.card-body');
    if (container) {
        container.prepend(msg);
        setTimeout(() => msg.remove(), 6000);
    }
}

if(submitBtn){
    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        createOrEdit();
    })
}

if(addModule){
    btnModule.addEventListener("click", addModule)
}

//--------------------------------------------------------------//

function selectors(elementId, data, text){

    const select = document.getElementById(elementId);

    if(!select){
        return
    }

    select.innerHTML = `<option selected disabled hidden>${text}</option>`;

    data.forEach(item => {

        const option = document.createElement("option");

        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option)
        
    });

}

async function loadSelectors() {
    
    try {
        
        const [categoriRes, gameRes] = await Promise.all([
            fetch(`${port}/categories`),
            fetch(`${port}/games`)
        ]);

        const categoriesData = await categoriRes.json();
        const gamesData = await gameRes.json()

        selectors("select-Cate", categoriesData.data, "Choose a Category")
        selectors("select-Game", gamesData.data, "choose a game")


    } catch (error) {
        
        console.error("Connection error (Server might be down):", error);

    }

}


function toggle(show){
    modalCourses.style.display = show ? "flex" : "none";
    if(show) loadData();
}

btnCreate.addEventListener("click", () => toggle(true));

modalCourses.addEventListener("click", (e) => {
    if(e.target === modalCourses) toggle(false);
})

coverCourseIn.addEventListener("input", (e) => {
    const url = e.target.value.trim();

    const existImg = previewImg.querySelector("img");

    if(existImg) existImg.remove()

    if(url){

        const img = document.createElement("img");

        img.src = url;
        img.alt = "Sorry";

        img.onerror = () => {
            img.remove()
            placeHolder.style.display = "flex";
        };

        img.onload = () => {
            placeHolder.style.display = "none";
        };

        previewImg.appendChild(img);
    }else{
        placeHolder.style.display = "flex"
    }
})

document.addEventListener('DOMContentLoaded', async () => {
    await loadSelectors();
    await loadCourses();
});
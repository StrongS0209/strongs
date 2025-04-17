// Функция для добавления нового элемента в список
function addItem(inputId, listId) {
    let input = document.getElementById(inputId);
    let list = document.getElementById(listId);
    let value = input.value.trim();

    // Проверка на пустые строки и дубли
    if (value === "") {
        alert("Proszę wpisać wartość.");
        return;
    }

    let existingItems = list.querySelectorAll("li");
    for (let item of existingItems) {
        if (item.textContent.includes(value)) {
            alert("To miasto/miejsce/atrakcja już istnieje na liście.");
            return;
        }
    }

    // Добавление нового элемента в список
    let listItem = document.createElement("li");
    listItem.textContent = value;

    let editButton = document.createElement("button");
    editButton.textContent = "Edytuj";
    editButton.classList.add("edit-btn");
    editButton.onclick = function () {
        editItem(listItem);
    };

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.classList.add("delete-btn");
    deleteButton.onclick = function () {
        list.removeChild(listItem);
        saveList(listId); // Сохраняем изменения после удаления
    };

    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    list.appendChild(listItem);

    input.value = "";
    saveList(listId); // Сохраняем изменения после добавления
}

// Функция для редактирования элемента
function editItem(listItem) {
    const newValue = prompt("Edytuj wartość:", listItem.textContent.replace("Usuń", "").trim());
    if (newValue && newValue !== listItem.textContent) {
        listItem.firstChild.textContent = newValue;
        saveList(listItem.parentElement.id); // Сохраняем изменения после редактирования
    }
}

// Функция для сохранения списка в localStorage
function saveList(listId) {
    const list = document.getElementById(listId);
    const items = [];
    list.querySelectorAll("li").forEach((item) => {
        items.push(item.textContent.replace("Edytuj", "").replace("Usuń", "").trim());
    });
    localStorage.setItem(listId, JSON.stringify(items));
}

// Функция для загрузки списка из localStorage
function loadList(listId) {
    const savedItems = JSON.parse(localStorage.getItem(listId));
    if (savedItems) {
        const list = document.getElementById(listId);
        savedItems.forEach((item) => {
            let listItem = document.createElement("li");
            listItem.textContent = item;

            let editButton = document.createElement("button");
            editButton.textContent = "Edytuj";
            editButton.classList.add("edit-btn");
            editButton.onclick = function () {
                editItem(listItem);
            };

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "Usuń";
            deleteButton.classList.add("delete-btn");
            deleteButton.onclick = function () {
                list.removeChild(listItem);
                saveList(listId); // Сохраняем изменения после удаления
            };

            listItem.appendChild(editButton);
            listItem.appendChild(deleteButton);
            list.appendChild(listItem);
        });
    }
}

// Загрузка списков при загрузке страницы
window.onload = function() {
    loadList("city-list");
    loadList("locations-list");
    loadList("activity-list");
    loadTripInfo();  // Загружаем информацию о поездке
};

// Функции для добавления городов, мест и аттракций
function addCity() {
    addItem("city", "city-list");
}

function addLocation() {
    addLocationWithImage("location", "locations-list");
}

function addActivity() {
    addItem("activity", "activity-list");
}

// Функция для сохранения информации о поездке в localStorage
function saveTripInfo() {
    const tripName = document.getElementById('trip-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    const tripInfo = {
        name: tripName,
        startDate: startDate,
        endDate: endDate
    };
    
    localStorage.setItem('tripInfo', JSON.stringify(tripInfo));
}

// Функция для загрузки информации о поездке из localStorage
function loadTripInfo() {
    const savedTripInfo = JSON.parse(localStorage.getItem('tripInfo'));
    if (savedTripInfo) {
        document.getElementById('trip-name').value = savedTripInfo.name;
        document.getElementById('start-date').value = savedTripInfo.startDate;
        document.getElementById('end-date').value = savedTripInfo.endDate;
    }
}

// Firebase для регистрации и входа пользователей
function signUpUser(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        console.log('User registered:', user);
      })
      .catch((error) => {
        console.error(error.message);
      });
}

function signInUser(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        var user = userCredential.user;
        console.log('User signed in:', user);
      })
      .catch((error) => {
        console.error(error.message);
      });
}

// Функция для добавления нового места с изображением
function addLocationWithImage() {
    console.log("📌 Функция addLocationWithImage вызвана!");
    let locationInput = document.getElementById("location");
    let locationValue = locationInput.value.trim();
    if (locationValue === "") {
        alert("Proszę wpisać miejsce!");
        return;
    }

    // Добавление места в список
    let listItem = document.createElement("li");
    listItem.textContent = locationValue;
    
    // Добавление кнопки для удаления
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Usuń";
    deleteButton.onclick = function() {
        listItem.remove();
        removeImage(locationValue);
    };
    listItem.appendChild(deleteButton);
    document.getElementById("locations-list").appendChild(listItem);

    // Загрузка изображения с Unsplash для места
    loadImage(locationValue);

    locationInput.value = ""; // Очистить поле ввода
}

// Функция для загрузки изображения с Unsplash
function loadImage(location) {
    const apiKey = 'bFEIOj55YKfpCDH3i1y23C7bpm49Eay9-auj7NvwHR4'; // Ваш API-ключ
    const url = `https://api.unsplash.com/photos/random?query=${location}&client_id=${apiKey}`;
    
    console.log("📸 Запрос к Unsplash:", url);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Ответ от Unsplash:", data);
            const imageUrl = data?.urls?.regular; // Без data[0]
 // Получаем ссылку на изображение
            if (imageUrl) {
                displayImage(location, imageUrl);
            } else {
                console.log('No image found for this location');
            }
        })
        .catch(error => {
            console.error('Error fetching image:', error);
        });
}

// Функция для отображения изображения
function displayImage(location, imageUrl) {
    const gallery = document.getElementById('gallery');
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image-item');

    const image = document.createElement('img');
    image.src = imageUrl;
    image.alt = location;
    image.style.width = "100%";
    image.style.height = "auto";

    imageDiv.appendChild(image);
    gallery.appendChild(imageDiv);

    // Добавить название места к изображению
    const caption = document.createElement('p');
    caption.textContent = location;
    imageDiv.appendChild(caption);
}

// Функция для удаления изображения из галереи
function removeImage(location) {
    const gallery = document.getElementById('gallery');
    const images = gallery.getElementsByClassName('image-item');
    for (let imgDiv of images) {
        if (imgDiv.querySelector('p')?.textContent.includes(location)) {
            gallery.removeChild(imgDiv);
            break;
        }
    }
}
document.getElementById("add-location-btn").addEventListener("click", addLocationWithImage);
function generateRoute() {
    alert("Funkcja planowania trasy jeszcze niegotowa :)");
    // Tu możesz dodać mapę, listę miast lub integrację z mapą (Leaflet, Mapbox, Google Maps itp.)
}
//Скрипт — логика для generateRoute()
function generateRoute() {
    const cities = Array.from(document.querySelectorAll('#city-list li')).map(el => el.textContent);
    const locations = Array.from(document.querySelectorAll('#locations-list li')).map(el => el.textContent);
    const activities = Array.from(document.querySelectorAll('#activity-list li')).map(el => el.textContent);

    let output = '';

    if (cities.length) {
        output += `<h3>🗺️ Miasta:</h3><ul>${cities.map(c => `<li>${c}</li>`).join('')}</ul>`;
    }
    if (locations.length) {
        output += `<h3>📍 Miejsca:</h3><ul>${locations.map(l => `<li>${l}</li>`).join('')}</ul>`;
    }
    if (activities.length) {
        output += `<h3>🎡 Atrakcje:</h3><ul>${activities.map(a => `<li>${a}</li>`).join('')}</ul>`;
    }

    if (!output) {
        output = '<p>Brak danych do wygenerowania trasy. Dodaj miasta, miejsca lub atrakcje.</p>';
    }

    const routeSection = document.getElementById('generated-route');
    const routeContent = document.getElementById('route-content');

    routeContent.innerHTML = output;
    routeSection.style.display = 'block';
    routeSection.scrollIntoView({ behavior: 'smooth' });
}
cityListItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.firstChild.textContent || item.textContent;
    ul.appendChild(li);
});
locationListItems.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.firstChild.textContent || item.textContent;
    ul.appendChild(li);
});
function toggleNav() {
    const nav = document.getElementById("navLinks");
    nav.classList.toggle("show");
}

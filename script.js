const photoContainer = document.getElementById("photo-container");

// Список файлов фотографий
const photoFiles = ["photo1.jpg", "photo2.jpg", "photo3.jpg"];

// Загрузка фотографий
photoFiles.forEach((photoFile) => {
    const photoElement = document.createElement("div");
    photoElement.className = "photo";

    const imgElement = document.createElement("img");
    imgElement.src = "images/" + photoFile;

    photoElement.appendChild(imgElement);
    photoContainer.appendChild(photoElement);
});

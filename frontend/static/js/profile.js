const badgeSearch = document.querySelector("#badgeSearch"); // Selecciona el input de busqueda.
const badgeCards = Array.from(document.querySelectorAll("[data-badge]")); // Convierte los badges en arreglo para iterar.
const avatarInput = document.querySelector("#avatarInput"); // Captura el input de archivo del avatar.
const avatarLabel = document.querySelector(".avatar"); // Referencia al contenedor visual del avatar.
const footerAvatar = document.querySelector(".footer__avatar"); // Referencia al avatar del footer.


fetch("../partials/navbar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("footer").innerHTML = data;
  });
  
if (badgeSearch) { // Verifica que exista el input antes de usarlo.
  badgeSearch.addEventListener("input", (event) => { // Escucha el evento al escribir.
    const value = event.target.value.trim().toLowerCase(); // Normaliza el texto ingresado.

    badgeCards.forEach((card) => { // Recorre todos los badges.
      const title = card.dataset.badge.toLowerCase(); // Obtiene el nombre del badge.
      card.style.display = title.includes(value) ? "flex" : "none"; // Muestra u oculta segun coincidencia.
    });
  });
}

if (avatarInput && avatarLabel) { // Valida que existan input y label.
  avatarInput.addEventListener("change", (event) => { // Escucha cuando se selecciona archivo.
    const file = event.target.files[0]; // Toma el primer archivo elegido.
    if (!file) return; // Sale si no hay archivo.

    const preview = document.createElement("img"); // Crea una etiqueta img para vista previa.
    preview.src = URL.createObjectURL(file); // Genera URL temporal para la imagen.
    preview.alt = "Avatar"; // Texto alternativo.

    avatarLabel.textContent = ""; // Limpia las iniciales del avatar.
    avatarLabel.appendChild(preview); // Inserta la imagen en el avatar.
    if (footerAvatar) { // Sincroniza el avatar del footer.
      footerAvatar.textContent = ""; // Limpia las iniciales del footer.
      footerAvatar.appendChild(preview.cloneNode()); // Inserta copia de la imagen.
    }
  });
}


  

  

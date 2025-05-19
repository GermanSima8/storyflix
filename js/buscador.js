// buscador-movil.js

// Esperamos a que todo esté cargado
document.addEventListener("DOMContentLoaded", function () {
  // Elementos del buscador
  const searchInput = document.querySelector(".mobile-search input");
  const searchIcon = document.querySelector(".mobile-search .fa-search");

  // Crear contenedor de resultados
  const resultsContainer = document.createElement("div");
  resultsContainer.className = "search-results";
  resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
        background: #333;
        border-radius: 0 0 5px 5px;
        z-index: 1000;
        display: none;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    `;

  // Insertar el contenedor después del campo de búsqueda
  searchInput.parentNode.appendChild(resultsContainer);

  // Función para mostrar resultados
  function showResults(results) {
    resultsContainer.innerHTML = "";

    if (results.length === 0) {
      resultsContainer.innerHTML =
        '<div class="no-results">No se encontraron libros</div>';
    } else {
      results.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.className = "result-item";
        bookElement.style.cssText = `
                    padding: 10px;
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #444;
                    cursor: pointer;
                    transition: background 0.2s;
                `;

        bookElement.innerHTML = `
                    <img src="${book.portada}" alt="${book.titulo}" 
                         style="width:40px; height:60px; object-fit:cover; margin-right:10px;">
                    <div>
                        <h3 style="margin:0; font-size:14px; color:#fff;">${
                          book.titulo
                        }</h3>
                        <p style="margin:0; font-size:12px; color:#ccc;">${book.descripcion.substring(
                          0,
                          50
                        )}...</p>
                    </div>
                `;

        bookElement.addEventListener("click", function () {
          // Usar la función abrirModal del main.js
          if (typeof abrirModal === "function") {
            abrirModal(book);
            // Cerrar el menú móvil
            document.querySelector(".mobile-nav").classList.remove("active");
            document.querySelector(".overlay").classList.remove("active");
            document.body.style.overflow = "auto";
          }
        });

        bookElement.addEventListener("mouseenter", function () {
          this.style.background = "#444";
        });

        bookElement.addEventListener("mouseleave", function () {
          this.style.background = "transparent";
        });

        resultsContainer.appendChild(bookElement);
      });
    }

    resultsContainer.style.display = "block";
  }

  // Función de búsqueda
  function searchBooks() {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }

    // Combinar todos los libros
    const allBooks = [...libros.recomendados, ...libros.masLeidos];

    // Filtrar libros (eliminar duplicados por ID)
    const uniqueBooks = [];
    const seenIds = new Set();

    allBooks.forEach((book) => {
      if (!seenIds.has(book.id)) {
        seenIds.add(book.id);
        uniqueBooks.push(book);
      }
    });

    // Buscar coincidencias
    const results = uniqueBooks.filter(
      (book) =>
        book.titulo.toLowerCase().includes(query) ||
        book.descripcion.toLowerCase().includes(query)
    );

    showResults(results);
  }

  // Event listeners
  searchInput.addEventListener("input", searchBooks);
  searchIcon.addEventListener("click", searchBooks);

  // Ocultar resultados al hacer clic fuera
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".mobile-search")) {
      resultsContainer.style.display = "none";
    }
  });

  // Ocultar resultados al cerrar el menú
  document.querySelector(".close-icon").addEventListener("click", function () {
    resultsContainer.style.display = "none";
  });
});

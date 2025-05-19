// ===== ELEMENTOS DEL DOM =====
const carruselRecomendados = document.getElementById("recomendados");
const carruselMasLeidos = document.getElementById("mas-leidos");
const modal = document.getElementById("modal-detalles");
const modalTitulo = document.getElementById("modal-titulo");
const modalPortada = document.getElementById("modal-portada");
const modalDescripcion = document.getElementById("modal-descripcion");
const modalLink = document.getElementById("modal-link");
const modalFormLink = document.getElementById("modal-form-link");
const cerrarModal = document.querySelector(".cerrar-modal");
const navbar = document.querySelector(".navbar");

// ===== FUNCIONES PRINCIPALES =====

// Renderizar libros en un carrusel
function renderizarLibros(listaLibros, contenedor) {
  contenedor.innerHTML = "";

  listaLibros.forEach((libro) => {
    const libroElement = document.createElement("div");
    libroElement.className = "book";
    libroElement.innerHTML = `
            <img src="${libro.portada}" alt="${libro.titulo}" loading="lazy">
            <div class="book-overlay">
                <h3>${libro.titulo}</h3>
            </div>
        `;

    libroElement.addEventListener("click", () => abrirModal(libro));
    contenedor.appendChild(libroElement);
  });
}

// Abrir modal con detalles del libro
function abrirModal(libro) {
  modalTitulo.textContent = libro.titulo;
  modalPortada.src = libro.portada;
  modalPortada.alt = `Portada de ${libro.titulo}`;
  modalDescripcion.textContent = libro.descripcion;

  // Configurar enlaces
  modalLink.href = libro.driveLink;
  modalFormLink.href = libro.formLink;

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Efecto de aparición
  modal.style.animation = "fadeIn 0.4s";
  document.querySelector(".modal-contenido").style.animation = "slideUp 0.4s";
}

// Cerrar modal
function cerrarModalHandler() {
  modal.style.animation = "fadeOut 0.4s";
  document.querySelector(".modal-contenido").style.animation = "slideDown 0.4s";

  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }, 400);
}

// Inicializar controles de carrusel
function initCarousels() {
  document.querySelectorAll(".carousel").forEach((carousel) => {
    const bookList = carousel.querySelector(".book-list");
    const prevBtn = document.createElement("button");
    const nextBtn = document.createElement("button");

    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    prevBtn.className = "carousel-btn prev";
    nextBtn.className = "carousel-btn next";

    const btnContainer = document.createElement("div");
    btnContainer.className = "carousel-nav";
    btnContainer.append(prevBtn, nextBtn);

    carousel.querySelector(".carousel-container").append(btnContainer);

    // Navegación con botones
    prevBtn.addEventListener("click", () => {
      bookList.scrollBy({
        left: -bookList.clientWidth * 0.8,
        behavior: "smooth",
      });
    });

    nextBtn.addEventListener("click", () => {
      bookList.scrollBy({
        left: bookList.clientWidth * 0.8,
        behavior: "smooth",
      });
    });

    // Navegación con rueda del mouse
    bookList.addEventListener("wheel", (e) => {
      e.preventDefault();
      bookList.scrollLeft += e.deltaY;
    });

    // Mostrar/ocultar botones según scroll
    const updateNavButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = bookList;
      prevBtn.style.opacity = scrollLeft > 10 ? "1" : "0";
      nextBtn.style.opacity =
        scrollLeft < scrollWidth - clientWidth - 10 ? "1" : "0";
    };

    bookList.addEventListener("scroll", updateNavButtons);
    updateNavButtons();
  });
}

// Efecto de scroll en navbar
function setupNavbarEffect() {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Carga diferida de imágenes
function setupLazyLoading() {
  const lazyImages = document.querySelectorAll('.book img[loading="lazy"]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("src");
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: "100px" }
  );

  lazyImages.forEach((img) => observer.observe(img));
}

// ===== INICIALIZACIÓN =====
document.addEventListener("DOMContentLoaded", () => {
  // Renderizar libros (usa la variable global 'libros' definida en libros.js)
  renderizarLibros(libros.recomendados, carruselRecomendados);
  renderizarLibros(libros.masLeidos, carruselMasLeidos);

  // Inicializar componentes
  initCarousels();
  setupNavbarEffect();
  setupLazyLoading();

  // Event listeners
  cerrarModal.addEventListener("click", cerrarModalHandler);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      cerrarModalHandler();
    }
  });

  // Cerrar modal con Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
      cerrarModalHandler();
    }
  });
});

// Menú hamburguesa
const menuIcon = document.querySelector(".menu-icon");
const closeIcon = document.querySelector(".close-icon");
const mobileNav = document.querySelector(".mobile-nav");
const overlay = document.createElement("div");
overlay.className = "overlay";
document.body.appendChild(overlay);

menuIcon.addEventListener("click", () => {
  mobileNav.classList.add("active");
  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeIcon.addEventListener("click", () => {
  mobileNav.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

overlay.addEventListener("click", () => {
  mobileNav.classList.remove("active");
  overlay.classList.remove("active");
  document.body.style.overflow = "auto";
});

// Búsqueda móvil
const searchIcon = document.querySelector(".search-icon");
searchIcon.addEventListener("click", () => {
  mobileNav.classList.add("active");
  overlay.classList.add("active");
  document.querySelector(".mobile-search").scrollIntoView();
  document.querySelector(".mobile-search input").focus();
});

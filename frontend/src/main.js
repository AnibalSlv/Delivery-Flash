// ==========================================
// 1. CONFIGURACIÓN Y SELECTORES GLOBALES
// ==========================================
const nameElement = document.getElementById("name");
const greetBtn = document.getElementById("btnGreet");
const resultElement = document.getElementById("result");

const primaryColor = "#495057";
const secondaryColor = "#adb5bd";
const textColor = "#e9ecef";

// Paleta de colores para las porciones de la gráfica circular
const chartPalette = [
  "#000000",
  "#343a40",
  "#495057",
  "#6c757d",
  "#adb5bd",
  "#ced4da",
  "#dee2e6",
  "#e9ecef",
  "#f8f9fa",
  "#ffffff",
];

if (nameElement) {
  nameElement.focus();
}

// Escuchar el clic del botón de saludo
if (greetBtn) {
  greetBtn.addEventListener("click", async () => {
    const name = nameElement ? nameElement.value.trim() : "";
    if (name === "") return;

    try {
      // Llamada directa al backend en Go expuesto por Wails
      const result = await window.go.main.App.Greet(name);
      if (resultElement) {
        resultElement.innerText = result;
      }
    } catch (err) {
      console.error("Error al llamar a Go:", err);
    }
  });
}

// ==========================================
// 2. GRÁFICA DE VENTAS MENSUALES (LÍNEA)
// ==========================================
const ctxVentas = document.getElementById("miGrafica").getContext("2d");

const miGrafica = new Chart(ctxVentas, {
  type: "line",
  data: {
    labels: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    datasets: [
      {
        label: "Ventas Mensuales",
        data: [12, 19, 8, 15, 22, 3, 2, 20, 40, 0, 10, 12],
        borderColor: primaryColor,
        backgroundColor: "rgba(236, 243, 158, 0.1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: textColor,
          font: { size: 14 },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: textColor },
      },
      x: {
        ticks: { color: textColor },
      },
    },
  },
});

// ==========================================
// 3. GRÁFICA CIRCULAR DE TOP PRODUCTOS (DONA)
// ==========================================
let graficaTopProductos = null; // Variable para controlar la instancia y evitar duplicados

async function cargarTopProductosJSON() {
  try {
    // Obtenemos los datos desde tu servicio en Go
    const productos = await window.go.services.ProductService.GetProductTop();

    if (!productos || productos.length === 0) return;

    // Extraemos nombres y precios para Chart.js
    const labels = productos.map((item) => item.Name);
    const dataValues = productos.map((item) => item.Price);

    const canvasElement = document.getElementById("topProductosGrafica");
    if (!canvasElement) return;

    const ctxTop = canvasElement.getContext("2d");

    // Si ya existía una gráfica previa, la destruimos antes de recrearla
    if (graficaTopProductos) {
      graficaTopProductos.destroy();
    }

    // Creamos la gráfica circular tipo 'doughnut'
    graficaTopProductos = new Chart(ctxTop, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Top Productos",
            data: dataValues,
            backgroundColor: chartPalette,
            borderColor: secondaryColor,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: textColor,
              boxWidth: 12,
              font: { size: 11 },
            },
          },
          title: {
            display: true,
            text: "Top Productos",
            color: textColor,
            font: { size: 14 },
          },
        },
      },
    });
  } catch (err) {
    console.error("Error al cargar la gráfica circular de productos:", err);
  }
}

// Ejecutar la función automáticamente al cargar el script
cargarTopProductosJSON();

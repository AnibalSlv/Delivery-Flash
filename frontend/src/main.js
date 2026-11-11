// Obtener elementos del DOM
const nameElement = document.getElementById("name");
const greetBtn = document.getElementById("btnGreet");
const resultElement = document.getElementById("result");

if (nameElement) {
  nameElement.focus();
}

// Escuchar el clic del botón de forma limpia sin enredos en el HTML
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

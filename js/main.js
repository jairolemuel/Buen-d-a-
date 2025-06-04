document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const gifContainer = document.getElementById("gif-container");
  const rainContainer = document.getElementById("rain");

  // Espera 4 segundos para mostrar la lluvia
  setTimeout(() => {
    gifContainer.style.opacity = "0";
    setTimeout(() => {
      gifContainer.style.display = "none";
      startRain();
    }, 1000);
  }, 4000);

  // Palabras para la lluvia
  const palavras = ["Te", "amo", "Gabriel", "🧡"];

  function startRain() {
    setInterval(() => {
      const palavra = document.createElement("div");
      palavra.className = "palavra";
      palavra.innerText = palavras[Math.floor(Math.random() * palavras.length)];

      palavra.style.left = Math.random() * 100 + "vw";
      palavra.style.animationDuration = 2 + Math.random() * 3 + "s";
      rainContainer.appendChild(palavra);

      // Remover após animação
      palavra.addEventListener("animationend", () => {
        palavra.remove();
      });

      // Efeito de explosão
      palavra.addEventListener("click", () => {
        explode(palavra);
      });
    }, 200);
  }

  function explode(element) {
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    explosion.style.left = element.style.left;
    explosion.style.top = element.offsetTop + "px";

    for (let i = 0; i < 10; i++) {
      const miniHeart = document.createElement("div");
      miniHeart.className = "mini-heart";
      miniHeart.style.left = Math.random() * 20 - 10 + "px";
      miniHeart.style.top = Math.random() * 20 - 10 + "px";
      explosion.appendChild(miniHeart);
    }

    rainContainer.appendChild(explosion);
    element.remove();

    setTimeout(() => {
      explosion.remove();
    }, 1000);
  }
});

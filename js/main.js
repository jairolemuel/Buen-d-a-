document.addEventListener("DOMContentLoaded", () => {
  const gifContainer = document.querySelector(".intro-stitch");
  const rainContainer = document.getElementById("rain");

  const palavras = ["Te", "amo", "Gabriel", "🧡"];

  // Ocultar el GIF y empezar lluvia + animación PixiJS después de 4 segundos
  setTimeout(() => {
    gifContainer.style.opacity = "0";
    setTimeout(() => {
      gifContainer.style.display = "none";
      startRain();
      startPixiAnimation();
    }, 1000);
  }, 4000);

  function startRain() {
    setInterval(() => {
      const palavra = document.createElement("div");
      palavra.className = "palavra";
      palavra.innerText = palavras[Math.floor(Math.random() * palavras.length)];

      palavra.style.left = Math.random() * 100 + "vw";
      palavra.style.animationDuration = 2 + Math.random() * 3 + "s";
      rainContainer.appendChild(palavra);

      palavra.addEventListener("animationend", () => palavra.remove());
      palavra.addEventListener("click", () => explode(palavra));
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

    setTimeout(() => explosion.remove(), 1000);
  }

  function startPixiAnimation() {
    // Inicializa PixiJS
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
    });

    document.getElementById("stage").appendChild(app.view);

    const coracoes = [];

    // Función para crear corazones que caen
    function criarTexto() {
      const texto = new PIXI.Text("🧡", {
        fontFamily: "Courier New",
        fontSize: 30,
        fill: "#FFA500",
        stroke: "#FF8C00",
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: "#FF8C00",
        dropShadowBlur: 4,
      });
      texto.x = Math.random() * app.renderer.width;
      texto.y = -50;
      app.stage.addChild(texto);
      coracoes.push(texto);
    }

    // Animación de mini corazones explosivos
    function explodeMiniHeart(x, y) {
      const explosion = new PIXI.Container();
      app.stage.addChild(explosion);

      for (let i = 0; i < 10; i++) {
        const miniHeart = new PIXI.Text("🧡", {
          fontFamily: "Courier New",
          fontSize: 14,
          fill: "#FFA500",
          stroke: "#FF8C00",
          strokeThickness: 1,
          dropShadow: true,
          dropShadowColor: "#FF8C00",
          dropShadowBlur: 2,
        });

        miniHeart.x = x;
        miniHeart.y = y;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        };

        miniHeart.alpha = 1;

        explosion.addChild(miniHeart);

        app.ticker.add(function anim() {
          miniHeart.x += velocity.x;
          miniHeart.y += velocity.y;
          miniHeart.alpha -= 0.03;
          if (miniHeart.alpha <= 0) {
            app.ticker.remove(anim);
            explosion.removeChild(miniHeart);
          }
        });
      }

      setTimeout(() => {
        app.stage.removeChild(explosion);
      }, 1000);
    }

    // Detectar click en corazones para explotar mini corazones
    app.stage.interactive = true;
    app.stage.on("pointerdown", (event) => {
      const pos = event.data.global;
      coracoes.forEach((texto, index) => {
        const bounds = texto.getBounds();
        if (
          pos.x >= bounds.x &&
          pos.x <= bounds.x + bounds.width &&
          pos.y >= bounds.y &&
          pos.y <= bounds.y + bounds.height
        ) {
          explodeMiniHeart(texto.x, texto.y);
          app.stage.removeChild(texto);
          coracoes.splice(index, 1);
        }
      });
    });

    // Animar caída de corazones
    app.ticker.add(() => {
      coracoes.forEach((texto) => {
        texto.y += 2;
        if (texto.y > app.renderer.height) {
          texto.y = -50;
          texto.x = Math.random() * app.renderer.width;
        }
      });

      if (Math.random() < 0.1) {
        criarTexto();
      }
    });

    // Ajustar tamaño al redimensionar ventana
    window.addEventListener("resize", () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
});

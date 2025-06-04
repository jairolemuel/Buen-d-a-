document.addEventListener("DOMContentLoaded", () => {
  const gifContainer = document.querySelector(".intro-stitch");
  const rainContainer = document.getElementById("rain");

  const palavras = ["Te", "amo", "Gabriel", "🧡"];

  // Ocultar el GIF y comenzar animaciones después de 4 segundos
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
      miniHeart.innerText = "🧡";  // Aseguramos que sean corazones mini
      explosion.appendChild(miniHeart);
    }

    rainContainer.appendChild(explosion);
    element.remove();

    setTimeout(() => explosion.remove(), 1000);
  }
    function startPixiAnimation() {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    document.getElementById("stage").appendChild(app.view);

    const coracoes = [];

    // Crear un nuevo corazón en la pantalla
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
      texto.interactive = true;
      texto.buttonMode = true;
      texto.scale.set(1);

      texto.on("pointerdown", () => {
        const sparkleSound = document.getElementById("sparkleSound");
        if (sparkleSound) {
          sparkleSound.currentTime = 0;
          sparkleSound.play();
        }

        // Animación GSAP: corazón crece y vuelve a su tamaño original
        gsap.to(texto.scale, {
          x: 2,
          y: 2,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          onComplete: () => {
            explodeMiniHeart(texto.x, texto.y);
            app.stage.removeChild(texto);
            const index = coracoes.indexOf(texto);
            if (index !== -1) coracoes.splice(index, 1);
          },
        });
      });

      app.stage.addChild(texto);
      coracoes.push(texto);
    }

    // Explosión de mini corazones
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

        // Animación manual con ticker de PixiJS para mini corazones
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

    // Actualizar posición de los corazones y crear nuevos aleatoriamente
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

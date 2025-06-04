document.addEventListener("DOMContentLoaded", () => {
  const gifContainer = document.querySelector(".intro-stitch");
  const rainContainer = document.getElementById("rain");

  const palavras = ["Te", "amo", "Gabriel", "🧡"];

  // Sonidos
  const sparkleSound = document.getElementById("sparkleSound");
  const clickSound = document.getElementById("clickSound");

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
      palavra.addEventListener("click", () => {
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play();
        }
        explode(palavra);
      });
    }, 200);
  }

  function explode(element) {
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    explosion.style.left = element.style.left;
    explosion.style.top = element.offsetTop + "px";

    for (let i = 0; i < 15; i++) {
      const miniHeart = document.createElement("div");
      miniHeart.className = "mini-heart";
      miniHeart.style.left = Math.random() * 30 - 15 + "px";
      miniHeart.style.top = Math.random() * 30 - 15 + "px";
      explosion.appendChild(miniHeart);
    }

    rainContainer.appendChild(explosion);
    element.remove();

    setTimeout(() => explosion.remove(), 1200);
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

    // Crear un texto con corazón naranja, interactivo
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

      texto.on("pointerdown", () => {
        if (sparkleSound) {
          sparkleSound.currentTime = 0;
          sparkleSound.play();
        }

        // Animación con GSAP para agrandar y achicar el corazón
        gsap.to(texto.scale, {
          x: 2,
          y: 2,
          duration: 0.25,
          yoyo: true,
          repeat: 1,
          ease: "power1.inOut",
          onComplete: () => {
            explodePixi(texto.x, texto.y);
            app.stage.removeChild(texto);
            const index = coracoes.indexOf(texto);
            if (index !== -1) coracoes.splice(index, 1);
          },
        });
      });

      app.stage.addChild(texto);
      coracoes.push(texto);
    }

    // Explosión mejorada con muchos corazones y chispas
    function explodePixi(x, y) {
      const explosion = new PIXI.Container();
      app.stage.addChild(explosion);

      const totalParticles = 40; // cantidad grande para explosión más espectacular

      for (let i = 0; i < totalParticles; i++) {
        // Alternar entre corazones y chispas (pequeños círculos brillantes)
        if (i % 5 === 0) {
          // chispa (pequeño círculo)
          const sparkle = new PIXI.Graphics();
          sparkle.beginFill(0xFFA500);
          sparkle.drawCircle(0, 0, 3 + Math.random() * 2);
          sparkle.endFill();

          sparkle.x = x;
          sparkle.y = y;
          sparkle.alpha = 1;
          explosion.addChild(sparkle);

          const angle = Math.random() * Math.PI * 2;
          const speed = 4 + Math.random() * 4;
          const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
          };

          app.ticker.add(function sparkleAnim() {
            sparkle.x += velocity.x;
            sparkle.y += velocity.y;
            sparkle.alpha -= 0.04;
            if (sparkle.alpha <= 0) {
              app.ticker.remove(sparkleAnim);
              explosion.removeChild(sparkle);
            }
          });
        } else {
          // mini corazón
          const miniHeart = new PIXI.Text("🧡", {
            fontFamily: "Courier New",
            fontSize: 16,
            fill: "#FFA500",
            stroke: "#FF8C00",
            strokeThickness: 1,
            dropShadow: true,
            dropShadowColor: "#FF8C00",
            dropShadowBlur: 2,
          });

          miniHeart.x = x;
          miniHeart.y = y;
          miniHeart.alpha = 1;

          const angle = Math.random() * Math.PI * 2;
          const speed = 3 + Math.random() * 3;
          const velocity = {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
          };

          explosion.addChild(miniHeart);

          app.ticker.add(function heartAnim() {
            miniHeart.x += velocity.x;
            miniHeart.y += velocity.y;
            miniHeart.alpha -= 0.03;
            if (miniHeart.alpha <= 0) {
              app.ticker.remove(heartAnim);
              explosion.removeChild(miniHeart);
            }
          });
        }
      }

      // Quitar el contenedor completo tras 1.2s para liberar memoria
      setTimeout(() => {
        app.stage.removeChild(explosion);
      }, 1200);
    }

    app.ticker.add(() => {
      coracoes.forEach((texto) => {
        texto.y += 2;
        if (texto.y > app.renderer.height) {
          texto.y = -50;
          texto.x = Math.random() * app.renderer.width;
        }
      });

      if (Math.random() < 0.12) {
        criarTexto();
      }
    });

    window.addEventListener("resize", () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const gifContainer = document.querySelector(".intro-stitch");
  const rainContainer = document.getElementById("rain");

  // Palavras para a chuva
  const palavras = ["Eu", "Te", "amo", "Gabriel", "🧡"];

  // Sons (certifique-se de que estejam em js/sparkle.mp3 e js/click.mp3)
  const sparkleSound = document.getElementById("sparkleSound");
  const clickSound = document.getElementById("clickSound");

  // Ocultar o GIF e começar animações após 4 segundos
  setTimeout(() => {
    gifContainer.style.opacity = "0";
    setTimeout(() => {
      gifContainer.style.display = "none";
      startRain();
      startPixiAnimation();
    }, 1000);
  }, 4000);

  // --------------------------------
  // Parte 1/2: Lluvia de palabras HTML/CSS
  // --------------------------------
  function startRain() {
    setInterval(() => {
      const palavra = document.createElement("div");
      palavra.className = "palavra";
      palavra.innerText = palavras[Math.floor(Math.random() * palavras.length)];

      palavra.style.left = Math.random() * 100 + "vw";
      palavra.style.animationDuration = 2 + Math.random() * 3 + "s";
      rainContainer.appendChild(palavra);

      // Cuando la animación termina, remueve el elemento
      palavra.addEventListener("animationend", () => palavra.remove());

      // Al hacer clic en la palabra, suena clickSound y explota mini‑corazones HTML
      palavra.addEventListener("click", () => {
        if (clickSound) {
          clickSound.currentTime = 0;
          clickSound.play();
        }
        explodeHTML(palavra);
      });
    }, 200);
  }

  function explodeHTML(element) {
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    explosion.style.left = element.style.left;
    explosion.style.top = element.offsetTop + "px";

    // Genera 15 mini‑corazones HTML dispersos
    for (let i = 0; i < 15; i++) {
      const miniHeart = document.createElement("div");
      miniHeart.className = "mini-heart";
      miniHeart.style.left = Math.random() * 30 - 15 + "px";
      miniHeart.style.top = Math.random() * 30 - 15 + "px";
      miniHeart.innerText = "🧡";
      explosion.appendChild(miniHeart);
    }

    rainContainer.appendChild(explosion);
    element.remove();

    setTimeout(() => explosion.remove(), 1200);
  }

  // --------------------------------
  // Parte 2/2: Animación PixiJS + GSAP + sonido + explosión avanzada
  // --------------------------------
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

    // Función auxiliar para tamaño de fuente (30px)
    function thirtyPixelsFont() {
      return 30;
    }

    // Crear un texto con corazón PixiJS que cae y es interactivo
    function criarTexto() {
      const texto = new PIXI.Text("🧡", {
        fontFamily: "Courier New",
        fontSize: thirtyPixelsFont(),
        fill: "#FFA500",
        stroke: "#FF8C00",
        strokeThickness: 2,
        dropShadow: true,
        dropShadowColor: "#FF8C00",
        dropShadowBlur: 4,
      });

      // Posición inicial aleatoria en la parte superior
      texto.x = Math.random() * app.renderer.width;
      texto.y = -50;
      texto.anchor.set(0.5);
      texto.interactive = true;
      texto.buttonMode = true;
      texto.scale.set(1);

      texto.on("pointerdown", () => {
        if (sparkleSound) {
          sparkleSound.currentTime = 0;
          sparkleSound.play();
        }

        // Coordenadas del centro de la pantalla
        const centerX = app.renderer.width / 2;
        const centerY = app.renderer.height / 2;

        // 1) Desplazar al centro en 0.3s
        gsap.to(texto, {
          x: centerX,
          y: centerY,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            // 2) Hinchar de escala 1 → 3 en 0.4s
            gsap.to(texto.scale, {
              x: 3,
              y: 3,
              duration: 0.4,
              ease: "power3.out",
              onComplete: () => {
                // 3) Explosión en el centro
                explodePixi(centerX, centerY);
                app.stage.removeChild(texto);
                const idx = coracoes.indexOf(texto);
                if (idx !== -1) coracoes.splice(idx, 1);
              },
            });
          },
        });
      });

      app.stage.addChild(texto);
      coracoes.push(texto);
    }

    // Explosión PixiJS con muchos mini‑corazones y chispas
    function explodePixi(x, y) {
      const explosion = new PIXI.Container();
      app.stage.addChild(explosion);

      const totalParticles = 40; // Número de partículas (mayor → explosión más grande)

      for (let i = 0; i < totalParticles; i++) {
        // Cada 5 partículas, genera una chispa (círculo); las demás son mini‑corazones
        if (i % 5 === 0) {
          // Chispa (pequeño círculo brillante)
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
          // Mini‑corazón
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
          miniHeart.anchor.set(0.5);
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

      // Elimina el contenedor de explosión después de 1.2s
      setTimeout(() => {
        if (explosion.parent) {
          app.stage.removeChild(explosion);
        }
      }, 1200);
    }

    // Ticker principal: hace caer corazones y crea nuevos aleatoriamente
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

    // Ajustar tamaño del render al redimensionar la ventana
    window.addEventListener("resize", () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
});

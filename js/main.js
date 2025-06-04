document.addEventListener("DOMContentLoaded", () => {
  const gifContainer = document.querySelector(".intro-stitch");
  const rainContainer = document.getElementById("rain");

  // Palabras para la lluvia
  const palavras = ["Te", "amo", "Gabriel", "🧡"];

  // Sonidos (asegúrate de que estén en js/sparkle.mp3 y js/click.mp3)
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

  // --------------------------------
  // Lluvia de palabras HTML/CSS
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
  // Animación PixiJS + GSAP + sonido
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

    // Función para crear un corazón PixiJS que cae
    function criarTexto() {
      const texto = new PIXI.Text("🧡", {
        fontFamily: "Courier New",
        fontSize:  thirtyPixelsFont(), // función auxiliar para tamaño uniforme
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
        if (sparkleSound) {
          sparkleSound.currentTime = 0;
          sparkleSound.play();
        }

        // Animación GSAP: el corazón crece y vuelve a su tamaño original
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

    // Función auxiliar para tamaño de fuente (30px)
    function thirtyPixelsFont() {
      return 30;
    }

    // Explosión PixiJS con muchos corazones y chispas
    function explodePixi(x, y) {
      const explosion = new PIXI.Container();
      app.stage.addChild(explosion);

      const totalParticles = 40; // número de partículas (mayor = explosión más grande)

      for (let i = 0; i < totalParticles; i++) {
        // Cada 5 partículas, genera una chispa (círculo); las demás son mini‑corazones
        if (i % 5 === 0) {
          // chispa (pequeño círculo brillante)
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
          // mini‑corazón naranja
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
          miniHeart.anchor.set(0.5);

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

      // Elimina todo el contenedor de explosión después de 1.2 s
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

    // Ajustar tamaño de Render al cambiar la ventana
    window.addEventListener("resize", () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
    });
  }
});

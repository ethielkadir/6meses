PROJECT: 06 — OUR STORY
=======================

Una mini web romántica e interactiva para celebrar seis meses. Funciona con HTML, CSS y JavaScript, sin instalar nada y sin frameworks. Los avances se guardan en el navegador de la persona que la abre.

ARCHIVOS
--------
index.html     Estructura principal de la web.
styles.css     Diseño, colores, animaciones y versión para celular.
content.js     Textos, títulos, enlaces, nombres de fotos y mensajes. Edita este archivo.
script.js      Lógica de navegación, niveles, llaves, ventanas de regalo y progreso.
assets/gifts/  Aquí van las tres fotos de los regalos.

CÓMO PERSONALIZAR LOS TEXTOS
----------------------------
1. Abre content.js con Visual Studio Code, el Bloc de notas u otro editor.
2. Ahí está el objeto CONFIG con todos los textos y regalos.
3. Reemplaza el contenido de title, subtitle, intro, introNote, endingTitle y endingMessage.
4. En CONFIG.levels, cada elemento es un nivel. Puedes modificar:
   - title: título del capítulo.
   - short: frase que aparece en la tarjeta del mapa.
   - story: texto principal al entrar al capítulo.
   - memoryLabel y memory: pequeño mensaje o pista.
   - giftTitle, giftDescription y giftCaption: textos del regalo.
5. Conserva las comas y las comillas que ya están en el código. Si un texto contiene comillas dobles, escríbelas como \" o utiliza comillas simples dentro del texto.

CÓMO PONER LAS CANCIONES DE YOUTUBE
-----------------------------------
Los regalos de los niveles 1, 4 y 6 ya están configurados como canciones. En cada uno cambia el valor de gift en content.js por un enlace real de YouTube, por ejemplo:

 gift: { type: "youtube", value: "https://www.youtube.com/watch?v=ID_DE_LA_CANCION" }

Puedes pegar un enlace normal de YouTube o un enlace corto youtu.be. Cuando ella pulse el botón del regalo, se abrirá en otra pestaña.

CÓMO PONER LAS FOTOS
--------------------
Guarda las imágenes dentro de assets/gifts/ con estos nombres exactos:

Nivel 2: assets/gifts/regalo-2.jpg
Nivel 3: assets/gifts/regalo-3.jpg
Nivel 5: assets/gifts/regalo-5.jpg

También puedes usar .png o .webp; si lo haces, cambia la extensión correspondiente en el valor gift del nivel dentro de content.js. Las fotos no tienen que subirse a ningún sitio: pueden ir dentro de la carpeta de la web.

CÓMO PROBARLA
-------------
Haz doble clic en index.html y se abrirá en el navegador. Para probarla localmente, deja juntos index.html, styles.css, content.js, script.js y la carpeta assets. Si el navegador o tu configuración bloquea algunas funciones al abrir archivos directamente, puedes usar la extensión Live Server en Visual Studio Code.

CÓMO FUNCIONA LA AVENTURA
-------------------------
- Se empieza en la portada y se pulsa “Comenzar la aventura”.
- El primer nivel está disponible al empezar; los siguientes se desbloquean al completar el anterior.
- “Abrir tu regalo” abre YouTube para los niveles musicales y una ventana con foto para los niveles de imagen.
- “Completar nivel y obtener llave” guarda ese nivel como completado y desbloquea el siguiente.
- El progreso se guarda localmente en el navegador mediante localStorage. No se sincroniza automáticamente entre dispositivos.
- “Reiniciar aventura” borra el progreso guardado en ese navegador.

IMPORTANTE ANTES DE COMPARTIRLA
-------------------------------
Añade tus enlaces y fotos, prueba los seis regalos y despliega la carpeta completa a un hosting estático si quieres enviarle un enlace público (por ejemplo, GitHub Pages, Netlify o Vercel). No compartas solamente index.html: también necesita styles.css, content.js, script.js y assets.

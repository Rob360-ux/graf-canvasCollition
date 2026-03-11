const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

// Fondo con un degradado más suave (estilo wallpaper)
canvas.style.background = "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)";

let score = 0;

// Array de imágenes para mayor variedad visual
const imagesUrls = [
    "https://cdn-icons-png.flaticon.com/512/1441/1441411.png", // Imagen 1
    "https://cdn-icons-png.flaticon.com/512/1441/1441361.png", // Imagen 2
    "https://cdn-icons-png.flaticon.com/512/1441/1441403.png"  // Imagen 3
];

const loadedImages = imagesUrls.map(url => {
    const img = new Image();
    img.src = url;
    return img;
});

class GameObject {
    constructor(x, y, size, speed) {
        this.posX = x;
        this.posY = y;
        this.size = size;
        this.baseSpeed = speed; // Velocidad base reducida
        this.speed = speed;
        // Asigna una imagen aleatoria del array al crear el objeto
        this.img = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    }

    draw(context) {
        context.drawImage(this.img, this.posX, this.posY, this.size, this.size);
    }

    update(context) {
        this.draw(context);
        
        // Lógica de dificultad con velocidades más lentas
        if (score > 15) {
            this.speed = this.baseSpeed * 2.5; // Velocidad Alta (pero controlada)
        } else if (score > 10) {
            this.speed = this.baseSpeed * 1.8; // Velocidad Media
        } else {
            this.speed = this.baseSpeed;       // Velocidad Inicial Lenta
        }

        this.posY += this.speed;

        if (this.posY > window_height) {
            this.reset();
        }
    }

    reset() {
        this.posY = -this.size;
        this.posX = Math.random() * (window_width - this.size);
        // Al resetear, también podemos cambiar la imagen para que varíe
        this.img = loadedImages[Math.floor(Math.random() * loadedImages.length)];
    }
}

let objects = [];

function generateObjects(n) {
    for (let i = 0; i < n; i++) {
        let size = 55;
        let x = Math.random() * (window_width - size);
        let y = Math.random() * -window_height; 
        // Velocidad inicial muy lenta (entre 0.8 y 2.0 unidades)
        let speed = Math.random() * 1.2 + 0.8; 
        objects.push(new GameObject(x, y, size, speed));
    }
}

canvas.addEventListener("click", (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    objects.forEach(obj => {
        if (mouseX > obj.posX && mouseX < obj.posX + obj.size &&
            mouseY > obj.posY && mouseY < obj.posY + obj.size) {
            
            score++;
            obj.reset();
        }
    });
});

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "bold 22px 'Segoe UI', Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Eliminadas: ${score}`, window_width - 30, 40);
}

function animate() {
    ctx.clearRect(0, 0, window_width, window_height);
    objects.forEach(obj => obj.update(ctx));
    drawScore();
    requestAnimationFrame(animate);
}

// Iniciar con 12 objetos para que la pantalla no se vea vacía
generateObjects(12);
animate();
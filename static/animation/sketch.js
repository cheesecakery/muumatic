let NO_OF_PARTICLES;
let loudness;
let tempo;
let key;
let instrumentalness; 
let valence;

let info;

let scale;

let runAnimation = true;

let particles = [];

// If div is hidden, then don't run the animation
document.getElementById("graphB").addEventListener("click", toggleAn);
function toggleAn() {
  runAnimation = !runAnimation;
}

function setup() {
    // Sets up parent of the sketch + gets data from flask (sent through a div attribute)
    if (runAnimation) {
      let div = document.getElementById('data');
      let canvas = createCanvas(div.offsetWidth, div.offsetHeight);
      canvas.parent(div);
      let tracks = JSON.parse(div.getAttribute('data-anim'));
      info = document.getElementById('info');

      // Scale of animation depends on width of canvas
      scale = width * 0.001;
    
      // HSB colour mode so can easily adjust hue
      colorMode(HSB, 360, 100, 100, 100);
      background(0);
      
      // Create each particle for the animation
      NO_OF_PARTICLES = tracks.length;
      let rows = floor(sqrt(NO_OF_PARTICLES));
      let columns = rows;

      // If excess particles
      if (rows*rows < NO_OF_PARTICLES) {
        columns += 1;
      }

      // Calculates size of each grid space
      let rowStep = height / rows;
      let columnStep = width / columns;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
          let ind = columns*j + i;
    
          if (particles.length == NO_OF_PARTICLES) {
            break;
          }
      
          // Grabs attributes from dict sent from flask to represent movement of particle
          let name = tracks[ind]['name'];
          let artist = tracks[ind]['artist'];
          let loudness = map(tracks[ind]['loudness'], -60, 0, 0, 20);
          let valence = -1*map(tracks[ind]['valence'], 0, 1, -271, 0);
          let energy = map(tracks[ind]['energy'], 0, 1, 0.05, 0.1);
          let tempo = pow(map(tracks[ind]['tempo'], 0, 300, 0, 2), 2);
          let dur = map(tracks[ind]['duration'], 0, 600000, 0, 1);
          let danceability = map(tracks[ind]['danceability'], 0, 1, 0, 2);
          let start = 0;
    
          // Adds particle to animation
          let particle = new Particle(
            ind,
            name,
            artist,
            i*columnStep + columnStep/2,
            j*rowStep + rowStep/2 + danceability,
            loudness * scale,
            valence,
            energy,
            tempo,
            dur,
            start,
            danceability
          );
          particles.push(particle);
      }
    }
  }
}

function draw() {
  // Only runs animation if on-screen
  if (runAnimation) {
    background(0);

    // If mouse offcanvas, don't show artist/song name
    if (mouseX < 0 || mouseY < 0 || mouseX > width || mouseY > height) {
      info.textContent = "";
    }
    
    // Move and display each particle
    for (let particle of particles) {
      particle.move();
  
      // Show which particle the mouse is hovering over
      if (particle.contains(mouseX, mouseY)) {
        info.textContent = `${particle.id + 1}: ${particle.name}, ${particle.artist}`;
      }
  
      particle.show();
    }
  }

}
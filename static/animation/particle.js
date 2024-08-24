class Particle {
    constructor(id, name, artist, x, y, loudness, valence, energy, tempo, dur, start, danceability) {
      this.id = id;
      this.name = name;
      this.artist = artist;

      this.pos = createVector(x, y);
      this.r = loudness;
      this.tempo = tempo;

      this.start = start;
      this.incr = 0.1;

      this.start2 = 0;
      this.energy = energy;
      
      this.dur = dur;

      this.danceability = danceability;
      
      this.col = [valence, 100, 80];
    }
    
    // Moves the particle (change of radius, and circular movement)
    move() {
      // Particle increases and decreases on size based on the tempo of the song (the bpm)
      this.r += this.tempo * sin(this.start2);
      // Particle moves in a circle of radius of the 'danceability' of the song and with speed determined by the duration of the song
      let circular = createVector(sin(this.start/this.dur), cos(this.start/this.dur))
      circular.mult(this.danceability);
      this.pos.add(circular);
      
      // Incr affects how fast it makes it around the circle (fixed at 0.1)
      this.start += this.incr;
      // Energy of the song dictates how quickly the particle fluctuates in size
      this.start2 += this.energy;
    }

    // Checks whether the particle contains a point
    contains(x, y) {
      // Finds if distance is smaller than the radius of the circle
      let distance = p5.Vector.sub(this.pos, createVector(x, y));
      if (distance.mag() <= this.r) {
        return true;
      }
      return false;
    }
  
    // Displays the particle
    show() {
      stroke(this.col);
      fill(this.col);      
      ellipse(this.pos.x, this.pos.y, this.r * 2);
    }
  }
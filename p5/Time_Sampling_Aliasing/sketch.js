let slider1;
let t = [];
let sineWave = [];
let x_r = [];
let fs;
let t_sampled = [];
let xscl
let yscl
let h_mobile;

function setup() {
     createCanvas(windowWidth - 20, windowHeight - 20);

     for (let i = 0; i < 6 - 1 / 100; i += 1 / 100) {
          t.push(i)
     }
     for (let i = 0; i < t.length; i++) {
          sineWave.push(sin(2 * PI * 1 / 2 * t[i]))
     }

     if (FRUBIL.device.class == "Desktop") {
          h_mobile = 0;
          console.log("its Desktop")
     } else {
          h_mobile = 1;
          slider1 = createSlider(0.5, 10, 0.8, 0.01);
          slider1.position(30, height * 0.92);
     }
}

function draw() {
     xscl = floor(width / 7)
     yscl = 0.2 * height;

     background(0)

     // plotting axis
     plottingAxis(xscl);

     if(h_mobile == 0){
          my_str = "마우스를 움직여 보세요!"
     } else {
          my_str = "슬라이더를 움직여 보세요!"
     }
     textSize(15);
     text(my_str, width/2, height* 0.15)

     // plotting a sinusoidal signal
     push();
     translate(30, 0.4 * height)
     scale(1, -1)
     noFill();
     beginShape();
     for (let i = 0; i < t.length; i++) {
          vertex(t[i] * xscl, sineWave[i] * yscl)
     }
     endShape();
     pop();

     t_sampled = [];
     if (h_mobile == 1) {
          fs = slider1.value();
     } else {
          fs = mouseX / width * 5;
     }
     // fs = mouseX/width * 5;
     for (let i = 0; i <= 6; i += 1 / fs) {
          t_sampled.push(i)
     }

     // plotting sampled Time points
     push();
     translate(30, 0.4 * height)
     scale(1, -1)
     fill(200, 50, 50)
     for (let i = 0; i < t_sampled.length; i++) {
          ellipse(t_sampled[i] * xscl, sin(2 * PI * 1 / 2 * t_sampled[i]) * yscl, 8)
          push();
          stroke(100)
          line(
               t_sampled[i] * xscl, -0.4 * height,
               t_sampled[i] * xscl, sin(2 * PI * 1 / 2 * t_sampled[i]) * yscl)
          pop();
     }
     pop();

     // calculating the reconstructed Function
     for (let i = 0; i < t.length; i++) {
          x_r[i] = 0;
     }

     for (let i = 0; i < t_sampled.length; i++) {
          let temp = [];
          temp = mySinc(t_sampled[i]);

          for (let j = 0; j < temp.length; j++) {
               x_r[j] += (temp[j] * sin(2 * PI * 1 / 2 * t_sampled[i]));
          }

     }

     // plotting the reconstructed Function
     push();
     translate(30, 0.4 * height);
     scale(1, -1)
     stroke(100, 100, 255)
     strokeWeight(2)
     noFill();
     beginShape();
     for (let j = 0; j < t.length; j++) {
          vertex(t[j] * xscl, x_r[j] * yscl)
     }
     endShape();
     pop();

}

function mySinc(delay) {
     let result = [];
     for (i = 0; i < t.length; i++) {
          x = (t[i] - delay) * fs;
          if (x != 0) {
               result[i] = sin(PI * x) / (PI * x)
          } else {
               result[i] = 1;
          }
     }
     return result
}

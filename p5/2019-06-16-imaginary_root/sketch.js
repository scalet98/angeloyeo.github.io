var f = [
  []
]
var phase = [
  []
]
var scl
var x = []
var y = []
var tex
var signature

var z_axis_ratio = 2
var colormap = []

var my_canvas


function preload() {
  table = loadTable('https://raw.githubusercontent.com/angeloyeo/angeloyeo.github.io/master/p5/2019-06-16-imaginary_root/colormap.csv', 'csv')
}

function setup() {

  for (let r = 0; r < table.getRowCount(); r++) {
    colormap[r] = []
    for (let c = 0; c < table.getColumnCount(); c++) {
      colormap[r][c] = int(float(table.getString(r, c)) * 255)
    }
  }

  createCanvas(320, 320, WEBGL);
  setAttributes('antialias', true)

  x = linspace(-2, 2, 50)
  y = linspace(-2, 2, 50)

  // calc function

  for (var i = 0; i < x.length; i++) {
    f[i] = []
    phase[i] = []
    for (var j = 0; j < y.length; j++) {
      f[i][j] = Math.sqrt((x[i] ** 2 - y[j] ** 2 + 1) ** 2 + (2 * x[i] * y[j]) ** 2)
      phase[i][j] = Math.atan2(2 * (x[i] - 0.8) * y[j], (x[i] - 0.8) ** 2 - y[j] ** 2 + 1)
      // phase를 계산할 때 왜인지는 모르겠지만 Real 축으로 0.8정도 밀려서 그려지는 오류 있음.
    }
  }

  scl = width / 8

  // 글씨 쓰기
  tex = createP()
  tex.style('font-size', '15px')
  tex.position(width / 7, height * 0.7)
  katex.render('f(z) = z^2+1 = (x+iy)^2+1', tex.elt)

  // // 서명 쓰기
  signature = createP()
  signature.style('font-size', '10px')
  signature.position(width / 3.5, height * 0.8)
  katex.render('(c) 공돌이의 수학정리노트', signature.elt)
  
}


function draw() {
  background(255);
  // orbitControl()

  rotateX(PI / 2 - PI / 12)
  rotateZ(millis() / 1000)
  plotAxes()

  plotCurvedPlane()
  
  // noLoop()
}

function linspace(stt, end, steps) {
  var res = []
  for (i = stt; i <= end; i += ((end - stt) / (steps - 1))) {
    res.push(
      i
    )
  }
  res.push(end)
  return res
}

function plotAxes() {
  let stt = -3
  let end = 3

  push()

  stroke(0)
  // x axis
  line(stt * scl, 0, 0, end * scl, 0, 0)
  // y axis
  line(0, stt * scl, 0, 0, end * scl, 0)
  // z axis
  // line(0, 0, -3 * scl, 0, 0, 3 * scl)

  // xtick 그려주기
  for (let i = stt; i <= end; i++) {
    line(i * scl, -0.1 * scl, 0, i * scl, 0.1 * scl, 0)
  }
  // ytick 그려주기
  for (let i = stt; i <= end; i++) {
    line(-0.1 * scl, i * scl, 0, 0.1 * scl, i * scl, 0)
  }
  pop()
}

function plotCurvedPlane() {
  // stroke(0)
  noStroke()
  for (var j = 0; j < y.length - 1; j++) {
    beginShape(TESS) // p5.js 버전 확실히 체크할 것. 버전 낮으면 TESS 작동 안함.
    for (var i = 0; i < x.length - 1; i++) {
      my_color = color(colormap[round(map(phase[i][j], -PI, PI, 0, 100))])
      // my_color.setAlpha(50)

      fill(my_color) // phase color가 왜 MATLAB이랑 다르게 나올까~~~ ㅠㅠ

      vertex(x[i] * scl, y[j] * scl, f[i][j] * scl / z_axis_ratio)
      vertex(x[i] * scl, y[j + 1] * scl, f[i][j + 1] * scl / z_axis_ratio)
      vertex(x[i + 1] * scl, y[j + 1] * scl, f[i + 1][j + 1] * scl / z_axis_ratio)
      vertex(x[i + 1] * scl, y[j] * scl, f[i + 1][j] * scl / z_axis_ratio)
    }
    endShape()
  }
  push()
  for (i = 0; i < x.length -1; i++){
     beginShape()
     stroke(255, 0, 0)
     strokeWeight(3)
     noFill()
     vertex(x[i] * scl, 0, f[i][x.length/2] * scl / z_axis_ratio)
     vertex(x[i+1] * scl, 0, f[i+1][x.length/2] * scl / z_axis_ratio)
     endShape()
  }
  pop()

}

// Sketch B:
new p5(function(p) {
  p.setup = function() {
    my_canvas = p.createCanvas(50, 320, p.P2D); // <--- P2D
    my_canvas.position(320,0)
  };
  
  p.draw = function(b) {
    p.background(255);
    
    for(i = 0; i < colormap.length; i++){
      p.fill(color(colormap[i]));
      p.noStroke()
      p.rect(10, map(i, 0, 100, 30, 270), 30, 10)
    }
    p.fill(0)
    p.textAlign(CENTER)
    p.text('-PI/2', 25, 25)
    p.text('PI/2', 25, 295)
    
  }
  
})

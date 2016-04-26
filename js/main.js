// === NAVIGATION ===

var openPage = function(pageName) {
  document.getElementById('pages-container').style.display = 'block';
  var thisPage = document.getElementById(pageName);
  thisPage.style.opacity = 0;
  thisPage.style.display = 'block';
  Snap("#" + pageName).animate({opacity: 1}, 300);
};

var closePage = function() {
  var pagesContainer = document.getElementById('pages-container');
  for (var i = 0; i < pagesContainer.children.length; i++) {
    if (pagesContainer.children[i].style.display === 'block') {
      var openPage = pagesContainer.children[i];
      Snap("#" + openPage.id).animate({opacity: 0}, 300);
      setTimeout(function() {
        openPage.style.display = 'none';
        pagesContainer.style.display = 'none';
      }, 300);
    }
  }

};

window.onhashchange = function() {
  if (window.location.hash.length > 1) {
    openPage(window.location.hash.substring(1));
  } else {
    closePage();
  }
};

if (window.location.hash.length > 1) {
  setTimeout(function() {
    openPage(window.location.hash.substring(1));
  }, 13500);
}

// === AUDIO ===

new Howl({
  urls: ['audio/bird_whistling.ogg', 'audio/bird_whistling.mp3'],
  loop: false
}).play();

setTimeout(function() {
  new Howl({
    urls: ['audio/ambience.ogg', 'audio/bird_whistling.mp3'],
    loop: true,
    volume: 0.0
  })
  .play()
  .fade(0.0, 1.0, 1500);
}, 4200);

setTimeout(function() {
  new Howl({
    urls: ['audio/cricket.ogg', 'audio/bird_whistling.mp3'],
    loop: true,
    volume: 0.0
  })
  .play()
  .fade(0.0, 1.0, 4500);
}, 5500);

// === SVG ===

var sun = Snap("#sun");

// Animate sunset
sun.select('circle').animate({
  cy: 110
}, 5300, bezier(.97,0,.83,.73));

var stars = Snap("#stars");

// Stars
setTimeout(function() {

  var makeStar = function() {
    var x = Math.random() * 200;
    var y = Math.random() * 100;
    // In general title zone
    while (x > 70 && x < 130 && y > 5 && y < 15) {
      x = Math.random() * 200;
      y = Math.random() * 100;
    }
    stars.circle(x, y, (Math.random() * 0.3) + 0.1).attr({
      fill: "#FDFDFD",
      opacity: 0
    }).animate({
      opacity: 1
    }, 100);
  };

  // Make the first ten at a rate of 1/100ms, and the next 390 at a rate of
  // 1/5ms
  var i = 0;
  var intervalId = setInterval(function() {
    makeStar();
    i++;
    if (i >= 10) {
      clearInterval(intervalId);
      intervalId = setInterval(function() {
        makeStar();
        i++;
        if (i >= 400) {
          clearInterval(intervalId);
        }
      }, 5);
    }
  }, 100);
}, 7100);

// Title
setTimeout(function() {
  Snap("#title").animate({
    opacity: 1
  }, 2000);
}, 9100);


var dipper = Snap("#dipper");

setTimeout(function() {
  var tooltip = document.getElementById('tooltip');

  dipper.selectAll('a circle').forEach(function(el, idx) {
    setTimeout(function() {
      el.animate({opacity: 1}, 500);
    }, 500 + (200 * idx));

    el.node.addEventListener('mouseenter', function() {
      el.animate({r: '2'}, 25, mina.easein);
      tooltip.style.display = 'block';
      tooltip.innerHTML = el.attr('data-tooltip');
      var clientRect = el.node.getBoundingClientRect();
      tooltip.style.left = (clientRect.left - (tooltip.getBoundingClientRect().width / 2) + 10).toString() + 'px';
      tooltip.style.top = (clientRect.top - 40).toString() + 'px';
  	});

  	el.node.addEventListener('mouseleave', function() {
      el.animate({r: '1.4'}, 25, mina.easein);
      tooltip.style.display = 'none';
  	});
  });

  var makeShootingStar = function() {
    var speed = (Math.random() / 4) + 0.25;

    var angle = (Math.random() * Math.PI) - (Math.PI / 2);
    var slope = Math.tan(angle);
    var point = {x: Math.random() * 200, y: Math.random() * 100};

    var line = function(x) {
      return (slope * (x - point.x)) + point.y;
    };

    var inverseLine = function(y) {
      return ((y - point.y) / slope) + point.x;
    };

    // Find where the selected line intersects the edges of the viewport
    var edgeIntersects = [];

    if (line(0) >= 0 && line(0) <= 100) {
      edgeIntersects.push({
        x: 0,
        y: line(0)
      });
    }

    if (line(200) >= 0 && line(200) <= 100) {
      edgeIntersects.push({
        x: 200,
        y: line(200)
      });
    }

    if (inverseLine(0) > 0 && inverseLine(0) < 200) {
      edgeIntersects.push({
        y: 0,
        x: inverseLine(0)
      });
    }

    if (inverseLine(100) > 0 && inverseLine(100) < 200) {
      edgeIntersects.push({
        y: 100,
        x: inverseLine(100)
      });
    }

    edgeIntersects.sort(function(a, b) {
      return a.x - b.x;
    });

    var startOn = Math.floor(Math.random() * 2);
    var startPoint = edgeIntersects[startOn];
    var endPoint = edgeIntersects[(startOn === 1) ? 0 : 1];

    // Original angle is always left-facing. If the shooting star is going right,
    // flip the angle.
    if (startOn === 1) {
      angle += Math.PI;
    }

    var distance = Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2));

    var shootingStar = stars.line(startPoint.x - (Math.cos(angle) * 20), startPoint.y - (Math.sin(angle) * 20), startPoint.x, startPoint.y)
       .attr({
         stroke: '#FDFDFD',
         'stroke-width': 0.3
       })
       .animate({
         x1: endPoint.x,
         y1: endPoint.y,
         x2: endPoint.x + (Math.cos(angle) * 20),
         y2: endPoint.y + (Math.sin(angle) * 20)
       }, (distance / speed));

     setTimeout(function() {
       shootingStar.remove();
     }, (distance / speed));
  };

  setInterval(function() {
    if (Math.random() < 0.35) {
      makeShootingStar();
    }
  }, 3000);
}, 10100);

setTimeout(function() {
  dipper.select('polyline').animate({'stroke-dashoffset': 0}, 1700);
}, 11600);
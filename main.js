var s = Snap("#stars");

for(var i = 0; i < 400; i++) {
  var x = Math.random() * 200;
  var y = Math.random() * 100;
  // In general title zone
  while (x > 70 && x < 130 && y > 5 && y < 15) {
    x = Math.random() * 200;
    y = Math.random() * 100;
  }
  s.circle(x, y, (Math.random() * 0.3) + 0.1).attr({fill: "#FDFDFD"});
}

var tooltip = document.getElementById('tooltip');

Snap('#dipper').selectAll('a circle').forEach(function(el) {
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
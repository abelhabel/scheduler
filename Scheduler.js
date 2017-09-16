function isPointInObject(posx, posy, obj) {
  if(posx < obj.xmax && posx > obj.xmin && posy < obj.ymax && posy > obj.ymin) {
    return true;
  }
  return false;
}
function Section(x, y, onSelect) {
  this.xmin = x;
  this.ymin = y;
  this.xmax = x;
  this.ymax = y;

  this.tag = document.createElement('div');
  this.tag.style.position = 'absolute';
  this.tag.style.backgroundColor = 'green';

  this.tag.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(this, e);
  });

}

Section.prototype.render = function(container) {
  this.tag.style.top = this.ymin + 'px';
  this.tag.style.left = this.xmin + 'px';
  this.tag.style.width = Math.abs(this.xmax - this.xmin)  + 'px';
  this.tag.style.height = Math.abs(this.ymax - this.ymin) + 'px';

  if(container) container.appendChild(this.tag);
}

function Scheduler() {
  this.days = 14;
  this.startDay = 'Mon';
  this.startDate = new Date(Date.now());
  this.hourStart = 7;
  this.hourEnd = 19;
  this.hours = this.hourEnd - this.hourStart;
  this.width = 600;
  this.height = 400;
  this.sections = [];
  this.createGrid();
}


Scheduler.prototype.createGrid = function() {
  this.grid = {};
  for(var x = 0; x < this.days; x++) {
    for(var y = 0; y < this.hours; y++) {
      this.grid[x + ':' + y] = {
        x: x,
        y: y,
        selected: false
      };
    }
  }
}

Scheduler.prototype.convertPosition = function(section) {
  return {
    xmin: Math.floor(this.days * section.xmin / this.width ),
    ymin: Math.floor(this.hours * section.ymin / this.height),
    xmax: Math.floor(this.days * section.xmax / this.width),
    ymax: Math.floor(this.hours * section.ymax / this.height),
  }
}

Scheduler.prototype.select = function(section) {
  var o = this.convertPosition(section);
  console.log(section, o);
  for(var x = 0; x < this.days; x++) {
    for(var y = 0; y < this.hours; y++) {
      if(isPointInObject(x, y, o)) {
        this.grid[x + ':' + y].selected = true;
      }
    }
  }
  console.log(this.getTimes());
}

Scheduler.prototype.getTimes = function() {
  var days = ['Mon', 'Tue', "Wed", 'Thu', 'Fri', 'Sat', 'Sun'];
  var out = [];
  for(var x = 0; x < this.days; x++) {
    for(var y = 0; y < this.hours; y++) {
      if(this.grid[x + ':' + y].selected) {
        out.push(`${days[x % days.length]} ${this.hourStart + y}:00`)
      }
    }
  }
  return out;
}

Scheduler.prototype.render = function(container) {
  this.parent = document.createElement('div');
  this.parent.style.width = this.width + 'px';
  this.parent.style.height = this.height + 'px';

  this.parent.style.backgroundColor = '#999';
  this.parent.style.position = 'relative';
  this.parent.addEventListener('mousedown', (e) => {
    console.log('new section')
    this.currentSection = new Section(e.offsetX, e.offsetY, this.select.bind(this));
    this.sections.push(this.currentSection);
    this.currentSection.render(this.parent);
  })

  this.parent.addEventListener('mousemove', (e) => {
    if(!this.currentSection) return;
    this.currentSection.xmax = e.offsetX;
    this.currentSection.ymax = e.offsetY;
    this.currentSection.render();
  })

  this.parent.addEventListener('mouseup', (e) => {
    this.currentSection = null;
  })
  container.appendChild(this.parent);
}

var s = new Scheduler();
setTimeout(() => s.render(document.body), 500);

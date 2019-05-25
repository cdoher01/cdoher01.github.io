'use strict';

var app = {
  init: function () {
    this.setListeners();
    this.registerEvents();
    this.initPattern();
  },

  hasRun: false,

  setListeners: function() {
    $('#posts-button').click(() => {
      $('#about').hide()
      $('#posts').show()
      $('#posts-button').addClass('active')
      $('#about-button').removeClass('active')
    })

    $('#about-button').click(() => {
      $('#about').show()
      $('#posts').hide()
      $('#posts-button').removeClass('active')
      $('#about-button').addClass('active')
    })
  },

  registerEvents: function () {
    if(window.innerWidth > 1024) {
      window.addEventListener("resize", this.initPattern.bind(this));
    }

  },

  initPattern: async function () {
    let self = this;
    let height = Math.max(document.body.scrollHeight, 
                          document.body.offsetHeight, 
                          document.documentElement.clientHeight, 
                          document.documentElement.scrollHeight, 
                          document.documentElement.offsetHeight)

    var pattern = Trianglify({
      width: window.innerWidth + 50,
      height: height + 100,
      cell_size: 70,
      variance: 1,
      stroke_width: 0,
      x_colors: ['black', '#f2f2f2', '#828282'],
      y_colors: ['#f2f2f2', '#f2f2f2', 'black']
    }).svg(); // Render as SVG.

    var container = document.querySelector('.trianglify');
    // remove any existing elements in container
    $(container).empty();

    container.insertBefore(pattern, container.firstChild);
    // Get all pattern polygons.
    let polyArray = [].slice.call(pattern.children);
    // hide each poly el
    polyArray.forEach((el) => el.style.opacity = 0)

    await self.loopRight(polyArray, height);
    await self.loopLeft(polyArray, 'hide');
    self.initPattern()
  },

  loopRight: function (polyArray, height) {
    let loopLength = polyArray.length-1;
    let currentEl = 0;

    return new Promise(resolve => {
       function checkEl () {

        setTimeout(function () {
          let el = polyArray[currentEl]

          // calclulate poly el should be shown
          if(el.nodeName === 'path') {
            let elTopPercent = el.getBoundingClientRect().top / height
            let windowOffset = (() => { return window.innerWidth > 650 ? 650 : 300 })()

            if (el.getBoundingClientRect().left + (elTopPercent * 300) > windowOffset) el.style.opacity = 1
          
            if (++currentEl < loopLength) {
              checkEl();
            } else {
              resolve()
            }
          }
        }, 10)
      };
      
      checkEl()
    })
  },

  loopLeft: function (polyArray) {
    let currentEl = polyArray.length-1;

    return new Promise(resolve => {
      function checkEl (i) {
        setTimeout(function () {
          let el = polyArray[i];
          if(el.nodeName === 'path') el.style.opacity = 0
          
          if (--currentEl > 0) {
            checkEl(currentEl)
          } else {
            resolve()
          }
        }, 10)
      }
      checkEl(currentEl)
    })
  }
};

$(document).ready(function () {
  app.init();
});

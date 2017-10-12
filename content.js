// content.js

jsonObj = {
  arnab: [],
  for: [],
  against: [],
}

// The main function that takes a set of intervals, merges
  // overlapping intervals and prints the result
function mergeIntervals(intervals)
{
  // Test if the given set has at least one interval
  if (intervals.length <= 0)
    return intervals;

  // Create an empty stack of intervals
  var stack = [], last;

  // sort the intervals based on start time
  intervals.sort(function(a,b) {
    return a['start'] - b['start'];
  });

  // console.log(intervals);

  // push the first interval to stack
  stack.push(intervals[0]);

  // Start from the next interval and merge if necessary
  for (var i = 1, len = intervals.length ; i < len; i++ ) {
      // get interval from last item
      last = stack[stack.length - 1];

      // if current interval is not overlapping with stack top,
      // push it to the stack
      if (last['end'] <= intervals[i]['start']) {
          stack.push( intervals[i] );
      }
    
      // Otherwise update the ending time of top if ending of current 
      // interval is more
      else if (last['end'] < intervals[i]['end']) {
          last['end'] = intervals[i]['end'];     
                      
          stack.pop();
          stack.push(last);
      }
  }

  // console.log(stack);

  return stack;
}

function videoElement() {
  return document.getElementsByClassName('video-stream')[0];
}

function initKeyPress() {
  function enableKeypressRecord(key, arrayName) {
    var started = false
    var starttime = 0
    $(document).keydown(function(event) {
      if (event.which == key && started == false) {
        // console.log('started')
        started = true
        starttime = videoElement().currentTime;
      }
    })

    $(document).keyup(function(event) {
      if (event.which == key && started == true) {
        started = false
        endtime = videoElement().currentTime;
        console.log(arrayName + ": start = " + starttime + ", end = " + endtime + ", duration = " + (endtime - starttime))
        jsonObj[arrayName].push({start: starttime, end: endtime})
        // trigger
        $(document).trigger('jsonObj-changed')
        console.log(jsonObj)
      }
    })
  }

  enableKeypressRecord(65, 'arnab') // a
  enableKeypressRecord(83, 'for') // s
  enableKeypressRecord(68, 'against') // d
}

// return true / false
// Detect [new version UI(material design)] OR [old version UI]
function new_material_design_version(){
  var old_title_element = document.getElementById('watch7-headline');
  if(old_title_element){
    return false;
  } else {
    return true;
  }
}

// call init only when DOM is completely ready
function checkReady() {
  if(new_material_design_version()){
    var material_checkExist = setInterval(function() {
      if (document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer').length) {
        init();
        clearInterval(material_checkExist);
      }
    }, 330);
  } else {
    var checkExist = setInterval(function() {
      if ($('#watch-headline-title').length && $('#saveform').length === 0) {
        init();
        clearInterval(checkExist);
      }
    }, 330);
  }
}

var html = [
"<div id='savediv'>",
"  <input type='submit' id='savebutton' value='Save'/>",
"  <input type='file' value='Load JSON'/>",
"  <div id='svgdiv'></div>",
"</div>"
].join('\n')

function drawTimelineVivek(data) {
  width = $('#svgdiv').width()
  height = 10
  var svg = d3.select("#svgdiv").append("svg").attr("width", width).attr("height", height*3);
  if (!data['duration']) {
    // set duration by current video duration
    data['duration'] = videoElement().duration
  }
  var drawTimeline = (data, scale, arrayName, color, startY) => {
    // make a group with arrayName id
    svg.append('g').attr('id', arrayName)
    var update = (data) => {
      elms = svg.select('#' + arrayName).selectAll('rect')
                .data(data[arrayName])

      // exit
      elms.exit().remove()

      // enter and update
      elms.enter()
        .append('rect')
        .attr('y', startY)
        .attr('height', height)
        .attr('fill', color)
        .attr('opacity', 0.5)
        .merge(elms)
        .attr('x', d => scale(d['start']))
        .attr('width', d => scale(d['end'] - d['start']))
    }
    update(data)
    return update
  }
  scale = d3.scaleLinear()
    .domain([0, data['duration']])
    .range([0, width])
  updateFuncs = [
    drawTimeline(data, scale, 'arnab', '#f71d49', 0),
    drawTimeline(data, scale, 'for', '#27ea5f', height),
    drawTimeline(data, scale, 'against', '#4b3ffc', height*2)
  ]
  var update = (data) => {
    updateFuncs.forEach(x => x(data))
  }

  posLine = svg.append('rect').data([0]).attr('x', d => d).attr('width', 2).attr('y', 0).attr('height', height*3).attr('fill', '#000000')
  window.setInterval(() => {
    newPos = videoElement().currentTime
    posLine.transition().duration(500).attr('x', d => scale(newPos))
  }, 1000)

  return update
}

// init UI
function init() {
  console.log("init ran")
  var title_element = document.querySelectorAll('.title.style-scope.ytd-video-primary-info-renderer');
  if (title_element) {
    $(title_element[0]).before(html);
    // save logic; maybe add save as option?
    $("#savebutton").on('click', function(event) {
      event.preventDefault()
      console.log("saving")
      jsonObj['duration'] = videoElement().duration
      var blob = new Blob([JSON.stringify(jsonObj)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, document.title + '.json');
    })
    // init duration
    jsonObj['duration'] = videoElement().duration
    // draw stuff
    updateDrawing = drawTimelineVivek(jsonObj)
    // fix intervals while updating
    update = () => {
      // mergeIntervals on jsonObj
      ['arnab', 'for', 'against'].forEach(e => {jsonObj[e] = mergeIntervals(jsonObj[e])})
      updateDrawing(jsonObj)
    }
    // update on file load
    $('input[type=file]').on('change', (e) => {
      e.preventDefault()
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();
      reader.onload = (e) => {
        lines = e.target.result;
        jsonObj = JSON.parse(lines);
        update()
      }
      if (file) {
        reader.readAsText(file)
      }
    })
    // update on data change
    $(document).on('jsonObj-changed', () => {
      update()
    })
  }
}

$(function() {
  console.log("plugin ran.")
  checkReady()
  initKeyPress()
})
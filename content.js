// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      // var firstHref = $("a[href^='http']").eq(0).attr("href");

      // console.log(firstHref);
      video = document.getElementsByClassName('video-stream')[0];
      // console.log(video);
      console.log(video.currentTime);
       $('#info-contents').append('<div><p> HELLO </p></div>')
        console.log('here')  
    }
  }
);



// video = document.getElementBy('player');
// var btn = document.createElement("div")
// var t = document.createTextNode("CLICK ME");
// btn.appendChild(t);
// //Appending to DOM 
// document.body.appendChild(btn);
// $('<div><p> HELLO </p></div>').insertAfter( "#container")
// $('body').prepend('<h1>Testing!</h1>');
// $(document).ready(function() {
//   $('#info-contents').append('<div><p> HELLO </p></div>')
//   // console.log('here')  
// })

// $(window).load(function() {
//   document.write('Hello world')
//   console.log('done')
// })

intervals = {
  arnab: [],
  for: [],
  against: []
}
 $(function () {
    started = false
    starttime = 0

    function enableKeypressRecord(key, arrayName) {
      var started = false
      var startedtime = 0
      $(document).keydown(function(event) {
        if (event.which == key && started == false) {
          console.log('started')
          started = true
          video = document.getElementsByClassName('video-stream')[0];
          // console.log(video.currentTime);
          starttime = video.currentTime;
        }
      })

      $(document).keyup(function(event) {
        if (event.which == key && started == true) {
          started = false
          video = document.getElementsByClassName('video-stream')[0];
          // console.log(video.currentTime);
          endtime = video.currentTime;
          console.log("start = " + starttime + ", end = " + endtime)
          intervals[arrayName].push({start: starttime, end: endtime})
          console.log(intervals)
        }
      })
    }

    enableKeypressRecord(65, 'arnab')
    enableKeypressRecord(83, 'for')
    enableKeypressRecord(68, 'against')

    // $(document).keydown(function(event) {
    //   if (event.which == 65 && started == false) {
    //     console.log('started')
    //     started = true
    //     video = document.getElementsByClassName('video-stream')[0];
    //     // console.log(video.currentTime);
    //     starttime = video.currentTime;
    //   }
    // })

    // $(document).keyup(function(event) {
    //   if (event.which == 65 && started == true) {
    //     started = false
    //     video = document.getElementsByClassName('video-stream')[0];
    //     // console.log(video.currentTime);
    //     endtime = video.currentTime;
    //     console.log("start = " + starttime + ", end = " + endtime)
    //     intervals.push({start: starttime, end: endtime})
    //     console.log(intervals)
    //   }
    // })

      // alert("Window Loaded");
      // $('#guide-icon').prepend('<div><form id="saveform"><input type="submit" value="Save"></input></form></div>')
      $('<div><form id="saveform"><input type="submit" value="Save"></input></form></div>').insertBefore('ytd-topbar-logo-renderer')
      $("#saveform").submit(function(event) {
        event.preventDefault()
        console.log("saving")
        var blob = new Blob([JSON.stringify(intervals)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, document.title + '.json');
      })
        // console.log('here') 
        // console.log($('#chart'))
       
        // $('*').off('keyup keydown keypress keypressed');
        // $(document).on('keypress', function(e) {
        //   console.log('key pressed')
        //   e.preventDefault()
    //     // })
    //    var testData = [
    // {label: "person a", times: [
    //     {"starting_time": 1355752800000, "ending_time": 1355759900000},
    //     {"starting_time": 1355767900000, "ending_time": 1355774400000}]},
    // {label: "person b", times: [
    //     {"starting_time": 1355759910000, "ending_time": 1355761900000}]},
    // {label: "person c", times: [
    //     {"starting_time": 1355761910000, "ending_time": 1355763910000}]}
    // ];


    // var testData2 = [
    // {label: "person a", times: [
    //     {"starting_time": 1355752800000, "ending_time": 1355759900000},
    //     {"starting_time": 1355767900000, "ending_time": 1355774400000}]}
    // ];
    // var chart = d3.timelines();
    // console.log(chart)
    // var svg = d3.select("#chart").append("svg").attr("width", 500)
    //     .datum(testData).call(chart);

    //  d3.select('body').on('keydown', function() {
    //   console.log('here')
    //     svg.data(testData2)
    //   })

    // const element = document.getElementById('chart');
    // console.log(element)

    
 });
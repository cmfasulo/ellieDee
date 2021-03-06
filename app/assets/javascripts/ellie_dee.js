$(document).ready(function() {
  var ellieDee = true;
  buildMatrix();
  fetchDrawing($("#ellieDeeId").val());

  setInterval(function() {
    fetchDrawing($("#ellieDeeId").val(), true);
  }, 1000);

  $('input[id=currentColor]').minicolors();

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

  $(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
          (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false;
      }
    });
  });

  $("#accessRole").popover({
    trigger: "hover",
    placement: 'bottom',
    title: 'Access Roles',
    html: true,
    content: $('#accessInfo').html()
  });

  $(".led").on("click", function() {

    $(this).css('background-color', $("#currentColor").val());
    var currentColors = getColors();
    var userRole = $("#userRole").val();

    // if (ellieDee && (userRole === 'admin' || userRole === 'ctrl')) {
      if (ellieDee) {
      $.ajax({
        dataType: 'json',
        url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify({
          "leds": currentColors
        }),
        success: function(data) {
          setColors(data.leds);
        },
        error: function(jqXHR, textStatus, error) {
          console.log("EllieDee Failed to Update: " + error);
        }
      });
    }
  });

  var timer;
  $(".led").on("mousedown touchstart",function(){
      var me = this;
      timer = setTimeout(function(){
        $("#currentColor").val(rgb2hex($(me).css("background-color")));
        $(".minicolors-swatch-color").attr("style", "background-color: " + rgb2hex($(me).css("background-color")));
      },2*1000);
  }).on("mouseup mouseleave touchend",function(){
      clearTimeout(timer);
  });

  $("#ledOff").on("click", function() {
    $("#currentColor").val("#808080");
    $(".minicolors-swatch-color").attr("style", "background-color: " + "#808080");
  });

  $("#reset").on("click", function() {
    resetEllieDee();
  });

  $("#saveDrawing").popover({
    placement: 'top',
    title: 'Save Drawing',
    html: true,
    content: $('#saveForm').html()
  }).on('click', function() {
    $("#saveName").focus();
    $("#save").on("click", function() {
      var saveUserId = $("#saveUserId").val();
      var saveName = $("#saveName").val();
      var saveLeds = getColors();
      var userRole = $("#userRole").val();

      if (saveName.toUpperCase() === 'ELLIEDEE') {
        $("#saveAlert").text("There can only be one EllieDee! Try a new name!").attr("type", "text");
      } else {
        if (userRole === 'admin' || userRole === 'ctrl' || userRole === 'reader') {
          $.ajax({
            dataType: 'json',
            url: '/drawings/',
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify({
              "name": saveName,
              "leds": saveLeds,
              "user_id": saveUserId
            }),
            success: function(data) {
              $("#saveDrawing").popover('hide');
              $("#tableBody").append(
                '<tr><td class="col-md-8">' + data.name + '</td><td class="col-md-2 text-center"><i id="d' + data.id + '" class="fa fa-play-circle"></i></td><td class="col-md-2 text-center"><a data-confirm="Are you sure?" rel="nofollow" data-method="delete" href="/drawings/' + data.id + '" <i class="fa fa-trash"></i></a></td></tr>'
              );
            },
            error: function(jqXHR, textStatus, error) {
              console.log(saveDrawing + " Failed to Save: " + error);
              if (error === "Unprocessable Entity") {
                $("#saveAlert").text("Uh oh, looks like you're already using this name. Pick a new name or try again after deleting the old one below!").attr("type", "text");
              }
            }
          });
        }
      }
    });
  });

  $("tbody").on("click", ".fa-play-circle", function() {
    var drawingId = $(this).attr('id');
    drawingId = drawingId.slice(1, drawingId.length);

    fetchDrawing(drawingId);
  });

});

//Function to generate string for entire table HTML and sends AJAX call to reset LED array in db
function buildMatrix() {
  var matrixString = "";
  var ledNum = 143;
  var iterator;
  for (var i = 11; i >= 0; i--) {
    matrixString += "<tr id='r" + i + "'>"; //creates opening tag and id for current row
    if (i % 2 === 1 ) {
      for (var j = 0; j <= 11; j++) {
        matrixString += "<td class='led' id='" + ledNum + "'><div></div></td>"; //adds the current column to the string for the current row; moves onto the next column in the inner "for" loop
        ledNum--;
      }
    } else {
      var offset = ledNum - 11; //leds snake from row to row rather than going left to right every row
      for (var j = 0; j <= 11; j++) {
        matrixString += "<td class='led' id='" + offset + "'><div></div></td>"; //adds the current column to the string for the current row; moves onto the next column in the inner "for" loop
        ledNum--;
        offset++;
      }
    }

    matrixString += "</tr>"; //adds a closing tag for the current row; moves onto the next row in the outer "for" loop
  }
  $("#ledMatrix").append(matrixString);
}

function fetchDrawing(drawingId, isInterval) {
  if (!isInterval || (isInterval && ellieDee)) {
    $.ajax({
      dataType: 'json',
      url: '/drawings/' + drawingId + '.json',
      method: 'GET',
      contentType: "application/json",
      success: function(data) {
        if (data.name !== 'EllieDee') {
          ellieDee = false;
          editMode(data.name);
          connected(false);
        } else {
          var isConnected = (Date.now()/1000 - data.last_req) < 3;
          connected(isConnected);
        }
        setColors(data.leds);
      },
      error: function(jqXHR, textStatus, error) {
        console.log("GET drawing Failed: " + error);
      }
    });
  }
}

//Reset drawing to default/cleared state
function resetEllieDee() {
  var blankArray = [];
  for (var i = 0; i < 145; i++) {
    blankArray.push("#000000");
  }
  var userRole = $("#userRole").val();
  if (userRole === 'admin' || userRole === 'ctrl') {
    blankArray = "[" + blankArray.toString() + "]";
    $.ajax({
      dataType: 'json',
      url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
      method: 'PUT',
      contentType: "application/json",
      data: JSON.stringify({
        "leds": blankArray
      }),
      success: function(data) {
        setColors(data.leds);
      },
      error: function(jqXHR, textStatus, error) {
        console.log("EllieDee Failed to Reset: " + error);
      }
    });
  } else {
    setColors(blankArray);
  }
}

//Iterate through the drawing to get the current state of all leds
function getColors() {
  var colors = [];

  for (var i = 0; i <= 143; i++) {
    var currentLed = "#" + i.toString();
    var ledColor = rgb2hex($(currentLed).css('backgroundColor'));
    if (ledColor === "#808080") {
      colors.push("#000000");
    } else {
      colors.push(ledColor);
    }
  }
  return colors;
}

//Set all colors based on response from db or saved drawing
function setColors(array) {
  for (var i = 0; i < array.length; i++) {
    var currentLed = "#" + i.toString();
    if (array[i].toString() === "#000000") {
      $(currentLed).css('backgroundColor', '#808080');
    } else {
      $(currentLed).css('backgroundColor', array[i].toString());
    }
  }
}

function editMode(drawingName) {
  connected(false);
  var userRole = $("#userRole").val();
  $('#editing').remove();

  var element = '<div id="editing"><i class="fa fa-exclamation-circle"></i> You are currently editing drawing: <strong>' + drawingName + '</strong>.<br>';
  element += '<button id="pushEllieDee" class="btn btn-primary">Push to EllieDee</button>';

  // if (userRole === 'admin' || userRole === 'ctrl') {
  //   element += '<button id="pushEllieDee" class="btn btn-primary">Push to EllieDee</button>';
  // }

  element += '<button id="returnEllieDee" class="btn btn-primary">Return to EllieDee</button></div>';
  $('#ellieDee').before(element);
  $('#editing').addClass('editing');

  $("#pushEllieDee").on("click", function() {
    ellieDee = true;
    var userRole = $("#userRole").val();
    var currentColors = getColors();

    // if (ellieDee && (userRole === 'admin' || userRole === 'ctrl')) {
      if (ellieDee) {
      $.ajax({
        dataType: 'json',
        url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify({
          "leds": currentColors
        }),
        success: function(data) {
          setColors(data.leds);
        },
        error: function(jqXHR, textStatus, error) {
          console.log("EllieDee Failed to Update: " + error);
        }
      });
    }
    $('#editing').remove();
  });

  $("#returnEllieDee").on("click", function() {
    ellieDee = true;
    fetchDrawing($("#ellieDeeId").val().toString());
    $('#editing').remove();
  });
}

function connected(isConnected) {
  if (isConnected) {
    $('#connectionStatus').html('Online').css('color', 'lime');
    $('#logoBackground').css('background-color', 'lime');
  } else {
    $('#connectionStatus').html('Offline').css('color', 'red');
    $('#logoBackground').css('background-color', 'red');
  }
}

//Function to convert hex format to a rgb(a) color
function rgb2hex(rgb){
 rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
 return (rgb && rgb.length === 4) ? "#" +
  ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
  ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

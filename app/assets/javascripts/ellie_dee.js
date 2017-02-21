$(document).ready(function() {
  var userRole = $("#userRole").val();
  buildMatrix();

  $(function () {
    $('[data-toggle="popover"]').popover()
  });

  $(document).on('click', function (e) {
    $('[data-toggle="popover"],[data-original-title]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
          (($(this).popover('hide').data('bs.popover')||{}).inState||{}).click = false
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

    if (userRole === 'admin' || userRole === 'ctrl') {
      $.ajax({
        dataType: 'json',
        url: '/drawings/' + $("#ellieDeeId").val().toString() + '.json',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify({
          "leds": currentColors
        }),
        success: function(data) {
          console.log("EllieDee Successfully Updated: " + JSON.stringify(data));
          setColors(data.leds);
        },
        error: function(jqXHR, textStatus, error) {
          console.log("EllieDee Failed to Update: " + error);
        }
      });
    };
  });

  $("#ledOff").on("click", function() {
    $("#currentColor").val("#808080");
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
      console.log("Save Colors Array Length: " + saveLeds.length);
      saveLeds = "[" + saveLeds.toString() + "]";

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
            // console.log(saveDrawing + " Successfully Saved: " + data);
            console.log("Callback Array Length: " + data.leds.length);
            $("#saveDrawing").popover('hide')
            $("#userDrawings").append(
              "<tr><td>" + data.name + "</td><td><i id='d" + data.user_id + "' class='fa fa-play-circle'></i></td><td><a data-confirm='Are you sure?' rel='nofollow' data-method='delete' href='/drawings/" + data.id + "' <i class='fa fa-trash'></i></a></td></tr>"
            );
          },
          error: function(jqXHR, textStatus, error) {
            console.log(saveDrawing + " Failed to Save: " + error);
            if (error === "Unprocessable Entity") {
              $("#saveAlert").text("Uh oh, looks like you're already using this name. Pick a new name or try again after deleting the old one below!").attr("type", "text");
            };
          }
        });
      };
    });
  });

  $(".fa-play-circle").on("click", function() {
    var drawingId = $(this).attr('id');
    drawingId = drawingId.slice(1, drawingId.length);

    $.ajax({
      dataType: 'json',
      url: '/drawings/' + drawingId + '.json',
      method: 'GET',
      contentType: "application/json",
      success: function(data) {
        console.log("GET drawing was Successful. LEDs: " + data.leds);
        console.log("LED Array Length: " + data.leds.length);
        setColors(data.leds);
      },
      error: function(jqXHR, textStatus, error) {
        console.log("GET drawing Failed: " + error);
      }
    });
  });
});

//Function to generate string for entire table HTML and sends AJAX call to reset LED array in db
function buildMatrix() {
  var matrixString = "";
  var ledNum = 143;
  for (var i = 11; i >= 0; i--) {
    matrixString += "<tr id='r" + i + "'>" //creates opening tag and id for current row
    for (var j = 11; j >= 0; j--) {
      matrixString += "<td class='led' id='" + ledNum + "'><div></div></td>" //adds the current column to the string for the current row; moves onto the next column in the inner "for" loop
      ledNum--;
    }
    matrixString += "</tr>"; //adds a closing tag for the current row; moves onto the next row in the outer "for" loop
  }
  $("#ledMatrix").append(matrixString);
  resetEllieDee();
}

//Reset drawing to default/cleared state
function resetEllieDee() {
  var blankArray = [];
  for (var i = 0; i < 145; i++) {
    blankArray.push("#808080");
  }

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
        console.log("EllieDee Successfully Reset. LEDs: " + data.leds);
        setColors(data.leds);
      },
      error: function(jqXHR, textStatus, error) {
        console.log("EllieDee Failed to Reset: " + error);
      }
    });
  } else {
    setColors(blankArray);
  };
}

//Iterate through the drawing to get the current state of all leds
function getColors() {
  var colors = [];

  for (var i = 0; i <= 143; i++) {
    var currentLed = "#" + i.toString();
    var ledColor = rgb2hex($(currentLed).css('backgroundColor'));
    colors.push(ledColor);
  }
  return colors;
}

//Set all colors based on response from db or saved drawing
function setColors(array) {
  for (var i = 0; i < array.length; i++) {
    var currentLed = "#" + i.toString();
    $(currentLed).css('backgroundColor', array[i].toString());
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

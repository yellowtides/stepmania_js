var body = $("body");
body.css("margin", 0);
var canvas = $('<div>');
var left_col, right_col, up_col, down_col;
var l_check, r_check, u_check, d_check;
var note_type = [], note_id = [], n_notes = 0, h_n_notes = 0;
var combo = 0, score = 0, score_d = $('<div>'), combo_d = $('<div>'), time_d = $('<div>');
var percent = 100, percent_d = $('<div>');
var percent_p = 1;
var note_gen, note_movement, update, time;
var difficulty = 3;
var time_left = 60;
var max_combo = 0;
var high1, high2, high3, high4, high5;
high1 = localStorage.getItem("high1");
high2 = localStorage.getItem("high2");
high3 = localStorage.getItem("high3");
high4 = localStorage.getItem("high4");
high5 = localStorage.getItem("high5");
generate_titlescreen();
// generate_diffscreen();

var curc = $('<div>');
curc.html(difficulty);
curc.attr("id", "circle");

function generate_canvas() {
  canvas.attr("class", "wrapper");
  canvas.appendTo(body);
}
function generate_columns() {
  left_col = $("<div>");
  left_col.attr("class", "left_col");
  down_col = $("<div>");
  down_col.attr("class", "down_col");
  up_col = $("<div>");
  up_col.attr("class", "up_col");
  right_col = $("<div>");
  right_col.attr("class", "right_col");
  left_col.appendTo(canvas);
  down_col.appendTo(canvas);
  up_col.appendTo(canvas);
  right_col.appendTo(canvas);
}
function generate_checks() {
  l_check = $("<img>");
  l_check.attr("class", "left_check");
  l_check.attr("src", "img/slot.png");
  l_check.css('transform', 'rotate(' + 90 + 'deg)');
  r_check = $("<img>");
  r_check.attr("class", "right_check");
  r_check.attr("src", "img/slot.png");
  r_check.css('transform', 'rotate(' + 270 + 'deg)');
  u_check = $("<img>");
  u_check.attr("class", "up_check");
  u_check.attr("src", "img/slot.png");
  u_check.css('transform', 'rotate(' + 180 + 'deg)');
  d_check = $("<img>");
  d_check.attr("class", "down_check");
  d_check.attr("src", "img/slot.png");
  l_check.appendTo(left_col);
  d_check.appendTo(down_col);
  u_check.appendTo(up_col);
  r_check.appendTo(right_col);
}
function generate_numbers() {
  score_d.html(score);
  score_d.attr("class", "score");
  score_d.appendTo(canvas);

  var min = Math.floor(time_left/60);
  var sec = time_left%60;
  if (sec < 10) time_d.html(min+':0'+sec);
  else time_d.html(min+':'+sec);
  time_d.attr("class", "time");
  if (time_left < 15) time_d.css("color", "#ff5349"); 
  time_d.appendTo(canvas);
  combo_d.html('x ' + combo);
  combo_d.attr("class", "combo");
  combo_d.appendTo(canvas);
  percent_d.html((Math.floor(percent*10))/10 + '%');
  percent_d.attr("class", "percentage");
  percent_d.appendTo(canvas);
}
function generate_status(x) {
  $('.status').remove();
  var status = $('<div>');
  status.attr('class', "status");
  status.html(x);
  status.appendTo(canvas);
  setTimeout(function() {
    $('.status').remove();
  }, 5000);
}
function generate_titlescreen() {
  generate_canvas();
  score = 0;
  max_combo = 0;
  combo = 0;
  percent_p = 1;
  percent = 100;
  note_type = [], note_id = [], n_notes = 0, h_n_notes = 0;
  canvas.css('width', $(window).width()+'px');
  var cont = $('<div>');
  cont.attr("id", "w");
  cont.appendTo($('.wrapper'));
  cont.animate({
    top: '+='+$(window).height()*1/10
  }, 500);
  var title = $('<div>');
  title.html('Stepmania');
  title.attr("id", "title");
  title.appendTo(cont);
  var lo = $('<div>');
  lo.attr("id", "logo");
  lo.appendTo(cont);
  setTimeout(function() {
    var play = $('<div>');
    play.html('Play');
    play.attr("id", "play_b");
    play.appendTo($('.wrapper'));
    play.animate({
      left: '+='+$(window).width()*1/3
    }, 500);
    play.click(function() {
      $('.wrapper').empty();
      $('.wrapper').animate({
        width: "-=" + (($('.wrapper').width())-($(window).height())/2) + "px"
      }, 600, function() {
         generate_game();    
      });
    });
    setTimeout(function() {
      var high_scores = $('<div>');
      high_scores.html('Highscores');
      high_scores.attr("id", "high_scores");
      high_scores.appendTo($('.wrapper'));
      high_scores.animate({
        left: '-='+$(window).width()*1/4
      }, 500);
      high_scores.click(function() {
        $('.wrapper').empty();
        $('.wrapper').animate({
          width: "-=" + (($('.wrapper').width())-($(window).height())/2) + "px"
        }, 600, function() {
          generate_highscorescreen();    
        });
      });
      setTimeout(function() {
        var diff = $('<div>');
        diff.html('Set difficulty');
        diff.attr("id", "set_diff");
        diff.appendTo($('.wrapper'));
        diff.animate({
          left: '+='+$(window).width()*1/3
        }, 500);
        diff.click(function() {
          $('.wrapper').empty();
          $('.wrapper').animate({
            height: "-=" + (($('.wrapper').height())-($(window).height())/3) + "px"
          }, 600, function() {
             generate_diffscreen();    
          });
        });
      }, 500);
    }, 500);
  }, 500);
}
function generate_game() {
  canvas.attr("class", "wrapper");
  time_left = 60;
  note_gen = setInterval(spawn_note, 1200/difficulty);
  note_movement = setInterval(note_fall, 5);
  update = setInterval(score_updater, 1);
  time = setInterval(function(){time_left -= 1}, 1000);
  generate_columns();
  generate_checks();
  generate_numbers();
  $(document).keydown(function(e) {
    switch(e.which) {
      case 37: // left
        for (var i = 0; i < n_notes; i++)
          if (note_type[i] == 'l') {
            var curr_note = $('#'+note_id[i]);
            var pos_top = curr_note.position().top;
            if (Math.abs(l_check.position().top - pos_top) <= 0.115*$(window).height())  {
              curr_note.animate({
                opacity: "toggle",
                left: "-=125"
              }, 500);
              
              note_id.splice(i, 1);
              note_type.splice(i, 1);
              n_notes--;
              i--;
              if (Math.abs(u_check.position().top - pos_top) <= 0.005*$(window).height()) {
                score += 300+6*combo/5;
                combo++;
                generate_status('Flawless!');
              }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.03*$(window).height()) {
                  score += 300+6*combo/5;
                  combo++;
                  generate_status('Great!');
                }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.05*$(window).height()) {
                  score += 100+2*combo/5;
                  combo++;
                  generate_status('Good');
                }
              else {
                score += 50+combo/5;
                max_combo = Math.max(max_combo, combo);
                combo = 0;
                generate_status('Bad');
              }
              break;
            }
          }
        break;
      case 38: // up
        for (var i = 0; i < n_notes; i++)
          if (note_type[i] == 'u') {
            var curr_note = $('#'+note_id[i]);
            var pos_top = curr_note.position().top;
            if (Math.abs(u_check.position().top - pos_top) <= 0.115*$(window).height()) {
              curr_note.animate({
                opacity: "toggle",
                top: "-=150"
              }, 500);
              note_id.splice(i, 1);
              note_type.splice(i, 1);
              n_notes--;
              i--;
              if (Math.abs(u_check.position().top - pos_top) <= 0.005*$(window).height()) {
                score += 300+6*combo/5;
                combo++;
                generate_status('Flawless!');
              }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.03*$(window).height()) {
                  score += 300+6*combo/5;
                  combo++;
                  generate_status('Great!');
                }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.05*$(window).height()) {
                  score += 100+2*combo/5;
                  combo++;
                  generate_status('Good');
                }
              else {
                score += 50+combo/5;
                generate_status('Bad');
              }
              break;
            }
          }
        break;
      case 39: // right
        for (var i = 0; i < n_notes; i++)
          if (note_type[i] == 'r') {
            var curr_note = $('#'+note_id[i]);
            var pos_top = curr_note.position().top;
            if (Math.abs(r_check.position().top - pos_top) <= 0.115*$(window).height())  {
              curr_note.animate({
                opacity: "toggle",
                left: "+=125"
              });
              
              note_id.splice(i, 1);
              note_type.splice(i, 1);
              n_notes--;
              i--;
              if (Math.abs(u_check.position().top - pos_top) <= 0.005*$(window).height()) {
                score += 300+6*combo/5;
                combo++;
                generate_status('Flawless!');
              }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.03*$(window).height()) {
                  score += 300+6*combo/5;
                  combo++;
                  generate_status('Great!');
                }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.05*$(window).height()) {
                  score += 100+2*combo/5;
                  combo++;
                  generate_status('Good');
                }
              else {
                score += 50+combo/5;
                generate_status('Bad');
              }
              break;
            }
          }
        break;
      case 40: // down
        for (var i = 0; i < n_notes; i++)
          if (note_type[i] == 'd') {
            var curr_note = $('#'+note_id[i]);
            var pos_top = curr_note.position().top;
            if (Math.abs(d_check.position().top - pos_top) <= 0.115*$(window).height()) {
              curr_note.animate({
                opacity: "toggle",
                top: "+=150"
              }, 500);
              note_id.splice(i, 1);
              note_type.splice(i, 1);
              n_notes--;
              i--;
              if (Math.abs(u_check.position().top - pos_top) <= 0.005*$(window).height()) {
                score += 300+6*combo/5;
                combo++;
                generate_status('Flawless!');
                percent = (percent*(percent_p-1)/percent_p + 100*1/percent_p);
                percent_p++;
              }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.03*$(window).height()) {
                  score += 300+6*combo/5;
                  combo++;
                  generate_status('Great!');
                  percent = (percent*(percent_p-1)/percent_p + 100*1/percent_p);
                  percent_p++;
                }
              else
                if (Math.abs(u_check.position().top - pos_top) <= 0.05*$(window).height()) {
                  score += 100+combo*2/5;
                  combo++;
                  generate_status('Good');
                  percent = (percent*(percent_p-1)/percent_p + 75*1/percent_p);
                  percent_p++;
                }
              else {
                score += 50+combo/5;
                generate_status('Bad');
                  percent = (percent*(percent_p-1)/percent_p + 50*1/percent_p);
                  percent_p++;
              }
              break;
            }
          }
        break;
      default: 
        break;
    }
    score = Math.floor(score);
    e.preventDefault();
  });
}
function generate_diffscreen() {
  generate_canvas();
  canvas.css('width', $(window).width()+'px');
  var container = $('<div>');
  container.attr("id", "container");
  container.appendTo($('.wrapper')); 
  container.animate({
    top: '+='+$(window).height()*1/5
  }, 500);
  var confirm = $('<div>');
  confirm.html('Save');
  confirm.attr("id", "purprect");
  confirm.appendTo(container);
  
  var hl = $('<div>');
  hl.attr("class", "hor_line");
  hl.appendTo(container);
  curc.appendTo($('.wrapper'));
  
  function handle_mousedown(e){
    window.my_dragging = {};
    my_dragging.pageX0 = e.pageX;
    my_dragging.elem = this;
    my_dragging.offset0 = $(this).offset();
    function handle_dragging(e){
        var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
        $(my_dragging.elem)
        .offset({left: left});
        if (left <= $(window).width()/6) curc.html(1);
        else
        if (left <= $(window).width()/3) curc.html(2);
        else
        if (left <= $(window).width()/2) curc.html(3);
        else
        if (left <= 2*$(window).width()/3) curc.html(4);
        else
        if (left <= 5*$(window).width()/6) curc.html(5);
        else curc.html(6);
        difficulty = curc.html();
        
    }
    function handle_mouseup(e){
        $('body')
        .off('mousemove', handle_dragging)
        .off('mouseup', handle_mouseup);
    }
    $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
  }
  curc.mousedown(handle_mousedown);
  confirm.click(function() {
    canvas.empty();
    canvas.animate({
      height: $(window).height()
    }, 500);
    generate_titlescreen();
  });
}
function generate_highscorescreen() {
  var num1 = $('<div>');
  num1.attr("class", "ordnum");
  var rank1 = $('<div>');
  rank1.attr("class", "d_sco");
  num1.appendTo(canvas);
  rank1.appendTo(canvas);
  num1.html('1');
  if (high1 == null || high1 == 'null') rank1.html('0');
  else rank1.html(high1);
  
  var num2 = $('<div>');
  num2.attr("class", "ordnum");
  var rank2 = $('<div>');
  rank2.attr("class", "d_sco");
  num2.appendTo(canvas);
  rank2.appendTo(canvas);
  num2.html('2');
  if (high2 == null || high2 == 'null') rank2.html('0');
  else rank2.html(high2);
  
  
  var num3 = $('<div>');
  num3.attr("class", "ordnum");
  var rank3 = $('<div>');
  rank3.attr("class", "d_sco");
  num3.appendTo(canvas);
  rank3.appendTo(canvas);
  num3.html('3');
  if (high3 == null || high3 == 'null') rank3.html('0');
  else rank3.html(high3);
  
  var num4 = $('<div>');
  num4.attr("class", "ordnum");
  var rank4 = $('<div>');
  rank4.attr("class", "d_sco");
  num4.appendTo(canvas);
  rank4.appendTo(canvas);
  num4.html('4');
  if (high4 == null || high4 == 'null') rank4.html('0');
  else rank4.html(high4);
  
  var num5 = $('<div>');
  num5.attr("class", "ordnum");
  var rank5 = $('<div>');
  rank5.attr("class", "d_sco");
  num5.appendTo(canvas);
  rank5.appendTo(canvas);
  num5.html('5');
  if (high5 == null || high5 == 'null') rank5.html('0');
  else rank5.html(high5);
  
  var arr = $('<div>');
  arr.html('➔');
  arr.attr("class", "arrow2");
  arr.appendTo(canvas);
  arr.animate({
    left: '50%'
  }, 1000);
  arr.click(function() {
    arr.animate({
      left: '125vw'
    }, 1000);
    setTimeout(function(){
      canvas.empty();
      canvas.animate({
        height: "-=" + ((canvas.height())-($(window).height())) + "px",
        width: "-=" + ((canvas.width())-($(window).width())) + "px"
      }, 600, function() {
        generate_titlescreen();    
      });
    }, 500);
  });
}
function generate_gameover() {
  var screen = $('<div>');
  screen.attr("class", "gameover");
  screen.animate({
    height: $(window).height()*75/100
  }, 1000);
  screen.appendTo(body);
  var go_text = $('<div>');
  go_text.attr("class", "gameover_text");
  go_text.html("GAME OVER");
  go_text.appendTo(canvas);
  go_text.animate({
    opacity: 80/100
  }, 3000);
  var score_det = $('<div>');
  score_det.html('Score');
  score_det.attr("class", "detail");
  score_det.appendTo(screen);
  setTimeout(function(){
    
    score_det.animate({
      'margin-top': '+='+16+'vh'
    }, 500);
    var score_n = $('<div>');
    score_n.html(score);
    score_n.attr("class", "number");
    setTimeout(function(){
    
      score_n.appendTo(screen);
      score_n.prop('Counter',0).animate({
          Counter: score_n.html()
        }, {
          duration: 1500,
          easing: 'linear',
          step: function (now) {
            score_n.html(Math.ceil(now));
          }
      });
      var combo_det = $('<div>');
      combo_det.html('Highest combo');
      combo_det.attr("class", "detail");
      combo_det.css("margin-top", "-33vh");
      combo_det.appendTo(screen);
      setTimeout(function(){

        combo_det.animate({
          'margin-top': '+='+39+'vh'
        }, 500);
        var combo_n = $('<div>');
        combo_n.html('x'+max_combo);
        combo_n.attr("class", "number");
        setTimeout(function(){

          combo_n.appendTo(screen);
          combo_n.prop('Counter',0).animate({
            Counter: max_combo
          }, {
            duration: 1500,
            easing: 'linear',
            step: function (now) {
              combo_n.html('x'+Math.ceil(now));
            }
          }, 1500);
          var perc_det = $('<div>');
          perc_det.html('Hit rate');
          perc_det.attr("class", "detail");
          perc_det.css("margin-top", "-60vh");
          perc_det.appendTo(screen);
          setTimeout(function(){

            perc_det.animate({
              'margin-top': '+='+66+'vh'
            }, 500);
            var perc_n = $('<div>');
            perc_n.html(0+'%');
            perc_n.attr("class", "number");
            setTimeout(function(){

              perc_n.appendTo(screen);
              perc_n.prop('Counter',0).animate({
                Counter: percent
              }, {
                duration: 1500,
                easing: 'linear',
                step: function (now) {
                  perc_n.html(Math.ceil(now)+'%');
                }
              });
              setTimeout(function(){
                var arr = $('<div>');
                arr.html('➔');
                arr.attr("class", "arrow");
                arr.appendTo(screen);
                arr.animate({
                  left: "2vw"
                }, 1000);
                arr.click(function() {
                  arr.animate({
                    left: "-100vw"
                  }, 1000);
                  setTimeout(function(){
                    canvas.empty();
                    screen.empty();
                    screen.remove();
                    canvas.animate({
                      height: "-=" + ((screen.height())-($(window).height())) + "px",
                      width: "-=" + ((screen.width())-($(window).width())) + "px"
                    }, 600, function() {
                       generate_titlescreen();    
                    });
                  }, 500);
                });
                 //code
                if (high1 == 'null') high1 = 0;
                if (high2 == 'null') high2 = 0;
                if (high3 == 'null') high3 = 0;
                if (high4 == 'null') high4 = 0;
                if (high5 == 'null') high5 = 0;
                if (score > high5) {
                  high5 = score;
                  var tmp = high4;
                  if (high5 > high4) {
                    high4 = high5;
                    high5 = tmp;
                  }
                  tmp = high3;
                  if (high4 > high3) {
                    high3 = high4;
                    high4 = tmp;
                  }
                  tmp = high2;
                  if (high3 > high2) {
                    high2 = high3;
                    high3 = tmp;
                  }
                  tmp = high1;
                  if (high2 > high1) {
                    high1 = high2;
                    high2 = tmp;
                  }
                  //new highscore!
                  var ann = $('<div>');
                  ann.html('NEW HIGHSCORE');
                  ann.attr("class", "ann");
                  ann.appendTo(screen);
                  ann.animate({
                    'font-size': $(window).height()*9.5/100
                  }, 300);
                  localStorage.setItem("high1", high1);
                  localStorage.setItem("high2", high2);
                  localStorage.setItem("high3", high3);
                  localStorage.setItem("high4", high4);
                  localStorage.setItem("high5", high5);
                }
              }, 1500);
             }, 500);

          }, 1500);


        }, 500);

      }, 1500);
      
      
    }, 500);
    
  }, 1500);
}

function spawn_note() {
  var l_arr = $("<img>");
  l_arr.attr("class", "left_note");
  l_arr.attr("src", "img/arr.png");
  var rand = Math.floor(Math.random()*4);
  var rand1 = Math.floor(Math.random()*4);
  var rand2 = Math.floor(Math.random()*4);
  var rand = Math.floor(Math.random()*4);
  if (rand % 4 == 0) {
    l_arr.css('transform', 'rotate(' + 90 + 'deg)');
    l_arr.appendTo(left_col);
    l_arr.attr('id', h_n_notes);
    note_type[n_notes] = 'l';
    note_id[n_notes] = h_n_notes;
  }
  if (rand % 4 == 1) {
    l_arr.css('transform', 'rotate(' + 180 + 'deg)');
    l_arr.appendTo(up_col);
    l_arr.attr('id', h_n_notes);
    note_type[n_notes] = 'u';
    note_id[n_notes] = h_n_notes;
  }
  if (rand % 4 == 2) {
    l_arr.appendTo(down_col);
    l_arr.attr('id', h_n_notes);
    note_type[n_notes] = 'd';
    note_id[n_notes] = h_n_notes;
  }
  if (rand % 4 == 3) {
    l_arr.css('transform', 'rotate(' + 270 + 'deg)');
    l_arr.appendTo(right_col);
    l_arr.attr('id', h_n_notes);
    note_type[n_notes] = 'r';
    note_id[n_notes] = h_n_notes;
  }
  n_notes++;
  h_n_notes++;
}
function note_fall() {
  for (var i = 0; i < n_notes; i++) {
    var curr_note = $('#'+note_id[i]);
    var pos_top = curr_note.position().top;
    curr_note.css('top', pos_top-Math.max(1, ($(window).height())*difficulty/1536));
    
    //check whether it's off-screen
    var window_h = $(window).height();
    if (pos_top < (-0.22*window_h)) {
      generate_status('Miss');
      curr_note.remove();
      note_type.splice(i, 1);
      note_id.splice(i, 1);
      n_notes--;
      i--;
      max_combo = Math.max(max_combo, combo);
      combo = 0;
      percent = (percent*(percent_p-1)/percent_p + 0*1/percent_p);
      percent_p++;
    }
  }
}
function score_updater() {
  if (score_d) $('.score').remove();
  if (combo_d) $('.combo').remove();
  if (percent_d) $('.percent_d').remove();
  generate_numbers();
  if (time_left == 0) {
    time_d.css("color", "#e1e1e1");
    clearInterval(note_gen);
    clearInterval(note_movement);
    clearInterval(update);
    clearInterval(time);
    max_combo = Math.max(max_combo, combo);
    // confirm.click(function() {
    canvas.empty();
    canvas.animate({
      height: $(window).height()*75/100,
      background: '#342759'
    }, 500);
    // generate_titlescreen();
    generate_gameover();
  }
}

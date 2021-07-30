var api_link =  "http://localhost:9090/REST-Api-with-Slim-PHP/public/";
initMenu();
function checkLogin() {
    var today = new Date();
    var date = today.getFullYear() + '/'+ (today.getMonth()+1) + '/' + today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

    var flag_active = localStorage.getItem('flag_active');  
    var flag_lock = localStorage.getItem('lock');

    if(flag_lock == "Y") {
        
        $("#txtusername").val(localStorage.getItem("user_code"));
        $("#modalRelog").modal({
            backdrop: 'static',
            keyboard: false, 
            show: true
        });
    }

    if(flag_active != "Y" || localStorage.getItem('flag_active') === null)
    {
       localStorage.clear();
       window.location=("login");
       return;
    }

    if (localStorage.getItem('time_login') != null) {
        date_login = new Date(localStorage.getItem('time_login'));
        var thisDay = new Date(date + " " + time);
        var difference = thisDay.getTime() - date_login.getTime(); // This will give difference in milliseconds
        var resultInMinutes = Math.round(difference / 60000);
        if(resultInMinutes >= 60) {
            localStorage.clear();
            window.location=("login");
            return;
        }

     
    }

    
}

function blankForNull(s) {
    return s === "null" ? "" : s;
}

function logout() {
    localStorage.clear();
    window.location = "login";
}
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||  
     (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
}

setIdleTimeout(600000, function() {
    $("#txtusername").val(localStorage.getItem("user_code"));
    localStorage.setItem('lock','Y');
    $("#modalRelog").modal({
        backdrop: 'static',
        keyboard: false, 
        show: true
    });
    // document.body.innerText = "Where did you go?";
}, function() {
    // document.body.innerText = "Welcome back!";
});

$("#btnRelogin").on('click',function() {
    var arrayData = {};
    var username = $("#txtusername").val();
    var password = $("#txtPassword").val();
    
    
    var dataJSON;
    
    // $('#myPleaseWait').modal('show');

    if(username == "")
    {

        $("#notifAlert").show();
        $("#notifAlert").removeClass("alert-success").removeClass("alert-danger").addClass("alert-warning");
        $("#txtAlert").html("username cannot be empty !");
        return;
    }

    if(password == "")
    {
        $("#notifAlert").show();
        $("#notifAlert").removeClass("alert-success").removeClass("alert-danger").addClass("alert-warning");
        $("#txtAlert").html("password cannot be empty !");
        return;
    }

    let encryption = new Encryption();

    arrayData['username'] = encryption.encrypt(username);//username;
    arrayData['password'] = encryption.encrypt(password);//password;

    dataJSON = JSON.stringify(arrayData);

    // console.log(dataJSON);
    
    $.ajax({
        type: "POST",
        dataType:"JSON",
        url: api_link + "login",
        crossDomain: true,
        data:dataJSON,
        async:false,
        beforeSend: function(html){
            $('#myPleaseWait').modal('show');
        },success: function(data){
            // var now = new Date().toISOString().slice(0,10);
            
            var today = new Date();
            var date = today.getFullYear() + '/'+ (today.getMonth()+1) + '/' + today.getDate();
            var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

          
            
            if(data['status'] == "error") {
                alertNotif("Warning","Warning",data['message']);
            } else {
                if(data['data'].NOID != "")
                {
                    localStorage.setItem('flag_active', 'Y');   
                    localStorage.setItem('lock','N');
                    localStorage.setItem('user_code', username);
                    localStorage.setItem('username', data['data'].USERNAME);
                    // localStorage.setItem('time_login',now);
                    localStorage.setItem('time_login',date + ' ' + time);
                    localStorage.setItem('token',data.token);
                    localStorage.setItem('department', data['data'].DEPARTMENT);
                    $("#modalRelog").modal('hide');
                }
            }
           
           
            $('#myPleaseWait').modal('hide');
        },error: function () {
            $('#myPleaseWait').modal('hide');
        }
    });
});

function setIdleTimeout(millis, onIdle, onUnidle) {
    var timeout = 0;
    startTimer();

    function startTimer() {
        timeout = setTimeout(onExpires, millis);
        document.addEventListener("mousemove", onActivity);
        document.addEventListener("keypress", onActivity);
    }
    
    function onExpires() {
        timeout = 0;
        onIdle();
    }

    function onActivity() {
        if (timeout) clearTimeout(timeout);
        else onUnidle();
        //since the mouse is moving, we turn off our event hooks for 1 second
        document.removeEventListener("mousemove", onActivity);
        document.removeEventListener("keypress", onActivity);
        setTimeout(startTimer, 1000);
    }
}


$("#txtImageText").html(localStorage.getItem('user_code'));

function lock() {
    $("#txtusername").val(localStorage.getItem("user_code"));
    localStorage.setItem('lock','Y');
    $("#modalRelog").modal({
        backdrop: 'static',
        keyboard: false, 
        show: true
    });
}

function alertNotif(type, title,message) {
    new PNotify({
        title: title,
        type: type,
        text: message,
        nonblock: {
            nonblock: true
        },
        styling: 'bootstrap3',
       // addclass: 'dark'
    });
}


$("#username").html(localStorage.getItem('user_code'));
function initMenu() {
    // $("#menuList").html();

    $.ajax({
        type: "GET",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/get_user_department/" + localStorage.getItem('user_code'),
        crossDomain: true,
        beforeSend: function(html){

        },success: function(data){
            // console.log(data['department'])
            var MenuList = "";
            if(data['status'] == "success") {
                if(data['department'] == "IT") {
                    
                    MenuList = '<li><a href="report-control"><i class="fa fa-gears"></i> Report Control <span class=""></span></a></li>';
                    MenuList = MenuList + '<li><a href="add-user"><i class="fa fa-users"></i> Add & Config User <span class=""></span></a></li>'
                    MenuList = MenuList + '<li><a href="report-misc"><i class="fa fa-book"></i> Report Misc <span class=""></span></a></li>'
                    // $('.nav side-menu').append(MenuList);
                    $("#menuList").append(MenuList);
                }
            } else {
                alertNotif("Warning", "Warning","Some error with your internet or others, please refresh or contact IT");
                // $("#menuList").html();
                // $('.nav side-menu').after('');
            }
            

        },error: function (xhr) {
            alertNotif("Warning", "Warning",xhr.responseText);
            // console.log(xhr.responseText);
        }
    });
    
}
$("#txtUsername").val(localStorage.getItem('user_code'));
$("#txtName").val(localStorage.getItem('username'));

$("#txtRePassword").on("change", function() {
    var valPassword = $("#txtPass").val();

    if($(this).val() != valPassword) {
        $("#notifPassword").html('<p style="color:red">Password must be the same.</p>');
    } else {
        $("#notifPassword").html('');
    }
})

$("#btnSave").on("click", function() {
    var username = $("#txtUname").val();
    var name = $("txtName").val();
    var password = $("#txtPass").val();
    var rePass = $("#txtRePassword").val();

    if(username == "")
    {
        alertNotif("Warning","Warning","Please fill Username");
        $("#txtUname").focus();
        return;
    }

    if(name == "")
    {
        alertNotif("Warning","Warning","Please fill Name");
        $("#txtUname").focus();
        return;
    }
    if(password == "")
    {
        alertNotif("Warning","Warning","Please fill Password");
        $("#txtUname").focus();
        return;
    }

    if(rePass == "")
    {
        alertNotif("Warning","Warning","Please fill Re-Type Password");
        $("#txtUname").focus();
        return;
    }
    
    var dataJson = {};

    dataJson['user_code'] = username;
    dataJson['username'] = name;
    dataJson['password'] = password;

    $.ajax({
        type: "POST",
        dataType:"JSON",
        url: api_link + "login",
        crossDomain: true,
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        data:JSON.stringify(dataJson),
        async:false,
        beforeSend: function(html){
            $('#myPleaseWait').modal('show');
        },success: function(data){
            if(data['message'] == "success") {
                alertNotif("info", "Info", "Update password success !");
                $("#txtUname").val("");
                $("#txtName").val("");
                $("#txtPass").val("");
                $("#txtRePassword").val("");
            } else {
                
                alertNotif("warning", "Warning", "Update password failed !");
            }
            $('#myPleaseWait').modal('hide');
        },error: function () {
            $('#myPleaseWait').modal('hide');
        }
    });
});
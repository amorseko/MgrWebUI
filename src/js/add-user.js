var api_link =  "http://localhost:9090/REST-Api-with-Slim-PHP/public/";
var list_user;
initMenu();

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

    
    createTreeview();
}


var idQuery = "";

function createTreeview() {
    $.ajax({
        type: "GET",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/get_menus_report_config",
        crossDomain: true,
        beforeSend: function(html){

        },success: function(data){
            $('#treeview12').treeview({data:data['data']}).on('nodeSelected', function (event, data) {
                idQuery = data.dataId;
                get_user_list(data.dataId);
                // getQuery(data.dataId);
                
            });

        },error: function () {
            
        }
    })
}

function createCheckbox(idUser,statusChecked,idRules) {
    var htmlCheckBox = "";
    if(statusChecked === true) 
    {
        return htmlCheckBox = '<input type="checkbox" checked name="checkPayorCode" onclick="updateRulesUser(this,\'' + idRules + '\');"  class="flat" id="checkPayorCode" value="' + idUser + '">';
    }
    else
    {
        return htmlCheckBox = '<input type="checkbox" name="checkPayorCode" onclick="updateRulesUser(this,\'' + idRules + '\');"  class="flat" id="checkPayorCode" value="' + idUser + '">'
    }
    
}

function updateRulesUser(elem,idRules) {
    // console.log(idUser);
    if(elem.value != "") {
        if(elem.checked == true) {
            $("#msgConfirm").html("<h2>Are you sure want to add this rules ?</h2>");
        } else {
            
            $("#msgConfirm").html("<h2>Are you sure want to remove this rules ?</h2>");
        }
        $("#txtKeyMenus").val(idRules);
        $("#txtStatusChecked").val(elem.checked);
        $("#txtIdUser").val(elem.value);
        $("#modalConfirm").modal('show');
    } else {
        alertNotif("Warning", "Warning", "Please select user before update rules");
    }
}

$("#btnAddUser").on("click", function() {
    $("#modalAddUser").modal('show');
});

$("#btnSaveUser").on("click",function() {
    var user_code = $("#txtUserCode").val();
    var password = $("#txtPassword").val();
    var username = $("#txtUsername").val();
    var cmbDepartment = $("#cmbDepartment option:selected").val();

    if(user_code == "") {
        alertNotif("Warning","Warning","Please fill user code"); 
        return;
    } 

    if(password == "") {
        alertNotif("Warning","Warning","Please fill password"); 
        return;
    } 

    if(username == "") {
        alertNotif("Warning","Warning","Please fill username"); 
        return;
    } 

    if(cmbDepartment == "") {
        alertNotif("Warning","Warning","Please select department"); 
        return;
    } 

    var dataPush = {};

    dataPush['user_code'] = user_code;
    dataPush['password'] = password;
    dataPush['username'] = username;
    dataPush['department'] = cmbDepartment;

    $.ajax({
        type: "POST",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/add_new_user",
        data:JSON.stringify(dataPush),
        crossDomain: true,
        beforeSend: function(html){
            $("#myPleaseWait").modal('show');
        },success: function(data,textStatus,xhr){
           console.log(xhr.status)
            if(data['status'] == "success") {
                alertNotif("info","Info",data['message']);
                $("#modalAddUser").modal('hide');
            } else {

                alertNotif("Warning","Warning",data['message']);
            }
            $("#myPleaseWait").modal('hide');

        },error: function (xhr,textStatus) {
            // console.log(xhr.status);
            if(xhr.status == 404) {
                var dataRes = xhr.responseText;
                var jsonRes = JSON.parse(dataRes);

                alertNotif("Warning","Warning",jsonRes['message']);
            } else {
                alertNotif("Warning","Warning",xhr.responseText);
            }
            
            $("#myPleaseWait").modal('hide');
        }
    })
});

$('#modalConfirm').on('hidden.bs.modal', function () {
    // do something…
    $("#txtUserCode").val("");
    $("#txtPassword").val("");
    $("#txtUsername").val("");
});

$("#btnConfirm").on("click",function() {
    var dataPush = {};

    dataPush['key_menus'] = $("#txtKeyMenus").val();
    dataPush['status_checked'] = $("#txtStatusChecked").val();
    dataPush['id_user'] = $("#txtIdUser").val();

    $.ajax({
        type: "PUT",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/update_rules",
        data: JSON.stringify(dataPush),
        crossDomain: true,
        beforeSend: function(html){
            $("#myPleaseWait").modal('show');
        },success: function(data){
            
            if(data['status'] == "success") {
                alertNotif("info","Info","Success");
                list_user.ajax.reload();
            } else {
                alertNotif("Warning", "warning","Some error with your internet or others, please refresh or contact IT");
            }
            
            $('#modalConfirm').modal('hide');
            
            $("#myPleaseWait").modal('hide');
        },error: function (xhr) {
            if(xhr.status == 404) {
                var dataRes = xhr.responseText;
                var jsonRes = JSON.parse(dataRes);

                alertNotif("Warning","Warning",jsonRes['message']);
            } else {
                alertNotif("Warning","Warning",xhr.responseText);
            }
            // alertNotif("Warning", "warning",xhr.responseText);
            $("#myPleaseWait").modal('hide');
            // console.log(xhr.responseText);
        }
    })
});

$('#modalConfirm').on('hidden.bs.modal', function () {
    // do something…
    $("#txtKeyMenus").val("");
    $("#txtStatusChecked").val("");
    $("#txtIdUser").val("");
});

function get_user_list(key_menus) {
    list_user = $('#tblUser').DataTable( {
        processing:true,
        "ajax": {
            "url": "http://localhost:9090/REST-Api-with-Slim-PHP/public/api/get_rules/"+key_menus,
            "headers" : {"Authorization": "Bearer " + localStorage.getItem('token')},
            "crossDomain": true,
            beforeSend: function (request) {
                $('#tblUser').css("opacity","0.3");
            },
            "type": "GET",
            timeout: 10000,
            error: function(jqXHR, textStatus){
                if(textStatus === 'timeout')
                {     
                    new PNotify({
                        title: 'Warning',
                       // type: 'info',
                        text: 'Respon terlalu lama, silahkan refresh beberapa saat lagi.',
                        nonblock: {
                            nonblock: true
                        },
                        styling: 'bootstrap3',
                       // addclass: 'dark'
                    });
                    //  alert('Respon terlalu lama, silahkan refresh beberapa saat lagi.'); 
                     $('#tblUser').css("opacity","1");  
                     $("#tblUser").hide();     
                    //do something. Try again perhaps?
                } 

                if(jqXHR.status == 404) {
                    var dataRes = jqXHR.responseText;
                    var jsonRes = JSON.parse(dataRes);
    
                    alertNotif("Warning","Warning",jsonRes['message']);
                } else {
                    alertNotif("Warning","Warning",jqXHR.responseText);
                }
            },
        },
        "scrollY": true,
        scrollCollapse: true,
        paging: false,
        searching: true,
        destroy: true,
        "ordering": false,
        "createdRow": function ( row, data, index ) {
            
            // // data
            $('td', row).eq(0).html(createCheckbox(blankForNull(data[0]),data[4],key_menus));
            $('td', row).eq(4).html(data[5]);
            
        },
        "displayLength": 1000,
        "initComplete": function( settings ) {
            //alert( 'DataTables has redrawn the table' );
        },
        // "fnDrawCallback": function( oSettings ) {
        //    $("#checkPayorCode").attr("checked", false);
        // }
    }).on( 'draw', function () {
        $('#tblUser').css("opacity","1");
        $('[data-toggle="popover"]').popover({html:true});
       
       
        
        
    });
    return true;
    
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
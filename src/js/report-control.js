var api_link =  "http://localhost:9090/REST-Api-with-Slim-PHP/public/";

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
            console.log(data['department'])
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

// function checkLogin()
// {
//     var flag_active = localStorage.getItem('flag_active');  
//     var date_login = localStorage.getItem('time_login');
//     var now = new Date().toISOString().slice(0,10);

    
//     // console.log(nows);

//     if(flag_active != "Y" || localStorage.getItem('flag_active') === null)
//     {
//        localStorage.clear();
//        window.location=("login.html");
//        return;
//     }

//     var dateDiff = CompareDate(date_login,now);
    
//     if(dateDiff >= 3)
//     {
//         localStorage.clear();
//         window.location=("login.html");
//         return;
//     }
//     // render_menu();
//     createTreeview();
//     // addTab(0);
// }

function checkLogin() {
    // var startTime = new Date('2021/7/16 09:00:00'); 
    // var endTime = new Date('2021/7/16 10:00:00');
    // var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    // var resultInMinutes = Math.round(difference / 60000);
    // console.log(resultInMinutes);
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

        
        // var dateDiff = CompareDate(date_login,now);
        // if(dateDiff >= 3)
        // {
        //     localStorage.clear();
        //     // window.location=("login");
        // }
    }

    
    createTreeview();
}

function CompareDate(date11,date12)
{
    var date1, date2;  
    //define two date object variables with dates inside it  
    date1 = new Date(date11);  
    date2 = new Date(date12);  

    // console.log(date1);

    //calculate time difference  
    var time_difference = date2.getTime() - date1.getTime();  

    //calculate days difference by dividing total milliseconds in a day  
    var days_difference = time_difference / (1000 * 60 * 60 * 24);  

    return days_difference;
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
            console.log(data['data'])
            // $('#treeview12').treeview({data:data['data']});
            // var allNodes = $('#treeview').treeview('getNodes');
            // $(allNodes).each(function(index, element) {
            //     $(this.$el[0]).attr('data-id-json', this.data);
            // });
            $('#treeview12').treeview({data:data['data']}).on('nodeSelected', function (event, data) {
                // if ((event.which && event.which == 3) || (event.button && event.button == 2)) {
                //     console.log("right click")
                // } else { 
                //     alert("Node Selected"); 
                // } 
                getQuery(data.dataId);
                idQuery = data.dataId;
                // console.log(data);
                // console.log( getAllNodes() );
                // console.log( JSON.stringify(getAllNodes() ));
                // console.log('node selected = ' + JSON.stringify(event) + '; data = ' + JSON.stringify(data.dataId));
            });

        },error: function () {
            
        }
    })
}

// $('#treeview12').contextMenu({
//     selector: 'li', 
//     callback: function(key, options) {
//         var m = "clicked: " + key + " on " + $(this).text();
//         window.console && console.log(m) || alert(m); 
//     },
//     items: {
//         "edit": {name: "Edit", icon: "edit"},
//         "cut": {name: "Cut", icon: "cut"},
//         "copy": {name: "Copy", icon: "copy"},
//         "paste": {name: "Paste", icon: "paste"},
//         "delete": {name: "Delete", icon: "delete"},
//         "sep1": "---------",
//         "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
//     }
// });

$('body').on('mousedown', '#treeview12 li', function (e) {
    if (e.button == 2) {
        // $(this).click();
        $.contextMenu({
            selector: 'li', 
            callback: function(key, options) {
                // var m = "clicked: " + key;
                // window.console && console.log(m) || alert(m); 
                if(key == "add_root") {
                    $("#modalAddRoot").modal('show');
                }

                if(key == "add_node") {
                    $("#modalAddNode").modal('show');
                }

                if(key == "add_report") {
                    $("#modalAddReport").modal('show');
                }
            },
            items: {
                "add_root": {name: "Add Root", icon: "add"},
                "add_node": {name: "Add Node", icon: "add"},
                "add_report": {name: "Add Report", icon: "add"},
            }
        });
        
    }
    return true;
});

$("#btnSaveRoot").on("click", function() {
    var dataPush = {};
    if($("#txtRoot").val() == "") {
        alertNotif("Warning","Warning","Select node before you create new node");
        return;
    }
    dataPush['parrent_id'] = "0";
    dataPush['menu_name'] = $("#txtRoot").val();

    var dataJson = JSON.stringify(dataPush);

    // console.log(dataJson);

    $.ajax({
        type: "POST",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/add_node_root",
        data:dataJson,
        crossDomain: true,
        beforeSend: function(html){
            $("#myPleaseWait").modal('show');
        },success: function(data){
            if(data['status'] == "error") {
                
                alertNotif("warning","Warning",data['message']);
                $("#txtRoot").val("");
                $("#modalAddRoot").modal('hide');
                location.reload();
            } else {
                alertNotif("info","Info",data['message']);
            }
            
            $("#myPleaseWait").modal('hide');
        },error: function (xhr) {
            
            alertNotif("Warning", "Warning",xhr.responseText);
            $("#myPleaseWait").modal('hide');
        }
    })

});

$("#btnSaveReport").on("click",function() {
    if($("#txtReport").val() == "" ){
        alertNotif("Warning","Warning","name cannot be empty !");
        return;
    }

    if(idQuery == "") {
        alertNotif("Warning","Warning","Select node before you create new report");
        return;
    }   
    var countTab = $('#tab-content ul').length;
    if(countTab != 0){
        countTab = parseInt(countTab) - 1;
    }
    // console.log(countTab);
    addTabDynamicly($("#txtReport").val(),countTab,"",countTab,"","",0);
    var dataPush = {};
    dataPush['key_menus'] = idQuery;
    dataPush['menu_name'] = $("#txtReport").val();

    $.ajax({
        type: "POST",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/add_report",
        data:JSON.stringify(dataPush),
        crossDomain: true,
        beforeSend: function(html){
            $("#myPleaseWait").modal('show');
        },success: function(data){
            if(data['status'] == "error") {
                
                alertNotif("warning","Warning",data['message']);
                $("#txtReport").val("");
                $("#modalAddReport").modal('hide');
                // location.reload();
            } else {
                alertNotif("info","Info",data['message']);
            }
            
            $("#myPleaseWait").modal('hide');
        },error: function (xhr) {
            
            alertNotif("Warning", "Warning",xhr.responseText);
            $("#myPleaseWait").modal('hide');
        }
    })

});


$("#btnSaveNode").on("click", function() {
    var dataPush = {};
    if(idQuery == "") {
        alertNotif("Warning","Warning","Select node before you create new node");
        return;
    }

    if($("#txtNode").val() == "" ){
        alertNotif("Warning","Warning","name cannot be empty !");
        return;
    }
    
    dataPush['parrent_id'] = idQuery;
    dataPush['menu_name'] = $("#txtNode").val();

    var dataJson = JSON.stringify(dataPush);

    // console.log(dataJson);

    $.ajax({
        type: "POST",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/add_node_root",
        data:dataJson,
        crossDomain: true,
        beforeSend: function(html){
            $("#myPleaseWait").modal('show');
        },success: function(data){
            if(data['status'] == "error") {
                
                alertNotif("warning","Warning",data['message']);
                $("#txtNode").val("");
                $("#modalAddNode").modal('hide');
                location.reload();
            } else {
                alertNotif("info","Info",data['message']);
            }
            
            $("#myPleaseWait").modal('hide');
        },error: function (xhr) {
            
            alertNotif("Warning", "Warning",xhr.responseText);
            $("#myPleaseWait").modal('hide');
        }
    })

});

function removeTab() {
    $("#tab-list").html("");
    $("#tab-content").html("");
}


function get_selected_priority(Priority, curVal, valOr = "") {
    var selected = "";
    if(valOr != "") {
        if(Priority == curVal || Priority == valOr) { return selected = 'selected';} else { selected = '';}
    } else {
        if(Priority == curVal) { return selected = 'selected';} else { selected = '';}
    }
}

function addTabDynamicly(headerName,idTab,query,Priority,DbServer,formated,reCountTab)
{
    var setActive = '';
    var setActiveBody = '';
    if(reCountTab == 0) {
        setActive = 'class="active"';
        setActiveBody = 'in active';
    }
    var tablesData = "";
    tablesData = tablesData + "<div class='col-md-12 col-xs-12'>";
    tablesData = tablesData + "    <div class='x_panel'>";
    tablesData = tablesData + "        <div class='x_title'>";
    tablesData = tablesData + "        <ul class='nav navbar-right panel_toolbox'>";
    tablesData = tablesData + "            <li><a class='collapse-link'><i class='fa fa-chevron-up'></i></a>";
    tablesData = tablesData + "            </li>";
    tablesData = tablesData + "        </ul>";
    tablesData = tablesData + "        <div class='clearfix'></div>";
    tablesData = tablesData + "        </div>";
    tablesData = tablesData + "        <div class='x_content'>";
    tablesData = tablesData + "             <div class='form-inline'>";
    tablesData = tablesData + '                 <select id="cmbDbType' + headerName + '" name="cmbDbType[]" class="form-group">';
    tablesData = tablesData + '                     <option value="">Choose DB Type</option>';
    tablesData = tablesData + '                     <option value="DEV" ' + get_selected_priority(DbServer,"DEV") + '>DEV</option>';
    tablesData = tablesData + '                     <option value="STDBY" ' + get_selected_priority(DbServer,"STDBY", "PROD") + '>STDBY</option>';
    tablesData = tablesData + '                     <option value="YAKES" ' + get_selected_priority(DbServer,"YAKES") + '>YAKES</option>';
    tablesData = tablesData + '                 </select>';
    tablesData = tablesData + '                 <select id="cmbPriority' + headerName + '" name="cmbPriority[]" class="form-group">';
    tablesData = tablesData + '                     <option value="">Choose Priority</option>';
    tablesData = tablesData + '                     <option value="0" ' + get_selected_priority(Priority,"0") + '>0</option>';
    tablesData = tablesData + '                     <option value="1" ' + get_selected_priority(Priority,"1") + '>1</option>';
    tablesData = tablesData + '                     <option value="2" ' + get_selected_priority(Priority,"2") + '>2</option>';
    tablesData = tablesData + '                     <option value="3" ' + get_selected_priority(Priority,"3") + '>3</option>';
    tablesData = tablesData + '                     <option value="4" ' + get_selected_priority(Priority,"4") + '>4</option>';
    tablesData = tablesData + '                     <option value="5" ' + get_selected_priority(Priority,"5") + '>5</option>';
    tablesData = tablesData + '                     <option value="6" ' + get_selected_priority(Priority,"6") + '>6</option>';
    tablesData = tablesData + '                     <option value="7" ' + get_selected_priority(Priority,"7") + '>7</option>';
    tablesData = tablesData + '                     <option value="8" ' + get_selected_priority(Priority,"8") + '>8</option>';
    tablesData = tablesData + '                     <option value="9" ' + get_selected_priority(Priority,"9") + '>9</option>';
    tablesData = tablesData + '                     <option value="10" ' + get_selected_priority(Priority,"10") + '>10</option>';
    tablesData = tablesData + '                     <option value="11" ' + get_selected_priority(Priority,"11") + '>11</option>';
    tablesData = tablesData + '                     <option value="12" ' + get_selected_priority(Priority,"12") + '>12</option>';
    tablesData = tablesData + '                     <option value="13" ' + get_selected_priority(Priority,"13") + '>13</option>';
    tablesData = tablesData + '                     <option value="14" ' + get_selected_priority(Priority,"14") + '>14</option>';
    tablesData = tablesData + '                     <option value="15" ' + get_selected_priority(Priority,"15") + '>15</option>';
    tablesData = tablesData + '                     <option value="16" ' + get_selected_priority(Priority,"16") + '>16</option>';
    tablesData = tablesData + '                     <option value="17" ' + get_selected_priority(Priority,"17") + '>17</option>';
    tablesData = tablesData + '                     <option value="18" ' + get_selected_priority(Priority,"18") + '>18</option>';
    tablesData = tablesData + '                     <option value="19" ' + get_selected_priority(Priority,"19") + '>19</option>';
    tablesData = tablesData + '                 </select>';
    tablesData = tablesData + '                 <select id="cmbFormat' + headerName + '" name="cmbFormat[]" class="form-group">';
    tablesData = tablesData + '                     <option value="">Choose Format</option>';
    tablesData = tablesData + '                     <option value="YES" ' + get_selected_priority(formated,"1") + '>YES</option>';
    tablesData = tablesData + '                     <option value="NO" ' + get_selected_priority(formated,"0") + '>NO</option>';
    tablesData = tablesData + '                 </select>';
    tablesData = tablesData + '                 <input type="hidden" value="' + idTab + '" name="txtidQuery[]">'
    tablesData = tablesData + '                 <input type="hidden" value="' + idQuery + '" name="txtKeyMenus[]">'
    tablesData = tablesData + '                 <input type="hidden" value="' + headerName + '" name="txtQueryName[]">'
    tablesData = tablesData + '             </div>';
    tablesData = tablesData + "        </div>";
    tablesData = tablesData + "    </div>";
    tablesData = tablesData + "</div>";
    tablesData = tablesData + "<div class='col-md-12 col-xs-12'>";
    tablesData = tablesData + "    <div class='x_panel'>";
    tablesData = tablesData + "        <div class='x_title'>";
    tablesData = tablesData + "        <ul class='nav navbar-right panel_toolbox'>";
    tablesData = tablesData + "            <li><a class='collapse-link'><i class='fa fa-chevron-up'></i></a>";
    tablesData = tablesData + "            </li>";
    tablesData = tablesData + "        </ul>";
    tablesData = tablesData + "        <div class='clearfix'></div>";
    tablesData = tablesData + "        </div>";
    tablesData = tablesData + "        <div class='x_content'>";
    tablesData = tablesData + '<div class="table-responsive"><textarea style="width: 100%;height: 100vh;display: block;" name="txtQuery[]" oncontextmenu="rightMenu(this.id)" class="resizable_textarea form-control" id="txt' + headerName + '">' + query + '</textarea></div>';
    tablesData = tablesData + "        </div>";
    tablesData = tablesData + "    </div>";
    tablesData = tablesData + "</div>";
    // tablesData = tablesData + '<textarea height="500px" class="resizable_textarea form-control" id="txt' + headerName + '">' + query + '</textarea>';
    // tablesData = tablesData + '</div>';
    //  tablesData = tablesData + '<div class="table-responsive"><textarea height="500px" class="resizable_textarea form-control" id="txt' + headerName + '">' + query + '</textarea></div>';
    $('#tab-list').append($('<li ' + setActive + '><a href="#tab' + idTab + '" role="tab" data-toggle="tab"><span>Tab ' + headerName + '</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span></a></li>'));
    $('#tab-content').append($('<div class="tab-pane fade ' + setActiveBody + '" id="tab' + idTab + '"> ' + tablesData + '</div>'));
    
}


function getQuery(idQuery) {
    $.ajax({
        type: "GET",
        dataType: "JSON",
        headers:  {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/get_query/" + idQuery,
        crossDomain: true,
        beforeSend: function(html){

        },success: function(data){
            console.log(data['total'])
            removeTab();
            if(data['total'] != 0)
            {  
                var z = 0;
                $.each(data['data'], function(key,result) {
                    addTabDynamicly(result.QUERY_NAME,result.NO_ID,result.QUERY_EXECUTED,result.PRIORITY,result.DATABASE_SERVER, result.FORMATED, z++);
                    
                
                });
            }
           
        },error: function () {
            
        }
    })
}



$('#frmSave').submit(function(e){
    if(idQuery == "") {
        alertNotif("Warning", "Warning","Please select report before save");
        e.preventDefault(); 
        return;
    }
    
    $.ajax({
        type: "POST",
        dataType: "JSON",
        headers:  {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/update_report",
        data:$(this).serialize(),
        crossDomain: true,
        beforeSend: function(html){

        },success: function(data){
            if(data['total_failed'] == "0") {
                alertNotif("info","Info","Update success");
            } else {
                
                alertNotif("warning","Warning","Update success, but with error total : " + data['total_failed']);
            }
           
        },error: function (xhr) {
            alertNotif("Warning","warning",xhr.responseText);
        }
    })
    e.preventDefault(); 
});

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

function rightMenu(the_id) {
    $.contextMenu({
        selector: "textarea", 
        callback: function(key, options) {
            // var m = "clicked: " + key;
            // window.console && console.log(m) || alert(m); 
            if(key == "BETWEENDATE") {
               replace_selection(the_id,"@::BETWEENDATE::XX::");
            }

            if(key == "ISDATE") {
               replace_selection(the_id,"::ISDATE::XX::");
            }

            if(key == "CLAIM_STATUS") {
                replace_selection(the_id,"@::CLAIMSTATUS::XX::");
            }

            if(key == "PAYOR") {
                replace_selection(the_id,"@::PAYOR::XX::");
            }

            if(key == "CORPORATE") {
                replace_selection(the_id,"@::CORPORATE::Corporate code::");
            }

            if(key == "CORPCODE") {
                replace_selection(the_id,"@::CORPCODE::XX::");
            }

            if(key == "PLANCODE") {
                replace_selection(the_id,"@::PLANCODE::Plan code::");
            }

            if(key == "COVERAGE") {
                replace_selection(the_id,"@::COVERAGE::XX::");
            }

            if(key == "ARITCMATICS") {
                replace_selection(the_id,"@::ARITCMATICS::Percentage(%)::");
            }

            if(key == "CLAIMTYPE") {
                replace_selection(the_id,"@::CLAIMTYPE::XX::");
            }
        },
        items: {
            "BETWEENDATE": {name: "::BETWEENDATE::", icon: "add"},
            "ISDATE": {name: "::ISDATE::", icon: "add"},
            "CLAIM_STATUS": {name: "::CLAIMSTATUS::", icon: "add"},
            "PAYOR": {name: "::PAYOR::", icon: "add"},
            "CORPORATE": {name: "::CORPORATE::", icon: "add"},
            "CORPCODE": {name: "::CORPCODE::", icon: "add"},
            "PLANCODE": {name: "::PLANCODE::", icon: "add"},
            "COVERAGE": {name: "::COVERAGE::", icon: "add"},
            "ARITCMATICS": {name: "::ARITCMATICS::", icon: "add"},
            "CLAIMTYPE": {name: "::CLAIMTYPE::", icon: "add"},  
        }
    });
}



function get_selection(the_id)
{
    var e = document.getElementById(the_id);

    //Mozilla and DOM 3.0
    if('selectionStart' in e)
    {
        var l = e.selectionEnd - e.selectionStart;
        return { start: e.selectionStart, end: e.selectionEnd, length: l, text: e.value.substr(e.selectionStart, l) };
    }
    //IE
    else if(document.selection)
    {
        e.focus();
        var r = document.selection.createRange();
        var tr = e.createTextRange();
        var tr2 = tr.duplicate();
        tr2.moveToBookmark(r.getBookmark());
        tr.setEndPoint('EndToStart',tr2);
        if (r == null || tr == null) return { start: e.value.length, end: e.value.length, length: 0, text: '' };
        var text_part = r.text.replace(/[\r\n]/g,'.'); //for some reason IE doesn't always count the \n and \r in the length
        var text_whole = e.value.replace(/[\r\n]/g,'.');
        var the_start = text_whole.indexOf(text_part,tr.text.length);
        return { start: the_start, end: the_start + text_part.length, length: text_part.length, text: r.text };
    }
    //Browser not supported
    else return { start: e.value.length, end: e.value.length, length: 0, text: '' };
}

function replace_selection(the_id,replace_str)
{
    var e = document.getElementById(the_id);
    selection = get_selection(the_id);
    var start_pos = selection.start;
    var end_pos = start_pos + replace_str.length;
    e.value = e.value.substr(0, start_pos) + replace_str + e.value.substr(selection.end, e.value.length);
    set_selection(the_id,start_pos,end_pos);
    return {start: start_pos, end: end_pos, length: replace_str.length, text: replace_str};
}

function set_selection(the_id,start_pos,end_pos)
{
    var e = document.getElementById(the_id);

    //Mozilla and DOM 3.0
    if('selectionStart' in e)
    {
        e.focus();
        e.selectionStart = start_pos;
        e.selectionEnd = end_pos;
    }
    //IE
    else if(document.selection)
    {
        e.focus();
        var tr = e.createTextRange();

        //Fix IE from counting the newline characters as two seperate characters
        var stop_it = start_pos;
        for (i=0; i < stop_it; i++) if( e.value[i].search(/[\r\n]/) != -1 ) start_pos = start_pos - .5;
        stop_it = end_pos;
        for (i=0; i < stop_it; i++) if( e.value[i].search(/[\r\n]/) != -1 ) end_pos = end_pos - .5;

        tr.moveEnd('textedit',-1);
        tr.moveStart('character',start_pos);
        tr.moveEnd('character',end_pos - start_pos);
        tr.select();
    }
    return get_selection(the_id);
}

function wrap_selection(the_id, left_str, right_str, sel_offset, sel_length)
{
    var the_sel_text = get_selection(the_id).text;
    var selection =  replace_selection(the_id, left_str + the_sel_text + right_str );
    if(sel_offset !== undefined && sel_length !== undefined) selection = set_selection(the_id, selection.start +  sel_offset, selection.start +  sel_offset + sel_length);
    else if(the_sel_text == '') selection = set_selection(the_id, selection.start + left_str.length, selection.start + left_str.length);
    return selection;
}
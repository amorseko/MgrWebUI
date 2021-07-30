var api_link =  "http://localhost:9090/REST-Api-with-Slim-PHP/public/";
var list_of_coverage;
var list_of_claims_status;
var arrPayor = [];
var arrCorp = [];
var arrCov = [];
var arrClaimType = [];
var arrClaimStatus = [];

// var enableCorporate = false;
// var enablePayor = false,
//     enableIsDate = false,
//     enableBetween = false,
//     enableCoverage = false,
//     enablePlanCode = false,
//     enableClaimStatus = false,
//     enableClaimType = false,
//     enableAritMathics = false;
var enableCorporate;

initMenu();
initDisable();
// init_Status();

$("#username").html(localStorage.getItem('user_code'));
$('#unsignedCal').daterangepicker({
    singleDatePicker: true,
    singleClasses: "picker_1",
    locale: {
        format: 'MMM-DD-YYYY'
    }
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
});

$('#calTo').daterangepicker({
    singleDatePicker: true,
    singleClasses: "picker_1",
    locale: {
        format: 'MMM-DD-YYYY'
    }
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
});

$('#calFrom').daterangepicker({
    singleDatePicker: true,
    singleClasses: "picker_1",
    locale: {
        format: 'MMM-DD-YYYY'
    }
  }, function(start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
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

// function init_Status() {
//     enableCorporate = false;
//     enablePayor = false;
//     enableIsDate = false;
//     enableBetween = false;
//     enableCoverage = false;
//     enablePlanCode = false;
//     enableClaimStatus = false;
//     enableClaimType = false;
//     enableAritMathics = false;
// }

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
                alertNotif("Warning", "Some error with your internet or others, please refresh or contact IT");
                // $("#menuList").html();
                // $('.nav side-menu').after('');
            }
            

        },error: function (xhr) {
            alertNotif("Warning", xhr.responseText);
            // console.log(xhr.responseText);
        }
    });
    
}



function checkLogin() {
    // var startTime = new Date('2021/7/16 09:00:00'); 
    // var endTime = new Date('2021/7/16 10:00:00');
    // var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    // var resultInMinutes = Math.round(difference / 60000);
    // console.log(resultInMinutes);
    var flag_active = localStorage.getItem('flag_active');  
    var flag_lock = localStorage.getItem('lock');

    var today = new Date();
    var date = today.getFullYear() + '/'+ (today.getMonth()+1) + '/' + today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();

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
        // console.log("minutes : " + resultInMinutes);
        if(resultInMinutes >= 60) {
            localStorage.clear();
            window.location=("login");
            return;
        }
        
    }

    
    createTreeview();
    render_list_payor();
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

//perfix table id = listof

function render_list_payor(){
    //var url_claims_approval = "online_alert_dev/tb_claims_approval.php";
    
    var url_list_payor = "localhost:8080/api/get_payor";

    list_of_payor_code = $('#list_of_payor_code').DataTable( {
        processing:true,
        "ajax": {
            "url": "http://localhost:9090/REST-Api-with-Slim-PHP/public/api/get_payor",
            "headers" : {"Authorization": "Bearer " + localStorage.getItem('token')},
            "crossDomain": true,
            beforeSend: function (request) {
                $('#list_of_payor_code').css("opacity","0.3");
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
                     $('#list_of_payor_code').css("opacity","1");  
                     $("#list_of_payor_code").hide();     
                    //do something. Try again perhaps?
                }
            },
        },
        scrollCollapse: true,
        paging: true,
        searching: true,
        destroy: true,
        "ordering": true,
        "pageLength": 10,
        "createdRow": function ( row, data, index ) {
            
            // // data
            $('td', row).eq(0).html(CheckBoxPayorValue(data[1].trim()));

            
        },
        "displayLength": 1000,
        "initComplete": function( settings ) {
            //alert( 'DataTables has redrawn the table' );
        },
        // "fnDrawCallback": function( oSettings ) {
        //    $("#checkPayorCode").attr("checked", false);
        // }
    }).on( 'draw', function () {
        $('#list_of_payor_code').css("opacity","1");
        $('[data-toggle="popover"]').popover({html:true});
        // $("#checkPayorCode").prop('checked', false);
        if(list_of_coverage == null)
        {
            checkCoverageMaster();
        } 
        else
        {
            list_of_coverage.ajax.reload();
        }
        // if(list_of_payor_code!=null)
        // {
        //     // list_of_payor_code.ajax.reload();
        // }
       
        
        
    });
    return true;
}


var idQuery = "";

function createTreeview() {
    $.ajax({
        type: "GET",
        dataType:"JSON",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/get_menus/" + localStorage.getItem('user_code'),
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
                getQuery(data.dataId);
                idQuery = data.dataId;
                // console.log(data);
                // console.log( getAllNodes() );
                // console.log( JSON.stringify(getAllNodes() ));
                // console.log('node selected = ' + JSON.stringify(event) + '; data = ' + JSON.stringify(data.dataId));
            });

        },error: function () {
            
        }
    });
}

function initDisable() 
{
    document.getElementById('Listpayor').style.pointerEvents = 'none';
    document.getElementById('Listcorporate').style.pointerEvents = 'none';
    document.getElementById('Listcoverage').style.pointerEvents = 'none';
    document.getElementById('Listmasterstatus').style.pointerEvents = 'none';
    document.getElementById('Listclaimtypemaster').style.pointerEvents = 'none';
    document.getElementById('betweenDate').style.pointerEvents = 'none';
    document.getElementById('unsignedDate').style.pointerEvents = 'none';
    document.getElementById('unsignedString').style.pointerEvents = 'none';
    document.getElementById('unsignedInteger').style.pointerEvents = 'none';   
}



function alertNotif(type, message) {
    new PNotify({
        title: type,
       // type: 'info',
        text: message,
        nonblock: {
            nonblock: true
        },
        styling: 'bootstrap3',
       // addclass: 'dark'
    });
}
var _resCorpStat,_resPayorStat,_resIsDateStat, _resBetweenStat, _resCoverageStat, _resPlanCodeStat, _ResClaimStatusStat, _ResClaimTypeStat, _ResAritMathicStat;
var enablePayor;
var enableIsDate;
var enableBetween;
var enableCoverage;
var enablePlanCode;
var enableClaimStatus;
var enableClaimType;
var enableAritMathics;
var statCorp = function(sVal) {
    return new Boolean(sVal);
};

var statPayor = function(sVal) {
    return new Boolean(sVal);
};

var statIsDate = function(sVal) {
    return new Boolean(sVal);
};

var statBetween = function(sVal) {
    return new Boolean(sVal);
};

var statCoverage = function(sVal) {
    return new Boolean(sVal);
};

var statPlanCode = function(sVal) {
    return new Boolean(sVal);
};

var statClaimStatus = function(sVal) {
    return new Boolean(sVal);
};

var statClaimType = function(sVal) {
    return new Boolean(sVal);
};

var statMath = function(sVal) {
    return new Boolean(sVal);
};


function ParameterSet(paramName) {
    console.log(paramName);
    if(paramName == "BETWEENDATE") {
        document.getElementById('betweenDate').style.pointerEvents = 'auto';
        enableBetween = true;
        _resBetweenStat = statBetween(true);
    } else  {
        // document.getElementById('betweenDate').style.pointerEvents = 'none';
        enableBetween = false;
        _resBetweenStat = statBetween(false);
    }

    if(paramName == "ISDATE") {
        document.getElementById('unsignedDate').style.pointerEvents = 'auto';
        enableIsDate = true;
        _resIsDateStat = statIsDate(true);
    } else {
        // document.getElementById('unsignedDate').style.pointerEvents = 'none';
        enableIsDate = false;
        _resIsDateStat = statIsDate(false);
    }

    if(paramName == "PAYOR") {
        document.getElementById('Listpayor').style.pointerEvents = 'auto';
        _resPayorStat = statPayor(true);
    } else {
        // document.getElementById('Listpayor').style.pointerEvents = 'none';
        _resPayorStat = statPayor(false);
    }

    if(paramName == "CORPORATE" || paramName == "CORPCODE") {
        document.getElementById('Listcorporate').style.pointerEvents = 'auto';
        enableCorporate = true;
        _resCorpStat = statCorp(true);
        enableCorporate = statCorp(true);
        // console.log(enableCorporate);

    } else {
        // document.getElementById('Listcorporate').style.pointerEvents = 'none';
        enableCorporate = false;
        enableCorporate = statCorp(false);
    }

    // if(paramName == "CORPCODE") {
    //     document.getElementById('Listcorporate').style.pointerEvents = 'auto';
    // }

    if(paramName == "CLAIMTYPE") {
        document.getElementById('Listclaimtypemaster').style.pointerEvents = 'auto';
        enableClaimType = true;
        _ResClaimTypeStat = statClaimType(true);
    } else {
        // document.getElementById('Listclaimtypemaster').style.pointerEvents = 'none';
        enableClaimType = false;
        _ResClaimTypeStat = statClaimType(false);
    }

    if(paramName == "CLAIMSSTATUS") {
        document.getElementById('Listmasterstatus').style.pointerEvents = 'auto';
        enableClaimStatus = true;
        _ResClaimStatusStat = statClaimStatus(true);
    } else {
        // document.getElementById('Listmasterstatus').style.pointerEvents = 'none';
        enableClaimStatus = false
        _ResClaimStatusStat = statClaimStatus(false);
    }

    if(paramName == "COVERAGE") {
        document.getElementById('Listcoverage').style.pointerEvents = 'auto';
        enableCoverage = true;
        _resCoverageStat = statCoverage(true);
        console.log(_resCoverageStat);
    } else {
        // document.getElementById('Listcoverage').style.pointerEvents = 'none';
        enableCoverage = false;
        _resCoverageStat = statCoverage(false);
    }

    if(paramName == "ARITCMATICS") {
        // document.getElementById('unsignedString').style.pointerEvents = 'auto';
        document.getElementById('unsignedInteger').style.pointerEvents = 'auto';
        enableAritMathics = true;
        _ResAritMathicStat = statMath(true);
    } else {
        // document.getElementById('unsignedInteger').style.pointerEvents = 'none';
        enableAritMathics = false;
        _ResAritMathicStat = statMath(false);
    }

    if(paramName == "PLANCODE") {
        document.getElementById('unsignedString').style.pointerEvents = 'auto';
        enablePlanCode = true;
        _resPlanCodeStat = statPlanCode(true);
    } else {
        // document.getElementById('unsignedString').style.pointerEvents = 'none';
        enablePlanCode = false;
        _resPlanCodeStat = statPlanCode(false);
    }
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
                
                var _count = 0;
                $.each(data['data'], function(key,result) {
                    addTabDynamicly(result.QUERY_NAME,result.NO_ID,_count++);
                    
                    const strQuery = result.QUERY_EXECUTED;

                    var myRegexp = "@::(.*?)::(.*?)::";

                    var matches = strQuery.matchAll(myRegexp);
                    
                    initDisable();
                    for (const match of matches) {
                        // console.log(match[1]);
                        ParameterSet(match[1]);
                        
                    }

               
                });
            }
           
        },error: function () {
            
        }
    })
}



$("#btnExportExcel").on("click", function() {
    var countTable = $("#tab-content").find('table').length;
    if(countTable == 0 || countTable === "undefined") {
        alertNotif("Warning","table not found !");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    if(document.getElementById('chkMultiple').checked) {
        
        // console.log($("#tab-content table"));
        // // doExport($("#tab-content").find('table'), {type: 'excel', mso: {fileFormat: 'xlsx'}});
        // var options = {
        //     //ignoreRow: [1,11,12,-2],
        //     //ignoreColumn: [0,-1],
        //     //pdfmake: {enabled: true},
        //     //onBeforeSaveToFile: DoOnBeforeSaveToFile,
        //     //onAfterSaveToFile: DoOnAfterSaveToFile,
      
        //     tableName: 'Table name'
        // };
      
        //   jQuery.extend(true, options, {fileName:nameFile,type: 'excel', mso: {fileFormat: 'xlsx'}});
      
        //   $("#tab-content").tableExport(options);
        var idTbl = [];
        var nameTab = [];
        var z = 0;
        $("#tab-content table").each(function(){
            console.log($(this).attr("id"));
            z++;
            var tabName = "tab - " + z;

            idTbl.push($(this).attr("id"));

            nameTab.push(tabName);
        });

        
        tablesToExcel(idTbl, nameTab, nameFile + '.xls', 'Excel');
    } else {
        $("#tab-content table").each(function(){
            var idTbl = [];
            
            var z = 0;
            
            var nameTab = [];

            idTbl.push($(this).attr("id"));
            
            var tabName = "tab - " + z;

            nameTab.push(tabName);

            tablesToExcel(idTbl, nameTab, nameFile + '.xls', 'Excel');
        });
    }

   
});

$("#btnExportCSV").on("click", function() {
   
    var countTable = $("#tab-content").find('table').length;
    if(countTable == 0 || countTable === "undefined") {
        alertNotif("Warning","table not found !");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    $("#tab-content table").each(function(){
        var idTable = $(this).attr('id');
        doExport('#' + idTable, {fileName:nameFile,type: 'csv',htmlHyperlink: 'href',
                                                                   numbers: {html: {decimalMark: '.',
                                                                                    thousandsSeparator: ','},
                                                                             output: {decimalMark: ',',
                                                                                      thousandsSeparator: ''}}
                                                      });
        // tableExport(idTable, 'test','csv');
    });
    // console.log($("#tab-content").find('table').attr('id'));
});

$("#btnExportText").on("click", function() {
   
    var countTable = $("#tab-content").find('table').length;
    if(countTable == 0 || countTable === "undefined") {
        alertNotif("Warning","table not found !");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    $("#tab-content table").each(function(){
        var idTable = $(this).attr('id');
        doExport('#' + idTable, {fileName:nameFile,type: 'txt'});
        // tableExport(idTable, 'test','txt');
    });
    // console.log($("#tab-content").find('table').attr('id'));
});

$("#btnExportXml").on("click", function() {
    var countTable = $("#tab-content").find('table').length;
    if(countTable == 0 || countTable === "undefined") {
        alertNotif("Warning","table not found !");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    $("#tab-content table").each(function(){
        var idTable = $(this).attr('id');
        // tableExport(idTable, 'test','xml');\
        
        doExport('#' + idTable, {fileName:nameFile,type: 'xml'});
    });
});






$("#btnExecute").on('click', function() {
    if(idQuery == "")
    {
        // alert(idQuery);
        new PNotify({
            title: 'Warning',
           // type: 'info',
            text: 'Please select report first.',
            nonblock: {
                nonblock: true
            },
            styling: 'bootstrap3',
           // addclass: 'dark'
        });

        return;
    }
    var arrOfValue = {};
    //start to validation before push data
    arrOfValue['key_menus'] = idQuery;
    if(document.getElementById('betweenDate').style.pointerEvents == 'auto') {
        if($("#calFrom").val() == ""){
            alertNotif("Warning","Date from cannot empty !");
            return;
        }

        if($("#calTo").val() == "") {
            alertNotif("Warning","Date to cannot empty !");
            return;
        }

        arrOfValue['from'] = $("#calFrom").val();
        arrOfValue['to'] = $("#calTo").val();
    }
    // if(_resBetweenStat == true) {
    //     if($("#calFrom").val() == ""){
    //         alertNotif("wWrniWarningng","Date from cannot empty !");
    //         return;
    //     }

    //     if($("#calTo").val() == "") {
    //         alertNotif("Warning","Date to cannot empty !");
    //         return;
    //     }

    //     arrOfValue['from'] = $("#calFrom").val();
    //     arrOfValue['to'] = $("#calTo").val();
    // }
    if(document.getElementById('unsignedDate').style.pointerEvents == 'auto') {
        if($("#calFrom").val() == ""){
            alertNotif("Warning","Date from cannot empty !");
            return;
        }

        if($("#calTo").val() == "") {
            alertNotif("Warning","Date to cannot empty !");
            return;
        }

        arrOfValue['from'] = $("#calFrom").val();
        arrOfValue['to'] = $("#calTo").val();
    }
    
    // if(_resIsDateStat == true) {
    //     if($("#cmbUnsigned option:selected").val() == "") {
    //         alertNotif("Warning","Opration date cannot empty !");
    //         return;
    //     }

    //     if($("#unsignedCal").val() == "") {
    //         alertNotif("Warning","Date cannot empty !");
    //         return;
    //     }
    //     arrOfValue['is_date_function'] = $("#cmbUnsigned option:selected").val();
    //     arrOfValue['is_date'] = $("#unsignedCal").val();
    // }
    if(document.getElementById('Listpayor').style.pointerEvents == 'auto'){
        if(arrPayor.length === 0) {
            alertNotif("Warning","select payor !");
            return;
        }

        arrOfValue['payor'] =arrPayor;
    }

    // if(_resPayorStat == true){
    //     if(arrPayor.length === 0) {
    //         alertNotif("Warning","select payor !");
    //         return;
    //     }

    //     arrOfValue['payor'] =arrPayor;
    // }

    if(_resCorpStat == true){
        if(arrCorp.length === 0) {
            alertNotif("Warning","select payor !");
            return;
        }
        arrOfValue['corporate'] = arrCorp;
    }
    
    if(document.getElementById('Listclaimtypemaster').style.pointerEvents == 'auto') {
        if(arrClaimType.length === 0) {
            alertNotif("Warning","select claim type !");
            return;
        }
        arrOfValue['claims_type'] = arrClaimType;
    }
    // if(_ResClaimTypeStat == true) {
    //     if(arrClaimType.length === 0) {
    //         alertNotif("Warning","select claim type !");
    //         return;
    //     }
    //     arrOfValue['claims_type'] = arrClaimType;
    // }
    if(document.getElementById('Listmasterstatus').style.pointerEvents == 'auto') {
        if(arrClaimType.length === 0) {
            alertNotif("Warning","select claim status !");
            return;
        }
        arrOfValue['claims_status'] = arrClaimStatus;
    }

    // if(_ResClaimStatusStat == true) {
    //     if(arrClaimType.length === 0) {
    //         alertNotif("Warning","select claim status !");
    //         return;
    //     }
    //     arrOfValue['claims_status'] = arrClaimType;
    // }
    // console.log(_resCoverageStat);
    if(document.getElementById('Listcoverage').style.pointerEvents == 'auto')
    {
        if(arrCov.length === 0) {
            alertNotif("Warning","select coverage type !");
            return;
        }
        arrOfValue['coverage'] = arrCov;
    }
    // if(_resCoverageStat == true) {
    //     if(arrCov.length === 0) {
    //         alertNotif("Warning","select claim type !");
    //         return;
    //     }
    //     arrOfValue['coverage'] = arrCov;
    // }
    if(document.getElementById('unsignedInteger').style.pointerEvents == 'auto') {
        if($("#cmbUnsignedInteger option:selected").val() == "") {
            alertNotif("Warning","Opration Mathics cannot empty !");
            return;
        }

        if($("#txtUnsignedInteger").val() == "") {
            alertNotif("Warning","value of Matchis cannot empty");
            return;
        }

        arrOfValue['math_operator'] = $("#cmbUnsignedInteger option:selected").val();
        arrOfValue['value_match'] = $("#txtUnsignedInteger").val();
        
    }

    // if(_ResAritMathicStat == true) {
    //     if($("#cmbUnsignedInteger option:selected").val() == "") {
    //         alertNotif("Warning","Opration Mathics cannot empty !");
    //         return;
    //     }

    //     if($("#txtUnsignedInteger").val() == "") {
    //         alertNotif("Warning","value of Matchis cannot empty");
    //         return;
    //     }

    //     arrOfValue['math_operator'] = $("#cmbUnsignedInteger option:selected").val();
    //     arrOfValue['value_match'] = $("#txtUnsignedInteger").val();
        
    // }
    if(document.getElementById('unsignedString').style.pointerEvents == 'auto') {
       
        if($("#txtUnsignedString").val() == "") {
            alertNotif("Warning","value of Plan cannot empty");
            return;
        }

        arrOfValue['plancode'] = $("#txtUnsignedString").val();
        
    }
    // if(_resPlanCodeStat == true) {
       
    //     if($("#txtUnsignedString").val() == "") {
    //         alertNotif("Warning","value of Plan cannot empty");
    //         return;
    //     }

    //     arrOfValue['plancode'] = $("#txtUnsignedString").val();
        
    // }
    var dataJSON = JSON.stringify(arrOfValue);

	// console.log(dataJSON);
    //end here

    //start to collecting data
    var perfixTable = "listof";
    $.ajax({
        type: "POST",
        dataType: "JSON",
        headers:  {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/go_execute",
        data : dataJSON,
        crossDomain: true,
        start_time: new Date().getTime(),
        beforeSend: function(html){
            $('#myPleaseWait').modal('show');
        },success: function(data){
            validate(data);
            for(j=0; j < data['query_name'].length; j++)
            {
                var tbl_body = "";
                var HeadKeys = "";
                var checkboxField = "";
                var arrayToogle = [];
                var queryName = data['query_name'][j];
                $.each(data['data'][queryName], function(){   
                    var tbl_row = "";  
                    HeadKeys = '<tr></tr>';
                    $.each(this, function(k,v){
                        
                        tbl_row += "<td class='" + queryName + k + "'>"+blankForNull(v)+"</td>";
                        // console.log( k +' : '+ v );
                        
                        HeadKeys += '<th id="' + queryName + k + '_head">' + k + '</th>';

                        if (arrayToogle.indexOf(k) === -1) {
                            arrayToogle.push(k);
                        }
                        
                        
                    });
                    tbl_body += "<tr>"+tbl_row+"</tr>";  
                });
                for (let i = 0; i < arrayToogle.length; i++) {
                    if(i % 2 == 0) {
                        checkboxField += '<div class="col-md-6"><input type="checkbox" onclick="hideShowColumn(this.id);" id="' + queryName + arrayToogle[i] + '" checked="checked" /><b> '+arrayToogle[i]+'</b><br/></div>';
                    } else {
                        checkboxField += '<div class="col-md-6"><input type="checkbox" onclick="hideShowColumn(this.id);" id="' + queryName + arrayToogle[i] + '" checked="checked" /><b> '+arrayToogle[i]+'</b></div>';
                    }
                }
                $("#toogleGroup" + queryName).html(checkboxField);
                $("#listof" + queryName + " tbody").empty();
                $("#listof" + queryName + " tbody").html(HeadKeys + tbl_body);
                
                
            }
            var resultTime =(new Date().getTime() - this.start_time); //+ 'ms';
           
            $("#resultTime").html("Time result : " +  msConversion(resultTime));
            // alert('This request took '+(new Date().getTime() - this.start_time)+' ms');
            $('#myPleaseWait').modal('hide');
            
        },error: function (xhr, status, errorThrown) {
            // alert(xhr.status);
            alertNotif("Warning","Warning",xhr.responseText);
            
            $("#myPleaseWait").modal('hide');
        }
    })

});

function msConversion(millis) {
    console.log(millis);
    let sec = Math.floor(millis / 1000);
    let hrs = Math.floor(sec / 3600);
    sec -= hrs * 3600;
    let min = Math.floor(sec / 60);
    sec -= min * 60;
  
    sec = '' + sec;
    sec = ('00' + sec).substring(sec.length);
  
    if (hrs > 0) {
      min = '' + min;
      min = ('00' + min).substring(min.length);
      return hrs + ":" + min + ":" + sec;
    }
    else {
      return min + ":" + sec;
    }
  }

// $(document).on('change', 'table thead input', function() {
//     var checked = $(this).is(":checked");

//     var index = $(this).parent().index();
//         $('table tbody tr').each(function() {
//             if(checked) {
//                 $(this).find("td").eq(index).show();   
//             } else {
//                 $(this).find("td").eq(index).hide();   
//             }
//         });
// });

function hideShowColumn(col_name) {
    var checkbox_val=document.getElementById(col_name).checked;
    if(checkbox_val===false)
    {
        var all_col=document.getElementsByClassName(col_name);
        for(var i=0;i<all_col.length;i++)
        {
            all_col[i].style.display="none";
        }
        document.getElementById(col_name+"_head").style.display="none";
        // document.getElementById(col_name).value="show";
    }
        
    else
    {
        var all_col=document.getElementsByClassName(col_name);
        for(var i=0;i<all_col.length;i++)
        {
            all_col[i].style.display="table-cell";
        }
        document.getElementById(col_name+"_head").style.display="table-cell";
        // document.getElementById(col_name).value="hide";
    }
}


function blankForNull(s) {
    return s === "null" ? "" : s;
}

function selectNodeById(id){
    var treeViewObject = $('#tree').data('treeview'),
    allCollapsedNodes = treeViewObject.getCollapsed(),
    allExpandedNodes = treeViewObject.getExpanded(),
    allNodes = allCollapsedNodes.concat(allExpandedNodes);
    for (var i = 0; i < allNodes.length; i++) {
        if (allNodes[i].id != id) continue;
        treeViewObject.selectNode(allNodes[i].nodeId);
    }
}

function getAllNodes(){
    var treeViewObject = $('#treeview12').data('treeview'),
        allCollapsedNodes = treeViewObject.getCollapsed(),
        allExpandedNodes = treeViewObject.getExpanded(),
        allNodes = allCollapsedNodes.concat(allExpandedNodes);

    return allNodes;
}


function CheckBoxMenuReport(MenuID)
{
    return '<input type="checkbox" name="checkMenuID" class="flat" onclick="LoadQuery(\' ' + MenuID + ' \');"  id="checkMenuID" value="' + MenuID + '">';
	//}
    //return '<input type="checkbox" name="checkPayorCode" class="flat" id="checkPayorCode" value="' + PayorCode + ">';
}



function LoadQuery(MenuID)
{
    //for load query from API

    console.log(MenuID);
    //end here
}


  
  

function CheckBoxPayorValue(PayorCode)
{
    // arrPayor
    
    return '<input type="checkbox" name="checkPayorCode" onclick="checkCorp(\'' + PayorCode + '\');"  class="flat" id="checkPayorCode" value="' + PayorCode + '">';
	//}
    //return '<input type="checkbox" name="checkPayorCode" class="flat" id="checkPayorCode" value="' + PayorCode + ">';
}

function CheckBoxCorporateValue(CorpCode)
{
    return '<input type="checkbox" name="checkCorpCode" class="flat" id="checkCorpCode" onclick="addCorp(\'' + CorpCode + '\');" value="' + CorpCode + '">';
	
}

function CheckBoxCoverageMaster(CoverageCode)
{
    return '<input type="checkbox" name="checkCoverage" class="flat" onclick="addCoverage(\'' + CoverageCode.trim() + '\');" id="checkCoverage" value="' + CoverageCode.trim() + '">';
	
}

function CheckBoxStatusMaster(ClaimsStatus)
{
    return '<input type="checkbox" name="checkStatusMaster" class="flat" id="checkStatusMaster" onclick="addClaimsStatus(\'' + ClaimsStatus + '\');" value="' + ClaimsStatus + '">';
	
}

function addClaimType(valClaimType) {
    // console.log(valClaimType);

    var idx = $.inArray(valClaimType, arrClaimType);
    if (idx == -1) {
        arrClaimType.push(valClaimType);
    } else {
        arrClaimType.splice(idx, 1);
    }
    console.log(arrClaimType);
}

function addClaimsStatus(ClaimsStatus) {
    var idx = $.inArray(ClaimsStatus, arrClaimStatus);
    if (idx == -1) {
        arrClaimStatus.push(ClaimsStatus);
    } else {
        arrClaimStatus.splice(idx, 1);
    }
    console.log(arrClaimStatus);
}

function addCoverage(CoverageCode) {
    var idCOv = $.inArray(CoverageCode, arrCov);
    if (idCOv == -1) {
        arrCov.push(CoverageCode);
    } else {
        arrCov.splice(idCOv, 1);
    }
    console.log(arrCov);
}

function addCorp(CorpCode) {
    
    var idx = $.inArray(CorpCode, arrCorp);
    if (idx == -1) {
        arrCorp.push(CorpCode);
    } else {
        arrCorp.splice(idx, 1);
    }
    console.log(arrCorp);
}

function checkCorp(PayorCode)
{
    // console.log(_resCorpStat);
    
    var idx = $.inArray(PayorCode, arrPayor);
    if (idx == -1) {
        arrPayor.push(PayorCode);
    } else {
        arrPayor.splice(idx, 1);
    }
    // console.log(arrPayor);
    // console.log(enableCorporate);
    if(_resCorpStat == true) {
        dataPayorCode = {};

        

        var url_list_corporate = api_link + "api/get_corporate";

        list_of_corporate = $('#list_of_corporate').DataTable( {
            processing:true,
            "ajax": {
                "url": url_list_corporate,
                "headers" : {"Authorization": "Bearer " + localStorage.getItem('token')},
                "crossDomain": true,
                beforeSend: function (request) {
                    $('#list_of_corporate').css("opacity","0.3");
                },
                "data" : function(d) {
                    return JSON.stringify({"payor_code" : arrPayor});
                },
                "type": "POST",
                timeout: 10000,
                error: function(jqXHR, textStatus){
                    if(textStatus === 'timeout')
                    {   new PNotify({
                            title: 'Warning',
                        // type: 'info',
                            text: 'Respon terlalu lama, silahkan refresh beberapa saat lagi.',
                            nonblock: {
                                nonblock: true
                            },
                            styling: 'bootstrap3',
                        // addclass: 'dark'
                        });
                        //alert('Respon terlalu lama, silahkan refresh beberapa saat lagi.'); 
                        $('#list_of_corporate').css("opacity","1");  
                        $("#list_of_corporate").hide();     
                        //do something. Try again perhaps?
                    }
                },
            },
            "scrollY": true,
            scrollCollapse: true,
            paging: true,
            searching: true,
            destroy: true,
            "ordering": true,
            "pageLength": 10,
            "createdRow": function ( row, data, index ) {
                
                // // data
                $('td', row).eq(0).html(CheckBoxCorporateValue(data[1]));

                
            },
            
            "displayLength": 1000,
            "initComplete": function( settings ) {
                //alert( 'DataTables has redrawn the table' );
            }
            // "fnDrawCallback":function(oSettings)
            // {
            //     $("#projectsTable input[type=radio][value!="+selection+"]").prop('checked', false);
            // }
        }).on( 'draw', function () {
            $('#list_of_corporate').css("opacity","1");
            $('[data-toggle="popover"]').popover({html:true});
            
            // if(list_of_payor_code!=null)
            // {
            //     // list_of_payor_code.ajax.reload();
            // }
        
            
            
        });

        
        return true;
    }
    

    
    // alert(PayorCode);
    // console.log(PayorCode);
}

var button='<button class="close" type="button" title="Remove this page">×</button>';
var tabID = 1;

function removeTab() {
    $("#tab-list").html("");
    $("#tab-content").html("");
}

function addTabDynamicly(headerName,idTab,count)
{
    var setActive = '';
    var setActiveBody = '';
    if(count == 0) {
        setActive = 'class="active"';
        setActiveBody = 'in active';
    }
    var tablesData = "";
    var toogleGroup = "";
    toogleGroup = '<div class="panel panel-default"><div class="panel-heading"><div class="panel-title pull-left">Toggle field table</div><div class="panel-title pull-right" onclick="toggleShowHide(\'panelBody' + headerName + '\');"><span id="minHide' + headerName + '" class="fa fa-minus"></span></div><div class="clearfix"></div></div><div id="panelBody'+ headerName +'" class="panel-body"><div id="toogleGroup' + headerName + '"></div></div></div>';
    tablesData = '<div class="table-responsive">' + toogleGroup + '<table id="listof' + headerName + '" class="table table-bordered" cellspacing="0" width="100%"><tbody></tbody></table></div>';
    $('#tab-list').append($('<li '+ setActive +'><a href="#tab' + idTab + '" role="tab" data-toggle="tab"><span>Tab ' + headerName + '</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span></a></li>'));
    $('#tab-content').append($('<div class="tab-pane fade '+ setActiveBody + '" id="tab' + idTab + '"> ' + tablesData + '</div>'));
    
}

function toggleShowHide(idElem) {
    console.log(idElem);
    $("#" + idElem).toggle();
}


function addTab(countExecute)
{
    
    for(i=0;i<countExecute;i++)
    {
        //create the table datatables for blablabla

        
        $('#tab-list').append($('<li><a href="#tab' + i + '" role="tab" data-toggle="tab"><span>Tab ' + i + '</span> <span class="glyphicon glyphicon-pencil text-muted edit"></span></a></li>'));
        $('#tab-content').append($('<div class="tab-pane fade" id="tab' + i + '">Tab ' + i + ' content</div>'));
        
    }
}

function checkCoverageMaster()
{
    
    var url_list_corporate = api_link + "/api/get_coverage";

    list_of_coverage = $('#list_of_coverage').DataTable( {
        processing:true,
        "ajax": {
            "url": url_list_corporate,
            "headers" : {"Authorization": "Bearer " + localStorage.getItem('token')},
            "crossDomain": true,
            beforeSend: function (request) {
                $('#list_of_coverage').css("opacity","0.3");
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
                     $('#list_of_coverage').css("opacity","1");  
                     $("#list_of_coverage").hide();     
                    //do something. Try again perhaps?
                }
            },
        },
        scrollCollapse: true,
        paging: true,
        searching: true,
        destroy: true,
        "ordering": true,
        "pageLength": 10,
        "createdRow": function ( row, data, index ) {
            
            // // data
            $('td', row).eq(0).html(CheckBoxCoverageMaster(data[1]));

            
        },
        "displayLength": 1000,
        "initComplete": function( settings ) {
            
            //alert( 'DataTables has redrawn the table' );
        }
    }).on( 'draw', function () {
        $('#list_of_coverage').css("opacity","1");
        $('[data-toggle="popover"]').popover({html:true});

        // if(list_of_payor_code!=null)
        // {
        //     // list_of_payor_code.ajax.reload();
        // }
        if(list_of_claims_status==null)
        {
            checkStatusMaster();
            // list_of_payor_code.ajax.reload();
        }
        else
        {
            list_of_claims_status.ajax.reload();
        }
        
        
    });
    return true;
    // alert(PayorCode);
    // console.log(PayorCode);
}

function checkStatusMaster()
{
    
    var url_list_corporate = api_link + "api/get_status_master";

    list_of_claims_status = $('#list_of_claims_status').DataTable( {
        processing:true,
        "ajax": {
            "url": url_list_corporate,
            "headers" : {"Authorization": "Bearer " + localStorage.getItem('token')},
            "crossDomain": true,
            beforeSend: function (request) {
                $('#list_of_claims_status').css("opacity","0.3");
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
                     $('#list_of_claims_status').css("opacity","1");  
                     $("#list_of_claims_status").hide();     
                    //do something. Try again perhaps?
                }
            },
        },
        scrollCollapse: true,
        paging: true,
        searching: true,
        destroy: true,
        "ordering": true,
        "pageLength": 10,
        "createdRow": function ( row, data, index ) {
            
            // // data
            $('td', row).eq(0).html(CheckBoxStatusMaster(data[1]));

            
        },
        "displayLength": 1000,
        "initComplete": function( settings ) {
            //alert( 'DataTables has redrawn the table' );
        }
    }).on( 'draw', function () {
        $('#list_of_claims_status').css("opacity","1");
        $('[data-toggle="popover"]').popover({html:true});

        
       
        
        
    });
    return true;
    // alert(PayorCode);
    // console.log(PayorCode);
}
//600000

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

function doExport(selector, params) {
    var options = {
      //ignoreRow: [1,11,12,-2],
      //ignoreColumn: [0,-1],
      //pdfmake: {enabled: true},
      //onBeforeSaveToFile: DoOnBeforeSaveToFile,
      //onAfterSaveToFile: DoOnAfterSaveToFile,

      tableName: 'Table name'
    };

    jQuery.extend(true, options, params);

    $(selector).tableExport(options);
  }

  function DoOnBeforeSaveToFile (data, fileName, type, charset, encoding) {
    alert ( "onBeforeSaveToFile: " + fileName );
  }

  function DoOnAfterSaveToFile (data, fileName, type, charset, encoding) {
    alert ( "onAfterSaveToFile: " + fileName );
  }

  /**
   * @return {string}
   */
  function DoOnCellHtmlData(cell, row, col, data) {
    var result = "";
    if (data !== "") {
      var html = $.parseHTML( data );

      $.each( html, function() {
        if ( typeof $(this).html() === 'undefined' )
          result += $(this).text();
        else if ( $(this).is("input") )
          result += $('#'+$(this).attr('id')).val();
        else if ( $(this).is("select") )
          result += $('#'+$(this).attr('id')+" option:selected").text();
        else if ( $(this).hasClass('no_export') !== true )
          result += $(this).html();
      });
    }
    return result;
  }

  /**
   * @return {string}
   */
  function DoOnCsvCellData(cell, row, col, data) {
    var result = data;
    if (result !== "" && row > 0 && col === 0) {
      result = "\x1F" + data;
    }
    else if (result !== "" && row > 0 && col === 2) {
      //result = "\x1F" + data;
    }
    return result;
  }

  /**
   * @return {number}
   */
  function DoOnXlsxCellData(cell, row, col, data) {
    var result = data;
    if (result !== "" && (row < 1 || col !== 0)) {
      if ( result === +result )
        result = +result;
    }
    return result;
  }

  /**
   * @return {string}
   */
  function DoOnMsoNumberFormat(cell, row, col) {
    var result = "";
    if (row > 0 && col === 0)
      result = "\\@";
    else if (row > 0 && col === 2)
      result = "0"; // #issue 327: Preserve long numbers
    return result;
  }


  var tablesToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
      + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
      + '<Styles>'
      + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
      + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
      + '</Styles>' 
      + '{worksheets}</Workbook>'
    , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
    , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(tables, wsnames, wbname, appname) {
      var ctx = "";
      var workbookXML = "";
      var worksheetsXML = "";
      var rowsXML = "";

      for (var i = 0; i < tables.length; i++) {
        if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
        for (var j = 0; j < tables[i].rows.length; j++) {
          rowsXML += '<Row>'
          for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
            var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
            var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
            var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
            dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
            var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
            dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
            ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
                   , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
                   , data: (dataFormula)?'':dataValue
                   , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                  };
            rowsXML += format(tmplCellXML, ctx);
          }
          rowsXML += '</Row>'
        }
        ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = "";
      }

      ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
      workbookXML = format(tmplWorkbookXML, ctx);


      var link = document.createElement("A");
      link.href = uri + base64(workbookXML);
      link.download = wbname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  })();

function isNull(obj, key) {
	return (obj[key] == null || obj[key] === undefined || obj[key] === "null");
}

function validate(obj) {
	var objKeys = Object.keys(obj);
  objKeys.forEach((key) => {
  	if(isNull(obj, key)) {
    	obj[key] = "";
    }
    if(typeof(obj[key]) == "object") {
    	validate(obj[key]);
    }
  });
}
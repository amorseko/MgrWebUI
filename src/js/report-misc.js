var api_link =  "http://localhost:9090/REST-Api-with-Slim-PHP/public/";
var list_result_execute;
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

$("#btnExecute").on("click", function() {
    var dataPush = {};
    // var columns = [];
    if($("#txtQuery").val() == "") {
        alertNotif("Warning","Warning","Please fill text query before you execute query !")
        return;
    }
    dataPush['query'] = $("#txtQuery").val();
    dataPush['db_type'] = "STDBY";
    
    var columns = [];


    $.ajax({
        method:"POST",
        headers : {"Authorization": "Bearer " + localStorage.getItem('token')},
        url: api_link + "api/go_execute_misc",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data:JSON.stringify(dataPush), 
        beforeSend: function() {
            $("#myPleaseWait").modal('show');
        },
        success: function (data) {
           
            // Add some Render transformations to Columns
            // Not a good practice to add any of this in API/ Json side
           
            columnNames = Object.keys(data.data[0]);
            for (var i in columnNames) {
                columns.push({data: columnNames[i], 
                        title: capitalizeFirstLetter(columnNames[i])});
            }

            console.log(columns);

            list_result_execute = $('#dtResult').DataTable( {
                "data":data.data,
                "scrollY": true,
                scrollCollapse: true,
                paging: true,
                searching: true,
                destroy: true,
                columns: columns,
                "ordering": true,
                "pageLength": 10,
                "createdRow": function ( row, data, index ) {
                    
                    
                },
                "displayLength": 1000,
                "initComplete": function( settings ) {
                }
           
            }).on( 'draw', function () {
                $('#dtResult').css("opacity","1");
                $('[data-toggle="popover"]').popover({html:true});
                
                
            });
            
            $("#myPleaseWait").modal('hide');
        
        
        }, error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alertNotif("Warning", "Warning", msg);
            
            $("#myPleaseWait").modal('show');
        }
      });
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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


$("#btnExportExcel").on("click", function() {

    
    if(list_result_execute === undefined) {
        
        alertNotif("Warning", "Warning", "Please execute your report before export");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    tablesToExcel(['dtResult'], ['tab result'], nameFile + '.xls', 'Excel');


   
});


$("#btnExportCSV").on("click", function() {
   
    if(list_result_execute === undefined) {
        
        alertNotif("Warning", "Warning", "Please execute your report before export");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    doExport('#dtResult', {fileName:nameFile,type: 'csv',htmlHyperlink: 'href',
                                                                   numbers: {html: {decimalMark: '.',
                                                                                    thousandsSeparator: ','},
                                                                             output: {decimalMark: ',',
                                                                                      thousandsSeparator: ''}}
            });
});

$("#btnExportText").on("click", function() {
   
    if(list_result_execute === undefined) {
        
        alertNotif("Warning", "Warning", "Please execute your report before export");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

    
    doExport('#dtResult', {fileName:nameFile,type: 'txt'}); tableExport(idTable, 'test','txt');
    // console.log($("#tab-content").find('table').attr('id'));
});

$("#btnExportXml").on("click", function() {
    if(list_result_execute === undefined) {
        
        alertNotif("Warning", "Warning", "Please execute your report before export");
        return;
    }

    var currentdate = new Date(); 
    var nameFile = "Export_File " + currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
    
    doExport('#dtResult', {fileName:nameFile,type: 'xml'});
});
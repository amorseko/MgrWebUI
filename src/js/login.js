var api_link = "http://localhost:9090/REST-Api-with-Slim-PHP/public/";

// function onCheckLogin()
// {
//     var now = new Date().toISOString().slice(0,10);

//     var date_login;

//     if (localStorage.getItem("flag_active") != null) {
//         // window.location=('menu');
//     }

//     if (localStorage.getItem('time_login') != null) {
//         date_login = localStorage.getItem('time_login');
        
//         var dateDiff = CompareDate(date_login,now);
    
//         if(dateDiff >= 3)
//         {
//             localStorage.clear();
//             // window.location=("login");
//         }
//     }
    
// }

function onCheckLogin() {
    // var startTime = new Date('2021/7/16 09:00:00'); 
    // var endTime = new Date('2021/7/16 10:00:00');
    // var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    // var resultInMinutes = Math.round(difference / 60000);
    // console.log(resultInMinutes);

    // if (localStorage.getItem("flag_active") != null) {
    //     window.location=('menu');
    // }

    if (localStorage.getItem('time_login') != null) {
        var today = new Date();
        var date = today.getFullYear() + '/'+ (today.getMonth()+1) + '/' + today.getDate();
        var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
        date_login = new Date(localStorage.getItem('time_login'));
        var thisDay = new Date(date + " " + time);
        var difference = thisDay.getTime() - date_login.getTime(); // This will give difference in milliseconds
        var resultInMinutes = Math.round(difference / 60000);
        if(resultInMinutes >= 60) {
            localStorage.clear();
            window.location=("login");
            return;
        } else {
            window.location=("menu");
            return;
        }
        // var dateDiff = CompareDate(date_login,now);
        // if(dateDiff >= 3)
        // {
        //     localStorage.clear();
        //     // window.location=("login");
        // }
    }
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

var pswd = document.getElementById("password");

/* Call 'checkPswd' when the 'Enter' key is released. */
pswd.onkeyup = function (e) {
   if (e.which == 13) {
        $("#btnLogin").trigger("click");
   }
};

/* Prevent the form from submitting. */
pswd.parentElement.onsubmit = function () {
   return false;
};

$(document).on('click','#btnLogin', function() {
    var arrayData = {};
    var username = $("#username").val();
    var password = $("#password").val();

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
        headers: { "X-CSRF-TOKEN": $('input[name="_token"]').attr('content') },
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
                $("#notifAlert").show();
                $("#notifAlert").removeClass("alert-success").removeClass("alert-warning").addClass("alert-danger");
                $("#txtAlert").html(data['message']);
            } else {
                if(data['data'].NOID != "")
                {
                    console.log(data['data'].USERNAME);
                    localStorage.setItem('flag_active', 'Y');   
                    localStorage.setItem('lock','N');
                    localStorage.setItem('user_code', username);
                    localStorage.setItem('username', data['data'].USERNAME);
                    // localStorage.setItem('time_login',now);
                    localStorage.setItem('time_login',date + ' ' + time);
                    localStorage.setItem('token',data.token);
                    localStorage.setItem('department', data['data'].DEPARTMENT);
                    window.location=('menu');
                }
            }
           
           
            $('#myPleaseWait').modal('hide');
        },error: function () {
            $('#myPleaseWait').modal('hide');
        }
    });
});
jQuery(function(){

    
    
    //変数の指定
    var watchID = null; //方向
    document.addEventListener("deviceready",onDeviceReady,false);  //cordova読み込みまで待つ
    
    //cordova待ち
    function onDeviceReady(){
        startWatch();
    }
    
    //コンパスのモニタリングを待つ
    function startWatch(){
        
        //3秒ごとにコンパスを更新
        var options = {frenquency:3000};
        
        watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    }
    
    
    //onSuccess 現在地の取得
    function onSuccess(heading){
        var element = document.getElementById("heading");
        var shousuu = Math.floor(heading.magneticHeading);
        element.innerHTML = "Orientation:" + shousuu;
        
        $("#right").css({
           transform : "rotate(" + shousuu + "deg)" 
        });
        $("#left").css({
           transform : "rotate(" + shousuu + "deg)" 
        });
        
            
    }
    
    
    
    //onError エラーの時の動作
    function onError(compassError){
        alert(compassError.code);
    }
    
    
    


});


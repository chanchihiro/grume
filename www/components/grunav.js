jQuery(function(){


    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
        function(position){

    var data = position.coords;
    var lat = data.latitude;
    var lng = data.longitude;
    
    
    
//////最初の導入ページ
    $("#next").on("click",function(){
        $(".first").hide();
        $(".fimg").hide();
        $(".second").show();
        $(".simg").show();
    });
    
    $("#next2").on("click",function(){
        $(".second").hide();
        $(".simg").hide();
        $(".third").show();
        $(".aimg").show();
    });

    $("#main").on("click",function(){
        $(".third").hide();
        $(".aimg").hide();
        $(".one").show();
    });
    
    
////////////////クリックすると///////////////////////////////////////////


    $(".wa").on("click",function(){
        params.freeword = "和";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
        // startWatch();
    });

    $(".you").on("click",function(){
        params.freeword = "洋";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
        // startWatch();
    });

    $(".tyuu").on("click",function(){
        params.freeword = "中";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
        // startWatch();
    });

    $(".ta").on("click",function(){
        params.freeword = "デザート,お菓子,チェーン,";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
        // startWatch();
    });
    
    
    
    $("#last").on("click",function(){
        $(".image,.word,.distance").hide();
        $(".image2,.word2,.distance2").show();
    });
    
    
    
    


//////////ぐるなびAPIを使う///////////////////////////////////////////////////////////////////

    //変数の定義
    //API
    var api_key = "f87f8cdf9c60128cb9a24eaa6719aea0";

    //APIのURL
    var url_rest = "http://api.gnavi.co.jp/RestSearchAPI/20150630/?callback=?";  //レストラン
    var url_eva = "http://api.gnavi.co.jp/PhotoSearchAPI/20150630/?callback=?";  //評価

    //設定
    var params = {
        keyid: api_key,
        format:"json",
        latitude:lat,
        longitude:lng,
        range:1,    
        freeword: "",
    };
    
    //////////// compassの設定////////////
    
    // //コンパスのモニタリングを待つ
    //コンパスのモニタリングを待つ
    // function startWatch(heading){
    //     //3秒ごとにコンパスを更新
    //     var options = {frenquency:3000};
    //     watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    // }
    // 
    // //onSuccess 現在地の取得
    // function onSuccess(heading){
    //     var element = document.getElementById("ori");
    //     var shousuu = Math.floor(heading.magneticHeading);
    //     element.innerHTML = "Orientation:" + shousuu;
    //     
    //     $("#right").css({
    //        transform : "rotate(" + shousuu + "deg)" 
    //     });
    //     $("#left").css({
    //        transform : "rotate(" + shousuu + "deg)" 
    //     });
    //     
    //         
    // }
    // 
    // //onError エラーの時の動作
    // function onError(compassError){
    //     alert(compassError.code);
    // }
///////////////////////////情報の設定/////////////    
    



    var showResult = function(result){
        if(result.total_hit_count > 0){
            alert("運命の出会い！？");
            $.each(result.rest,function(i,item){
                // $(".result").append("<div class='" + "food" + "'>" +
                //  // "<img src='" + item.image_url.shop_image1 + "'>" +  
                //  "<h1>" + item.name + "</h1>"+
                //  // "<p>" + item.latitude + " " + item.longitude + "</p>" +
                //  "<p>" + item.access.walk + "分" + "</p>" +
                //  "<div id='" + "popo" + "'></div>" +
                //  "<div id='" + "pipi" + "'></div>" +
                //  "<div id='" + "map-canvas" + "'></div>" +
                //  "<div id='" + "comment" + "'></div>" +
                //  "<div id='" + "hougaku" + "'></div>" +
    //                 "<div id='" + "toutyaku" + "'>" + "到着したよ" + "</div>" +
                //  "</div>"
                // );
                

                var rendererOptions = {
                    draggable: true,
                    preserveViewport:false
                };
                var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
                var directionsService = new google.maps.DirectionsService();
// 
// 
// 
                //マップの表示
                var canvas = document.getElementById("map-canvas");
                //進む道の表示
                var road = document.getElementById("popo");

                //ぐるなびの店舗の位置を中心にする
                var latlng = new google.maps.LatLng(item.latitude,item.longitude);
                //現在地の位置を取る
                var me = new google.maps.LatLng(lat,lng);

                //二転換の方角をとる
// 
// 
                //canvasにmapOptionsの内容の地図のインスタンスの作成のための変数
                var map;
//                 
//              //店の方角
                var slat = item.latitude;
                var slng = item.longitude;
                var Y = Math.cos(slng * Math.PI / 180) * Math.sin(slat * Math.PI / 180 - lat * Math.PI / 180);
                var X = Math.cos(lng * Math.PI / 180) * Math.sin(slng * Math.PI / 180) - Math.sin(lng * Math.PI / 180) * Math.cos(slng * Math.PI / 180) * Math.cos(slat * Math.PI / 180 - lat * Math.PI / 180);
                var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
                if (dirE0 < 0) {
                    dirE0 = dirE0 + 360; //0～360 にする。
                }
                var dirN0 = (dirE0 + 90) % 360;
                var dirN0 = Math.floor(dirN0);


                var seikou_option = {
                    enableHighAccuracy:1,    // 高精度を要求する
                    timeout: 60000,              // 最大待ち時間（ミリ秒）
                    maximumAge: 0                // キャッシュ有効期間（ミリ秒）
                };
                function calcRoute(){
                    navigator.geolocation.watchPosition(seikou,null,seikou_option);
                    function seikou(position){

                    var data = position.coords;
                    var lat = data.latitude;
                    var lng = data.longitude;
                    var me = new google.maps.LatLng(lat,lng);
                    
                    //最初に中身をリセット
                    // document.getElementById('kyori').innerHTML = "";
                    $(".word").empty();
  
                    
                    
                    
                    

                    var request = {
                        origin: me,  //現在地
                        destination: latlng,  //目的地
                        //ドライビングモード指定（歩き）
                        travelMode: google.maps.DirectionsTravelMode.WALKING,
                        //単位km表示
                        unitSystem: google.maps.DirectionsUnitSystem.METRIC,
                        optimizeWaypoints: true,//最適化された最短距離にする。

                    };

                        directionsService.route(request,function(response,status){
                            if(status == google.maps.DirectionsStatus.OK){
                                // alert(response.routes[0].legs[0].distance.value)
                                document.querySelector('#kyori').textContent = response.routes[0].legs[0].distance.value; //+ "m"/;
                            }
    
                    //距離のコメントの挿入
                            if(response.routes[0].legs[0].distance.value > 500){
                                $(".word").append("<p>" + "遠いよ〜〜" + "</p>");
                            }else if(500>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>100){
                                $(".word").append("<p>" + "もう少し〜" + "</p>");
                            }else{
                                $(".word").append("<p>" + "近い" + "</p>");
                            }
    
                            if(response.routes[0].legs[0].distance.value > 300){
                                $(".word").append("<p>" + "いざ、いくよ〜〜〜" + "</p>");
                            }else if(300>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>270){
                                $(".word").append("<p>" + "しゅっぱつだよ〜" + "</p>");
                            }else if(270>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>250){
                                $(".word").append("<p>" + "わくわくだね〜" + "</p>");
                            }else if(250>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>220){
                                $(".word").append("<p>" + "おなかすいた〜？" + "</p>");
                            }else if(220>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>200){
                                $(".word").append("<p>" + "くんくんくん" + "</p>");
                            }else if(200>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>175){
                                $(".word").append("<p>" + "どんなお店かな" + "</p>");
                            }else if(175>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>150){
                                $(".word").append("<p>" + "おいしいにおいがするぞ" + "</p>");
                            }else if(150>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>125){
                                $(".word").append("<p>" + "まちきれん〜" + "</p>");
                            }else if(125>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>100){
                                $(".word").append("<p>" + "よだれがとまらないよ" + "</p>");
                            }else if(100>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>75){
                                $(".word").append("<p>" + "ちかい、、ちかいぞ！！" + "</p>");
                            }else if(75>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>50){
                                $(".word").append("<p>" + "hujrfaksdf!!!!" + "</p>");
                            }else if(50>response.routes[0].legs[0].distance.value){
                                $(".word").append("<p>" + "ついた！！！" + "</p>");
                                $(".image,.distance").empty();
                                $(".distance").append("<a href='last.html'>" + "お別れクリック" + "</a>")
                                $(".image").append("<img src='" + item.image_url.shop_image1 + "'>");
                            }
   
    
                        });

                    };
                }


        
                //方角を計算 + 距離の計算
                function seikousitai(){
                    // document.getElementById('kyori').innerHTML = "";
                    navigator.geolocation.getCurrentPosition(
                    function(position){
                        //現在地の緯度経度
                            var data = position.coords;
                            var lat = data.latitude;
                            var lng = data.longitude;
                        //お店の緯度経度
                            var slat = item.latitude;
                            var slng = item.longitude;
                        

                      // 緯度経度 lat, lng の点を出発として、緯度経度 lat2, lng2 への方位
                      // 北を０度で右回りの角度０～３６０度
                      var Y = Math.cos(slng * Math.PI / 180) * Math.sin(slat * Math.PI / 180 - lat * Math.PI / 180);
                      var X = Math.cos(lng * Math.PI / 180) * Math.sin(slng * Math.PI / 180) - Math.sin(lng * Math.PI / 180) * Math.cos(slng * Math.PI / 180) * Math.cos(slat * Math.PI / 180 - lat * Math.PI / 180);
                      var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
                      if (dirE0 < 0) {
                        dirE0 = dirE0 + 360; //0～360 にする。
                      }
                      var dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向
                      return dirN0;
                      // var element = document.getElementById("heading");
                      // element.innerHTML = "Orientation:" + shousuu;
                          //店のある方を向く
                         //    $("#right").css({
                            //    transform : "rotate(" + dirN0 + "deg)" 
                            // });
                            // $("#left").css({
                            //    transform : "rotate(" + dirN0 + "deg)" 
                            // });
                            // alert(dirN0);
                    });
                }
                
                function startWatch(heading){
                    //3秒ごとにコンパスを更新
                    var options = {frenquency:3000};
                    watchID = navigator.compass.watchHeading(onSuccess, onError, options);
                }
                
                //onSuccess 現在地の取得
                function onSuccess(heading){
                    var element = document.getElementById("ori");
                    var shousuu = Math.floor(heading.magneticHeading);
                    // alert(seikousitai());
                    element.innerHTML = "Orientation:" + (shousuu + dirN0);
                    
                    $("#right").css({
                       transform : "rotate(" + (shousuu + dirN0) + "deg)" 
                    });
                    $("#left").css({
                       transform : "rotate(" + (shousuu + dirN0) + "deg)" 
                    });
                    
                        
                }
                
                //onError エラーの時の動作
                function onError(compassError){
                    alert(compassError.code);
                }
                
                
                // getkyori();
                // setInterval(calcRoute,3000);
                calcRoute();
                // seikousitai();
                startWatch();
                seikousitai();
                //全体の実装
                // calcRoute();
                // initialize();
 
                //$.eachの回数を一回に制限
                if(i == 1){
                    return true;
                }else{
                    return false;
                }


            });

        }else{
            alert("検索結果が見つかりませんでした。");
        }
    };  //showresultの終了

});


}else{
    alert("ごしよういただけません");

}


});

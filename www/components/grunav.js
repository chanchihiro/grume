jQuery(function(){
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
        function(position){
            
    var data = position.coords;
    var lat = data.latitude;
    var lng = data.longitude;
    
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
    
/////////////////////////////////////////////////////////////最初の導入ページ
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
    });
    
    $(".you").on("click",function(){
        params.freeword = "洋";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
    });

    $(".tyuu").on("click",function(){
        params.freeword = "中";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
    });

    $(".ta").on("click",function(){
        params.freeword = "デザート,お菓子,チェーン";
        $.getJSON(url_rest,params,function(result){
            showResult(result);
        });
        $(".one").hide();
        $(".image,.word,.distance").show();
    });
    
    $("#last").on("click",function(){
        $(".image,.word,.distance").hide();
        $(".image2,.word2,.distance2").show();
    });

///////////////////////////情報の設定/////////////////////////////  
   
    var showResult = function(result){
        if(result.total_hit_count > 0){
            alert("運命の出会い！？");
            $.each(result.rest,function(i,item){

//////////////////////////////googlemapの変数設定
                var rendererOptions = {
                    draggable: true,
                    preserveViewport:false
                };
                var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
                var directionsService = new google.maps.DirectionsService();

                //ぐるなびの店舗の位置を中心にする
                //店の方角
                var slat = item.latitude;
                var slng = item.longitude;
                var latlng = new google.maps.LatLng(slat,slng);
                //現在地の位置を取る
                var me = new google.maps.LatLng(lat,lng);

                //canvasにmapOptionsの内容の地図のインスタンスの作成のための変数
                var map;
                
                //方角の計算式
                var Y = Math.cos(slng * Math.PI / 180) * Math.sin(slat * Math.PI / 180 - lat * Math.PI / 180);
                var X = Math.cos(lng * Math.PI / 180) * Math.sin(slng * Math.PI / 180) - Math.sin(lng * Math.PI / 180) * Math.cos(slng * Math.PI / 180) * Math.cos(slat * Math.PI / 180 - lat * Math.PI / 180);
                var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
                if (dirE0 < 0) {
                    dirE0 = dirE0 + 360; //0～360 にする。
                }
                var dirN0 = (dirE0 + 90) % 360;
                var dirN0 = Math.floor(dirN0);

////////////////////////位置情報を常に取るための設定
                var seikou_option = {
                    enableHighAccuracy:true,    // 高精度を要求する
                    timeout: 30000,              // 最大待ち時間（ミリ秒）
                    maximumAge: 0           // キャッシュ有効期間（ミリ秒）
                };
//////////////////////////
                function calcRoute(){
                navigator.geolocation.watchPosition(seikou,errorFunc,seikou_option);
                    
                function seikou(position){
                    var data2 = position.coords;
                    var lat2 = data2.latitude;
                    var lng2 = data2.longitude;
                    var me2 = new google.maps.LatLng(lat2,lng2);

                    var request = {
                        origin: me2,  //現在地
                        destination: latlng,  //目的地
                        //ドライビングモード指定（歩き）
                        travelMode: google.maps.DirectionsTravelMode.WALKING,
                        //単位m表示
                        unitSystem: google.maps.DirectionsUnitSystem.METRIC,
                        optimizeWaypoints: true,//最適化された最短距離にする。
                    };
                    
                    directionsService.route(request,function(response,status){
                        var max = response.routes[0].legs[0].distance.value;
                        if(status == google.maps.DirectionsStatus.OK){
                            $(".word").empty();
                            document.querySelector('#kyori').textContent = max; //+ "m"/;
                        }
    
                    //距離のコメントの挿入
                            if(max > 500){
                                $(".word").append("<p>" + "遠いよ〜〜" + "</p>");
                            }else if(500>max && max>100){
                                $(".word").append("<p>" + "もう少し〜" + "</p>");
                            }else{
                                $(".word").append("<p>" + "近い" + "</p>");
                            }
    
                            if(max > 300){
                                $(".word").append("<p>" + "いざ、いくよ〜〜〜" + "</p>");
                            }else if(300>max && max>270){
                                $(".word").append("<p>" + "しゅっぱつだよ〜" + "</p>");
                                $("#compass").attr("src","y-3.png");
                            }else if(270>max && max>250){
                                $(".word").append("<p>" + "わくわくだね〜" + "</p>");
                            }else if(250>max && max>220){
                                $(".word").append("<p>" + "おなかすいた〜？" + "</p>");
                            }else if(220>max && max>200){
                                $(".word").append("<p>" + "くんくんくん" + "</p>");
                                $("#compass").attr("src","y-2.png");
                            }else if(200>max && max>175){
                                $(".word").append("<p>" + "どんなお店かな" + "</p>");
                            }else if(175>max && max>150){
                                $(".word").append("<p>" + "おいしいにおいがするぞ" + "</p>");
                                $("#compass").attr("src","y-5.png");
                            }else if(150>max && max>125){
                                $(".word").append("<p>" + "まちきれん〜" + "</p>");
                            }else if(125>max && max>100){
                                $(".word").append("<p>" + "よだれがとまらないよ" + "</p>");
                                $("#compass").attr("src","y-1.png");
                            }else if(100>max && max>75){
                                $(".word").append("<p>" + "ちかい、、ちかいぞ！！" + "</p>");
                                $("#compass").attr("src","y-4.png");
                            }else if(75>max && max>20){
                                $(".word").append("<p>" + "hujrfaksdf!!!!" + "</p>");
                            }else if(20>max && max>1){
                                $(".word").append("<p>" + "ついた！！！" + "</p>"+ "<p>" + item.name + "</p>");
                                $(".image").empty();
                                $(".distance").empty();
                                $(".distance").append("<a href='last.html'>" + "お別れクリック" + "</a>")
                                $(".image").append("<img src='" + item.image_url.shop_image1 + "'>");
                            }
                    });
                    }
                    function errorFunc(error){
                        // エラーコードのメッセージを定義
                    	var errorMessage = {
                    		0: "原因不明のエラーが発生しました…。" ,
                    		1: "位置情報の取得が許可されませんでした…。" ,
                    		2: "電波状況などで位置情報が取得できませんでした…。" ,
                    		3: "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。" ,
                    	};
                    	// エラーコードに合わせたエラー内容を表示
                    	alert( errorMessage[error.code] ) ;
                    }
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

///////////////スイッチ的な
                calcRoute();
                startWatch();
 
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
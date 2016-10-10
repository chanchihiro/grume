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
        startWatch();
	});

	$(".you").on("click",function(){
		params.freeword = "洋";
		$.getJSON(url_rest,params,function(result){
			showResult(result);
		});
		$(".one").hide();
		$(".image,.word,.distance").show();
        startWatch();
	});

	$(".tyuu").on("click",function(){
		params.freeword = "中";
		$.getJSON(url_rest,params,function(result){
			showResult(result);
		});
		$(".one").hide();
		$(".image,.word,.distance").show();
        startWatch();
	});

	$(".ta").on("click",function(){
		params.freeword = "デザート,お菓子,チェーン,";
		$.getJSON(url_rest,params,function(result){
			showResult(result);
		});
		$(".one").hide();
		$(".image,.word,.distance").show();
        startWatch();
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
    
    //コンパスのモニタリングを待つ
    function startWatch(heading){
        //3秒ごとにコンパスを更新
        var options = {frenquency:3000};
        watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    }
    
    //onSuccess 現在地の取得
    function onSuccess(heading){
        var element = document.getElementById("ori");
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
///////////////////////////情報の設定/////////////    
    


/*
	var showResult = function(result){  //表示する関数の設定
		if(result.total_hit_count > 0 ){
			var res = "";
			alert( result.total_hit_count + "件の結果が見つかりました。");
			for( var i in result.rest){
				res += result.rest[i].name;
			$(".result").append("<h1>"+res+"</h1>");
			}
			for( var i in result.rest){
				pla += result.rest[i].access.station;
			$(".result").append("<p>"+pla+"</p>");
			}
		}else{
			alert("検索結果が見つかりませんでした。");
		}
	};
*/

	var showResult = function(result){
		if(result.total_hit_count > 0){
			alert("運命の出会い！？");
			$.each(result.rest,function(i,item){
				$(".result").append("<div class='" + "food" + "'>" +
					// "<img src='" + item.image_url.shop_image1 + "'>" +  
					"<h1>" + item.name + "</h1>"+
					// "<p>" + item.latitude + " " + item.longitude + "</p>" +
					"<p>" + item.access.walk + "分" + "</p>" +
					"<div id='" + "popo" + "'></div>" +
					"<div id='" + "pipi" + "'></div>" +
					"<div id='" + "map-canvas" + "'></div>" +
					"<div id='" + "comment" + "'></div>" +
					"<div id='" + "hougaku" + "'></div>" +
                    "<div id='" + "toutyaku" + "'>" + "到着したよ" + "</div>" +
					"</div>"
				);
				

				var rendererOptions = {
					draggable: true,
					preserveViewport:false
				};
				var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
				var directionsService = new google.maps.DirectionsService();



				//マップの表示
				var canvas = document.getElementById("map-canvas");
				//進む道の表示
				var road = document.getElementById("popo");

				//ぐるなびの店舗の位置を中心にする
				var latlng = new google.maps.LatLng(item.latitude,item.longitude);
				//現在地の位置を取る
				var me = new google.maps.LatLng(lat,lng);

				//二転換の方角をとる


				//canvasにmapOptionsの内容の地図のインスタンスの作成のための変数
				var map;
                
                //店の方角



				function initialize(){
					// 地図のオプションの設定
					var mapOptions = {
						zoom:15,
						center:me,
					};
					map = new google.maps.Map(canvas,mapOptions);
					directionsDisplay.setMap(map);
					directionsDisplay.setPanel(road);
					//マーカーを立てる
					new google.maps.Marker({
						map:map,
						position:latlng,
					});
					new google.maps.Marker({
						map:map,
						position:me,
					});
					//総距離を求める
					function kyori(){
						computeTotalDistance(directionsDisplay.directions);}
					//詳細設定
				}


				function calcRoute(){
    				navigator.geolocation.getCurrentPosition(
						function(position){

					var data = position.coords;
					var lat = data.latitude;
					var lng = data.longitude;
					var me = new google.maps.LatLng(lat,lng);
                    
                    //最初に中身をリセット
                    document.getElementById('kyori').innerHTML = "";
                    $(".word").empty();
                    $("#bye").empty();
                    $("#lastimg").empty();
                    
                    
                    
                    

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
    							document.getElementById('kyori').innerHTML+= response.routes[0].legs[0].distance.value; //+ "m";
    							directionsDisplay.setDirections(response);
    						}
    
    				//距離のコメントの挿入
    						if(response.routes[0].legs[0].distance.value > 500){
    							$(".word").append("<p>" + "遠いよ〜〜" + "</p>");
    						}else if(500>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>100){
    							$(".word").append("<p>" + "もう少し〜" + "</p>");
    						}else{
    							$(".word").append("<p>" + "近い" + "</p>");
    						}
    
    
    
    //////////////////////////////////////////情報のコメントの挿入
    							var params2 = {
    								keyid: api_key,
    								format:"json",
    								shop_id:result.rest[0].id
    							};
    
    						if(response.routes[0].legs[0].distance.value > 300){
    							$(".word").append("<p>" + hyouka.comment + "</p>");
    						}else if(300>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>200){
                                $(".word").append("<p>" + "しゅっぱつだよ〜" + "</p>");
    						}else if(200>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>100){
    							$(".word").append("<p>" + "よだれがとまらないよ" + "</p>");
    						}else if(100>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>50){
    							$(".word").append("<p>" + "これはカレーかな？" + "</p>");
    						}else if(50>response.routes[0].legs[0].distance.value && response.routes[0].legs[0].distance.value>20){
    							$(".word").append("<p>" + "もうそろそろだ" + "</p>");
    						}else{
                                $(".image,.word,.distance").hide();
                            	$(".image2,.word2,.distance2").show();
                                $("#lastimg").append("<img src='" + item.image_url.shop_image1 + "'>");
    						}
                            
                            
                            //50メートル以内に入るとボタン出現
                            if(50 > response.routes[0].legs[0].distance.value){
                                $("#bye").empty();
                                $(".image").empty();
                                $(".distance").empty();
        						$("#bye").append("<div id='" + "last" + "'>" + "到着！" + "</div>");
                                $(".image").append("<img src='" + item.image_url.shop_image1 + "'>");
                            }
    
    					});

				    });
				}


				//総距離合計
				function kyori(result){
					var total = 0;
					var myroute = result.routes[0];
					for (i = 0; i < myroute.legs.length; i++){
						total += myroute.legs[i].distance.value;
					}
					total = total / 1000;
					document.getElementById("total").innerHTML = total + " km";
				}


				//方角を計算
				function geoDirection(){
                    navigator.geolocation.getCurrentPosition(
    		        function(position){
                        var data = position.coords;
                    	var lat = data.latitude;
                    	var lng = data.longitude;

    				  // 緯度経度 lat, lng の点を出発として、緯度経度 lat2, lng2 への方位
    				  // 北を０度で右回りの角度０～３６０度
    				  var Y = Math.cos(item.longitude * Math.PI / 180) * Math.sin(item.latitude * Math.PI / 180 - lat * Math.PI / 180);
    				  var X = Math.cos(lng * Math.PI / 180) * Math.sin(item.longitude * Math.PI / 180) - Math.sin(lng * Math.PI / 180) * Math.cos(item.longitude * Math.PI / 180) * Math.cos(item.latitude * Math.PI / 180 - lat * Math.PI / 180);
    				  var dirE0 = 180 * Math.atan2(Y, X) / Math.PI; // 東向きが０度の方向
    				  if (dirE0 < 0) {
    				    dirE0 = dirE0 + 360; //0～360 にする。
    				  }
    				  var dirN0 = (dirE0 + 90) % 360; //(dirE0+90)÷360の余りを出力 北向きが０度の方向
                      // return dirN0;
                      // var element = document.getElementById("heading");
                      // element.innerHTML = "Orientation:" + shousuu;
                      
                          //店のある方を向く
            		        $("#right").css({
        			           transform : "rotate(" + dirN0 + "deg)" 
        			        });
        			        $("#left").css({
        			           transform : "rotate(" + dirN0 + "deg)" 
        			        });
                            alert(dirN0);
                   
                        
    		        });
                }
                
                
                geoDirection();
				//全体の実装
				setInterval(calcRoute,2000);
                initialize();
 
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

if (typeof HB == "undefined" || !HB) {
	var HB = HB || {}
}
HB = function() {}
HB.prototype = {
	start:function(tree_data,time){
		if (tree_data) this.tree("tree_01", tree_data);//分类树
		this.servers("#selectable li");
		this.selectable("#selectable li","#SURECHOSE");
		this.date("#d4311","#d4312","#C_DATE","#Immediate","#S_DATE","#DATE_MSG",time);
		this.toggle(".select_box",".tit",['.btn_1','.btn_2']);
		this.hover(".menu li");
		this.s_zhibiao("#S_ZHIBIAO");
		this.s_VERSION("#VERSION");
		this.edit_HJ("#EDHJ");
		this.ser_toggle("#SEL_ONOFF label","#selectable");
	},
	help:function(D){
		$(D).click(function(){
			var H=$(window).height();
			$('body').append("<iframe id='help_iframe' allowtransparency='true' scrolling='no'  src='"+$(this).attr('href')+"' style='position:fixed;z-index:1000;top:0;left:0;width:100%;height:"+H+"px;' ></iframe>");
			return false;
		});
	},
	hover:function(D){
		$(D).hover(function(){
			$(this).addClass("current");
		},function(){
			$(this).removeClass("current");
		});
	},
	del_error:function(D){
		var tmpD=D.split("\r\n");
		var tmpStr="";
		var realStr="";
		for(var ii=0;ii<tmpD.length;ii++){
			if(tmpD[ii].length<10&&tmpD[ii].indexOf("&")==-1){
				//error msg
				tmpStr=tmpStr+"#"+tmpD[ii];
			}else{
				realStr=realStr+tmpD[ii];
			}
		}
		return realStr;
	},
	win_size:function(){
		var win_h=window.innerHeight;
		if ($("#rightarea").length>0)
			$("#rightarea").height(win_h-136);
		$("#leftarea").height(win_h-115);
		if ($("#right_iframe").length>0)
			$("#right_iframe").height(win_h-115).width(window.innerWidth-230);
	},
	s_VERSION:function(D){
		var t=this;
		$(D).change(function(){
			t.to_location('V',$(this).val())
		});
	},
	s_zhibiao:function(D){
		var t=this;
		$(D).change(function(){
			var time=t.set_time(DATE),v=jiqun,A=servers;
			if (DATE=="auto"){
				time[0]=t.getdate(new Date(time[0]));
				time[1]=t.getdate(new Date(time[1]));
			}else{
				time[0]='';
				time[1]='';	
			}
			if(A.length==$(".tit_box .ser_lit li").length) A='all';
			else A=A.join("|");
			var L="select_zhibiao.php?FK="+$(this).val()+"&from="+time[0]+"&to="+time[1]+"&AS="+v+"&RS="+A+"&DA="+DATE;
			window.location.href=L;
		});
	},
	//生成分类树
	tree: function(ID,D){//ID:父窗口ID  D:数据
		var tree_box = document.createElement("ul");
		tree_box.className="ms_tree";
		var ul_block=0;
		function return_tree(f_dom,date){
			for (var i=0,l=date.length;i<l;i++){
				var li = document.createElement("li");
				var button = document.createElement("button");
				var a=document.createElement("a");
				if (date[i].hover){
					a.className="current";
				}
				a.href=date[i].link;
				if (date[i].target){
					a.target=date[i].target;
				}
				a.innerHTML=date[i].name;
				a.title=date[i].name;
				a.onclick=function(){
					$("#"+ID).find("a.current").removeClass("current");
					$(this).addClass("current");
				};
				if (date[i].children){
					a.className="folder";
					li.appendChild(button);
					li.appendChild(a);
					var cln_ul = document.createElement("ul");
					if (i==l-1){
						cln_ul.className="last_ul";
						button.className="last_add";
					}else if(i==0) {
						button.className="first_add";
					}else {
						button.className="mid_add";
					}
					button.onclick=function(){
						var parent_node=this.parentNode;
						if(parent_node.className=="current"){
							parent_node.className="";
						}else {
							parent_node.className="current";
						}
					};
					if (ul_block==0){li.className="current";ul_block++;}
					li.appendChild(cln_ul);
					return_tree(cln_ul,date[i].children);
				}else {
					if (i==l-1){
						button.className="last_line";
					}else{
						button.className="line";
					}
					li.appendChild(button);
					li.appendChild(a);
				}
				f_dom.appendChild(li);
			}
		};
		return_tree(tree_box,D);
		document.getElementById(ID).appendChild(tree_box);
	},
	//生成获取饼图的url地址
	url_pie:function(D){
		var fz="",pointCom="",from="",to="",featureKeys="",C=0;
		var RS=servers,time_i=time;//全局变量转局部变量
		for (var i=0,l=RS.length;i<l;i++){
			fz+=RS[i]+"/|";
		}
		fz+=":";
		if (D[0].time){
			to=D[0].time[1];
			from=D[0].time[0];
		}else {
			to=time_i[1];
			from=time_i[0];
		}
		pointCom=Math.max(1,Math.floor((to-from)/(3600*1000)))*4;
		featureKeys=D[0].zhibiao;
		C=D[0].combineType;
		//var url=araxurl+"?cluster="+cluster+"&combineType="+C+"&combineNum="+pointCom+"&featureKey="+featureKeys;

		var araxurl2=araxurl.replace("http://","");
		var url=araxurl2.substring(araxurl2.indexOf("/"),araxurl2.length),CS="cluster="+cluster+"&combineType="+C+"&combineNum="+pointCom+"&featureKey="+featureKeys+"&src="+fz;
		araxurl2=araxurl2.substring(0,araxurl2.indexOf("/"));
		araxurl2=araxurl2.split(":");
		return [[araxurl2[0],araxurl2[1],url],CS,[from,to]];
	},
	//生成用于异步获取数据的url地址
	url:function(D,FK,THJ){
		var t=this;
		if (THJ && THJ.V){
			var E=t.clone(D);
		}
		var time_i=time;//全局变量转局部变量
		if (THJ){//选择整个机房时
			var url_obj=[];
			for (var j=0,lj=THJ.URL.length;j<lj;j++){
				url_obj.push(geturl(THJ.URL[j],THJ.SER[j],THJ.CUR[j]));
			}
			return url_obj;
		}else{//选择单个环境时
			return geturl();
		}
		function geturl(URL,RS,CUR){
			var fz="",pointCom="",from="",to="",C="";
			if (!URL) var URL=araxurl;
			if (!RS) var RS=servers;
			if (!CUR) var CUR=cluster;
			if (FK){
				if (FK){
					FK=FK.split(":");
				}
				for (var j=0,lb=FK.length;j<lb;j++){
					for (var i=0,l=RS.length;i<l;i++){
						fz+=RS[i]+"/|";
					}
					to+=time_i[1];
					from+=time_i[0];
					pointCom+=Math.max(1,Math.floor((time_i[1]-time_i[0])/(3600*1000)))*4;
					C+=D[0].combineType?D[0].combineType:0;
					if (j!=(lb-1)){
						fz+=":";
						from+=":";
						to+=":";
						pointCom+=":";
						C+=":";
					}
				}
				URL=URL.replace("http://","");
				var url=URL.substring(URL.indexOf("/"),URL.length),CS="cluster="+CUR+"&combineType="+C+"&combineNum="+pointCom+"&featureKey="+FK.join(":")+"&src="+fz;
				URL=URL.substring(0,URL.indexOf("/"));
				URL=URL.split(":");
				//var url=URL+"?cluster="+CUR+"&combineType="+C+"&combineNum="+pointCom+"&featureKey="+FK.join(":");
			}else{
				if (E){
					var V=THJ.V;
					D=[];
					for (var j=0,lj=E.length;j<lj;j++){
						if (!E[j].version || E[j].version==V[0]){
							D.push(E[j]);
						}else if (E[j].version<0 && -E[j].version!=V[0]){
							D.push(E[j]);
						}
					}
					V.shift();
				}
				for (var j=0,lb=D.length;j<lb;j++){
					if (D[j].fwq){
						RS=[D[j].fwq];
					}else if (D[j].fwq_all==""){
						RS=servers;
					}
					for (var i=0,l=RS.length;i<l;i++){
						fz+=RS[i]+"/"+D[j].zhibiao+"|";
					}
					if (D[j].time){
						if(typeof(D[j].time)=='string'){
							D[j].time=t.set_time(D[j].time);
						}
						to+=D[j].time[1];
						from+=D[j].time[0];
						if (top.time_b) pointCom+=Math.round(Math.max(1,Math.floor((D[j].time[1]-D[j].time[0])/(3600*1000)))*top.time_b);
						else pointCom+=Math.max(1,Math.floor((D[j].time[1]-D[j].time[0])/(3600*1000)))*4;
					}else {
						to+=time_i[1];
						from+=time_i[0];
						if (top.time_b) pointCom+=Math.round(Math.max(1,Math.floor((time_i[1]-time_i[0])/(3600*1000)))*top.time_b);
						else pointCom+=Math.max(1,Math.floor((time_i[1]-time_i[0])/(3600*1000)))*4;
					}
					C+=D[j].combineType?D[j].combineType:0;
					if (j!=(lb-1)){
						fz+=":";
						from+=":";
						to+=":";
						pointCom+=":";
						C+=":";
					}
				}
				URL=URL.replace("http://","");
				var url=URL.substring(URL.indexOf("/"),URL.length),CS="cluster="+CUR+"&combineType="+C+"&combineNum="+pointCom+"&featureKey=&src="+fz;
				URL=URL.substring(0,URL.indexOf("/"));
				URL=URL.split(":");
			}
			return [[URL[0],URL[1],url],CS,[from,to]]
			//return [url,fz,[from,to]];
		}
	},
	//解析需要的链接的链接，将其中包含的参数重新组合生成新的URL并跳转
	new_URL:function(C){
		var t=this;
		$(C).live("click",function(){
			var tL=$(this).attr("href"),time=t.set_time(DATE);
			t.jump_url(tL,time,jiqun);
			return false;
		});
	},
	//获取url参数的时间，如果为空 则设为一小时之内
	set_time:function(DATA,from2,to2){
		var t=this;
		if (from2 && to2){
			//跨度不得超过2周
			var time=[Number(from2),Number(to2)];
		}else{
			var time=[],date2=new Date();
			date2=date2.valueOf()-2*60*1000;
			date2=new Date(date2);
			var date=date2.valueOf();
			switch(DATA){
				case "1h":date=date-1*60*60*1000;date=new Date(date);break;
				case "3h":date=date-3*60*60*1000;date=new Date(date);break;
				case "12h":date=date-12*60*60*1000;date=new Date(date);break;
				case "tody":date=t.getdate(date2).split(" ")[0]+" 00:00:00";date=new Date(Date.parse(date.replace(/-/g,"/")));break;
				case "Yesterday":date=t.getdate(new Date(date2.valueOf()-60*60*24*1000)).split(" ")[0]+" 00:00:00";date2=t.getdate(new Date(date2.valueOf())).split(" ")[0]+" 00:00:00";date=new Date(Date.parse(date.replace(/-/g,"/")));date2=new Date(Date.parse(date2.replace(/-/g,"/")));break;
				case "24h":date=date-24*60*60*1000;date=new Date(date);break;
				case "3d":date=date-3*24*60*60*1000;date=new Date(date);break;
				case "7d":date=date-7*24*60*60*1000;date=new Date(date);break;
				case "14d":date=date-14*24*60*60*1000;date=new Date(date);break;
				case "1m":date=date-30*24*60*60*1000;date=new Date(date);break;
				case "3m":date=date-90*24*60*60*1000;date=new Date(date);break;
				case "15f":date=date-15*60*1000;date=new Date(date);break;
				case "30f":date=date-30*60*1000;date=new Date(date);break;
				case "b1w":date=t.getdate(new Date(date2.valueOf()-60*60*24*(7+date2.getDay())*1000)).split(" ")[0]+" 00:00:00";date2=t.getdate(new Date(date2.valueOf()-60*60*24*(date2.getDay())*1000)).split(" ")[0]+" 00:00:00";date=new Date(Date.parse(date.replace(/-/g,"/")));date2=new Date(Date.parse(date2.replace(/-/g,"/")));break;
				case "b1m":date=[date2.getFullYear(),date2.getMonth()-1];if(date[1]<0){date[1]=12+date[1];date[0]=date[0]-1;};date=new Date(date[0],date[1],1);date2=[date2.getFullYear(),date2.getMonth()];date2=new Date(date2[0],date2[1],1);break;
				case "b2m":date=[date2.getFullYear(),date2.getMonth()-2];if(date[1]<0){date[1]=12+date[1];date[0]=date[0]-1;};date=new Date(date[0],date[1],1);date2=[date2.getFullYear(),date2.getMonth()-1];if(date2[1]<0){date2[1]=12+date2[1];date2[0]=date2[0]-1;};date2=new Date(date2[0],date2[1],1);break;
				default:date=date-1*60*60*1000;date=new Date(date);
			}
			if (DATA=="auto"){
				if(from){
					time[0]=Number(from);
				}else {
					time[0]=new Date().valueOf();
				}
				if(to){
					time[1]=Number(to);
				}else {
					time[1]=time[0]
					time[0]-=1*60*60*1000;
				}
			}else{
				time=[date.valueOf(),date2.valueOf()];
			}
		}
		return time;
	},
	//生成服务器可选区域
	servers:function(ID){
		var Rs=servers;
		if ($(ID).length!=Rs.length){
			for (var i=0,l=$(ID).length;i<l;i++){
				for (var j=0,l2=Rs.length;j<l2;j++){
					if ($(ID).eq(i).html()==Rs[j]){
						$(ID).eq(i).addClass("current");
						break;
					}
				}
			}
		}
	},
	//生成用于存放图表的框
	add_cbox:function(ID,Yt,tit,f_id,type,Zt){
		var charts_box = document.createElement("div");
		if (type && type=="table"){
			charts_box.className="table_box charts_box";
			charts_box.id="charts_box"+ID;
			var h4 = document.createElement("h4");
			h4.innerHTML=tit;
			var chart_id = document.createElement("div");
			chart_id.id="chart_"+ID;
			var edit = document.createElement("div");
			edit.className="edit";
			chart_id.className="charts";
			chart_id.innerHTML="<p class='loading'><img src='/images/loading.gif' />正在载入...请稍后</p>";
			charts_box.appendChild(h4);
			charts_box.appendChild(edit);
			charts_box.appendChild(chart_id);
		}else if (type && type=="history_sta"){
			charts_box.className="table_box charts_box";
			charts_box.id="charts_box"+ID;
			var h4 = document.createElement("h4");
			h4.innerHTML=tit;
			var chart_id = document.createElement("div");
			chart_id.id="chart_"+ID;
			var edit = document.createElement("div");
			edit.className="edit";
			chart_id.className="charts";
			chart_id.innerHTML="<p class='loading'><img src='/images/loading.gif' />正在载入...请稍后</p>";
			charts_box.appendChild(h4);
			charts_box.appendChild(edit);
			charts_box.appendChild(chart_id);
		}else {
			charts_box.className="charts_box";
			charts_box.id="charts_box"+ID;
			var h4 = document.createElement("h4");
			h4.innerHTML=tit;
			var p = document.createElement("p");
			p.innerHTML=Yt;
			var mean=document.createElement("p");
			mean.className="mean";
			mean.innerHTML="<span class='point'></span>";
			var chart_id = document.createElement("div");
			chart_id.id="chart_"+ID;
			var edit = document.createElement("div");
			edit.className="edit";
			var edit_html="<span title='操作'>更多操作</span><ul>";
			edit_html+="<li><a href='#' class='data_mean' ztit='"+Zt+"'>数据含义</a></li>";
			//edit.innerHTML="<span title='操作'></span><ul><li><a href='#'>编辑</a></li><li><a href='#'>删除</a></li></ul>";
			if (power=='all'){
				edit_html+="<li><a href='#' class='data_link' target='_blank'>数据链接</a></li>";
			}
			if (/Statements.php/.test(location.href)){
				edit_html+="<li><a href='my_reports.php?ID="+ID+"' >编辑</a></li><li><a class='del_charts' thisID='"+ID+"' >删除</a></li>";
			}
			if (!$("#rightarea").hasClass("no_add")){
				edit_html+="<li><a href='#' class='ADD_to_Statements'>添加到自定义报表</a></li>";
			}
			edit_html+="</ul>";
			edit.innerHTML=edit_html;
			chart_id.className="charts";
			chart_id.innerHTML="<p class='loading'><img src='/images/loading.gif' />正在载入...请稍后</p>";
			charts_box.appendChild(h4);
			charts_box.appendChild(edit);
			charts_box.appendChild(p);
			charts_box.appendChild(mean);
			charts_box.appendChild(chart_id);
		}
		document.getElementById(f_id).appendChild(charts_box);
		//暂时屏蔽拖放功能this.dragobj(h4,charts_box);
	},
	//拖放插件
	dragobj:function(obj){
		obj=$(obj);
		var unbind=document.createElement("div"),arry=[],obj_f=null,t=this;
		unbind.id="unbind";
		function set_arry() {
			for (var i=0,l=$(".charts_box").length;i<l;i++){
				arry[i]=[$(".charts_box").eq(i).offset().left,$(".charts_box").eq(i).offset().top];
				arry[i][2]=arry[i][0]+$(".charts_box").eq(i).width();
				arry[i][3]=arry[i][1]+$(".charts_box").eq(i).height();
			}
		}
		//判断在哪个位置插入
		function chose_which(xy2){
			for (var i=0,l=$(".charts_box").length;i<l;i++){
				if ($(".charts_box").eq(i).css("position")=="absolute") continue;
				if (arry[i][0]<=xy2[0] && xy2[0]<=arry[i][2] && arry[i][1]<=xy2[1] && xy2[1]<=arry[i][3]) break;
				else {
					if ($("#left_charts .charts_box").length<=1 && ($("#left_charts").offset().left)<xy2[0] && ($("#left_charts").offset().left+$("#left_charts").width())>xy2[0]){
						if ($("#left_charts .charts_box").eq(0).css("position")=="absolute" ||  $("#left_charts .charts_box").length==0){
							i="left";break;
						}
					}else if ($("#right_charts .charts_box").length<=1 && ($("#right_charts").offset().left)<xy2[0] && ($("#right_charts").offset().left+$("#right_charts").width())>xy2[0]){
						if ($("#right_charts .charts_box").eq(0).css("position")=="absolute" ||  $("#right_charts .charts_box").length==0){
							i="right";break;
						}
					}
				}
			}
			if (i<l){
				if (xy2[1]<=(arry[i][3]+arry[i][1])/2 && $(".charts_box").eq(i).before().attr("id")!="temp_box"){
					$("#temp_box").remove();
					$(".charts_box").eq(i).before("<div id='temp_box'>拖放到此处</div>");
				}else if (xy2[1]>(arry[i][3]+arry[i][1])/2  && $(".charts_box").eq(i).after().attr("id")!="temp_box"){
					$("#temp_box").remove();
					$(".charts_box").eq(i).after("<div id='temp_box'>拖放到此处</div>");
				}
				set_arry();
			}else if (i=="left"){
				$("#temp_box").remove();
				$("#left_charts").append("<div id='temp_box'>拖放到此处</div>");
			}else if (i=="right"){
				$("#temp_box").remove();
				$("#right_charts").append("<div id='temp_box'>拖放到此处</div>");
			}
		}
		function save_seat(){
			var L=$("#left_charts").find(".charts_box"),R=$("#right_charts").find(".charts_box"),La=[];
			for (var i=0,l=L.length,z=0;i<l;i++,z++){
				La.push([L.eq(i).attr("id").replace("charts_box",""),z,"left_charts"]);
				if (R.eq(i).length){
					z++;
					La.push([R.eq(i).attr("id").replace("charts_box",""),z,"right_charts"]);
				}
			}
			if (R.eq(i).length){
				for (var l=R.length;i<l;i++,z++){
					La.push([R.eq(i).attr("id").replace("charts_box",""),z,"right_charts"]);
				}
			}
			$.ajax({
				type: 'POST',
				url: "function/save_seat.php",
				data:{seat:La},
				success: function(data){
				}
			});
		}
		obj.mousedown(function(e){
			obj_f=$(this).parent();
			$(unbind).height($('body').height());
			$('body').append($(unbind)).attr("style","-moz-user-select:-moz-none");
			obj_f.before("<div id='temp_box'>拖放到此处</div>");
			var xy=[e.pageX-obj_f.offset().left+7,e.pageY-obj_f.offset().top+58],xy2=[];
			obj_f.css({"position":"absolute","z-index":100,"left":(obj_f.offset().left-7),"top":(obj_f.offset().top-58),width:obj_f.width(),height:obj_f.height(),"opacity":0.8});
			set_arry();
			$(unbind).mousemove(function(e2){
				xy2=[e2.pageX,e2.pageY];
				obj_f.css({"left":(xy2[0]-xy[0]),"top":(xy2[1]-xy[1])});
				chose_which(xy2);
			});
			$(unbind).mouseup(function(){
				$("#temp_box").after(obj_f).remove();
				obj_f.attr('style','');
				$(unbind).remove();
				$('body').attr("style","");
				save_seat();
			});
		});
		t.del_charts(".del_charts");
	},
	//删除图表
	del_charts:function(D){
		var t=this;
		$(D).live('click',function(){
			if(confirm( '删除图表将不能回复，确定删除？')==true){
				$.ajax({
					type: 'POST',
					url: "function/del_charts.php",
					data:{id:$(this).attr('thisID')},
					success: function(data){
						t.prompt("删除成功！");
					}
				});
				$(this).parents(".charts_box").remove();
			}
		});
	},
	//数据处理，饼图
	data_deal_pie:function(D,data,F,N){
		if (!/\(/g.test(D)){return false;}
		D=D.replace(/\)\}/g,"").replace(/\{\(/g,"").replace(/\r\n/g,"");
		D=D.split("&");
		if (D.length>2){
			var Z=D[1];
		}
		D=D[0].split("),(");
		var arry=[],all=0,surplus=0;
		for (var i=0,l=D.length;i<l;i++){
			if (N && i%N!=0){
				continue;
			}
			D[i]=D[i].split(":");
			D[i][1]=D[i][1].split(",");
			var Dt=0;
			for (var j=0,jl=D[i][1].length;j<jl;j++){
				Dt+=(D[i][1][j]==-0.1)?0:Number(D[i][1][j]);
			}
			if(data[0].times) Dt=Dt*Number(eval(data[0].times));
			if((data[0].except && data[0].except=='/N') || N) Dt=Dt/jl;//求平均值
			D[i][1]=Dt;
			all+=Dt;
		}
		if (Z){
			Z=Z.split("),(");
			var all=0;
			for (var i=0,l=D.length;i<l;i++){
				Z[i]=Z[i].split(":");
				Z[i][1]=Z[i][1].split(",");
				var Dt=0;
				for (var j=0,jl=Z[i][1].length;j<jl;j++){
					Dt+=(Z[i][1][j]==-0.1)?0:Number(Z[i][1][j]);
				}
				
				if(data[0].times) Dt=Dt*data[0].times;
				if((data[0].except && data[0].except=='/N') || N) Dt=Dt/jl;//求平均值
				if (Dt==0 || D[i][1]==0){
					D[i][1]=0;
				}else{
					D[i][1]=D[i][1]/Dt;
				}
				all+=D[i][1];
			}
			
		}
		for (i=0;i<l;i++){
			if (D[i][1]/all>0.001){
			//	surplus+=D[i][1];
				arry.push(D[i]);
			}
		}
		
		if(arry.length==0) return false;
		var col=1;//根据第几位排序
		function cmp(a,b){
			return b[col]-a[col];   
		}
		arry=arry.sort(cmp);//排序结束
		if (F){
			var arry2=[];
			for (var i=0,l=arry.length;i<l;i++){
				arry2[i]={name:arry[i][0],y:arry[i][1]}
			}
			return arry2;
		}else{
			arry[0]={name:arry[0][0],y:arry[0][1],sliced: true,selected: true};
			return arry;
		}
	},
	data_deal_max:function(D,data){
		D=D.replace(/[\r\n]/g,'');
		D=D.split("&");
		for (var i=0,z=0,l=D.length-1;i<l;i++,z++){
			D[z]=D[z].split(",");
			if (data.data[z].except){
				if(data.data[z].except=="/" || data.data[z].except=="/qtd"){//计算除法
					for (var u=0,ul=D[z].length;u<ul;u++){
						D[z][u]=Number(D[z][u]);
						if (D[z][u]==0 || D[z-1][u]==0){
							D[z-1][u]=0;
						}else if (D[z][u]==null || D[z-1][u]==null){
							D[z-1][u]==null;
						}else{
							D[z-1][u]=D[z-1][u]/D[z][u];
						}
					}
					D.splice(z,1);
					data.data.splice(z,1);
					z--;
				}else if (data.data[z].except=="-"){//计算差值
					for (j=1,lj=D[i].length;j<lj;j++){
						D[i][j-1]=D[i][j]-D[i][j-1];
						if (D[i][j-1]<0 && j>1){
							D[i][j-1]=D[i][j-2];
						}else if (D[i][j-1]<0 && j<1){
							D[i][j-1]=0;
						}
					}
					D[i][lj-1]=null;
				}else if (data.data[z].except=="-^/"){//先自减再反向除一条数据
					for (j=1,lj=D[i].length;j<lj;j++){
						D[i][j-1]=D[i][j]-D[i][j-1];
						if (D[i][j-1]<0 && j>1){
							D[i][j-1]=D[i][j-2];
						}else if (D[i][j-1]<0 && j<1){
							D[i][j-1]=0;
						}
					}
					D[i][lj-1]=null;
					for (var u=0,ul=D[i].length;u<ul;u++){
						if (D[i][u]==0){
							D[i-1][u]=0;
						}else {
							D[i-1][u]=D[i][u]/D[i-1][u];
						}
					}
					D[i-1][ul-1]=null;
					D.splice(z,1);
					z--;
					data.data.splice(z,1);
				}else if (data.data[z].except=="-+"){//先自减再加上一条数据
					for (j=1,le=D[i].length;j<le;j++){
						D[i][j-1]=D[i][j]-D[i][j-1];
						D[i][j-1]=D[i][j-1]<0?0:D[i][j-1];
					}
					D[i][le-1]=null;
					for (var u=0,ul=D[i].length;u<ul;u++){
						D[i-1][u]=D[i-1][u]+D[i][u];
					}
					D.splice(z,1);
					z--;
					data.data.splice(z,1);
				}
			}
		}
		var time_i=time,arry=[],max_i=[0,0],t=this,times=data.data[0].times;
		times=times?times:1;
		for (var i=0,l=data.data.length-1;i<l;i++){
			for (var j=0,le=D[i].length,max=0;j<le;j++){
				D[i][j]=Number(D[i][j]);
				if (D[i][j]!=-0.1){
					max+=D[i][j];
				}
			}
			if (max>max_i[1]){
				max_i=[i,max];
			}
		}
		i=max_i[0];
		var inv=(time_i[1]-time_i[0])/(D[i].length-1);
		for (var j=0,le=D[i].length;j<le;j++){
			if (D[i][j]==-0.1) {
				D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),null];
			}else if (data.data[i].times) {
				D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),D[i][j]*data.data[i].times];
			}else {
				D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),D[i][j]];
			}
		}
		var d0=t.clone(data.data[i]),P=D.length-2,d1=t.clone(data.data[P]);
		for (var j=0,le=D[P].length;j<le;j++){
			D[P][j]=Number(D[P][j]);
			if (D[P][j]==-0.1) {
				D[P][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),null];
			}else if (data.data[i].times) {
				D[P][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),D[P][j]*data.data[i].times];
			}else {
				D[P][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),D[P][j]];
			}
		}
		d0.title="(最大值)"+data.data[i].fwq;
		d1.title="平均值";
		data.data=[d0,d1];
		arry[0]={name:"(最大值)"+data.data[0].fwq,data:D[i]}
		arry[1]={name:"平均值",data:D[P]}
		return arry;

	},
	Machine_name:function(N){
		return N=N.substring(0,N.indexOf("."));
	},
	data_FY:function(D,data){
		var YGC=[];
		D=D.split("&");
		for (var u=0,lu=D.length,DATA=[],SEV=servers,t=this;u<lu;u++){
			D[u]=D[u].split("{}");
			YGC[u]=Number(D[u][1]);
			D[u]=D[u][0];
			D[u]=D[u].substring(D[u].indexOf(" ")+1,D[u].length);
			D[u]=D[u].split("\n");
			DATA[u]=[[{name:'YGC',type:'scatter',color:'rgba(0,168,240, .5)',data:[]},{name:'FGC',type:'scatter',color:'rgba(237,86,27, .7)',data:[]},{name:'CMS',type:'scatter',color:'rgba(87,149,117, .7)',data:[]},{name:'单位时间回收(YGC)',color:'#9440ED',yAxis:1,type:'spline',data:[],marker:{enabled: false}},{name:'单位时间回收(CMS)',color:'#958C12',yAxis:1,type:'spline',data:[],marker:{enabled: false},visible:false}],0],t=this;
			for (var i=0,l=D[u].length;i<l;i++){
				if (D[u][i]!="" && /[0-9]/.test(D[u][i])){
					D[u][i]=D[u][i].replace(/\s{2,}/g," ");
					D[u][i]=D[u][i].split(" ");
					D[u][i][1]=t.turn_time(D[u][i][1]);
					if (/K/g.test(D[u][i][3])){
						D[u][i][3]=Number(D[u][i][3].substring(0,D[u][i][3].indexOf("K")));
					}else if(D[u][i][3]=="null"){
						D[u][i][3]=0;
					}else{
						D[u][i][3]=Number(D[u][i][3]);
					}
					if(D[u][i][0]=="FGC"){
						DATA[u][0][1].data.push([D[u][i][1],Number(D[u][i][2])*1000,Math.round(D[u][i][3]/1024*100)/100]);
					}else if(D[u][i][0]=="CMS"){
						DATA[u][0][2].data.push([D[u][i][1],Number(D[u][i][2])*1000,Math.round(D[u][i][3]/1024*100)/100]);
						DATA[u][0][4].data.push({y:Math.round(D[u][i][3]/1024*100/(Number(D[u][i][2])*1000))/100,x:D[u][i][1],marker:{symbol:'diamond'},name:"CMS"});
					}else{
						DATA[u][0][0].data.push([D[u][i][1],Number(D[u][i][2])*1000,Math.round(D[u][i][3]/1024*100)/100]);
						DATA[u][0][3].data.push([D[u][i][1],Math.round(D[u][i][3]/1024*100/(Number(D[u][i][2])*1000))/100]);
						DATA[u][1]+=Number(D[u][i][2])*1000;
					}
				}
			}
			DATA[u][1]=DATA[u][1]/l;
			DATA[u][2]=YGC[u];
		}
		return DATA;
	},
	turn_time2:function(t){
		t=new Date(t);
		t=[t.getFullYear(),t.getMonth()+1,t.getDate(),t.getHours(),t.getMinutes(),t.getSeconds()];
		for (var i=1,l=t.length;i<l;i++){
			if (t[i]<10){
				t[i]="0"+t[i];
			}
		}
		return t.join("");
	},
	turn_time:function(t){
		var T=[];
		T.push(t.substring(0,4));
		T.push(t.substring(4,6));
		T.push(t.substring(6,8));
		T.push(t.substring(8,10));
		T.push(t.substring(10,12));
		T.push(t.substring(12,14));
		T.push(t.substring(14,17));
		t=new Date(T[0],T[1]-1,T[2],Number(T[3])+8,T[4],T[5],T[6]).valueOf();
		return t;
	},
	data_column:function(D,data){
		var tm=time,base=(6300/30/16)+(35000/3/365)+(2600/365),E=[];//每台机器每天的机架成本*单台机器每天价格*网络设备成本
		base=base/1000/60/60/24*(tm[1]-tm[0]);
		for (var i=0,l=D.length;i<l;i++){
			D[i][0]=D[i][0]*(tm[1]-tm[0])/1000/10000000;
			D[i][1]=D[i][1]*(tm[1]-tm[0])/1000/10000000;
			D[i][2]=D[i][2]*(tm[1]-tm[0])/1000/1024/1024/1024*data.THJ.SER[i].length;
			D[i][3]=D[i][3]*(tm[1]-tm[0])/1000/1024/1024/1024*data.THJ.SER[i].length;
			E[i]=(D[i][0]+D[i][1])*0.1*6.2436+(D[i][2]+D[i][3])*0.05*6.2436;
				//D[i]=D[i]/(tm[1]-tm[0])*24*60*60*1000+base*data.THJ.SER[i].length;
			E[i]=E[i]+base*data.THJ.SER[i].length;
			D[i][0]=Math.round(D[i][0]*100)/100;
			D[i][1]=Math.round(D[i][1]*100)/100;
			D[i][2]=Math.round(D[i][2]*100)/100;
			D[i][3]=Math.round(D[i][3]*100)/100;
		}
		return [E,data.THJ.NAME,D];
	},
	//数据处理，将异步获取的数据处理成highcharts可使用的数据格式
	data_deal:function(D,data){
		D=D.replace(/[\r\n]/g,'');
		var patt=/\{/g,arry=[];
		if (patt.test(D)){
			D=D.replace(/\)\}/g,"").replace(/\{\(/g,"");
			D=D.split("&");
			if (D.length>2){
				var Z=D[1];
			}
			if (D[0]=="{}"){return false;}
			D=D[0].split("),(");
			for (var i=0,l=D.length;i<l;i++){
				D[i]=D[i].split(":");
			}
			var time_i=time,pingjun=[];
			for (var i=0,l=D.length;i<l;i++){
			//data[i].visible=(data[i].visible)?false:true;
				D[i][1]=D[i][1].split(",");
				if (data[i%data.length].except && data[i].except=="-"){//计算差值
					for (var j=1,le=D[i][1].length;j<le;j++){
						D[i][1][j-1]=Number(D[i][1][j-1]);
						D[i][1][j]=Number(D[i][1][j]);
						D[i][1][j-1]=D[i][1][j]-D[i][1][j-1];
						if (D[i][1][j-1]<0 && j>1){
							D[i][1][j-1]=D[i][1][j-2];
						}else if (D[i][1][j-1]<0 && j<1){
							D[i][1][j-1]=0;
						}
					}
					D[i][1][le-1]=null;
				}
				pingjun[i]=0;
				var inv=(time_i[1]-time_i[0])/(D[i][1].length-1),times=0;
				D[i][2]=false;
				if (chart_datas[0].comNum){
					times=data[i%chart_datas[0].comNum].times;
					if (!times){
						times=1;
					}
				}else {
					times=data[i].times;
				}
				for (var j=0,le=D[i][1].length;j<le;j++){
					if (D[i][1][j]==-0.1){
						D[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),null];
					}else {
						pingjun[i]+=Number(D[i][1][j]);
						D[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),Number(D[i][1][j])*times];
						D[i][2]=true;
					}
				};
				D[i][0]=D[i][0].replace(/[\r\n]/g,'');
				arry[i]={name:D[i][0],data:D[i][1],visible:false};
			}
			if (Z){
				Z=Z.split("),(");
				for (var i=0,l=Z.length;i<l;i++){
					Z[i]=Z[i].split(":");
				}
				var time_i=time;
				for (var i=0,l=D.length;i<l;i++){
				//data[i].visible=(data[i].visible)?false:true;
					Z[i][1]=Z[i][1].split(",");
					var inv=(time_i[1]-time_i[0])/(Z[i][1].length-1),xiao=100;
					for (var j=0,le=Z[i][1].length;j<le;j++){
						if (Z[i][1][j]!=-0.1){
							if (D[i][1][j][1]==null){
								Z[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),null];
							}else if (D[i][1][j][1]==0 || Number(Z[i][1][j])==0){
								Z[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),0];
							}else{
								Z[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),Math.round(D[i][1][j][1]/(Number(Z[i][1][j])*data[i].times)*100)/100];
							}
						}else if (Z[i][1][j]==-0.1 && D[i][1][j][1]==0){
							Z[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),0];
						}else{
							Z[i][1][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),D[i][1][j][1]];
						}
					}
					arry[i]={name:D[i][0],data:Z[i][1],visible:false};
				}
			}
			function get_max(A,N){
				var max=0;
				for (var i=0,l=A.length;i<l;i++){
					if(A[i]>A[max]) max=i;
				}
				A[max]=-1;
				if (N>1){
					max+=","+get_max(A,N-1);
				}
				return max;
			}
			var max=get_max(pingjun,3).split(",");
			for (var i=0,l=pingjun.length;i<l;i++){
				for (var j=0,l2=max.length;j<l2;j++){
					if (i==max[j]){
						arry[i].visible=true;
						break;
					}
				}
			}
		}else {
			D=D.split("&");
			var time_i=time,arry=[];
			for (var i=0,z=0,l=data.length;i<l;i++,z++){
				data[i].visible=(data[i].visible)?false:true;
				D[i]=D[i].split(",");
				var inv=(time_i[1]-time_i[0])/(D[i].length-1);
				if (data[i].times) data[i].times=Number(eval(data[i].times));
				for (var j=0,le=D[i].length;j<le;j++){			
					if (D[i][j]==-0.1) {
						D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),null];
					}else if (data[i].times) {
						D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),Number(D[i][j])*data[i].times];
					}else {
						D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),Number(D[i][j])];
					}
				}
				
				if(data[i].except=="/" || data[i].except=="/qtd"){//计算除法
					for (var u=0,ul=arry[z-1].data.length;u<ul;u++){
						if (D[i][u][1]==0){
							arry[z-1].data[u][1]=0;
						}else if (D[i][u][1]==null || arry[z-1].data[u][1]==null){
							arry[z-1].data[u][1]=null;
						}else {
							arry[z-1].data[u][1]=arry[z-1].data[u][1]/D[i][u][1];
						}
					}
					z--;
				}else if (data[i].except=="-"){//计算差值
					for (j=1;j<le;j++){
						D[i][j-1][1]=D[i][j][1]-D[i][j-1][1];
						if (D[i][j-1][1]<0 && j>1){
							D[i][j-1][1]=D[i][j-2][1];
						}else if (D[i][j-1][1]<0 && j<1){
							D[i][j-1][1]=0;
						}
					}
					D[i][le-1][1]=null;
					arry[z]={name:data[i].title,data:D[i],visible:data[i].visible};
				}else if (data[i].except=="-^/"){//先自减再反向除一条数据
					for (j=1;j<le;j++){
						D[i][j-1][1]=D[i][j][1]-D[i][j-1][1];
						if (D[i][j-1][1]<0 && j>1){
							D[i][j-1][1]=D[i][j-2][1];
						}else if (D[i][j-1][1]<0 && j<1){
							D[i][j-1][1]=0;
						}
					}
					D[i][le-1][1]=null;
					for (var u=0,ul=arry[z-1].data.length;u<ul;u++){
						if (arry[z-1].data[u][1]==0){
							arry[z-1].data[u][1]=0;
						}else {
							arry[z-1].data[u][1]=D[i][u][1]/arry[z-1].data[u][1];
						}
					}
					arry[z-1].data[u-1][1]=null;
					z--;
				}else if (data[i].except=="-+"){//先自减再加上一条数据
					for (j=1;j<le;j++){
						D[i][j-1][1]=D[i][j][1]-D[i][j-1][1];
						D[i][j-1][1]=D[i][j-1][1]<0?0:D[i][j-1][1];
					}
					D[i][le-1][1]=null;
					for (var u=0,ul=arry[z-1].data.length;u<ul;u++){
						arry[z-1].data[u][1]=arry[z-1].data[u][1]+D[i][u][1];
					}
					z--;
				}else {
					arry[z]={name:data[i].title,data:D[i],visible:data[i].visible}
				}
			}
		}
		return arry;
	},
	//生成表格
	data_table:function(D,data){
		D=D.split("&");
		var time_i=time,html="";
		for (var i=0,z=0,l=data.length;i<l;i++,z++){
			D[i]=D[i].split(",");
			var inv=(time_i[1]-time_i[0])/(D[i].length-1),xiao=0;
			if (data[i].xiaoshu){
				xiao=Math.pow(10,data[i].xiaoshu);
			}else {
				xiao=100;
				data[i].xiaoshu=2;
			}
			for (var j=0,le=D[i].length;j<le;j++){			
				if (D[i][j]==-0.1) {
					D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),null];
				}else if (data[i].times) {
					D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),Math.round(Number(D[i][j])*data[i].times*100)/100];
				}else {
					D[i][j]=[Math.round(time_i[0]+inv*j+(8*1000*60*60)),Math.round(Number(D[i][j])*100)/100];
				}
			}
			if (data[i].math=='average'){
				for (var j=0,le=D[i].length,average=0;j<le;j++){
					average+=Number(D[i][j][1]);
				}
				D[i]=Math.round(average/le*xiao)/xiao;
				if (!data[i].danwei) data[i].danwei="";
			}
			if (data[i].except=="td"){
				html+="<td>"+(D[i]+" "+data[i].danwei)+"</td></tr>";
			}else if (data[i].except=="/"){
				if (D[i]!=0){
					D[i-1]=D[i-1]/D[i];
				}else{
					D[i-1]=0;
				}
				if (data[i-1].title){
					html+="<tr><td>"+data[i-1].title+"</td><td>"+(Math.round(D[i-1]*100)/100+" "+data[i-1].danwei)+"</td>";
				}else{
					html+="<tr><td>"+data[i-1].zhibiao+"</td><td>"+(Math.round(D[i-1]*100)/100+" "+data[i-1].danwei)+"</td>";
				}
			}else if (data[i].except=="/qtd"){
				if (D[i]!=0){
					D[i-1]=D[i-1]/D[i];
				}else{
					D[i-1]=0;
				}
				var qk=D[i-3]-D[i-1],qk2="";
				if (data[i-1].danwei=="百万次"){
					qk2="<td class='all'>"+Math.round(D[i-1]*24*60*60/100000)/100+" "+data[i-1].danwei+"</td>";
				}else if(data[i-1].zhibiao=="hbase.regionserver.readResponseTime.rrdt" || data[i-1].zhibiao=="hbase.regionserver.readRequests.rrdt" ||  data[i-1].zhibiao=="hbase.regionserver.writeResponseTime.rrdt" || data[i-1].zhibiao=="hbase.regionserver.writeRequests.rrdt" || data[i-1].zhibiao=="hbase.regionserver.readRequests_sum_time.rrdt" || data[i-1].zhibiao=="hbase.regionserver.readRequests.rrdt" || data[i-1].zhibiao=="hbase.regionserver.writeRequests_sum_time.rrdt" || data[i-1].zhibiao=="hbase.regionserver.writeRequests_num_ops.rrdt"){
					qk2="<td class='all'>"+Math.round(D[i-1]*100)/100+" "+data[i-1].danwei+"</td>";
				}else{
					qk2="<td class='all'>"+Math.round(D[i-1]*24*60*60*100)/100+" "+data[i-1].danwei+"</td>";
				}
				if (D[i-1]==0){
					qk="<td class='red'><span class=''></span>----</td>";
				}else{
					if (qk>0){
						if ((qk/D[i-1])>=0.5){
							qk="<td class='red'><span class='down'></span>"+Math.round(qk/D[i-1]*10000)/100+"%</td>"
						}else{
							qk="<td><span class='down'></span>"+Math.round(qk/D[i-1]*10000)/100+"%</td>"
						}
					}else if (qk<0){
						if ((qk/D[i-1])<=-0.5){
							qk="<td class='red'><span class='up'></span>"+Math.round(-qk/D[i-1]*10000)/100+"%</td>"
						}else{
							qk="<td><span class='up'></span>"+Math.round(-qk/D[i-1]*10000)/100+"%</td>"
						}
					}else if (qk==0){
						qk="<td>没变化</td>"
					}
				}
				
				html+="<td>"+(Math.round(D[i-1]*100)/100+" "+data[i-1].danwei)+"</td>"+qk2+qk+"</tr>";
			}else if (data[i].except=="qtd"){
				var qk=D[i-1]-D[i],qk2="";
				if (data[i].danwei=="百万次"){
					qk2="<td class='all'>"+Math.round(D[i]*24*60*60/100000)/100+" "+data[i].danwei+"</td>";
				}else if(data[i].zhibiao=="hbase.regionserver.compactionTime_num_ops.rrdt" || data[i].zhibiao=="hbase.regionserver.flushSize_num_ops.rrdt"){
					qk2="<td class='all'>"+Math.round(D[i]*24*60*60/100)/100+" "+data[i].danwei+"</td>";
				}else if(data[i].zhibiao=="hbase.regionserver.blockCacheHitRatio.rrdt"){
					qk2="<td class='all'>"+Math.round(D[i]*100)/100+" "+data[i].danwei+"</td>";
				}else{
					qk2="<td class='all'>"+Math.round(D[i]*24*60*60*100)/100+" "+data[i].danwei+"</td>";
				}
				if (D[i]==0){
					qk="<td class='red'><span class=''></span>----</td>";
				}else{
					if (qk>0){
						if ((qk/D[i])>=0.5){
							qk="<td class='red'><span class='up'></span>"+Math.round(qk/D[i]*10000)/100+"%</td>";
						}else{
							qk="<td><span class='up'></span>"+Math.round(qk/D[i]*10000)/100+"%</td>";
						}
					}else if (qk<0){
						if ((qk/D[i])<=-0.5){
							qk="<td class='red'><span class='down'></span>"+Math.round(-qk/D[i]*10000)/100+"%</td>";
						}else{
							qk="<td><span class='down'></span>"+Math.round(-qk/D[i]*10000)/100+"%</td>";
						}
					}else if (qk==0){
						qk="<td>没变化</td>"
					}
				}
				html+="<td>"+(D[i]+" "+data[i].danwei)+"</td>"+qk2+qk+"</tr>";
			}else{
				if (data[i+1] && data[i+1].except && (data[i+1].except!="/" && data[i+1].except!="/qtd")){
					if (data[i].title){
						if (data[i].real && data[i].real=="all"){
							if (data[i].danwei=="百万次"){
								html+="<tr><td>"+data[i].title+"</td><td>"+(Math.round(D[i]*(time[1]-time[0])/100000000)/100+" "+data[i].danwei)+"</td>";	
							}else if(data[i].zhibiao=="hbase.regionserver.compactionTime_num_ops.rrdt" || data[i].zhibiao=="hbase.regionserver.flushSize_num_ops.rrdt"){
								html+="<tr><td>"+data[i].title+"</td><td>"+(Math.round(D[i]*(time[1]-time[0])/100000)/100+" "+data[i].danwei)+"</td>";	
							}else{
								html+="<tr><td>"+data[i].title+"</td><td>"+(D[i]*(time[1]-time[0])/1000+" "+data[i].danwei)+"</td>";	
							}
							
						}else{
							html+="<tr><td>"+data[i].title+"</td><td>"+(D[i]+" "+data[i].danwei)+"</td>";
						}
					}else{
						html+="<tr><td>"+data[i].zhibiao+"</td><td>"+(D[i]+" "+data[i].danwei)+"</td>";	
					}
				}
			}
		}
		return html;
	},
	//json格式
	history_table_json:function(D,data){
		D=D.replace(/[\n\r]/g,"").split("&");
		var html="",t=this;
		if (top.V){
			var E=t.clone(data);
			data=[];
			var V=top.V;
			for (var j=0,lj=E.length;j<lj;j++){
				if (!E[j].version || E[j].version==V[0]){
					data.push(E[j]);
				}else if (E[j].version<0 && -E[j].version!=V[0]){
					data.push(E[j]);
				}
			}
			V.shift();
		}
		for (var i=0,l=data.length;i<l;i+=2){
			D[i]=D[i].split(",");
			D[i+1]=D[i+1].split(",");
			var pinjun=0,pinjun2=0,max=0,V=0,Z=0;
			for (var j=0,le=D[i].length,z=0,z2=0;j<le;j++){	
				D[i][j]=Number(D[i][j]);
				D[i+1][j]=Number(D[i+1][j]);
				if (D[i][j]==-0.1) {
					D[i][j]=null;
				}else {
					if (D[i][j]>max) max=D[i][j];
					pinjun+=D[i][j];
					z++;
				}
				if (D[i+1][j]!=-0.1){//波动率
					pinjun2+=D[i+1][j];
					z2++;
					if (D[i][j]!=null){
						Z++;
						var dis=(D[i+1][j]-D[i][j])*100;
						if(D[i+1][j]>0){
						  dis=dis/D[i+1][j];
						}else if(D[i][j]>0){
						  dis=dis/D[i][j];
						}
						V+=Math.pow(dis,2);
					}
					
				}
			}
			V=Math.round(Math.sqrt(V)/Z*100)/100;
			pinjun=pinjun/z;
			pinjun2=pinjun2/z2;
			//alert(data);
			html+='{"title":"'+data[i].title+'","zhibiao":"'+data[i].zhibiao+'","pingjun":"'+pinjun+'","pingjun_history":"'+pinjun2+'","MAX":"'+max+'","bodong":"'+V+'"},';
		}
		html="["+html+"]";
		//html="<tr><td class='hj_tit'>平均值</td>"+html[0]+"</tr><tr><td class='hj_tit'>上周平均值</td>"+html[1]+"</tr><tr><td class='hj_tit'>最大值</td>"+html[2]+"</tr><tr><td class='hj_tit'>上周对比波动率</td>"+html[3]+"</tr>";
		return html;
	},
	//生成历史报表
	history_table:function(D,data){
		D=D.replace(/[\n\r]/g,"").split("&");
		var html=["","","",""];
		for (var i=0,l=data.length;i<l;i+=2){
			D[i]=D[i].split(",");
			D[i+1]=D[i+1].split(",");
			var xiao=0;
			if (data[i].xiaoshu){
				xiao=Math.pow(10,data[i].xiaoshu);
			}else {
				xiao=100;
				data[i].xiaoshu=2;
			}
			var pinjun=0,pinjun2=0,max=0,V=0,Z=0;
			for (var j=0,le=D[i].length,z=0,z2=0;j<le;j++){	
				D[i][j]=Number(D[i][j]);
				D[i+1][j]=Number(D[i+1][j]);
				if (D[i][j]==-0.1) {
					D[i][j]=null;
				}else {
					if (D[i][j]>max) max=D[i][j];
					pinjun+=D[i][j];
					z++;
				}
				if (D[i+1][j]!=-0.1){//波动率
					pinjun2+=D[i+1][j];
					z2++;
					if (D[i][j]!=null){
						Z++;
						var dis=(D[i+1][j]-D[i][j])*100;
						if(D[i+1][j]>0){
						  dis=dis/D[i+1][j];
						}else if(D[i][j]>0){
						  dis=dis/D[i][j];
						}
						V+=Math.pow(dis,2);
					}
					
				}
			}
			V=Math.round(Math.sqrt(V)/Z*100)/100;
			if (V>10)V="<span class='red'>"+V+"%</span>";
			else V=V+"%";
			pinjun=pinjun/z;
			pinjun2=pinjun2/z2;
			if (data[i].times){
				pinjun*=data[i].times;
				pinjun2*=data[i].times;
				max*=data[i].times;
			}
			pinjun=Math.round(pinjun*xiao)/xiao;
			pinjun2=Math.round(pinjun2*xiao)/xiao;
			max=Math.round(max*xiao)/xiao;
			if (data[i].danwei){
				pinjun+=data[i].danwei;
				pinjun2+=data[i].danwei;
				max+=data[i].danwei;
			}
			html[0]+="<td>"+pinjun+"</td>";
			html[1]+="<td>"+pinjun2+"</td>";
			html[2]+="<td>"+max+"</td>";
			html[3]+="<td>"+V+"</td>";
		}
		html="<tr><td class='hj_tit'>平均值</td>"+html[0]+"</tr><tr><td class='hj_tit'>最大值</td>"+html[2]+"</tr><tr><td class='hj_tit'>上周同日平均值</td>"+html[1]+"</tr><tr><td class='hj_tit'>上周对比波动率</td>"+html[3]+"</tr>";
		return html;
	},
	//生成图表
	show_charts:function(data, time, re) { //re代表是否是刷新数据
		var t = this;
		if (!/Statements.php/.test(location.href) && !/log_collection.php/.test(location.href)){
			chart_datas2 = t.clone(data);
		}
		var url=[];
		if (re){
			AjaxCrossDomainResponse=[];
		}
		for (var i=0,l=data.length;i<l;i++){
			data[i].y_title=data[i].y_title?data[i].y_title:'';
			data[i].id=data[i].id?data[i].id:'_auto'+i;
			if (!top.BOX && data[i].type!="gc_cost"){//不需要增加box
				if (!re){
					var Zt="";
					if (data[i].except=="get_max"){//需要显示当前环境所有服务器最高值的时候
						var temp_data=t.clone(data[i].data),tmp_srv=servers;
						data[i].data=[];
						for (var j=0,lj=tmp_srv.length;j<lj;j++){
							for (var z=0,lz=temp_data.length;z<lz;z++){
								temp_data[z].fwq=tmp_srv[j];
								data[i].data.push(t.clone(temp_data[z]));
							}
						}
						for (var z=0,lz=temp_data.length;z<lz;z++){
							delete temp_data[z].fwq;
							temp_data[z].fwq_all="";
							data[i].data.push(t.clone(temp_data[z]));
						}
					}
					for (var j=0,lj=data[i].data.length;j<lj;j++){
						if (!data[i].data[j].except || data[i].data[j].except=='-'){
							Zt+=data[i].data[j].title+"&";
						}
					}
					t.add_cbox(data[i].id,data[i].y_title,data[i].title,data[i].seat,data[i].type,Zt);
				}else{
					for (var j=0,lj=data[i].data.length;j<lj;j++){
						data[i].data[j].visible=!data[i].data[j].visible
					}
				}
			}
		}
		$(".charts_box .ADD_to_Statements").live("click",function(){//添加到自定义报表
			var f=$(this).parents(".charts_box");
			$.ajax({
				type: 'POST',
				url: "function/add_to_statements.php",
				data:{type:'list'},
				success: function(data){
					if (data==""){//还没有分类
						add_to();
					}else if (data=="1"){//分类数只有一个
						add_to("one");
					}else{//已有多个分类
						t.lightbox("add_to_statements",data);
						$(".chose_list li").click(function(){
							add_to($(this).attr("vid"));
							$(".lightbox .close").click();
						});
					}
				}
			});
			function add_to(id){
				var title="",type="",data='',y_tit='',except='';
				id=id?id:"";
				f=Number(f.attr("id").replace("charts_box_auto",""));
				f=chart_datas2[f];
				title=f.title;
				y_tit=f.y_title;
				type=f.type;
				except=f.except?f.except:'';
				for (var i=0,l=f.data.length;i<l;i++){
					if (type=="pie"){f.data[i].title=f.title}
					data+='{';
					for (var d in f.data[i]){
						data+='"'+d+'":"'+f.data[i][d]+'",';
					}
					data=data.substring(0,data.length-1);
					data+='},';
				}
				data=data.substring(0,data.length-1);
				$.ajax({
					type: 'POST',
					url: "function/add_to_statements.php",
					data:{type:'add',id:id,data:data,tit:title,ytit:y_tit,ty:type,ex:except},
					success: function(data){
						t.prompt("添加成功！");
					}
				});
			}
			

			return false;
		});
		$(".charts_box .data_mean").live("click",function(){//数据含义
			var Z=$(this).attr("zhibiao");
			var Zt=$(this).attr("ztit");
			$.ajax({
				type: 'POST',
				url: "function/get_mean.php",
				data:{ztit:Zt},
				success: function(data){
					t.lightbox("show_mean",data);
				}
			});
			return false;
		});
		//$.ajaxf.ready(function(){
			for (var i=0,l=data.length;i<l;i++){
				if (data[i].THJ){//当是显示整个机房时
					if (data[i].type=="pie"){
						url.push(t.url_pie(data[i].data,data[i].THJ));
					}else {
						url.push(t.url(data[i].data,data[i].FK,data[i].THJ));
					}
				}else {//当显示单个环境时
					if (data[i].type=="pie"){
						url.push(t.url_pie(data[i].data));
					}else if(data[i].type=="FY") {
						url.push(data[i].URL);
					}else if(data[i].type=="gc_cost"){
						url.push(CURL+"?gcType=HGC&&startTime="+t.turn_time2(time[0])+"&&endTime="+t.turn_time2(time[1])+"&&number=4");
					}else {
						url.push(t.url(data[i].data,data[i].FK));
					}
					if (power=='all'){//添加请求数据的链接
						$("#charts_box"+data[i].id+" .edit .data_link").attr('href',"http://"+url[i][0][0]+":"+url[i][0][1]+url[i][0][2]+"?"+url[i][1]+"&from="+url[i][2][0]+"&to="+url[i][2][1]);
					}
				}
			}
			gettext(0);
		//})
		//获得数据
		function gettext(j){
			var l=data.length;
			if (data[j].THJ){//当是显示整个机房时
				if (data[j].type=='table'){
					var THJ_data=[],l2=data[j].THJ.URL.length;
					function get_THJ_table(i){
						//$.ajaxf.post(url[j][i][0]+"&from="+url[j][i][2][0]+"&to="+url[j][i][2][1],'src='+url[j][i][1], function(r){
						 $.ajax({
							type: "post",
							url: "http://hbase.alibaba-inc.com/hbase/function/dataproxy.php",
							data:{ip:url[j][i][0][0],dk:url[j][i][0][1],url:url[j][i][0][2],cs:url[j][i][1]+"&from="+url[j][i][2][0]+"&to="+url[j][i][2][1]},
							success: function(data){
								THJ_data.push(t.del_error(data));
								if (i==(l2-1)){
									THJ_data[0]=THJ_data[0].replace(/\r\n/g,"");
									THJ_data[0]=THJ_data[0].split("&");
									for (var z=1,lz=THJ_data.length;z<lz;z++){
										THJ_data[z]=THJ_data[z].split("&");
										for (var y=0,ly=THJ_data[0].length-1;y<ly;y++){
											THJ_data[z][y]=THJ_data[z][y].replace(/\r\n/g,"");
											THJ_data[0][y]+=","+THJ_data[z][y];
										}
									}
									THJ_data[0]=THJ_data[0].join("&").replace(/\r\n/g,"");
									AjaxCrossDomainResponse.push(THJ_data[0]);
									start_show(j);
								}else{
									get_THJ_table(i+1);
								}
							}
						});
						//},'text');
					}
					get_THJ_table(0);
				}else if (data[j].type=='column'){
					var THJ_data=[],l2=data[j].THJ.URL.length;
					function get_THJ3(i){
						//$.ajaxf.post("http://"+url[j][i][0][0]+":"+url[j][i][0][1]+url[j][i][0][2],url[j][i][1], function(r){
						$.ajax({
							type: "post",
							url: "http://hbase.alibaba-inc.com/hbase/function/dataproxy.php",
							data:{ip:url[j][i][0][0],dk:url[j][i][0][1],url:url[j][i][0][2],cs:url[j][i][1]+"&from="+url[j][i][2][0]+"&to="+url[j][i][2][1]},
							success: function(data){
								THJ_data.push(t.del_error(data));
								if (i==(l2-1)){
									for (var z=0,lz=THJ_data.length;z<lz;z++){
										THJ_data[z]=THJ_data[z].replace(/\r\n/g,"");
										THJ_data[z]=THJ_data[z].split("&");
										THJ_data[z].pop();
										for (var y=0,ly=THJ_data[z].length;y<ly;y++){
											THJ_data[z][y]=THJ_data[z][y].split(",");
											for (var p=0,tp=0,lp=THJ_data[z][y].length,zp=0;p<lp;p++){
												THJ_data[z][y][p]=Number(THJ_data[z][y][p]);
												if (THJ_data[z][y][p]<0){
													THJ_data[z][y][p]=null;
												}else{
													tp+=THJ_data[z][y][p];
													zp++;
												}
											}
											if (zp==0){
												THJ_data[z][y]=0;
											}else{
												THJ_data[z][y]=tp/zp;
											}
										}
									}
									AjaxCrossDomainResponse.push(THJ_data);
									start_show(j);
								}else{
									get_THJ3(i+1);
								}
							}
						});
						//},'text');
					}
					get_THJ3(0);
				}else if (data[j].type=='history_sta'){
					if (!top.BOX){
						json_link(j);
					}
					var l2=data[j].THJ.URL.length,history_time=top.time[0];
					history_time=new Date(history_time);
					//alert(history_time);
					history_time=[history_time.getFullYear(),history_time.getMonth()+1,history_time.getDate()];
					history_time[1]=history_time[1]<10?"0"+history_time[1]:history_time[1];
					history_time[2]=history_time[2]<10?"0"+history_time[2]:history_time[2];
					history_time=history_time.join("-");
					function get_THJ(i){
						$.ajax({
							type: "post",
							url: "function/get_history_sta.php",
							data:{id:data[j].THJ.ID[i],date:history_time},
							success: function(MSG){
								if (MSG=="error"){//数据库中没有
									get_datas(i,j,history_time);
								}else{//数据库中有记录
									MSG=MSG.split("[&@]");
									var zhibiao=MSG[1],zt="";
									zhibiao=zhibiao.split(",");
									zhibiao.pop();
									if (chart_datas[j].data.length==zhibiao.length*2){
										for (var z=0,lz=chart_datas[j].data.length;z<lz;z+=2){
											zt=data[j].data[z].zhibiao;
											if(new RegExp(zt).test(zhibiao)==false){
												zt=false;
												break;
											}
										}
									}else zt=false;
									if (zt){
										MSG=MSG[0];
										MSG=eval('('+MSG+')');//转json格式
										if (!top.BOX){
											if (i==0){
												var title="";
												for (var zz=0,lzz=MSG.length;zz<lzz;zz++){
													title+="<th>"+MSG[zz].title+"</th>";
												}
												$("#chart_"+data[i].id).find(".loading").before("<table class='history_table'><tr><th colspan='2' >环境</th>"+title+"</tr></table>");
											}
											if (i>=data[j].THJ.HBN.length-1){
												$("#chart_"+data[j].id).find(".loading").remove();
											}
											MSG=show_json(MSG,data[j].THJ.HBN[i],data[j].data);
											$("#chart_"+data[j].id).find("table").append($(MSG));
										}else{//不需要box  转换为json
											if (i==0) top.BOX="";
											var dt=0,dd=0,dx=100,J="",D2=chart_datas[j].data;
											if (top.V){
												var E=t.clone(D2);
												D2=[];
												var V=top.V;
												for (var jz=0,ljz=E.length;jz<ljz;jz++){
													if (!E[jz].version || E[jz].version==V[0]){
														D2.push(E[jz]);
													}else if (E[jz].version<0 && -E[jz].version!=V[0]){
														D2.push(E[jz]);
													}
												}
												V.shift();
											}
											for (w=0,lw=D2.length;w<lw;w+=2){
												dt=D2[w].times?D2[w].times:1;
												dd=D2[w].danwei?D2[w].danwei:"";
												dx=D2[w].xiao?Math.pow(10,D2[w].xiao):100;
												MSG[w/2].pingjun=Math.round(MSG[w/2].pingjun*dt*dx)/dx+dd;
												MSG[w/2].pingjun_history=Math.round(MSG[w/2].pingjun_history*dt*dx)/dx+dd;
												MSG[w/2].MAX=Math.round(MSG[w/2].MAX*dt*dx)/dx+dd;
												J+='{"title":"'+MSG[w/2].title+'","pingjun":"'+MSG[w/2].pingjun+'","pingjun_history":"'+MSG[w/2].pingjun_history+'","MAX":"'+MSG[w/2].MAX+'","bodong":"'+MSG[w/2].bodong+'%"},';
											}
											top.BOX+="{name:'"+data[j].THJ.HBN[i]+"',data:["+J+"]},";
											if (i>=data[j].THJ.HBN.length-1){
												$("body").html(top.BOX);
											}
										}
										if (i<(l2-1)){
											get_THJ(i+1);
										}
									}else{//指标不符合 重新异步读取数据更新数据库
										get_datas(i,j,history_time,'R');
									}
								}
							}
						});
					}
					function get_datas(i,j,time,R){
						//$.ajaxf.post(url[j][i][0]+"&from="+url[j][i][2][0]+"&to="+url[j][i][2][1],'src='+url[j][i][1], function(r){
						$.ajax({
							type: "post",
							url: "http://hbase.alibaba-inc.com/hbase/function/dataproxy.php",
							data:{ip:url[j][i][0][0],dk:url[j][i][0][1],url:url[j][i][0][2],cs:url[j][i][1]+"&from="+url[j][i][2][0]+"&to="+url[j][i][2][1]},
							success: function(r){
								r=t.del_error(r);
								var json_data=t.history_table_json(r,data[j].data),zhibiao="",zt="";
								for (var z=0,lz=chart_datas[j].data.length;z<lz;z+=2){
									zhibiao+=chart_datas[j].data[z].zhibiao+",";
								}
								var title='';
								R=R?R:'F'
								$.ajax({
									type: "post",
									url: "function/get_history_sta.php",
									data:{id:data[j].THJ.ID[i],date:time,data:json_data,zhibiao:zhibiao,re:R,V:data[j].version}
								});
								MSG=eval('('+json_data+')');//转json格式
								
								if (!top.BOX){
									if (i==0){
										var title="";
										for (var zz=0,lzz=MSG.length;zz<lzz;zz++){
											title+="<th>"+MSG[zz].title+"</th>";
										}
										$("#chart_"+data[i].id).find(".loading").before("<table class='history_table'><tr><th colspan='2' >环境</th>"+title+"</tr></table>");
									}
									if (i>=data[j].THJ.HBN.length-1){
										$("#chart_"+data[j].id).find(".loading").remove();
									}
									MSG=show_json(MSG,data[j].THJ.HBN[i],data[j].data);
									$("#chart_"+data[j].id).find("table").append($(MSG));
								}else{//不需要box  转换为json
									if (i==0) top.BOX="";
									var dt=0,dd=0,dx=100,J="";
									for (w=0,lw=chart_datas[j].data.length;w<lw;w+=2){
										dt=chart_datas[j].data[w].times?chart_datas[j].data[w].times:1;
										dd=chart_datas[j].data[w].danwei?chart_datas[j].data[w].danwei:"";
										dx=chart_datas[j].data[w].xiao?Math.pow(10,chart_datas[j].data[w].xiao):100;
										MSG[w/2].pingjun=Math.round(MSG[w/2].pingjun*dt*dx)/dx+dd;
										MSG[w/2].pingjun_history=Math.round(MSG[w/2].pingjun_history*dt*dx)/dx+dd;
										MSG[w/2].MAX=Math.round(MSG[w/2].MAX*dt*dx)/dx+dd;
										J+='{"title":"'+MSG[w/2].title+'","pingjun":"'+MSG[w/2].pingjun+'","pingjun_history":"'+MSG[w/2].pingjun_history+'","MAX":"'+MSG[w/2].MAX+'","bodong":"'+MSG[w/2].bodong+'%"},';
									}
									top.BOX+="{name:'"+data[j].THJ.HBN[i]+"',data:["+J+"]},";
									if (i>=data[j].THJ.HBN.length-1){
										$("body").html(top.BOX);
									}
								}
								if (i<(l2-1)){
									get_THJ(i+1);
								}
							}
						});
						//},'text');
					}
					get_THJ(0);
				}
			}else {
				if (chart_datas[j].type=="gc_cost"){
					var J=time[1]-time[0],SEV=servers,P_DATE=[];
					function add_url(s){
						$.ajax({
							type: "post",
							url: "function/file_get_contents.php",
							data:{URL:url[j]+"&&ip="+SEV[s]+"&&limit=240"},
							success: function(data){
								data=data.substring(data.indexOf("<body>")+6,data.length);
								data=data.substring(0,data.indexOf("</body>"));
								$.ajax({
									type: "post",
									url: "function/file_get_contents.php",
									data:{URL:url[j]+"&&ip="+SEV[s]+"&&limit=0"},
									success: function(data2){
										data2=data2.substring(data2.indexOf("<body>")+6,data2.length);
										data2=data2.substring(0,data2.indexOf("</body>"));
										var YGC=0;
										while (/YGC/.test(data2)){
											data2=data2.replace("YGC","");
											YGC++;
										}
										P_DATE.push(data+"{}"+YGC);
										if (s<SEV.length-1){
											add_url(s+1);
										}else{
											AjaxCrossDomainResponse.push(P_DATE.join("&"));
											start_show(j);
										}
									}
								});
							}
						});
					}
					add_url(0);
				}else{
					$.ajax({
						type: "post",
						url: "http://hbase.alibaba-inc.com/hbase/function/dataproxy.php",
						data:{ip:url[j][0][0],dk:url[j][0][1],url:url[j][0][2],cs:url[j][1]+"&from="+url[j][2][0]+"&to="+url[j][2][1]},
						success: function(data){
							AjaxCrossDomainResponse.push(t.del_error(data));
							start_show(j);
							if (j<(l-1)){
								gettext(j+1);
							}
						}
					});
				}
			}
		}
		function json_link(j){
			var atime=top.time;
			atime=[new Date(atime[0]),new Date(atime[1])];
			function getNum(N){
				if (N<10) N="0"+N;
				return N;
			}
			atime[0]=atime[0].getFullYear()+"-"+getNum(atime[0].getMonth()+1)+"-"+getNum(atime[0].getDate())+" 00:00:00";
			atime[1]=atime[1].getFullYear()+"-"+getNum(atime[1].getMonth()+1)+"-"+getNum(atime[1].getDate())+" 00:00:00";
			$("#charts_box"+data[j].id+" .edit").html("<span title='操作'>更多操作</span><ul><li><a target='_blank' href='detail_all.php?from="+atime[0]+"&to="+atime[1]+"&RS=all&AS="+data[j].THJ.ID[0]+"&V="+version+"'>json格式数据</a></li></ul>");
		}
		function show_json(D,N,T){
			var html="<td class='hj_tit' rowspan='4'>"+N+"</td><td class='hj_tit'>平均值</td>",athoer=[];
			for (var i=0,l=T.length-1,z=0;i<l;i+=2,z++){
				athoer[z]=[];
				athoer[z][0]=T[i].times?T[i].times:1;
				athoer[z][1]=T[i].xiaoshu?Math.pow(10,T[i].xiaoshu):100;
				athoer[z][2]=T[i].danwei?T[i].danwei:"";
			}
			for (var i=0,l=D.length;i<l;i++){
				html+="<td>"+(Math.round(D[i].pingjun*athoer[i][0]*athoer[i][1])/athoer[i][1]+athoer[i][2])+"</td>";
			}
			html+="</tr><tr><td class='hj_tit'>最大值</td>";
			for (var i=0,l=D.length;i<l;i++){
				html+="<td>"+(Math.round(D[i].MAX*athoer[i][0]*athoer[i][1])/athoer[i][1]+athoer[i][2])+"</td>";
			}
			html="<tr>"+html+"</tr><tr><td class='hj_tit'>上周同日平均值</td>";
			for (var i=0,l=D.length;i<l;i++){
				html+="<td>"+(Math.round(D[i].pingjun_history*athoer[i][0]*athoer[i][1])/athoer[i][1]+athoer[i][2])+"</td>";
			}
			
			html+="</tr><tr><td class='hj_tit'>上周对比波动率</td>";
			for (var i=0,l=D.length;i<l;i++){
				if (Number(D[i].bodong)>10) D[i].bodong="<span class='red'>"+D[i].bodong+"%</span>";
				else D[i].bodong+="%";
				html+="<td>"+D[i].bodong+"</td>";
			}
			html+="</tr>";
			return html;
		}
		function start_show(i){
			if (data[i].ifchild=='Y'){//当需要单独输出每个数据时
				if (data[i].type=="line"){
					var charts_data2=t.data_deal_pie(AjaxCrossDomainResponse[i],data[i].data,'false',data[i].comNum);
					var charts_data=t.data_deal(AjaxCrossDomainResponse[i],data[i].data);
					var l_num=charts_data.length/7*20+350,charts_data3=[];
					if (data[i].Ret){
						l_num=data[i].Ret/7*20+350;
						for (var j=0,l=charts_data.length;j<l;j++){
							if (j%2==1){
								for (var z=0,lz=charts_data[j].data.length;z<lz;z++){
									if (charts_data[j-1].data[z][1]!=0 && charts_data[j].data[z][1]!=0){
										charts_data[j].data[z][1]=charts_data[j].data[z][1]/charts_data[j-1].data[z][1];
									}
								}
							}
						}
						for (var j=0,l=charts_data.length;(j<data[i].Ret && j<l);j++){
							charts_data3.push(charts_data[j]);
						}
						var charts_data4=[];
						for (var j=0,l=charts_data2.length;(j<data[i].Ret && j<l);j++){
							charts_data4.push(charts_data2[j]);
						}
						charts_data2=charts_data4;
					}
					for (var j=charts_data.lenth;j>=0;j--){
						charts_data[j].type='spline';
					}
					var obj={
						allowPointSelect:true,
						center:[-165, 155],
						cursor:"pointer",
						data:charts_data2,
						dataLabels:{
							enabled:true,
							formatter:function(){
								return this.point.name.split('.')[0];
							}
						},
						name:"pie",
						showInLegend:false,
						type:"pie"
					}
					var l2=charts_data.length;
					if (data[i].comNum){//N条数据显示在一个小格里
						l2=l2/data[i].comNum;
					}
					for (var j=0,z=0;j<l2;j++,z++){
						if (j%3=='0'){
							var set='left_charts';
						}else if (j%3=='1'){
							var set='mid_charts';
						}else if (j%3=='2'){
							var set='right_charts';
						}
						if(!re) {
							if (data[i].comNum){//N条数据显示在一个小格里
								var gname=charts_data[z].name;
								if(gname.indexOf("_")!=-1){
									gname=gname.substring(0,gname.indexOf("_"));
								}
								t.add_cbox('_child'+j,'value',gname,set);
								z+=data[i].comNum-1;
							}else {
								t.add_cbox('_child'+j,'value',charts_data[z].name,set);
							}
						}
					}
					$("#chart__auto0").height(l_num);
					if (data[i].Ret){
						charts_data3.push(obj);
						t.charts_line_pie(charts_data3,data[i]);
					}else{
						charts_data.push(obj);
						t.charts_line_pie(charts_data,data[i]);
					}
					for (var z=0,lz=charts_data.length;z<lz;z++){
						charts_data[z].visible=true;
					}
					t.for_show(charts_data,data[i]);
				}else if (data[i].type=="gc_cost"){
					var charts_data=t.data_FY(AjaxCrossDomainResponse[i],data[i]),SEV=servers;
					for (var j=0,lj=data[i].data.length,html="",set="";j<lj;j++){
						if (lj==1){//只有一个显示大图
							t.add_cbox('_child'+j,data[i].y_title,data[i].data[j].title,"top_area");
							$("#charts_box_child"+j+" .data_link").attr("href","function/gc_url.php?url="+url[i].replace("http://","").replace(/&&/g,"&")+"&ip="+SEV[j]+"&limit=240");
							t.charts_scatter(charts_data[j][0],data[i],'_child'+j,charts_data[j][1],charts_data[j][2]);
						}else{
							if (j%3=='0'){
								set='left_charts';
							}else if (j%3=='1'){
								set='mid_charts';
							}else if (j%3=='2'){
								set='right_charts';
							}
							t.add_cbox('_child'+j,data[i].y_title,data[i].data[j].title,set);
							$("#charts_box_child"+j+" .edit").show();
							$("#charts_box_child"+j+" .data_link").attr("href","function/gc_url.php?url="+url[i].replace("http://","").replace(/&&/g,"&")+"&ip="+SEV[j]+"&limit=240");
							t.charts_scatter(charts_data[j][0],data[i],'_child'+j,charts_data[j][1],charts_data[j][2]);
						}
					}
				}
			}else{
				if (data[i].type=="line" && !Im){
					if (data[i].except=='get_max'){
						var charts_data=t.data_deal_max(AjaxCrossDomainResponse[i],data[i]);
					}else{
						var charts_data=t.data_deal(AjaxCrossDomainResponse[i],data[i].data);
					}
					t.charts_line(charts_data,data[i]);
				}else if (data[i].type=="pie"){
					var charts_data=t.data_deal_pie(AjaxCrossDomainResponse[i],data[i].data);
					if (charts_data){
						t.charts_pie(charts_data,data[i]);
					}else {
						$("#chart_"+data[i].id).prev().prev().html("<table><tbody><tr><td class='b'>总计</td><td class='red b'></td><td></td></tr><tr><td class='b'>平均值No.1</td><td class='red b'></td><td></td></tr><tr><td class='b'>平均值No.2</td><td class='red b'></td><td></td></tr><tr><td class='b'>平均值No.3</td><td class='red b' ></td> <td></td></tr></tbody></table>");
						$("#chart_"+data[i].id).html("<p class='loading'>暂无数据</p>");
					}
				}else if (data[i].type=="line_pie"){
					t.charts_line_pie(data[i].id,t.data_deal(AjaxCrossDomainResponse[i],data[i].data),data[i].y_title,data[i].title,data[i].seat,danwei);
				}else if (data[i].type=="pie" && (Im && Im>=5)){//即时更新 饼图
					var charts_data=t.data_deal_pie(AjaxCrossDomainResponse[i],data[i].data);
					if (charts_data){
						t.charts_pie(charts_data,data[i]);
					}else {
						$("#chart_"+data[i].id).html("<p class='loading'>暂无数据</p>");
					}
				}else if (data[i].type=="line" && (Im && Im>=5)){//即时更新 折线
					var charts_data=t.data_deal(AjaxCrossDomainResponse[i],data[i].data);
					t.dynamic_line(charts_data,data[i],url[i]);
				}else if (data[i].type=="table"){
					var charts_data=t.data_table(AjaxCrossDomainResponse[i],data[i].data);
					charts_data="<table><tr><th>指标</th><th>"+data[i].th.join("</th><th>")+"</th></tr>"+charts_data+"</table>";
					$("#chart_"+data[i].id).empty().append($(charts_data));
				}else if (data[i].type=="column"){
					var charts_data=t.data_column(AjaxCrossDomainResponse[i],data[i]);
					if (DATE=="Yesterday"){
						for (var h=0,lh=charts_data[0].length,bill=[];h<lh;h++){
							bill.push('"'+charts_data[1][h]+'":{"V":'+charts_data[0][h]+',"D":['+charts_data[2][h][0]+','+charts_data[2][h][1]+','+charts_data[2][h][2]+','+charts_data[2][h][3]+']}');
						}

						bill=bill.join(",");
						bill='{'+bill+'}';
						$.ajax({
							type: 'POST',
							url: "function/get_bill.php",
							data:{room_id:jiqun,date:DATE2,type:"save",data:bill},
						});
					}
					t.charts_column(charts_data,data[i]);
				}else if (data[i].type=="FY"){
					var charts_data=t.data_FY(AjaxCrossDomainResponse[i],data[i]);
					if (charts_data[0].data.length<100){
						t.charts_FY(charts_data,data[i]);//折线
					}else{
						t.charts_scatter(charts_data,data[i]);//离散图
					}
				}
			}
		}
	},
	for_show:function(D,obj){
		var t=this,nobj={title:'',id:'',data:[],ifchild:'',enabled:''},Di=[];
		for (var i=0,l=D.length,z=0;i<l;i++){
			if (obj.data[0].zhibiao==''){//当第一组数据无指标时
				nobj.data[0]=obj.data[0];
			}else{
				for (var j=0,lj=obj.data.length;j<lj;j++){
					if (obj.data[j].title==D[i].name){
						break;
					}
				}
				nobj.enabled=false;
				nobj.data[0]=obj.data[j];
			}
			nobj.title=D[i].name;
			if (obj.comNum && (i+1)%obj.comNum!=0){
				Di[(i+1)%obj.comNum]=D[i];
				nobj.data[(i+1)%obj.comNum]=obj.data[(i+1)%obj.comNum];
				nobj.enabled=true;
			}else {
				Di[0]=D[i];
				nobj.id='_child'+z;
				nobj.ifchild='Y';
				z++;
			}
			if ((!obj.comNum) || (obj.comNum && (i+1)%obj.comNum==0)){
				t.charts_line(Di,nobj);
			}
		}
	},
	charts_pie:function(D,data){
		var t=this,ID=data.id;
		if (data.data[0].danwei){
			var danwei=data.data[0].danwei+" ";
		}else {
			var danwei='    ';
		}
		if (data.data[0].xiaoshu){
			var xiaoshu=Math.pow(10,data.data[0].xiaoshu);
		}else {
			var xiaoshu=100;
		}
		$("#chart_"+ID).empty();
		if (data.top){//显示排行
			var all=0;
			for (var i=1,l=D.length;i<l;i++){
				all+=D[i][1];
			}
			all=Highcharts.numberFormat(D[0].y+all,0);
			var html="<table><tr><td class='b'>总计&nbsp;</td><td class='red b'>"+(all+danwei)+"</td><td></td></tr><tr><td class='b'>平均值No.1</td><td class='red b' title='"+D[0].name+"'>"+D[0].name+"</td><td>"+Math.round(D[0].y*xiaoshu)/xiaoshu+" "+danwei+"</td></tr>";
			for (var i=1;i<data.top;i++){
				if (D[i]){
					html+="<tr><td class='b'>平均值No."+(i+1)+"</td><td class='red b' title='"+D[i][0]+"'>"+D[i][0]+"</td> <td>"+Math.round(D[i][1]*xiaoshu)/xiaoshu+" "+danwei+"</td></tr>";
				}else{
					html+="<tr><td colspan=3>&nbsp;</td></tr>";
				}
			}
			html+="</table>";
			$("#chart_"+ID).prev().prev().empty().append(html);
		}
		$(document).ready(function() {
			var chart = new Highcharts.Chart({
				chart: {
					renderTo:"chart_"+ID,
					plotBackgroundColor: null,
					plotBorderWidth: null,
					plotShadow: false
				},
				title: {
					text: ''
				},
				tooltip: {
					formatter: function() {
						return '<b>'+ this.point.name +'</b>: '+ Highcharts.numberFormat(this.y,0)+danwei+ Math.round(this.percentage*100)/100 +' %';
					}
				},
				plotOptions: {
					pie: {
						allowPointSelect: true,
						cursor: 'pointer',
						dataLabels: {
							enabled: true,
							color: '#000000',
							connectorColor: '#000000',
							formatter: function() {
								var t=this.point.name;
								if(this.point.name.indexOf(".")>1){
									t=this.point.name.substring(0,this.point.name.indexOf("."));
								}
								if (!new RegExp(/^[A-Za-z]/g).test(t)){
									return this.point.name;
								}else return t;
								
							}
						}
					}
				},
			    series: [{
					type: 'pie',
					name: 'Browser share',
					data:D
				}]
			});
		});
	},
	//生成折线+饼图的图表
	charts_line_pie: function(D,data) {
		var t=this,ID=data.id;
		for (var mean=[],i=0,l=D[0].data.length;i<l;i++){
			mean.push(Number(D[0].data[i][1]));
		}
		data.enabled=(data.enabled==false)?false:true;
		$("#chart_"+ID).empty();
		data.data[0].danwei=data.data[0].danwei?data.data[0].danwei:'';
		t.show_mean(D[0].name,mean,"#00A8F0",ID,data.data[0].danwei,data.data[0].xiaoshu);
		if (data.top){//显示排行
			//删除无效的data数据
			var data2=t.clone(data);//对data里一些没用的数据进行删除
			data.data=[];
			for (var i=data2.data.length-1;i>=0;i--){
				for (var j=D.length-1;j>=0;j--){
					if (D[j].name==data2.data[i].title){//找到相同的名称
						data.data.unshift(data2.data[i]);
					}
				}
			}
			delete data2;//删除没用的对象
			var arry=[],arry2=[],all=0;
			for (var i=0,l=D.length;i<l;i++){//计算平均值
				arry[i]=0;
				for (j=0,lj=D[i].data.length;j<lj;j++){
					arry[i]+=D[i].data[j][1];
				}
				arry2[i]=arry[i]=arry[i]/lj;
				
				all+=arry[i];
			}
			function get_max(A,N){//排序
				var max=0;
				for (var i=0,l=A.length;i<l;i++){
					if(A[i]>A[max]) max=i;
				}
				A[max]=-1;
				if (N>1){
					max+=","+get_max(A,N-1);
				}
				return max;
			}
			if (data.top<arry2.length){
				var max=get_max(arry2,data.top).split(",");
			}else if (arry2.length==1){
				var max=[0];
			}else {
				var max=get_max(arry2,arry2.length).split(",");
			}
			all=Highcharts.numberFormat(all,2);
			var html="<table><tr><td class='b'>总计&nbsp;</td><td class='red b'>"+all+"</td><td></td></tr>";
			for (var i=0;i<data.top;i++){
				if (D[max[i]]){
					var danwei='',xiaoshu=2;
					if (data.data[max[i]].danwei) danwei=data.data[max[i]].danwei;
					if (data.data[max[i]].xiaoshu) xiaoshu=data.data[max[i]].xiaoshu;
					html+="<tr><td class='b'>平均值No."+(i+1)+"</td><td class='red b' title='"+D[max[i]].name+"'>"+D[max[i]].name+"</td><td> "+Highcharts.numberFormat(arry[max[i]],xiaoshu)+" "+danwei+"</td></tr>";
				}else{
					html+="<tr><td colspan=3>&nbsp;</td></tr>";
				}
			}
			html=html+"</table>"+data.y_title;
			$("#chart_"+ID).prev().prev().empty().append(html);
		}//排行结束
		var chart= new Highcharts.Chart({
			chart: {
				renderTo:"chart_"+data.id,
				defaultSeriesType: 'spline',//平滑
				marginLeft:350,
				//animation:false,
				zoomType: 'xy'//放大镜
			},
			title: {
				text: ''
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text:""//纵坐标标题
				},
				min:0,
				startOnTick: true
			},
			labels: {
				items: [{
					html: '比例图',
					style: {
						left: '-185px',
						top: '0px',
						color: 'black'				
					}
				}]
			},
			tooltip: {
				formatter: function() {
					if (this.point.name){
						var val=Highcharts.numberFormat(this.y,0);
						return '<b>'+ this.point.name +'</b>'+': '+ val+' '+ Highcharts.numberFormat(this.percentage,2)+' %';
					};
					return '<b>'+ this.series.name +'</b><br/>'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +'<br/>'+Highcharts.numberFormat(this.y, 2)+' '+data.data[this.series.index].danwei;
				}
			},
			legend: {
				enabled: data.enabled
			},
			plotOptions: {
				spline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					animation:false,//是否在显示报表的时候使用动画
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 5,
								lineWidth: 1
							}
						}	
					},
					events:{//监听点的鼠标事件
						click: function(event) {
							var danwe='',xiaoshu='';
							for (var j=0,jl=data.data.length;j<jl;j++){
								if (data.data[j].title==this.name){
									danwei=data.data[j].danwei;
									xiaoshu=data.data[j].xiaoshu;
									break;
								}
							}
							t.show_mean(this.name,this.data,this.color,ID,danwei,xiaoshu);
						}
					},
					pointInterval: 3600000, // one hour
					pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
				}
			},
			series:D,
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		});
	},
	clone:function(Obj) {//深度克隆
        var buf,t=this;   
        if (Obj instanceof Array) {   
            buf = [];  //创建一个空的数组 
            var i = Obj.length;   
            while (i--) {   
                buf[i] = t.clone(Obj[i]);   
            }   
            return buf;
        }else if (Obj instanceof Object){   
            buf = {};  //创建一个空对象 
            for (var k in Obj) {  //为这个对象添加新的属性 
                buf[k] = t.clone(Obj[k]);   
            }   
            return buf;   
        }else{   
            return Obj;   
        }   
    },
	//生成柱状图
	charts_column: function(D,data){
		var t=this,ID=data.id;
		function setChart(name, categories, data, color) {
			chart.xAxis[0].setCategories(categories, false);
			chart.series[0].remove(false);
			chart.addSeries({
			name: name,
			data: data,
			color: color || '#000'
			}, false);
			chart.redraw();
		} 
		var chart = new Highcharts.Chart({
            chart: {
                renderTo:"chart_"+ID,
				animation:false,
                type:'column'
            },
            title: {
                text:''
            },
            xAxis: {
                categories:D[1],
                labels: {
                    rotation:-45,
					align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                formatter: function() {
                    var point = this.point,s="";
					s+="读请求:"+D[2][point.x][0]+"百万次";
					s+="<br/>写请求:"+D[2][point.x][1]+"百万次";
					s+="<br/>集群网络流量 In:"+D[2][point.x][2]+"G";
					s+="<br/>集群网络流量 Out:"+D[2][point.x][3]+"G";
					return s;
                }
            },
			plotOptions: {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function() {
								if (D[0][0].color){
									var drilldown = this.drilldown;
									if (drilldown) { // drill down
										setChart(drilldown.name, drilldown.categories, drilldown.data, drilldown.color);
									} else { // restore
										setChart('Population',D[1], D[0]);
									}
								}
                                
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function() {
                            return this.y+" "+data.y_title;
                        }
                    }
                }
            },
            series: [{
                name: 'Population',
                data: D[0],
                dataLabels: {
					enabled: true,
					style: {
						fontWeight: 'bold'
					},
					formatter: function() {
						return '<b style="color:#000;">'+ Math.round(this.y*100)/100+''+data.y_title+'</b>';
					}
				}
            }]
        });
	},
	//离散图表
	charts_scatter:function(D,data,id,P,Y){
		var t=this,ID=id,if_dbl=false;
		$("#chart_"+ID).empty();
		$("#charts_box"+ID+" .mean").show();
		$("#charts_box"+ID+" .mean .point").css('background',"#00A8F0").after('<span class="val"><b>YGC</b> 平均值为：<strong class="red">'+Math.round(P*100)/100+'</strong> ms  '+Math.round(Y/(time[1]-time[0])*6000000)/100+'次/分钟</span>');
		var chart = new Highcharts.Chart({
            chart: {
                renderTo:'chart_'+ID,
				animation:false,
                zoomType: 'xy'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                 type: 'datetime'
            },
            yAxis:[{
				title: {
					text: '',
					style: {
						color: '#333333'
					}
				},
				min:0
			},{
				title: {
					text: ''
				},
				labels: {
                    formatter: function() {
                        return this.value +' MB/ms';
                    },
                    style: {
                        color:'#9440ED'
                    }
                },
				opposite: true,
				min:0
			}],
            tooltip: {
                formatter: function() {
					var tooltipValue='<b>'+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x) +'</b>';
					if (this.point.config[2]){
						tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+Highcharts.getOptions().colors[this.series.index]+';">'+this.series.name+":</span> 耗时 "+Math.round(this.y*100)/100+"ms 回收空间:"+this.point.config[2]+"MB";
					}else if(this.point.series.index==3){
						tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+Highcharts.getOptions().colors[this.series.index]+';">'+this.series.name+":</span>  "+Math.round(this.y*100)/100+"MB/ms";
					}else if(this.point.series.index==4){
						tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+Highcharts.getOptions().colors[this.series.index]+';">'+this.series.name+":</span>  "+Math.round(this.y*100)/100+"MB/ms";
					}else{
						tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+Highcharts.getOptions().colors[this.series.index]+';">'+this.series.name+":</span> 耗时 "+Math.round(this.y*100)/100+"ms";
					}
					return tooltipValue;
                }
            },
            plotOptions: {
                scatter: {
					animation:false,//是否在显示报表的时候使用动画
                    marker: {
                        radius:4,
                        states: {
                            hover: {
                                enabled:true,
                                lineColor:'rgb(100,100,100)'
                            }
                        }
                    },
					events:{//监听点的鼠标事件
						click: function(event) {
							if (if_dbl){
								var O=Number(ID.replace("_child","")),RS=servers;
								RS[O];
								var L=location.href,L_obj={},L_arry=[];if (L.indexOf("?")>0){
								L=L.substring(L.indexOf("?")+1,L.length);
								L=L.split("&");
								for (var i=0,l=L.length;i<l;i++){
								  L[i]=L[i].split("=");
								  L_obj[L[i][0]]=L[i][1];
								}
								L=location.href;
								L=L.substring(0,L.indexOf("?"))+"?";
							  }else{
								L=location.href+"?";
							  }
							  L_obj["RS"]=RS[O];
							  for (var i in L_obj){
								L_arry.push(i+"="+L_obj[i]);
							  }
							  L="http://hbase.alibaba-inc.com/hbase/select_zhibiao_gc.php?"+L_arry.join("&");
							  var H=$(window).height(),W=$(window).width();
							  $('body').append("<div class='shadow' style='width:"+W+"px;position:fixed;'></div><div class='lightbox zhibiao_msg' style='position:fixed;z-index:1000;top:50px;left:50px;width:"+(W-100)+"px;height:"+(H-100)+"px;'><h3>"+RS[O]+"  大图</h3><a href='"+L+"' target='_blank' class='close new_tab'>在新标签中打开</a><iframe id='help_iframe' allowtransparency='true' scrolling='yes' frameborder=0 src='"+L+"' style='width:100%;height:"+(H-100)+"px;' ></iframe><a class='close'></a></div>");
								$(".zhibiao_msg a.close").click(function(){
								$(".shadow").remove();
									$(".zhibiao_msg").remove();
								});
							  //alert(L);

							}else{
								if_dbl=true;
							}
							setTimeout(function(){
								if_dbl=false;
							},500);
						}
					},
                    states: {
                        hover: {
                            marker: {
                                enabled: false
                            }
                        }
                    }
                },
				spline: {
					lineWidth: 2,
					states: {
						hover: {
							lineWidth: 2
						}
					},
					events:{//监听点的鼠标事件
						click: function(event) {
							if (if_dbl){
								var O=Number(ID.replace("_child","")),RS=servers;
								RS[O];
								var L=location.href,L_obj={},L_arry=[];if (L.indexOf("?")>0){
								L=L.substring(L.indexOf("?")+1,L.length);
								L=L.split("&");
								for (var i=0,l=L.length;i<l;i++){
								  L[i]=L[i].split("=");
								  L_obj[L[i][0]]=L[i][1];
								}
								L=location.href;
								L=L.substring(0,L.indexOf("?"))+"?";
							  }else{
								L=location.href+"?";
							  }
							  L_obj["RS"]=RS[O];
							  for (var i in L_obj){
								L_arry.push(i+"="+L_obj[i]);
							  }
							  L="http://hbase.alibaba-inc.com/hbase/select_zhibiao_gc.php?"+L_arry.join("&");
							  var H=$(window).height(),W=$(window).width();
							  $('body').append("<div class='shadow' style='width:"+W+"px;position:fixed;'></div><div class='lightbox zhibiao_msg' style='position:fixed;z-index:1000;top:50px;left:50px;width:"+(W-100)+"px;height:"+(H-100)+"px;'><h3>"+RS[O]+"  大图</h3><a href='"+L+"' target='_blank' class='close new_tab'>在新标签中打开</a><iframe id='help_iframe' allowtransparency='true' scrolling='yes' frameborder=0 src='"+L+"' style='width:100%;height:"+(H-100)+"px;' ></iframe><a class='close'></a></div>");
								$(".zhibiao_msg a.close").click(function(){
								$(".shadow").remove();
									$(".zhibiao_msg").remove();
								});
							  //alert(L);

							}else{
								if_dbl=true;
							}
							setTimeout(function(){
								if_dbl=false;
							},500);
						}
					},
                    animation:false,//是否在显示报表的时候使用动画
					marker:{
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 5,
								lineWidth: 1
							}
						}	
					}
                }
            },
            series: D
        });
	},
	//带标注的折线图表
	charts_FY:function(D,data,id){
		var t=this,ID=id;
		$("#chart_"+ID).empty();
		var chart= new Highcharts.Chart({
            chart: {
                renderTo: 'chart_'+ID,
                type: 'spline',
				animation:false,
				zoomType: 'xy'//放大镜
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
               type: 'datetime'
            },
            yAxis: {
				type: 'logarithmic',
                title: {
                    text: ''
                },
                labels: {
                    formatter: function() {
                        return this.value +''
                    }
                }
            },
			legend: {
                enabled: false
            },
			tooltip: {
				crosshairs: true,//纵线
				shared: true,//显示数据
				formatter: function(){
					var tooltipValue='<b>'+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x) +'</b>';
					for (var i=0,l=this.points.length;i<l;i++){
						tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+this.points[i].series.color+';">'+this.points[i].point.options.name+":</span> "+Math.round(this.points[i].point.y*100)/100+" "+this.points[i].point.danwei;
					}
					return tooltipValue;
				}
			},
            plotOptions: {
                spline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
                    animation:false,//是否在显示报表的时候使用动画
					marker: {
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 5,
								lineWidth: 1
							}
						}	
					}
                }
            },
            series:D
        });
	},
	//生成折线的图表
	charts_line: function(D,data) {
		var t=this,ID=data.id,if_dbl=false;
		for (var mean=[],i=0,l=D[0].data.length;i<l;i++){
			mean.push(Number(D[0].data[i][1]));
		}
		data.enabled=(data.enabled==false)?false:true;
		$("#chart_"+ID).empty();
		data.data[0].danwei=data.data[0].danwei?data.data[0].danwei:'';
		t.show_mean(D[0].name,mean,"#00A8F0",ID,data.data[0].danwei,data.data[0].xiaoshu);
		if (data.top){//显示排行
			//删除无效的data数据
			//var data2=t.clone(data);//对data里一些没用的数据进行删除
			//data.data=[];
			//for (var i=data2.data.length-1;i>=0;i--){
			//	for (var j=D.length-1;j>=0;j--){
			//		if (D[j].name==data2.data[i].title){//找到相同的名称
			//			data.data.unshift(data2.data[i]);
			//		}
			//	}
			//}
			//delete data2;//删除没用的对象
			var arry=[],arry2=[],all=0;
			for (var i=0,l=D.length;i<l;i++){//计算平均值
				arry[i]=0;
				for (j=0,lj=D[i].data.length;j<lj;j++){
					arry[i]+=D[i].data[j][1];
				}
				arry2[i]=arry[i]=arry[i]/lj;
				
				all+=arry[i];
			}
			function get_max(A,N){//排序
				var max=0;
				for (var i=0,l=A.length;i<l;i++){
					if(A[i]>A[max]) max=i;
				}
				A[max]=-1;
				if (N>1){
					max+=","+get_max(A,N-1);
				}
				return max;
			}
			if (data.top<arry2.length){
				var max=get_max(arry2,data.top).split(",");
			}else if (arry2.length==1){
				var max=[0];
			}else {
				var max=get_max(arry2,arry2.length).split(",");
			}
			all=Highcharts.numberFormat(all,2);
			var html="<table><tr><td class='b'>总计&nbsp;</td><td class='red b'>"+all+"</td><td></td></tr>";
			for (var i=0;i<data.top;i++){
				if (D[max[i]]){
					var danwei='',xiaoshu=2;
					if (data.data[max[i]].danwei) danwei=data.data[max[i]].danwei;
					if (data.data[max[i]].xiaoshu) xiaoshu=data.data[max[i]].xiaoshu;
					html+="<tr><td class='b'>平均值No."+(i+1)+"</td><td class='red b' title='"+D[max[i]].name+"'>"+D[max[i]].name+"</td><td> "+Highcharts.numberFormat(arry[max[i]],xiaoshu)+" "+danwei+"</td></tr>";
				}else{
					html+="<tr><td colspan=3>&nbsp;</td></tr>";
				}
			}
			html=html+"</table>"+data.y_title;
			$("#chart_"+ID).prev().prev().empty().append(html);
		}//排行结束
		var chart= new Highcharts.Chart({
			chart: {
				renderTo:"chart_"+data.id,
				defaultSeriesType: 'spline',//平滑
				animation:false,
				zoomType: 'xy'//放大镜
			},
			title: {
				text: ''
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text:""//纵坐标标题
				},
				min:0,
				startOnTick: true
			},
			tooltip: {
				crosshairs: true,//纵线
				shared: true,//显示数据
				formatter: function(){
					if (!data.Fluctuation || !top.time_b){//没有存在波动率的参数
						var tooltipValue='<b>'+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x) +'</b>',j='';
						if(data.ifchild=='Y'){
							for (var i=0,l=this.points.length;i<l;i++){
								tooltipValue+='<br/><span style="color:'+this.points[i].series.color+';">'+this.points[i].series.name+":</span> ";
								tooltipValue+=Highcharts.numberFormat(this.points[i].y,data.data[i].xiaoshu)+' '+data.data[i].danwei;
							}
						}else{
							for(var i=0;i<this.points.length;i++){
								tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+this.points[i].series.color+';">'+this.points[i].series.name+":</span> ";
								for (var j=0,jl=data.data.length;j<jl;j++){
									if (data.data[j].title==this.points[i].series.name){
										data.data[j].danwei=data.data[j].danwei?data.data[j].danwei:'';
										tooltipValue+=Highcharts.numberFormat(this.points[i].y,data.data[j].xiaoshu)+' '+data.data[j].danwei;
										break;
									}
								}
							}
						}
					}else{//有存在波动率
						var tooltipValue='<b>对比数据</b>';
						for(var i=0;i<this.points.length;i++){
							var j=this.points[i].series.index;
							tooltipValue=tooltipValue+'<br/>'+Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',(j==0)?this.x:(this.x-top.time_c))+'<span style="color:'+this.points[i].series.color+';">'+this.points[i].series.name+":</span> ";
							for (var j=0,jl=data.data.length;j<jl;j++){
								if (data.data[j].title==this.points[i].series.name){
									data.data[j].danwei=data.data[j].danwei?data.data[j].danwei:'';
									tooltipValue+=Highcharts.numberFormat(this.points[i].y,data.data[j].xiaoshu)+' '+data.data[j].danwei;
									break;
								}
							}
						}
					}
					return tooltipValue;
				}
			},
			legend: {
				enabled: data.enabled
			},
			plotOptions: {
				spline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					animation:false,//是否在显示报表的时候使用动画
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 5,
								lineWidth: 1
							}
						}	
					},
					events:{//监听点的鼠标事件
						click: function(event) {
							//alert(event.currentTarget.index);
							var danwe='',xiaoshu='';
							for (var j=0,jl=data.data.length;j<jl;j++){
								if (data.data[j].title==this.name){
									danwei=data.data[j].danwei;
									xiaoshu=data.data[j].xiaoshu;
									break;
								}
							}
							t.show_mean(this.name,this.data,this.color,ID,danwei,xiaoshu);
							if (if_dbl){
								var O=Number(ID.replace("_auto",""));
								for (var i=0,D=chart_datas2[O].data,z=-1;i<D.length;i++){
									if (!D[i].except || D[i].except=="-"){
										z++;
									}
									if (z>=event.currentTarget.index){
										break;
									}
								}
								O=[];
								for (var j=i,l=D.length;j<l;j++){
									O.push(D[j].zhibiao);
									if (D[j+1] && !D[j+1].except){
										break;
									}
									
								}
								var H=$(window).height(),W=$(window).width(),url="";
								if (t.to_location('from')){
									url+="&from="+t.to_location('from');
								}else {
									url+="&from=";
								}
								if (t.to_location('to')){
									url+="&to="+t.to_location('to');
								}else {
									url+="&to=";
								}
								url+="&AS="+jiqun;
								url+="&RS=all";
								if (t.to_location('DA')){
									url+="&DA="+t.to_location('DA');
								}else {
									url+="&DA=1h";
								}
								if (D[i].danwei){
									url+="&danwei="+D[i].danwei;
								}else {
									url+="&danwei=";
								}
								if (D[i].times){
									url+="&times="+D[i].times;
								}else {
									url+="&times=1";
								}
								if (D[i].except){
									url+="&except="+D[i].except;
								}
								for (var i=0,l=O.length;i<l;i++){
									O[i]=O[i].replace(".rrdt","_RS_");
									//if (O[i].indexOf(".")!=-1){
									//	O[i]=O[i].substring(O[i].lastIndexOf(".")+1,O[i].length);
									//}
								}
								//if(O[0]=="memHeapUsedM_RS_"){O[0]="jvm.metrics.memHeapUsedM_RS_";}
								//else if (O[0]=="maxMemoryM_RS_"){O[0]="jvm.metrics.maxMemoryM_RS_";}
								O=O.join(":");
								url="zhibiao_msg.php?FK="+O+url;
								$('body').append("<div class='shadow' style='width:"+W+"px;position:fixed;'></div><div class='lightbox zhibiao_msg' style='position:fixed;z-index:1000;top:50px;left:50px;width:"+(W-100)+"px;height:"+(H-100)+"px;'><h3>"+event.currentTarget.name+"  各服务器数据详情</h3><a href='"+url+"' target='_blank' class='close new_tab'>在新标签中打开</a><iframe id='help_iframe' allowtransparency='true' scrolling='yes' frameborder=0 src='"+url+"' style='width:100%;height:"+(H-100)+"px;' ></iframe><a class='close'></a></div>");
								$(".zhibiao_msg a.close").click(function(){
								$(".shadow").remove();
									$(".zhibiao_msg").remove();
								});
							}else{if_dbl=true;}
							setTimeout(function(){if_dbl=false;},500);
						}
					},
					pointInterval: 3600000, // one hour
					pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
				}
			},
			series:D,
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		});
		if(data.Fluctuation){
			t.Fluctuation(D,data.id);
		}
	},
	//生成即时更新的图表
	dynamic_line:function(D,data,U){
		var t=this,ID=data.id;
		for (var mean=[],i=0,l=D[0].data.length;i<l;i++){
			mean.push(Number(D[0].data[i][1]));
		}
		data.enabled=(data.enabled==false)?false:true;
		$("#chart_"+ID).empty();
		data.data[0].danwei=data.data[0].danwei?data.data[0].danwei:'';
		t.show_mean(D[0].name,mean,"#00A8F0",ID,data.data[0].danwei,data.data[0].xiaoshu);
		if (data.top){//显示排行
			//删除无效的data数据
			//var data2=t.clone(data);//对data里一些没用的数据进行删除
			//data.data=[];
			//for (var i=data2.data.length-1;i>=0;i--){
			//	for (var j=D.length-1;j>=0;j--){
			//		if (D[j].name==data2.data[i].title){//找到相同的名称
			//			data.data.unshift(data2.data[i]);
			//		}
			//	}
			//}
			//delete data2;//删除没用的对象
			var arry=[],arry2=[],all=0;
			for (var i=0,l=D.length;i<l;i++){//计算平均值
				arry[i]=0;
				for (j=0,lj=D[i].data.length;j<lj;j++){
					arry[i]+=D[i].data[j][1];
				}
				arry2[i]=arry[i]=arry[i]/lj;
				
				all+=arry[i];
			}
			function get_max(A,N){//排序
				var max=0;
				for (var i=0,l=A.length;i<l;i++){
					if(A[i]>A[max]) max=i;
				}
				A[max]=-1;
				if (N>1){
					max+=","+get_max(A,N-1);
				}
				return max;
			}
			if (data.top<arry2.length){
				var max=get_max(arry2,data.top).split(",");
			}else if (arry2.length==1){
				var max=[0];
			}else {
				var max=get_max(arry2,arry2.length).split(",");
			}
			all=Highcharts.numberFormat(all,2);
			var html="<table><tr><td class='b'>总计&nbsp;</td><td class='red b'>"+all+"</td><td></td></tr>";
			for (var i=0;i<data.top;i++){
				if (D[max[i]]){
					var danwei='',xiaoshu=2;
					if (data.data[max[i]].danwei) danwei=data.data[max[i]].danwei;
					if (data.data[max[i]].xiaoshu) xiaoshu=data.data[max[i]].xiaoshu;
					html+="<tr><td class='b'>平均值No."+(i+1)+"</td><td class='red b' title='"+D[max[i]].name+"'>"+D[max[i]].name+"</td><td> "+Highcharts.numberFormat(arry[max[i]],xiaoshu)+" "+danwei+"</td></tr>";
				}else{
					html+="<tr><td colspan=3>&nbsp;</td></tr>";
				}
			}
			html=html+"</table>"+data.y_title;
			$("#chart_"+ID).prev().prev().empty().append(html);
		}//排行结束
		var chart= new Highcharts.Chart({
			chart: {
				renderTo:"chart_"+data.id,
				defaultSeriesType: 'spline',//平滑
				//animation:false,
				zoomType: 'xy',//放大镜
				events: {
					load: function() {
						var series = this.series,times=[U[2][0],U[2][1]],time2=[],imt=Im,temp=0;
						setInterval(function() {
							times[0]=times[1];
							time2=times[1].split(":");
							for (var i=time2.length;i>=0;i--){
								time2[i]=Number(time2[i])+imt*1000;
							}
							times[1]=time2.join(":");
							//$.ajaxf.post(U[0]+"&from="+times[0]+"&to="+times[1],"src="+U[1], function(r){
							$.ajax({
								type: "post",
								url: "function/dataproxy.php",
								data:{ip:U[0][0],dk:U[0][1],url:U[0][2],cs:U[1]+"&from="+times[0]+"&to="+times[1]},
								success: function(r){
									r=t.del_error(r);
									var charts_data=t.data_deal(r,data.data);
									for (var i=0,l=charts_data.length;i<l;i++){
										for (var j=charts_data[i].data.length-1;j>=0;j--){
											if (Number(charts_data[i].data[j][1])!=-0.1 && Number(charts_data[i].data[j][1])!=0) break;
										}
										j=(j==-1)?0:j;
										charts_data[i]=Number(charts_data[i].data[j][1]);
										if (charts_data[i]==-0.1) charts_data[i]=null;
										if (isNaN(charts_data[i])){
											charts_data[i]=temp;
										}
										temp=charts_data[i];
										series[i].addPoint([Number(time2[i])+1000*60*60*8,charts_data[i]], true, true);
									}
								}
							});
							//},'text');
						}, imt*1000);
					}
				}
			},
			title: {
				text: ''
			},
			xAxis: {
				type: 'datetime'
			},
			yAxis: {
				title: {
					text:""//纵坐标标题
				},
				min:0,
				startOnTick: true
			},
			tooltip: {
				crosshairs: true,//纵线
				shared: true,//显示数据
				formatter: function(){
					var tooltipValue='<b>'+ Highcharts.dateFormat('%Y-%m-%d %H:%M:%S',this.x) +'</b>';
					if(data.ifchild=='Y'){
						tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+this.points[0].series.color+';">'+this.points[0].series.name+":</span> ";
						tooltipValue+=Highcharts.numberFormat(this.points[0].y,data.data[0].xiaoshu)+' '+data.data[0].danwei;
					}else{
						for(var i=0;i<this.points.length;i++){
							tooltipValue=tooltipValue+'<br/>'+'<span style="color:'+this.points[i].series.color+';">'+this.points[i].series.name+":</span> ";
							for (var j=0,jl=data.data.length;j<jl;j++){
								if (data.data[j].title==this.points[i].series.name){
									data.data[j].danwei=data.data[j].danwei?data.data[j].danwei:'';
									tooltipValue+=Highcharts.numberFormat(this.points[i].y,data.data[j].xiaoshu)+' '+data.data[j].danwei;
									break;
								}
							}
						}
					}
					return tooltipValue;
				}
			},
			legend: {//显示底座
				enabled: data.enabled
			},
			plotOptions: {
				spline: {
					lineWidth: 3,
					states: {
						hover: {
							lineWidth: 3
						}
					},
					animation:false,//是否在显示报表的时候使用动画
					marker: {
						enabled: false,
						states: {
							hover: {
								enabled: true,
								symbol: 'circle',
								radius: 5,
								lineWidth: 1
							}
						}	
					},
					events:{//监听点的鼠标事件
						click: function(event) {
							var danwe='',xiaoshu='';
							for (var j=0,jl=data.data.length;j<jl;j++){
								if (data.data[j].title==this.name){
									danwei=data.data[j].danwei;
									xiaoshu=data.data[j].xiaoshu;
									break;
								}
							}
							t.show_mean(this.name,this.data,this.color,ID,danwei,xiaoshu);
						}
					},
					pointInterval: 3600000, // one hour
					pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
				}
			},
			series:D,
			navigation: {
				menuItemStyle: {
					fontSize: '10px'
				}
			}
		});
	},
	//显示平均值
	show_mean:function(N,D,C,ID,danwei,xiaoshu){
		var value=0,len=0;
		if(N.indexOf(".")!=-1){
			N=N.substring(0,N.indexOf("."));
		}
		danwei=danwei?danwei:'';
		xiaoshu=xiaoshu?xiaoshu:2;
		for (var i=0,l=D.length;i<l;i++){
			if (D[i]){
				value+=D[i];
				len++;
			}
		}
		if (typeof(value)=="string"){
			value=0,len=0;
			for (var i=0,l=D.length;i<l;i++){
				if (D[i].y){
					value+=D[i].y;
					len++;
				}
			}
		}
		value=Highcharts.numberFormat(value/l,xiaoshu);
		$("#charts_box"+ID+" .mean .val").remove();
		$("#charts_box"+ID+" .mean").show().children("span").css("border-color",C).after("<span class='val'><b>"+N+"</b> 平均值为：<strong class='red'>"+value+"</strong> "+danwei+"</span>");
	},
	//隐藏窗口的显隐
	toggle:function(D,T,C){//D=目标id T=切换id C=关闭id
		return $(D).each(function(){
			var timer=null,logs=false,obj=$(this);
			obj.click(function(){
				logs=true;
			});
			obj.find(T).click(function(event){
				obj.siblings().removeClass("current");
				if (!obj.hasClass("current")) logs=true;
				showhide();
				event.stopPropagation();
			});
			for (var i=0,l=C.length;i<l;i++){
				obj.find(C[i]).click(function(event){
					logs=false;
					if (obj) showhide();
					event.stopPropagation();
				});
			}
			$('body').click(function(){
				if (obj) showhide();
			});
			function showhide () {
				if (logs==false){
					obj.removeClass("current");
				}else {
					obj.addClass('current');
				}
				logs =false;
			};
		});
	},
	//将时间戳转换格式
	getdate:function(d){
		year=d.getFullYear();
		function add_zero(d){
			if (d<10) d="0"+String(d);
			return d;
		}
		return (d.getFullYear()+"-"+add_zero(d.getMonth()+1)+"-"+add_zero(d.getDate())+" "+add_zero(d.getHours())+":"+add_zero(d.getMinutes())+":"+add_zero(d.getSeconds()));
	},
	//单个时间选择
	one_date:function(D1,B,O,T){//D1=日期1的id,D2=日期2的id,S=select's id,B=button's id O=变化的id T=time I=即时
		var t=this;
		if (T){
			$(O).html((t.getdate(new Date(T[0])).split(" "))[0]);
			$(D1).val((t.getdate(new Date(T[0])).split(" "))[0]);
		}
		var date;
		$(D1).focus(function(){WdatePicker({maxDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd'});$(S).val(0);});
		$(B).click(function(){
			var from=new Date($(D1).val()).valueOf()-8*60*60000,to=from+24*60*60*1000,L=location.href;
			from=new Date(from);
			to=new Date(to);
			from=[from.getFullYear(),from.getMonth()+1,from.getDate()];
			to=[to.getFullYear(),to.getMonth()+1,to.getDate()];
			if (from[1]<10) from[1]="0"+from[1];
			if (from[2]<10) from[2]="0"+from[2];
			if (to[1]<10) to[1]="0"+to[1];
			if (to[2]<10) to[2]="0"+to[2];
			from=from.join("-")+" 00:00:00";
			to=to.join("-")+" 00:00:00";
			t.J_url({from:from,to:to,DA:"auto"});
		})
	},
	//时间选择
	date:function(D1,D2,S,I,B,O,T){//D1=日期1的id,D2=日期2的id,S=select's id,B=button's id O=变化的id T=time I=即时
		$(S).val(DATE);
		$(I).val(Im);
		var t=this;
		if (T){
			$(O).html(t.getdate(new Date(T[0]))+" - "+t.getdate(new Date(T[1])));
			$(D1).val(t.getdate(new Date(T[0])));
			$(D2).val(t.getdate(new Date(T[1])));
		}
		var date,date2;
		$(D1).focus(function(){WdatePicker({maxDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd HH:mm:ss'});$(S).val(0);$(I).val(0);});
		$(D2).focus(function(){WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',dateFmt:'yyyy-MM-dd HH:mm:ss'});$(S).val(0);$(I).val(0);});
		if ($("#d4313").length){//基线选择是否存在
			$("#d4313").focus(function(){WdatePicker({maxDate:'%y-%M-%d',dateFmt:'yyyy-MM-dd HH:mm:ss'});$(S).val(0);$(I).val(0);});
			$("#N_DATE").change(function(){//起始时间选择
				var tt=0,nt=new Date(),st=$(S).val()*24*60*60*1000;
				nt=nt.valueOf()-$(this).val()*24*60*60*1000;
				st=nt-st;
				nt=new Date(nt);
				st=new Date(st);
				nt=nt.getFullYear()+"-"+(nt.getMonth()<9?("0"+(nt.getMonth()+1)):(nt.getMonth()+1))+"-"+(nt.getDate()<10?("0"+nt.getDate()):nt.getDate())+" 00:00:00";
				st=st.getFullYear()+"-"+(st.getMonth()<9?("0"+(st.getMonth()+1)):(st.getMonth()+1))+"-"+(st.getDate()<10?("0"+st.getDate()):st.getDate())+" 00:00:00";
				$(D1).val(nt);
				$("#d4313").val(st);
			});
		}
		$(I).change(function(){
			if ($(S).val()==0) $(S).val('1h');
		});
		$(S).change(function(){
			if ($("#d4313").length){//基线选择是否存在
				var tt=$("#d4311").val().split(" ");
				tt=tt[0].split("-");
				tt=new Date(tt[0],Number(tt[1])-1,tt[2]);
				tt=tt.valueOf();
				tt=tt-$(this).val()*24*60*60*1000;
				tt=new Date(tt);
				tt=tt.getFullYear()+"-"+((tt.getMonth()<9)?("0"+(tt.getMonth()+1)):(tt.getMonth()+1))+"-"+(tt.getDate()<10?("0"+tt.getDate()):tt.getDate())+" 00:00:00";
				$("#d4313").val(tt);
				$(D2).val(tt);
			}else{
				if ($(this).val()==0) $(I).val(0);
			}
		});
		$(B).click(function(){
			if (/log_collection.php/.test(location.href)){
				if ($(S).val()!=0 && !$("#d4313").length){//快速模式
					DATE=$(S).val();
					$(".room_list.current .reload").click();
				}else {//自选日期模式
					$(O).html($(D1).val()+" - "+$(D2).val());
					function timestamp (date){
						var new_str = date.replace(/:/g,'-');
						new_str = new_str.replace(/ /g,'-');
						var arr = new_str.split('-');
						var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
						return datum.valueOf();
					};
					top.time=[Number(timestamp($(D1).val())),Number(timestamp($(D2).val()))];
					DATE='auto';
					$(".room_list.current .reload").click();
				}
			}else{
				if ($(S).val()!=0 && !$("#d4313").length){//快速模式
					DATE=$(S).val();
					Im=$(I).val();
					t.jump_url();
				}else {//自选日期模式
					if ($("#d4313").length){//基线选择是否存在
						$(D2).val($("#d4313").val());
					}
					$(O).html($(D1).val()+" - "+$(D2).val());
					function timestamp (date){
						var new_str = date.replace(/:/g,'-');
						new_str = new_str.replace(/ /g,'-');
						var arr = new_str.split('-');
						var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
						return datum.valueOf();
					};
					var time=[Number(timestamp($(D1).val())),Number(timestamp($(D2).val()))];
					DATE='auto';
					var L=location.href;
					t.jump_url(L,time,jiqun);
				}
			}
		});
	},
	//生成新url地址并进行页面跳转
	to_location:function(N,V,L){
		L=L?L:location.href
		var t=this;
		if(L.indexOf("?")==-1 && V){
			location.href=L+"?"+N+"="+V;
		}else {
			var queryString =L.substring(L.indexOf("?")+1); 
			var queryString=queryString.split("&");
			var pos,V;
			//将url的各个参数拆分为数组 保存到queryString
			for(var i=0,l=queryString.length;i<l; i++){
				queryString[i]=queryString[i].split("=");
			}
		}
		if (V!=undefined){
			if (N=="DATE"){//如果是日期
				var from=true,to=true;
				for(var i=0,l=queryString.length;i<l; i++){
					if (queryString[i][0]=="from"){
						queryString[i][1]=V[0];
						from=false;
					}else if (queryString[i][0]=="to"){
						queryString[i][1]=V[1];
						to=false;
					}
				}
				if (from) queryString.push(["from",V[0]]);
				if (to) queryString.push(["to",V[1]]);
			}else {
				if(typeof(V)=="object") V=V.join("|");
				for(var i=0,l=queryString.length;i<l; i++){
					if (N==queryString[i][0]){
						queryString[i][1]=V;
						N=false;
						break;
					}
				}
				if (N) queryString.push([N,V]);
			}
			//开始重新组装url
			for(var i=0,l=queryString.length;i<l; i++){
				queryString[i]=queryString[i].join("=");
			}
			queryString=queryString.join("&");
			L=L.substring(0,L.indexOf("?"))+"?"+queryString;
			location.href=L; 
		}else{
			for(var i=0,l=queryString.length;i<l; i++){
				if (N==queryString[i][0]){
					return queryString[i][1];
				}
			}
			return false;
		}
	},
	//服务器选择插件
	selectable:function(D,S){//D=id S=sure button's id
		var t=this;
		$(S).click(function(){
			var choseli=[];
			for (var i=0,l=$(D+".current").length;i<l;i++){
				choseli.push($(D+".current").eq(i).html());
			}
			servers=choseli;
			choseli=choseli.join("|");
			t.jump_url();
		});
		$(D).live("mousedown",function(e){
			if(e.ctrlKey){
				if ($(this).hasClass("current")){
					$(this).removeClass("current");
				}else {
					$(this).addClass("current");
				}
			}else{
				$(D).removeClass("current");
				$(this).addClass("current");
			}
			var arry=[],xy=[e.pageX,e.pageY];
				for (var i=0,l=$(D).length;i<l;i++){
					var tmp=$(D).eq(i);
					arry[i]=[tmp.offset().left,tmp.offset().top,tmp.outerWidth(),tmp.outerHeight()];
				}
				var helper=document.createElement("div");
				helper.id="selectable_helper";
				helper.style.top=xy[1]+"px";
				var unbind=document.createElement("div");
				unbind.id="unbind";
				$('body').append($(unbind));
				$('body').append($(helper));
				function chose_area(area){
					for (var i=0,l=arry.length;i<l;i++){
						if (arry[i][0]<area[2] && area[0]<(arry[i][0]+arry[i][2]) && (area[1]<(arry[i][1]+arry[i][3])) && area[3]>arry[i][1]){
							if (!$(D).eq(i).hasClass("hover")){
								$(D).eq(i).addClass("hover");
							}
						}else {
							if ($(D).eq(i).hasClass("hover")){
								$(D).eq(i).removeClass("hover");
							}
						}
					}
				};
				$(unbind).mousemove(function(e2){
					$('body').css({cursor:'w-resize'});
					var xy2=[0,0,Math.abs(e2.pageX-xy[0]),Math.abs(e2.pageY-xy[1])];
					helper.style.width=xy2[2]+"px";
					helper.style.height=xy2[3]+"px";
					if (e2.pageX>=xy[0]) xy2[0]=xy[0];
					else xy2[0]=e2.pageX;
					if (e2.pageY>=xy[1]) xy2[1]=xy[1];
					else xy2[1]=e2.pageY;
					helper.style.left=xy2[0]+"px";
					helper.style.top=xy2[1]+"px";
					xy2[2]+=xy2[0];
					xy2[3]+=xy2[1];
					chose_area(xy2);
				});
				$(unbind).mouseup(function(){
					$('body').css({cursor:'default'});
					$(D+".hover").removeClass("hover").addClass("current");
					$(unbind).remove();
					$(helper).remove();
				});
			
			return false;
		});
	},
	lightbox:function(C,D){
		var t=this;
		switch(C){
			case "show_mean":show_mean(D);break;
			case "show_statements":statements();break;
			case "edit_statements":edit_statements();break;
			case "add_to_statements":add_to_statements(D);break;
		}
		function show_mean(D){
			var wh=$("body").height(),bh=$(window).height();
			$("body").append("<div class='shadow' style='height:"+wh+"px;'></div><div class='lightbox ZB_mean' style='width:300px;margin-left:-150px;top:"+(bh/2-150)+"px;'><h3>数据含义</h3><div class='mean_list'>"+D+"</div><a href='javascript:void(0);' class='close'></a></div>");
			$(".lightbox .close").click(function(){
				$(".shadow").remove();
				$(".lightbox").remove();
			});
		}
		function statements(){
			var wh=$("body").height(),bh=$(window).height();
			var html='<form method="post" action="function/edit_statements.php?operating=add"><table><tbody><tr><th>名称:</th><td><input type="text" value="" class="ipt_01" name="title"></td></tr><tr><th>排序:</th><td><input type="text" value="" class="ipt_02" name="sort"></td></tr><tr><th></th><td><input type="submit" value="提交" id="login_sure" name="submit"></td></tr></tbody></table></form>'
			$("body").append("<div class='shadow' style='height:"+wh+"px;'></div><div class='lightbox ZB_mean' style='width:300px;margin-left:-150px;top:"+(bh/2-150)+"px;'><h3>新增报表</h3><div class='mean_list'>"+html+"</div><a href='javascript:void(0);' class='close'></a></div>");
			$(".lightbox .close").click(function(){
				$(".shadow").remove();
				$(".lightbox").remove();
			});
		}
		function add_to_statements(D){
			var wh=$("body").height(),bh=$(window).height();
			var html="<div class='shadow'  style='height:"+wh+"px;'></div><div class='lightbox ZB_mean' style='width:300px;margin-left:-150px;top:"+(bh/2-150)+"px;'><h3>请选择将此图标加入哪个分类</h3><ul class='chose_list'>"+D+"</ul><a href='javascript:void(0);' class='close'></a></div>";
			$("body").append(html);
			$(".lightbox .close").click(function(){
				$(".shadow").remove();
				$(".lightbox").remove();
			});
		}
		function edit_statements(){
			var wh=$("body").height(),bh=$(window).height(),html='<form method="post" action="function/edit_statements.php?operating=modify" id="edit_stat_form" name="edit_stat_form"><table><tbody><tr><th>名称</th><th>排序</th><th></th></tr>';
			for (var i=0,l=$("#tree_01 li").length,list="",A=$("#tree_01 li a");i<l;i++){
				var H=A.eq(i).attr('href');
				H=H.substring(H.indexOf("=")+1,H.length);
				list+='<tr><td><input type="text" value="'+A.eq(i).html()+'" class="ipt_01" name="title" list="'+H+'"></td><td><input type="text" value="'+(l-i)+'" class="ipt_02" name="sort"></td><td><a href="javascript:void(0);" class="delate">删除</a></td></tr>';
			}
			html+=list+'<tr><td colspan="2"><input type="submit" value="提交" id="login_sure" name="submit"></td></tr></tbody></table><input id="L_JSON" type="hidden" value="" name="L_JSON" /></form>';
			//<tr><td><input type="text" value="" class="ipt_01" name="title"></td><td><input type="text" value="" class="ipt_02" name="sort"></td></tr>
			$("body").append("<div class='shadow' style='height:"+wh+"px;'></div><div class='lightbox ZB_mean' style='width:300px;margin-left:-150px;top:"+(bh/2-150)+"px;'><h3>编辑报表</h3><div class='mean_list'>"+html+"</div><a href='javascript:void(0);' class='close'></a></div>");
			$("#edit_stat_form").submit(function(){
				var J="[";
				for (var i=0,l=$(".lightbox .ipt_01").length;i<l;i++){
					J+='{"id":"'+$(".lightbox .ipt_01").eq(i).attr("list")+'","title":"'+$(".lightbox .ipt_01").eq(i).val()+'","_sort":"'+$(".lightbox .ipt_02").eq(i).val()+'"}';
					if (i!=l-1) J+=",";
				}
				J+=']';
				$("#L_JSON").val(J);
				form.submit();
			});
			$(".lightbox .close").click(function(){
				$(".shadow").remove();
				$(".lightbox").remove();
			});
			$(".lightbox .delate").click(function(){
				$(this).parents("tr").hide().find(".ipt_02").val("del");
			});
		}
	},
	tab:function(T,B,C){
		$(T).eq(0).addClass("current");
		$(T).live('click',function(){
			var i=$(this).index();
			$(T).eq(i).addClass("current").siblings().removeClass("current");
			if (C){
				$(B).eq(i).addClass(C).siblings().removeClass(C);
			}else{
				$(B).eq(i).show().siblings().hide();
			}
		});
	},
	edit_HJ:function(C){
		var t=this;
		$(C).click(function(event){
			var wh=$("body").height(),bh=$(window).height(),id=this.value,name=$(this).next().html();
			wh=wh<bh?bh:wh;
			$("body").append("<p id='prompt' style='width:"+300+"px;padding:20px 10px;border:1px solid #fff;background:#333;color:#fff;font-weight:bolder;-moz-border-radius:5px;text-align:center;border-radius:5px;-webkit-border-radius:5px;-moz-box-shadow:0px 3px 12px #888;box-shadow:0px 3px 12px #888;position:fixed;left:50%;margin-left:-"+150+"px;top:"+200+"px;z-index:100000;'>正在加载请稍后...</p>");
			$.ajax({
				type: "get",
				dataType: "json",
				url: "function/get_HJ_list.php",
				success: function(data){
					var lightbox="<div class='lightbox edit_HJ' style='width:720px;margin-left:-300px;top:30px;'><div class='tab_h'><ul>";
					for (var i=0,l=data.length;i<l;i++){
						if (i==0) lightbox+="<li class='current'><h5>"+data[i].hb_name+"</h5><p>"+data[i].se_name+"</p><a class='DEL_JF' title='删除该机房' id='"+data[i].id+"'></a></li>";
						else lightbox+="<li><h5>"+data[i].hb_name+"</h5><p>"+data[i].se_name+"</p><a class='DEL_JF' title='删除该机房' id='"+data[i].id+"'></a></li>";
					}
					lightbox+="</ul><a class='add_jf'></a></div><div>";
					for (var i=0,l=data.length;i<l;i++){
						if (i==0) lightbox+="<div class='edit_page' style='min-height:300px;max-height:"+(bh-60)+"px;'><div class='title'><h5 id='"+data[i].id+"' class='edit2'>"+data[i].hb_name+"</h5><p id='"+data[i].id+"' class='edit2'>"+data[i].se_name+"</p><span id='"+data[i].id+"' class='edit2' >"+data[i].sort+"</span></div><table><tr><th width=48>服务器</th><th width=80>标题</th><th  width=280>URL</th><th  width=150>cluster</th><th width=60>默认版本</th><th width=40>排序</th><th>编辑</th></tr>";
						else lightbox+="<div class='edit_page none' style='min-height:300px;max-height:"+(bh-60)+"px;'><div class='title'><h5 id='"+data[i].id+"' class='edit2'>"+data[i].hb_name+"</h5><p id='"+data[i].id+"' class='edit2'>"+data[i].se_name+"</p><span id='"+data[i].id+"' class='edit2' >"+data[i].sort+"</span></div><table><tr><th width=48>服务器</th><th>标题</th><th>URL</th><th>cluster</th><th>默认版本</th><th>排序</th><th>编辑</th></tr>";
						for (var j=0,l2=data[i].data.length;j<l2;j++){
							if (data[i].data[j].V==90){ var vhtml="<option value='90' selected='selected'>90版本</option><option value='92'>92版本</option><option value='94'>94版本</option>";}
							else if (data[i].data[j].V==92){var vhtml="<option value='90'>90版本</option><option value='92' selected='selected'>92版本</option><option value='94'>94版本</option>";}
							else var vhtml="<option value='90'>90版本</option><option value='92'>92版本</option><option value='94' selected='selected'>94版本</option>";
							lightbox+="<tr><td class='show_hide'></td><td class='edit' id='"+data[i].data[j].id+"'>"+data[i].data[j].name+"</td><td class='edit' id='"+data[i].data[j].id+"'>"+data[i].data[j].URL+"</td><td class='edit' id='"+data[i].data[j].id+"'>"+data[i].data[j].cluster+"</td><td><select class='change_version' id='"+data[i].data[j].id+"'>"+vhtml+"</select></td><td class='edit' id='"+data[i].data[j].id+"'>"+data[i].data[j].sort+"</td><td><a class='del' id='"+data[i].data[j].id+"'>删除</a></td></tr><tr  class='none'><td>服务器:</td><td colspan='2'><textarea id='"+data[i].data[j].id+"'>"+data[i].data[j].data.replace(/,/g,'\n')+"</textarea></td><td colspan='4'><input type='button' class='btn_1 reset_servers' value='保存' /></td></tr>";
						}
						lightbox+="</table><a class='ADD_HJ' id='"+data[i].id+"'>新增环境</a></div>";
					}
					lightbox+="</div><a href='javascript:void(0);' class='close'></a></div>";
					lightbox=$("<div class='shadow' style='height:"+wh+"px;'></div>"+lightbox);
					$("body").append(lightbox);
					$("#prompt").animate({"opacity":0,'top':300},500,function(){$("#prompt").remove();});
					$(".edit_HJ .close").click(function(){
						$(".lightbox").remove();
						$(".shadow").remove();
					});
					t.tab(".edit_HJ .tab_h li",".edit_HJ .edit_page");
					$(".edit_HJ .tab_h .add_jf").click(function(){
						$(".edit_HJ .tab_h li.current").removeClass('current');
						if ($(".edit_HJ .add_new_jf").length<=0){
							$(".edit_HJ .edit_page").hide();
							$(".edit_HJ .edit_page:last").after("<div class='edit_page add_new_jf' style='min-height:300px;max-height:"+(bh-60)+"px;'><div class='title'><h5><input type='text' placeholder='请输入机房名称' /></h5><p><input type='text' placeholder='请输入机房ip' /></p><input type='submit' class='btn_1' id='ADD_JF' value='确定'></div></div>");
							$("#ADD_JF").click(function(){
								var v1=$(".edit_HJ .add_new_jf h5 input"),v2=$(".edit_HJ .add_new_jf p input");
								if(v1.val()==''){
									alert('请输入机房名称');
									return false;
								}
								if (v2.val()==''){
									alert('请输入机房ip');
									return false;
								}
								$.ajax({
									type: "post",
									data:{type:'ADD_JF',hb_name:v1.val(),URL:v2.val()},
									url: "function/save_HJ_list.php",
									success: function(data){
										$(".edit_HJ .tab_h ul").append("<li class='current'><h5>"+v1.val()+"</h5><p>"+v2.val()+"</p><a class='DEL_JF' id='"+data+"' title='删除该机房'></a></li>");
										v1.parent().html(v1.val());
										v2.parent().html(v2.val());
										$(".edit_HJ .add_new_jf .title").after("<table><tr><th width=48></th><th width=80>标题</th><th width=280>URL</th><th width=150>cluster</th><th width=60>默认版本</th><th width=40>排序</th><th>编辑</th></tr></table><a class='ADD_HJ' id='"+data+"'>新增环境</a>");
										$(".edit_HJ .add_new_jf").removeClass('add_new_jf');
										$("#ADD_JF").remove();
									}
								});
							});
						}else {
							alert('请编辑');
						}
					});
				}
			});
			$$.tab(".edit_directory .tab_h li",".edit_directory .edit_page");
			event.stopPropagation();
		});
		$(".ADD_HJ").live('click',function(){//增加环境
			var ts=$(this);
			$.ajax({
				type: "post",
				data:{type:'ADD_HJ',id:ts.attr('id')},
				url: "function/save_HJ_list.php",
				success: function(data){
					ts.prev().append("<tr><td class='show_hide'></td><td id='"+data+"' class='edit'>请输入标题</td><td id='"+data+"' class='edit'>请输入URL</td><td id='"+data+"' class='edit'>请输入cluster</td><td><select id='"+data+"' class='change_version'><option value='90'>90版本</option><option value='92'>92版本</option><option value='94'>94版本</option></select></td><td id='"+data+"' class='edit'>0</td><td><a id='"+data+"' class='del'>删除</a></td></tr><tr class='none'><td>服务器:</td><td colspan='2'><textarea id='25'></textarea></td><td colspan='4'><input type='button' value='保存' class='btn_1 reset_servers'></td></tr>");
				}
			});
			
		});
		$(".change_version").live('change',function(){
			$.ajax({
				type: "post",
				data:{id:$(this).attr('id'),th:'version',val:$(this).val()},
				url: "function/save_HJ_list.php",
				success: function(data){
					var tpname=ipt.val();
					ipt.remove();
					ts.html(tpname);
				}
			});
		});
		$(".edit_HJ .tab_h li .DEL_JF").live('click',function(){
			if(confirm("删除后该机房以及其下所有数据将不能恢复，确定删除？")){
				var ts=$(this),i=ts.parent().index();
				$.ajax({
					type: "post",
					data:{type:'DEL_JF',id:ts.attr('id')},
					url: "function/save_HJ_list.php",
					success: function(data){
						ts.parent().remove();
						$(".edit_HJ .edit_page").eq(i).remove();
						$(".edit_HJ .edit_page").eq(0).show();
						$(".edit_HJ .tab_h li").eq(0).addClass('current').siblings().removeClass("current");
					}
				});
			}
		});
		$(".edit_HJ .edit_page .del").live('click',function(){//删除环境
			if(confirm("删除后数据将不能恢复，确定删除？")){
				var ts=$(this);
				$.ajax({
					type: "post",
					data:{type:'DEL_HJ',id:ts.attr('id')},
					url: "function/save_HJ_list.php",
					success: function(data){
						ts.parent().parent().next().remove();
						ts.parent().parent().remove();
					}
				});
			};	
		});
		$(".edit_HJ .edit_page td.show_hide").live('click',function(){//显隐服务器
			var obj=$(this).parent().next();
			if (obj.hasClass('show')){
				obj.removeClass('show').addClass('none');
			}else {
				$(".edit_HJ .edit_page tr.show").removeClass('show').addClass('none');
				obj.addClass('show').removeClass('none');
			}
		});
		$(".edit_HJ .reset_servers").live('click',function(){//保存服务器修改
			var obj=$(this).parent().prev().children('textarea'),arr=obj.val().split('\n'),arr2=[];
			for (var i=0,li=arr.length;i<li;i++){
				if (arr[i]!=''){
					arr2.push(arr[i]);
				}
			}
			arr2=arr2.join(',');
			$.ajax({
				type: "post",
				data:{id:obj.attr('id'),th:'servers',val:arr2},
				url: "function/save_HJ_list.php",
				success: function(data){
					alert(data);
				}
			});
		});
		$(".edit_HJ .edit2").live('click',function(){//点击编辑
			var ts=$(this),w=0,name='';
			switch(ts.get(0).tagName){
				case 'H5':w=160;name='hb_name';break;
				case 'P':w=160;name='URL';break;
				case 'SPAN':w=40;name='sort';break;
			}
			var ipt=$("<input type='text' class='edit2_ipt' id='"+ts.attr('id')+"' name='"+name+"' value='"+ts.html()+"' temp='"+ts.html()+"' style='width:"+w+"px;' />");
			ts.html('').append(ipt);
			ipt.focus();
			ipt.blur(function(){
				if (ipt.val()!=ipt.attr('temp')){//有修改时录入数据库
					$.ajax({
						type: "post",
						data:{id:ipt.attr('id'),th:ipt.attr('name'),val:ipt.val()},
						url: "function/save_HJ_list.php",
						success: function(data){
							var tpname=ipt.val();
							ipt.remove();
							ts.html(tpname);
						}
					});
				}else{
					var tpname=ipt.val();
					ipt.remove();
					ts.html(tpname);
				}
			});
			ipt.click(function(event){
				event.stopPropagation();
			});
			//ts.html('').append(ipt);
		});
		$(".edit_HJ .edit").live('click',function(){//点击编辑
			var ts=$(this),w=0,name='';
			switch(ts.index()){
				case 1:w=60;name='hb_name';break;
				case 2:w=260;name='URL';break;
				case 3:w=130;name='cluster';break;
				case 5:w=20;name='sort';break;
			}
			var ipt=$("<input type='text' class='edit_ipt' id='"+ts.attr('id')+"' name='"+name+"' value='"+ts.html()+"' temp='"+ts.html()+"' style='width:"+w+"px;' />")
			$(this).html('').append(ipt);
			ipt.focus();
			ipt.blur(function(){
				if (ipt.val()!=ipt.attr('temp')){//有修改时录入数据库
					$.ajax({
						type: "post",
						data:{id:ipt.attr('id'),th:ipt.attr('name'),val:ipt.val()},
						url: "function/save_HJ_list.php",
						success: function(data){
							var tpname=ipt.val();
							ipt.remove();
							ts.html(tpname);
						}
					});
				}else{
					var tpname=ipt.val();
					ipt.remove();
					ts.html(tpname);
				}
			});
			ipt.click(function(event){
				event.stopPropagation();
			});
		});
	},
	Immediate:function(D,T){
		var t=this;
		if (Im>=5){
			var tm=Im*1000;
			function IMM(){
				T[0]+=tm;
				T[1]+=tm;
				t.show_charts(D,T,true);
			}
			setInterval(IMM,tm);
		}
	},
	ser_toggle:function(D,B){
		$(D).click(function(){
			if($(this).prev().attr('checked')){
				var html=$(B+" ul").html();
				html="<ul class='ser_lit clearbox ser_lit_after'>"+html+"</ul>";
				$(B).hide().after(html);
			}else {
				$(B).show();
				$(".ser_lit_after").remove();
				//$(B).show()
			}
		});
	},
	prompt:function(T,W,time){//页面弹出提示  T=text W=width
		W=W?W:200;
		time=time?time:1000;
		var Top=$(window).height()/2
		$("body").append("<p id='prompt' style='width:"+W+"px;padding:20px 10px;border:1px solid #fff;background:#333;color:#fff;font-weight:bolder;-moz-border-radius:5px;text-align:center;border-radius:5px;-webkit-border-radius:5px;-moz-box-shadow:0px 3px 12px #888;box-shadow:0px 3px 12px #888;position:fixed;left:50%;margin-left:-"+W/2+"px;top:"+Top+"px;z-index:100000;'>"+T+"</p>");
		setTimeout(function(){$("#prompt").animate({"opacity":0},500,function(){$("#prompt").remove();})},time);
	},
	add_statements:function(D){
		var t=this;
		$(D).click(function(){
			t.lightbox("show_statements");
		});
	},
	edit_statements:function(D){
		var t=this;
		$(D).click(function(){
			t.lightbox("edit_statements");
		});
	},
	//计算波动率
	Fluctuation:function(D,id){
		if (D.length<2){
			alert("数据少于2条,不能计算波动率");
			return false;
		}
		var V=0;
		for (var i=0,l=D[0].data.length,Z=0;i<l;i++){
			if (D[0].data[i][1]!=null && D[1].data[i][1]!=null){
				Z++;
				var dis=(D[1].data[i][1]-D[0].data[i][1])*100
				if(D[1].data[i][1]>0){
				  dis=dis/D[1].data[i][1]
				}else if(D[0].data[i][1]>0){
				  dis=dis/D[0].data[i][1]
				}
				V+=Math.pow(dis,2);
			}
		}
		V=Math.round(Math.sqrt(V)/Z*100)/100;
		$("#charts_box"+id).append("<p class='fluctuation'>波动率:"+V+"%</p>");
	}
};
var $$ = new HB();

/**
 * 分页条
 * 
 * @module Grid
 * @namespace Slick.Controls
 */
(function(factory){
	if (typeof define === 'function' && define.amd) {
		define(["jquery", "numberBox"], factory);
	} else {
		factory(jQuery);
	}
}(function($) {
	 /**
	  * 创建分页条
	 * @class Pager
	 * @static
	 * @constructor
	 * @param {Object} dataView 
	 * @param {Object} grid
	 * @param {Object} $container
	 * @param {Object} options 参数
	 * @param {Array} buttons
	 */
    function SlickGridPager(dataView, grid, $container, options , buttons){
    	var exeQueryFn;//人事人才扩展
        var $status,$limit, $start; 								//分别为状态栏，条数，开始条数
        var $first = {};
        var $prev = {};
		var $howInput = {};
		var $pageL = {};
		var $next = {};
		var $last = {};
		var $limitInput = {};
		var $count;
		var $defaultCanvas;
		var $fullCanvas;
		var pageFirst;	//pageSize 为数组后第一次限制的值
        var self = this;											//自身
        var count = -1, limit = 400, start = 0;						//记录总条数，每页条数，开始条数
        var def = {													//默认配置
        	pageSize : 400,											//分页大小
        	showCount : true,										//是否显示总条数及最后一页按钮
        	showButton: true,
        	showExcel:true,
        	showDetails:true,
        	expKeyOrName:true                      //导出时是导出码值还是描述值,默认是码值
        }
		/**
		 * 初始化函数，构建UI
		 * @method init
		 * @private
		 */
        function init(){
        	if(options.pageSize==null){//change by zzb 修改pageSize支持传入数组
        		//查询config.properties配置文件中的默认每页记录数
        		var pSize = Base.globvar.pageSize;
	            if(!isNaN(pSize)){
	            	options.pageSize = pSize;
	            }
        	}
        	options = $.extend(true, {}, def, options);				//配置
        	//每页显示条数不能查过10W条
        	if(Number(options.pageSize) > 99999){
        		options.pageSize = 99999;
        	}
            constructPagerUI();										//创建界面
        }
        /**
         * 公共方法,用于初始化状态
         * @method setStatus
         */
       
        function setStatus(total) {
        	//$pageL = $("<span>");
        	
        	//$howInput = $("<input>");
        	if (total > 0 || count > 0) {
        		//$start.val("0");
        		count = total == 0 ? count : total;
        		start = Number($start.val());
        		limit = Number($limit.val());
        		updatePager();
        		if($pageL.length==undefined || $howInput.length==undefined) return;
        		$pageL.html("/" + Math.ceil(count/limit));
        		$howInput.val((Math.ceil(start/limit) + 1));
        		if(options.showCount == true) {
        			$count.html("共 " + Math.ceil(count) + "条");
        		}
        	//	$status.text("第" + (Math.ceil(start/limit) + 1 ) + "页/共" + Math.ceil(count/limit) + "页　每页" + limit + "条/共" + count + "条");
        	} else if (count == -1) {
        		//$start.val("0");
        		start = Number($start.val());
        		limit = Number($limit.val());
        		updatePager();
        		//$last.hide();
//        		$pageL.html("页,共 " + Math.ceil(count/limit) + " 页显示 " + Number(start + 1) + " - " + Number(start+ limit) + "条");
        		if($pageL.length==undefined) return;
        		$pageL.html("/" + Math.ceil(count/limit));
        		if(options.showCount == true) {
        			$count.html("共 " + Math.ceil(0) + "条");
        		}
        		//$status.text("第" + start + "条~" + (start + limit) + "条/每页" + limit + "条");
        	}
        	else {
        		start = Number($start.val());
        		limit = Number($limit.val());
        		updatePager();
        	}
        }
        /**
         * 更新显示状态
         */
        function updatePager(){
        	var state = getNavState();
        	if ($first.length){
        		$first.attr("disabled", false)/*.removeClass("slick-icon-page-first-dis").addClass("slick-icon-page-first")*/;
        		if (!state.canGotoFirst) {$first.attr("disabled",true); /*$first.addClass("slick-icon-page-first-dis").removeClass("slick-icon-page-first")*/}
        	}
        	if ($last.length){
        		 $last.attr("disabled", false)/*.removeClass("slick-icon-page-last-dis").addClass("slick-icon-page-last")*/;
        		 if (!state.canGotoLast) {$last.attr("disabled",true);/*$last.addClass("slick-icon-page-last-dis").removeClass("slick-icon-page-last");*/}
        	}
        	if ($next.length){
        		 $next.attr("disabled", false)/*.removeClass("slick-icon-page-next-dis").addClass("slick-icon-page-next")*/;
        		 if (!state.canGotoNext) {$next.attr("disabled",true);/*$next.addClass("slick-icon-page-next-dis").removeClass("slick-icon-page-next");*/}
        	}
        	if ($prev.length){
        		$prev.attr("disabled", false)/*.removeClass("slick-icon-page-prev-dis").addClass("slick-icon-page-prev")*/;
        		if (!state.canGotoPrev) {$prev.attr("disabled",true);/*$prev.addClass("slick-icon-page-prev-dis").removeClass("slick-icon-page-prev");*/}
        	}
        }
        /**
         * 动态设置分页url
         * @method setPagerUrl
         * @param url url地址
         */
        function setPagerUrl(url) {
        	options.url = url;
        }
        function setExeQueryFn(fn){//人事人才扩展
              exeQueryFn = fn;
        }
        /**
         * 远程调用
         */
        function load(url, param) {
        	if(exeQueryFn){//人事人才扩展
        	   exeQueryFn.call(this);
        	}else{
	        	if (typeof options.validateForm == "function") {
	        		if (!options.validateForm()) {
	        			return;
	        		}
	        	}
	        	var suburl = url ? url : options.url;
	        	var submitString = options.submitIds != undefined? options.submitIds +  "," + grid.getGridId(): grid.getGridId();
	        	if (options.successCallBack == undefined) {
	        		Base.submit(submitString, suburl, param);
	        	} else {
	        		Base.submit(submitString, suburl, param, null, null, options.successCallBack);
	        	}
        	}
        }
		/**
		 * 判断是否可以进行一些操作
		 */
		function getNavState() {
			var cannotLeaveEditMode = !Slick.GlobalEditorLock.commitCurrentEdit();
            return {
                canGotoFirst:	!cannotLeaveEditMode && Number($limit.val()) != 0 && Number($start.val())/Number($limit.val())> 0,
                canGotoLast:	!cannotLeaveEditMode && Number($limit.val()) != 0 && Math.ceil(count/limit) > (Math.ceil(start/limit) + 1),
                canGotoPrev:	!cannotLeaveEditMode && Number($limit.val()) != 0&& Number($start.val())/Number($limit.val()) > 0,
                canGotoNext:!cannotLeaveEditMode && Number($limit.val()) != 0 && Math.ceil(count/limit) > (Math.ceil(start/limit) + 1)
            }
        }
        
        function gotoFirst() {
    		updatePager();
    		$start.val(0);
    		//$howInput.val(Math.ceil(start/limit) + 1);
    		load(options.url, options.param);
    		grid.clearDirtyWidthOutPager();
        }

        function gotoLast() {
        	updatePager();
        	var start = (Math.ceil(count/limit) -1) * limit ;
	        $start.val(start);
	        //$howInput.val(Math.ceil(start/limit) + 1);
        	load(options.url, options.param);
        	grid.clearDirtyWidthOutPager();
        }

        function gotoPrev() {
        	updatePager();
        	var num = Number($start.val()) - Number($limit.val());
        	if (num < 0) return;
        	$start.val(num);
        	//$howInput.val(Math.ceil(start/limit) + 1);
        	load(options.url, options.param);
        	grid.clearDirtyWidthOutPager();
        }

        function gotoNext(){
        	if ((Math.ceil(start/limit) + 1) == Math.ceil(count/limit)) return;//用count
        	updatePager();
        	$start.val(Number($start.val()) + Number($limit.val()));
        	//$howInput.val(Math.ceil(start/limit) + 1);
        	load(options.url, options.param);
        	grid.clearDirtyWidthOutPager();
        }
        /**
         * lins默认导出
         */
        function exportDefaultGridData() {
        	var a,b;
        	if(arguments[0] == "dangqian"){//导出当前页
        		a = grid.getColumns();
				b = grid.getDataView().getItems();
        	}else if(arguments[0] == "xuanze"){//导出选择数据
				a = grid.getColumns();
				b = grid.getSelectRowsDataToObj();
				b = $.extend(true, [], b);
				if(b.length < 1){
					Base.alert('请至少选择一条数据');
					return;
				}
			}
			var collection  = grid.getOptions().collectionsDataArrayObject;
			var row = [];
			var cell = [];
			var head =[];
			for (var i = 0; i < a.length; i ++ ) {
				if (a[i].id != "_checkbox_selector" && a[i].id != "__no" && !a[i].icon) {
					cell.push("\"" + a[i].id + "\"");
					head.push("\"" + a[i].name + "\"")
				}
			}
			row.push(head);
			for (var i = 0; i < b.length; i ++) {
				var cells=[];
				for (var j = 0; j < cell.length; j ++) {
					var cData = b[i][cell[j].replaceAll("\"","")];
					if(cData == undefined || cData === ""){
						cData = "";
					}else{
						//处理转义字符
						cData = JSON.stringify(cData.toString());
						cData = cData.substring(1, cData.length-1);
					}
					//var cData = b[i][cell[j].replaceAll("\"","")] == undefined?"":b[i][cell[j].replaceAll("\"","")].replaceAll("\"","\\\"");
					if (options.expKeyOrName == true && collection != undefined) {
							var collectcell = collection[cell[j].replaceAll("\"","")];
							var b_collected = false;
							if (collectcell && collectcell.length > 0) {
								for (var c = 0; c < collectcell.length ; c ++) {
									if (collectcell[c].id == cData) {
										//处理转义字符
										var collData = collectcell[c].name;
										collData = JSON.stringify(collData.toString());
										cells.push(collData);
										b_collected = false;
										break;
									} else {
										b_collected = true;
									}
								}
								if (b_collected) {
									cells.push("\"" + cData + "\"");
								}
							} else if (!b_collected) cells.push("\"" + cData + "\"");
					} else cells.push("\"" + cData + "\"");
				}
				row.push(cells);
			}
			var $input = $("<textarea/>").attr("display", "none").val(Ta.util.obj2string(row)).attr("name", "_grid_item_export_excel")
			var $form = $("<form/>")//.attr("enctype","multipart/form-data")//.attr("accept-charset", "GBK")
				.append($input).attr("method", "post")
				.attr("display", "none")
				.appendTo("body")
				.attr("action", Base.globvar.contextPath + "/exportGridDefaultExcel.do")
				.submit()
				.remove();
		}
		
		//导出所有数据
		function exportDefaultGridDataAll(){
			if(grid.getDataView().getItems().length == 0){
				Base.alert("数据不能为空");
				return;
			}
			var a = grid.getColumns();
			var collection = [];
			var obj = grid.getCollectionsDataArrayObject();
			if(options.expKeyOrName == true){
				for(var x in obj){
					collection.push("\""+x+"\"");
				}
			}
			var row = [];
			var cell = [];
			var head =[];
			for (var i = 0; i < a.length; i ++ ) {
				if (a[i].id != "_checkbox_selector" && a[i].id != "__no" && !a[i].icon) {
					cell.push("\"" + a[i].id + "\"");
					head.push("\"" + encodeURI(a[i].name) + "\"");
				}
			}
			row.push(head);
			row.push(cell);
			if(options.sqlStatementName && options.resultType){
				var sql = [],result = [];
				sql.push("\""+options.sqlStatementName+"\"");
				result.push("\""+options.resultType+"\"");
				row.push(sql);
				row.push(result);
			}else{
				Base.alert("导出全部数据必须设置sqlStatementName和resultType属性");
				return;
			}
			row.push(collection);
			var $input = $("<textarea id='_gridHead_'/>").css("display", "none").val(Ta.util.obj2string(row)).attr("name", "_gridHead_");
			$input.appendTo("body");
			toQuery("_gridHead_,"+grid.getOptions().pagingOptions.submitIds,Base.globvar.contextPath + "/exportGridDataAllExcel.do");
			$input.remove();
		}
		
		//通用查询
		function  toQuery(submitIds,url)
	   {
	       submitIds = submitIds?submitIds:"";
		   var aids = submitIds.split(',');
		 	//根据ids拼接传递的条件字符串
		 	 var   queryStr="";
			var  datagridids = [];
			if(aids){
				for(var i=0;i<aids.length;i++){
					if(aids[i]==null || aids[i]=='')continue;
					var obj = Base.getObj(aids[i]);
					var $obj = $(obj);
					if(obj && obj.cmptype!='datagrid' && ($obj.hasClass('panel') || $obj.hasClass('grid') || obj.cmptype=='flexbox' ||
					  (obj.tagName && (obj.tagName=='FORM' ||obj.tagName=='FIELDSET' || obj.tagName=='DIV'|| obj.tagName=='INPUT' || obj.tagName=='TEXTAREA' || obj.tagName=='SELECT') ) )){
						if(obj.cmptype=='flexbox')obj = $("#"+aids[i]);//下拉框
					  	
						for(var j=0;j<aids.length;j++){//对ids进行校验，不能父子嵌套
							if(aids[j]==null || aids[j]=='')continue;
							var obj2 = Base.getObj(aids[j]);
							if(obj2.cmptype=='flexbox')obj2 = $("#"+aids[j]);
							if(i != j && obj2.cmptype!='datagrid'){//找到其他对象
								
								if($(obj).has($(obj2)).length>0){
									alert(aids[j]+"对象在"+aids[i]+"对象里面，指定提交的元素id不能有包含与被包含关系");
									return false;
								}
								if($(obj2).has($(obj)).length>0){
									alert(aids[i]+"对象在"+aids[j]+"对象里面，指定提交的元素id不能有包含与被包含关系");
									return false;
								}
							}
						}
						if(queryStr=="")
							queryStr += $("#"+aids[i]).taserialize();
						else
							queryStr += "&"+$("#"+aids[i]).taserialize();
					}
					else if(obj.cmptype=='datagrid'){
						datagridids.push(new String(aids[i]));
						if(queryStr=="")
							queryStr += $("#"+aids[i]).taserialize();
						else
							queryStr += "&"+$("#"+aids[i]).taserialize();	
						aids[i]=null;//.splice(i,1);//删除当前id
					}
					else{
						alert("提交的submit ids只能是panel,fieldset,box,form elements,form,div,datagrid这些元素的id");
						return false;
					}
				}
			}
			//访问Action并提交参数
			 location.href=url+"?"+queryStr;
	   }
		function fullCanvas() {
			$defaultCanvas.show();
			$fullCanvas.hide();
			var $borderContainer=$("body").find("div.l-layout-left,div.l-layout-right,div.l-layout-center,div.l-layout-top,div.l-layout-bottom");//border布局下的区域
			$handler=$("body").find("div.l-layout-drophandle-left,div.l-layout-drophandle-right,div.l-layout-drophandle-top,div.l-layout-drophandle-bottom,div.l-layout-collapse-left,div.l-layout-collapse-right").not(":hidden");
			if($borderContainer.length>0 || $handler.length>0){
				grid.getContainer().width($(window).width() - 2);
				grid.getContainer().height($(window).height() - 2);
				grid.getContainer().addClass("slick-full-canvas-fixed");
				grid.resizeCanvas(true);
				$handler.hide();//隐藏border布局下的工具条
				$borderContainer.css({position:"static"});//设置所有的boder容器position 为static
			} else {
				grid.getContainer().width($(window).width() - 2);
				grid.getContainer().height($(window).height() - 2);
				grid.getContainer().addClass("slick-full-canvas");
				//grid.getContainer().addClass("slick-full-canvas-fixed");
				//grid.resizeCanvas(true);
				grid.resizeCanvas(true);
			}
		}
		function defaultCanvas() {
			$defaultCanvas.hide();
			$fullCanvas.show();
			var box = grid.getDefaultBox();
			var $borderContainer=$("body").find("div.l-layout-left,div.l-layout-right,div.l-layout-center,div.l-layout-top,div.l-layout-bottom");//border布局下的区域
			if($borderContainer.length>0 || $handler.length>0){
				grid.getContainer().width("100%").height(box.height).removeClass("slick-full-canvas-fixed");
				grid.resizeCanvas(true);
	    		$borderContainer.css({position:"absolute"});//恢复原有的设置
	    		$handler.show();//显示border布局下的工具条
			} else {
				grid.getContainer().width("100%").height(box.height).removeClass("slick-full-canvas");
				grid.resizeCanvas(true);
			}
		}
		/**
		 * 构建ui
		 */
        function constructPagerUI() {
            $container.empty();
            var $nav = $("<div class='slick-pager-nav-dis'/>").appendTo($container);
            if (options.showCount) {
            	$count = $("<span>").html("共" + 0 + "条&nbsp").appendTo($nav);
            }
            if (options.showDetails) {
//          		var $limitPre = $("<span>").html("&nbsp;&nbsp;每页").appendTo($nav);
          	var select='<select class="slick-pagination-page-list">';//change by zzb
        		if(typeof options.pageSize == "number"){
        			var array=[10,20,50,100,200,500];
    	            pageFirst=parseInt(options.pageSize);
    	            array.push(pageFirst);
    	            array.sort(function(a,b){return a>b?1:-1});//从小到大排序
    	            for(var i=0;i<array.length;i++){
    	            	if(i==0 || array[i]!=array[i-1]){
    	            		select+='<option>'+array[i]+'</option>';    	            		
    	            	}
        			}
        		}else if(typeof options.pageSize == "object"){
        			pageFirst=options.pageSize[0];
        			for(var i=0;i<options.pageSize.length;i++){
        				select+='<option>'+options.pageSize[i]+'</option>';
        			}
        		}
        		select+='</select>';
          		$limitInput = $(select);
          		$limitInput.appendTo($nav);
          		var input='<input type="text" class="slick-pagination-page-input" maxlength="5"></input>';
          		var $input=$(input);//add by zzb
          		$input.appendTo($nav);
          		$input.val(pageFirst);
          		$input.numberbox().change(function(e){
          			limit = Number($(this).val().trim());
					if (limit == "NaN" || limit <= 0){
				    	Base.alert("请输入正整数");
				    	return;
				    }
          			$limit.val(limit);
          			$limitInput.val(limit);
          			updatePager();
		        	load(options.url, options.param);
		        	grid.clearDirtyWidthOutPager();
          		});
          		$limitInput.change(function(value){
          			limit = Number($(this).val());
					$limit.val(limit);
					$input.val(limit);
					updatePager();
		        	load(options.url, options.param);
		        	grid.clearDirtyWidthOutPager();
          		});
//	            $("<span>").html("条&nbsp").appendTo($nav);
	            //$("<span class='tool-separator'/>").appendTo($nav);
          	}
            $("<span>").html("条/页").appendTo($nav);
          	if (options.showButton) {
	    		$first = $('<button type="button" value="首页">首页</button>').addClass("slick-icon-page-button")
	          			.appendTo($nav)
	          			.mouseover(function(){$(this).addClass('x-btn-over')})
	          			.mouseout(function(){$(this).removeClass('x-btn-over')})
	          			.click(gotoFirst).attr("disabled", true);
	    		$prev = $('<button type="button" value="上页">上页</button>').addClass("slick-icon-page-button")
	          			.appendTo($nav)
	          			.click(gotoPrev).attr("disabled", true);
	    		//$("<span class='tool-separator'/>").appendTo($nav);
          	}		
          	if (options.showDetails) {
	          	$howInput = $("<input>")
	          				.numberbox()
	          				.addClass("slick-pagination-page")
	          				.appendTo($nav)
	          				.val("1")
	          				.change(function() {
	          			          	start = Number(this.value) - 1;
									if (Number(start) == "NaN" || Number(start) < 0){
										$(this).val(1);
								    	Base.alert("请输入正整数");
								    	return;
								    }
									if(start >= $pageL.html().substring(1,$pageL.html().length)){
										Base.alert("超出总页数,将返回最后一页","error");
										$(this).val($pageL.html().substring(1,$pageL.html().length));
										start = Number(this.value) - 1;
									}
									$start.val(start * limit);
									updatePager();
						        	load(options.url, options.param);
						        	grid.clearDirtyWidthOutPager();
							})
	          				.keyup(function(e){
									if(e.keyCode==13){
										$(this).blur();
										if ($.browser.msie) {
											start = Number(this.value) - 1;
											if (Number(start) == "NaN" || Number(start) <= 0){
												$(this).val(1);
										    	Base.alert("请输入正整数");
										    	return;
										    }
											if(start >= $pageL.html().substring(1,$pageL.html().length)){
												Base.alert("超出总页数,将返回最后一页","error");
												$(this).val($pageL.html().substring(1,$pageL.html().length));
												start = Number(this.value) - 1;
											}
											$start.val(start * limit);
											updatePager();
								        	load(options.url, options.param);
								        	grid.clearDirtyWidthOutPager();
									
										}
									}
	          					});;
	            $pageL = $("<span>").addClass("slick-pager-font").html("/1").appendTo($nav);
	            //$("<span class='tool-separator'/>").appendTo($nav);
          	}
          	if (options.showButton) {
	    		$next = $('<button type="button">下页</button>').addClass("slick-icon-page-button")
	          			.appendTo($nav)
	          			.click(gotoNext).attr("disabled", true);
	    		$last = $('<button class="slick-icon-page-button" type="button">末页</button>')
	          			.appendTo($nav)
	          			.click(gotoLast).attr("disabled", true);
	    		// $("<span class='tool-separator'/>").appendTo($nav);
          	}

            $limit = $('<input id="'+grid.getGridId()+ '_limit" type="hidden" name="gridInfo[\''+grid.getGridId()+ '_limit\']" value="'+ options.pageSize +'"/>').appendTo($container);
            $start = $('<input id="'+grid.getGridId()+ '_start" type="hidden" name="gridInfo[\''+grid.getGridId()+ '_start\']" value="-1"/>').appendTo($container).val(0);
			
//            var icon_prefix = "<span class='ui-state-default ui-corner-all ui-icon-container'><span class='ui-icon ";
//            var icon_suffix = "' /></span>";

            var $settings = $("<span class='slick-pager-settings'/>").appendTo($container);
			/** 自定义button*/
			if (options.buttons) {
				for (var but = 0; but < options.buttons.length; but ++) {
					options.buttons[but].appendTo($settings);
				}
			}
			
            /**excel按钮**/
			if (options.showExcel) {
	          	//var $exportDefaultExcel = $('<button class="sexybutton toolbarbt" type="button"/>')
		          	//		.html('<span><span><span class="grid-icon-excel">导出</span></span></span>')
		          		//	.appendTo($settings).click(exportDefaultGridData);
		        var $exportDefaultExcel = $('<button class="sexybutton toolbarbt slick-pager-setting-button" type="button"/>')
							.html('<span class="slick-pager-export icon16" title="导出">导出</span>')
							.appendTo($settings);
				var c_id = grid.getGridId() + 'mm';
				var $c = $('<div id="'+c_id+ '" class="slick-pageToolExcelContent"></div>');
				var _dangqian_ = grid.getGridId() + '_dangqian_';
				var _xuanze_ = grid.getGridId() + '_xuanze_';
				var _quanbu_ = grid.getGridId() + '_quanbu_';
				var expButtonsArray = [],expButtonsStr = "";
				if(options.selectExpButtons){
					expButtonsArray = options.selectExpButtons.split(",");
					for(var i = 0 ; i < expButtonsArray.length; i++){
						if(expButtonsArray[i] == 1){
							expButtonsStr += '<div id="'+_dangqian_+ '" class="slick-datagrid-exp" title="导出当前页">导出当前页</div>';
						}else if(expButtonsArray[i] == 2){
							expButtonsStr += '<div id="'+_xuanze_+ '" class="slick-datagrid-exp" title="导出选择数据">导出选择数据</div>';
						}else if(expButtonsArray[i] == 3){
							expButtonsStr += '<div id="'+_quanbu_+'" class="slick-datagrid-exp" title="导出全部数据">导出全部数据</div>';
						}
					}
				}else{
					expButtonsStr += '<div id="'+_dangqian_+ '" class="slick-datagrid-exp" title="导出当前页">导出当前页</div><div id="'+_xuanze_+ '" class="slick-datagrid-exp" title="导出选择数据">导出选择数据</div><div id="'+_quanbu_+'" class="slick-datagrid-exp" title="导出全部数据">导出全部数据</div>';
				}
				
				$c.append(expButtonsStr);
				$exportDefaultExcel.after($c).click(function(e){
					var p = $exportDefaultExcel.position();
					var top = p.top - $c.outerHeight(true);
					$c.css({"top":top,"left":p.left});
					$c.show();
				});
				$('#'+_dangqian_).click(function(){
					exportDefaultGridData("dangqian");
					$c.hide();
				});
				$('#'+_xuanze_).click(function(){
					exportDefaultGridData("xuanze");
					$c.hide();
				});
				$('#'+_quanbu_).click(function(){
					exportDefaultGridDataAll();
					$c.hide();
				});
			}
			//yanglq  隐藏/显示列	
			if (options.showColumnsControl) {
				 var $showOrHidden = $('<button class="sexybutton toolbarbt" type="button"/>')
					.html('<span class="slick-pager-export icon16" title="显示隐藏列"/>')
				.appendTo($settings)
				.bind("click",function(e){
					var target = (e.target ? e.target : e.srcElement);
					var divObj = $("#"+grid.getGridId()+"_s_h");				
					if(divObj.length){	
						var p = $showOrHidden.position();
						var top = p.top - divObj.outerHeight(true);
						divObj.css({"top":top,"left":p.left-55-8-9});
						divObj.show();
					}else{									
						columnsHideOrShow($showOrHidden);
					}				
				});
			}
			if (options.showToFull || true) {
	          	$defaultCanvas = $('<button class="sexybutton toolbarbt slick-pager-setting-button" type="button"/>')
		          			.html('<span class="slick-pager-max-in icon16" title="最小化">最小化</span>')
		          			.appendTo($settings).css("display" ,"none").click(defaultCanvas);
			}
			if (options.showToFull || true) {
	          	$fullCanvas = $('<button class="sexybutton toolbarbt slick-pager-setting-button" type="button"/>')
		          			.html('<span class="slick-pager-max-out icon16" title="最大化">最大化</span>')
		          			.appendTo($settings).click(fullCanvas);
			}
//			if (options.showButton) {
//          		$(icon_prefix + "ui-icon-seek-first" + icon_suffix).click(gotoFirst).addClass("ui-state-disabled").appendTo($nav);
//         		$(icon_prefix + "ui-icon-seek-prev" + icon_suffix).click(gotoPrev).addClass("ui-state-disabled").appendTo($nav);
//         		$(icon_prefix + "ui-icon-seek-next" + icon_suffix).click(gotoNext).addClass("ui-state-disabled").appendTo($nav);
//			}
//         if (options.showCount)
//            	$(icon_prefix + "ui-icon-seek-end" + icon_suffix).click(gotoLast).addClass("ui-state-disabled").appendTo($nav);
                    
            $container.children().wrapAll("<div class='slick-pager' />");
        }
        /**
         * 重置
         * @method clearDirty
         */
		function clearDirty () {
			$start.val(0);
			count = -1;
			start = 0;
			updatePager();
			setStatus(count);
		}
		$(function(){//点击非导出按钮时，关闭导出选择按钮
			$("body").bind("mousedown", 
			function(event){
				if (!(event.target.id == (grid.getGridId() + 'mm') || $(event.target).parents("#" + grid.getGridId() + 'mm').length > 0)) {
					$("#"+grid.getGridId() + 'mm').hide();
				}
				if (!(event.target.id == (grid.getGridId() + '_s_h') || $(event.target).parents("#" + grid.getGridId() + '_s_h').length > 0)) {
					$("#"+grid.getGridId() + '_s_h').hide();
				}
			});
		});
		
		//yanglq
		function columnsHideOrShow($showOrHidden){
        	var $div = $("<div id='"+grid.getGridId()+"_s_h' class='slick-pageToolExcelContent'></div>");
        	var $divCheckbox = $("<div class='slick-boxComponent_1'></div>").appendTo($div);
        	//$div.appendTo("body");
        	
        	//var $headerColumns = $headers.children();
        	var $headerColumns = grid.getColumns();
        	for(var i=0;i < $headerColumns.length; i++){
        		var columnObj = $headerColumns[i];
        		//过滤掉 单选/复选框 和没有id以及序号列 
        		if(columnObj.id != "_checkbox_selector" && columnObj.id != "__no" && !columnObj.icon){
        			var $input = ["<div style='white-space: nowrap;'><input style='margin-right: 10px;' type='checkbox' checked='checked' value='"];
        			$input.push(columnObj.id);
        			$input.push("' />");
        			$input.push(columnObj.name);
        			$input.push("</div>");
        			$($input.join(""))
        			.appendTo($divCheckbox)
        			.bind("click",function(e){
        				var obj = (e.target ? e.target : e.srcElement);
        				var checkbox = $(this).children()[0];
        				if(obj.tagName.toUpperCase() == 'INPUT'){
        					if(checkbox.checked){
        						grid.setColumnShow(checkbox.value);
            				}else{
            					isLastColumn(checkbox,$divCheckbox);
            				}
        				}else{
        					if(checkbox.checked){
        						checkbox.checked = false;
        						isLastColumn(checkbox,$divCheckbox);
            				}else{
            					checkbox.checked = true;
            					grid.setColumnShow(checkbox.value);
            				}
        				}
        			});
        		}
        	}
        	var hiddenCols = grid.getHiddenColumns();
        	if(hiddenCols){
				for(var j=0;j < hiddenCols.length; j++){
            		var hideColumnObj = hiddenCols[j];
            		if(hideColumnObj.id != "_checkbox_selector" && hideColumnObj.id != "__no" && !hideColumnObj.icon){
            			var $input = ["<div style='white-space: nowrap;'><input style='margin-right: 10px;' type='checkbox' value='"];
            			$input.push(hideColumnObj.id);
            			$input.push("' />");
            			$input.push(hideColumnObj.name);
            			$input.push("</div>");
            			$($input.join("")).appendTo($divCheckbox)
            			.bind("click",function(e){
            				var obj = (e.target ? e.target : e.srcElement);
            				var checkbox = $(this).children()[0];
            				if(obj.tagName.toUpperCase() == 'INPUT'){
            					if(checkbox.checked){
            						grid.setColumnShow(checkbox.value);
                				}else{
                					isLastColumn(checkbox,$divCheckbox);
                				}
            				}else{
                				if(checkbox.checked){
                					checkbox.checked = false;
                					isLastColumn(checkbox,$divCheckbox);
                				}else{
                					checkbox.checked = true;
                					grid.setColumnShow(checkbox.value);
                				}
            				}           				
            			});
            		}
				}
			}
            
			$showOrHidden.after($div);
			var p = $showOrHidden.position();
			var top = p.top - $div.outerHeight(true);
			$div.css({"top":top,"left":p.left-55-8-9});
			$div.show();
		}
		  //判断是否只有一列数据,如果只有一列数据,不隐藏;
        function isLastColumn(checkbox,div){
        	var selected = div.find("input[type='checkbox']:checked");
			if(selected.length >= 1){
				grid.setColumnHidden(checkbox.value);
			}else{
				checkbox.checked = true;
			}
        }
        
		$.extend(this, {
            "setStatus" : setStatus,
            "setPagerUrl" : setPagerUrl,
            "clearDirty" : clearDirty,
            "setExeQueryFn":setExeQueryFn//人事人才扩展
        });
        init();
        return self;
    }
	
    // Slick.Controls.Pager
    $.extend(true, window, { Slick: { Controls: { Pager: SlickGridPager }}});
}));

grid.pager.js����΢��

1��147����   //ta3Cloud.js ����22603
var exeQueryFn;//�����˲���չ  
                 
2��26�д��� //22731
function setExeQueryFn(fn){//�����˲���չ
              exeQueryFn = fn;
        } 
                                         
3��141�Ŵ���   //22737
function load(url, param) {
        	if(exeQueryFn){//�����˲���չ
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

4��763�Ŵ���  //23025
$.extend(this, {
            "setStatus" : setStatus,
            "setPagerUrl" : setPagerUrl,
            "clearDirty" : clearDirty,
            "setExeQueryFn":setExeQueryFn//�����˲���չ
        });
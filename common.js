function initImages() {	
	//
	document.imageOut = new Object();
	document.imageOver = new Object();
	// PNG Fix for IE<7
	var png_fix = "images/png_fix.gif";
	var pngRegExp = new RegExp("\\.png$", "i")
	var f = "DXImageTransform.Microsoft.AlphaImageLoader";
	//
	var imageArray = $$("img", "input");
	imageArray.each(function(item){
		var image = item.src.substr(item.src.lastIndexOf("/")+1);
		var id = item.id || image.replace("_n.", "").replace("_N.", "");
		var hover = (image.toLowerCase().lastIndexOf("_n.") !=-1);
		//
		if (hover) {
			document.imageOut[id] = new Image();
			document.imageOut[id].src = item.src;
			document.imageOver[id] = new Image();
			document.imageOver[id].src = item.src.substr(0, item.src.lastIndexOf("/")+1)+image.replace("_n.", "_o.").replace("_N.", "_O.");
		}
		// PNG Fix for IE<7
		if (window.ie && !window.ie7 && image.test(pngRegExp)) {
			item.style.width = item.offsetWidth+"px";
			item.style.height = item.offsetHeight+"px";
			item.style.filter = "progid:"+f+"(src='"+item.src+"', sizingMethod='scale');";
			item.src = png_fix;
		}
		//
		if (hover) {
			item.onmouseover = function(){
				setImage(this, document.imageOver[this.id].src);
			}
			item.onmouseout = function(){
				setImage(this, document.imageOut[this.id].src);
			}
			item.id = id;
			//
			function setImage(imageObject, src) {
				if (window.ie && !window.ie7) {
					if (imageObject.filters[f] && imageObject.filters[f].src.test(pngRegExp)) {
						imageObject.filters[f].src = src;
					} else {
						imageObject.src = src;
					}
				} else {
					imageObject.src = src;
				}
			}
		}
	});
}
/////////////////////////////////////////////////////////////////////////
function initZoom(url) {
	//// INIT FOR ZOOM LAYERS
	var body = $$("body")[0];
	document.bgFrame = new Element("iframe").setProperties({
		src: "frame.html",
		frameBorder: "no",
		scrolling: "no"
	}).setStyles({
		position: "absolute",
		top: 0,
		left: 0,
		width: body.getCoordinates().width,
		height: body.getCoordinates().height,
		zIndex: 990
	}).setOpacity(0).injectInside(body);
	//
	document.bgdDiv = new Element("div").setStyles({
		position: "absolute",
		top: "250px",
		left: (body.getCoordinates().height-520)/2+"px",
		width: "520px",
		height: "520px",
		background: "#fff",
		zIndex: 991
	}).setOpacity(0).injectInside(body);
	new Element("p").setStyles({
		fontSize: "11px",
		color: "#333",
		margin: 0,
		textAlign: "center",
		padding: "100px 20px"
	}).appendText("Loading...").injectInside(document.bgdDiv);
	//
	document.closeZoom = new Element("a").setProperty("href", "javascript:void(0);").setStyles({
		position: "absolute",
		top: "260px",
		left: (body.getCoordinates().height-520)/2+495+"px",
		zIndex: 992
	}).setOpacity(0).addClass("closeBtn").injectInside(body);
	document.closeZoom.addEvent("click", function(){
		document.closeZoom.setOpacity(0);
		new Fx.Style(document.zoomImage, "opacity").start(1,0);
		new Fx.Style(document.bgdDiv, "opacity", {
			onComplete: function(){
				new Fx.Style(document.bgFrame, "opacity").start(0.5,0);
			}
		}).start(1, 0);
	})
	//
	document.zoomImage = new Element("div").setStyles({
		position: "absolute",
		top: "250px",
		left: (body.getCoordinates().height-520)/2+"px",
		padding: "10px",
		width: "490px",
		overflow: "hidden",
		zIndex: 991
	}).setOpacity(0).injectInside(body);
	//
	window.addEvent("resize", function(){
		document.bgFrame.setStyles({
			width: Math.max(body.getCoordinates().width, $("container").getCoordinates().width),
			height: body.getCoordinates().height
		});
	});
	//
	//
	//
	//
	//
	//
	//// INIT FOR SCROLLER  
	//
	var category = new fLoadXML(url, false);
	category.fSuccess = function(){
		var categoryItem = this.aXml['data'][0].category;
		var categoryList = $("scrollContent");
		categoryList.setHTML("");
		try {
			for (var i = 0; i < categoryItem.length; i++) {
				var oDivObject = new Element("div").setProperties({id: "cat_"+categoryItem[i].id[0].data}).setStyles({height: "54px", cursor: "pointer"}).addClass("highlightMetier").injectInside(categoryList);
				oDivObject.title = categoryItem[i].title[0].data;
				oDivObject.onmouseover = function(){
					if (document.activeCat != this.id) {
						$(this.id).setStyles({border: "1px solid #FF0000"});
					}
				}
				oDivObject.onmouseout = function(){
					if (document.activeCat != this.id) {
						$(this.id).setStyles({border: "1px solid #e8e8e8"});
					}
				}
				oDivObject.onclick = function(){
					if (document.activeCat == this.id) return;
					if ($(document.activeCat)) {
						$(document.activeCat).setStyles({border: "1px solid #e8e8e8"});
					}
					$(this.id).setStyles({border: "1px solid #FF0000"});
					document.activeCat = this.id;
					document.activeSubCat = null;
					document.catTitle = this.title;
					var id = this.id.replace("cat_", "");
					loadCategory(id);
				}
				new Element("img").setProperties({src: categoryItem[i].img[0].data}).injectInside(oDivObject);
				new Element("p").setStyles({padding:0, margin:0}).setHTML(categoryItem[i].title[0].data).injectInside(oDivObject);
				new Element("p").setStyles({padding:0, margin:0}).setHTML(categoryItem[i].date[0].data).injectInside(oDivObject);
				if (i == 0) {
					oDivObject.onclick();
				}
			}
			
			
			/////// INIT SCROLLING
			if(categoryItem.length > 5) {
				$('fichesScroller').setOpacity(1);
				var slideBarObj = new Slider($('slideBarContainer'), $('slideBar'), {onChange:function (pos) {
					slideBarObj.curPos = pos;
					slideContent.set(pos);
				}, mode:'vertical'});
				// define the fist position of the slide bar = 0;
				slideBarObj.curPos = 0;
				
				/////
				var slideContent = new Slider($('fichesMetiersList'), $('scrollContent'), {onChange:function (pos) {
					//slideBarObj.set(pos);
				}, mode:'vertical', wheel:true});
				slideContent.set(0);
				$('fichesMetiersList').removeEvents();
				$('scrollContent').removeEvents();
				///////
				$('slideBar').setStyles({cursor:'pointer'});
				$('scrollerUp').setStyles({cursor:'pointer'});
				$('scrollerUp').onmousedown = function(evt) {
					clearInterval(scrollInterval);
					scrollInterval = setInterval(function () {
						moveObj(slideBarObj, -2);
					}, 100);
				};
				$('scrollerUp').onclick = $('scrollerUp').onmouseout=function (evt) {
					clearInterval(scrollInterval);
				};
				$('scrollerDown').setStyles({cursor:'pointer'});
				$('scrollerDown').onmousedown = function(evt) {
					scrollInterval = setInterval(function () {
						moveObj(slideBarObj, 2);
					}, 100);
				};
				$('scrollerDown').onclick = $('scrollerDown').onmouseout=function (evt) {
					clearInterval(scrollInterval);
				};
			} else {
				$('fichesScroller').setOpacity(0);
				$('scrollContent').setStyles({top:"0"});
			}
		} catch (e) {}
	};
}

var loadCategory = function(catId) {
	var category = new fLoadXML("indexxml.php?nav1=getxml&nav2=photo&id="+catId, false);
	category.fSuccess = function(){
		document.imageArray = this.aXml['data'][0].image;
		$("hScrollContentRow").getChildren().each(function(item){
			item.remove();
		});
		var categoryItem = this.aXml['data'][0].image;
		document.imageId = null;
		try {
			document.maxItem = categoryItem.length;
			$("thumb1").setHTML("");
			for (var i = 0; i < categoryItem.length; i++) {
				var thisTd = new Element("td").injectInside($("hScrollContentRow"));
				var oImgObject = new Element("img").setProperties({id: "subcat_"+i, src: categoryItem[i].thumb[0].data, width:"54", height:"54"}).setStyles({padding: "1px", border:"1px solid #e8e8e8"}).injectInside(thisTd);
				oImgObject.setOpacity(0.5);
				oImgObject.enabled = false;
				oImgObject.onmouseover = function(){
					if (document.activeSubCat != this.id) {
						$(this.id).setStyles({borderColor: "#FF0000"});
					}
				}
				oImgObject.onmouseout = function(){
					if (document.activeSubCat != this.id) {
						$(this.id).setStyles({borderColor: "#e8e8e8"});
					}
				}
				oImgObject.onclick = function(){
					if (!this.enabled) {
						return;
					}
					if ($(document.activeSubCat)) {
						$(document.activeSubCat).setStyles({border: "1px solid #e8e8e8"});
					}
					$(this.id).setStyles({borderColor: "#FF0000"});
					document.activeSubCat = this.id;
					var id = this.id.replace("subcat_", "");
					loadImage(id);
				}
				// **********************************************************************************************
				// try to remove random file later.
				// **********************************************************************************************
				
				var imgLoader = new Element("img").setProperties({id: "subcatZoom_"+i, src: categoryItem[i].zoom[0].data+"?ran="+$time()}).setStyles({position: "absolute", left:"0px", top:"-5000px"}).injectInside($("thumb1"));
				imgLoader.addEvent("load", function(){
					var w = this.getCoordinates().width;
					var h = this.getCoordinates().height;
					var s = 242/Math.min(h,w);
					this.setStyles({width: w*s+"px", height: h*s+"px", top:"0px"});
					if (this.id != "subcatZoom_0"){
						this.setOpacity(0);
					}
					//
					var oImgBtn = $(this.id.replace("Zoom", ""));
					oImgBtn.enabled = true;
					oImgBtn.setOpacity(1).setStyles({cursor: "pointer"});
				});
				if (i==0) {
					oImgObject.setStyles({borderColor: "#FF0000"});
					document.activeSubCat = oImgObject.id;
					loadImage(0);
					imgLoader.setStyles({top:"0px"});
				}
			}
			
			if (categoryItem.length >5){
				$('hScroller').setOpacity(1);
				/////// INIT SCROLLING
				var hSlideBarObj = new Slider($('hSlideBarContainer'), $('hSlideBar'), {onChange:function (pos) {
					hSlideBarObj.curPos = pos;
					hSlideContent.set(pos);
				}});
				// define the fist position of the slide bar = 0;
				hSlideBarObj.curPos = 0;
				
				
				/////
				var hSlideContent = new Slider($('hFichesMetiersList'), $('hScrollContent'), {onChange:function (pos) {
					//hSlideBarObj.set(pos);
				}});
				hSlideContent.set(0);
				$('hFichesMetiersList').removeEvents();
				$('hScrollContent').removeEvents();
				///////
				$('hSlideBar').setStyles({cursor:'pointer'});
				$('scrollerLeft').setStyles({cursor:'pointer'});
				$('scrollerLeft').onmousedown = function(evt) {
					clearInterval(scrollInterval);
					scrollInterval = setInterval(function () {
						moveObj(hSlideBarObj, -2);
					}, 100);
				};
				$('scrollerLeft').onclick = $('scrollerLeft').onmouseout=function (evt) {
					clearInterval(scrollInterval);
				};
				$('scrollerRight').setStyles({cursor:'pointer'});
				$('scrollerRight').onmousedown = function(evt) {
					scrollInterval = setInterval(function () {
						moveObj(hSlideBarObj, 2);
					}, 100);
				};
				$('scrollerRight').onclick = $('scrollerRight').onmouseout=function (evt) {
					clearInterval(scrollInterval);
				};
				//
				
			} else {
				$('hScroller').setOpacity(0);
				$('hScrollContent').setStyles({left:"0"});
			}
		} catch (e) {}
	}
}

//
var loadImage = function(imageId) {
	if (imageId == document.imageId) return;
	var image = $("subcatZoom_"+imageId);
	new Fx.Style($("imgNav"), 'opacity').set(0);
	if ($("subcatZoom_"+document.imageId))
		new Fx.Style($("subcatZoom_"+document.imageId), 'opacity').start(1,0);
	var fadeFx = new Fx.Style(image, 'opacity', {
		onComplete:function(){
			$("imgTitle").setHTML(document.imageArray[imageId].title[0].data);
			$("catTitle").setHTML(document.catTitle);
			$("imgDate").setHTML(document.imageArray[imageId].date[0].data);
			$("jumpPrev").getParent().setStyles({visibility: (imageId == 0)?"hidden":"visible"})
			$("jumpNext").getParent().setStyles({visibility: (imageId == document.maxItem-1)?"hidden":"visible"})
			new Fx.Style($("imgNav"), 'opacity').start(0,1);
		}
	}).start(0,1);
	image.setProperties({
		alt: "click to zoom",
		title: "click to zoom"
	})
	image.full = document.imageArray[imageId].full[0].data;
	image.Fx = new Fx.Style(image, "opacity")
	image.addEvent("mouseover", function(e){
		image.Fx.stop();
		image.Fx.start(0.7);
	});
	image.addEvent("mouseout", function(e){
		image.Fx.stop();
		image.Fx.start(1);
	});
	document.zoomImage.empty();
	image.addEvent("click", function(e){
		document.bgdDiv.setStyles({
			height: "500px"
		});
		var zoomImgSrc = image.full+"?rand="+$time();
		new Fx.Style(document.bgFrame, "opacity", {
			onComplete: function(){
				new Fx.Style(document.bgdDiv, "opacity").start(0, 1);
				new Fx.Style(document.closeZoom, "opacity", {
					onComplete: function(){
						document.zoomImage.empty();
						document.zoomImage.setHTML("");
						var imgZoom = new Element("img").setProperty("src", zoomImgSrc).injectInside(document.zoomImage);
						imgZoom.addEvent("load", function(){
							new Fx.Style(document.bgdDiv, "height", {
								onComplete: function(){
									new Fx.Style(document.zoomImage, "opacity").start(0, 1);
								}
							}).start($(imgZoom).getCoordinates().height+20);
						});
					}
				}).start(0, 1);
			}
		}).start(0, 0.5);
	});
	//
	
	$("jumpPrev").onclick = function(){
		jump(-1);
	}
	$("jumpNext").onclick = function(){
		jump(1);
	}
	document.imageId = imageId;
}

var jump = function(step){
	var newId = Number(document.imageId)+step;
	if (newId<0 || newId>=document.imageArray.length) {
		return;
	}
	if ($(document.activeSubCat)) {
		$(document.activeSubCat).setStyles({border: "1px solid #e8e8e8"});
	}
	$("subcat_"+newId).setStyles({borderColor: "#f00"});
	document.activeSubCat = "subcat_"+newId;
	loadImage(newId);
}
/////////////////////////////////////////////////////////////////////////
var W3CDOM = (document.createElement && document.getElementsByTagName);
var curIndexs = -1;
var iClicks = new Array();
var iShows = new Array();
var mouseOvers = new Array();
var mouseOuts = new Array();
var oCloseZoom;
var oIcoZoom;
var oGalleryZoom;
var oPopUpImg;
var scrollInterval;

//end init
/*#################################################################
######################### EFFECT FUNCTIONS ########################
#################################################################*/
function swapTab(indexs, tabArr, tabContentArr) {
	if (curTabIndexs == indexs) {
		return;
	}
	if (tabArr[curTabIndexs]) {
		tabArr[curTabIndexs].getFirst().setProperty('src', tabArr[curTabIndexs].defaultImg);
		tabContentArr[curTabIndexs].setStyles({display:'none'});
		//opaceIt(tabContentArr[curTabIndexs], 0);
	}
	tabContentArr[indexs].setStyles({display:'block'});
	//opaceIt(tabContentArr[indexs], 1);
	curTabIndexs = indexs;
}
function moveObj(thisObj, thisPos) {
	if ((thisObj.curPos == 0) && (thisPos<0)) {
		return;
	}
	if ((thisObj.curPos == 100) && (thisPos>0)) {
		return;
	}
	thisObj.set(thisObj.curPos+thisPos);
}
function changeBkg(thisObj, bkgColor){
	if (!thisObj)
		return;	
	var myEffects = new Fx.Styles(thisObj, {duration: 300, transition: Fx.Transitions.quadIn});	
	myEffects.start({'background-color': bkgColor});	
}
function opaceIt(thisObj, opaceTo, newfunction) {
	if (!thisObj) {
		return;
	}
	var myEffects = new Fx.Styles(thisObj, {duration:400, transition:Fx.Transitions.quadInOut});
	myEffects.start({opacity:opaceTo, mozOpacity:opaceTo});
}
function showVisuel(indexs) {
	if (indexs == curIndexs) {
		return;
	}
	var oldIndexs = curIndexs;
	var frmObj = iShows[indexs];
	
	/*if (icoZoom.length > 0){
		//alert('change');
		
		//icoZoom.getFirst().setProperty('href', iShows[indexs].getFirst().getProperty('src'));
	
	//}*/
	frmObj.setStyles({opacity:0});
	frmObj.setStyles({mozOpacity:0});
	frmObj.setStyles({display:'block'});
	var myEffects = new Fx.Styles(frmObj, {duration:400, transition:Fx.Transitions.quadIn});
	myEffects.start({opacity:1, mozOpacity:1});
	opaceIt(iShows[curIndexs], 0);
	changeBkg(iClicks[curIndexs], '#f7f7f7');
	//
	curIndexs = indexs;
}
/*#################################################################
####################### END EFFECT FUNCTIONS ######################
#################################################################*/

////////////////////////////////////////////////////////////
//////////// FORM CHECKING FUNCTION AND ALERT //////////////
////////////////////////////////////////////////////////////


function Trim(str) {
	return str.replace(/^\s+/g, '').replace(/\s+$/g, '');
}
function isBlank(str) {
	if( str == "" ) 
		return true ;
	return false ;
}

function isEmail(s){
	if (s.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{2,4}$/) != -1)
		return true ;
	return false ;
}

function isDate(s) {
	if (s.search(/^([0]?[1-9]|[1|2][0-9]|[3][0|1])[.\/-]([0]?[1-9]|[1][0-2])[.\/-]([0-9]{4}|[0-9]{2})$/) != -1)
		return true ;
	return false ;
}
function IsNumeric(s){
	return !isNaN(s);
}
////////////////////////////////////////////////////////////
///////// END - FORM CHECKING FUNCTION AND ALERT ///////////
////////////////////////////////////////////////////////////
/*******************************************************
Bookmark Site
*******************************************************/
function checkTabCookies(){
	/*aTabsContent=$$("div.tabContent");
	if(aTabsContent.length>0){
		if(Cookie.get("lastTabId")){
			//alert(Cookie.get("lastTabId")+"-"+Cookie.get("lastTabIndex")+"-"+Cookie.get("lastTabName"));
			showTab($(Cookie.get("lastTabId")), Cookie.get("lastTabIndex"), Cookie.get("lastTabName"))
		}
	
		//alert(Cookie.get("lastTab"));
	}*/
	if (document.selectedMonth) {
		var i = document.selectedMonth;
		showTab($("tabBtn"+i), i, 'tabContent');
	}
}
var oldTab=null;
var oFirstTab=null;
function showTab(linkObject, index, tabName) {
	//alert(linkObject+"-"+index+"-"+tabName);
	if (document.oldLiTag){ 
		document.oldLiTag.className = document.oldLiTag.className.replace("Active", "");
	} else {
		document.oldLiTag=$$(".tabFirstActive")[0];
		oFirstTab=document.oldLiTag;
		document.oldLiTag.className="tabFirst";
	}
	
	if (oldTab!==null)  {
		oldTab.className="tabContent tabHide";
	} else {
		aTabsContent=$$("div.tabContent");
		aTabsContent.forEach(function(oTabContent){
			if(oTabContent.hasClass("tabHide")){
				
			} else {
				oldTab=oTabContent;
				oldTab.className="tabContent tabHide";
				//alert(oTabContent.id);
			}
		 });
	}
	
	//
	var liTag = linkObject.parentNode;
	
	if (liTag){
		if(liTag!==oFirstTab){
			liTag.className += "Active";
		} else {
			liTag.className = "tabFirstActive";
		}
	}
	
	document.oldLiTag = liTag;
	//
	var tab = $(tabName+index);
	tab.className = "tabContent";
	oldTab = tab;
	//Cookie.set("firstTab", tab, {duration: false});
	//Cookie.set("firstTabIndex", index, {duration: false});
	Cookie.set("lastTabId", linkObject.id, {duration: false}); 
	Cookie.set("lastTabIndex", index, {duration: false}); 
	Cookie.set("lastTabName", tabName, {duration: false}); 
	//
	//alert(liTag.className);
	//alert(index);
}

window.addEvent("load", function(){
	initImages();
	if ($("scrollContent")) initZoom("indexxml.php?nav1=getxml&nav2=gallery");
	/*/////////////////////////////////
	if ($('calendar'))
		var iCalendar = new Calendar($('calendar'));
	/////////////////////////////////*/
	$$('bigVisuel').each(
		function(item){
			item.setStyles({mozOpacity:0});
		}
	);
	
	//
	if(window.ie){lev=0;}else {lev=1;}
	$("header").setStyles({backgroundImage :"url("+$("moduletable").src+")"});
		
	if (typeof(initSubDirectory) == "function") initSubDirectory();
	if (typeof(initSubSlideDirectory) == "function") initSubSlideDirectory();
	if (typeof(initLinkList) == "function") initLinkList();
	if (typeof(initSlideContent) == "function") initSlideContent();
	if (typeof(setList) == "function") setList("A");
	checkTabCookies();//
	//setList("A");
});
	
/*******************************************************
Load Staff Show Hide Content
*******************************************************/
var currentId = 1;
function loadStaff(id) {
	var oldImg = $("staffImage"+currentId);
	oldImg.setStyle("display", "none");
	//
	var oldInfo = $("staffInfo"+currentId);
	oldInfo.setStyle("display", "none");
	//
	var img = $("staffImage"+id);
	img.setStyle("display", "block");
	//
	var info = $("staffInfo"+id);
	info.setStyle("display", "block");
	//
	currentId = id;
}
/*******************************************************
Show Hide Tabs
*******************************************************/
function showHideTab(index)
{
	var tabs = $$("div.tabActivity");
	for(i=0;i<tabs.length;i++){
		tabs.setStyles({position: "absolute", top:"-10000px", left:"-5000px"});
	}
	tabs[index].setStyles({position: "static", top:"0px", left:"0px"});
}


function initSlideContent() {
	var faqContents = $$('dd.faqContent');
	var togglers = $$('dt.faqTitle');
	if (!faqContents || !togglers)
		return;
	//
	togglers.each(function(toggler, i){
		toggler.defaultBkgImg = toggler.getFirst().getStyle('background-image');
		toggler.defaultColor = toggler.getFirst().getStyle('color');
		toggler.indexs = i;
	});
	
	
	var myAccordion = new Fx.Accordion(togglers, faqContents, {show:0, opacity: false, start: false, transition: Fx.Transitions.quadOut,
		onActive: function(toggler, i){
			toggler.getFirst().setStyles({
				backgroundImage: toggler.defaultBkgImg,
				color: '#2b56a0',
				cursor: 'default'
			});
			toggler.setStyles({
				paddingBottom: "6px"
			});
		},		
		onBackground: function(toggler, i){
			toggler.getFirst().setStyles({
				backgroundImage: 'url(images/bgd_icon_plus.gif)',
				color: '#464646',
				cursor: 'pointer'
			});
			toggler.setStyles({
				paddingBottom: "8px"
			});
		}
	});
}
//===================================
// Vu Lam added
function AjaxLoadYear(){
	
	$('form1').send({onComplete:UpdateBlockNewsletter});
	
}

function UpdateBlockNewsletter(result){
	if(result=='0'){
		$('newsletter_content').remove();
	}else{
		$('newsletter_content').innerHTML = result;
	}
}
function AjaxRequestDirectory(url){
	new Ajax(url,{
		method: 'get',
		update: $('blkalphabe'),
		onComplete: function(){
			$$('#blkalphabe .faqTitle3').each(function(item, j){
				var mainLink = item.getElement("a");
				var mainBlock = item.getNext();
				var myMainSlide = new Fx.Slide(mainBlock, {onComplete:function(){tweening = false;}});
				if (j != 0) {
					myMainSlide.hide();
				} else {
					mainSlide[i] = myMainSlide;
				}
				mainLink.index = i;
				mainLink.addEvent("click", function(){
					if (tweening) return;
					tweening = true;
					var thisId = this.index;
					if (mainSlide[thisId] && mainSlide[thisId] != myMainSlide) mainSlide[thisId].slideOut();
					mainSlide[thisId] = myMainSlide;
					myMainSlide.slideIn();
					//
				});
			});
		}
	}).request();
}
function AjaxRequestNews(url){
	var MyAjax = new Ajax(url,{
			 	method:'get',
				update:$('loadnews')
			 });
	MyAjax.request();
}
//------------------------------
var tweening = false;
var subSlide = new Object();
var mainSlide = new Object();
var slideHeight = new Object();
function initSubSlideDirectory(){
	for (var i=1; i<=3; i++) {
		//
		var subs = $$('dt.faqTitle'+i);
		subs.each(function(mainSub, j){
			//alert("dt.faqTitle"+i+""+(j+1)+" = "+$$("dt.faqTitle"+i+""+(j+1)).length)
			if ($$("dt.faqTitle"+i+""+(j+1)).length > 0) {
				$$("dt.faqTitle"+i+""+(j+1)).each(function(sub, k){
					var link = sub.getElement("a");
					var block = sub.getNext();
					var mySubSlide = new Fx.Slide(block, {onComplete:function(){tweening = false;}}).hide();
					//
					sub.getParent().setStyles({
						position: "static",
						top: 0,
						left: 0
					});
					link.index = i+""+(j+1);
					link.addEvent("click", function(){
						if (tweening) return;
						tweening = true;
						var thisId = this.index;
						if (subSlide[thisId] && subSlide[thisId] != mySubSlide) subSlide[thisId].slideOut();
						mySubSlide.slideIn();
						//
						var parentDD = $(this).getParent().getParent().getParent();
						var oldH = parentDD.getCoordinates().height;
						var thisBlock = $(this).getParent().getNext().getChildren()[0];
						var newH = oldH+thisBlock.getCoordinates().height;
						if (slideHeight[thisId]) newH -= slideHeight[thisId];
						new Fx.Style(parentDD.getParent(), 'height', {duration:500}).start(oldH, newH);
						//
						slideHeight[thisId] = thisBlock.getCoordinates().height;
						subSlide[thisId] = mySubSlide;
					});
				});
			}
			//
			var mainLink = mainSub.getElement("a");
			var mainBlock = mainSub.getNext();
			var myMainSlide = new Fx.Slide(mainBlock, {onComplete:function(){tweening = false;}});
			if (j != 0) {
				myMainSlide.hide();
			} else {
				mainSlide[i] = myMainSlide;
			}
			mainLink.index = i;
			mainLink.addEvent("click", function(){
				if (tweening) return;
				tweening = true;
				var thisId = this.index;
				if (mainSlide[thisId] && mainSlide[thisId] != myMainSlide) mainSlide[thisId].slideOut();
				mainSlide[thisId] = myMainSlide;
				myMainSlide.slideIn();
				//
			});
		});
	}
}

function initLinkList() {
	var list = $$("ul.alphabet li");
	list.each(function(li){
		var a = li.getChildren()[0];
		a.addEvent("click", function(){
			setList(this.innerHTML);
			if (!document.oldCharacter) document.oldCharacter = list[0].getChildren()[0];
			document.oldCharacter.removeClass("active");
			a.addClass("active");
			document.oldCharacter = this;
		});
	});
}

function setList(textIndex){
	var list = $$("dl.special");
	list.each(function(dd){
		if (dd.hasClass("char"+textIndex)){
			dd.setStyles({display: "block"});
		} else {
			dd.setStyles({display: "none"});
		}
	});
}
// "...  ...  ip0  ip0  ip0  ip1  ip1"
// "...  ...  ip0  ip0  ip0  ip1  ip1"
// "ip2  ip2  ip0  ip0  ip0  ...  ..."
// "ip2  ip2  ...  ip3  ip3  ...  ..."
// "...  ...  ...  ip3  ip3  ip4  ip4"
// "...  ...  ...  ...  ...  ip4  ip4"
// "ip5  ip5  ip5  ...  ...  ...  ..."
// "ip5  ip5  ip5  ...  ip6  ip6  ..."
// "ip5  ip5  ip5  ...  ip6  ip6  ..."
// "...  ...  ip7  ip7  ...  ...  ..."
// "...  ...  ip7  ip7  ...  ...  ..."
// "...  ...  ...  ip8  ip8  ip8  ..."
// "...  ...  ...  ip8  ip8  ip8  ..."
// "ip9  ip9  ...  ip8  ip8  ip8  ..."
// "ip9  ip9  ...  ...  ...  ip10 ip10"
// "...  ...  ...  ...  ...  ip10 ip10"
// "ip11 ip11 ip11 ...  ip13 ip13 ..."
// "ip11 ip11 ip11 ...  ip13 ip13 ..."
// "ip11 ip11 ip11 ...  ...  ...  ..."
// "...  ...  ip14 ip14 ...  ...  ..."
// "...  ...  ip14 ip14 ip12 ip12 ip12"
// "...  ...  ...  ...  ip12 ip12 ip12"
// "...  ...  ...  ...  ip12 ip12 ip12"
// "ip15 ip15 ...  ...  ...  ...  ..."
// "ip15 ip15 ...  ...  ...  ...  ..."
// "...  ...  ip16 ip16 ...  ...  ..."
// "...  ...  ip16 ip16 ...  ...  ..."
// "...  ...  ...  ip17 ip17 ...  ..."
// "...  ip18 ip18 ip17 ip17 ...  ..."
// "...  ip18 ip18 ...  ...  ip19 ip19"
// "...  ...  ...  ...  ...  ip19 ip19"




function loadGames() {
    isDesk?loadDeskGames():LoadMobileGames();
}

//显示普通
function loadDeskGames() {

    var data = games_infos;
    var oUl0 = document.getElementsByTagName("ul")[0];

    for (var i = 0; i < 5; i++) {
        var oLi = document.createElement("li");

        var game_icon = gamepath+ data.gameList[i].icon;
        var game_name = data.gameList[i].gname.replaceAll("_"," ");
        var game_name = game_name.replaceAll("-"," ");
        var ahref = "/detail.html?id=" +  data.gameList[i].id;
        oLi.innerHTML = '<a href=' +  ahref + ' class="I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip' + i + '" style="background-image: url(&quot;' + game_icon + '&quot;);"><picture class="EtaFjSLj6ZlVyLWzxjzK"><source srcset="' +game_icon + ' 1x, ' + game_icon + ' 2x" media="(min-width: 991px)" width="314" height="314"><img src="' + game_icon + '" alt="' + game_name + '" srcset="' + game_icon + ' 1x,' + game_icon + ' 2x" loading="lazy" decoding="async" width="204" height="204" class="omIThBX9w3QarB_pnFby"></picture><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + game_name + '</span></a>'

        oUl0.appendChild(oLi);
    }


    var oUl = document.querySelectorAll("#app-root > div.lStd1276e_IhuA3g3FIs.s9w4UjUUDL2klmhRDNdo > div:nth-child(1) > div:nth-child(2)")[0];

    
    for (var i = 5; i < data.gameList.length; i++) {
        var game_icon = gamepath+ data.gameList[i].icon;
        var game_name = data.gameList[i].gname.replaceAll("_"," ");
        var game_name = game_name.replaceAll("-"," ");
        var game_id = data.gameList[i].id;
        var a = document.createElement("a");
        a.href =  "/detail.html?id=" + game_id;
        a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip" + (6 + i).toString();
        a.innerHTML = '<picture class="EtaFjSLj6ZlVyLWzxjzK"><source srcset="' + game_icon+ ' 1x, ' +game_icon + ' 2x" media="(min-width: 1211px)" width="204" height="204"><img src="' + game_icon + '" alt="Make It Meme" srcset="' +game_icon + ' 1x, ' + game_icon + ' 2x" loading="lazy" decoding="async" width="314" height="314" class="omIThBX9w3QarB_pnFby"></picture><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + game_name + '</span>'
        oUl.appendChild(a);
    }

}

var currentPos = 0;//当前游戏数量
var lenPerDiv = 24;
var gameLen;
function LoadMobileGames()
{ 
     gameLen  = games_infos.gameList.length;

     var len = gameLen > lenPerDiv ? lenPerDiv:gameLen;
     loadMobileGameByStartPos(currentPos,len - 1);
     currentPos = currentPos + len - 1;
     
    //  setTimeout(() => {
    //     document.body.scrollTop = last_scroll_top;
    //  }, 2e3);
    //  var divCount = Math.ceil((data.gameList.length-100 - lenPerDiv + 1 ) / (lenPerDiv+1)); 

    //  for(var i = 0; i < divCount ; i++){
    //     var startPos = lenPerDiv - 1 + i*lenPerDiv;
    //     if(i == divCount - 1){
    //         loadMobileGameByStartPos(startPos,lenPerDiv,false);
    //     }
      
    //     else{
    //         loadMobileGameByStartPos(startPos,lenPerDiv);
    //     }
    
    //  }

}

//加载更多的手机游戏
function LoadMoreMobileGames()
{
    var gameLen  = games_infos.gameList.length;
    if(currentPos + lenPerDiv < gameLen ){
        loadMobileGameByStartPos(currentPos,lenPerDiv);
        currentPos += lenPerDiv;
        console.log(currentPos);
    }
    else if(gameLen - currentPos > 0){
        loadMobileGameByStartPos(currentPos,gameLen - currentPos,false);
        currentPos = gameLen;
        console.log(currentPos);
    }

}


function loadMobileGameByStartPos(startPos,divLen,hasBigIcon = true){   
    var data = games_infos;
    mobileGameDisplayEl = document.querySelector(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x");
    var divE = document.createElement("Div");
    divE.className = "vtbwTfQNi80Hes0DzmGs sVO_yY3sP6R0A04SxJ_L";
     for(var i = 0; i < divLen; i++){
        if(startPos + i > data.gameList.length-1){
            break;
        }
        var a = document.createElement("a");
        a.href =  "/detail.html?id=" + data.gameList[startPos + i].id;

        if(i < 10 && hasBigIcon){
            a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR XxuAeockFFccwluXvlEw ip" + i.toString();
        }
        else{
            a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR";
        }
        
        var game_icon = gamepath + data.gameList[startPos + i].icon;
        var game_name = data.gameList[startPos + i].gname.replaceAll("_"," ");
        var game_name = game_name.replaceAll("-"," ");
        a.innerHTML = '<picture class="EtaFjSLj6ZlVyLWzxjzK"><source srcset="' + game_icon+ ' 1x, ' +game_icon + ' 2x" media="(min-width: 1211px)" width="204" height="204"><img src="' + game_icon + '" alt="Make It Meme" srcset="' +game_icon + ' 1x, ' + game_icon + ' 2x" loading="lazy" decoding="async" width="314" height="314" class="omIThBX9w3QarB_pnFby"></picture><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + game_name + '</span>';
        divE.appendChild(a);
     }

     $(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x").children().last().before(divE);
}


function loadCategory(){
    isDesk?loadDeskCategory():loadMobileCategory();
}


function loadDeskCategory() {
    var data = category_infos;
    var cEl1 = document.querySelector("#app-root > div.lStd1276e_IhuA3g3FIs.s9w4UjUUDL2klmhRDNdo > div:nth-child(2) > div:nth-child(1)");
    for (var i = 0; i < 6; i++) {
        var a = document.createElement("a");
        var categoryid = data.categoryList[i].id
        a.href = "./category.html?id=" + categoryid;
        a.className = "DIxbY_Wd8M99mMzbD9Jz WNKx5SMWQkliDlBi9d5r";
        a.innerHTML = '<img src="' + categorypath + data.categoryList[i].icon + '" width="204" height="204" alt="' + data.categoryList[i].name + '" loading="lazy" class="VrWOfVJtTjn2FNJx0TFc" /><span class="QGnVckPD11ZTkQr8o8ci">' + data.categoryList[i].name + '</span>'

        cEl1.appendChild(a);
    }
    var cEl2 = document.querySelector("#app-root > div.lStd1276e_IhuA3g3FIs.s9w4UjUUDL2klmhRDNdo > div:nth-child(2) > div:nth-child(2)");

    for (var i = 6; i < data.categoryList.length; i++) {
        var a = document.createElement("a");
        var categoryid = data.categoryList[i].id
        a.href = "./category.html?id=" + categoryid;
        a.className = "DIxbY_Wd8M99mMzbD9Jz Ll7V72dm63WTr1buD4lg";
        a.innerHTML = '<img src="' + categorypath+ data.categoryList[i].icon + '" width="94" height="94" alt="' + data.categoryList[i].name + '" loading="lazy" class="VrWOfVJtTjn2FNJx0TFc" /><span class="QGnVckPD11ZTkQr8o8ci">' + data.categoryList[i].name + '</span></a>'

        cEl2.appendChild(a);
    }
}

function loadMobileCategory(){
    var data = category_infos;
    mobileGameDisplayEl = document.querySelector(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x");
    var divE = document.createElement("Div");
    divE.className = "vtbwTfQNi80Hes0DzmGs sVO_yY3sP6R0A04SxJ_L";
    for(var i = 0; i < data.categoryList.length; i++){
        var a = document.createElement("a");
        var categoryid = data.categoryList[i].id
        a.href = "./category.html?id=" + categoryid;
        a.className = "DIxbY_Wd8M99mMzbD9Jz Ll7V72dm63WTr1buD4lg";
        a.innerHTML = '<img src="' + categorypath+ data.categoryList[i].icon + '" width="94" height="94" alt="' + data.categoryList[i].name + '" loading="lazy" class="VrWOfVJtTjn2FNJx0TFc" /><span class="QGnVckPD11ZTkQr8o8ci">' + data.categoryList[i].name + '</span></a>'

        divE.appendChild(a);
    }
    mobileGameDisplayEl.appendChild(divE);
}


var searchValue = "";


///显示搜索页面
function openShowSearchPanel() {
    showElement(searchPanelEl);
    showElement(bgEl);
    gameDisplayEl.style.overflow = "hidden";
    filterSearchContent();
}

///显示搜索页面
function closeShowSearchPanel() {
    hideElement(searchPanelEl);
    hideElement(bgEl);
    gameDisplayEl.style.overflow = "auto";
}



function filterSearchContent() {
    
    var searchValue = inputSearchEl.value==""?"##############################":inputSearchEl.value.toLowerCase();
    var searchData = games_infos.gameList.filter((item) => item.gname.toLowerCase().indexOf(searchValue) > -1);

    searchContentEl.innerHTML = "";
    
    isDesk?showDeskSearchContent(searchData):showMobileSearchContent(searchData);
   


}

function showDeskSearchContent(filterData){
    for (var i = 0; i < filterData.length; i++) {
        var game_icon = gamepath + filterData[i].icon;
        var a = document.createElement("a");

        a.href = "/detail.html?id=" + filterData[i].id ;
        a.className = "I_N3HLb877sRrr2UZJfZ xCChko93rfK8hvsE5sNR";
        a.innerHTML = '<img src="' + game_icon + '" ' + game_icon + ' 1x, ' + game_icon + ' 2x" alt="' + game_icon + '" loading="lazy" decoding="async" width="94" height="94" class="omIThBX9w3QarB_pnFby"><span class="MHaP7Us7V6KqGxb8muHM global-cq-title">' + filterData[i].gname + '</span>'

        searchContentEl.appendChild(a);
    }
}


function showMobileSearchContent(filterData){

    for (var i = 0; i < filterData.length; i++) {
        var game_icon = gamepath + filterData[i].icon;
        var name = filterData[i].gname;
        var a = document.createElement("a");
        a.href = "/detail.html?id=" + filterData[i].id ;
        a.className = "Rb7HuIF8jKcIe2nU91ai UoAfP265z4mp2pLVnJgN KoHkUVmXR7joVgQZvggn";
        a.innerHTML = '<img alt="' + name + '" src="' + game_icon + '" srcset="' + game_icon + ' 1x, ' + game_icon + ' 2x" decoding="async" width="40" height="40" class="YBUdSAqsfPvMt4mvmjkA WM2RGMygSCak_g50DlI3"><div class="dyYMg3HqmmbjhYCLC8lg Qsj6z4yh8zGCZDhl_KML"><div class="L7rv0e7LkdrpUjPZq3gH">' + name + '</div><span class="pyOBngxafEnwWKrr93IQ"></span></div><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="lGtOMKHvtki_BSIeZKa5"><use href="#thinArrowIcon"></use></svg>'

        searchContentEl.appendChild(a);
    }


   
}




var last_scroll_top = 0;

window.onload = function () {  
    window.sessionStorage&&(last_scroll_top =window.sessionStorage.getItem("last_scroll_top"),console.log("get:"  + window.sessionStorage.getItem("last_scroll_top")));
    preInit();
    
    loadCategory();
    loadGames();
   
    initElement();
    initUIHandle();
}




var navEl;
var searchContentEl;
var noSearchTipEl;
var searchPanelEl;
var bgEl;
var gameDisplayEl;

var searchBtnEl;
var closeSearchBtnEl;
var categorypath = "/assets/icons/category/";
var gamepath  = "/assets/icons/game/";
var isDesk = true;
var inputSearchEl;

var last_scroll_top = 0;

var userScroll = false;  

function preInit(){

    $(function() { 
    
        // reset flag on back/forward 
        // $.history.init(function(hash){ 
        //     userScroll = false; 
        // }); 
    
        $(document).keydown(function(e) { 
            if(e.which == 33        // page up 
               || e.which == 34     // page dn 
               || e.which == 32     // spacebar
               || e.which == 38     // up 
               || e.which == 40     // down 
               || (e.ctrlKey && e.which == 36)     // ctrl + home 
               || (e.ctrlKey && e.which == 35)     // ctrl + end 
              ) { 
                userScroll = true; 
            } 
        }); 
    
        // detect user scroll through mouse
        // Mozilla/Webkit 
        if(window.addEventListener) {
            document.addEventListener('DOMMouseScroll', mouseEvent, false); 
        }
    
        //for IE/OPERA etc 
        document.onmousewheel = mouseEvent; 
    
    
      
    }); 
    
    userScroll =false;
    isDesk = document.body.className == "DeskVersion" ? true : false;
}

function initElement() {
    navEl = document.querySelector("#nav");
    searchContentEl = isDesk ? document.querySelector(".AbPoNGztukbS1wl5bcmt.yanfEXzbvdGsPis_ItLV"):document.querySelector(".AbPoNGztukbS1wl5bcmt.lcdG68I_Um0yTmQFfvKY"); //搜索显示元素
    noSearchTipEl = document.querySelector("div.zuKNfnid1j68xnLS9ZiH > div.dT3EegLpfzUUgPdDhOfx"); //没有搜索到元素提示显示
    searchPanelEl = isDesk?document.querySelector("#app-root > div:nth-child(1) > section"):document.querySelector(".kWQWzdYW881_EYiVCO5J.JfwQbhsyFVjMXL4TciK2");
    bgEl = document.querySelector(".idzxSUf9DX32i1uhNIuG");
    gameDisplayEl = document.body;
    searchBtnEl =document.querySelector(".ltAYdgxBAJy9br2MmQME > use") ;
    closeSearchBtnEl = isDesk? document.querySelector(".buttonReset.Y8WvtyOECzLsN3k0_OFx") :document.querySelector(".buttonReset.Y8WvtyOECzLsN3k0_OFx.qL3lVMIHyY8jhn2udhLe") ;

}


function initUIHandle() {
    isDesk?initDeskHandle(): initMobileHandle();

}

function initDeskHandle(){
    document.querySelector(".B_5ykBA46kDOxiz_R9wm").parentElement.addEventListener('click', function () {
        openShowSearchPanel();
    }, false);

    document.querySelector(".QhChQVv3CuMGGXzujgBd").parentElement.addEventListener('click', function () {
        closeShowSearchPanel();
    }, false);

    document.querySelector("div.N_0UqJKlXjVZcfq8sKkD > button").addEventListener('click', function () {
        closeShowSearchPanel();
    }, false);

    closeSearchBtnEl.addEventListener('click', function () {
        showElement(searchBtnEl);
        hideElement(closeSearchBtnEl);
        inputSearchEl.value = "";

        filterSearchContent()
    }, false);

    inputSearchEl = document.querySelector('.rReA1JktpILd2Q36MPl6');
    inputSearchEl.addEventListener('keyup', () => {

        searchValue = inputSearchEl.value;
        showElement(closeSearchBtnEl);
        hideElement(searchBtnEl);

        filterSearchContent();
    });
}


var loadMoreGameFlag = false;

function initMobileHandle(){
    document.querySelector(".buttonReset.Ms6HEJ826qeso4NBVCoW.dh2x0Msr5tQ9qK1KUc6A").addEventListener('click', function () {
        openShowSearchPanel();
    }, false); 
    document.querySelector(".buttonReset.cASKzCoNR2uSR8G9mVE4").addEventListener('click', function () {
        closeShowSearchPanel();
    }, false);
    
    closeSearchBtnEl.addEventListener('click', function () {
        showElement(searchBtnEl);
        hideElement(closeSearchBtnEl);
        inputSearchEl.value = "";
        filterSearchContent()
    }, false);

    inputSearchEl = document.querySelector('.rReA1JktpILd2Q36MPl6');
    inputSearchEl.addEventListener('keyup', () => {

        searchValue = inputSearchEl.value;
        showElement(closeSearchBtnEl);
        hideElement(searchBtnEl);

        filterSearchContent();
    });


    document.addEventListener('wheel', function(event) {
       
        loadMoreGameFlag = true;
        userScroll = true;
    });

 
    document.addEventListener('touchstart', function(event) {

        loadMoreGameFlag = true;
        userScroll = true;
    });

    document.addEventListener('touchend', function(event) {
        loadMoreGameFlag = false;
    });

    document.addEventListener('visibilitychange', function logData() {
        if (document.visibilityState === 'hidden') {
            window.sessionStorage && window.sessionStorage.setItem("last_scroll_top",document.body.scrollTop);
            window.sessionStorage && window.sessionStorage.setItem("last_game_count",currentPos);
        }
    });



    window.onscroll = () => {
        var categoryHeight = $(".lStd1276e_IhuA3g3FIs.ADMPJVcFvhX6udYDGs_x").children().last().height();

        if(userScroll){
       
            if(document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight - categoryHeight - 250){
                if(currentPos + 24 < gameLen || gameLen - currentPos -1 > 0)
                 LoadMoreMobileGames();
                
                
            }
        }
        else{



            if(document.body.scrollTop + document.body.clientHeight >= document.body.scrollHeight - categoryHeight - 250){
                if(currentPos + 24 < gameLen || gameLen - currentPos -1 > 0)
                 if(currentPos <  window.sessionStorage.getItem("last_game_count"))
                     LoadMoreMobileGames();
                 
                 if(currentPos>=window.sessionStorage.getItem("last_game_count")){
                    window.sessionStorage && (document.body.scrollTop = window.sessionStorage.getItem("last_scroll_top"));
                 }
                
            }
          
        }
    
    }
    

   
}

    
   


function mouseEvent(e) { 
    userScroll = true; 
} 



// 隐藏元素
function hideElement(element) {
    element.style.display = 'none';
}

// 显示元素
function showElement(element) {
    element.style.display = 'block'; // 或者之前的值
}
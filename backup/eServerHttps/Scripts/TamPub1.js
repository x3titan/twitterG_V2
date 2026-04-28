//将秒值转换为可显示的时间 xx日xx小时xx分xx秒
function DT_DisplaySecond(SecValue){   
    var Day=parseInt(SecValue/(24*3600)); SecValue-=(Day*24*3600);
    var Hour=parseInt(SecValue/3600); SecValue-=(Hour*3600);
    var Min=parseInt(SecValue/60); SecValue-=(Min*60);
    var Result="";
    if (Day>0) {
        Result+=Day+"天";
    }
    if ((Hour>0)||(Result!="")) {
        Result+=Hour+"小时";
    }
    if ((Min>0)||(Result!="")) {
        if (Min<10) Result+="0";
        Result+=Min+"分";
    }
    if ((SecValue<10)&&(Result!="")){
        Result+="0";
    }   
    Result+=SecValue+"秒";    
    return Result;
}

function IsEmpty(Value) { //判断Value是否是空或者undefined
    return ((Value==null)||(Value==undefined));
}

//在标题写日志功能，方便调试用
var WriteTitleLog_Time = 0;
function WriteTitleLog(LogString) {
    if (WriteTitleLog_Time==0) {
        document.title=LogString;
        WriteTitleLog_Time=new Date();
        return;
    }
    if (document.title.length>70) document.title="";
    document.title+=","+LogString+"("+((new Date())-WriteTitleLog_Time)+")";
    WriteTitleLog_Time=new Date();
}

//高级随机函数
function Random(InitSeed) {
    this.Seed = InitSeed; //种子可以被再次指定
    this.Next = function() {
        this.Seed=(this.Seed*9301+49297) % 233280; 
　　　　return (this.Seed/(233280.0));//由于压缩时,压缩成RETURNTHIS.特加个();///zhou change 2009-12-29  
    }
    this.NextInt = function(Range) {
        var Value = this.Next();
        return Math.floor(Value*Range);
    }
}

var TDIV_Current = null;
function TDIV_C(Parent) { //Tam <DIV> Create
    TDIV_Current=document.createElement("div");
    if (Parent==null) {
        document.body.insertBefore(TDIV_Current,document.body.firstChild);
    } else Parent.appendChild(TDIV_Current);
    TDIV_Current.style.overflow="hidden";
    TDIV_Current.style.position="absolute";
    TDIV_Current.style.whiteSpace="nowrap";
    TDIV_Current.style.fontFamily="宋体";
    TDIV_Current.style.fontSize="9pt";
    TDIV_Current.style.textAlign="left";
    return TDIV_Current;
}
function TDIV_P(Left,Top,Width,Height) { //Tam <DIV> set Position
    var iTemp;
    if (!IsEmpty(Left)) {
        iTemp=parseInt(Left);
        if ((TDIV_Current.style.pixelLeft!=iTemp)||(TDIV_Current.style.left=="")) TDIV_Current.style.left=iTemp;
    }
    if (!IsEmpty(Top)) {
        iTemp=parseInt(Top);
        if ((TDIV_Current.style.pixelTop!=iTemp)||(TDIV_Current.style.top=="")) TDIV_Current.style.top=iTemp;
    }
    if (!IsEmpty(Width)) {
        iTemp=parseInt(Width);
        if (iTemp<0) iTemp=0;
        if ((TDIV_Current.style.pixelWidth!=iTemp)||(TDIV_Current.style.width=="")) TDIV_Current.style.width=iTemp;
    }
    if (!IsEmpty(Height)) {
        iTemp=parseInt(Height);
        if (iTemp<0) iTemp=0;
        if ((TDIV_Current.style.pixelHeight!=iTemp)||(TDIV_Current.style.height=="")) TDIV_Current.style.height=iTemp;
    }
}
function TDIV_ScrX(Div) { //获取Div相对于浏览器的X
    var x,p;
    x=Div.offsetLeft;
    p=Div.parentNode;
    while (p!=document.body) { 
        x=x+p.offsetLeft;
        p=p.parentNode;
    }
    return x;
}
function TDIV_ScrY(Div) { //获取Div相对于浏览器的Y
    var y,p;
    y=Div.offsetTop;
    p=Div.parentNode;
    while (p!=document.body) {
        y=y+p.offsetTop;
        p=p.parentNode;
    }
    return y;
}
function TDIV_InRange(Div,x,y) { //鼠标的x,y(event.clientX,event.clientY) 是否在DIV区域内
    x-=TDIV_ScrX(Div);
    y-=TDIV_ScrY(Div);
    var InRange=true;
    if ((x<0)||(x>Div.clientWidth)) InRange=false;
    if ((y<0)||(y>Div.clientHeight)) InRange=false;
    return InRange;
}

var TIMG_Current = null;
function TIMG_C(Parent,ImgName) { //Tam <IMG> Create
    TIMG_Current=document.createElement("img");
    if (Parent==null) {
        document.body.insertBefore(TIMG_Current,document.body.firstChild);
    } else Parent.appendChild(TIMG_Current);
    TIMG_Current.style.position = "absolute";
    TIMG_Current.src=ImgName;
    return TIMG_Current;
}
function TIMG_P(Left,Top,Width,Height) { //Tam <IMG> set Position
    if (!IsEmpty(Left)) TIMG_Current.style.left=Left;
    if (!IsEmpty(Top)) TIMG_Current.style.top=Top;
    if (!IsEmpty(Width)) TIMG_Current.width=Width;
    if (!IsEmpty(Height)) TIMG_Current.height=Height;
}
function TAM_RootPath() {
    var Path=location.href;   
    Path=Path.substring(0,Path.indexOf("/",7)+1);
    return Path;
}
function TAM_GetPath(PathName) {
    return PathName.substring(0,PathName.lastIndexOf("/")+1);
}
function TAM_IEVersion() {
    return parseInt(parseFloat(navigator.appVersion.split("MSIE")[1]));
}

//通过ID记录已创建的类
function TTAM_ObjectIDItem() {
    this.ObjID = 0;
    this.ObjHandle = null;
}
function TTAM_ObjectID() {
    this.Objects = new Array();
    this.Current = new TTAM_ObjectIDItem();
    this.IDValue = 0;
    this.Append = function(ObjHandle) {
        this.Current=new TTAM_ObjectIDItem();
        this.IDValue++;
        this.Current.ObjID=this.IDValue;
        this.Current.ObjHandle=ObjHandle;
        this.Objects.push(this.Current);
        return this.IDValue;
    }
    this.Remove = function(ObjID) {
        var i;
        for (i=0; i<this.Objects.length; i++) {
            if (this.Objects[i].ObjID==ObjID) break;
        }
        if (i>=this.Objects.length) return false;
        var Index=i;
        var Temp=this.Objects[Index];
        for (var i=Index; i<this.Objects.length-1; i++) this.Objects[i]=this.Objects[i+1];
        this.Objects[this.Objects.length-1]=Temp;
        this.Objects.pop();
        return true;
    }
    this.GetByID = function(ObjID) {
        var i;
        for (i=0; i<this.Objects.length; i++) {
            if (this.Objects[i].ObjID==ObjID) {
                this.Current=this.Objects[i];
                return true;
            }
        }
        return false;
    }
    this.Clear = function() {
        while (this.Objects.length>0) this.Objects.pop();
    }
}
var TAM_ObjectID = new TTAM_ObjectID();

//运动路径算法
function TTAM_MotionPath() {
    //public
    this.StartValue = 0;   //起始值
    this.EndValue = 100;   //结束值
    this.TotalMSec = 1000; //计时总长度，单位毫秒
    //private
    this.StartTime = new Date();
    this.Start = function() {
        this.StartTime = new Date();
    }
    this.Value1 = function() { //匀速运动
        var Temp = (new Date()) - this.StartTime;
        if (Temp>=this.TotalMSec) return this.EndValue;
        return (Temp/this.TotalMSec*(this.EndValue-this.StartValue)+this.StartValue);
    }
    this.Value2 = function() { //刚开始慢，然后慢慢加速，越来越快
        var Temp = (new Date()) - this.StartTime;
        if (Temp>=this.TotalMSec) return this.EndValue;
        Temp = Temp/this.TotalMSec;
        return (Temp*Temp*(this.EndValue-this.StartValue)+this.StartValue);
    }
    this.Value3 = function() { //刚开始快，然后慢慢减速
        var Temp = (new Date()) - this.StartTime;
        if (Temp>=this.TotalMSec) return this.EndValue;
        Temp = Temp/this.TotalMSec;
        return (Math.sqrt(Temp)*(this.EndValue-this.StartValue)+this.StartValue);
    }
    this.Value4 = function() { //开始和结束慢，中间快
        var Temp = (new Date()) - this.StartTime;
        if (Temp>=this.TotalMSec) return this.EndValue;
        Temp = Temp/this.TotalMSec*Math.PI;
        Temp = (Math.sin(Temp-Math.PI/2)+1)/2;
        return (Temp*(this.EndValue-this.StartValue)+this.StartValue);
    }
}
 
//窗口界面类
function TDivWinA() {
    //public
    this.MainDiv = null;  //用户区域Div
    this.Visible = false; //是否显示(只读)
    this.BorderSize = 40; //边界尺寸(只读)
    this.Left = 0;
    this.Top = 0;
    this.Width = 300;
    this.Height = 200;
    this.SkinIndex = 2;           //皮肤序号(只读) 通过SetSkinIndex设置
    this.SkinCount = 14;           //皮肤数量(只读)
    this.ModalColor = "#000000";//"#2040A0";  //独占窗口背景颜色
    this.ModalTrans = 30;         //独占窗口背景透明度
    this.ShowStyle = -1;          //-1:随机,-2:无动画, 0,1,2...各种窗口弹出效果样式
    this.HideStyle = -1;          //-1:随机,-2:无动画, 0,1,2...各种窗口关闭效果样式
    this.BmpName = "";            //窗口样式图片名,全路径及文件名前缀
    this.MoveLimit = true;        //是否有移动基于父窗口的移动限制
    this.CELeft   = 0;            //ClientExpandLeft, 主显示区域左边界扩大点数
    this.CETop    = 0;            //ClientExpandTop, 主显示区域上边界扩大点数
    this.CERight  = 0;            //ClientExpandRight, 主显示区域右边界扩大点数
    this.CEBottom = 0;            //ClientExpandBottom, 主显示区域底边界扩大点数
    this.Movable = true;          //只读,窗体是否可通过鼠标移动
    this.Caption = "";            //只读,窗体的题头文字
    this.CaptionDY = 0;           //题头Y偏移量
    /*public function
    void Init();                  //初始化，可重复调用不会出错
    void Resize(Width,Height);    //重新设置窗口大小
    void SetPos(Left,Top,Width,Height); //设置窗口位置和大小，参数不必全部填写
    void SetBmpName(BmpName);     //设置皮肤图片，一般不推荐使用
    void SetZIndex(ZIndex);       //设置本窗口的zIndex
    void SetSkinIndex(SkinIndex); //设置皮肤序号
    void SetMovable(Movable);     //设置窗体是否可通过鼠标移动
    void SetCaption(Caption);     //设置窗体题头文字
    void Show();                  //显示窗口
    void ShowModal();             //独占显示窗口
    void Hide();                  //隐藏窗口 */
    //private
    this.DivBg = null;    //背景总Div //Bg: BackGround
    this.DivModal = null; //独占窗口背景
    this.DivB1 = null;    //上边Div  //B: Border
    this.DivB2 = null;    //左边Div
    this.DivB3 = null;    //右边Div
    this.DivB4 = null;    //下边Div
    this.DivC  = null;    //中间用户区Div
    this.DivC1 = null;    //左上角Div //C: Corner
    this.DivC2 = null;    //右上角Div
    this.DivC3 = null;    //左下角Div
    this.DivC4 = null;    //右下角Div

    this.TWidth = -1;
    this.THeight = -1;
    this.BHeight = -1;
    this.TitleHeight = -1;
    
    this.DivTitle = null; //题头文字
    this.Timer = -1;
    this.AniStartTime = new Date();
    this.ObjID = 0; //TAM_ObjectID中标识自身类的唯一ID
    this.CurrentShowStyle=0;
    this.CurrentHideStyle=0;
    this.IsModal=false;
    this.Init = function() {
        if (this.MainDiv == null) return false;
        if (this.DivBg != null) return true;
        this.DivModal = TDIV_C(this.MainDiv.parentNode);
        this.DivModal.oncontextmenu = function() { event.returnValue = false };
        this.DivBg = TDIV_C(this.MainDiv.parentNode);
        this.DivBg.oncontextmenu = function() { event.returnValue = false };
        this.DivB1 = TDIV_C(this.DivBg);
        this.DivTitle = TDIV_C(this.DivB1);
        this.DivB2 = TDIV_C(this.DivBg);
        this.DivB3 = TDIV_C(this.DivBg);
        this.DivB4 = TDIV_C(this.DivBg);
        this.DivC = TDIV_C(this.DivBg);
        this.DivC1 = TDIV_C(this.DivBg);
        this.DivC2 = TDIV_C(this.DivBg);
        this.DivC3 = TDIV_C(this.DivBg);
        this.DivC4 = TDIV_C(this.DivBg);
        this.DivBg.appendChild(this.MainDiv);
        this.Resize();
        this.DivB1.onmousedown = function() { TDivWinA_MouseDown(this) };
        this.DivB1.onmouseup = function() { TDivWinA_MouseUp(this) };
        this.DivB1.onmousemove = function() { TDivWinA_MouseMove(this) };
        this.DivB1.TWin = this;
        this.DivB1.CanMove = false;
        this.DivB1.LastX = 0;
        this.DivB1.LastY = 0;
        this.DivB1.style.cursor = "move";
        this.SetTempPos(0, 0, 0, 0);
        this.SetSkinIndex(2);        
        return true;
    }
    this.Resize = function(Width, Height) {
        if (!isNaN(Width)) this.Width = Width;
        if (!isNaN(Height)) this.Height = Height;
        TDIV_Current = this.DivBg; TDIV_P(this.Left, this.Top, this.Width, this.Height);
        if (this.TWidth > 0) {
            TDIV_Current = this.DivC; TDIV_P(this.TWidth, this.THeight, this.Width - this.TWidth * 2, this.Height - this.THeight -this.BHeight);
            TDIV_Current = this.DivB1; TDIV_P(this.TWidth, 0, this.Width - this.TWidth * 2, this.THeight);
            TDIV_Current = this.DivTitle; TDIV_P(0, this.CaptionDY, this.Width - this.TWidth * 2, this.TitleHeight);
            TDIV_Current = this.DivB2; TDIV_P(0, this.THeight, this.TWidth, this.Height - this.THeight - this.BHeight);
            TDIV_Current = this.DivB3; TDIV_P(this.Width - this.TWidth, this.THeight, this.TWidth, this.Height - this.THeight - this.BHeight);
            TDIV_Current = this.DivB4; TDIV_P(this.TWidth, this.Height - this.BHeight, this.Width - this.TWidth * 2, this.BHeight);
            TDIV_Current = this.DivC1; TDIV_P(0, 0, this.TWidth, this.THeight);
            TDIV_Current = this.DivC2; TDIV_P(this.Width - this.TWidth, 0, this.TWidth, this.THeight);
            TDIV_Current = this.DivC3; TDIV_P(0, this.Height - this.BHeight, this.TWidth, this.BHeight);
            TDIV_Current = this.DivC4; TDIV_P(this.Width - this.TWidth, this.Height - this.BHeight, this.TWidth, this.BHeight);
            TDIV_Current = this.MainDiv; TDIV_P(this.TWidth - this.CELeft, this.THeight - this.CETop, this.Width - this.TWidth * 2 + this.CELeft + this.CERight, this.Height - this.THeight - this.BHeight + this.CETop + this.CEBottom);
        }
        else {
            TDIV_Current=this.DivC;    TDIV_P(this.BorderSize,this.BorderSize,this.Width-this.BorderSize*2,this.Height-this.BorderSize*2);
            TDIV_Current=this.DivB1;   TDIV_P(this.BorderSize,0,this.Width-this.BorderSize*2,this.BorderSize);
            TDIV_Current=this.DivTitle;TDIV_P(0,this.CaptionDY,this.Width-this.BorderSize*2,this.BorderSize);
            TDIV_Current=this.DivB2;   TDIV_P(0,this.BorderSize,this.BorderSize,this.Height-this.BorderSize*2);
            TDIV_Current=this.DivB3;   TDIV_P(this.Width-this.BorderSize,this.BorderSize,this.BorderSize,this.Height-this.BorderSize*2);
            TDIV_Current=this.DivB4;   TDIV_P(this.BorderSize,this.Height-this.BorderSize,this.Width-this.BorderSize*2,this.BorderSize);
            TDIV_Current=this.DivC1;   TDIV_P(0,0,this.BorderSize,this.BorderSize);
            TDIV_Current=this.DivC2;   TDIV_P(this.Width-this.BorderSize,0,this.BorderSize,this.BorderSize);
            TDIV_Current=this.DivC3;   TDIV_P(0,this.Height-this.BorderSize,this.BorderSize,this.BorderSize);
            TDIV_Current=this.DivC4;   TDIV_P(this.Width-this.BorderSize,this.Height-this.BorderSize,this.BorderSize,this.BorderSize);
            TDIV_Current=this.MainDiv; TDIV_P(this.BorderSize-this.CELeft,this.BorderSize-this.CETop,this.Width-this.BorderSize*2+this.CELeft+this.CERight,this.Height-this.BorderSize*2+this.CETop+this.CEBottom);
        }
        this.DivTitle.style.lineHeight = this.DivTitle.clientHeight + "px";
    }
    this.SetPos = function(Left,Top,Width,Height) {
        if (!isNaN(Left)) this.Left=Left;
        if (!isNaN(Top)) this.Top=Top;
        if (!isNaN(Width)) this.Width=Width;
        if (!isNaN(Height)) this.Height=Height;
        if (this.Visible) this.Resize();
    }
    this.SetTempPos = function(Left,Top,Width,Height) {
        var A1=this.Left,A2=this.Top,A3=this.Width,A4=this.Height;
        this.Left=Left; this.Top=Top;
        this.Resize(Width,Height);
        this.Left=A1; this.Top=A2;
        this.Width=A3; this.Height=A4;
    }
    this.SetBmpName = function(BmpName) {
        if (!IsEmpty(BmpName)) this.BmpName = BmpName;

        var PName1 = "url('" + this.BmpName + "1." + AutoImgCh() + "') no-repeat ";
        var PName2 = "url('" + this.BmpName + "2." + AutoImgCh() + "') ";
        var PName3 = "url('" + this.BmpName + "3." + AutoImgCh() + "') ";
        this.DivC1.style.background = PName1 + "0px 0px";
        this.DivB1.style.background = PName2 + "0px 0px";
        this.DivB2.style.background = PName3 + "0px 0px";
        this.DivC.style.background = "url('" + this.BmpName + "4." + AutoImgCh() + "')";
        if (this.TWidth > 0) {  /// 20100119 Zhou change 
            this.DivC2.style.background = PName1 + (-this.TWidth) + "px 0px";
            this.DivC3.style.background = PName1 + "0px " + (-this.THeight) + "px";
            this.DivC4.style.background = PName1 + (-this.TWidth) + "px " + (-this.THeight) + "px";
            this.DivB3.style.background = PName3 + (-this.TWidth) + "px 0px";
            this.DivB4.style.background = PName2 + "0px " + (-this.THeight) + "px";
            this.DivTitle.style.background = "url('" + this.BmpName + "5." + AutoImgCh() + "') no-repeat center";
        } else {
            this.DivC2.style.background = PName1 + (-this.BorderSize) + "px 0px";
            this.DivC3.style.background = PName1 + "0px " + (-this.BorderSize) + "px";
            this.DivC4.style.background = PName1 + (-this.BorderSize) + "px " + (-this.BorderSize) + "px";
            this.DivB3.style.background = PName3 + (-this.BorderSize) + "px 0px";
            this.DivB4.style.background = PName2 + "0px " + (-this.BorderSize) + "px";
        }
    }
    this.FShow = function () {
        if (this.DivBg==null) return;
        if (this.IsModal) {
            this.DivModal.style.backgroundColor=this.ModalColor;
            this.DivModal.style.filter="alpha(opacity="+this.ModalTrans+")";
            this.DivModal.style.left=0;
            this.DivModal.style.top=0;
            this.DivModal.style.width=document.body.clientWidth;
            this.DivModal.style.height=document.body.clientHeight;
        } else {
            this.DivModal.style.backgroundColor="";
            this.DivModal.style.filter="";
        }
        this.Visible=true;
        this.InitStyle();
        if (this.Timer>=0) {
            clearInterval(this.Timer);
            TAM_ObjectID.Remove(this.ObjID);
            this.Timer=-1;
        }
        if (this.CurrentShowStyle==-2) {
            this.Resize();
            return;        
        }
        this.ObjID=TAM_ObjectID.Append(this);
        this.Timer=setInterval("TDivWinA_OnTimer("+this.ObjID+")",20);
        this.AniStartTime=new Date();
    }
    this.Show = function() {
        if (this.Visible) return;
        this.IsModal=false;
        this.FShow();
    }
    this.ShowModal = function() {
        if (this.Visible) return;
        this.IsModal=true;
        this.FShow();
    }
    this.Hide = function() {
        if (!this.Visible) return;
        if (this.DivBg==null) return;
        this.Visible=false;
        this.InitStyle();
        if (this.Timer>=0) {
            clearInterval(this.Timer);
            TAM_ObjectID.Remove(this.ObjID);
            this.Timer=-1;
        }            
        if (this.CurrentHideStyle==-2) {
            TDIV_Current=this.DivBg;
            TDIV_P(0,0,0,0);
            TDIV_Current=this.DivModal;
            TDIV_P(0,0,0,0);
            return;
        }
        this.ObjID=TAM_ObjectID.Append(this);
        this.Timer=setInterval("TDivWinA_OnTimer("+this.ObjID+")",20);
        this.AniStartTime=new Date();
    }
    this.InitStyle = function() {
        this.CurrentShowStyle=this.ShowStyle;
        this.CurrentHideStyle=this.HideStyle;
        if (this.CurrentShowStyle==-1) this.CurrentShowStyle=parseInt(Math.random()*1000);
        if (this.CurrentHideStyle==-1) this.CurrentHideStyle=parseInt(Math.random()*1000);
        if (this.CurrentShowStyle>=0) this.CurrentShowStyle=this.CurrentShowStyle%4;
        if (this.CurrentHideStyle>=0) this.CurrentHideStyle=this.CurrentHideStyle%3;
    }
    this.SetZIndex = function(ZIndex) {
        this.DivBg.style.zIndex=ZIndex+1;
        this.DivModal.style.zIndex=ZIndex;
    }
    this.SetMovable = function(Movable) {
        this.Movable=Movable;
        if (Movable) {
            this.DivB1.style.cursor="move";
        } else {
            this.DivB1.style.cursor="";
        }
    }
    this.SetCaption = function(Caption) {
        this.Caption=Caption;
        this.DivTitle.innerHTML=Caption;
    }
    this.SetSkinIndex = function(SkinIndex) {
        this.SkinIndex = SkinIndex % this.SkinCount;             ///20090605 ZhouNanqi SkinIndex%2;->SkinIndex%3;  ->SkinIndex%4; ->SkinIndex%5; 
        this.BmpName = TAM_GetPath($("TamPub1").src) + "../Img/Win/";
        this.CELeft = 0;
        this.CERight = 0;
        this.CETop = 0;
        this.CEBottom = 0;
        this.SetMovable(true);
        //题头文字缺省样式
        this.DivTitle.style.textAlign = "center";
        this.DivTitle.style.color = "#FCAD9A";
        this.DivTitle.style.fontWeight = "";
        this.DivTitle.style.fontSize = "9pt";
        this.DivTitle.style.filter = "glow(color=#000000,strength=3)";
        this.CaptionDY = 0;
        if (this.SkinIndex == 0) {
            this.BmpName += "StyleTest";
            this.BorderSize = 20;
        } else if (this.SkinIndex == 1) {
            this.BmpName += "WinA";
            this.BorderSize = 40;
        } else if (this.SkinIndex == 2) {                   ///20090605 ZhouNanqi 添加窗体样式
            this.BmpName += "WinB";
            this.BorderSize = 50;
            this.CaptionDY = -2;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.filter = "glow(color=#000000,strength=5)";
        } else if (this.SkinIndex == 3) {                   ///20090605 ZhouNanqi 添加窗体样式
            this.BmpName += "WinC";
            this.BorderSize = 50;
        } else if (this.SkinIndex == 4) {                   //// 20090609 Zhou 添加样式 弹出窗体，能移动
            this.BmpName += "WinD";
            this.BorderSize = 23;
            this.CELeft = 15;
            this.CERight = 15;
            this.CEBottom = 10;
            this.CaptionDY = -1;
            this.DivTitle.style.fontWeight = "bold";
            this.MainDiv.style.color = "#102000";
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 5) {                   /// 20090609 Zhou 添加样式 内窗体
            this.BmpName += "WinE";
            this.BorderSize = 22;
            this.CELeft = 10;
            this.CERight = 10;
            this.CETop = 15;
            this.CEBottom = 15;
            this.SetMovable(false);
            this.CaptionDY = 2;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.filter = "glow(color=#000000,strength=5)";
            this.MainDiv.style.color = "#102000";         ///添加字的颜色及样式
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 6) {
            this.BmpName += "WinF";
            this.BorderSize = 22;
            this.CELeft = 14;
            this.CERight = 14;
            this.CETop = 19;
            this.CEBottom = 19;
            this.SetMovable(false);
            this.CaptionDY = 2;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.filter = "glow(color=#000000,strength=5)";
            this.MainDiv.style.color = "#102000";         ///添加字的颜色及样式
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 7) {
            this.BmpName += "WinG";
            this.BorderSize = 6;
            this.CELeft = 3;
            this.CERight = 3;
            this.CETop = 3;
            this.CEBottom = 3;
            this.SetMovable(false);
            this.CaptionDY = 2;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.filter = "glow(color=#000000,strength=5)";
            this.MainDiv.style.color = "#102000";         ///添加字的颜色及样式
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 8) {
            this.BmpName += "WinH";
            this.BorderSize = 6;
            this.CELeft = 3;
            this.CERight = 3;
            this.CETop = 3;
            this.CEBottom = 3;
            this.SetMovable(false);
            this.CaptionDY = 2;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.filter = "glow(color=#000000,strength=5)";
            this.MainDiv.style.color = "#102000";         ///添加字的颜色及样式
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 9) {
            this.BmpName += "WinI";
            this.CaptionDY = 20;
            this.TitleHeight = 25;
            this.TWidth = 145;
            this.THeight = 105;
            this.BHeight = 105;
            this.CELeft = 95;
            this.CERight = 95;
            this.CEBottom = 55;
            this.CETop = 45;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.lineHeight = "23px";
            this.DivTitle.style.color = "#f0d448";
            this.DivTitle.style.filter = "";
            this.MainDiv.style.color = "#102000";         ///添加字的颜色及样式
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 10) {/// 20100119 Zhou add 
            this.BmpName += "WinJ";
            //this.CaptionDY = 8;
            this.TitleHeight = 25;
            this.TWidth = 12;
            this.THeight = 12;
            this.BHeight = 12;
            this.CELeft = 22;
            this.CERight = 22;
            this.CETop = 30;
            this.CEBottom = 20;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.fontSize = "12pt";
            this.DivTitle.style.textAlign = "center";
            this.DivTitle.style.lineHeight = "23px";
            this.DivTitle.style.color = "#f0d448";
            this.DivTitle.style.filter = "glow(color=#000000,strength=5)";
            this.MainDiv.style.color = "#102000";         ///添加字的颜色及样式
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 11) {
            this.BmpName += "WinK";
            this.CaptionDY = 8;
            this.TitleHeight = 25;
            this.TWidth = 69;
            this.THeight = 145;
            this.BHeight = 37;
            this.CELeft = 24;
            this.CERight = 24;
            this.CEBottom = 15;
            this.CETop = 105;
            this.DivTitle.style.fontWeight = "bold";
            this.DivTitle.style.lineHeight = "30px";
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 12) {
            this.BmpName += "WinL";
            this.CaptionDY = 8;
            this.TWidth = 17;
            this.THeight = 17;
            this.BHeight = 17;
            this.CELeft = 5;
            this.CERight = 5;
            this.CEBottom = 0;
            this.CETop = 0;
            this.SetMovable(false);
            this.MainDiv.style.fontWeight = "bold";
        } else if (this.SkinIndex == 13) {
            this.BmpName += "WinM";
            this.CaptionDY = 8;
            this.TWidth = 41;
            this.THeight = 16;
            this.BHeight = 16;
            this.CELeft = 36;
            this.CERight = 36;
            this.CEBottom = -1;
            this.CETop = -1;
            this.MainDiv.style.fontWeight = "bold";
        }
        this.SetBmpName();
        if (this.Visible) this.Resize();
    }
}
function TDivWinA_OnTimer(ObjID) {
    if (!TAM_ObjectID.GetByID(ObjID)) return;
    var TWin=TAM_ObjectID.Current.ObjHandle;
    var AniPercent=(new Date()-TWin.AniStartTime);
    if (TWin.Visible) {
        //TWin.CurrentShowStyle=3;
        if (TWin.CurrentShowStyle==0) { //中心展开
            AniPercent=AniPercent/200;
            TWin.SetTempPos(
                TWin.Left+TWin.Width/2*(1-AniPercent),
                TWin.Top+TWin.Height/2*(1-AniPercent),
                TWin.Width*AniPercent,
                TWin.Height*AniPercent
            )
        } else if (TWin.CurrentShowStyle==1) { //左上展出水平横扛，然后由横扛展出窗口
            AniPercent=AniPercent/400;
            if (AniPercent<=0.4) {
                AniPercent/=0.4;
                TWin.SetTempPos(TWin.Left,TWin.Top,TWin.Width*AniPercent,TWin.BorderSize*2);
                AniPercent=0;
            } else if (AniPercent<=0.6) {
            } else {
                AniPercent=(AniPercent-0.6)/0.4;
                TWin.SetTempPos(TWin.Left,TWin.Top,TWin.Width,TWin.Height*AniPercent+TWin.BorderSize*2*(1-AniPercent));
            }
        } else if (TWin.CurrentShowStyle==2) { //中心点展出水平横扛,然后由横扛展出窗口
            AniPercent=AniPercent/400;
            if (AniPercent<=0.4) {
                AniPercent/=0.4;
                TWin.SetTempPos(TWin.Left+TWin.Width*(1-AniPercent)/2,TWin.Top+TWin.Height/2-TWin.BorderSize,TWin.Width*AniPercent,TWin.BorderSize*2);
                AniPercent=0;
            } else if (AniPercent<=0.6) {
            } else {
                AniPercent=(AniPercent-0.6)/0.4;
                TWin.SetTempPos(TWin.Left,TWin.Top+(TWin.Height/2-TWin.BorderSize)*(1-AniPercent),TWin.Width,TWin.Height*AniPercent+TWin.BorderSize*2*(1-AniPercent));
            }
        } else if (TWin.CurrentShowStyle==3) { //由左上点展出窗口
            AniPercent=AniPercent/200;
            TWin.SetTempPos(TWin.Left,TWin.Top,TWin.Width*AniPercent,TWin.Height*AniPercent);
        }
        if (AniPercent>=1) {
            TWin.Resize();
            clearInterval(TWin.Timer);
            TWin.Timer=-1;
            TAM_ObjectID.Remove(ObjID);
            return;
        }
    } else {
        //TWin.CurrentHideStyle=2;
        if (TWin.CurrentHideStyle==0) { //缩小到中心点
            AniPercent=AniPercent/200;
            TWin.SetTempPos(
                TWin.Left+TWin.Width/2*AniPercent,
                TWin.Top+TWin.Height/2*AniPercent,
                TWin.Width*(1-AniPercent),
                TWin.Height*(1-AniPercent)
            )
        } else if (TWin.CurrentHideStyle==1) { //缩小到中心水平横扛，然后水平横扛缩小为中心点
            AniPercent=AniPercent/400;
            if (AniPercent<=0.4) {
                AniPercent=AniPercent/0.4;
                TWin.SetTempPos(TWin.Left,TWin.Top+AniPercent*(TWin.Height/2-TWin.BorderSize),TWin.Width,TWin.Height*(1-AniPercent)+TWin.BorderSize*2*AniPercent);
                AniPercent=0;
            } else if (AniPercent<=0.6) {
            } else {
                AniPercent=(AniPercent-0.6)/0.4;
                TWin.SetTempPos(TWin.Left+TWin.Width*AniPercent/2,TWin.Top+TWin.Height/2-TWin.BorderSize,TWin.Width*(1-AniPercent),TWin.BorderSize*2);
            }
        } else if (TWin.CurrentHideStyle==2) {  //缩小到左上点
            AniPercent=AniPercent/200;
            TWin.SetTempPos(TWin.Left,TWin.Top,TWin.Width*(1-AniPercent),TWin.Height*(1-AniPercent));
        }
        if (AniPercent>=1) {
            TDIV_Current=TWin.DivBg;
            TDIV_P(0,0,0,0);
            TDIV_Current=TWin.DivModal;
            TDIV_P(0,0,0,0);
            clearInterval(TWin.Timer);
            TWin.Timer=-1;
            TAM_ObjectID.Remove(ObjID);
            return;
        }
    }
}
function TDivWinA_MouseDown(Sender) {
    if ((event.button==1)&&(Sender.TWin.Movable)) {
        Sender.CanMove=true;
        Sender.LastX=event.clientX;
        Sender.LastY=event.clientY;
        Sender.setCapture();
        Sender.LastMoveTime=new Date();
    }
}
function TDivWinA_MouseUp(Sender) {
    if (event.button==1) {
        Sender.CanMove=false;
        Sender.releaseCapture();
    }        
}
function TDivWinA_MouseMove(Sender) {
    if ((new Date())-Sender.LastMoveTime<50) return;
    if (Sender.CanMove) { 
        var TempX=Sender.TWin.Left+(event.clientX-Sender.LastX);
        var TempY=Sender.TWin.Top+(event.clientY-Sender.LastY);
        if (Sender.TWin.MoveLimit) {
            var SWidth,SHeight;
            if (Sender.TWin.DivBg.parentNode==document.body) {
                SWidth=document.documentElement.clientWidth;
                SHeight=document.documentElement.clientHeight;
            } else {
                SWidth=Sender.TWin.DivBg.parentNode.clientWidth;
                SHeight=Sender.TWin.DivBg.parentNode.clientHeight;
            }
            if (TempX+Sender.TWin.Width<=Sender.TWin.BorderSize+10) TempX=Sender.TWin.BorderSize+10-Sender.TWin.Width;
            if (SWidth-TempX<Sender.TWin.BorderSize+10) TempX=SWidth-Sender.TWin.BorderSize-10;
            if (TempY+Sender.TWin.BorderSize-10<0) TempY=10-Sender.TWin.BorderSize;
            if (SHeight-TempY<Sender.TWin.BorderSize-10) TempY=SHeight-Sender.TWin.BorderSize+10;
        }
        Sender.LastX+=TempX-Sender.TWin.Left;
        Sender.LastY+=TempY-Sender.TWin.Top;
        Sender.TWin.Left=TempX;
        Sender.TWin.Top=TempY;
        Sender.TWin.DivBg.style.left=TempX;
        Sender.TWin.DivBg.style.top=TempY;
    }
}

//按钮控件类
function TTAM_ButtonA() {
    //public
    this.Left = 0;  //只读
    this.Top = 0 ;
    this.Width = 100;
    this.Height = 32;
    this.StyleIndex = 0; //只读,风格类型序号,
    this.Caption = "";   //只读,按钮上的文字
    this.OnClick = null; //回调事件
    this.LabelDX = 0;    //按钮文字偏移量x
    this.LabelDY = 0;    //按钮文字偏移量y
    this.HotDelay = 300; //鼠标离开按钮时的热点消失延迟
    this.Flash = false;  //只读,是否闪烁
    this.FlashRate = 300; //1/2闪烁周期，单位毫秒
    /*public function
    void Init(Parent);                  //初始化按钮
    void SetStyleIndex(StyleIndex);     //设置按钮样式
    void SetPos(Left,Top,Width,Height); //设置按钮位置
    void SetCPos(CenterX,CenterY);      //设置按钮中心点位置
    void SetCaption(Caption);           //设置按钮文字内容
    void SetZIndex(ZIndex);             //设置ZIndex
    */
    //private
    this.DivBg = null;     //底
    this.Bmp = null;       //图片
    this.DivLabel = null;  //文字
    this.BmpName="";       //皮肤图片名
    this.ClickX=2;
    this.ClickY=2;
    this.MouseOutTimer = -1;
    this.ObjID=-1;
    this.FlashID=-1;
    this.FlashOn=false;
    this.FlashTimer=-1;
    this.EnterDelay = false;
    this.Down=false;
    this.StyleCount=10; 
    this.Init = function(Parent) {
        if (this.DivBg!=null) return;
        if (IsEmpty(Parent)) Parent=null;
        this.DivBg=TDIV_C(Parent);
        this.Bmp=TIMG_C(this.DivBg,"");
        this.DivLabel=TDIV_C(this.DivBg);
        this.DivBg.TamBtn=this;
        this.DivLabel.style.textAlign="center";
        this.DivBg.onclick    =function() { TTAMBtnA_MouseClick(this) };
        this.DivBg.onmousedown=function() { TTAMBtnA_MouseDown (this) };
        this.DivBg.onmouseup  =function() { TTAMBtnA_MouseUp   (this) };
        this.DivBg.onmousemove=function() { TTAMBtnA_MouseMove (this) };
        this.DivBg.onmouseout =function() { TTAMBtnA_MouseOut  (this) };
        this.SetStyleIndex(2);/// SetStyleIndex(0);-->SetStyleIndex(2);20090608 Zhou Change
        this.SetPos();
        
    }
    this.SetPos = function(Left,Top,Width,Height) {
        if (isNaN(Left))   Left  =this.Left;
        if (isNaN(Top))    Top   =this.Top;
        if (isNaN(Width))  Width =this.Width;
        if (isNaN(Height)) Height=this.Height;
        this.Left=Left; this.Top=Top;
        this.Width=Width; this.Height=Height;
        TDIV_Current=this.DivBg;
        TDIV_P(Left,Top,Width,Height);
        TIMG_Current=this.Bmp;
        TIMG_P(0,0,Width,Height);
        TDIV_Current=this.DivLabel;
        TDIV_P(this.LabelDX,this.LabelDY,Width,Height);
        this.DivLabel.style.lineHeight=Height+"px";
        this.DivBg.style.cursor="hand"; 
    } 
    this.SetCPos = function(CenterX,CenterY) {
        var Left=parseInt(CenterX-this.Width/2);
        var Top=parseInt(CenterY-this.Height/2);
        this.SetPos(Left,Top,this.Width,this.Height);
    }
    this.SetCaption = function(Caption) {
        this.Caption=Caption;
        this.DivLabel.innerHTML=Caption;
    }
    this.SetStyleIndex = function(StyleIndex) {
        StyleIndex=StyleIndex%this.StyleCount;// 20090603 ZhouNanqi 修改StyleIndex=StyleIndex%1->StyleIndex%2;->StyleIndex%3;-->StyleIndex%13;
        this.StyleIndex=StyleIndex;
        this.BmpName=TAM_GetPath($("TamPub1").src)+"../Img/Win/";
        this.DivLabel.style.fontWeight="normal";
        if (this.StyleIndex==0) {
            this.BmpName+="BtnA";
            this.DivLabel.style.fontWeight="bold";
            this.DivLabel.style.color="#D04020";
            this.DivLabel.style.filter="glow(color=#FFFF90,strength=4)";
            this.ClickX=2;
            this.ClickY=2;
        }else if(this.StyleIndex==1){           ///20090603 ZhouNanqi 添加按钮样式2
            this.BmpName+="BtnB";
            this.DivLabel.style.fontWeight="bold";
            this.DivLabel.style.color="#D04020";
            this.DivLabel.style.filter="glow(color=#FFFF90,strength=2)";
            this.ClickX=2;
            this.ClickY=2;
        }else if(this.StyleIndex==2){           ///20090603 ZhouNanqi 添加按钮样式3 20090608 Zhou Change
            this.BmpName+="BtnC";
            this.DivLabel.style.color="#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=3)";
            this.DivLabel.style.fontWeight="bold";
            this.DivLabel.style.fontFamily="宋体";
            this.ClickX=2;
            this.ClickY=2;
            this.Width=66;
            this.Height=34;
            this.LabelDY=2;
            this.HotDelay=300;
        }else if(this.StyleIndex==3){          /// 20090608 Zhou Add  上一页的按钮"<"
            //this.BmpName+="BtnC";
            this.BmpName += "BtnE";
            this.DivLabel.style.color = "#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=1)";
            this.DivLabel.style.fontFamily="宋体";
            //this.DivLabel.style.fontWeight="bold";
            this.ClickX=1;
            this.ClickY=1;
            this.Width=25;
            this.Height=34;
            this.LabelDY=-1;
            this.Caption=String.fromCharCode(9668); //"◄" 由于该字符只有UTF8码，代码翻译会出问题
            this.DivLabel.innerHTML=this.Caption;
        }else if(this.StyleIndex==4){          /// 20090608 Zhou Add 下一页按钮 ">"
            //this.BmpName+="BtnC";
            this.BmpName += "BtnE";
            this.DivLabel.style.color = "#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=1)";
            this.DivLabel.style.fontFamily="宋体";
            //this.DivLabel.style.fontWeight="bold";
            this.ClickX=1;
            this.ClickY=1;
            this.Width=25;
            this.Height=34;
            this.LabelDY=-1;
            this.Caption=String.fromCharCode(9658); //"►" 由于该字符只有UTF8码，代码翻译会出问题
            this.LabelDX=2;
            this.DivLabel.innerHTML=this.Caption;
        }else if(this.StyleIndex==5){         /// 20090608 Zhou Add 关闭按钮 "X"
            //this.BmpName+="BtnC";
            this.BmpName += "BtnE";
            this.DivLabel.style.color = "#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=1)";
            this.DivLabel.style.fontFamily="宋体";
            //this.DivLabel.style.fontWeight="bold";
            this.ClickX=1;
            this.ClickY=1;
            this.Width=20;
            this.Height=16;
            this.LabelDX=1;
            this.Caption="×";
            this.DivLabel.innerHTML=this.Caption;
        }else if(this.StyleIndex==6){          /// 20090610 Sun Add 倒三角按钮 "▼"
            //this.BmpName+="BtnC";
            this.BmpName += "BtnE";
            this.DivLabel.style.color = "#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=1)";
            //this.DivLabel.style.fontWeight="bold";
            this.DivLabel.style.fontFamily="宋体";
            this.ClickX=1;
            this.ClickY=1;
            this.Caption="▼";
            this.LabelDY=3;
            this.LabelDX=2;
            this.DivLabel.innerHTML=this.Caption;
        }else if(this.StyleIndex==7){         ///20090603 ZhouNanqi 添加按钮样式4
            this.BmpName+="BtnD";
            this.DivLabel.style.color="#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=1)";
            this.DivLabel.style.fontFamily="宋体";
            this.ClickX=1;
            this.ClickY=1;
            this.Width=66;
            this.Height=34;
            this.LabelDY=1;
            this.HotDelay=300;
        }else if(this.StyleIndex==8){          /// 20090608 Zhou Add 下一页按钮 ">"
            //this.BmpName+="BtnC";
            this.BmpName += "BtnE";
            this.DivLabel.style.color = "#F5DC45";
            this.DivLabel.style.filter="glow(color=#000000,strength=3)";
            this.DivLabel.style.fontFamily="宋体";
            this.DivLabel.style.fontWeight="bold";
            this.ClickX=1;
            this.ClickY=1;
            this.Width=25;
            this.Height=34;
            this.LabelDY=2;
            this.Caption="+";
            this.DivLabel.innerHTML=this.Caption;
        } else if (this.StyleIndex == 9) {      /// 20100119 Zhou add 
            this.BmpName += "BtnE";
            this.DivLabel.style.color = "#F5DC45";
            this.DivLabel.style.filter = "glow(color=#000000,strength=1)";
            this.DivLabel.style.fontFamily = "宋体";
            //this.DivLabel.style.fontWeight = "bold";
            this.ClickX = 1;
            this.ClickY = 1;
            this.Width = 66;
            this.Height = 34;
            this.LabelDY = 2;
            this.Caption = "+";
            this.DivLabel.innerHTML = this.Caption;
        }
        
//        this.Bmp.src=this.BmpName+"1.png";
        this.Bmp.src=this.BmpName+"1."+AutoImgCh();
        //this.Bmp.style.border="solid 1px red";
        this.MoveLabel(false);
    }
    this.SetZIndex = function(ZIndex) {
        this.DivBg.style.zIndex=ZIndex;
    }
    this.MoveLabel = function(Down) {
        if (Down) {
            this.DivLabel.style.left=this.LabelDX+this.ClickX;
            this.DivLabel.style.top=this.LabelDY+this.ClickY;
        } else {
            this.DivLabel.style.left=this.LabelDX;
            this.DivLabel.style.top=this.LabelDY;
        }
    }
    this.SetFlash = function(Enabled) {
        if (this.Flash&&Enabled) return;
        if ((!this.Flash)&&(!Enabled)) return;
        this.Flash=Enabled;
        if (!Enabled) {
//            this.Bmp.src=this.BmpName+"1.png";
            this.Bmp.src=this.BmpName+"1."+AutoImgCh();
            if (this.FlashTimer>=0) {
                clearTimeout(this.FlashTimer);
                this.FlashTimer=-1;
                TAM_ObjectID.Remove(this.FlashID);
            }
            return;
        }
        this.FlashOn=true;
        // this.Bmp.src=this.BmpName+"2."+AutoImgCh()+"";
        this.Bmp.src = this.BmpName + "2." + AutoImgCh();
        this.FlashID=TAM_ObjectID.Append(this);
        this.FlashTimer=setTimeout("TTAMBtnA_Flash("+this.FlashID+")",this.FlashRate);
    }
}
function TTAMBtnA_Flash(FlashID) {
    if (!TAM_ObjectID.GetByID(FlashID)) return;
    if (!TAM_ObjectID.Current.ObjHandle.Flash) return;
    TAM_ObjectID.Current.ObjHandle.FlashOn=!TAM_ObjectID.Current.ObjHandle.FlashOn;
    if (TAM_ObjectID.Current.ObjHandle.FlashOn) {
//        TAM_ObjectID.Current.ObjHandle.Bmp.src=TAM_ObjectID.Current.ObjHandle.BmpName+"2.png";
        TAM_ObjectID.Current.ObjHandle.Bmp.src=TAM_ObjectID.Current.ObjHandle.BmpName+"2."+AutoImgCh();
    } else {
//        TAM_ObjectID.Current.ObjHandle.Bmp.src=TAM_ObjectID.Current.ObjHandle.BmpName+"1.png";
        TAM_ObjectID.Current.ObjHandle.Bmp.src=TAM_ObjectID.Current.ObjHandle.BmpName+"1."+AutoImgCh();
    }
    TAM_ObjectID.Current.ObjHandle.FlashTimer=setTimeout("TTAMBtnA_Flash("+FlashID+")",TAM_ObjectID.Current.ObjHandle.FlashRate);
}
function TTAMBtnA_MouseClick(Sender) {
    var Btn=Sender.TamBtn;
    if (Btn.OnClick==null) return;
    Btn.OnClick(Sender.TamBtn);
}
function TTAMBtnA_MouseDown(Sender) {
    Sender.setCapture();
    var Btn=Sender.TamBtn;
//    Btn.Bmp.src=Btn.BmpName+"3.png";
    Btn.Bmp.src=Btn.BmpName+"3."+AutoImgCh();
    Btn.MoveLabel(true);
    Btn.Down=true;
}
function TTAMBtnA_MouseUp(Sender) {
    var Btn=Sender.TamBtn;
    if (TDIV_InRange(Sender,event.clientX,event.clientY)) {
//        Btn.Bmp.src=Btn.BmpName+"2.png";
        Btn.Bmp.src=Btn.BmpName+"2."+AutoImgCh();
    } else{
//        Btn.Bmp.src=Btn.BmpName+"1.png";
        Btn.Bmp.src=Btn.BmpName+"1."+AutoImgCh();
    }
    Btn.MoveLabel(false);
    Btn.Down=false;
    Sender.releaseCapture();
}
function TTAMBtnA_MouseMove(Sender) {
    var Btn=Sender.TamBtn;
    Btn.EnterDelay=true;
    if (TDIV_InRange(Sender,event.clientX,event.clientY)) {
        if (Btn.Down) {
//            Btn.Bmp.src=Btn.BmpName+"3.png";
            Btn.Bmp.src=Btn.BmpName+"3."+AutoImgCh();
            Btn.MoveLabel(true);
        } else {
//            Btn.Bmp.src=Btn.BmpName+"2.png";
            Btn.Bmp.src=Btn.BmpName+"2."+AutoImgCh();
            Btn.MoveLabel(false);
        }
    } else {
//        Btn.Bmp.src=Btn.BmpName+"2.png";
        Btn.Bmp.src=Btn.BmpName+"2."+AutoImgCh();
        Btn.MoveLabel(false);
    }
}
function TTAMBtnA_MouseOut(Sender) {
    var Btn=Sender.TamBtn;
    if (Btn.MouseOutTimer>=0) {
        clearTimeout(Btn.MouseOutTimer);
        TAM_ObjectID.Remove(Btn.ObjID);
        Btn.MouseOutTimer=-1;
    }
    Btn.EnterDelay=false;
    Btn.ObjID=TAM_ObjectID.Append(Btn);
    Btn.MouseOutTimer=setTimeout("TTAMBtnA_MouseOutDelay("+Btn.ObjID+")",Btn.HotDelay);
}
function TTAMBtnA_MouseOutDelay(ObjID) {
    if (!TAM_ObjectID.GetByID(ObjID)) return;
    var Btn=TAM_ObjectID.Current.ObjHandle;
    TAM_ObjectID.Remove(ObjID);
    Btn.MouseOutTimer=-1;
    if (Btn.EnterDelay) {
        Btn.EnterDelay=false;
        return;
    }
//    Btn.Bmp.src=Btn.BmpName+"1.png";
    Btn.Bmp.src=Btn.BmpName+"1."+AutoImgCh();
    Btn.MoveLabel(false);
}

var PUB_LogCount=0;
var PUB_LogDiv = null;
var PUB_Debug = false;
function PUB_WriteLog(LogString) {
    if (PUB_Debug&&(PUB_LogDiv==null)) {
        PUB_LogDiv=TDIV_C(null);
        PUB_LogDiv.zIndex=10000;
        TDIV_P(0,0,300,700);
    }
    if (PUB_LogDiv==null) return;
    if (PUB_LogCount>=30) {
        PUB_LogDiv.innerHTML="";
        PUB_LogCount=0;
    }
    PUB_LogDiv.innerHTML+=" "+LogString+"</br>";
    PUB_LogCount++;
}

//标签文字类
function TTAMLabelA() {
    //public
    this.ParentDiv = null;
    this.Left = 0;
    this.Top = 0;
    this.Width = 40;
    this.Height = 20; 
    this.StyleCount = 5;  //样式的数量
    this.StyleIndex = 0;  //只读，样式序号
    this.Text = "";    //只读,文本内容
    this.AlignX = 2;   //只读,水平方向文字居中样式 1左 2中 3右
    this.AlignY = 2;   //只读,垂直方向文字居中样式 1顶 2中 3底
    this.PaddingX = 0; //只读，文字左右边距
    this.PaddingY = 0; //只读，文字上下边距
    this.OffsetY = 0;  //文字的纵向偏移量
    //void Init(ParentDiv);  //初始化,ParentDiv为父Div
    //void SetStyleIndex(StyleIndex);  //设置本控件整体样式
    //void SetText(Text);  //设置标签文本内容
    //void SetPos(Left,Top,Width,Height); //设置位置，参数不必全填
    //void SetCenterPos(CenterX,CenterY); //设置中心位置
    //void SetAlign(AlignX,AlignY);  //设置文本对齐方式，参数可以不必全填
    //void SetPadding(PaddingX,PaddingY)  //设置文字左右边距和上下边距，参数不必全填
    //private
    this.DivBg = null;
    this.DivLabel = null;
    this.Init = function(ParentDiv) {
        if (this.DivBg!=null) return;
        this.ParentDiv=ParentDiv;
        this.DivBg=TDIV_C(this.ParentDiv);
        this.DivLabel=TDIV_C(this.ParentDiv);
        this.DivLabel.style.paddingLeft=1;
        this.DivLabel.style.paddingRight=1;
        this.DivLabel.style.paddingTop=1;
        this.DivLabel.style.paddingBottom=1;
    }
    this.SetPos = function(Left,Top,Width,Height) {
        if (this.DivBg==null) return;
        if (!IsEmpty(Left)) this.Left=Left;
        if (!IsEmpty(Top)) this.Top=Top;
        if (!IsEmpty(Width)) this.Width=Width;
        if (!IsEmpty(Height)) this.Height=Height;
        TDIV_Current=this.DivBg;
        TDIV_P(this.Left,this.Top,this.Width,this.Height);
        TDIV_Current=this.DivLabel;
        if (this.AlignY==1) {
            TDIV_P(this.Left,this.Top+this.OffsetY,this.Width-this.PaddingX*2);
        } else if (this.AlignY==2) {
            TDIV_P(this.Left,this.Top+this.OffsetY,this.Width-this.PaddingX*2);
        } else if (this.AlignY==3) {
            TDIV_P(this.Left,this.Top+this.OffsetY+this.Height-this.DivLabel.clientHeight,this.Width-this.PaddingX*2);
        } else {
            TDIV_P(this.Left,this.OffsetY+parseInt(this.Top+(this.Height/2)-(this.DivLabel.clientHeight/2)),this.Width-this.PaddingX*2);
        }
    }
    this.SetCenterPos = function(CenterX,CenterY) {
        if (this.DivBg==null) return;
        this.Left=parseInt(CenterX-this.Width/2);
        this.Top=parseInt(CenterY-this.Height/2);
        this.SetPos();
    }
    this.SetPadding = function(PaddingX,PaddingY) {
        if (this.DivBg==null) return;
        if (isNaN(PaddingX)) PaddingX=this.PaddingX;
        if (isNaN(PaddingY)) PaddingY=this.PaddingY;
        this.PaddingX=PaddingX;
        this.PaddingY=PaddingY;
        this.DivLabel.style.paddingLeft=PaddingX;
        this.DivLabel.style.paddingRight=PaddingX;
        this.DivLabel.style.paddingTop=PaddingY;
        this.DivLabel.style.paddingBottom=PaddingY;
        this.SetPos();
    }
    this.SetStyleIndex = function(StyleIndex) {
        if (this.DivBg == null) return;
        this.OffsetY = 0;
        this.StyleIndex = StyleIndex % this.StyleCount;
        this.DivLabel.style.fontSize = "9pt";
        this.DivLabel.style.whiteSpace = "normal";
        this.SetPadding(4, 2);
        this.SetAlign(2, 2);
        if (this.StyleIndex == 0) {  //发黑背景，黑字白边，大字，用于题头
            this.DivBg.style.backgroundColor = "#000000";
            this.DivBg.style.filter = "alpha(opacity=25);";
            this.DivLabel.style.color = "#ef8a08";
            //this.DivLabel.style.color = "#302000";
            //this.DivLabel.style.fontWeight = "bold";
            this.DivLabel.style.fontSize = "11pt";
            //this.DivLabel.style.filter = "glow(color=#FFFFFF,strength=1)";
        } else if (this.StyleIndex == 1) {  //发亮背景，黑字白边，小字，用于表格内文字
            this.DivBg.style.backgroundColor = "#FFFFFF";
            this.DivBg.style.filter = "alpha(opacity=8);";
            this.DivLabel.style.color = "white";
            //this.DivLabel.style.color = "#302000";
            //this.DivLabel.style.fontWeight = "bold";
            //this.DivLabel.style.filter = "glow(color=#FFFFFF,strength=1)";
        } else if (this.StyleIndex == 2) { //发黑背景，黑字白边，小字，用于表格内文字
            this.DivBg.style.backgroundColor = "#000000";
            this.DivBg.style.filter = "alpha(opacity=8);";
            this.DivLabel.style.color = "white";
            //this.DivLabel.style.color = "#302000";
            //this.DivLabel.style.fontWeight = "bold";
            //this.DivLabel.style.filter = "glow(color=#FFFFFF,strength=1)";
        } else if (this.StyleIndex == 3) {
            this.DivBg.style.borderLeft = "#C0C030 1px solid";
            this.DivBg.style.borderTop = "#C0C030 1px solid";
            this.DivBg.style.borderBottom = "#404000 1px solid";
            this.DivBg.style.borderRight = "#404000 1px solid";
            this.DivBg.style.cursor = "hand";
            this.DivLabel.style.cursor = "hand";
            this.DivLabel.style.color = "white";
            //this.DivLabel.style.color = "#302000";
            //this.DivLabel.style.fontWeight = "bold";
            //this.DivLabel.style.filter = "glow(color=#FFFFFF,strength=1)";
        } else if (this.StyleIndex == 4) { //1PX黑框 白字 用于资源显示
            this.DivBg.style.borderLeft = "#000000 1px solid";
            this.DivBg.style.borderTop = "#000000 1px solid";
            this.DivBg.style.borderBottom = "#000000 1px solid";
            this.DivBg.style.borderRight = "#000000 1px solid";
            this.DivBg.style.backgroundColor = "#1A2E15";
            this.DivBg.style.cursor = "default";
            this.DivLabel.style.cursor = "default";
            //this.DivLabel.style.color = "#fff";
            this.DivLabel.style.color = "white";
            this.DivLabel.style.fontSzie = "9";
            //this.DivLabel.style.fontWeight = "bold";
            //this.DivLabel.style.filter = "glow(color=#1A2E15,strength=1)";
        }
        this.SetPos();
    }
    this.SetAlign = function(AlignX,AlignY) {
        if (isNaN(AlignX)) AlignX=this.AlignX;
        if (isNaN(AlignY)) AlignY=this.AlignY;
        this.AlignX=AlignX;
        this.AlignY=AlignY;
        if (AlignX==1) {
            this.DivLabel.style.textAlign="left";
        } else if (AlignX==3) {
            this.DivLabel.style.textAlign="right";
        } else {
            this.DivLabel.style.textAlign="center";
        }
        if (AlignY==2) {
            this.DivLabel.style.lineHeight=this.Height+"px";
        } else this.DivLabel.style.lineHeight="9pt";
        this.SetPos();
    }
    this.SetText = function(Text) {
        Text=Text+"";
        if (this.DivBg==null) return;
        if (this.Text==Text) return;
        this.Text=Text;
        this.DivLabel.innerHTML=Text;
        this.SetAlign();
    }
}

//输入框类
function TTAMInputA() {
    //public
    this.Input = null; //只读
    this.Left=0;
    this.Top=0;
    this.Width=150;
    this.Height=32;    //只读,目前无效
    this.Style=0;      //只读
    this.StyleCount=5; //只读
    //void Init(Parent);      //初始化，Parent如果不指定则为body
    //void SetPos(Left,Top,Width,Height);  //设置位置,参数不必全部填写，目前Height无效
    //void SetStyle(StyleIndex);  //设置样式
    //private
    this.Div1 = null; //左边Div
    this.Div2 = null; //中间Div
    this.Div3 = null; //右边Div
    this.BmpName="";
    this.ClipX=20;  //图片单元宽度
    this.OffsetX=0;
    this.OffsetY=0;
    this.Init = function(Parent) {
        if (this.Input != null) return;
        this.Div1 = TDIV_C(Parent);
        this.Div2 = TDIV_C(Parent);
        this.Div3 = TDIV_C(Parent);
        this.Input = document.createElement("input");
        if ((Parent == null) || (Parent == undefined)) {
            document.body.insertBefore(this.Input, document.body.firstChild);
        } else Parent.appendChild(this.Input);
        this.Input.style.overflow = "hidden";
        this.Input.style.position = "absolute";
        this.Input.style.whiteSpace = "nowrap";
        this.Input.style.fontFamily = "宋体";
        this.Input.style.fontSize = "9pt";
        this.Input.style.textAlign = "left";
        this.Input.style.border = "";
        this.Input.style.background = "";

    }
    this.SetPos = function(Left,Top,Width,Height) {
        if (this.Input==null) return;
        if (isNaN(Left)) Left=this.Left;
        if (isNaN(Top)) Top=this.Top;
        if (isNaN(Width)) Width=this.Width;
        Height=this.Height;
        this.Left=Left; this.Top=Top; this.Height=Height;
        this.Input.style.left=Left+this.OffsetX;
        this.Input.style.top=Top+this.OffsetY;
        TDIV_Current=this.Div1;
        TDIV_P(Left,Top,this.ClipX,Height);
        TDIV_Current=this.Div2;
        TDIV_P(Left+this.ClipX,Top,Width-this.ClipX*2,Height);
        TDIV_Current=this.Div3;
        TDIV_P(Left+Width-this.ClipX,Top,this.ClipX,Height);
    }
    this.SetBmpName = function(BmpName) {
        if (!IsEmpty(BmpName)) this.BmpName=BmpName;
        var PName=TAM_GetPath($("TamPub1").src)+"../Img/Win/"+this.BmpName;
        var PName1="url('"+PName+"')";
        this.Div1.style.background=PName1+" no-repeat 0px 0px";
        this.Div3.style.background=PName1+" no-repeat "+(-this.ClipX)+"px 0px";
        this.Div2.style.background = PName1 + " 0px " + (this.Height) + "px";
    }
    this.SetStyle = function(StyleIndex) {
        if (this.Input == null) return;
        if (isNaN(StyleIndex)) StyleIndex = this.Style;
        StyleIndex = StyleIndex % this.StyleCount;
        this.Style = StyleIndex;
        if (StyleIndex == 0) {
            this.Input.style.color = "#FFFF00";
            this.OffsetX = 8;
            this.OffsetY = 7;
            this.ClipX = 20;
            this.Height = 32;
            //            this.SetBmpName("Inpt1.png");
            this.SetBmpName("Inpt1." + AutoImgCh());
        } else if (StyleIndex == 1) {
            this.Input.style.color = "#000000";
            this.OffsetX = 12;
            this.OffsetY = 8;
            this.ClipX = 15;
            this.Height = 32;
            this.Input.style.filter = "glow(color=#FFFFFF,strength=1)";
            //            this.SetBmpName("Inpt2.png");
            this.SetBmpName("Inpt2." + AutoImgCh());
        } else if (StyleIndex == 2) {
            this.Input.style.color = "#000000";
            this.OffsetX = 12;
            this.OffsetY = 7;
            this.ClipX = 15;
            this.Height = 32;
            this.Input.style.filter = "glow(color=#FFFFFF,strength=1)";
            //            this.SetBmpName("Inpt3.png");
            this.SetBmpName("Inpt3." + AutoImgCh());
        } else if (StyleIndex == 3) {        //20090710 Zhou Add
            this.Input.style.color = "yellow";
            this.OffsetX = 15;
            this.OffsetY = 9;
            this.ClipX = 15;
            this.Height = 32;
            //            this.SetBmpName("Inpt4.png");
            this.SetBmpName("Inpt4." + AutoImgCh());
        } else if (StyleIndex == 4) {
            this.Height = 22;
            this.ClipX = 9;
            this.OffsetX = 12;
            this.OffsetY = 4;
            this.Input.style.color = "white";
            this.Input.style.filter = "glow(color=#000000,strength=3)";
            this.SetBmpName("inpt5." + AutoImgCh());
        }
        this.SetPos();
    }

}

//提示信息类
function TTAM_Alert() {
    //public
    this.Width=400;
    this.Height=125;
    this.StyleIndex=0; //只读，信息窗口样式
    this.Title=""; //只读，题头信息
    this.Text="";  //只读，提示信息内容
    this.Visible=false; //只读是否处于显示状态
    //void Show(Title,Text,StyleIndex); //StyleIndex可不填，缺省为带OK按钮的对话框
    //void ShowModal(Title,Text,StyleIndex);  //独占显示，同上
    //void Hide();  //关闭
    //private
    this.Win = null;
    this.MainDiv = null;
    this.BtnOK=null;
    this.FShow = function(ShowModal) {
        if (this.Win == null) {
            this.MainDiv = TDIV_C(null);
            this.Win = new TDivWinA();
            this.Win.MainDiv = this.MainDiv;
            this.Win.Init();
            this.Win.SetZIndex(2000);
        }
        this.Win.SetSkinIndex(13);
        this.Win.Left = parseInt((document.documentElement.clientWidth - this.Width) / 2);
        this.Win.Top = parseInt(document.documentElement.clientHeight / 2 - this.Height / 2);
        this.Win.Width = this.Width;
        this.Win.Height = this.Height;
        this.Win.SetCaption(this.Title);
        this.MainDiv.innerHTML = this.Text;
        if (this.StyleIndex == 0) {
            this.Win.SetSkinIndex(13);
            this.MainDiv.style.textAlign = "center";
            this.MainDiv.style.lineHeight = (this.Height - 70) + "px";
            this.MainDiv.style.color = "#FF90A0"; //"#FFE03A";
            this.MainDiv.style.fontWeight = "";
            this.MainDiv.style.filter = "glow(color=#000000,strength=3)";
            this.BtnOK = new TTAM_ButtonA();
            this.BtnOK.Alert = this;
            this.BtnOK.Init(this.MainDiv);
            this.BtnOK.SetStyleIndex(9);
            this.BtnOK.SetCPos(parseInt(this.Width / 2), parseInt(this.Height - this.BtnOK.Height - 25));
            this.BtnOK.SetCaption("确 认");
            this.BtnOK.DivLabel.style.filter = "";
            this.BtnOK.OnClick = function() { TTAMAlert_MouseClick(this) };
        } else if (this.StyleIndex == 1) {
            this.Win.SetSkinIndex(13);
            this.Win.Height -= 30;
            this.MainDiv.style.textAlign = "center";
            this.MainDiv.style.lineHeight = (this.Win.Height - 40) + "px";
            this.MainDiv.style.color = "#FF90A0"; //"#FFE03A";
            this.MainDiv.style.fontWeight = "";
            this.MainDiv.style.filter = "glow(color=#000000,strength=3)";
        }
        if (this.Visible) this.Win.Hide();
        if (ShowModal) {
            this.Win.ShowModal();
        } else this.Win.Show();
        this.Visible = true;
    }
    this.ShowModal = function(Title,Text,StyleIndex) {
        if (IsEmpty(StyleIndex)) StyleIndex=0;
        this.StyleIndex=StyleIndex%2;
        this.Title=Title;
        this.Text=Text;
        this.FShow(true);
    }
    this.Show = function(Title,Text,StyleIndex) {
        if (IsEmpty(StyleIndex)) StyleIndex=0;
        this.StyleIndex=StyleIndex%2;
        this.Title=Title;
        this.Text=Text;
        this.FShow(false);
    }
    this.Hide = function() {
        if (!this.Visible) return;
        this.Win.Hide();
        this.Visible=false;
    }
}
function TTAMAlert_MouseClick(Sender) {
    var AlertWin=Sender.Alert;
    AlertWin.Hide();
}
var TamAlert=new TTAM_Alert();



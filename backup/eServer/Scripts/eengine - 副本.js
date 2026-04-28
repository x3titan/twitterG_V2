/// <reference path="tampub3.js" />
var $g = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var $$ = function (p, e) {
    return p.getElementsByTagName(e);
};

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

function Rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.equals = function (value) {
        if (value.x != this.x) return false;
        if (value.y != this.y) return false;
        if (value.w != this.w) return false;
        if (value.h != this.h) return false;
        return true;
    }
    this.getRight = function () {
        return this.x + this.w;
    }
    this.getBottom = function () {
        return this.y + this.h;
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function createPanel(parent, name, bgColor, left, top, width, height) {
    var result = eb.createDiv(parent);
    result.id = name;
    eb.setDivRect(result, left, top, width, height);
    if (bgColor.length > 0) {
        result.style.backgroundColor = "#" + bgColor;
    }
    if (name.length > 3) {
        eval("parent." + name.substr(3, name.length) + "=result");
    }
    if (parent.eeChildren == undefined) {
        parent.eeChildren = new Array();
    }
    parent.eeChildren.push(result);
    result.eeChildren = new Array();
    return result;
}

function addText(div, text, hAlign, vAlign, font, size, color, weight) {
    var div1 = document.createElement("div");
    div1.style.position = "absolute";
    div1.style.overflow = "hidden";
    var table = document.createElement("table");
    var row = table.insertRow();
    var cell = row.insertCell();
    table.style.position = "absolute";
    table.style.whiteSpace = "pre-wrap";
    cell.style.fontFamily = font;
    cell.style.fontSize = size + "pt";
    cell.style.fontWeight = weight;
    if (color.length == 6) {
        cell.style.color = "#" + color;
    } else {
        cell.style.color = color;
    }
    cell.style.textAlign = hAlign;
    cell.style.verticalAlign = vAlign;
    cell.innerHTML = text;
    div.label = table;
    div.label.hAlign = hAlign;
    div.label.vAlign = vAlign;
    if (div.childNodes.length <= 0) {
        div.appendChild(div1);
    } else if (eb.isEmpty(div._input)) {
        div.appendChild(div1);
    } else {
        div.insertBefore(div1, div._input);
    }
    div1.appendChild(table);
    var r = eb.getDivRect(div);
    ee.setRect(div, r.x, r.y, r.w, r.h, true);
}

function addImageOnLoad(na, img) {
    if (!eb.isEmpty(img)) {
        if (eb.isEmpty(img.sw)) return;
    }
    if (eb.isEmpty(img)) img = this;
    if (eb.isEmpty(img.parentNode)) return;
    var imgHeight;
    var ratio;
    var firstLoad = false;
    var imgMode = img.parentNode.imgMode;
    if (eb.isEmpty(img.sw)) {
        img.sw = img.width;
        img.sh = img.height;
        firstLoad = true;
    }
    if (imgMode == "trim") {
        if (img.parentNode.offsetWidth / img.sw > img.parentNode.offsetHeight / img.sh) {
            ratio = img.parentNode.offsetWidth / img.sw;
            img.width = img.parentNode.offsetWidth;
            img.height = parseInt(img.sh * ratio + 1);
            img.style.left = "0px";
            img.style.top = parseInt(img.parentNode.offsetHeight / 2 - img.height / 2) + "px";
        } else {
            ratio = img.parentNode.offsetHeight / img.sh;
            img.width = parseInt(img.sw * ratio + 1);
            img.height = img.parentNode.offsetHeight;
            img.style.left = parseInt(img.parentNode.offsetWidth / 2 - img.width / 2) + "px";
            img.style.top = "0px";
        }
    } else if (imgMode == "fill") {
        if (img.parentNode.offsetWidth / img.sw < img.parentNode.offsetHeight / img.sh) {
            ratio = img.parentNode.offsetWidth / img.sw;
            img.width = img.parentNode.offsetWidth;
            img.height = parseInt(img.sh * ratio);
            img.style.left = "0px";
            img.style.top = parseInt(img.parentNode.offsetHeight / 2 - img.height / 2) + "px";
        } else {
            ratio = img.parentNode.offsetHeight / img.sh;
            img.width = parseInt(img.sw * ratio + 1);
            img.height = img.parentNode.offsetHeight;
            img.style.left = parseInt(img.parentNode.offsetWidth / 2 - img.width / 2) + "px";
            img.style.top = "0px";
        }
    } else if (imgMode == "stretch") {
        img.width = img.parentNode.offsetWidth;
        img.height = img.parentNode.offsetHeight;
        img.style.left = "0px";
        img.style.top = "0px";
    } else if (imgMode == "center") {
        img.style.left = parseInt(img.parentNode.offsetWidth / 2 - img.sw / 2) + "px";
        img.style.top = parseInt(img.parentNode.offsetHeight / 2 - img.sh / 2) + "px";
    } else if (imgMode == "normal") {
        img.style.left = "0px";
        img.style.top = "0px";
    } else {
        img.style.left = "0px";
        img.style.top = "0px";
    }
    if (firstLoad) {
        if (!eb.isEmpty(img.parentNode.onImageLoad)) {
            img.parentNode.onImageLoad(img.parentNode);
        }
    }
}

function addLink(div, link) {
    div.style.cursor = "hand";
    div.onclick = function () { window.location.href = link; };
}

function addSkin(div, skin, clipMode, imgW, imgH, rx, ry, rw, rh, cx, cy, cw, ch) {
    //var imgUrl = "eeImage.aspx?_skin_Url_=" + skin;
    var imgUrl;
    if (ee.relatedCache.length > 0) {
        imgUrl = ee.relatedCache + skin;
    } else {
        imgUrl = "cache" + skin;
        if (ee.pureServer) imgUrl = "/" + imgUrl;
    }
    if (div.skin != undefined) {
        for (var i = 0; i < div.skin.length; i++) {
            div.removeChild(div.skin[i]);
        }
    }
    if (cx == undefined) {
        cx = rx; cy = ry; cw = rw; ch = rh;
    }
    div.skinClipMode = clipMode;
    div.skinImgW = imgW;
    div.skinImgH = imgH;
    div.skinX = rx; div.skinY = ry; div.skinW = rw; div.skinH = rh;
    div.skinCX = cx; div.skinCY = cy; div.skinCW = cw; div.skinCH = ch;
    div.skin = new Array();
    if (clipMode == "9x") {
        var dw = div.offsetWidth - (imgW - rw);
        var dh = div.offsetHeight - (imgH - rh);
        var cw = imgW - rx - rw;
        var ch = imgH - ry - rh;
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, 0, 0, rx, ry, 0, 0, rx, ry)); //lr
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx + rw, 0, cw, ry, rx + dw, 0, cw, ry)); //ur
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, 0, ry + rh, rx, ch, 0, ry + dh, rx, ch)); //lb
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx + rw, ry + rh, cw, ch, rx + dw, ry + dh, cw, ch)); //br
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx, 0, rw, ry, rx, 0, dw, ry)); //up
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx, ry + rh, rw, ch, rx, ry + dh, dw, ch)); //bottom
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, 0, ry, rx, rh, 0, ry, rx, dh)); //left
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx + rw, ry, cw, rh, rx + dw, ry, cw, dh)); //right
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx, ry, rw, rh, rx, ry, dw, dh)); //center
    } else if (clipMode == "LR3x") {
        var w1 = parseInt(div.offsetHeight * rx / rh);
        var w3 = parseInt(div.offsetHeight * (imgW - rx - rw) / rh);
        var w2 = div.offsetWidth - w1 - w3;
        if (w2 <= 0) {
            w2 = 1;
            w1 = parseInt(div.offsetWidth * w1 / (w3 + w1));
            w3 = div.offsetWidth - w1 - w2;
        }
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, 0, 0, rx, rh, 0, 0, w1, div.offsetHeight)); //left
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx, ry, rw, rh, w1, 0, w2, div.offsetHeight)); //middle
        div.skin.push(stretchImg(imgUrl, div, imgW, imgH, rx + rw, ry, imgW - rx - rw, rh, w1 + w2, 0, w3, div.offsetHeight)); //right
    }
}

function stretchImg(imgUrl, parentDiv, imgW, imgH, sx, sy, sw, sh, dx, dy, dw, dh) {
    var d = eb.createDiv(parentDiv);
    eb.setDivRect(d, dx, dy, dw, dh);
    if ((sw == dw) && (sh == dh)) {
        d.style.backgroundImage = "url(" + imgUrl + ")";
        //d.style.backgroundPositionX = (-sx) + "px";
        //d.style.backgroundPositionY = (-sy) + "px";
        d.style.backgroundPosition = (-sx) + "px " + (-sy) + "px";
        d.imgUrl = imgUrl;
    } else {
        var img = eb.createImg(d, imgUrl);
        var xr = dw / sw;
        var yr = dh / sh;
        d.img = img;
        eb.setImgRect(img, -parseInt(sx * xr + 0.5), -parseInt(sy * yr + 0.5), parseInt(imgW * xr + 0.5), parseInt(imgH * yr + 0.5));
    }
    return d;
}

var eeShowStyle = {
    normal: 10, //正常
    whiteAlpha: 20 //白色淡出
}

//eEngine全局变量
var g5 = {};
var g6 = {};
var g7 = {};

//eEngine动态函数
var ee = {
    pageUrl: "", //本页面url
    pageRoot: "", //项目rootURL
    pageRootHtm: "",
    showPanelDiv: null,
    showPanelStartTime: new Date(),
    aniTimer: null, //private
    aniPanel: new Array(), //private
    autoResize: true,
    relatedCache: "",
    eePath: "",
    pureServer: false, //是否是纯服务器版本
    //动画形式显示一个panel, style值参考eeShowStyle类
    showPanel: function (c, style) {
        if (style == eeShowStyle.normal) {
            c.style.visibility = "visible";
        } else if (style == eeShowStyle.whiteAlpha) {
            if (this.showPanelDiv != null) {
                this.showPanelDiv.parentNode.removeChild(this.showPanelDiv);
            }
            this.showPanelDiv = eb.createDiv(c);
            eb.setDivRect(this.showPanelDiv, 0, 0, c.offsetWidth, c.offsetHeight);
            this.showPanelDiv.style.backgroundColor = "#ffffff";
            this.showPanelStartTime = new Date();
            c.style.visibility = "visible";
            setTimeout("ep_showPanelTimer()", 10);
        }
    },
    showAni: function (panel, aniIndex) {
        if (panel.aniStart) return;
        if (eb.isEmpty(panel.aniAlpha) && eb.isEmpty(panel.aniPos) && eb.isEmpty(panel.aniSize)) {
            ee.setVisible(panel, true);
            return;
        }
        if (eb.isEmpty(aniIndex)) aniIndex = 0;
        eb.useAniIndex(panel, aniIndex);
        panel.aniTime = 0;
        panel.aniStartTime = new Date();
        panel.aniStart = false;
        var i = 0;
        for (i = 0; i < this.aniPanel.length; i++) {
            if (ee.aniPanel[i] == panel) break;
        }
        if (i >= this.aniPanel.length) ee.aniPanel.push(panel);
        if (this.aniTimer == null) {
            this.aniTimer = setInterval(this.aniTimerFunc, 10);
        }
    },
    //private
    aniTimerFunc: function () {
        if (ee.aniPanel.length == 0) {
            clearInterval(ee.aniTimer);
            ee.aniTimer = null;
            return;
        }
        var d, t, r, pr;
        var p;
        var i = 0;
        while (i < ee.aniPanel.length) {
            p = ee.aniPanel[i];
            d = (new Date()).getTime() - p.aniStartTime.getTime();
            if (d < p.aniDelay) {
                i++;
                continue;
            }
            if (!p.aniStart) {
                ee.aniPanel[i].aniStart = true;
                p.aniTime = 0;
                var aniTime;
                if (p.aniAlpha == "whiteAlpha") {
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniWhiteAlpha = eb.createDiv(p);
                    eb.setDivRect(null, 0, 0, p.offsetWidth, p.offsetHeight);
                    p.aniWhiteAlpha.style.backgroundColor = "#ffffff";
                } else if (p.aniAlpha == "appear") {
                    p.aniTime = Math.max(p.aniTime, 300);
                } else if (p.aniAlpha == "disappear") {
                    p.aniTime = Math.max(p.aniTime, 300);
                }
                r = eb.getDivRect(p);
                pr = eb.getDivRect(p.parentNode);
                p.aniOldSize = r;
                if (p.aniPos == "leftBonus") {
                    p.aniStartX = -r.w;
                    p.aniStartY = r.y;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 700);
                    p.aniMotion = "bonus";
                } else if (p.aniPos == "topBonus") {
                    p.aniStartX = r.x;
                    p.aniStartY = -r.h;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 700);
                    p.aniMotion = "bonus";
                } else if (p.aniPos == "rightBonus") {
                    p.aniStartX = pr.w;
                    p.aniStartY = r.y;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 700);
                    p.aniMotion = "bonus";
                } else if (p.aniPos == "bottomBonus") {
                    p.aniStartX = r.x;
                    p.aniStartY = pr.h;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 700);
                    p.aniMotion = "bonus";
                } else if (p.aniPos == "leftFlyIn") {
                    p.aniStartX = -r.w;
                    p.aniStartY = r.y;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "slowDown";
                } else if (p.aniPos == "leftFlyOut") {
                    p.aniStartX = r.x;
                    p.aniStartY = r.y;
                    p.aniEndX = -r.w;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "accUp";
                } else if (p.aniPos == "topFlyIn") {
                    p.aniStartX = r.x;
                    p.aniStartY = -r.h;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "slowDown";
                } else if (p.aniPos == "topFlyOut") {
                    p.aniStartX = r.x;
                    p.aniStartY = r.y;
                    p.aniEndX = r.x;
                    p.aniEndY = -r.h;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "accUp";
                } else if (p.aniPos == "rightFlyIn") {
                    p.aniStartX = pr.w;
                    p.aniStartY = r.y;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "slowDown";
                } else if (p.aniPos == "rightFlyOut") {
                    p.aniStartX = r.x;
                    p.aniStartY = r.y;
                    p.aniEndX = pr.w;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "accUp";
                } else if (p.aniPos == "bottomFlyIn") {
                    p.aniStartX = r.x;
                    p.aniStartY = pr.h;
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "slowDown";
                } else if (p.aniPos == "bottomFlyOut") {
                    p.aniStartX = r.x;
                    p.aniStartY = r.y;
                    p.aniEndX = r.x;
                    p.aniEndY = pr.h;
                    p.aniTime = Math.max(p.aniTime, 500);
                    p.aniMotion = "accUp";
                } else if (p.aniPos == "jump") {
                    p.aniStartX = r.x;
                    p.aniStartY = r.y - parseInt(r.h / 2);
                    p.aniEndX = r.x;
                    p.aniEndY = r.y;
                    p.aniTime = Math.max(p.aniTime, 700);
                    p.aniMotion = "bonus";
                }
                if (p.aniSize == "tinyZoom") {
                    p.aniStartW = parseInt(r.w * 8 / 10);
                    p.aniStartH = parseInt(r.h * 8 / 10);
                    p.aniEndW = r.w;
                    p.aniEndH = r.h;
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniMotion = "slowDown";
                } else if (p.aniSize == "tinyZoomOut") {
                    p.aniStartW = r.w;
                    p.aniStartH = r.h;
                    p.aniEndW = parseInt(r.w * 9 / 10);
                    p.aniEndH = parseInt(r.h * 9 / 10);
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniMotion = "accUp";
                } else if (p.aniSize == "tinyExpand") {
                    p.aniStartW = r.w;
                    p.aniStartH = r.h;
                    p.aniEndW = parseInt(r.w * 11 / 10);
                    p.aniEndH = parseInt(r.h * 11 / 10);
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniMotion = "accUp";
                } else if (p.aniSize == "tinyExtract") {
                    p.aniStartW = parseInt(r.w * 11 / 10);
                    p.aniStartH = parseInt(r.h * 11 / 10);
                    p.aniEndW = r.w;
                    p.aniEndH = r.h;
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniMotion = "slowDown";
                } else if (p.aniSize == "pointAppear") {
                    p.aniStartW = 1;
                    p.aniStartH = 1;
                    p.aniEndW = r.w;
                    p.aniEndH = r.h;
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniMotion = "slowDown";
                } else if (p.aniSize == "pointDisappear") {
                    p.aniStartW = r.w;
                    p.aniStartH = r.h;
                    p.aniEndW = 1;
                    p.aniEndH = 1;
                    p.aniTime = Math.max(p.aniTime, 300);
                    p.aniMotion = "accUp";
                }
                ee.setVisible(p, true);
                if (!eb.isEmpty(p.onAniStart)) {
                    p.onAniStart(p);
                }
            }
            d = (d - p.aniDelay) / p.aniTime;
            d = Math.min(1, Math.max(0, d));
            if (p.aniAlpha == "whiteAlpha") {
                eb.setAlpha(p.aniWhiteAlpha, parseInt((1 - d) * 100));
            } else if (p.aniAlpha == "appear") {
                eb.setAlpha(p, parseInt(d * 100));
            } else if (p.aniAlpha == "disappear") {
                eb.setAlpha(p, parseInt((1 - d) * 100));
            }
            if (!eb.isEmpty(p.aniSize)) {
                t = eb.getInterpolation(p.aniMotion, d);
                ee.setRect(p, null, null,
                    (p.aniEndW - p.aniStartW) * t + p.aniStartW,
                    (p.aniEndH - p.aniStartH) * t + p.aniStartH);
            }
            if (!eb.isEmpty(p.aniPos)) {
                t = eb.getInterpolation(p.aniMotion, d);
                if (p.aniPos == "lockCenter") {
                    eb.setDivRect(p,
                        parseInt(p.aniOldSize.x + p.aniOldSize.w / 2 - eb.getDivRect(p).w / 2),
                        parseInt(p.aniOldSize.y + p.aniOldSize.h / 2 - eb.getDivRect(p).h / 2));
                } else {
                    eb.setDivRect(p,
                        parseInt((p.aniEndX - p.aniStartX) * t + p.aniStartX),
                        parseInt((p.aniEndY - p.aniStartY) * t + p.aniStartY));
                }
            }
            if (d >= 1) {
                if (p.aniAlpha == "whiteAlpha") {
                    p.removeChild(p.aniWhiteAlpha);
                    p.aniWhiteAlpha = null;
                }
                if (!eb.isEmpty(p.aniPos)) {
                    eb.setDivRect(p, p.aniOldSize.x, p.aniOldSize.y);
                }
                if (!eb.isEmpty(p.aniSize)) {
                    ee.setRect(p, null, null, p.aniOldSize.w, p.aniOldSize.h);
                }
                ee.aniPanel.splice(i, 1);
                if (p.aniAutoHide) {
                    ee.setVisible(p, false);
                }
                p.aniStart = false;
                if (!eb.isEmpty(p.onAniEnd)) {
                    p.onAniEnd(p);
                }
            } else {
                i++;
            }
        }
    },
    //隐藏所有子div
    hideAllLayer: function (c) {
        for (var i = 0; i < c.childNodes.length; i++) {
            if (c.childNodes[i].layerName != undefined) {
                c.childNodes[i].style.visibility = "hidden";
            }
        }
    },
    //根据设计界面的名称获取控件
    getControl: function (controlName) {
        return $g("ee_" + controlName);
    },
    //获取页面url
    getUrl: function (pagePath) {
        return this.pageRoot + pagePath + this.pageRootHtm;
    },
    //获取edit,richedit控件的用户输入值
    getEditText: function (edit) {
        if (edit._input) {
            return edit._input.value;
        } else if (edit.richedit) {
            return edit.richedit.ed.body.innerHTML;
        }
        return "";
    },
    //设置edit控件的值
    setEditText: function (edit, text) {
        if (edit._input) {
            edit._input.value = text;
        } else if (edit.richedit) {
            if (edit.richedit.ed.body) {
                edit.richedit.ed.body.innerHTML = text;
            }
        }
        if (edit._inputHint) {
            if (text.length == "") {
                ee.setText(edit, edit._inputHint);
            } else {
                ee.setText(edit, "");
            }
        }
    },
    //获取panel内的text值
    getText: function (panel) {
        if (panel.label) {
            return panel.label.rows[0].cells[0].innerHTML;
        } else {
            return "";
        }
    },
    //设置panel内部的text值
    setText: function (panel, text) {
        if (panel.label) {
            panel.label.rows[0].cells[0].innerHTML = text;
        } else {
            addText(panel, text, "center", "middle", "宋体", 9, "#000000", "normal");
        }
    },
    //设置字颜色
    setTextColor: function (panel, color) {
        panel.getElementsByTagName("table")[0].rows[0].cells[0].style.color = color;
    },
    //设置是否可见 
    setVisible: function (panel, visible) {
        panel.style.visibility = visible ? "inherit" : "hidden";
    },
    //重新设置panel位置和大小
    setRect: function (panel, x, y, w, h, refresh) {
        var i, j, lastp, currentp, pos;
        if (eb.isEmpty(refresh)) refresh = false;
        if (!refresh) {
            if ((w == panel.offsetWidth) && (h == panel.offsetHeight)) {
                eb.setDivRect(panel, x, y, w, h);
                return;
            }
        }
        if (eb.isEmpty(w)) w = panel.offsetWidth;
        if (eb.isEmpty(h)) h = panel.offsetHeight;
        eb.setDivRect(panel, x, y, w, h);
        if (panel.skin != undefined) {
            var imgW = panel.skinImgW;
            var imgH = panel.skinImgH;
            var rx = panel.skinX;
            var ry = panel.skinY;
            var rw = panel.skinW;
            var rh = panel.skinH;
            if (panel.skinClipMode == "9x") {
                var dw = w - (imgW - rw);
                var dh = h - (imgH - rh);
                var cw = imgW - rx - rw;
                var ch = imgH - ry - rh;
                eb.restretchImg(panel.skin[0], 0, 0, 0, 0, 0, 0, 0, 0, rx, ry);
                eb.restretchImg(panel.skin[1], 0, 0, rx + rw, 0, 0, 0, rx + dw, 0, cw, ry);
                eb.restretchImg(panel.skin[2], 0, 0, 0, ry + rh, 0, 0, 0, ry + dh, rx, ch);
                eb.restretchImg(panel.skin[3], 0, 0, rx + rw, ry + rh, 0, 0, rx + dw, ry + dh, cw, ch);
                eb.restretchImg(panel.skin[4], imgW, imgH, rx, 0, rw, ry, rx, 0, dw, ry);
                eb.restretchImg(panel.skin[5], imgW, imgH, rx, ry + rh, rw, ch, rx, ry + dh, dw, ch);
                eb.restretchImg(panel.skin[6], imgW, imgH, 0, ry, rx, rh, 0, ry, rx, dh);
                eb.restretchImg(panel.skin[7], imgW, imgH, rx + rw, ry, cw, rh, rx + dw, ry, cw, dh);
                eb.restretchImg(panel.skin[8], imgW, imgH, rx, ry, rw, rh, rx, ry, dw, dh);
            } else if (panel.skinClipMode == "LR3x") {
                var w1 = parseInt(h * rx / rh);
                var w3 = parseInt(h * (imgW - rx - rw) / rh);
                var w2 = w - w1 - w3;
                if (w2 <= 0) {
                    w2 = 1;
                    w1 = parseInt(w * w1 / (w3 + w1));
                    w3 = w - w1 - w2;
                }
                eb.restretchImg(panel.skin[0], imgW, imgH, 0, 0, rx, rh, 0, 0, w1, h); //left
                eb.restretchImg(panel.skin[1], imgW, imgH, rx, ry, rw, rh, w1, 0, w2, h); //middle
                eb.restretchImg(panel.skin[2], imgW, imgH, rx + rw, ry, imgW - rx - rw, rh, w1 + w2, 0, w3, h); //right
            }
            if (!eb.isEmpty(panel.label)) {
                eb.setDivRect(panel.label.parentNode, panel.skinCX, panel.skinCY, w - panel.skinImgW + panel.skinCW, h - panel.skinImgH + panel.skinCH);
                var cy = parseInt((h - panel.skinImgH + panel.skinCH) / 2);
                if (panel.label.vAlign == "top") {
                    eb.setDivRect(panel.label, 0, 0, w - panel.skinImgW + panel.skinCW, h * 2);
                } else if (panel.label.vAlign == "bottom") {
                    eb.setDivRect(panel.label, 0, h - panel.skinImgH + panel.skinCH - h * 2, w - panel.skinImgW + panel.skinCW, h * 2);
                } else {
                    eb.setDivRect(panel.label, 0, parseInt(cy - h / 2), w - panel.skinImgW + panel.skinCW, h);
                }
            }
            if (!eb.isEmpty(panel._input)) {
                eb.setDivRect(panel._input, panel.skinCX, panel.skinCY,
                    eb.getDivRect(panel).w - panel.skinImgW + panel.skinCW,
                    eb.getDivRect(panel).h - panel.skinImgH + panel.skinCH);
                if (!panel._input.multiLine) panel._input.style.lineHeight = eb.getDivRect(panel._input).h + "px";
            }
        } else {
            if (!eb.isEmpty(panel.label)) {
                eb.setDivRect(panel.label.parentNode, 0, 0, w, h);
                eb.setDivRect(panel.label, 0, 0, w, h);
            }
        }
        if (panel.img != undefined) {
            addImageOnLoad(null, panel.img);
        }
        if (panel.layout != undefined) {
            var totalSize;
            if (panel.layout == "LayoutX") {
                totalSize = eb.getDivRect(panel).w;
            } else {
                totalSize = eb.getDivRect(panel).h;
            }
            var totalHeavy = 0;
            for (i = 0; i < panel.eeChildren.length; i++) {
                if (!panel.eeChildren[i].heavyEnabled) {
                    if (panel.layout == "LayoutX") {
                        totalSize -= eb.getDivRect(panel.eeChildren[i]).w;
                    } else {
                        totalSize -= eb.getDivRect(panel.eeChildren[i]).h;
                    }
                } else {
                    totalHeavy += panel.eeChildren[i].heavy;
                }
            }
            lastp = 0; pos = 0;
            for (i = 0; i < panel.eeChildren.length; i++) {
                if (panel.eeChildren[i].heavyEnabled) {
                    currentp = panel.eeChildren[i].heavy / totalHeavy * totalSize + lastp;
                    lastp = currentp - parseInt(currentp);
                    if (panel.layout == "LayoutX") {
                        ee.setRect(panel.eeChildren[i], pos, 0, parseInt(currentp), h);
                    } else {
                        eb.setDivRect(panel.eeChildren[i], null, null, null, parseInt(currentp));
                    }
                    pos += parseInt(currentp);
                }
            }
            //最终调整位置和大小
            var leftPos = 0;
            for (i = 0; i < panel.eeChildren.length; i++) {
                if (panel.layout == "LayoutX") {
                    ee.setRect(panel.eeChildren[i], leftPos, 0, eb.getDivRect(panel.eeChildren[i]).w, h);
                    leftPos += eb.getDivRect(panel.eeChildren[i]).w;
                } else {
                    ee.setRect(panel.eeChildren[i], 0, leftPos, w, eb.getDivRect(panel.eeChildren[i]).h);
                    leftPos += eb.getDivRect(panel.eeChildren[i]).h;
                }
            }
        }
        if (!eb.isEmpty(panel.tableTitle)) {
            var t = panel.tableTitle;
            lastp = 0;
            pos = 0;
            for (j = 0; j < panel.rowCount; j++) {
                currentp = lastp + eb.getDivRect(panel).h / panel.visibleRowCount;
                lastp = currentp - parseInt(currentp);
                for (i = 0; i < panel.colCount; i++) {
                    ee.setRect(this.getTableCell(panel, i, j), eb.getDivRect(t.eeChildren[i]).x, pos, eb.getDivRect(t.eeChildren[i]).w, parseInt(currentp));
                }
                pos += parseInt(currentp);
            }
        }
    },
    //设置单元格内容
    setTableCellText: function (tableBody, colIndex, rowIndex, text) {
        if (colIndex >= tableBody.colCount) return;
        if (rowIndex >= tableBody.rowCount) return;
        if (tableBody.cols[colIndex].onUpdate == undefined) {
            this.setText(this.getTableCell(tableBody, colIndex, rowIndex), text);
        } else {
            tableBody.cols[colIndex].onUpdate(this.getTableCell(tableBody, colIndex, rowIndex), text);
        }
    },
    //获取tableBody单元
    getTableCell: function (tableBody, colIndex, rowIndex) {
        if (colIndex >= tableBody.colCount) return null;
        if (rowIndex >= tableBody.rowCount) return null;
        return tableBody.eeChildren[rowIndex * tableBody.colCount + colIndex];
    },
    //TableBody增加一行
    tableAppendRow: function (tableBody) {
        var js = tableBody.jsCreateRow;
        for (var i = 0; i < tableBody.rowVar.length; i++) {
            js = js.replace(new RegExp("\"" + tableBody.rowVar[i] + "\"", "gm"), "\"ee_tbtemp" + eb.tempSn + "\"");
            eb.tempSn++;
        }
        eval(js);
        eb.initTableBody(tableBody);
    },
    //移除TableBody指定的一行
    tableRemoveRow: function (tableBody, rowIndex) {
        if ((rowIndex < 0) || (rowIndex >= tableBody.rowCount)) return;
        for (var i = tableBody.colCount - 1; i >= 0; i--) {
            this.removeControl(this.getTableCell(tableBody, i, rowIndex));
        }
        eb.initTableBody(tableBody);
    },
    //设置TableBody的行数
    tableSetRowCount: function (tableBody, rowCount) {
        rowCount = Math.max(0, rowCount);
        while (rowCount > tableBody.rowCount) this.tableAppendRow(tableBody);
        while (rowCount < tableBody.rowCount) this.tableRemoveRow(tableBody, tableBody.rowCount - 1);
    },
    //设置皮肤
    setSkin: function (div, skin, clipMode, imgW, imgH, rx, ry, rw, rh, cx, cy, cw, ch) {
        if (eb.isEmpty(div.skin)) {
            addSkin(div, skin, clipMode, imgW, imgH, rx, ry, rw, rh, cx, cy, cw, ch);
            return;
        }
        skin = "cache" + skin;
        if (ee.pureServer) skin = "/" + skin;
        for (var i = 0; i < 9; i++) {
            if (eb.isEmpty(div.skin[i].img)) {
                div.skin[i].style.backgroundImage = "url(" + skin + ")";

            } else {
                div.skin[i].img.src = skin;
            }
        }
        if (cx == undefined) {
            cx = rx; cy = ry; cw = rw; ch = rh;
        }
        div.skinClipMode = clipMode;
        div.skinImgW = imgW;
        div.skinImgH = imgH;
        div.skinX = rx; div.skinY = ry; div.skinW = rw; div.skinH = rh;
        div.skinCX = cx; div.skinCY = cy; div.skinCW = cw; div.skinCH = ch;
        var r = eb.getDivRect(div);
        this.setRect(div, r.x, r.y, r.w, r.h, true);
    },
    //设置背景图片
    setImage: function (div, imgUrl, imgMode, alt, title) {
        if (!eb.isEmpty(div.img)) {
            if (eb.isEmpty(alt)) alt = div.img.alt;
            if (eb.isEmpty(title)) title = div.img.title;
            if (eb.isEmpty(imgMode)) imgMode = div.imgMode;
            if (eb.isEmpty(imgUrl)) imgUrl = "url:" + div.img.src;
            div.removeChild(div.img);
            div.img = undefined;
        }
        if (eb.isEmpty(imgUrl)) return;
        if (eb.isEmpty(imgMode)) imgMode = "trim";
        if (eb.isEmpty(alt)) alt = "";
        if (eb.isEmpty(title)) title = "";
        var cmd = "";
        if (imgUrl.length >= 4) {
            cmd = imgUrl.substring(0, 4);
        }
        if (cmd == "url:") {
            imgUrl = imgUrl.substring(4);
        } else {
            //imgUrl = "eeImage.aspx?_image_Url_=" + imgUrl;
            if (ee.relatedCache.length > 0) {
                imgUrl = ee.relatedCache + "../cache" + imgUrl;
            } else {
                imgUrl = "cache" + imgUrl;
                if (ee.pureServer) imgUrl = "/" + imgUrl;
            }
        }
        div.img = document.createElement("img");
        div.imgMode = imgMode;
        div.img.ondragstart = function () { return false; };
        div.img.alt = alt;
        div.img.title = title;
        div.img.style.position = "absolute";
        div.img.onload = addImageOnLoad;
        div.img.src = imgUrl;
        if (div.childNodes.length > 0) {
            div.insertBefore(div.img, div.childNodes[0]);
        } else div.appendChild(div.img);
        //div.innerHTML += "<img src = \"" + imgUrl + "\" alt=\"" + alt + "\" title=\"" + title + "\" style=\"position:absolute;\" onload=\"addImageOnLoad(this);\" />";
        //div.img = div.childNodes[div.childNodes.length - 1];
    },
    setAutoScroll: function (div, value) {
        value = value ? "auto" : "hidden";
        if (!eb.isEmpty(div._input)) {
            div._input.style.overflow = value;
        } else if (!eb.isEmpty(div.label)) {
            div.label.parentNode.style.overflow = value;
        } else {
            div.style.overflow = value;
        }
    },
    setCheckBoxValue: function (div, value) {
        var s1 = div.status1;
        if (eb.isEmpty(s1)) return;
        if (eb.isEmpty(div.initialized)) {
            div.initialized = true;
            eval(
                "eb.addEvent(div, \"click\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "        e = e.parentNode;\n" +
                "        if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    ee.setCheckBoxValue(e, 1);\n" +
                "}, false);\n" +
                "eb.addEvent(div.status1, \"click\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "     while (e.id != \"" + div.id + "status1\") {\n" +
                "         e = e.parentNode;\n" +
                "         if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    ee.setCheckBoxValue(e.checkBox, 0);\n" +
                "}, false);\n"
            );
        }
        if (div.checkValue == value) return;
        div.checkValue = value;
        if (value == 0) {
            eb.setAni(div, "appear", "null", "null", 0, true, false);
            eb.setAni(div.status1, "disappear", "null", "null", 0, true, true);
            ee.showAni(div);
            ee.showAni(div.status1);
        } else {
            eb.setAni(div.status1, "appear", "null", "null", 0, true, false);
            eb.setAni(div, "disappear", "null", "null", 0, true, true);
            ee.showAni(div);
            ee.showAni(div.status1);
        }
        if (!eb.isEmpty(div.onValueChange)) {
            div.onValueChange(div, value);
        }
    },
    setOnClick: function (div, func) {
        div.eeOnClick = func;
        if ("ontouchstart" in window) {
            eb.addEvent(div, "touchstart", function (event) {
                div.eeMouseDownX = event.changedTouches[0].screenX;
                div.eeMouseDownY = event.changedTouches[0].screenY;
            }, false);
            eb.addEvent(div, "touchend", function (event) {
                var d = Math.abs(event.changedTouches[0].screenX - div.eeMouseDownX);
                d += Math.abs(event.changedTouches[0].screenY - div.eeMouseDownY);
                if (d < 50) {
                    if (div.eeOnClick) {
                        setTimeout(function () {
                            div.eeOnClick(div, event);
                        }, 1);
                    }
                }
            }, false);
            eb.addEvent(div, "touchmove", function (event) {
            }, false);
        } else {
            eb.addEvent(div, "click", function (event) {
                if (div.eeOnClick) {
                    div.eeOnClick(div, event);
                }
            }, false);
        }
    },
    setOnMouseEnter: function (div, func) {
        div.eeOnMouseEnter = func;
        eval(
            "eb.addEvent(div, \"mouseenter\", function (e) {\n" +
            "    sender=e; sender = sender || window.event;\n" +
            "    sender = sender.srcElement || sender.target;\n" +
            "    while (sender.id != \"" + div.id + "\") {\n" +
            "        sender = sender.parentNode;\n" +
            "        if (eb.isEmpty(sender)) return;\n" +
            "    }\n" +
            "    sender.eeOnMouseEnter(sender,e);\n" +
            "}, false);\n");
        eval(
            "eb.addEvent(div, \"mouseover\", function (e) {\n" +
            "    sender=e; sender = sender || window.event;\n" +
            "    sender = sender.srcElement || sender.target;\n" +
            "    while (sender.id != \"" + div.id + "\") {\n" +
            "        sender = sender.parentNode;\n" +
            "        if (eb.isEmpty(sender)) return;\n" +
            "    }\n" +
            "    sender.eeOnMouseEnter(sender,e);\n" +
            "}, false);\n");
    },
    setOnMouseLeave: function (div, func) {
        div.eeOnMouseLeave = func;
        eval(
            "eb.addEvent(div, \"mouseleave\", function (e) {\n" +
            "    sender=e; sender = sender || window.event;\n" +
            "    sender = sender.srcElement || sender.target;\n" +
            "    while (sender.id != \"" + div.id + "\") {\n" +
            "        sender = sender.parentNode;\n" +
            "        if (eb.isEmpty(sender)) return;\n" +
            "    }\n" +
            "    sender.eeOnMouseLeave(sender,e);\n" +
            "}, false);\n");
        eval(
            "eb.addEvent(div, \"mouseout\", function (e) {\n" +
            "    sender=e; sender = sender || window.event;\n" +
            "    sender = sender.srcElement || sender.target;\n" +
            "    while (sender.id != \"" + div.id + "\") {\n" +
            "        sender = sender.parentNode;\n" +
            "        if (eb.isEmpty(sender)) return;\n" +
            "    }\n" +
            "    sender.eeOnMouseLeave(sender,e);\n" +
            "}, false);\n");
    },
    //获取tableBody单元的文本
    getTableCellText: function (tableBody, colIndex, rowIndex) {
        var c = this.getTableCell(tableBody, colIndex, rowIndex);
        if (c == null) return "";
        return this.getText(c);
    },
    //赋予tableBody一个结果集
    setTableData: function (tableBody, dataset, startIndex) {
        if (tableBody.dynamicMode) {
            ee.tableSetRowCount(tableBody, dataset.rowCount);
            eb.initTableBody(tableBody);
            eb.processDock();
        }
        for (var y = 0; y < tableBody.rowCount; y++) {
            for (var x = 0; x <= tableBody.colCount; x++) {
                this.setTableCellText(tableBody, x, y, dataset.getData(x, y + startIndex));
            }
        }
    },
    //清空tableBody数据
    clearTableData: function (tableBody) {
        for (var rowIndex = 0; rowIndex < tableBody.rowCount; rowIndex++) {
            for (var colIndex = 0; colIndex <= tableBody.colCount; colIndex++) {
                this.setTableCellText(tableBody, colIndex, rowIndex, "");
            }
        }
    },
    //开始一个事务集
    post: function (taskSetName, param) {
        var s = eio.buffo.replace(/\^/g, "^^").replace(/\</g, "^x");
        if (eb.isEmpty(param)) param = "";
        if (ee.pureServer) {
            if (param != "") {
                param = "?" + "_T_=" + taskSetName + "&" + param;
            } else {
                param = "?" + "_T_=" + taskSetName;
            }
            eval(taskSetName + "_ajax.post(\"" + ee.pageUrl + param + "\",s);");
        } else {
            if (param != "") param = "&" + param;
            if (ee.eePath.length > 0) {
                eval(taskSetName + "_ajax.post(\"" + ee.eePath + "/ee.aspx?_L_=\"+ee.pageUrl+\"&_T_=" + encodeURIComponent(taskSetName) + param + "\",s);");
            } else {
                eval(taskSetName + "_ajax.post(\"ee.aspx?_L_=\"+ee.pageUrl+\"&_T_=" + encodeURIComponent(taskSetName) + param + "\",s);");
            }
        }
        //encodeURIComponent while using utf-8
    },
    //用户自定义post到一个地址
    postUrl: function (taskSetName, url) {
        eval(taskSetName + "_ajax.post(\"" + url + "\",eio.buffo);");
    },
    //删除一个控件
    removeControl: function (c) {
        if (c.eeChildren) {
            while (c.eeChildren.length > 0) {
                this.removeControl(c.eeChildren[0]);
            }
        }
        var i = 0;
        while (i < eb.dockItem.length) {
            if (eb.dockItem[i] == c) {
                eb.dockItem.splice(i, 1);
            } else i++;
        }
        i = 0;
        while (i < c.parentNode.eeChildren.length) {
            if (c.parentNode.eeChildren[i] == c) {
                c.parentNode.eeChildren.splice(i, 1);
            } else i++;
        }
        c.parentNode.removeChild(c);
    },
    //获取url参数
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    getGlobalPoint: function (control) {
        if (eb.isEmpty(control)) return new Point(0, 0);
        var r = new Point(0, 0);
        var rect;
        while (true) {
            rect = eb.getDivRect(control);
            r.x += rect.x;
            r.y += rect.y;
            if (control.id == "divRoot") break;
            if (control.id == "") break;
            control = control.parentNode;
            if (eb.isEmpty(control)) break;
        }
        return r;
    },
    getGlobalDiff: function (control1, control2) {
        var g1 = this.getGlobalPoint(control1);
        var g2 = this.getGlobalPoint(control2);
        return new Point(g2.x - g1.x, g2.y - g1.y);
    }
}

//底层驱动
var eb = {
    divCurrent: null,
    dockItem: new Array(),
    fontSizeAutoItem: new Array(),
    tempSn: 1,
    touchSX: 0,
    touchSY: 0,
    _touchStart: function (event) {
        eb.touchSX = event.touches[0].pageX;
        eb.touchSY = event.touches[0].pageY;
    },
    _touchMove: function (event) {
        event.preventDefault();
    },
    _touchEnd: function (event) {
        var endX, endY;
        endX = event.changedTouches[0].pageX;
        endY = event.changedTouches[0].pageY;
        var direction = eb._getSlideDirection(eb.touchSX, eb.touchSY, endX, endY);
        switch (direction) {
            case 0:
                //没滑动
                break;
            case 1:
                if (!eb.isEmpty($g("divRoot").onSlideUp)) {
                    $g("divRoot").onSlideUp();
                }
                break;
            case 2:
                if (!eb.isEmpty($g("divRoot").onSlideDown)) {
                    $g("divRoot").onSlideDown();
                }
                break;
            case 3:
                if (!eb.isEmpty($g("divRoot").onSlideLeft)) {
                    $g("divRoot").onSlideLeft();
                }
                break;
            case 4:
                if (!eb.isEmpty($g("divRoot").onSlideRight)) {
                    $g("divRoot").onSlideRight();
                }
                break;
            default:
        }
    },
    init: function () {
    },
    initMouseEvent: function (div) {
        if ("ontouchstart" in window) {
            if (div.eeMouseDown) {
                eb.addEvent(div, "touchstart", function (event) {
                    div.eeMouseDown(div, event, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                }, false);
            }
            if (div.eeMouseUp) {
                eb.addEvent(div, "touchend", function (event) {
                    div.eeMouseUp(div, event, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                }, false);
            }
            if (div.eeMouseMove) {
                eb.addEvent(div, "touchmove", function (event) {
                    div.eeMouseMove(div, event, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                }, false);
            }
        } else {
            if (div.eeMouseDown) {
                eb.addEvent(div, "mousedown", function (event) {
                    div.eeMouseDown(div, event, event.x, event.y);
                }, false);
            }
            if (div.eeMouseUp) {
                eb.addEvent(div, "mouseup", function (event) {
                    div.eeMouseUp(div, event, event.x, event.y);
                }, false);
            }
            if (div.eeMouseMove) {
                eb.addEvent(div, "mousemove", function (event) {
                    div.eeMouseMove(div, event, event.x, event.y);
                }, false);
            }
        }
    },
    initButton: function (div) {
        if (eb.isEmpty(div.status1)) return;
        if (eb.isEmpty(div.status2)) return;
        if (eb.isEmpty(div.status3)) return;
        if (eb.isEmpty(div.clickLayer)) return;
        div.clickLayer.style.zIndex = 100;
        if (eb.isEmpty(div.initialized)) {
            div.initialized = true;
            eval(
                "eb.addEvent(div.clickLayer, \"mouseenter\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "        e = e.parentNode;\n" +
                "        if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    eb.setAni(e.status2, \"appear\", \"null\", \"null\", 0, true, false);\n" +
                "    ee.showAni(e.status2);\n" +
                "    ee.setVisible(e.status3, false);\n" +
                "    ee.setVisible(e.status1, true);\n" +
                "    e.mousein=true;\n" +
                "}, false);\n" +
                "eb.addEvent(div.clickLayer, \"mouseover\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "        e = e.parentNode;\n" +
                "        if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    eb.setAni(e.status2, \"appear\", \"null\", \"null\", 0, true, false);\n" +
                "    ee.showAni(e.status2);\n" +
                "    ee.setVisible(e.status3, false);\n" +
                "    ee.setVisible(e.status1, true);\n" +
                "    e.mousein=true;\n" +
                "}, false);\n" +
                "eb.addEvent(div.clickLayer, \"mouseleave\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "         e = e.parentNode;\n" +
                "         if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    eb.setAni(e.status2, \"disappear\", \"null\", \"null\", 0, true, true);\n" +
                "    ee.showAni(e.status2);\n" +
                "    ee.setVisible(e.status3, false);\n" +
                "    ee.setVisible(e.status1, true);\n" +
                "    e.mousein=false;\n" +
                "}, false);\n" +
                "eb.addEvent(div.clickLayer, \"mouseout\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "         e = e.parentNode;\n" +
                "         if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    eb.setAni(e.status2, \"disappear\", \"null\", \"null\", 0, true, true);\n" +
                "    ee.showAni(e.status2);\n" +
                "    ee.setVisible(e.status3, false);\n" +
                "    ee.setVisible(e.status1, true);\n" +
                "    e.mousein=false;\n" +
                "}, false);\n" +
                "eb.addEvent(div.clickLayer, \"mousedown\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "         e = e.parentNode;\n" +
                "         if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    ee.setVisible(e.status1, false);\n" +
                "    ee.setVisible(e.status2, false);\n" +
                "    ee.setVisible(e.status3, true);\n" +
                "    var r = eb.getDivRect(e);\n" +
                "    ee.setRect(e, r.x + e.downX, r.y + e.downY, null, null);\n" +
                "}, false);\n" +
                "eb.addEvent(div.clickLayer, \"mouseup\", function (e) {\n" +
                "    e = e || window.event;\n" +
                "    e = e.srcElement || e.target;\n" +
                "    while (e.id != \"" + div.id + "\") {\n" +
                "         e = e.parentNode;\n" +
                "         if (eb.isEmpty(e)) return;\n" +
                "    }\n" +
                "    if (e.mousein) {\n" +
                "       ee.setVisible(e.status1, false);\n" +
                "       ee.setVisible(e.status2, true);\n" +
                "    } else {\n" +
                "       ee.setVisible(e.status1, true);\n" +
                "       ee.setVisible(e.status2, false);\n" +
                "    }\n" +
                "    ee.setVisible(e.status3, false);\n" +
                "    var r = eb.getDivRect(e);\n" +
                "    ee.setRect(e, r.x - e.downX, r.y - e.downY, null, null);\n" +
                "}, false);\n"
            );
            ee.setVisible(div.status1, true);
            ee.setVisible(div.status2, false);
            ee.setVisible(div.status3, false);
        }
        return;
        if (div.checkValue == value) return;
        div.checkValue = value;
        if (value == 0) {
            eb.setAni(div, "appear", "null", "null", 0, true, false);
            eb.setAni(div.status1, "disappear", "null", "null", 0, true, true);
            ee.showAni(div);
            ee.showAni(div.status1);
        } else {
            eb.setAni(div.status1, "appear", "null", "null", 0, true, false);
            eb.setAni(div, "disappear", "null", "null", 0, true, true);
            ee.showAni(div);
            ee.showAni(div.status1);
        }
        if (!eb.isEmpty(div.onValueChange)) {
            div.onValueChange(div, value);
        }
    },
    setTouchEnabled: function (enabled) {
        if (!("ontouchstart" in window)) return;
        document.removeEventListener("touchstart", eb._touchStart, false);
        document.removeEventListener("touchmove", eb._touchMove, false);
        document.removeEventListener("touchend", eb._touchEnd, false);
        if (enabled) {
            //touch
            document.addEventListener("touchstart", eb._touchStart, false);
            document.addEventListener("touchmove", eb._touchMove, false);
            document.addEventListener("touchend", eb._touchEnd, false);
        }
    },
    _getSlideAngle: function (dx, dy) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    },
    _getSlideDirection: function (startX, startY, endX, endY) {
        var dy = eb.touchSY - endY;
        var dx = endX - eb.touchSX;
        var result = 0;
        if (Math.abs(dx) < 40 && Math.abs(dy) < 40) {
            return result;
        }
        var angle = eb._getSlideAngle(dx, dy);
        if (angle >= -45 && angle < 45) {
            result = 4;
        } else if (angle >= 45 && angle < 135) {
            result = 1;
        } else if (angle >= -135 && angle < -45) {
            result = 2;
        }
        else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
            result = 3;
        }
        return result;
    },
    isEmpty: function (object) {
        if (typeof (object) == "undefined") {
            return true;
        } else if (object == null) {
            return true;
        }
        return false;
    },
    createDiv: function (parent) {
        this.divCurrent = document.createElement("div");
        if (this.isEmpty(parent)) {
            document.body.insertBefore(this.divCurrent, document.body.firstChild);
        } else parent.appendChild(this.divCurrent);
        this.divCurrent.style.overflow = "hidden";
        this.divCurrent.style.position = "absolute";
        this.divCurrent.style.whiteSpace = "nowrap";
        this.divCurrent.style.fontFamily = "宋体";
        this.divCurrent.style.fontSize = "9pt";
        this.divCurrent.style.textAlign = "left";
        return this.divCurrent;
    },
    setDivRect: function (div, x, y, w, h) {
        var iTemp;
        if (this.isEmpty(div)) {
            div = this.divCurrent;
        }
        if (!this.isEmpty(x)) {
            if (typeof (x) == "number") {
                div.style.left = x + "px";
            }
        }
        if (!this.isEmpty(y)) {
            if (typeof (y) == "number") {
                div.style.top = y + "px";
            }
        }
        if (!this.isEmpty(w)) {
            if (typeof (w) == "number") {
                div.style.width = Math.max(0, w) + "px";
            }
        }
        if (!this.isEmpty(h)) {
            if (typeof (h) == "number") {
                div.style.height = Math.max(0, h) + "px";
            }
        }
    },
    getDivRect: function (div) {
        return new Rect(div.offsetLeft, div.offsetTop, div.offsetWidth, div.offsetHeight);
    },
    createImg: function (parent, imgUrl) {
        var c = document.createElement("img");
        if (parent == null) {
            document.body.insertBefore(c, document.body.firstChild);
        } else parent.appendChild(c);
        c.style.position = "absolute";
        c.src = imgUrl;
        return c;
    },
    setImgRect: function (img, x, y, w, h) {
        if (!eb.isEmpty(x)) {
            if (typeof (x) == "number") {
                img.style.left = x + "px";
            }
        }
        if (!eb.isEmpty(y)) {
            if (typeof (y) == "number") {
                img.style.top = y + "px";
            }
        }
        if (!eb.isEmpty(w)) {
            if (typeof (w) == "number") {
                img.width = Math.max(0, w);
            }
        }
        if (!eb.isEmpty(h)) {
            if (typeof (h) == "number") {
                img.height = Math.max(0, h);
            }
        }
    },
    setAlpha: function (div, value) {
        div.style.filter = "Alpha(Opacity=" + value + ")";
        div.style.opacity = value / 100;
    },
    setAni: function (panel, alpha, pos, size, delay, autoShow, autoHide) {
        this.setAni2(panel, 0, alpha, pos, size, delay, autoHide);
    },
    setAni2: function (panel, aniIndex, alpha, pos, size, delay, autoHide) {
        var p = panel;
        if (eb.isEmpty(p.ani)) p.ani = new Array();
        if (eb.isEmpty(p.ani[aniIndex])) p.ani[aniIndex] = {};
        p.ani[aniIndex].aniAlpha = alpha == "null" ? null : alpha;
        p.ani[aniIndex].aniPos = pos == "null" ? null : pos;
        p.ani[aniIndex].aniSize = size == "null" ? null : size;
        p.ani[aniIndex].aniDelay = delay;
        p.ani[aniIndex].aniAutoHide = autoHide;
        this.useAniIndex(p, aniIndex);
    },
    setAniEvent: function (panel, aniIndex, onAniStart, onAniEnd) {
        var p = panel;
        if (eb.isEmpty(p.ani)) p.ani = new Array();
        if (eb.isEmpty(p.ani[aniIndex])) p.ani[aniIndex] = {};
        p.ani[aniIndex].onAniStart = onAniStart;
        p.ani[aniIndex].onAniEnd = onAniEnd;
        this.useAniIndex(p, aniIndex);
    },
    useAniIndex: function (panel, aniIndex) {
        var p = panel;
        p.aniIndex = aniIndex;
        p.aniAlpha = p.ani[aniIndex].aniAlpha;
        p.aniPos = p.ani[aniIndex].aniPos;
        p.aniSize = p.ani[aniIndex].aniSize;
        p.aniDelay = p.ani[aniIndex].aniDelay;
        p.aniAutoHide = p.ani[aniIndex].aniAutoHide;
        p.onAniStart = p.ani[aniIndex].onAniStart;
        p.onAniEnd = p.ani[aniIndex].onAniEnd;
    },
    //初始化tableBody
    initTableBody: function (tb) {
        if (tb.colCount <= 0) return;
        for (var i = 0; i < tb.eeChildren.length; i++) {
            var colIndex = i % tb.colCount;
            var rowIndex = parseInt(i / tb.colCount);
            tb.eeChildren[i].colIndex = colIndex;
            tb.eeChildren[i].rowIndex = rowIndex;
            if (i < tb.colCount) tb.cols[i].rows = new Array();
            tb.cols[colIndex].rows[rowIndex] = tb.eeChildren[i];
        }
        tb.rowCount = tb.eeChildren.length <= 0 ? 0 : parseInt((tb.eeChildren.length - 1) / tb.colCount) + 1;
        ee.setRect(tb, null, null, null, null, true);
    },
    restretchImg: function (div, imgW, imgH, sx, sy, sw, sh, dx, dy, dw, dh) {
        var xr = dw / sw;
        var yr = dh / sh;
        if (eb.isEmpty(div.img)) {
            //div.img = eb.createImg(div, div.imgUrl);
            this.setDivRect(div, dx, dy, dw, dh);
            div.style.backgroundPosition = (-sx) + "px " + (-sy) + "px";
            return;
        }
        this.setDivRect(div, dx, dy, dw, dh);
        eb.setImgRect(div.img, -parseInt(sx * xr + 0.5), -parseInt(sy * yr + 0.5), parseInt(imgW * xr + 0.5), parseInt(imgH * yr + 0.5));
    },
    getInterpolation: function (name, pos) {
        var i;
        if (name == "linear") {
            return pos;
        } else if (name == "slowDown") {
            return Math.sin(pos * Math.PI / 2);
        } else if (name == "accUp") {
            return 1 - Math.cos(pos * Math.PI / 2);
        } else if (name == "accSlow") {
            return (Math.sin((pos * 2 - 1) * Math.PI / 2) + 1) / 2;
        } else if (name == "bonus") {
            var f = function (x, a, b) {
                var result = (x - a - b / 2);
                result = result * result * 2 / b;
                return result + 1 - b;
            }
            var a = new Array();
            var b = new Array();
            a.push(-0.5); b.push(1);
            for (i = 0; i < 10; i++) {
                a.push(a[i] + b[i]);
                b.push(b[i] / 3);
            }
            for (i = 0; i < 10; i++) {
                if (pos < a[i + 1]) {
                    return f(pos, a[i], b[i]);
                }
            }
            return 1;
        } else {
            return pos;
        }
    },
    setDock: function (panel, dockX, dockY) {
        if (dockX != "disabled") {
            panel.dockX = dockX;
        }
        if (dockY != "disabled") {
            panel.dockY = dockY;
        }
        if (panel.dockX != undefined || panel.dockY != undefined) {
            this.dockItem.push(panel);
        }
    },
    setBind: function (panel, bindControlName, bindLeft, bindTop, bindRight, bindBottom) {
        if (this.isEmpty(panel.bindControlName)) {
            this.dockItem.push(panel);
        }
        panel.bindControlName = bindControlName;
        panel.bindLeft = bindLeft;
        panel.bindRight = bindRight;
        panel.bindTop = bindTop;
        panel.bindBottom = bindBottom;
    },
    setFontSizeAuto: function (panel, value) {
        if (value <= 0) return;
        panel.fontSizeAuto = value;
        this.fontSizeAutoItem.push(panel);
    },
    setInputFontSizeAuto: function (panel, value) {
        if (value <= 0) return;
        panel.inputFontSizeAuto = value;
        this.fontSizeAutoItem.push(panel);
    },
    setOuter: function (panel, left, top, right, bottom) {
        panel.outerLeft = left;
        panel.outerTop = top;
        panel.outerRight = right;
        panel.outerBottom = bottom;
    },
    addEdit: function (div, font, fontSize, fontColor, fontBold, password, multiLine, inputHint) {
        var input;
        if (multiLine) {
            input = document.createElement("textarea");
        } else {
            input = document.createElement("input");
        }
        if (password) {
            input.type = "password";
        }
        div.appendChild(input);
        div.style.cursor = "text";
        input.multiLine = multiLine;
        input.style.overflow = "hidden";
        input.style.position = "absolute";
        input.style.border = "0px";
        input.style.outline = "0px";
        input.style.backgroundColor = "transparent";
        if (!multiLine) input.style.whiteSpace = "nowrap";
        input.style.fontFamily = "宋体";
        input.style.fontSize = "9pt";
        input.style.textAlign = "left";
        if (!eb.isEmpty(div.skin)) {
            eb.setDivRect(input, div.skinCX, div.skinCY,
                eb.getDivRect(div).w - div.skinImgW + div.skinCW,
                eb.getDivRect(div).h - div.skinImgH + div.skinCH);
        } else {
            input.style.width = "100%";
            input.style.height = "100%";
            input.style.left = "0px";
            input.style.top = "0px";
        }
        if (!multiLine) {
            input.style.lineHeight = eb.getDivRect(input).h + "px";
        }
        input.style.fontFamily = font;
        input.style.fontSize = fontSize;
        input.style.color = fontColor;
        input.style.fontWeight = fontBold;
        if (ee.pureServer) {
            input.style.backgroundImage = "url(/Res/empty.png)";
        } else {
            input.style.backgroundImage = "url(Res/empty.png)";
        }
        div._input = input;
        if (this.isEmpty(inputHint)) inputHint = false;
        if (inputHint) {
            div._inputHint = ee.getText(div);
            this.addEvent(input, "focus", function (event) {
                var sender = event.target ? event.target : (event.srcElement ? event.srcElement : null);
                if (sender == null) return;
                var c = sender.parentNode;
                ee.setText(c, "");
            }, false);
            this.addEvent(input, "blur", function (event) {
                var sender = event.target ? event.target : (event.srcElement ? event.srcElement : null);
                if (sender == null) return;
                var c = sender.parentNode;
                if (ee.getEditText(c).length <= 0) {
                    ee.setText(c, c._inputHint);
                }
            }, false);
        }
    },
    addEvent: function (elm, evType, fn, useCapture) {
        if (elm.addEventListener) {
            elm.addEventListener(evType, fn, useCapture); //DOM2.0
            return true;
        } else if (elm.attachEvent) {
            var r = elm.attachEvent("on" + evType, fn); //IE5+
            return r;
        } else {
            elm['on' + evType] = fn; //DOM 0
        }
    },
    removeEvent: function (elm, evType, fn, useCapture) {
        if (elm.removeEventListener) {
            elm.removeEventListener(evType, fn, useCapture); //DOM2.0
            return true;
        } else if (elm.detachEvent) {
            var r = elm.detachEvent("on" + evType, fn); //IE5+
            return r;
        } else {
            elm['on' + evType] = ""; //DOM 0
        }
    },
    setCookie: function (key, value, expHours) {
        var exp = new Date();
        if (expHours == undefined) {
            expHours = 20 * 365 * 24;
        }
        exp.setTime(exp.getTime() + parseInt(expHours * 60 * 60 * 1000));
        document.cookie = key + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
    },
    getCookie: function (key) {
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else return null;
    },
    delCookie: function (key) {
        this.setCookie(key, "", 0);
    },

    processDock: function () {
        var dock, r, r1, ro, i, d, item;
        var modified = true;
        var a = new Array();
        while (modified) {
            modified = false;
            for (i = 0; i < eb.dockItem.length; i++) {
                item = this.dockItem[i];
                dock = item.dockX;
                r = eb.getDivRect(item);
                if (eb.isEmpty(item.outerLeft)) {
                    ro = new Rect(0, 0, 0, 0);
                } else {
                    ro = new Rect(item.outerLeft, item.outerTop, item.outerRight, item.outerBottom);
                }
                if (!eb.isEmpty(item.tableBody)) {
                    r1 = eb.getDivRect(item.tableBody);
                    r1.x = r.x;
                    r1.w = r.w;
                    r1.y = r.y + r.h;
                }
                if (dock == "left") {
                    r.x = ro.x;
                } else if (dock == "right") {
                    r.x = eb.getDivRect(item.parentNode).w - r.w - ro.w;
                } else if (dock == "center") {
                    r.x = parseInt((eb.getDivRect(item.parentNode).w - r.w) / 2 + ro.x / 2 - ro.w / 2);
                } else if (dock == "fill") {
                    r.x = ro.x;
                    r.w = eb.getDivRect(item.parentNode).w - ro.x - ro.w;
                    if (!eb.isEmpty(item.lockRatio)) {
                        r.h = parseInt(item.sizeRatio * r.w);
                    }
                } else if (dock == "ratio") {
                    d = item.widthRatio * eb.getDivRect(item.parentNode).w;
                    if (!eb.isEmpty(item.lockRatio)) {
                        r.w = parseInt(Math.min(d, item.heightRatio * eb.getDivRect(item.parentNode).h / item.sizeRatio));
                        r.x = parseInt((item.leftRatio + item.widthRatio / 2) * eb.getDivRect(item.parentNode).w - r.w / 2);
                    } else {
                        r.x = parseInt(item.leftRatio * eb.getDivRect(item.parentNode).w);
                        r.w = parseInt(d);
                    }
                }
                dock = item.dockY;
                if (dock == "top") {
                    if (!eb.isEmpty(item.tableBody)) {
                        r.y = ro.y;
                        r1.y = r.h + ro.y;
                    } else {
                        r.y = ro.y;
                    }
                } else if (dock == "bottom") {
                    if (!eb.isEmpty(item.tableBody)) {
                        r.y = eb.getDivRect(item.parentNode).h - r.h - r1.h - ro.h;
                        r1.y = r.y + r.h;
                    } else {
                        r.y = eb.getDivRect(item.parentNode).h - r.h - ro.h;
                    }
                } else if (dock == "center") {
                    if (!eb.isEmpty(item.tableBody)) {
                        r.y = parseInt((eb.getDivRect(item.parentNode).h - r.h - r1.h) / 2);
                        r1.y = r.y + r.h;
                    } else {
                        r.y = parseInt((eb.getDivRect(item.parentNode).h - r.h) / 2);
                    }
                    r.y += ro.y / 2 - ro.h / 2;
                } else if (dock == "fill") {
                    if (!eb.isEmpty(item.tableBody)) {
                        r.y = ro.y;
                        r1.y = r.y + r.h;
                        r1.h = eb.getDivRect(item.parentNode).h - r.h - ro.y - ro.h;
                    } else {
                        r.y = ro.y;
                        r.h = eb.getDivRect(item.parentNode).h - ro.y - ro.h;
                    }
                } else if (dock == "ratio") {
                    d = item.heightRatio * eb.getDivRect(item.parentNode).h;
                    if (!eb.isEmpty(item.lockRatio)) {
                        r.h = parseInt(Math.min(d, item.widthRatio * eb.getDivRect(item.parentNode).w * item.sizeRatio));
                        r.y = parseInt((item.topRatio + item.heightRatio / 2) * eb.getDivRect(item.parentNode).h - r.h / 2);
                    } else {
                        r.y = parseInt(item.topRatio * eb.getDivRect(item.parentNode).h);
                        r.h = parseInt(d);
                    }
                }
                if (this.isEmpty(item.bindControl)) {
                    item.bindControl = ee.getControl(item.bindControlName);
                }
                var bindItem = item.bindControl;
                if (!this.isEmpty(bindItem)) {
                    r1 = this.getDivRect(bindItem);
                    var pTemp = ee.getGlobalDiff(item.parentNode, bindItem.parentNode);
                    r1.x += pTemp.x;
                    r1.y += pTemp.y;
                    if (item.bindLeft == "left") {
                        r.x = r1.x + ro.x;
                    } else if (item.bindLeft == "center") {
                        r.x = r1.x + parseInt(r1.w / 2) + ro.x;
                    } else if (item.bindLeft == "right") {
                        r.x = r1.getRight() + ro.x;
                    }
                    if (item.bindRight == "left") {
                        if (item.bindLeft == "disabled") {
                            r.x = r1.x - ro.w - r.w;
                        } else {
                            r.w = r1.x - ro.w - r.x;
                        }
                    } else if (item.bindRight == "center") {
                        if (item.bindLeft == "disabled") {
                            r.x = r1.x + parseInt(r1.w / 2) - ro.w - r.w;
                        } else {
                            r.w = r1.x + parseInt(r1.w / 2) - ro.w - r.x;
                        }
                    } else if (item.bindRight == "right") {
                        if (item.bindLeft == "disabled") {
                            r.x = r1.getRight() - ro.w - r.w;
                        } else {
                            r.w = r1.getRight() - ro.w - r.x;
                        }
                    }
                    if (item.bindTop == "top") {
                        r.y = r1.y + ro.y;
                    } else if (item.bindTop == "center") {
                        r.y = r1.y + parseInt(r1.h / 2) + ro.y;
                    } else if (item.bindTop == "bottom") {
                        r.y = r1.getBottom() + ro.y;
                    }
                    if (item.bindBottom == "top") {
                        if (item.bindTop == "disabled") {
                            r.y = r1.y - ro.h - r.h;
                        } else {
                            r.h = r1.y - ro.h - r.y;
                        }
                    } else if (item.bindBottom == "center") {
                        if (item.bindTop == "disabled") {
                            r.y = r1.y + parseInt(r1.h / 2) - ro.h - r.h;
                        } else {
                            r.h = r1.y + parseInt(r1.h / 2) - ro.h - r.y;
                        }
                    } else if (item.bindBottom == "bottom") {
                        if (item.bindTop == "disabled") {
                            r.y = r1.getBottom() - ro.h - r.h;
                        } else {
                            r.h = r1.getBottom() - ro.h - r.y;
                        }
                    }
                }
                if (!eb.isEmpty(item.tableBody)) {
                    if (!eb.isEmpty(item.minWidth)) {
                        r1.w = Math.max(r1.w, item.minWidth);
                        r.w = Math.max(r.w, item.minWidth);
                    }
                    if (!eb.isEmpty(item.minHeight)) r1.h = Math.max(r1.h, item.minHeight);
                } else {
                    if (!eb.isEmpty(item.minWidth)) r.w = Math.max(r.w, item.minWidth);
                    if (!eb.isEmpty(item.minHeight)) r.h = Math.max(r.h, item.minHeight);
                }
                if (r.w < 0) r.w = 0;
                if (r.h < 0) r.h = 0;
                if (!r.equals(eb.getDivRect(item))) {
                    modified = true;
                    ee.setRect(item, r.x, r.y, r.w, r.h);
                }
                if (!eb.isEmpty(item.tableBody)) {
                    if (r1.w < 0) r1.w = 0;
                    if (r1.h < 0) r1.h = 0;
                    if (!r1.equals(eb.getDivRect(item.tableBody))) {
                        ee.setRect(item.tableBody, r1.x, r1.y, r1.w, r1.h);
                        modified = true;
                    }
                }
            }
        }
        var sw = Math.min($g("divRoot").offsetWidth, $g("divRoot").offsetHeight);
        for (i = 0; i < eb.fontSizeAutoItem.length; i++) {
            if (!eb.isEmpty(eb.fontSizeAutoItem[i].fontSizeAuto)) {
                eb.fontSizeAutoItem[i].label.rows[0].cells[0].style.fontSize = parseInt(sw * 3 / eb.fontSizeAutoItem[i].fontSizeAuto / 4) + "pt";
            }
            if (!eb.isEmpty(eb.fontSizeAutoItem[i].inputFontSizeAuto)) {
                eb.fontSizeAutoItem[i]._input.style.fontSize = parseInt(sw * 3 / eb.fontSizeAutoItem[i].inputFontSizeAuto / 4) + "pt";
            }
        }
    }
}

function ep_showPanelTimer() {
    var r = ((new Date()).getTime() - ee.showPanelStartTime.getTime()) / 300;
    r = Math.max(0, r);
    r = Math.min(1, r);
    ee.showPanelDiv.style.filter = "Alpha(Opacity=" + parseInt((1 - r) * 100) + ")";
    if (r >= 1) {
        ee.showPanelDiv.parentNode.removeChild(ee.showPanelDiv);
        ee.showPanelDiv = null;
    } else {
        setTimeout("ep_showPanelTimer()", 10);
    }
}

function EDataSet() {
    this.colCount = 0;
    this.rowCount = 0;
    this.data = new Array();
    this.setColCount = function (value) {
        if (this.data.length > value) {
            this.data.length = value;
        } else if (this.data.length < value) {
            while (this.data.length < value) {
                var ydata = new Array();
                while (ydata.length < this.rowCount) {
                    ydata.push("");
                }
                this.data.push(ydata);
            }
        }
        this.colCount = value;
    }
    this.setRowCount = function (value) {
        var i;
        if (this.rowCount < value) {
            for (i = 0; i < this.colCount; i++) {
                while (this.data[i].length < value) {
                    this.data[i].push("");
                }
            }
        } else if (this.rowCount > value) {
            for (i = 0; i < this.colCount; i++) {
                this.data[i].length = value;
            }
        }
        this.rowCount = value;
    }
    this.getData = function (colIndex, rowIndex) {
        if (colIndex >= this.colCount) return "";
        if (rowIndex >= this.rowCount) return "";
        return this.data[colIndex][rowIndex];
    }
    this.setData = function (colIndex, rowIndex, value) {
        if (colIndex >= this.colCount) return;
        if (rowIndex >= this.rowCount) return;
        this.data[colIndex][rowIndex] = value;
    }
    this.appendDataset = function (dataset) {
        if (dataset.rowCount <= 0) return false;
        var st = this.rowCount;
        this.setRowCount(this.rowCount + dataset.rowCount);
        for (var i = st; i < this.rowCount; i++) {
            for (var j = 0; j < this.colCount; j++) {
                this.setData(j, i, dataset.getData(j, i - st));
            }
        }
        return true;
    }
}

//前后台IO部分
var eio = {
    buffi: "", //输入缓存
    buffo: "", //输出缓存
    sp: 0, //输入缓存指针
    clear: function () {
        this.buffi = "";
        this.buffo = "";
        this.sp = 0;
    },
    appendByte: function (value) {
        if ((value < 0) || (value >= 0xff)) {
            value = value & 0xff;
        }
        value = value.toString(16);
        if (value.length == 1) {
            value = "0" + value;
        }
        this.buffo = this.buffo + value;
    },
    appendWord: function (word) {
        word = word & 0xffff;
        this.appendByte(word & 0xff);
        this.appendByte(word >> 8);
    },
    appendInt32: function (int32) {
        this.appendWord(int32 & 0xffff);
        this.appendWord(int32 >>> 16);
    },
    appendString8: function (str) {
        if (str == null) {
            str = "";
        }
        str = str.substring(0, Math.min(str.length, 0xff));
        this.appendByte(str.length);
        this.buffo = this.buffo + str;
    },
    appendString16: function (str) {
        if (str == null) {
            str = "";
        }
        str = str.substring(0, Math.min(str.length, 0xffff));
        this.appendWord(str.length);
        this.buffo = this.buffo + str;
    },
    appendString32: function (str) {
        if (str == null) {
            str = "";
        }
        this.appendInt32(str.length);
        this.buffo = this.buffo + str;
    },
    readByte: function () {
        if (this.sp + 1 >= this.buffi.length) {
            this.sp = this.buffi.length;
            return 0;
        }
        var s = this.buffi.substr(this.sp, 2);
        this.sp += 2;
        return parseInt(s, 16);
    },
    readWord: function () {
        var result = this.readByte();
        result += (this.readByte() << 8);
        return result;
    },
    readInt32: function () {
        var result = this.readWord();
        result = result | (this.readWord() << 16);
        return result;
    },
    readString8: function () {
        var len = this.readByte();
        len = Math.min(this.buffi.length - this.sp, len);
        this.sp += len;
        return this.buffi.substr(this.sp - len, len);
    },
    readString16: function () {
        var len = this.readWord();
        len = Math.min(this.buffi.length - this.sp, len);
        this.sp += len;
        return this.buffi.substr(this.sp - len, len);
    },
    readString32: function () {
        var len = this.readInt32();
        len = Math.min(this.buffi.length - this.sp, len);
        this.sp += len;
        return this.buffi.substr(this.sp - len, len);
    },
    readDataSet: function () {
        var result = new EDataSet();
        result.setColCount(this.readWord());
        result.setRowCount(this.readWord());
        for (var rowIndex = 0; rowIndex < result.rowCount; rowIndex++) {
            for (var colIndex = 0; colIndex < result.colCount; colIndex++) {
                result.setData(colIndex, rowIndex, this.readString16());
            }
        }
        return result;
    }
}

function TamAjax(name) {
    this.name = name;
    this.onReceive = null;
    this.handle = null;
    this.url = "";
    this.params = "";
    this.responseText = "";
    this.createHandle = function () {
        var handle;
        try {
            handle = new ActiveXObject("Msxml2.XMLHTTP"); //IE高版本创建XMLHTTP   
        } catch (E) {
            try {
                handle = new ActiveXObject("Microsoft.XMLHTTP"); //IE低版本创建XMLHTTP   
            } catch (E) {
                handle = new XMLHttpRequest(); //兼容非IE浏览器，直接创建XMLHTTP对象   
            }
        }
        return handle;
    }
    this.post = function (url, params) {
        this.url = url;
        this.params = params;
        this.handle = this.createHandle(); //创建XMLHttpRequest对象   
        this.handle.open("post", this.url, true);
        this.handle.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //this.handle.setRequestHeader("If-Modified-Since", "0");
        //this.handle.setRequestHeader("Access-Control-Request-Headers", "content-type");
        //this.handle.setRequestHeader("Access-Control-Allow-Origin", "*");
        //this.handle.setRequestHeader("Access-Control-Allow-Methods", "POST");
        //this.handle.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
        //this.handle.setRequestHeader("Content-length", Math.max(0, this.params.length - 4));
        //this.handle.setRequestHeader("Connection", "close");
        var callBackFunction =
            "this.handle.onreadystatechange=function() {" +
            "  if (" + this.name + ".handle.readyState == 4) {" +
            "    " + this.name + ".responseText = " + this.name + ".handle.responseText;" +
            "    if (" + this.name + ".onReceive!=null) {" +
            "      " + this.name + ".onReceive(" + this.name + ");" +
            "    }" +
            "  }" +
            "}";
        eval(callBackFunction);
        this.handle.send(this.params);
    }
    this.get = function (url) {
        this.url = url;
        this.params = params;
        this.handle = this.createHandle(); //创建XMLHttpRequest对象   
        this.handle.open("GET", this.url, true);
        this.handle.setRequestHeader("If-Modified-Since", "0");
        var callBackFunction =
            "this.handle.onreadystatechange=function() {" +
            "  if (" + this.name + ".handle.readyState == 4) {" +
            "    " + this.name + ".responseText = " + this.name + ".handle.responseText;" +
            "    if (" + this.name + ".onReceive!=null) {" +
            "      " + this.name + ".onReceive(" + this.name + ");" +
            "    }" +
            "  }" +
            "}";
        eval(callBackFunction);
        this.handle.send(null);
    }
}







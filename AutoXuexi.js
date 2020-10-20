// ==UserScript==
// @name         学习强国工具
// @namespace    https://github.com/squncle/AutoXuexi
// @version      0.0.1
// @description  学习强国答题工具
// @author       squncle
// @match        https://pc.xuexi.cn/points/exam-practice.html*
// @match        https://pc.xuexi.cn/points/exam-weekly-detail.html*
// @match        https://pc.xuexi.cn/points/exam-paper-detail.html*
// @grant        none
// ==/UserScript==

var next;
var mevent;
window.setInterval(doWork, 3000);

function doWork() {
    checkNext();
    if (next.disabled) {
        document.querySelector(".tips").click();
        let allTips = document.querySelectorAll("font[color=red]");
        let buttons = document.querySelectorAll(".q-answer");
        let textBoxs = document.querySelectorAll("input");
        let questionType = document.querySelector(".q-header").textContent;
        questionType = questionType.substr(0, 3);

        switch (questionType) {
            case "单选题":
                // 分成多部分的提示 || 只有一个的提示 -> 同一个答案
                // 由于switch块中let声明的问题，所以增加了if语句
                if (true) {
                    // 把红色提示组合为一条
                    let tipText = "";
                    for (let i = 0; i < allTips.length; i++) {
                        tipText += allTips[i].textContent;
                    }
                    if (tipText.length > 0) {
                        // 循环对比提示
                        for (let i = 0; i < buttons.length; i++) {
                            let iButton = buttons[i];
                            let iButtonText = iButton.textContent;
                            // 有些题目答案包含在提示内，有些题目提示包含在答案内
                            // 通过判断是否相互包含对方来确定答案
                            if (iButtonText.indexOf(tipText) > -1 || tipText.indexOf(iButtonText) > -1) {
                                iButton.click();
                            }
                        }
                    }
                }
                break;

            case "多选题":
                for (let i = 0; i < buttons.length; i++) {
                    let iButton = buttons[i];
                    // 循环对比提示
                    for (let j = 0; j < allTips.length; j++){
                        let tip = allTips[j];
                        let tipText = tip.textContent;
                        if (tipText.length > 0) {
                            let iButtonText = iButton.textContent;
                            if (iButtonText.indexOf(tipText) > -1 || tipText.indexOf(iButtonText) > -1) {
                                iButton.click();
                                break;
                            }
                        }
                    }
                }
                break;

            case "填空题":
                mevent = new Event('input', {bubbles:true});
                for (let i = 0; i < textBoxs.length; i++) { // 多填空
                    for (let j = i; j < allTips.length; j++) {
                        let tip = allTips[j];
                        let tipText = tip.textContent;
                        if (tipText.length > 0) {
                            // 通过设置属性,然后立即让他冒泡这个input事件.
                            // 否则1,setattr后,内容消失.
                            // 否则2,element.value=124后,属性值value不会改变,所以冒泡也不管用.
                            textBoxs[i].setAttribute("value", tipText);
                            textBoxs[i].dispatchEvent(mevent);
                            break;
                        }
                    }
                }
                break;

            default:
                break;
        }
        document.querySelector(".tips").click();
    }
    else {
        if (next.textContent != "再练一次" && next.textContent != "再来一组" && next.textContent != "查看解析") {
            next.click();
        }
    }
}

function checkNext() {
    let nextAll = document.querySelectorAll(".ant-btn");
    if (nextAll.length == 2) {
        next = nextAll[1]; // 交卷
    }
    else {
        next = nextAll[0]; // 下一题
    }
}

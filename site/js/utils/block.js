export var addCssRule = function() {
    // 创建一个 style， 返回其 stylesheet 对象
    function createStyleSheet() {
        var style = document.createElement('style');
        style.type = 'text/css';
        document.head.appendChild(style);
        return style.sheet;
    }
  
    // 创建 stylesheet 对象
    var sheet = createStyleSheet();
  
    // 返回接口函数
    return function(selector, rules, index) {
        index = index || 0;
        sheet.insertRule(selector + "{" + rules + "}", index);
    }
}();

export function insertChildByNewTag(element, tagName) {
    var newChild = document.createElement(tagName);
    newChild.innerHTML = element.innerHTML;
    element.innerHTML = '';
    element.appendChild(newChild);
    return newChild;
}

export function insertParentByNewTag(element, tagName) {
    var newParent = document.createElement(tagName);
    element.parentNode.replaceChild(newParent, element);
    newParent.appendChild(element)
    return newParent;
}

export function replaceElementByNewTag(oldElement, tagName) {
    let parent = oldElement.parentNode;
    let newElement = document.createElement(tagName);
    newElement.innerHTML = oldElement.innerHTML
    parent.replaceChild(newElement, oldElement)
    return newElement;
}

export function appendEndDiv(element) {
    let endDiv = document.createElement("div");
    endDiv.style.clear = "both";
    element.appendChild(endDiv);
}

export function px2rem(px) {
    return String(Number(px) * 0.05) + 'rem';
}
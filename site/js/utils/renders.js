import {insertChildByNewTag, insertParentByNewTag, replaceElementByNewTag, appendEndDiv, px2rem} from './block.js'


let KEY_SPLITER = "%";
let PARAM_SPLITER = "&";
let DEFAULT_EXTRA_CB_CLASS = "wcode";
let font_dict = {'cons': 'Consolas-inside', 'inh': 'inherit', 'msf': 'msf', 'mtt': 'mtt'}

export function renderImagleBlocks(fontBlock, funcParams) {

    if (fontBlock.getElementsByTagName('*').length == 0) {
        return;
    }

    let imageFloat = 'none';
    let i_margin_top = '0', i_margin_bottom = '0', imageMarginLeft = '0', imageMarginRight = '0';

    for (let i = 1; i < funcParams.length; ++i) {
        let keyName = funcParams[i].split(KEY_SPLITER)[0];
        var nidx = keyName.length + 1;
        if (keyName == 'r') {
            imageFloat = 'right';
            imageMarginRight = '0';
            imageMarginLeft = '5';
        }
        else if (keyName == 'l') {
            imageFloat = 'left';
            imageMarginRight = '5';
            imageMarginLeft = '0';
        }
        else if (keyName == 'a') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            i_margin_top = nums[0];
            if (nums.length > 1) i_margin_bottom = nums[1];
        } 
        else if (keyName == 'b') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            imageMarginLeft = nums[0];
            if (nums.length > 1) imageMarginRight = nums[1];
            //console.log(f_margin_left, f_margin_right)
        }
    }

    var outerDiv = replaceElementByNewTag(fontBlock, "div");
    outerDiv.className = 'floatpic';
    outerDiv.style.marginTop = px2rem(i_margin_top);
    outerDiv.style.marginBottom = px2rem(i_margin_bottom);
    appendEndDiv(outerDiv.parentNode);

    let img = outerDiv.getElementsByTagName('img');
    if (!img) {
        console.log("where is <img> ?");
        return;
    }
    let captionText = fontBlock.id;
    for (let i = 0; i < img.length; ++i) {
        
        var imgOuterDiv = insertParentByNewTag(img[i], "div");
        imgOuterDiv.style.marginLeft = px2rem(imageMarginLeft);
        imgOuterDiv.style.marginRight = px2rem(imageMarginRight);
        imgOuterDiv.align = "center";    // for caption
        imgOuterDiv.style.clear = "both";
        imgOuterDiv.style.float = imageFloat;
        if (captionText != '') {
            imgOuterDiv.innerHTML += '<br>';
            var captionElement = document.createElement("div");
            captionElement.className = 'caption';
            captionElement.innerHTML = captionText;
            imgOuterDiv.appendChild(captionElement);
        }
    }
}

export function renderFloatCodeBlocks(fontBlock, funcParams) {

    if (fontBlock.getElementsByTagName('*').length == 0) {
        return;
    }

    let codeFloat = "right";
    let codeMarginLeft = "0", codeMarginRight = "0", codeMarginTop = "4", codeMarginBottom = "8";
    let marginTop = "4", marginBottom = "8";
    let font = '';

    for (let i = 1; i < funcParams.length; ++i) {
        var keyName = funcParams[i].split('%')[0];
        var nidx = keyName.length + 1;
        if (keyName == 'a') {
            let nums = funcParams[i].substring(nidx).split('&');
            marginTop = nums[0];
            if (nums.length > 1) marginBottom = nums[1];
        } 
        else if (keyName == 'b') {
            let nums = funcParams[i].substring(nidx).split('&');
            codeMarginLeft = nums[0];
            if (nums.length > 1) codeMarginRight = nums[1];
        }
        else if (keyName == 'l') {
            codeFloat = 'left';
            codeMarginRight = "6";
        }
        else if (keyName == 'f') {
            font = font_dict[funcParams[i].substring(nidx)];
            if (!font)
                font = '';
        }
    }

    let funcHeads = funcParams[0].split("%");
    let outerDiv = replaceElementByNewTag(fontBlock, "div");
    if (funcHeads.length == 1) {
        outerDiv.className = DEFAULT_EXTRA_CB_CLASS;
    }
    else {
        outerDiv.className = funcHeads[1];
    }
    let innerDiv = insertChildByNewTag(outerDiv, 'div');
    outerDiv.style.marginTop = px2rem(marginTop);
    outerDiv.style.marginBottom = px2rem(marginBottom);
    appendEndDiv(outerDiv);

    // set float, margin-top, margin-bottom of highlight / highlight table
    var hl = outerDiv.getElementsByClassName('highlighttable')[0];
    var altFontFamilyBlks = [];
    var cb;
    if (!hl) {
        hl = outerDiv.getElementsByClassName('highlight')[0];
        cb = hl.getElementsByTagName('pre')[0]; // notice the button
        altFontFamilyBlks.push(cb.getElementsByTagName('code')[0]);
    }
    else {
        cb = hl;
        altFontFamilyBlks.push(hl.getElementsByClassName('linenos')[0].getElementsByTagName('pre')[0]);
        altFontFamilyBlks.push(hl.getElementsByClassName('highlight')[0].getElementsByTagName('code')[0]);
    }
    //console.log(cb)
    hl.style.float = codeFloat;
    hl.style.marginTop = px2rem(codeMarginTop);
    hl.style.marginBottom = px2rem(codeMarginBottom);
    cb.style.marginLeft = px2rem(codeMarginLeft);
    cb.style.marginRight = px2rem(codeMarginRight);
    if (font != '') {
        for (var bsi = 0; bsi < altFontFamilyBlks.length; ++bsi) {
            altFontFamilyBlks[bsi].style.fontFamily = font;       
        }   
    } 
}

export function renderTables(fontBlock, funcParams) {
    let tables = fontBlock.getElementsByTagName('table');
    if (!tables || tables.length == 0) {
        return;
    }

    let marginLeft = '0', marginRight = '0', marginTop = '0', marginBottom = '0';
    let tdPadding = false, tdPaddingTop = '5', tdPaddingBottom = '5';
    let tableClassName = '';

    for (let i = 1; i < funcParams.length; ++i) {
        let keyName = funcParams[i].split(KEY_SPLITER)[0];
        var nidx = keyName.length + 1;
        if (keyName == 'a') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            marginTop  = nums[0];
            if (nums.length > 1) marginBottom = nums[1];
        } 
        else if (keyName == 'b') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            marginLeft = nums[0];
            if (nums.length > 1) marginRight = nums[1];
        }
        else if (keyName == 'c') {
            tableClassName = funcParams[i].substring(nidx).split(PARAM_SPLITER)[0];
        }
        else if (keyName == 'h') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            tdPadding = true;
            tdPaddingTop = nums[0];
            if (nums.length > 1) tdPaddingBottom = nums[1];
        }
    }

    for (let i = 0; i < tables.length; ++i) {
        tables[i].style.marginLeft = px2rem(marginLeft);
        tables[i].style.marginRight = px2rem(marginRight);
        tables[i].style.marginTop = px2rem(marginTop);
        tables[i].style.marginBottom = px2rem(marginBottom);
        if (tableClassName != '')
            tables[i].className = tableClassName;
        if (tdPadding) {
            let tds = tables[i].getElementsByTagName('td');
            for (let j = 0; j < tds.length; ++j) {
                tds[j].style.paddingTop = px2rem(tdPaddingTop);
                tds[j].style.paddingBottom = px2rem(tdPaddingBottom);
            }
        }
    }

    replaceElementByNewTag(fontBlock, 'div')
}

export function removeInvalidFontBlock() {
    let body = document.getElementsByTagName('body')[0];
    body.innerHTML = body.innerHTML.replace(/<p><font.*><\/font><\/p>/g, "");
}
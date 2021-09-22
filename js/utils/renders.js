import {insertChildByNewTag, insertParentByNewTag, replaceElementByNewTag, appendEndDiv, px2rem, init2DimArray} from './block.js'
import {detectOS} from './detos.js'


let KEY_SPLITER = "%";
let PARAM_SPLITER = "&";
let DEFAULT_EXTRA_CB_CLASS = "wcode";
let font_dict = {'cons': 'Consolas-inside', 'inh': 'inherit', 'msf': 'msf', 'mtt': 'mtt', 'mon': 'Monaco-inside'}

export function renderImagleBlocks(fontBlock, funcParams) {

    if (fontBlock.getElementsByTagName('*').length == 0) {
        return;
    }

    //console.log(fontBlock)

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
    appendEndDiv(outerDiv);

    let img = outerDiv.getElementsByTagName('img');
    //console.log(img)
    if (img.length == 0) {
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
    // add in algorithm project
    let os = detectOS();
    if (os.indexOf('Win') == 0) 
        font = 'Consolas-inside';
    else    
        font = 'Monaco-inside';

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

    // rowspan or colspan
    for (let i = 0; i < tables.length; ++i) {
        let table = tables[i];
        let tbodyRows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        let m = tbodyRows.length;
        let n = tbodyRows[0].getElementsByTagName('td').length;
        let rmTds = init2DimArray(m, n, 0);
        for (let j = 0; j < tbodyRows.length; ++j) {
            let tds = tbodyRows[j].getElementsByTagName('td');
            for (let k = 0; k < tds.length; ++k) {
                let td = tds[k];
                let rspan = td.getElementsByTagName('rspan')[0];
                if (rspan) {
                    let height = Number(rspan.innerText);
                    for (let kk = 0; kk < height - 1; ++kk) {
                        rmTds[j + kk + 1][k] = 1;
                    }
                    td.rowSpan = rspan.innerHTML;
                    td.removeChild(rspan);
                }
                
                let cspan = td.getElementsByTagName('cspan')[0];
                if (cspan) {
                    let width = Number(cspan.innerText);
                    for (let kk = 0; kk < width - 1; ++kk)
                        rmTds[j][k + kk + 1] = 1;
                    td.colSpan = cspan.innerText;
                    td.removeChild(cspan);
                }
            }
        }

        for (let j = tbodyRows.length - 1; j >= 0; --j) {
            let tds = tbodyRows[j].getElementsByTagName('td');
            for (let k = tds.length - 1; k >= 0; --k) { 
                if (rmTds[j][k] == 1)
                    tds[k].parentNode.removeChild(tds[k]);
            }
        }
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

export function renderLists(fontBlock, funcParams) {
    let uls = fontBlock.getElementsByTagName('ul');
    if (!uls || uls.length == 0) {
        return;
    }
    let ul = uls[0];
    let mLeftU1 = '0.6rem', mLeftU2 = '1.2rem', mLeftRelDist = 12;
    let mLeftU1Mode = '0.6rem', mLeftU2Mode = '1.2rem', mLeftRelDistMode = 12;
    let setVal = false, setMode = false;
    let set1 = false, set2 = false;
    for (let i = 1; i < funcParams.length; ++i) {
        let keyName = funcParams[i].split(KEY_SPLITER)[0];
        var nidx = keyName.length + 1;
        if (keyName == 'u1') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            mLeftU1 = nums[0];
            mLeftU2 = px2rem(String(Number(nums[0]) + mLeftRelDist));
            mLeftU1 = px2rem(nums[0]);
            setVal = true;
            set1 = true;
        } 
        else if (keyName == 'u2') {
            let nums = funcParams[i].substring(nidx).split(PARAM_SPLITER);
            mLeftU2 = px2rem(nums[0]);
            setVal = true;
            set2 = true;
        }
        else if (keyName == 'n') {
            let ul2 = ul.getElementsByTagName('ul');
            for (let j = 0; j < ul2.length; ++j)
                ul2[j].style.listStyleType = 'none';
            setMode = true;
            mLeftU1Mode = '1.25rem';
            mLeftU2Mode = '1.0rem';
        }
        else if (keyName == '1') {
            setMode = true;
        }
        else if (keyName == 'nn') {
            setMode = true;
            ul.style.listStyleType = 'none';
            mLeftU1Mode = '0.2rem';
            mLeftU2Mode = '0.5rem';
        }
    }
    if (set2 && !set1) {
        mLeftU1 = mLeftU1Mode;
    }
    
    if (setMode) {
        ul.style.setProperty('--ul1-margin-left', mLeftU1Mode);
        ul.style.setProperty('--ul2-margin-left', mLeftU2Mode);
        if (set1) ul.style.setProperty('--ul1-margin-left', mLeftU1);
        if (set2) ul.style.setProperty('--ul2-margin-left', mLeftU2);
    } else if (setVal) {
        ul.style.setProperty('--ul1-margin-left', mLeftU1);
        ul.style.setProperty('--ul2-margin-left', mLeftU2);
    }

    replaceElementByNewTag(fontBlock, 'div')
}
import {addpTagInBlockTexts} from './utils/addtags.js'
import {renderImagleBlocks, renderFloatCodeBlocks, renderTables, renderLists} from './utils/renders.js'
import {addCodeBlocksCSS} from './functions/add_code_css.js'
import {addCyTags} from './functions/font.js'
import {addBlockquoteClass} from './functions/add_blockquote_class.js'
import { replaceElementByNewTag } from './utils/block.js'


// cover class name on md content
var topBlock = document.getElementsByTagName('article')[0];
topBlock.className += " generalcy";

/* render elements according to parameters in <font> elements */
let htmlFontBlocks = topBlock.getElementsByTagName('font');
let fontBlocks = []
for (let i = 0; i < htmlFontBlocks.length; ++i) {
    fontBlocks.push(htmlFontBlocks[i])
}

for (let i = 0; i < fontBlocks.length; ++i) {
    let className = fontBlocks[i].getAttribute('class')
    if (!className)
        continue;
    let funcParams = className.split('_');
    let funcType = funcParams[0].split('%')[0];

    if (funcType == 'c') {
        renderFloatCodeBlocks(fontBlocks[i], funcParams);
    }
    else if (funcType == 'i') {
        renderImagleBlocks(fontBlocks[i], funcParams);
    }
    else if (funcType == 't') {
        renderTables(fontBlocks[i], funcParams);
    }
    else if (funcType == 'u') {
        renderLists(fontBlocks[i], funcParams);
    }
    else if (funcType == 'ps') {
        let mLeft = '0';
        if (funcParams.length >= 2)
            mLeft = funcParams[1];
        renderFloatCodeBlocks(fontBlocks[i], ['c%wcode', 'l',  'a%0%0', 'b%' + mLeft + '&0']);
    }
}

/* add waveline tag */
let htmlWaveBlocks = topBlock.getElementsByTagName('wave');
let waveBlocks = [];
for (let i = 0; i < htmlWaveBlocks.length; ++i) {
    waveBlocks.push(htmlWaveBlocks[i]);
    console.log(htmlWaveBlocks[i].childNodes)
}

for (let i = 0; i < waveBlocks.length; ++i) {
    var newWaveTag = replaceElementByNewTag(waveBlocks[i], "u");
    newWaveTag.className = "waveLine";
}

/* add <p> tags */
addpTagInBlockTexts(document.getElementsByClassName('floatpic'));
addpTagInBlockTexts(document.getElementsByTagName('blockquote'));

addBlockquoteClass(document.getElementsByTagName('blockquote'));

/* add css of code blocks dynamicly */
addCodeBlocksCSS();

/* add <cy> tags by regexp */
addCyTags(topBlock);

// removeInvalidFontBlock()

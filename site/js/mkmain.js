import {addpTagInBlockTexts} from './utils/addtags.js'
import {renderImagleBlocks, renderFloatCodeBlocks, renderTables, removeInvalidFontBlock} from './utils/renders.js'
import {addCodeBlocksCSS} from './functions/add_code_css.js'
import {addCyTags} from './functions/font.js'


// cover class name on md content
var topBlock = document.getElementsByTagName('article')[0];
topBlock.className += " generalcy";


/* render elements according to parameters in <font> elements */
let fontBlocks = topBlock.getElementsByTagName('font');
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
}

/* add <p> tags */
addpTagInBlockTexts(document.getElementsByClassName('floatpic'));
addpTagInBlockTexts(document.getElementsByTagName('blockquote'));

/* add css of code blocks dynamicly */
addCodeBlocksCSS();

/* add <cy> tags by regexp */
addCyTags(topBlock);

// removeInvalidFontBlock()

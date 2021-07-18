import {addTag} from '../utils/addtags.js'

export function addCyTags(startBlock) {
    let destTags = []
    let ptag = startBlock.getElementsByTagName('p')
    let litag = startBlock.getElementsByTagName('li')
    let tabletdtag = startBlock.getElementsByTagName('table')
    destTags.push(ptag)
    destTags.push(litag)
    for (let i = 0; i < tabletdtag.length; ++i) {
        destTags.push(tabletdtag[i].getElementsByTagName('td'))
    }
    for (let ti = 0; ti < destTags.length; ++ti) {
        for (let i = 0; i < destTags[ti].length; ++i) {
            if (!destTags[ti][i])
                continue;
            let str = destTags[ti][i].innerHTML;
            let pattern = new RegExp("(([a-zA-Z0-9])([a-zA-Z0-9]|\\s|\\n)*)|<[a-zA-Z0-9]\\s*[^>]*>(.|\\n)*</[a-zA-Z0-9]*>|((\\$((.|\n)+?)\\$))|(\\$\\$((.|\n)+?)\\$\\$)|<br>|<br/>|<img.*>|<link.*>","g");
            let result;
            let nstr = str;
            let offset = 0
            let head = "<cy>", tail = "</cy>"
            while ((result = pattern.exec(str)) != null)  {
                if (result[0].substring(0, 1) == '<' || result[0].substring(0, 1) == '$')
                    continue;
                let idx = result.index, len = result[0].length;
                let start = idx + offset;
                nstr = addTag(nstr, start, len, head, tail);
                offset += (head.length + tail.length);
            }
            destTags[ti][i].innerHTML = nstr;
            //     console.log(nstr);
        }
    }
}
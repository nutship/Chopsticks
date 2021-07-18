export function addpTagInBlockTexts(blocks) {
    for (let i = 0; i < blocks.length; ++i) {
        let children = blocks[i].childNodes;
        for (let j = 0; j < children.length; ++j) {
            var child = children[j];
            if (child.nodeName == '#text') {
                let dtext = child.wholeText;
                if (dtext.length == 1 && dtext == '\n') {
                    continue;
                }
                var newp = document.createElement("p");
                newp.innerHTML = dtext;
                blocks[i].replaceChild(newp, child);
            }
        }
    }
}

export function addTag(str, start, len, head, tail) {
    return str.substr(0, start) + head + str.substr(start, len) + tail + str.substr(start + len)
}
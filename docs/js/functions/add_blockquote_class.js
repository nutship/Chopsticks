export function addBlockquoteClass(blocks) {
    let className = 'ktb';
    for (let i = 0; i < blocks.length; ++i) {
        let hasKtb = blocks[i].getElementsByTagName('ktb').length == 1;
        if (hasKtb) {
            blocks[i].setAttribute('class', className);
        }
    }
}
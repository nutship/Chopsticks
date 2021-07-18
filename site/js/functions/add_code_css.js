import {detectOS} from '../utils/detos.js'
import {addCssRule} from '../utils/block.js'

export function addCodeBlocksCSS() {
    let os = detectOS()
    console.log(os)
    if (os.indexOf('Win') == 0)
    {
        addCssRule('.generalcy .linenodiv', 'margin-left: -0.200rem;');
        // line number column
        addCssRule('.generalcy div.linenodiv pre', 'font-family: Consolas; \
                                                    font-size: 0.678rem;        \
                                                    line-height: 0.989rem;          \
                                                    margin-bottom: -0.5rem;       \
                '
        );
        // code block
        addCssRule('.generalcy .highlight code', 'font-family: Consolas; \
                                                    font-size: 0.678rem;        \
                                                    line-height: 0.989rem;          \
                '
        );
        // comment
        addCssRule('.generalcy .highlight .c1, .generalcy .highlight .cm, .generalcy .highlight .sd, .generalcy .highlight .ch, .generalcy .highlight .cs', 
                                                    'color: #9991c4; \
                                                    font-family: Consolas-inside;  \
                                                    font-size: 0.662rem;          \
                                                    font-style: italic; \
                                                    line-height: 0.1rem; \
                '
        );
        // inline code
        addCssRule('.md-typeset p code, .md-typeset li code', 'font-family: Consolas; ')
        // text shadow
        addCssRule('.generalcy', 'text-shadow:0 0 1.5px #ccc !important;')
    }
    else
    {
        addCssRule('.generalcy .linenodiv', 'margin-left: -0.200rem;');
        addCssRule('.generalcy div.linenodiv pre', 'font-family: Monaco-inside; \
                                                    font-size: 0.588rem;        \
                                                    line-height: 1.15rem;          \
                                                    margin-bottom: -0.5rem;       \
                '
        );
        addCssRule('.generalcy .highlight code', 'font-family: Monaco-inside; \
                                                    font-size: 0.588rem;        \
                                                    line-height: 1.15rem;          \
                '
        );
        addCssRule('.generalcy .highlight .c1, .generalcy .highlight .cm, .generalcy .highlight .sd, .generalcy .highlight .ch, .generalcy .highlight .cs', 
                                                    'color: #9991c4; \
                                                    font-family: Consolas-inside;  \
                                                    font-size: 0.661rem;          \
                                                    font-style: italic; \
                                                    line-height: 0.1rem; \
                '
        );
        // inline code
        addCssRule('.md-typeset .generalcy p code, .md-typeset .generalcy li code', 'font-family: Monaco-inside; font-size: 0.596rem;')
    }
}

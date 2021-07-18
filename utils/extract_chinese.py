import os
import re
import sys
from fontTools import subset

def extract_chinese_from_file(file_name):
    f = open(file_name, encoding='utf-8')
    content = f.read()
    f.close()
    return set(re.findall(r'[\u4e00-\u9fa5]', content))
    
def get_file(base_dir):
    for root, ds, fs in os.walk(base_dir):
        for file in fs:
            if file.endswith('.md'):
                fullname = os.path.join(root, file)
                yield fullname

def get_charaters_set(base_dir):
    chars = set()
    for file in get_file(base_dir):
        chars.update(extract_chinese_from_file(file))
    return chars
    
def subset_font(src, dst, text, flavor=None):
    options = subset.Options()
    font = subset.load_font(src, options) 
    if flavor is not None:
        options.flavor = flavor
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    subset.save_font(font, dst, options)


print('-' * 60)
zh_chars = ''.join(get_charaters_set('./docs'))
source_file = './utils/source-siyuan.ttf'
output_file_name = 'sourcehan-pure'
output_path = './docs/css/site-fonts/sourcehan/normal/'


subset_font(source_file, output_path + output_file_name + '.ttf', zh_chars)
subset_font(source_file, output_path + output_file_name + '.woff', zh_chars, flavor='woff')
# subset_font(source_file, output_path + output_file_name + '.woff2', zh_chars, flavor='woff2')
print('Total %d chinese characters' % len(zh_chars))
print('-' * 60)

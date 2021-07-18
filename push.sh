#!/bin/sh

set -e

check=`python -c "
try:
	import fontTools
	print(True)
except ImportError:
	print(False)
"`

if [ "$check" = "False" ]; then
	echo ">>> pip install fonttools"
	pip install fonttools
fi

msg="commit notes"

if [ "$1" != "" ]; then
	msg=$1
fi

echo ""
echo ">>> extracting font ..."
python ./utils/extract_chinese.py

echo ""
echo ">>> git add -f *"
git add -f \*

echo ""
echo ">>> git commit -m \"$msg\""
git commit -m "$msg"

echo ""
echo ">>> git push origin source"
git push origin source

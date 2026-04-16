#!/usr/bin/env bash
# 从 luzhenhua.cn 获取 NCE 课程数据
# 用法: fetch-nce.sh <lesson_number>
# 示例: fetch-nce.sh 25

LESSON_NUM=${1:?"用法: fetch-nce.sh <lesson_number>"}

source ~/.zshrc 2>/dev/null; proxy-on

PADDED=$(printf "%03d" "$LESSON_NUM")
NEXT_PADDED=$(printf "%03d" $((LESSON_NUM + 1)))
PAIR="${PADDED}&${NEXT_PADDED}"
INDEX=$(( (LESSON_NUM - 1) / 2 ))

# 获取 search_index.json 中的课文内容
CONTENT=$(curl -s 'https://nce.luzhenhua.cn/static/search_index.json' | python3 -c "
import json, sys

data = json.load(sys.stdin)
lesson_num = ${LESSON_NUM}
pair = '${PAIR}'

for item in data:
    if item.get('b') == 'NCE1' and item['l'].startswith(pair):
        c = item['c']
        # 索引 3 = Question
        print('QUESTION:', c[3][1])
        # 索引 4+ = 正文
        for entry in c[4:]:
            print('EN:', entry[1])
            print('CN:', entry[2])
        break
")

# 获取 data.json 中的 filename 和 title
META=$(curl -s 'https://nce.luzhenhua.cn/static/data.json' | python3 -c "
import json, sys

data = json.load(sys.stdin)
entry = data['1'][${INDEX}]
print('TITLE:', entry['title'])
print('FILENAME:', entry['filename'])
")

echo "=== META ==="
echo "$META"
echo ""
echo "=== CONTENT ==="
echo "$CONTENT"

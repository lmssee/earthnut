#!/bin/bash


# 定义一个数组，传入的参数必须是其中之一
array=("cjs" "mjs" "umd")
# 判断是否为其中的值
found=0

# 执行打包
build() {
  npx webpack --config webpack.config.$1.js  
}

test_param() {
  local found=false
  for element in "${array[@]}"; do 
    if [ "$element" = "$1" ]; then
       found=true
       break
    fi  
  done

  if [ $found = true ]; then 
      # echo "$1 是正确的参数"
      build "$1";
   else
      echo "参数必须是下列参数之一"
      echo 
      echo "${array[@]}"
      echo 
      echo "而 $1 错误的参数"
      exit 1
  fi
}

npx ixxx rm dist 

 

# 校验参数
# for param in "$@"; do 
#   test_param "$param"
# done

for element in "${array[@]}"; do 
  echo "------ ${element} start -----"
  build "$element"
  echo "------ ${element}  over-----"
  sleep 1
done

 

npx tsc -p tsconfig.build.json 

 

npx  sass --no-source-map \
        src/css/common.scss \
        dist/styles/common.css
 
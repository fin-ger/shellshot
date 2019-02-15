#! /bin/sh

i=1
while [ "$i" -le "$1" ]; do
    read -r line
    echo line: "$line"

    i=$(( i + 1 ))
done

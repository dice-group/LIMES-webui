# replace locahost URL in index with env var
sed -i -- 's@http://localhost:8080@'"$LIMES_URL"'@g' /usr/share/nginx/html/index.html
# start nginx
nginx -g 'daemon off;'

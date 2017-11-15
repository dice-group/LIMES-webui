FROM nginx:latest

# copy files
COPY . /usr/share/nginx/html

# set default limes url
ENV LIMES_URL=http://localhost:8080

# start command that replaces LIMES url with env var and starts server
CMD /usr/share/nginx/html/start.sh

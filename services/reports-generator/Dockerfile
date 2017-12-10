FROM node:latest

# set /var/www directory as default working directory
WORKDIR /var/www
# copy package.json
COPY package.json /var/www/
# Install app dependencies
RUN npm install
# Copy app source
COPY . /var/www/
# expose port 3001
EXPOSE  3001

# start app
CMD ["npm", "start"]
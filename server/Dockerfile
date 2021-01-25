# Use a lighter version of Node as a parent image
FROM node:latest
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /be
# Set the working directory to /be
WORKDIR /be
# copy package.json into the container at /be
COPY package*.json /be/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /be
COPY . /be/
# Make port 80 available to the world outside this container
EXPOSE 3001
# Run the app when the container launches
CMD ["node", "app.js"]
# Use a lighter version of Node as a parent image
FROM node:latest
#Creating a new directory for app files and setting path in the container
RUN mkdir -p /fe
# Set the working directory to /fe
WORKDIR /fe
# copy package.json into the container at /fe
COPY package*.json /fe/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /fe
COPY . /fe/
# Make port 3000 available to the world outside this container
EXPOSE 3000
# Run the app when the container launches
CMD ["npm", "start"]
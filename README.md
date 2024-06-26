# Spotter 🌐

This project is a web application, that offers gui and other functionalities to interact with the server model found on: https://github.com/StackUnderflowProject/API

## Getting started 📋

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Download Node.js & npm (if you haven't yet)

1. Go to: https://nodejs.org/en/download/prebuilt-installer
2. Then proceed to select a version of Node.js, we use v20.12.2 but any later stable version should work aswell.
3. Select your operating system and your cpu architecture (most common in nowadays computers is x64).
4. Click on download button and your download should start
5. After successful download you should be prompted by your program installer and just follow his recommended steps.

to check if the Node.js is successfully configured on your device you can open terminal and write `node --version`, if correctly configured it should respond with your current node version.

npm is already included with Node.js

### Clone the project's reposiratory

1. Open terminal and move to the location of the directory you want this project to be accessed from, for example this step could look like this:  
   `cd "C:\\Users\User\Documents"` (for Windows)  
   `cd ~/Documents` (for Linux/MacOS)
2. Then clone this project, with command:  
   `git clone "https://github.com/StackUnderflowProject/WebApp.git"` (if git isn't recognized you should install git first)

### Install all of the required dependencies

1. Move into the directory of your local copy of the project:
   `cd API`
2. Install the dependencies (this step should take some time):
   `npm install`

## How to run the web application? 🤔

To start the web application on localhost is pretty staightforward, move into the directory of your local copy of the project and simply run this command:
`npm run dev`  
if the command fails make sure that nothing is running on port 5000, since the web application wants to run on this port

## Usage 💡

The web application, once running, is accessible on the address: http://localhost:5000

The development was set up by the standard **React** guidelines, additionaly using **TypeScript** and **TailwindCSS**.

---

_This project started in May, 2024 by Tadej Teršek, Matija Pajenk and David Lipavec._

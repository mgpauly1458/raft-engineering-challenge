# Trip Dinner Planner
Hosted at [https://tripdinnerplanner.food](https://tripdinnerplanner.food/) and ready for use!
---

## Table of Contents

1.  [Personal Notes](#personal-notes)
2.  [Introduction](#introduction)
3.  [Demo Videos](#demo-videos)
4.  [Local Setup](#local-setup)
    * [Prerequisites](#prerequisites)
    * [Getting Started](#getting-started)
5.  [Design Notes](#design-notes)

---

## Personal Notes

This was a lot of fun to build. It is a guilty pleasure of mine to have an excuse to put my head down and code-non stop for hours and hours. I heavily used AI to build this app: Gemini, ChatGPT, and Github-copilot. AI is so empowering in 2025! I'll share my conversations I had with ChatGPT [here](https://chatgpt.com/share/689355de-3acc-8002-a23b-db8677f3b55c) and Gemini [here](https://g.co/gemini/share/595f5a6c338c) if it is of interest to anyone. 

I bought a domain on namecheap for $5. I provisioned a SQL database for $0.01/hour in google cloud platform, and deployed the app to Google Cloud Run (which runs even cheaper than the SQL db).

I thought up my own idea for an app and didn't use the prompt options. I covered all the requirements and bonuses from the [challenge](https://gist.github.com/omnipresent07/a8fe14bc158e06a1951bc67e936450fd) I used React, Material UI, Express, PostgreSQL, Websockets, and docker compose for infra setup. I interface an LLM in two ways: streamed output for the user to see, and use it to synthesize unstructured data, and produce pins on a dynamic map UI component. I hosted the app and made some feature walkthrough videos. With that being said if theres something missing you folks wanted to see please don't hesitate to let me know.

## Introduction

The **Trip Dinner Planner** is a web application designed to simplify the process of planning dinners for vacations/work trips. Users specify the city they're traveling to, their approximate budget, the number of days they'll stay, and their basic food preferences. An LLM (OpenAI GPT4) takes this information then makes a list of recommendations which are visulalized on a map. The LLM also gives an additional recommendation for fun things to do in the nearby area, allowing users to quickly iterate on the many possibilities for how their trip evenings can play out.

---

## Demo Videos

Check out these short videos to see the Trip Dinner Planner in action!

### *Creating a Trip*
This involves filling out and submitting a form that captures your trip information, then viewing the resulting resturaunts in a table and on a map, which zooms into the city you're traveling to and has several pins indicating the location of the recommended resturaunts.

https://github.com/user-attachments/assets/486a5613-0ed4-4636-8f4f-c7a975db43ca

### *Event Recommendation*
When the trip is created, the LLM is automatically prompted to give recommendations for "fun things to do in the nearby area". This output is streamed to users in a chat box next to the map.

https://github.com/user-attachments/assets/44699235-ab62-4d66-96b8-e470902647ca

### *Multiple Users*
The first name field of the user model is unique and is the only thing required to authenticate a user during a login. Each user can have one trip saved to their account. Upon login, their trip data is restored to the UI, displaying their recommended restaurants and map pins. In this video I go back and forth from Maxwell's account (Waikiki) and Chris's account (Tokyo).

https://github.com/user-attachments/assets/294acfa1-03bd-43ef-b391-77c24bb566a4

## Local Setup

### Prerequisites

You'll need:

- Docker installed
- Ports 8080, 8081 free for use.
- the provided docker-compose.yml file
- an OpenAI API key

### Getting Started
1.  **Clone the Repository:**

2.  **Copy the docker-compose.yml in the backend dir**
Place the docker-compose.yml file in the root of the cloned repo. Then move it to the backend/docker-compose.yml directory.
    ```bash
    mv docker-compose.yml backend/docker-compose.yml
    ```

3.  **Add your OpenAI API key to docker-compose.yml file**
There are two locatoins you must add the key:
- services.backend.environment
- services.web_socket.environment

You will see 'OPENAI_API_KEY=', add the key right after the '='.

4. **Build and run the containers**
The docker-compose.yml file specifies all the containers required to run the app:
- backend (express server)
- db (postgres)
- web_socket (node websocket server)
    ```bash
    cd ./backend
    sudo docker compose up --build
    ```
5. **View app in browser**

At this point the app should be visible in your browser at [http://localhost:8080](http://localhost:8080)
---

## Design Notes

### Frameworks / Services
- Frontend
  - Material UI
  - React
  - Leaflet (Map)
- Backend
  - Express
  - OpenAI API
  - SQL (Postgres)
    - Sequelize (ORM)
  - Node Websocket (ws)
- Deployment & CI/CD
  - Docker
  - Google Cloud Platform (Cloud Run)
  - Namecheap (domain registrar)
- Debugging / Testing
  - Postman (backend)
  - Chrome developer tools (frontend)
  - Google Cloud Run logs (deployment)

### Architecture

#### Frontend
The frontend was build with Create React App (CRA), and Material UI for styling and components. The react components follow this basic structure:
- Index.js
- App.js
- DinnerPlanner.js (which is the main page)
On the main page there is a side bar and a map which are placed next to eachother. The map just contains the Laflet map UI. The side bar contains the rest of the functionality in the app.

The frontend bundle is compiled and placed in the backend/public directory, which is served by express.

#### Backend
The backend has three main services:
1. Web Server
Necessary for serving the frontend, and handling all backend API calls and handling database initialization and CRUD. This server is also responsible for making the OpenAI API calls when the trip is being created.
2. Web Socket Server
The only job of the web socket server is to stream the "recommended event" chat from GPT4 after a trip is created. This had to be its own container and service in the cloud because GCP follows a strict one port per service rule. The web server needed its port to handle web traffic, so the web socket needed to be its own service and container.
3. PostgreSQL Database
This was instantiated on GCP and connected to the app through environment variable credentials passed to the Sequelize ORM in the express server.

#### Deployment / CI/CD
This is perhaps the most satisfying part of the application. Google Cloud run has direct access to your github repo through the github API (authenticated through OAuth on GCP). A trigger and build process is automatically created when you create a Cloud Run service, which is designed to pull the repo, build, and deploy the application with extremely minimal configuration. All I did was create the service, loginto Github on Google Cloud Run, show it what repo I'm using for this project, show it where the Dockerfile is, and it handles the rest. This build process is automatically triggered anytime 'main' is pushed to on the repo, streamlining CI/CD.

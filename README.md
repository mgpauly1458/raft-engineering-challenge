# Park Search
Hosted at [[https://tripdinnerplanner.food](https://raft-engineering-challenge-808421331184.us-west1.run.app/)]([https://tripdinnerplanner.food/](https://raft-engineering-challenge-808421331184.us-west1.run.app/)) and ready for use!

## Table of Contents

1.  [Personal Notes](#personal-notes)
2.  [Introduction](#introduction)
3.  [Demo Videos](#demo-videos)
4.  [Local Setup](#local-setup)
    * [Prerequisites](#prerequisites)
    * [Getting Started](#getting-started)
5.  [Design Notes](#design-notes)

---

## Introduction

Park Search is an application that helps users find the best parks in Hawaii, based on the [park amenities](https://honolulu-cchnl.opendata.arcgis.com/datasets/cchnl::park-amenities/about) public dataset. Ask an LLM to interpret this data and your request and display the best parks on a map.

---

## Demo Videos

This video shows a user querying for "the closest 3 parks to 'Pearl City District Park', that have the Basketball amenity". The user then refines the result by querying "add the closest park to 'Kapolei' (city on Oahu) that has Baseball". After the second query is made an additional park icon pops up which has the baseball amenity.

*NOTE: Through testing, GPT 5 was the best performing model, but is slow. Queries take on average 30s to 1m, so please be patient.*

https://github.com/user-attachments/assets/2847c6cf-e3d2-43cf-97fa-d8e94696ad62

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

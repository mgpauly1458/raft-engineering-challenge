# Park Search
Hosted at [https://raft-engineering-challenge-808421331184.us-west1.run.app/](https://raft-engineering-challenge-808421331184.us-west1.run.app/)

## Table of Contents

1.  [Introduction](#introduction)
2.  [Demo Videos](#demo-videos)
3.  [Local Setup](#local-setup)
    * [Prerequisites](#prerequisites)
    * [Getting Started](#getting-started)
4.  [Design Notes](#design-notes)

---

## Introduction

Park Search is an application that helps users find the best parks in Hawaii, based on the [park amenities](https://honolulu-cchnl.opendata.arcgis.com/datasets/cchnl::park-amenities/about) public dataset. Ask an LLM to interpret this data and your request and display the best parks on a map.

### Usage
Go to the app and view the parks in the map. Type into the search bar what combinations of features, locations, or names of the parks you want to see. Your chat history will be persistently saved and displayed next to the map (and is sent to the LLM after each query, so feel free to reference your previous chats).

Example Queries from the demo video:

"Remove all the parks that have Basketball"

"Show the closest 3 parks to 'Pearl City District Park'"

"Add the closest park to Kapolei that has Baseball"

*Note* The LLM looks for the words 'Remove' and 'Add' in your queries, due to how the prompt was engineered. This is not necessary to successfully use the app, but testing showed this trick does improve performance.

*Note* Due to the persistent storage and global app state through SQL, only one person should use the deployed app at a time.

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
- Debugging / Testing
  - Postman (backend)
  - Chrome developer tools (frontend)
  - Google Cloud Run logs (deployment)

### Data Processing
The data was downloaded from the [park amenities](https://honolulu-cchnl.opendata.arcgis.com/datasets/cchnl::park-amenities/about) dataset. It was cleaned, and reformatted to json using Python. The data was then added to a SQL table when the app is initialized. This data set is small enough where this was a feasible option. The SQL dataset is the main source of truth for this app.

### Backend
The backend has three main services:
1. Web Server
2. Web Socket Server (for streaming LLM chat completions)
3. PostgreSQL Database

### LLM Chat Context Processing / Persistent Storage
This app works a lot like ChatGPT, where the user has a chat box with the LLM and can interact back and forth with persistent storage of conversations. The 'Reset' button clears the frontend and backend and resets everything.

#### Deployment / CI/CD
This is perhaps the most satisfying part of the application. Google Cloud run has direct access to your github repo through the github API (authenticated through OAuth on GCP). A trigger and build process is automatically created when you create a Cloud Run service, which is designed to pull the repo, build, and deploy the application with extremely minimal configuration. All I did was create the service, loginto Github on Google Cloud Run, show it what repo I'm using for this project, show it where the Dockerfile is, and it handles the rest. This build process is automatically triggered anytime 'main' is pushed to on the repo, streamlining CI/CD.

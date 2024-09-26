# Assessment project

## Project setup

Move into the web folder for the Vue and run :
```
npm install
```

When that is done go into the server folder and run it again: 
```
npm install
```
Now both Node and Vue should have the node packages installed that are needed for the app.

### Compose

Make sure you are in the root folder. Then run: 
```
docker-compose up --build
```
This creates a container for both the Vue `PORT: 8081` and a container for the Node `PORT: 3000`

### Postman logs
Both api tests are inside the folder "postman collection". These check the incoming data if it contains all the values we need in the application. And checks the data types.
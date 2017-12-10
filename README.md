### Tech scope:

* Microservice Architecture, [http://microservices.io/patterns/microservices.html](http://microservices.io/patterns/microservices.html)
* JWS, [https://medium.facilelogin.com/jwt-jws-and-jwe-for-not-so-dummies-b63310d201a3](https://medium.facilelogin.com/jwt-jws-and-jwe-for-not-so-dummies-b63310d201a3)
* Docker
* ES6, Node 9.2
* ExpressJS
* Redis
* REST

# Installation

## 1. Clone git repository

    ```bash
    $ git clone git@github.com:konstantin-valuev/microservices-test.git
    ```

## 2. Install Docker Compose

    ```bash
    $ sudo -i
    $ curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
    $ chmod +x /usr/local/bin/docker-compose
    $ docker-compose --version
    ```

## 3. Build/run containers

    ```bash
    $ cd <PROJECT DIRECTORY>
    $ docker-compose build
    $ docker-compose up -d
    ```

* `api-gateway`: API Gateway Node microservice container.
* `redis`: Redis container.
* `reports-generator`: Node microservice for reports generation container.

This results in the following running containers:

```bash
$ docker-compose ps
      Name                     Command               State           Ports         
-----------------------------------------------------------------------------------
api-gateway         npm start                        Up      0.0.0.0:3000->3000/tcp
redis               docker-entrypoint.sh redis ...   Up      0.0.0.0:6379->6379/tcp
reports-generator   npm start                        Up      0.0.0.0:3001->3001/tcp
  
```

```bash
# bash commands
# Stop all containers
$ docker-compose down

# Get info about container
$ docker inspect api-gateway

# Delete all containers
$ docker rm $(docker ps -aq)

# Delete all images
$ docker rmi $(docker images -q)
```

# Test Application

## 1. Authorization

* POST /login `(mock data: login: admin, pass: admin)` to API Gateway http://localhost:3000.

```bash
# Error
$ curl -H "Content-Type: application/json" -X POST http://localhost:3000/login
# Error
$ curl -H "Content-Type: application/json" -X POST -d '{"login":"admin1", "pass": "admin"}' http://localhost:3000/login
# Ok
$ curl -H "Content-Type: application/json" -X POST -d '{"login":"admin", "pass": "admin"}' http://localhost:3000/login
```

## 2. Generate report

* POST /generate, (header: Authorization: JWS, data: { from, to, format }) to API Gateway http://localhost:3000.
* route POST /generate is protected for non-authorized users
* from, to - YYYY-MM-DD
* format - pdf, csv, xls

```bash
# Error
$ curl -H "Content-Type: application/json" -X POST http://localhost:3000/generate
# Error
$ curl -H "Content-Type: application/json" -H "Authorization: Bearer any_wrong_or_expired_token" -X POST http://localhost:3000/generate
# Ok for Authorization (use token from POST /login), Error for data
$ curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTI4NTg3MTZ9.YdGrrGuXwsa3pUkNywaiydH6tYnx8BI6yw-D-ZtemH0" -X POST http://localhost:3000/generate
# Ok
$ curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTI4NTg3MTZ9.YdGrrGuXwsa3pUkNywaiydH6tYnx8BI6yw-D-ZtemH0" -X POST -d '{"from":"2017-12-07", "to": "2017-12-31", "format": "pdf"}' http://localhost:3000/generate
```

## 3. Test microservices

- API Gateway sends task to the 'tasks' queue (rabbitmq or redis) and listens to 'completed_tasks' queue
- When task is done the Microservice of reports generation sends response about completion to 'completed_tasks' queue
- API Gateway gets event from 'completed_tasks' and outputs to the console the status of task

1. Open new terminal window to see `api-gateway` microservice logs:
```bash
$ docker attach api-gateway
```

2. Open new terminal window to see `reports-generator` microservice logs:
```bash
$ docker attach reports-generator
```

3. Send request to see tasks logs:
```bash
# report with format 'csv' and 'xls' will have status 'failed' (just for testing)
$ curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTI4NTg3MTZ9.YdGrrGuXwsa3pUkNywaiydH6tYnx8BI6yw-D-ZtemH0" -X POST -d '{"from":"2017-12-07", "to": "2017-12-31", "format": "csv"}' http://localhost:3000/generate
# 'pdf' will be 'completed'
$ curl -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTI4NTg3MTZ9.YdGrrGuXwsa3pUkNywaiydH6tYnx8BI6yw-D-ZtemH0" -X POST -d '{"from":"2017-12-07", "to": "2017-12-31", "format": "pdf"}' http://localhost:3000/generate
```

4. Result:
- api-gateway
```bash
Job 5 saved to the tasks queue.
POST /generate 200 41.365 ms - 45
Completed job task is 6, job task is 5
Report csv from 2017-12-07T00:00:00.000Z to 2017-12-31T00:00:00.000Z generation status is failed
Job 7 saved to the tasks queue.
POST /generate 200 3.805 ms - 45
Completed job task is 8, job task is 7
Report pdf from 2017-12-07T00:00:00.000Z to 2017-12-31T00:00:00.000Z generation status is completed
```

- reports-generator
```bash
Generate csv report from 2017-12-07T00:00:00.000Z to 2017-12-31T00:00:00.000Z
Job 6 saved to the completed_tasks queue.
Generate pdf report from 2017-12-07T00:00:00.000Z to 2017-12-31T00:00:00.000Z
Job 8 saved to the completed_tasks queue.
```
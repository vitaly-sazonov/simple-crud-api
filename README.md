## **Simple CRUD API**

Http server which provides the ability to Create, Update, Read and Delete data in an in-memory database.

### **Command syntax**

```zsh
$ npm i
# installing dependencies

$ npm run start:dev
# starting the server in development mode

$ npm run start:prod
# starting the server in prodaction mode
```

_Now you can send requests to the server:_

- **GET /person or /person/`{personId}`**
  - 'personId' is of type uuid
- **POST /person `{name, age, hobbies}`**
  - body properties 'name', 'age', 'hobbies' required
  - example -> `{ name: 'Vasya', age: '20', hobbies: "['walk','fight','drink']" }`
- **PUT /person/`{personId}` `{name, age, hobbies}`**
  - updating data in the database according to the data from the request body
  - example -> `{ name: 'Vasya', age: '20', hobbies: "['only drink']" }`
- **DELETE/person/`{personId}`**
  - delete record from the database with `{personId}`

### **Command testing**

```zsh
# testing with detailed description
$ npm run test

# testing in development mode and watch for updates of test files
$ npm run test:dev
```

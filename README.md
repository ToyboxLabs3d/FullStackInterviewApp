This is a mini project that was similar to code we had for real in our server years ago. The purpose of this code is to keep track of when a printer is online, and send that information back to the user

Test project:
Please only spend a 2-3 hours on this. What ever you don't get to just make notes and be prepared to talk about it
Feel free to use whatever tools you have at your disposal.
This is broken down into two parts:

1. Implement a simple UI that lets us view all the printers that the user is allowed to view all the printers the have access to* and filter them based on if they are connected and when they were last online. *A user who is an admin has access to all printers, other users only have access to printers that they have in their printer_id field
2. This back end has been running two server, and was working fine, then Christmas day hit (our biggest usage day of the year) and our website completely crashed. We think it's related to this code, please offer fixes

Note: For part 1, it's expected you only need to look at routes.ts and client.tsx

This project uses MongoDb

Common things you may want to do with a mongo collection:

```
// Find a single item in the collectoin
const cursor = UserPresenceServers.findOne({name: "Name to search"})

// Find the full list of items matching the query
const cursor = UserPresenceServers.find({name: "Name to search"}).fetch()

// Remove an item from the collections
const cursor = UserPresenceServers.remove({name: "Name to search"})

// Update an item from the collections
const cursor = UserPresenceServers.remove({_id: "id to search"}, {$set: {online: true}})
```

Meteor.users contains a mongo instance of both our users and our printers
The typescript type is:

```
const type UserType = {
_id: string,
// Whether this is a printer or not
printer: boolean,
// Unique name for each user and printer
name:string,
// Not relevant for this project
authentication: ...
// The user that owns this printer
owner?:string,
// Whether the user is an admin
isAdmin?: boolean,
presence:{
    updatedAt: Date,
    // The server the printer is connected to
    serverId:string,
    clientAddress: string,
    httpHeader: Record<string, string>,
    status: 'online'|'offline'
  }
// Printers this user owns
 printer_ids?: string[]
}

```

In routes.ts we have the basic routes setup to show how it can be done. This can be adjusted if you want different params or data returned.

If you want to run this you can use node (node and node-ts)
AN example package.json file follows

```
{
  "name": "backend",
  "version": "1.0.0",
  "description": "A simple backend with Express and in-memory MongoDB server",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "backend",
    "express",
    "mongodb"
  ],
  "author": "Your Name",
  "license": "ISC",
  "dependencies": {
    "react":"*",
    "react-dom":"*"
    "express": "^4.17.1",
    "mongodb-memory-server-core": "^10.1.0"
  }
}
```

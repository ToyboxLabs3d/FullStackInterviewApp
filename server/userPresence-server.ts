// File taken from https://github.com/dan335/meteor-user-presence/blob/master/userPresence.js
// serverId - unique per server per restart
// This file is run on every server instance on boot
// You don't need to understand this file, but it shows how we at one point had been keeping the printer online status
var serverId = Random.id();

// user connections
export const UserPresenceSessions = new Mongo.Collection("userpresencesessions");

// list of servers
export const UserPresenceServers = new Mongo.Collection("userpresenceservers");

UserPresenceServers._ensureIndex({ ping: 1 });
UserPresenceServers._ensureIndex({ serverId: 1 });
users._ensureIndex({ "presence.serverId": 1 });
UserPresenceSessions._ensureIndex({ userId: 1 });

// keep track of which servers are online
setInterval(function () {
  let find = { serverId: serverId };
  let modifier = { $set: { ping: new Date() } };
  UserPresenceServers.upsert(find, modifier);
}, 1000 * 30);

// remove old servers and sessions
// update status of users connected to that server
setInterval(function () {
  let cutoff = new Date();
  cutoff.setMinutes(new Date().getMinutes() - 5);
  UserPresenceServers.find({ ping: { $lt: cutoff } }).forEach(function (server) {
    UserPresenceServers.remove(server._id);
    UserPresenceSessions.remove({ serverId: server.serverId });
    users.find({ "presence.serverId": server.serverId }).forEach(function (user) {
      trackUserStatus(user._id);
    });
  });
}, 1000 * 10);

// track user connection and disconnection
// This function will run on the server automatically when each client starts, and each client will be given
// a unique connection.id
onClientConnected(function () {
  var self = this;

  if (self.userId && self.connection && self.connection.id) {
    userConnected(self.userId, self.connection);

    // on Stop is called when the client stops responding to ping requests or when they disconnect directly
    self.onDisconnected(function () {
      userDisconnected(self.userId, self.connection);
    });
  }

  self.ready();
});

var userConnected = function (userId, connection) {
  UserPresenceSessions.insert({
    serverId: serverId,
    userId: userId,
    connectionId: connection.id,
    createdAt: new Date()
  });
  trackUserStatus(userId, connection);
};

var userDisconnected = function (userId, connection) {
  UserPresenceSessions.remove({ userId: userId, connectionId: connection.id });
  trackUserStatus(userId, connection);
};

var trackUserStatus = function (userId, connection) {
  let presence = {
    updatedAt: new Date(),
    serverId: serverId
  };

  if (connection) {
    presence.clientAddress = connection.clientAddress;
    presence.httpHeaders = connection.httpHeaders;
  }

  let isOnline = UserPresenceSessions.find({ userId: userId }).count();

  if (isOnline) {
    presence.status = "online";
  } else {
    presence.status = "offline";
  }

  users.update(userId, { $set: { presence: presence } });
};

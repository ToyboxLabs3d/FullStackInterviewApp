import { MongoMemoryServer } from "mongodb-memory-server";

import express from "express";
import { MongoClient, type Collection } from "mongodb";
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
app.use(cors());
let db;

type UserType = {
  _id: string;
  // Whether this is a printer or not
  printer?: boolean;
  // Unique name for each user and printer
  name: string;
  // The user that owns this printer
  owner?: string;
  // Whether the user is an admin
  isAdmin?: boolean;
  presence: {
    updatedAt: Date;
    // The server the printer is connected to
    serverId: string;
    clientAddress?: string;
    httpHeader?: Record<string, string>;
    status: "online" | "offline";
  };
  // Printers this user owns
  printer_ids?: string[];
};

// Start an in-memory MongoDB server
const mongoServer = null;
export const Collections: {
  users: Collection<UserType> | null;
} = {
  users: null
};
// Connect to the MongoDB database
MongoMemoryServer.create()
  .then(async (mongoServer: MongoMemoryServer) => {
    const mongoUri = mongoServer.getUri();
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db();
    console.log("Connected to in-memory MongoDB server");

    // Example data: Printer information for different users
    const users: UserType[] = [
      {
        _id: "1",
        name: "User A",
        printer_ids: ["2"],
        presence: { updatedAt: new Date(), serverId: "1", status: "online" }
      },
      {
        _id: "2",
        owner: "1",
        name: "Printer A",
        printer: true,
        presence: { updatedAt: new Date(), serverId: "1", status: "online" }
      },
      { _id: "3", name: "User C", isAdmin: true, presence: { updatedAt: new Date(), serverId: "1", status: "online" } }
    ];
    // Populate the printers collection with example data
    Collections.users = db.collection("users");
    Collections.users.insertMany(users);
    console.log("Example printer data inserted into database");
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });

// Function to tell if a user is a printer or a normal printer
function userIsPrinter(user: UserType): boolean {
  return !!user.printer;
}

// Function to find all printers connected to this user
function findUserPrinters(user: UserType): Promise<UserType[]> {
  const options: {
    // Map of which fields to return
    // ex: {_id: 1, name:1} would make sure only _id and name are returned
    fields?: Record<string, 1>;
    // Map of which fields to sort by
    // ex: {name:1, _id:-1} would make sort the result by name, and then for any items that match would sort by _id in reverse order
    sort?: Record<string, 1 | -1>;
    // How many items to return
    limit?: number;
    // How many items to skip
    skip?: number;
  } = {};
  if (!Collections.users) {
    throw new Error("Invalid setup");
  }
  return Collections.users.find({ owner: user._id }, options).toArray();
}

function findUserById(id: string): Promise<UserType | null> {
  if (!Collections.users) {
    throw new Error("Invalid setup");
  }
  return Collections.users.findOne({ _id: id });
}

// Route to get printer information by user ID
app.get("/printer-information/:userId", (req: any, res: any) => {
  // For simplicity we assume the user is fully authenticated
  const userId = req.params.userId;
  res.json([{ name: "example" }]);
  res.status(200);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

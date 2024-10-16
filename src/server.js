import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import cron from "node-cron";
import moment from "moment";

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://yche0660:BXciq6582Uw0TimK@cluster0.64oyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("FIT2101"); // Change to your database name
    const collection = database.collection("primeproject");
    const sprintsCollection = database.collection("sprints");
    const usersCollection = database.collection("users");
    const timeCollection = database.collection("timesheets"); 

    // 1. Create (Insert) Data
    app.post("/createTask", async (req, res) => {
      try {
        // const data = req.body;
        const name = req.body.taskName;
        const priority = req.body.taskPriority;
        const tags = req.body.tags;
        const assignedto = req.body.taskAssignedto;
        const description = req.body.description;
        const status = req.body.taskStatus;
        const stage = req.body.taskStage;
        const size = req.body.taskSize;
        const type = req.body.taskType;
        const sprintStage = req.body.sprintStage;
        const sprint = req.body.sprint;

        const doc = {
          id: (await collection.countDocuments()) + 1,
          taskNumber: (await collection.countDocuments()) + 1,
          taskName: name,
          taskPriority: priority,
          tags: tags,
          taskAssignedto: assignedto,
          description: description,
          taskStatus: status,
          taskStage: stage,
          taskSize: size,
          createdAt: new Date(),
          taskType: type,
          sprintStage: sprintStage,
          sprint: sprint,
          totalTimeLogged: 0,
        };
        const result = await collection.insertOne(doc);
        res.status(201).send({ message: "Document inserted", result });
      } catch (error) {
        res.status(500).json({ message: "Error inserting document", error });
      }
    });

    app.post("/createSprint", async (req, res) => {
      try {
        const sprintName = req.body.sprintName;
        const sprintStartDate = new Date(req.body.sprintStartDate);
        const sprintEndDate = new Date(req.body.sprintEndDate);

        const sprintDoc = {
          sprintName,
          sprintStartDate,
          sprintEndDate,
          status: "Not Started", // Default status when sprint is created
          totalTimeLogged: 0, // Total time logged in hours
        };

        const result = await sprintsCollection.insertOne(sprintDoc);
        if (!result.insertedId) {
          console.log("Sprint creation failed");
        } else {
          console.log("Sprint created:", result.insertedId);
          res
            .status(201)
            .json({ message: "Sprint created", sprintId: result.insertedId });
        }
      } catch (error) {
        console.error("Error creating sprint:", error);
        res.status(500).json({ message: "Error creating sprint", error });
      }
    });

    app.post("/createUser", async (req, res) => {
      try {
        const username = req.body.username;
        const password = req.body.password;
        const userStatus = req.body.userStatus; // You can send this dynamically
        const totalTimeLogged = 0;
    
        const userDoc = {
          username,
          password,
          totalTimeLogged,
          userStatus,
        };
    
        const result = await usersCollection.insertOne(userDoc);
        if (!result.insertedId) {
          console.log("User creation failed");
        } else {
          console.log("User created:", result.insertedId);
          res.status(201).json({ message: "User created", userId: result.insertedId });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
      }
    });

    app.get("/readSprint", async (req, res) => {
      try {
        const documents = await sprintsCollection.find().toArray();
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error });
      }
    });

    app.put("/updateUserSecurity/:id", async (req, res) => {
      try {
        const userId = req.params.id; // Get the user ID from the route parameters
        const securityQuestionID = req.body.securityQuestionID; // Get the security question ID from the request body
        const securityAns = req.body.securityAns; // Get the security question answer from the request body
        const loginCount = req.body.loginCount; // Get the login count from the request body
        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $set: { securityQuestionID: securityQuestionID,
                    securityAns: securityAns,
                    loginCount: loginCount } }
            
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error });
      }
    });

    app.put("/updateSprint", async (req, res) => {
      try {
        const { _id, sprintName, sprintStartDate, sprintEndDate } = req.body;
        const updatedSprint = {
          sprintName,
          sprintStartDate: new Date(sprintStartDate),
          sprintEndDate: new Date(sprintEndDate),
        };

        const result = await sprintsCollection.updateOne(
          { _id: new ObjectId(_id) }, // Convert _id to ObjectId
          { $set: updatedSprint }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Sprint not found" });
        }

        res.status(200).json({ message: "Sprint updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Error updating sprint", error });
      }
    });

    // 2. Read (Get) Data
    app.get("/readTask", async (req, res) => {
      try {
        const documents = await collection.find().toArray();
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error });
      }
    });

    app.post("/createUser", async (req, res) => {
      try {
        const username = req.body.username;
        const password = req.body.password;
        const totalTimeLogged = 0;
        const securityQuestionID = "";
        const securityQuestionAns = "";
        const userStatus = req.body.userStatus;
        const userDoc = {
          username,
          password,
          totalTimeLogged,
          securityQuestionID,
          securityQuestionAns,
          userStatus,
        };

        const result = await usersCollection.insertOne(userDoc);
        if (!result.insertedId) {
          console.log("User creation failed");
        } else {
          console.log("User created:", result.insertedId);
          res
            .status(201)
            .json({ message: "User created", userId: result.insertedId });
        }
      } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
      }
    });

    app.get("/readUser", async (req, res) => {
      try {
        const documents = await usersCollection.find().toArray();
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error });
      }
    });

    // Route to force end a sprint by changing its status to "Completed" and updating the end date
    app.put("/forceEndSprint/:id", async (req, res) => {
      try {
        const sprintId = req.params.id; // Get the sprint ID from the route parameters
        const currentDate = new Date(); // Get the current date

        // Update the sprint status to "Completed" and set the sprintEndDate to the current date
        const result = await sprintsCollection.updateOne(
          { _id: new ObjectId(sprintId) },
          {
            $set: {
              status: "Completed", // Set status to "Completed"
              sprintEndDate: currentDate, // Update sprint end date to current date
            },
          }
        );

        // Check if the sprint was found and updated
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Sprint not found" });
        }

        console.log(`Sprint ${sprintId} successfully ended.`);
        res.status(200).json({ message: "Sprint ended successfully" });
      } catch (error) {
        console.error("Error ending sprint:", error);
        res.status(500).json({ message: "Error ending sprint", error });
      }
    });

    app.get("/readTime", async (req, res) => {
      try {
        const documents = await timeCollection.find().toArray();
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error });
      }
    });

    app.post("/logTime", async (req, res) => {
      try {
        const sprintId = req.body.sprintId; // Get the sprint ID from the request body
        const taskId = req.body.taskId; // Get the task ID from the request body
        const time = req.body.hours; // Get the time from the request body
        const userId = req.body.userId; // Get the team member ID from the request body
        const date = new Date(); // Get the current date

        const doc = {
          sprintId,
          taskId,
          userId,
          time,
          date,
        };

        const result = await timeCollection.insertOne(doc);
        res.status(201).json({ message: "Time logged", result });
      } catch (error) {
        res.status(500).json({ message: "Error logging time", error });
      }
    });

    // Route to log time for a task
    app.put("/updateSprintTime/:id", async (req, res) => {
      try {
        const sprintId = req.params.id; // Get the sprint ID from the route parameters
        const time = req.body.hours; // Get the time from the request body

        const result = await sprintsCollection.updateOne(
          { _id: new ObjectId(sprintId) },
          { $inc: { totalTimeLogged: time } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Sprint not found" });
        }

        res.status(200).json({ message: "Time logged", result });
      } catch (error) {
        res.status(500).json({ message: "Error logging time", error });
      }
    });

    app.put("/updateUserTime/:id", async (req, res) => {
      try {
        const userId = req.params.id; // Get the user ID from the route parameters
        const time = req.body.hours; // Get the time from the request body

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(userId) },
          { $inc: { totalTimeLogged: time } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Time logged", result });
      } catch (error) {
        res.status(500).json({ message: "Error logging time", error });
      }
    });

    app.put("/updateTaskTime/:id", async (req, res) => {
      try {
        const taskId = req.params.id; // Get the task ID from the route parameters
        const time = req.body.hours; // Get the time from the request body

        const result = await collection.updateOne(
          { _id: new ObjectId(taskId) },
          { $inc: { totalTimeLogged: time } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Time logged", result });
      } catch (error) {
        res.status(500).json({ message: "Error logging time", error });
      }
    });

    // app.put("/logTime", async (req, res) => {
    //   try {
    //     const sprintId = req.body.sprintId; // Get the sprint ID from the route parameters
    //     const taskId = req.body.taskId; // Get the task ID from the route parameters
    //     const time = req.body.hours; // Get the time from the request body
    //     const teamMemberId = req.body.teamMemberId; // Get the team member from the request body

    //     const result = await collection.updateOne(
    //       { _id: taskId },
    //       { $inc: { totalTimeLogged: time } }
    //     );

    //     const sprintResult = await sprintsCollection.updateOne(
    //       { _id: sprintId },
    //       { $inc: { totalTimeLogged : time } }
    //     );

    //     const userResult = await usersCollection.updateOne(
    //       { _id: teamMemberId },
    //       { $inc: { totalTimeLogged : time } }
    //     );

    //     if (result.matchedCount === 0) {
    //       return res.status(404).json({ message: "Document not found" });
    //     }

    //     if (sprintResult.matchedCount === 0) {
    //       return res.status(404).json({ message: "Sprint not found" });
    //     }

    //     if (userResult.matchedCount === 0) {
    //       return res.status(404).json({ message: "User not found" });
    //     }

    //     res.status(200).json({ message: "Time logged", result });
    //   } catch (error) {
    //     res.status(500).json({ message: "Error logging time", error });
    //   }
    // });

    // 3. Update Data
    app.put("/update/:id", async (req, res) => {
      try {
        const id = req.body.id;
        const name = req.body.taskName;
        const priority = req.body.taskPriority;
        const tags = req.body.tags;
        const assignedto = req.body.taskAssignedto;
        const description = req.body.description;
        const status = req.body.taskStatus;
        const stage = req.body.taskStage;
        const size = req.body.taskSize;
        const type = req.body.taskType;
        const sprintStage = req.body.sprintStage;
        const sprint = req.body.sprint;
        const totalTimeLogged = req.body.totalTimeLogged;
        const completionDate = req.body.completionDate;

        const doc = {
          taskName: name,
          taskPriority: priority,
          tags: tags,
          taskAssignedto: assignedto,
          description: description,
          taskStatus: status,
          taskStage: stage,
          taskSize: size,
          taskType: type,
          sprintStage: sprintStage,
          sprint: sprint,
          totalTimeLogged: totalTimeLogged,
          completionDate: completionDate,
        };
        const result = await collection.updateOne({ "id": id }, { $set: doc });
        console.log("Updated data:", doc);

        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Document not found" });
        }

        res.status(200).json({ message: "Document updated", result });
      } catch (error) {
        res.status(500).json({ message: "Error updating document", error });
      }
    });

    // Function to update sprint statuses based on the current date
    async function updateSprintStatuses() {
      try {
        const sprints = await sprintsCollection.find().toArray(); // Fetch all sprints
        const currentDate = moment().startOf("day"); // Get the current date at the start of the day

        let activeSprintFound = false;

        for (let sprint of sprints) {
          const startDate = moment(sprint.sprintStartDate).startOf("day");
          const endDate = moment(sprint.sprintEndDate).startOf("day");

          if (
            currentDate.isSameOrAfter(startDate) &&
            currentDate.isSameOrBefore(endDate)
          ) {
            if (!activeSprintFound) {
              sprint.status = "Active"; // Activate this sprint
              activeSprintFound = true;
            } else {
              sprint.status = "Not Started"; // Only one active sprint
            }
          } else if (currentDate.isAfter(endDate)) {
            sprint.status = "Completed";
          } else {
            sprint.status = "Not Started";
          }

          await sprintsCollection.updateOne(
            { _id: sprint._id },
            { $set: { status: sprint.status } }
          );
        }

        console.log("Sprint statuses updated");
      } catch (error) {
        console.error("Error updating sprint statuses:", error);
      }
    }

    // Schedule the updateSprintStatuses function to run daily at midnight
    cron.schedule("0 0 * * *", updateSprintStatuses);
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

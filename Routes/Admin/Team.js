import express, { request } from "express";
const router = express.Router();
import Teams from "../../Models/UsersModel/Teams.js";
import Permissions from "../../Models/Roles&Permission/Permissions.js";
import Roles from "../../Models/Roles&Permission/Roles.js";
import { handleServerError, handleNotFound } from "../../Middlewares/middle.js";

router.post("/addTeam", async (req, res) => {
  const newTeam = new Teams({
    name: req.body.name,
    heads: req.body.heads,
  });

  try {
    const savedTeam = await newTeam.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.put("/updateTeam/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updateTeam = await Teams.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          heads: req.body.heads,
        },
      },
      { new: true }
    );

    res.status(201).json(updateTeam);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.delete("/delTeam/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // const deleteTeam = Teams.findByIdAndDelete(id);
    // if (!deleteTeam) {
    //   handleNotFound(res, "Team not found");
    // }
    // res.status(201).json(deleteTeam);
    // Teams.findByIdAndDelete(id, (err, deletedTeam) => {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     res.status(201).json(deletedTeam);
    //   }
    // });
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post("/permission", async (req, res) => {
  const Permission = new Permissions({
    name: req.body.name,
  });

  try {
    const savedPermission = await Permission.save();
    res.status(201).json(savedPermission);
  } catch (error) {
    handleServerError(res, error);
  }
});

router.post("/role", async (req, res) => {
  const Role = new Roles({
    name: req.body.name,
    permissions: req.body.permissions,
  });

  try {
    const savedRole = await Role.save();
    res.status(201).json(savedRole);
  } catch (error) {
    handleServerError(res, error);
  }
});

export { router as teamRoutes };

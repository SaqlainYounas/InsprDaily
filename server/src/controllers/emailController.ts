import {Request, Response} from "express";
import {db} from "../lib/Db/prisma";
import dotenv from "dotenv";
dotenv.config();

export async function addEmailController(req: Request, res: Response) {
  try {
    const {email, timeZone} = req.body;
    if (!email) {
      return res.status(400).json({
        status: "Failed",
        message: "Email Required!", // Provide specific validation errors
      });
    }
    if (!timeZone) {
      return res.status(400).json({
        status: "Failed",
        message: "Please Provide Timezone!", // Provide specific validation errors
      });
    }

    // Check if the timezone exists in the Timezone table
    let existingTimezone = await db.timezone.findUnique({
      where: {value: timeZone.value},
    });

    // If the timezone doesn't exist, create it
    if (!existingTimezone) {
      existingTimezone = await db.timezone.create({
        data: {
          value: timeZone.value,
          label: timeZone.label,
          offset: timeZone.offset,
          abbrev: timeZone.abbrev,
        },
      });
    }

    // Now create the user with the provided email and associate it with the timezone
    const newUser = await db.user.create({
      data: {
        email,
        timeZone: {
          connect: {id: existingTimezone.id},
        },
      },
    });

    return res.status(200).json({
      status: 200,
      message: "User and Timezone created successfully!",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong, please try again.",
    });
  }
}

export async function removeEmailController(req: Request, res: Response) {
  try {
    const {id} = req.body;
    if (!id) {
      return res.status(400).json({
        status: "Failed",
        message: "Id Required!", // Provide specific validation errors
      });
    }

    const dbData = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!dbData) {
      return res.status(500).json({
        status: "Failed",
        message: "Data doesn't exist.", // Provide specific validation errors
      });
    }

    await db.user.delete({
      where: {
        id: dbData.id,
      },
    });
    res.status(200).json({
      status: 200,
      message: "Unsubscribe Successful",
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Something went wrong, please try again.",
    });
  }
}

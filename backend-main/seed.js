const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./db/connectDB");
const User = require("./models/user.model");
const Advertiser = require("./models/advertiser.model");
const Creator = require("./models/creator.model");
const Score = require("./models/score.model");
const Brief = require("./models/brief.model");
const Category = require("./models/category.model");

dotenv.config();

const CATEGORIES = ["Lifestyle", "Beauty", "Fashion", "Gaming", "Food", "Travel", "Tech", "Fitness"];

const upsertUser = async ({ email, password, username, roles, extra = {} }) => {
  const hashedPassword = await bcryptjs.hash(password, 10);
  let user = await User.findOne({ email }).select("+password");
  if (!user) {
    user = new User({
      email,
      password: hashedPassword,
      username,
      roles,
      isVerified: true,
      ...extra,
    });
  } else {
    user.password = hashedPassword;
    user.username = username;
    user.roles = roles;
    user.isVerified = true;
    Object.assign(user, extra);
  }
  await user.save();
  return user;
};

const seedData = async () => {
  for (const name of CATEGORIES) {
    await Category.updateOne({ name }, { name }, { upsert: true });
  }

  const admin = await upsertUser({
    email: "admin@colab.local",
    password: "Admin123!",
    username: "admin",
    roles: ["Admin"],
  });

  const brand = await upsertUser({
    email: "brand@colab.local",
    password: "Brand123!",
    username: "colabbrand",
    roles: ["Brand"],
    extra: { instaUsername: "colabbrand", tiktokUsername: "colabbrand" },
  });

  await Advertiser.findOneAndUpdate(
    { userId: brand._id },
    {
      $set: {
        userId: brand._id,
        companyName: "Colab Studio",
        website: "https://colab.local",
        address: "Tunis",
        industry: "Marketing",
      },
      $setOnInsert: { _id: brand._id },
    },
    { upsert: true }
  );

  const creatorUser = await upsertUser({
    email: "creator@colab.local",
    password: "Creator123!",
    username: "amira",
    roles: ["Influencer"],
    extra: {
      instaUsername: "amira.creates",
      tiktokUsername: "amira.creates",
      description: "Lifestyle and beauty creator based in Tunis.",
      categories: ["Lifestyle", "Beauty"],
    },
  });

  const score = await Score.findOneAndUpdate(
    { creator: creatorUser._id },
    {
      creator: creatorUser._id,
      quantitativeScore: 32,
      qualitativeScore: 46,
      totalScore: 78,
    },
    { upsert: true, new: true }
  );

  await Creator.findOneAndUpdate(
    { userId: creatorUser._id },
    {
      $set: {
        userId: creatorUser._id,
        socialLinks: { instagram: "amira.creates", tiktok: "amira.creates" },
        audience: { instafollowers: 18500, tiktokfollowers: 42000 },
        score: score._id,
        isVerified: true,
        isSuspended: false,
      },
      $setOnInsert: { _id: creatorUser._id },
    },
    { upsert: true }
  );

  const existingBrief = await Brief.findOne({ title: "Summer skincare launch" });
  if (!existingBrief) {
    await Brief.create({
      advertiserId: brand._id,
      title: "Summer skincare launch",
      description: "Create a short authentic video presenting the summer skincare routine.",
      categories: ["Beauty", "Lifestyle"],
      phrases: ["glow", "routine"],
      tags: ["ugc", "skincare"],
      budget: 450,
      targetPlatform: "Instagram",
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      reviewDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      validationStatus: "accepted",
      status: "no influencer assigned",
    });
  }

  console.log("Seed complete.");
  console.log("Admin   admin@colab.local / Admin123!");
  console.log("Brand   brand@colab.local / Brand123!");
  console.log("Creator creator@colab.local / Creator123!");
};

const seed = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
};

if (require.main === module) {
  seed().catch(async (error) => {
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  });
}

module.exports = { seedData };

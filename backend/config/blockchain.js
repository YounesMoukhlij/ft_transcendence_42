import { ethers } from "ethers";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Compute __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to ABI JSON
const abiPath = path.join(__dirname, "TournamentScores.json");

// Read ABI
const contractJson = JSON.parse(fs.readFileSync(abiPath, "utf8"));

// Provider
export const provider = new ethers.JsonRpcProvider(
  "https://api.avax-test.network/ext/bc/C/rpc"
);

// Wallet
export const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract address
export const contractAddress = process.env.CONTRACT_ADDRESS;

// Contract ABI
export const contractAbi = contractJson.abi;

// Contract instance
export const contract = new ethers.Contract(
  contractAddress,
  contractAbi,
  wallet
);

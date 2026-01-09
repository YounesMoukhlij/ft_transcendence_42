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

// Wallet - only initialize if PRIVATE_KEY is available
export const wallet = process.env.PRIVATE_KEY ? new ethers.Wallet(process.env.PRIVATE_KEY, provider) : null;

// Contract address
export const contractAddress = process.env.CONTRACT_ADDRESS;

// Contract ABI
export const contractAbi = contractJson.abi;

// Contract instance - only initialize if wallet and contract address are available
export const contract = (wallet && contractAddress) ? new ethers.Contract(
  contractAddress,
  contractAbi,
  wallet
) : null;

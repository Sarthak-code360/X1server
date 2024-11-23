import express, { Request, Response } from "express";
import * as Auth from "./auth";
const { hashSerialNumber, verifySignature, authenticateDevice } = Auth;



const app = express();
app.use(express.json());

app.post("/auth", async (req: Request, res: Response): Promise<void> => {
    console.log("Received POST request from Arduino on /auth");

    const { signature } = req.body;
    if (!signature) {
        console.error("No signature received!");
        res.status(400).json({ error: "Signature is required" });
        return;
    }

    console.log("Signature received as Signature1 =", signature);

    const isValid = await authenticateDevice(signature);

    if (isValid) {
        console.log("Successfully verified!");
        res.status(200).json({ message: "Signature verified successfully!" });
    } else {
        console.log("Verification failed!");
        res.status(400).json({ message: "Signature verification failed!" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

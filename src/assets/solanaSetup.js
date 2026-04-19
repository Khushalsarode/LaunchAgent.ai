import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    Transaction,
    TransactionInstruction,
    PublicKey,
    sendAndConfirmTransaction
} from "@solana/web3.js";
import CryptoJS from "crypto-js";


export async function initializeProjectIdentity() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const myProjectKeypair = Keypair.generate();

    // REMOVED the automatic .requestAirdrop here.
    // This prevents the 429 error on page load.

    return { connection, myProjectKeypair };
}

// CRITICAL: Added 'export' here to fix your SyntaxError
export async function createDynamicProof(connection, keypair, projectData) {
    const dataString = typeof projectData === 'string'
        ? projectData
        : JSON.stringify(projectData);

    const fingerprint = CryptoJS.SHA256(dataString).toString();
    const memoProgramId = new PublicKey("MemoSq4gqABmAn9NoSpxSdm3e9nwEykLx1vPaPVm7pS");

    const transaction = new Transaction().add(
        new TransactionInstruction({
            keys: [{ pubkey: keypair.publicKey, isSigner: true, isWritable: true }],
            programId: memoProgramId,
            data: Buffer.from(fingerprint, "utf-8"),
        })
    );

    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
        return {
            success: true,
            fingerprint,
            signature,
            explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
        };
    } catch (error) {
        console.error("Forge failed:", error);
        return { success: false, error };
    }
}

// Added for the "Verify" feature
export function verifyLocalData(currentData, existingFingerprint) {
    // Stringify only the fields passed (which should exclude timestamp)
    const dataString = typeof currentData === 'string'
        ? currentData
        : JSON.stringify(currentData);

    const localHash = CryptoJS.SHA256(dataString).toString();

    return {
        isValid: localHash === existingFingerprint,
        localHash: localHash
    };
}


export async function getBalance(connection, publicKey) {
    try {
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
    } catch (e) {
        return 0;
    }
}



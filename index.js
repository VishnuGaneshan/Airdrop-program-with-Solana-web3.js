const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account,
   } = require("@solana/web3.js");

const newPair = new Keypair();

const publicKey = new PublicKey(newPair._keypair.publicKey).toString(); // public key
const secretKey = newPair._keypair.secretKey // secret key


// get balance information
const getWalletBalance = async () => {
    try {
        // connecting to devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        
        // creating wallet object from secret
        const myWallet = await Keypair.fromSecretKey(secretKey);
        
        // querying balance for above created wallet object 
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );

        // printing account details 
        console.log(`=> For wallet address ${publicKey}`);
        console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
    } catch (err) {
        console.log(err);
    }
};


// Airdrop function
const airDropSol = async () => {
    try {
        // connecting to devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // creating wallet object from secret
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);
        
        console.log(`-- Airdropping 2 SOL --`)
        
        // requesting for Airdrop 
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey), // for Airdrop signature
            2 * LAMPORTS_PER_SOL // amount of SOL requesting
        );

        // waiting for transaction to be completed
        await connection.confirmTransaction(fromAirDropSignature);
    } catch (err) {
        console.log(err);
    }
};


//  driver function
const driverFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}
driverFunction();
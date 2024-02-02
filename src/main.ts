import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { userKeypair } from "./helpers";
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createFungible } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner } from "@metaplex-foundation/umi";

const umi = createUmi('https://api.devnet.solana.com');

const keypair = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);

umi.use(keypairIdentity(keypair))
    .use(mplTokenMetadata());

const metadata = {
    name: "Solana Inaam",
    symbol: "INMSOL",
    uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};
const mint = generateSigner(umi);

createFungible(umi, {
    mint,
    authority: umi.identity,
    name: metadata.name,
    symbol: metadata.symbol,
    uri: metadata.uri,
    sellerFeeBasisPoints: percentAmount(0),
    decimals: 9,
}).sendAndConfirm(umi)
.then((result) => {
    // Assuming the result object contains the transaction signature
    const transactionSignature = result.signature;
    console.log(`Token created successfully.`);
    console.log(`Transaction signature: ${transactionSignature}`);
    console.log('Transaction details:', result); // Log the entire result object for more details
})
.catch((error) => {
    console.error(`Failed to create token: ${error}`);
});

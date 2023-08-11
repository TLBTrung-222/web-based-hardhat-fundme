import { ethers, providers } from "./ethers-5.2.esm.min.js";
import { contractAddress, abi } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
    console.log("Hello from script tag");
    if (typeof window.ethereum !== "undefined") {
        console.log("Metamask wallet detected");
        await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        connectButton.innerHTML = "Connected!!!";
    } else {
        connectButton.innerHTML = "Please install Metamask!!!";
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with ${ethAmount}`);
    //* To make a transaction, we need the following:

    //* provider
    // This line of code just get the HTTP endpoint inside metamask and return a connection to that node
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //* Signer
    // This code get the current account which is connecting to Metamask
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
        const transactionResponse = await contract.fund({
            value: ethers.utils.parseEther(ethAmount),
        });
        await listenForTransactionMined(transactionResponse, provider);
        console.log("Done");
    } catch (error) {
        console.log(error);
    }
}

async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "Undefined") {
        //* Create an instance of FundMe contract
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        //* Make a withdraw transaction
        try {
            const transactionResponse = await contract.withdraw();
            await listenForTransactionMined(transactionResponse, provider);
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTransactionMined(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`
            );
        });
        resolve();
    });
}

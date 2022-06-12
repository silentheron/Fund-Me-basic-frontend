import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.querySelector("#connect");
const fundButton = document.querySelector("#fund");
const balanceButton = document.querySelector("#balanceButton");
const withdrawButton = document.querySelector("#withdrawButton");

console.log(ethers);
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected";
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    // provider / connection to the blockchain
    // signer / wallet / someone with some gas
    // contract that we are interacting with
    // also need ABI & Address of contract
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReciept) => {
      console.log(
        `Completed ${transactionReciept.confirmations} confirmations`
      );
      resolve();
    });
  });

  // create a listener for the blockchain
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();
      await listenForTransactionMine(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}

connectButton.addEventListener("click", connect);
fundButton.addEventListener("click", fund);
balanceButton.addEventListener("click", getBalance);
withdrawButton.addEventListener("click", withdraw);

// fund function

// withdraw

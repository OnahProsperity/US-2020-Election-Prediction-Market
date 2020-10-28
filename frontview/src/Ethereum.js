import {ethers, Contract} from 'ethers';
import PredictionMarket from './contracts/PredictionMarket.json'

const getBlockchain = () =>
	new Promise((resolve, reject) => {
		//add an event listener
		window.addEventListener('load', async () => {
			//test if metamask is injected to the web-browser
			if (window.ethereum) {
				//A verification from user
				await window.ethereum.enable();
				const provider = new ethers.providers.Web3Provider(window.ethereum);
				//get the signer object
				const signer = provider.getSigner();
				//get signer address
				const signerAddress = await signer.getAddress();

				//to intantiate an ether object
				const predictionMarket = new Contract(
						PredictionMarket.networks[window.ethereum.networkVersion].address,
						PredictionMarket.abi,
						signer
					);
				resolve({signerAddress, predictionMarket});
			}
		});
	})


export default getBlockchain;
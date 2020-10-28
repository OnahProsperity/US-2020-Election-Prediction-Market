const PredictionMarket = artifacts.require("PredictionMarket");

//cause we need to specify the object when we play bet
const SIDE = {
	Biden: 0,
	Trump: 1
};

module.exports = async function (deployer, network, addresses) {

	const [admin, Oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

  	await deployer.deploy(PredictionMarket, Oracle);
  	const predictionMarket = await PredictionMarket.deployed();

  	//let play some bet.
		//Note: this bet accept two argument. 1. the person you are voting and 2. the amount of ether
		await predictionMarket.placeBet(
				SIDE.Biden,
				{from: gambler1, value: web3.utils.toWei('1')}
			)
		await predictionMarket.placeBet(
				SIDE.Biden,
				{from: gambler2, value: web3.utils.toWei('1')}
			)
		await predictionMarket.placeBet(
				SIDE.Biden,
				{from: gambler3, value: web3.utils.toWei('2')}
			)
		await predictionMarket.placeBet(
				SIDE.Trump,
				{from: gambler4, value: web3.utils.toWei('1')}
			)


};

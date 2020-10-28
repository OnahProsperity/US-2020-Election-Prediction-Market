//importing contract artifact
const PredictionMarket = artifacts.require('PredictionMarket.sol');

//cause we need to specify the object when we play bet
const SIDE = {
	Biden: 0,
	Trump: 1
};
contract('PredictionMarket', addresses => {

	//Extracting a couple of address that will will be used from addresses in testing process.
	const [admin, Oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;

	//Deploying Prediction market
	it('Deploy Successfully', async () => {
		//Oracle is the address that we are using in the deployment 
		const predictionMarket = await PredictionMarket.new(Oracle);

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
				{from: gambler4, value: web3.utils.toWei('4')}
			)
		//Oracle to report the Result
		await predictionMarket.bettingResult(
				SIDE.Biden,
				SIDE.Trump,
				{from: Oracle}
			);

		//verification that the winner win there ether and the loser lost is
		const balanceBefore = ( await Promise.all(
			[gambler1, gambler2, gambler3, gambler4].map(gambler =>(
				web3.eth.getBalance(gambler)
			))
		))
		.map(balance => web3.utils.toBN(balance)); //convertion to bigNumber

		//withdrawals for gamblers that won
		await Promise.all(
				[gambler1, gambler2, gambler3].map(gambler => (
					predictionMarket.withdrawal({from: gambler})
				))
			);

		//verification that the winner win there ether and the loser lost is
		const balanceafter = ( await Promise.all(
			[gambler1, gambler2, gambler3, gambler4].map(gambler =>(
				web3.eth.getBalance(gambler)
			))
		))
		.map(balance => web3.utils.toBN(balance)); //convertion to bigNumber

		//assert that the loser lost and the winner win
		assert(balanceafter[0].sub(balanceBefore[0]).toString().slice(0, 3) === ('199'));
		assert(balanceafter[1].sub(balanceBefore[1]).toString().slice(0, 3) === ('199'));
		assert(balanceafter[2].sub(balanceBefore[2]).toString().slice(0, 3) === ('399'));
		assert(balanceafter[3].sub(balanceBefore[3]).isZero());
	});
})
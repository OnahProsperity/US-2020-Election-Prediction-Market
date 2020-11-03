import React, { useState, useEffect } from 'react';
import getBlockchain from './Ethereum.js';
import { Pie } from 'react-chartjs-2';

const SIDE = {
  BIDEN: 0,
  TRUMP: 1
};

function App() {

  // const [web3, setWeb3] = useState(undefined);
  const [predictionMarket, setPredictionMarket] = useState(undefined);
  const [betPredictions, setBetPredictions] = useState(undefined);
  const [myBets, setMyBets] = useState(undefined);

 useEffect(() => {
    const init = async () => {
      const { signerAddress, predictionMarket } = await getBlockchain();
      const bets = await Promise.all([
        predictionMarket.bets(SIDE.BIDEN),
        predictionMarket.bets(SIDE.TRUMP)

      ]);
      const betPredictions = {
        labels: [
          'Trump',
          'Biden',
        ],
        datasets: [{
          data: [bets[1].toString(), bets[0].toString()],
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
          ],
          hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
          ]
        }]
      };
      const myBets = await Promise.all([
        predictionMarket.betsPerGambler(signerAddress, SIDE.BIDEN),
        predictionMarket.betsPerGambler(signerAddress, SIDE.TRUMP),
      ]);
      setMyBets(myBets);
      //console.log(myBets[0].toString());
      setBetPredictions(betPredictions);
      setPredictionMarket(predictionMarket);
    };
    init();
  }, []);

  if(
    typeof predictionMarket === 'undefined'
    || typeof betPredictions === 'undefined'
    || typeof myBets === 'undefined'
  ) {
    return 'Loading... Connecting to your wallet. Kindly install Metamask for your browser';
  }

  const placeBet = async (side, e) => {
    e.preventDefault();
    await predictionMarket.placeBet(
      side, 
      {value: e.target.elements[0].value}
    );
  };

  const withdrawGain = async () => {
    await predictionMarket.withdrawal();
  };

  return (
    <div className='container'>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://quickfindprosperity.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
        <img src='./img/favicon.png' width="45" height="45" className="d-inline-block align-top" alt="" />
        &nbsp; USA Prediction Market
        </a>          
      </nav>
      <div className='row'>
        <div className='col-sm-12'>
          <div className="jumbotron">
            <h1 className="display-4 text-center">Who will win the US Presidential election?</h1>
            <p className="lead text-center">Current Odds</p>
            <div>
               <Pie data={betPredictions} />
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-sm-6'>
          <div className="card">
            <img src='./img/TRUMP.png' roundedCircle alt="" />
            <div className="card-body">
              <h5 className="card-title">Trump</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.TRUMP, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (wei)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className='col-sm-6'>
          <div className="card">
            <img src='./img/BIDEN.png' roundedCircle alt="" />
            <div className="card-body">
              <h5 className="card-title">Biden</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.BIDEN, e)}>
                <input 
                    type="text" 
                    className="form-control mb-2 mr-sm-2" 
                    placeholder="Bet amount (wei)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      

      <div className='row'>
        <h2>Your bets</h2>
        <ul>
          <li>Biden: {myBets[0].toString()} ETH (wei)</li>
          <li>Trump: {myBets[1].toString()} ETH (wei)</li>
        </ul>
      </div>

      <div className='row'>
        <h2>Claim your gains, if any, after the election</h2>
        <button 
          type="submit" 
          className="btn btn-primary mb-2"
          onClick={e => withdrawGain()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
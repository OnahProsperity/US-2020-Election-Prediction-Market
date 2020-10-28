pragma solidity ^0.7.3;

/**
 * The PredictionMarket contract does this and that...
 */
contract PredictionMarket {

  address public Oracle;
  enum Side { Biden, Trump }
  struct Result {
    Side winner;
    Side loser;
  }

// an instance of the struct
  Result public result;
  
  bool public electionFinished;

  //mapping of the Side of the Electorate
  mapping (Side => uint) public bets;

  //mapping of each gambler to the nexted mapping of the Side and the amount placed
  mapping (address => mapping (Side => uint)) public betsPerGambler;

  constructor(address _oracle) {
    Oracle = _oracle;
  }

 function placeBet (Side _side) public payable {

  //require that the time for voting is still ongoing
   require (electionFinished == false, 'Time to vote is Over');

   //increamentng the bet by the amount that was placed
   bets[_side] += msg.value;

   //increamenting the amount that have been spent on the bet
   betsPerGambler[msg.sender][_side] += msg.value;
 }

 function withdrawal() public {
  
    //require that election must end before anyone will be able to withdraw
    require (electionFinished == true, 'Voting is still on going...');

    //referencing the gambler address in the winners of the election..
    uint gamblerBet = betsPerGambler[msg.sender][result.winner];

    //require that the gambler must place a bet greater than zero
    require (gamblerBet > 0, 'You did not have any winning bet...');

    //calculating the gain of the gambler
    uint gain = gamblerBet + bets[result.loser] * gamblerBet / bets[result.winner];

    // To update the bet per gamble so as to withdraw all the winning price, to avoid multiple withdrawal
    betsPerGambler[msg.sender][Side.Biden] = 0;
    betsPerGambler[msg.sender][Side.Trump] = 0;

    //To transfer the winning Gain
    msg.sender.transfer(gain);
  }

 function bettingResult(Side _winner, Side  _loser) public{
  //Require only the deployer should have access to this..
  require (msg.sender == Oracle, 'Only the Deployer have access to this');

  //Require that the ELection must be over before the deployer can terminate it..
  require (electionFinished == false, 'Voting is still on going...');

  //Updating the winner, the loser and election must end first...
  result.winner = _winner;
  result.loser = _loser;
  electionFinished = true;
 }
}

import React, { Component } from "react";
import tokenLogo from "../images/GoldCoin.png";
import usdcLogo from "../images/usdcLogo.png";

//{window.web3.utils.fromWei(this.props.ethBalance, "Ether")}
//on the balance

class BuyForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      output: "0",
    };
  }

  render() {
    return (
      <form
        className="mb-3"
        onSubmit={(event) => {
          event.preventDefault();
          let etherAmount;
          etherAmount = this.input.value.toString();
          etherAmount = window.web3.utils.toWei(etherAmount, "Ether");
          this.props.buyTokens(etherAmount);
        }}
      >
        <div>
          <label className="float-left">
            <b>From</b>
          </label>
          <span className="float-right text-muted">
            Balance:{" "}
            {window.web3.utils.fromWei(this.props.usdcBalance, "Ether")}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString();
              this.setState({
                output: etherAmount * 100,
              });
            }}
            ref={(input) => {
              this.input = input;
            }}
            className="form-control form-control-lg"
            placeholder="0"
            required
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={usdcLogo} height="32" alt="" />
              &nbsp;&nbsp;&nbsp; USDC
            </div>
          </div>
        </div>
        <div>
          <label className="float-left">
            <b>To (Estimated)</b>
          </label>
          <span className="float-right text-muted">
            Balance:{" "}
            {window.web3.utils.fromWei(this.props.tokenBalance, "Ether")}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height="32" alt="" />
              &nbsp; PDG
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted">Exchange Rate</span>
          <span className="float-right text-muted">1 USDC = 100 PDG</span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          SWAP!
        </button>
      </form>
    );
  }
}

export default BuyForm;

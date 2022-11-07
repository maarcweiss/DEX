import React, { Component } from "react";
import Web3 from "web3";
import Token from "../abis/Token.json";
import USDC from "../abis/USDC.json";
import EthSwap from "../abis/EthSwap.json";
import Navbar from "./Navbar";
import Main from "./Main";
import "./App.css";
import Curve from "../images/curve.png";
import background from "../images/SuttersMill.png";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    //   var web3 = new Web3(new Web3.providers.HttpProvider(
    //     'https://ropsten.infura.io/v3/[infura_project_id]'
    // ));

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();
    const usdcData = Token.networks[networkId];
    if (usdcData) {
      const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      const usdc = new web3.eth.Contract(USDC.abi, usdcAddress);
      this.setState({ usdc });
      let usdcBalance = await usdc.methods.balanceOf(this.state.account).call();
      this.setState({ usdcBalance: usdcBalance.toString() });
    }

    const ethBalance = await web3.eth.getBalance(this.state.account);
    this.setState({ ethBalance });

    const tokenData = Token.networks[networkId];
    // Load Token
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address);
      this.setState({ token });
      let tokenBalance = await token.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ tokenBalance: tokenBalance.toString() });
    } else {
      window.alert("Token contract not deployed to detected network.");
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId];
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address);
      this.setState({ ethSwap });
    } else {
      window.alert("EthSwap contract not deployed to detected network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true });
    this.state.ethSwap.methods
      .buyTokens()
      .send({ value: etherAmount, from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });
    this.state.token.methods
      .approve(this.state.ethSwap.address, tokenAmount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.ethSwap.methods
          .sellTokens(tokenAmount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      token: {},
      ethSwap: {},
      //take out eth and keep usdc
      ethBalance: "0",
      usdcBalance: "0",
      tokenBalance: "0",
      loading: true,
    };
  }

  render() {
    //   const myStyle = {
    //     background: "url(../images/SuttersMill.png)";
    //   background-size: cover;
    //     //backgroundImage: background,
    //     height: "100vh",
    //     marginTop: "-70px",
    //     fontSize: "20px",
    //     backgroundSize: "cover",
    //     backgroundRepeat: "no-repeat",
    //   };
    //   .Login-component {
    // }
    const styles = {
      backgroundImage: `url(${background})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      width: "100vw",
      height: "100vh",
    };
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      content = (
        <>
          <Main
            //this are the props from the main component
            ethBalance={this.state.ethBalance}
            usdcBalance={this.state.usdcBalance}
            tokenBalance={this.state.tokenBalance}
            buyTokens={this.buyTokens}
            sellTokens={this.sellTokens}
          />
          <img src={Curve} height="380" alt="" style={{ float: "left" }} />
        </>
      );
    }

    return (
      <div style={styles}>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

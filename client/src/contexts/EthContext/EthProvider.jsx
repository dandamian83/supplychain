import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(
    async itemManagerArtifact => {
      if (itemManagerArtifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:9545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi: abiItemManagerContract } = itemManagerArtifact;
        
        let addressItemManagerContract, itemManagerContract;
        try {
          addressItemManagerContract = itemManagerArtifact.networks[networkID].address;
          itemManagerContract = new web3.eth.Contract(abiItemManagerContract, addressItemManagerContract);
          itemManagerContract.events.SupplyChainStep().on("data", async e => {
            console.log("event", JSON.stringify(e))
          })
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { itemManagerArtifact, web3, accounts, networkID, itemManagerContract }
        });
      }
    }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const itemManagerArtifact = require("../../contracts/ItemManager.json");
        init(itemManagerArtifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;

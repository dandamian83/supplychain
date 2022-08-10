import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";


function SupplyChain() {
  const { state } = useEth();
  const {itemManagerContract, accounts } = state;
  const [itemPrice, setItemPrice] = useState("0");
  const [itemName, setItemName] = useState("");
  
  const handleItemPriceChange = e => {
    setItemPrice(parseInt(e.target.value));
  }

  const handleItemNameChange = e => {
    setItemName(e.target.value);
  }

  const handleAddItem = async () => {
    let results = await itemManagerContract.methods.createItem(itemName, itemPrice).send({from: accounts[0]})
    alert(`Send ${itemPrice} wei to ${results.events.SupplyChainStep.returnValues._address}.`);
    setItemName("");
    setItemPrice(0);
  }

  const supplyChainInAction =
    <>
      <div>
        <div>
          <h3>Items</h3>
        </div>
        <div style={{marginTop: "2em"}}>
          <h3>Add Item</h3>
          <div style={{marginTop: "1em"}}>
            Item name <input type="text" value={itemName} onChange={handleItemNameChange}/>
          </div>
          <div style={{marginTop: "1.4em"}}>
            Cost (wei) <input type="text" value={itemPrice} onChange={handleItemPriceChange}/>
          </div>
          <div style={{marginTop: "1em"}}>
            <input type="button" value=" Add " onClick={handleAddItem}/>
          </div>
        </div>
      </div>
    </>;

  return (
    <div className="demo">
      {
        !state.itemManagerArtifact ? <NoticeNoArtifact /> :
          !state.itemManagerContract ? <NoticeWrongNetwork /> :
          supplyChainInAction
      }
    </div>
  );
}

export default SupplyChain;

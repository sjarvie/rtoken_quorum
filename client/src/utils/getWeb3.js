import Web3 from "web3";
 
function getWeb3 (port) {
  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    // window.addEventListener("load", async () => {
    //   // Modern dapp browsers...
    //   if (window.ethereum) {
    //     const web3 = new Web3(window.ethereum);
    //     try {
    //       // Request account access if needed
    //       await window.ethereum.enable();
    //       // Acccounts now exposed
    //       resolve(web3);
    //     } catch (error) {
    //       reject(error);
    //     }
    //   }
      // Fallback to localhost; use dev console port by default...
      // else {
       // console.log("http://localhost"+ port)
       console.log(port)
        const provider = new Web3.providers.HttpProvider(
          "http://localhost:"+port
        );
        const web3 = new Web3(provider);
        resolve(web3);
      //}
  //  });
  })
}


export default getWeb3